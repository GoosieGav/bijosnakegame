import { createHash, timingSafeEqual } from 'node:crypto';

const TABLE = 'bjsnake_control';
const PLAYERS = 'bjsnake_players';

const GAME_DEFAULTS = {
  paused: false,
  start_blocked: false,
  message: '',
  move_delay: 180,
  spawn_delay: 2000,
  spawn_chance: 0.8,
  question_chance: 0,
  weird_chance: 0.1,
  eyes_up: false,
};

const BOOLEAN_FIELDS = ['paused', 'start_blocked', 'waiting_screen', 'eyes_up', 'show_leaderboard'];

const NUMBER_LIMITS = {
  move_delay: [60, 600, 'int'],
  spawn_delay: [250, 20000, 'int'],
  spawn_chance: [0, 1, 'float'],
  question_chance: [0, 1, 'float'],
  weird_chance: [0, 1, 'float'],
  slide: [0, 500, 'int'],
  step: [0, 50, 'int'],
};

const MAX_MESSAGE_LENGTH = 200;
const MAX_TIMER_SECONDS = 3600;

function passwordMatches(given) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof given !== 'string') return false;
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

function sanitizeChanges(changes) {
  if (!changes || typeof changes !== 'object') return null;
  const clean = {};

  for (const key of BOOLEAN_FIELDS) {
    if (key in changes) {
      if (typeof changes[key] !== 'boolean') return null;
      clean[key] = changes[key];
    }
  }

  if ('message' in changes) {
    if (typeof changes.message !== 'string') return null;
    clean.message = changes.message.trim().slice(0, MAX_MESSAGE_LENGTH);
  }

  for (const [key, [min, max, kind]] of Object.entries(NUMBER_LIMITS)) {
    if (key in changes) {
      const value = Number(changes[key]);
      if (!Number.isFinite(value)) return null;
      const clamped = Math.min(max, Math.max(min, value));
      clean[key] = kind === 'int' ? Math.round(clamped) : clamped;
    }
  }

  return Object.keys(clean).length ? clean : null;
}

function supabase(path, { method = 'GET', body, prefer } = {}) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('Server is missing SUPABASE_URL or SUPABASE_SECRET_KEY');

  const headers = { apikey: key, 'Content-Type': 'application/json' };
  if (!key.startsWith('sb_')) headers.Authorization = `Bearer ${key}`;
  if (prefer) headers.Prefer = prefer;

  return fetch(`${url}/rest/v1/${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  }).then(async response => {
    if (!response.ok) {
      throw new Error(`Supabase request failed (${response.status}): ${await response.text()}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  });
}

async function updateControl(changes) {
  const rows = await supabase(`${TABLE}?id=eq.1`, {
    method: 'PATCH',
    body: { ...changes, updated_at: new Date().toISOString() },
    prefer: 'return=representation',
  });
  return rows[0];
}

async function readControl() {
  const rows = await supabase(`${TABLE}?id=eq.1&select=*`);
  return rows[0];
}

function timerChanges(seconds) {
  const s = Math.round(Number(seconds));
  if (!Number.isFinite(s) || s <= 0) return { timer_end: null, timer_total: 0 };
  const total = Math.min(s, MAX_TIMER_SECONDS);
  return { timer_end: new Date(Date.now() + total * 1000).toISOString(), timer_total: total };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  if (!passwordMatches(body.password)) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return res.status(401).json({ error: 'Wrong password' });
  }

  try {
    switch (body.action) {
      case 'verify':
        return res.status(200).json({ ok: true });

      case 'update': {
        const changes = sanitizeChanges(body.changes);
        if (!changes) return res.status(400).json({ error: 'Invalid changes' });
        return res.status(200).json({ ok: true, control: await updateControl(changes) });
      }

      case 'end_all':
        return res.status(200).json({
          ok: true,
          control: await updateControl({ end_all_at: new Date().toISOString() }),
        });

      case 'reset':
        return res.status(200).json({ ok: true, control: await updateControl(GAME_DEFAULTS) });

      case 'timer':
        return res.status(200).json({ ok: true, control: await updateControl(timerChanges(body.seconds)) });

      case 'timer_add': {
        const current = await readControl();
        const end = current.timer_end ? Date.parse(current.timer_end) : 0;
        const remaining = Math.max(0, Math.round((end - Date.now()) / 1000));
        const add = Math.round(Number(body.seconds) || 0);
        const changes = timerChanges(remaining + add);
        if (changes.timer_end) changes.timer_total = Math.max(current.timer_total || 0, changes.timer_total);
        return res.status(200).json({ ok: true, control: await updateControl(changes) });
      }

      case 'roster': {
        const players = await supabase(
          `${PLAYERS}?select=name,status,best,q_asked,q_correct,q_wrong,q_weird,exp_spawned,exp_ms,last_seen&order=name.asc`,
        );
        return res.status(200).json({ ok: true, players, now: new Date().toISOString() });
      }

      case 'clear_data':
        await supabase(`${PLAYERS}?id=not.is.null`, { method: 'DELETE' });
        return res.status(200).json({
          ok: true,
          control: await updateControl({ data_epoch: Date.now(), end_all_at: new Date().toISOString() }),
        });

      case 'full_reset':
        await supabase(`${PLAYERS}?id=not.is.null`, { method: 'DELETE' });
        return res.status(200).json({
          ok: true,
          control: await updateControl({
            ...GAME_DEFAULTS,
            waiting_screen: true,
            show_leaderboard: true,
            slide: 0,
            step: 0,
            timer_end: null,
            timer_total: 0,
            data_epoch: Date.now(),
            end_all_at: new Date().toISOString(),
          }),
        });

      default:
        return res.status(400).json({ error: 'Unknown action' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
