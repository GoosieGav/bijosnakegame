(() => {
  const cfg = window.BJSNAKE_CONFIG;
  const DECK = BJ.DECK;
  const $ = id => document.getElementById(id);
  let password = sessionStorage.getItem('bjsnake-admin') || '';

  let control = null;
  let nav = { slide: 0, step: 0 };
  let navSending = false;
  let navDirty = false;
  let lastNavAt = 0;
  let summary = {};
  let results = {};
  let roster = [];
  let rosterNow = Date.now();
  let clockOffset = 0;
  let sb = null;

  const steps = i => BJ.slideSteps(DECK[i]);
  const minutesBefore = DECK.reduce((acc, s, i) => {
    acc.push(i ? acc[i - 1] + DECK[i - 1].minutes : 0);
    return acc;
  }, []);
  const totalMinutes = minutesBefore[DECK.length - 1] + DECK[DECK.length - 1].minutes;
  const mmss = seconds => {
    const s = Math.max(0, Math.round(seconds));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  let toastTimer;
  function toast(msg, bad = false) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.toggle('bad', bad);
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  async function api(action, extra = {}) {
    const res = await fetch('/api/control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, action, ...extra }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      logout();
      throw new Error('Wrong password');
    }
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  }

  function mergeServer(row) {
    if (!row) return;
    if (control?.updated_at && row.updated_at && Date.parse(row.updated_at) < Date.parse(control.updated_at)) return;
    const keepNav = navSending || Date.now() - lastNavAt < 1500;
    control = { ...row };
    if (keepNav) {
      control.slide = nav.slide;
      control.step = nav.step;
    } else {
      nav = { slide: row.slide, step: row.step };
    }
    renderAll();
  }

  async function update(changes, okMsg) {
    control = { ...control, ...changes };
    renderAll();
    try {
      const data = await api('update', { changes });
      mergeServer(data.control);
      if (okMsg) toast(okMsg);
    } catch (err) {
      toast(err.message, true);
      fetchControl();
    }
  }

  async function action(name, extra, okMsg) {
    try {
      const data = await api(name, extra);
      mergeServer(data.control);
      if (okMsg) toast(okMsg);
      return data;
    } catch (err) {
      toast(err.message, true);
      return null;
    }
  }

  // Slide navigation. Presses update locally right away and the newest
  // target is always the one sent, so fast clicking never falls behind.

  function go(slide, step) {
    if (!control) return;
    slide = Math.max(0, Math.min(DECK.length - 1, slide));
    step = Math.max(0, Math.min(steps(slide), step));
    nav = { slide, step };
    lastNavAt = Date.now();
    control = { ...control, slide, step };
    renderAll();
    sendNav();
  }

  async function sendNav() {
    navDirty = true;
    if (navSending) return;
    navSending = true;
    while (navDirty) {
      navDirty = false;
      const target = { ...nav };
      try {
        const data = await api('update', { changes: target });
        if (!navDirty && data.control) {
          control = { ...data.control, slide: nav.slide, step: nav.step };
        }
      } catch (err) {
        toast(err.message, true);
      }
    }
    navSending = false;
    lastNavAt = Date.now();
  }

  function next() {
    const { slide, step } = nav;
    if (step < steps(slide)) go(slide, step + 1);
    else if (slide < DECK.length - 1) go(slide + 1, 0);
  }

  function prev() {
    const { slide, step } = nav;
    if (step > 0) go(slide, step - 1);
    else if (slide > 0) go(slide - 1, steps(slide - 1));
  }

  // Rendering

  const KIND = { game: ['game', 'Game'], poll: ['poll', 'Poll'], multipoll: ['poll', 'Poll'], question: ['talk', 'Talk'] };

  function buildSlideList() {
    const list = $('slide-list');
    let section = null;
    DECK.forEach((slide, i) => {
      if (slide.section !== section) {
        section = slide.section;
        const h = document.createElement('div');
        h.className = 'sec';
        h.textContent = BJ.SECTIONS[section];
        list.appendChild(h);
      }
      const b = document.createElement('button');
      b.className = 'sl';
      b.dataset.i = i;
      const kind = KIND[slide.type];
      const title = (BJ.slideLabel(slide) || '').replace(/_/g, '');
      b.innerHTML = `<span class="sl-n">${i + 1}</span><span class="sl-t"></span><span class="sl-m">${mmss(minutesBefore[i] * 60)}</span>`;
      b.querySelector('.sl-t').textContent = title;
      if (kind) {
        const tag = document.createElement('span');
        tag.className = `sl-kind sl-kind--${kind[0]}`;
        tag.textContent = kind[1];
        b.querySelector('.sl-t').appendChild(tag);
      }
      b.title = title;
      b.addEventListener('click', () => go(i, 0));
      list.appendChild(b);
    });
  }

  const sliders = {
    question_chance: v => (v === 0 ? 'Off' : `${Math.round(v * 100)}% of pickups`),
    weird_chance: v => `${Math.round(v * 100)}% of questions`,
    move_delay: v => `${v} ms per tile`,
    spawn_delay: v => `${(v / 1000).toFixed(2).replace(/\.?0+$/, '')} s`,
    spawn_chance: v => `${Math.round(v * 100)}%`,
  };

  let lastListIndex = -1;

  function renderAll() {
    if (!control) return;
    const i = nav.slide;
    const slide = DECK[i];
    const total = steps(i);

    document.querySelectorAll('.sl').forEach(b => {
      const n = Number(b.dataset.i);
      b.classList.toggle('is-current', n === i);
      b.classList.toggle('is-done', n < i);
    });
    if (lastListIndex !== i) {
      lastListIndex = i;
      document.querySelector('.sl.is-current')?.scrollIntoView({ block: 'nearest' });
    }

    $('where-title').textContent = `${i + 1}. ${(BJ.slideLabel(slide) || '').replace(/_/g, '')}`;
    $('where-sub').textContent = total
      ? `Step ${nav.step} of ${total}  ·  ${BJ.SECTIONS[slide.section]}`
      : BJ.SECTIONS[slide.section];
    const dots = $('steps');
    dots.replaceChildren();
    if (total) {
      for (let s = 0; s <= total; s++) {
        const d = document.createElement('button');
        d.className = s <= nav.step ? 'on' : '';
        d.title = s === 0 ? 'Nothing revealed' : `Reveal up to ${s}`;
        d.addEventListener('click', () => go(i, s));
        dots.appendChild(d);
      }
    }
    $('prev').disabled = i === 0 && nav.step === 0;
    $('next').textContent = nav.step < total ? 'Reveal ▶' : i < DECK.length - 1 ? 'Next slide ▶' : 'End';
    $('next').disabled = i === DECK.length - 1 && nav.step >= total;
    $('show-all').disabled = nav.step >= total;
    $('hide-all').disabled = nav.step === 0;
    $('skip').disabled = i === DECK.length - 1;

    $('notes-text').textContent = slide.notes || '';
    $('notes-meta').textContent = `about ${slide.minutes} min  ·  planned start ${mmss(minutesBefore[i] * 60)} of ${Math.round(totalMinutes)} min`;
    const tb = $('notes-timer');
    tb.hidden = !slide.timer;
    if (slide.timer) tb.textContent = `Start ${mmss(slide.timer)} timer`;

    const n = DECK[i + 1];
    $('next-title').textContent = n ? `${i + 2}. ${(BJ.slideLabel(n) || '').replace(/_/g, '')}` : 'Last slide';

    const wed = control.waiting_screen;
    $('wed-card').classList.toggle('is-off', !wed);
    $('wed-title').textContent = wed ? 'Wednesday screen is up' : 'Lesson is open';
    $('wed-text').textContent = wed
      ? 'Students only see “Wait until Wednesday”. Take it down when class starts.'
      : 'Students see the slides. Put the Wednesday screen back after class.';
    $('wed-btn').textContent = wed ? 'Open the lesson' : 'Put Wednesday screen back';

    for (const key of ['eyes_up', 'show_leaderboard', 'paused', 'start_blocked']) {
      $(key).checked = !!control[key];
    }
    for (const [key, fmt] of Object.entries(sliders)) {
      const el = $(key);
      if (document.activeElement !== el) el.value = control[key];
      $(`${key}-value`).textContent = fmt(Number(el.value));
    }
    document.querySelectorAll('#q-presets button').forEach(b => {
      b.classList.toggle('is-on', Math.abs(Number(b.dataset.q) - control.question_chance) < 0.001);
    });
    const rate = (60000 / control.spawn_delay) * control.spawn_chance;
    $('spawn-calc').innerHTML = `Prediction: (60 ÷ ${(control.spawn_delay / 1000).toFixed(2).replace(/\.?0+$/, '')}) × ${control.spawn_chance.toFixed(2)} = <b>${rate.toFixed(1)}</b> spawns per minute`;
    if (document.activeElement !== $('message')) $('message').value = control.message || '';

    const tags = [];
    if (control.waiting_screen) tags.push(['warn', 'Wednesday screen']);
    if (control.eyes_up) tags.push(['gold', 'Eyes up']);
    if (control.paused) tags.push(['warn', 'Everyone paused']);
    if (control.start_blocked) tags.push(['', 'New games locked']);
    if (control.question_chance > 0) tags.push(['', `Questions ${Math.round(control.question_chance * 100)}%`]);
    if (control.message) tags.push(['gold', `Banner: ${control.message}`]);
    $('live-tags').replaceChildren(...tags.map(([cls, text]) => {
      const s = document.createElement('span');
      s.className = cls;
      s.textContent = text;
      return s;
    }));

    renderResults();
    renderClass();
    postPreviews();
  }

  function pollsFor(slide) {
    if (slide.type === 'poll') return [slide.poll, slide.compare].filter(Boolean);
    if (slide.type === 'multipoll') return slide.items.map((_, i) => `${slide.poll}:${i}`);
    return [];
  }

  function counts(poll, n) {
    const c = new Array(n).fill(0);
    for (const r of results[poll] || []) if (r.choice < n) c[r.choice] = r.votes;
    return { c, total: c.reduce((a, b) => a + b, 0) };
  }

  function renderResults() {
    const slide = DECK[nav.slide];
    const card = $('results-card');
    const box = $('results');
    const isPoll = slide.type === 'poll' || slide.type === 'multipoll';
    card.hidden = !isPoll;
    if (!isPoll) return;
    box.replaceChildren();
    $('reveal-btn').disabled = nav.step >= 1;
    $('reveal-btn').textContent = nav.step >= 1 ? 'Results are showing' : 'Show results to class';

    if (slide.type === 'poll') {
      const now = counts(slide.poll, slide.options.length);
      const before = slide.compare ? counts(slide.compare, slide.options.length) : null;
      $('results-total').textContent = `${now.total} votes${before ? ` (before: ${before.total})` : ''}`;
      slide.options.forEach((opt, i) => {
        const row = document.createElement('div');
        row.className = 'res-opt';
        const pct = now.total ? (now.c[i] / now.total) * 100 : 0;
        const bp = before?.total ? (before.c[i] / before.total) * 100 : 0;
        row.innerHTML = `<div class="res-bar"><i style="width:${pct}%"></i>${before ? `<i class="before" style="width:${bp}%"></i>` : ''}<span></span></div><div class="res-n">${now.c[i]}</div>`;
        row.querySelector('span').textContent = slide.scale ? `${i + 1}. ${opt}` : opt;
        box.appendChild(row);
      });
    } else {
      let most = 0;
      slide.items.forEach((item, r) => {
        const t = counts(`${slide.poll}:${r}`, slide.options.length);
        most = Math.max(most, t.total);
        const wrap = document.createElement('div');
        wrap.className = 'res-item';
        const name = document.createElement('div');
        name.className = 'res-name';
        name.textContent = item;
        const stack = document.createElement('div');
        stack.className = 'stack';
        stack.innerHTML = t.c.map(v => `<i style="width:${t.total ? (v / t.total) * 100 : 0}%"></i>`).join('');
        const legend = document.createElement('div');
        legend.className = 'stack-legend';
        legend.textContent = slide.options.map((o, i) => `${o} ${t.c[i]}`).join('   ');
        wrap.append(name, stack, legend);
        box.appendChild(wrap);
      });
      $('results-total').textContent = `${most} voted`;
    }
  }

  const STATUS = {
    playing: 'Playing', question: 'Question', paused: 'Paused', over: 'Game over',
    menu: 'Menu', watching: 'Slides', waiting: 'Waiting',
  };

  function renderClass() {
    const s = summary || {};
    $('s-online').textContent = s.online ?? 0;
    $('s-playing').textContent = s.playing ?? 0;
    $('s-asked').textContent = s.q_asked ?? 0;
    $('s-right').textContent = s.q_correct ?? 0;
    $('s-wrong').textContent = s.q_wrong ?? 0;
    $('s-weird').textContent = s.q_weird ?? 0;
    $('online-chip').textContent = `${s.online ?? 0} online · ${s.playing ?? 0} playing`;
    const mins = (s.exp_ms || 0) / 60000;
    $('exp-calc').innerHTML = mins > 0.05
      ? `Experiment: <b>${(s.exp_spawned / mins).toFixed(1)}</b> spawns per minute measured over ${mins.toFixed(1)} player minutes (${s.exp_players} players)`
      : 'Experiment: no data yet. It counts spawns only on the Experiment slide.';

    const body = $('roster');
    body.replaceChildren();
    const online = p => rosterNow - Date.parse(p.last_seen) < 45000;
    const sorted = [...roster].sort((a, b) => (online(b) - online(a)) || b.best - a.best || a.name.localeCompare(b.name));
    for (const p of sorted) {
      const tr = document.createElement('tr');
      if (!online(p)) tr.className = 'off';
      const cells = [
        ['name', p.name || '?'],
        ['', null],
        ['num', p.best],
        ['num', p.q_correct],
        ['num', p.q_wrong],
        ['num', p.q_weird],
      ];
      for (const [cls, text] of cells) {
        const td = document.createElement('td');
        if (cls) td.className = cls;
        if (text === null) {
          const st = document.createElement('span');
          st.className = `st st--${p.status}`;
          st.textContent = online(p) ? STATUS[p.status] || p.status : 'Offline';
          td.appendChild(st);
        } else {
          td.textContent = text;
        }
        tr.appendChild(td);
      }
      body.appendChild(tr);
    }
    $('class-sub').textContent = `${roster.length} joined`;
  }

  // Previews

  const frames = { live: $('live-frame'), next: $('next-frame') };
  const ready = { live: false, next: false };

  addEventListener('message', e => {
    if (e.origin !== location.origin || e.data?.type !== 'bj-ready') return;
    for (const [key, frame] of Object.entries(frames)) {
      if (e.source === frame.contentWindow) ready[key] = true;
    }
    postPreviews();
  });

  function postPreviews() {
    if (!control) return;
    const base = { type: 'bj-state', summary, results, clockOffset };
    if (ready.live) {
      frames.live.contentWindow.postMessage({ ...base, control }, location.origin);
    }
    if (ready.next) {
      const n = Math.min(DECK.length - 1, nav.slide + 1);
      frames.next.contentWindow.postMessage({
        ...base,
        control: {
          ...control,
          slide: n,
          step: steps(n),
          waiting_screen: false,
          eyes_up: false,
          message: '',
          timer_end: null,
        },
      }, location.origin);
    }
  }

  // Data

  async function fetchControl() {
    const { data, error } = await sb.from(cfg.table).select('*').eq('id', 1).single();
    if (error) {
      toast(error.message, true);
      return;
    }
    if (!control) {
      control = data;
      nav = { slide: data.slide, step: data.step };
      renderAll();
    } else {
      mergeServer(data);
    }
  }

  async function poll() {
    if (!sb) return;
    const polls = pollsFor(DECK[nav.slide]);
    const jobs = [sb.rpc('bjsnake_summary').then(({ data }) => { if (data) summary = data; })];
    if (polls.length) {
      jobs.push(sb.rpc('bjsnake_results', { p_polls: polls }).then(({ data }) => {
        if (!data) return;
        const next = {};
        for (const r of data) (next[r.poll] ||= []).push({ choice: r.choice, votes: Number(r.votes) });
        for (const p of polls) results[p] = next[p] || [];
      }));
    }
    await Promise.all(jobs);
    renderAll();
  }

  async function loadRoster() {
    try {
      const data = await api('roster');
      roster = data.players || [];
      rosterNow = Date.parse(data.now) || Date.now();
      renderClass();
    } catch {
      // shown on the next real action
    }
  }

  async function syncClock() {
    const t0 = Date.now();
    const { data, error } = await sb.rpc('bjsnake_now');
    const t1 = Date.now();
    if (!error && data) clockOffset = Date.parse(data) - (t0 + t1) / 2;
  }

  function connect() {
    if (sb) return;
    sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    sb.channel('bjsnake-admin')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: cfg.table, filter: 'id=eq.1' }, payload => {
        mergeServer(payload.new);
      })
      .subscribe(status => {
        const live = status === 'SUBSCRIBED';
        $('conn-dot').className = live ? 'dot live' : 'dot bad';
        $('conn-text').textContent = live ? 'Live' : status === 'CLOSED' ? 'Disconnected' : 'Reconnecting…';
        if (live) fetchControl();
      });
    fetchControl().then(poll);
    syncClock();
    loadRoster();
    setInterval(poll, 2000);
    setInterval(loadRoster, 5000);
    setInterval(fetchControl, 15000);
    setInterval(syncClock, 300000);
    setInterval(tick, 250);
  }

  // Clocks

  const LESSON_KEY = 'bj_lesson_start';
  function tick() {
    const start = Number(localStorage.getItem(LESSON_KEY)) || 0;
    if (start) {
      const elapsed = (Date.now() - start) / 1000;
      $('clock-time').textContent = mmss(elapsed);
      const planned = minutesBefore[nav.slide] * 60;
      const diff = elapsed - planned;
      const pace = $('clock-pace');
      if (Math.abs(diff) < 90) {
        pace.textContent = 'on pace';
        pace.className = '';
      } else {
        pace.textContent = `${Math.round(Math.abs(diff) / 60)} min ${diff > 0 ? 'behind' : 'ahead'}`;
        pace.className = diff > 0 ? 'behind' : 'ahead';
      }
      $('clock-btn').textContent = 'Reset';
    } else {
      $('clock-time').textContent = '0:00';
      $('clock-pace').textContent = `Lesson not started (plan: ${Math.round(totalMinutes)} min)`;
      $('clock-pace').className = '';
      $('clock-btn').textContent = 'Start lesson';
    }

    const left = $('timer-left');
    if (control?.timer_end) {
      const remaining = (Date.parse(control.timer_end) - (Date.now() + clockOffset)) / 1000;
      left.textContent = remaining > 0 ? `${mmss(Math.ceil(remaining))} left` : 'Time’s up';
      left.classList.toggle('done', remaining <= 0);
    } else {
      left.textContent = 'Off';
      left.classList.remove('done');
    }
  }

  $('clock-btn').addEventListener('click', () => {
    if (localStorage.getItem(LESSON_KEY)) {
      if (!confirm('Reset the lesson clock?')) return;
      localStorage.removeItem(LESSON_KEY);
    } else {
      localStorage.setItem(LESSON_KEY, String(Date.now()));
    }
    tick();
  });

  // Controls

  $('next').addEventListener('click', next);
  $('prev').addEventListener('click', prev);
  $('show-all').addEventListener('click', () => go(nav.slide, steps(nav.slide)));
  $('hide-all').addEventListener('click', () => go(nav.slide, 0));
  $('skip').addEventListener('click', () => go(nav.slide + 1, 0));
  $('reveal-btn').addEventListener('click', () => go(nav.slide, Math.max(1, nav.step)));
  $('notes-timer').addEventListener('click', () => {
    const slide = DECK[nav.slide];
    if (slide.timer) action('timer', { seconds: slide.timer }, `Timer started: ${mmss(slide.timer)}`);
  });

  $('wed-btn').addEventListener('click', () => {
    const on = !control.waiting_screen;
    if (on && !confirm('Put the Wednesday screen back up for everyone?')) return;
    update({ waiting_screen: on }, on ? 'Wednesday screen is up' : 'Lesson is open');
  });

  for (const key of ['eyes_up', 'show_leaderboard', 'paused', 'start_blocked']) {
    $(key).addEventListener('change', e => {
      update({ [key]: e.target.checked });
      e.target.blur();
    });
  }

  for (const [key, fmt] of Object.entries(sliders)) {
    const el = $(key);
    el.addEventListener('input', () => { $(`${key}-value`).textContent = fmt(Number(el.value)); });
    el.addEventListener('change', () => {
      update({ [key]: Number(el.value) }, 'Updated for everyone');
      el.blur();
    });
  }

  document.querySelectorAll('#q-presets button').forEach(b => {
    b.addEventListener('click', () => update({ question_chance: Number(b.dataset.q) }, 'Question chance updated'));
  });

  function sendMessage(text) {
    const message = text.trim();
    if (!message) return toast('Type a message first', true);
    $('message').value = message;
    $('message').blur();
    update({ message }, 'Banner is showing');
  }
  $('send-message').addEventListener('click', () => sendMessage($('message').value));
  $('message').addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage($('message').value);
  });
  $('clear-message').addEventListener('click', () => {
    $('message').value = '';
    update({ message: '' }, 'Banner cleared');
  });
  document.querySelectorAll('#message-presets button').forEach(b => {
    b.addEventListener('click', () => sendMessage(b.textContent));
  });

  document.querySelectorAll('[data-timer]').forEach(b => {
    b.addEventListener('click', () => action('timer', { seconds: Number(b.dataset.timer) }, `Timer started: ${b.textContent}`));
  });
  $('timer-add').addEventListener('click', () => action('timer_add', { seconds: 30 }, 'Added 30 seconds'));
  $('timer-stop').addEventListener('click', () => action('timer', { seconds: 0 }, 'Timer stopped'));

  $('end-all').addEventListener('click', () => {
    if (confirm('End every game in progress right now?')) action('end_all', {}, 'Ended all games');
  });
  $('reset').addEventListener('click', () => {
    if (confirm('Unpause, unlock, clear the banner and eyes up, turn questions off, and restore default speed and spawns?')) {
      action('reset', {}, 'Game settings reset');
    }
  });
  $('clear-data').addEventListener('click', async () => {
    if (!confirm('Delete every name, score, vote and stat? Students keep their page open and start fresh.')) return;
    const data = await action('clear_data', {}, 'Class data cleared');
    if (data) {
      results = {};
      summary = {};
      roster = [];
      renderAll();
    }
  });
  $('full-reset').addEventListener('click', async () => {
    if (!confirm('Put the Wednesday screen back, wipe every name, score and vote, and go back to the first slide? Everyone will have to enter their name again.')) return;
    const data = await action('full_reset', {}, 'Lesson reset. Wednesday screen is up.');
    if (!data) return;
    localStorage.removeItem(LESSON_KEY);
    results = {};
    summary = {};
    roster = [];
    renderAll();
    tick();
  });

  document.addEventListener('keydown', e => {
    if ($('app').hidden || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest?.('input[type=text], input[type=password], textarea')) return;
    const key = e.key.toLowerCase();
    if (['arrowright', 'pagedown', ' '].includes(key)) {
      e.preventDefault();
      if (e.target instanceof HTMLButtonElement) e.target.blur();
      next();
    } else if (['arrowleft', 'pageup'].includes(key)) {
      e.preventDefault();
      prev();
    } else if (key === 'b' || key === '.') {
      update({ eyes_up: !control.eyes_up });
    } else if (key === 'p') {
      update({ paused: !control.paused });
    } else if (key === 'l') {
      update({ start_blocked: !control.start_blocked });
    }
  });

  // Login

  function showApp() {
    $('login').hidden = true;
    $('app').hidden = false;
    connect();
    setTimeout(postPreviews, 300);
    setTimeout(postPreviews, 1200);
  }

  function logout() {
    password = '';
    sessionStorage.removeItem('bjsnake-admin');
    $('app').hidden = true;
    $('login').hidden = false;
  }

  $('login-form').addEventListener('submit', async e => {
    e.preventDefault();
    password = $('password').value;
    $('login-error').textContent = '';
    try {
      await api('verify');
      sessionStorage.setItem('bjsnake-admin', password);
      $('password').value = '';
      showApp();
    } catch (err) {
      $('login-error').textContent = err.message;
    }
  });
  $('logout').addEventListener('click', logout);

  buildSlideList();
  if (password) api('verify').then(showApp).catch(() => {});
})();
