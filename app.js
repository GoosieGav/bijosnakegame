(() => {
  const params = new URLSearchParams(location.search);
  const MODE = params.has('preview') ? 'preview' : params.has('display') ? 'display' : 'student';
  const NO_COVER = params.has('nocover');
  const cfg = window.BJSNAKE_CONFIG;
  const DECK = BJ.DECK;
  const $ = id => document.getElementById(id);
  const store = params.has('solo') ? sessionStorage : localStorage;

  document.documentElement.dataset.mode = MODE;
  if (MODE !== 'preview') document.documentElement.classList.add('is-loading');

  const control = {
    paused: false,
    start_blocked: false,
    message: '',
    move_delay: 180,
    spawn_delay: 2000,
    spawn_chance: 0.8,
    question_chance: 0,
    weird_chance: 0.1,
    waiting_screen: false,
    eyes_up: false,
    show_leaderboard: true,
    slide: 0,
    step: 0,
    timer_end: null,
    timer_total: 0,
    end_all_at: null,
    data_epoch: 0,
    updated_at: null,
  };

  let loaded = false;
  let lastEndAll = null;
  let summary = {};
  let results = {};
  let clockOffset = 0;
  let registered = false;
  let hbTimer = null;
  let lastStatus = null;
  let renderedStep = -1;

  const readJson = (key, fallback) => {
    try { return JSON.parse(store.getItem(key)) ?? fallback; } catch { return fallback; }
  };
  const writeJson = (key, value) => {
    if (MODE === 'student') store.setItem(key, JSON.stringify(value));
  };

  const freshStats = () => ({ best: 0, q_asked: 0, q_correct: 0, q_wrong: 0, q_weird: 0, exp_spawned: 0, exp_ms: 0 });
  let stats = { ...freshStats(), ...readJson('bj_stats', {}) };
  let votes = readJson('bj_votes', {});
  let name = store.getItem('bj_name') || '';
  let player = readJson('bj_player', null);
  if (MODE === 'student' && !player) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    player = {
      id: crypto.randomUUID(),
      secret: Array.from(bytes, b => b.toString(16).padStart(2, '0')).join(''),
    };
    writeJson('bj_player', player);
  }

  const saveStats = () => writeJson('bj_stats', stats);
  const saveVotes = () => writeJson('bj_votes', votes);

  const sb = MODE === 'preview' ? null : window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { params: { eventsPerSecond: 2 } },
  });

  const stage = $('stage');
  const deck = $('deck');
  const gameWrap = $('game-wrap');
  const canvas = $('game');
  const startBtn = $('start-btn');
  const qBox = $('question');
  const qText = $('question-text');
  const qInput = $('question-input');

  function fit() {
    const s = Math.min(innerWidth / 1600, innerHeight / 900);
    const ox = (innerWidth - 1600 * s) / 2;
    const oy = (innerHeight - 900 * s) / 2;
    stage.style.transform = `translate(${ox}px, ${oy}px) scale(${s})`;
    const root = document.documentElement.style;
    root.setProperty('--s', s);
    root.setProperty('--ox', `${ox}px`);
    root.setProperty('--oy', `${oy}px`);
  }
  addEventListener('resize', fit);
  if (window.ResizeObserver) new ResizeObserver(fit).observe(document.documentElement);
  fit();

  const progress = $('progress-snake');
  const cells = DECK.map(() => {
    const c = document.createElement('span');
    c.className = 'cell';
    progress.appendChild(c);
    return c;
  });

  let currentIndex = -1;
  let currentSlide = null;
  let current = null;
  let gameSlideId = null;
  let forceRender = false;
  let activeQuestion = null;

  const frozen = () => MODE !== 'student'
    || !name
    || control.paused
    || (control.waiting_screen && !NO_COVER)
    || control.eyes_up
    || currentSlide?.type !== 'game';

  const onExperiment = () => currentSlide?.id === 'experiment';

  const game = BJ.createGame(canvas, {
    control: () => control,
    isFrozen: frozen,
    onPickup: maybeQuestion,
    onSpawn: () => {
      if (onExperiment()) stats.exp_spawned++;
    },
    onPlayTime: dt => {
      if (onExperiment()) stats.exp_ms += dt;
    },
    onGameOver: score => {
      stats.best = Math.max(stats.best, score);
      saveStats();
      heartbeatSoon(300);
    },
    onChange: () => {
      syncGameUi();
      heartbeatSoon();
    },
  });

  function maybeQuestion() {
    if (MODE !== 'student' || !(Math.random() < control.question_chance)) return null;
    const q = BJ.questionBag.next(control.weird_chance);
    stats.q_asked++;
    if (q.weird) stats.q_weird++;
    saveStats();
    activeQuestion = q;
    qText.textContent = q.text;
    qInput.value = '';
    qBox.hidden = false;
    setTimeout(() => qInput.focus(), 30);
    return q;
  }

  function hideQuestion() {
    activeQuestion = null;
    qBox.hidden = true;
    qInput.blur();
  }

  $('question-form').addEventListener('submit', e => {
    e.preventDefault();
    const q = activeQuestion;
    if (!q || !qInput.value.trim()) return;
    const correct = BJ.checkAnswer(q, qInput.value);
    if (correct) stats.q_correct++;
    else stats.q_wrong++;
    saveStats();
    hideQuestion();
    game.answer(correct, q, performance.now());
    heartbeatSoon(300);
  });

  function tryStart() {
    if (MODE !== 'student' || control.start_blocked || frozen()) return;
    hideQuestion();
    game.start();
  }

  function syncGameUi() {
    const menu = !game.started;
    startBtn.hidden = !menu || MODE === 'display';
    startBtn.disabled = MODE !== 'student' || control.start_blocked;
    startBtn.classList.toggle('is-locked', !!control.start_blocked);
    startBtn.textContent = control.start_blocked ? 'Locked for now' : 'START';
    if (activeQuestion && !game.state.question) hideQuestion();
  }

  startBtn.addEventListener('click', () => {
    startBtn.blur();
    tryStart();
  });

  const KEYS = {
    arrowup: 'UP', w: 'UP', arrowdown: 'DOWN', s: 'DOWN',
    arrowleft: 'LEFT', a: 'LEFT', arrowright: 'RIGHT', d: 'RIGHT',
  };

  document.addEventListener('keydown', e => {
    if (MODE !== 'student' || currentSlide?.type !== 'game') return;
    if (e.target.closest?.('input, textarea')) return;
    const key = e.key.toLowerCase();
    if (KEYS[key]) {
      e.preventDefault();
      game.input(BJ.DIR[KEYS[key]]);
    } else if (key === ' ' || e.code === 'Space') {
      e.preventDefault();
      if (e.repeat) return;
      if (!game.started || game.state.gameOver) tryStart();
      else game.togglePause();
    }
  });

  let touchStart = null;
  canvas.addEventListener('pointerdown', e => {
    touchStart = [e.clientX, e.clientY];
  });
  canvas.addEventListener('pointerup', e => {
    if (!touchStart) return;
    const dx = e.clientX - touchStart[0];
    const dy = e.clientY - touchStart[1];
    touchStart = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) > 30) {
      if (Math.abs(dx) > Math.abs(dy)) game.input(dx > 0 ? BJ.DIR.RIGHT : BJ.DIR.LEFT);
      else game.input(dy > 0 ? BJ.DIR.DOWN : BJ.DIR.UP);
    } else if (game.state.gameOver) {
      tryStart();
    }
  });

  const env = {
    mode: MODE,
    control: () => control,
    myVote: poll => votes[poll],
    vote: (poll, choice) => vote(poll, choice),
  };

  function showSlide(index) {
    const slide = DECK[index];
    const leaving = currentSlide;
    const old = current;
    forceRender = false;

    current = BJ.renderSlide(slide, env);
    current.el.classList.add('is-in');
    deck.appendChild(current.el);
    if (old) {
      old.el.classList.add('is-out');
      setTimeout(() => old.el.remove(), 450);
    }

    currentIndex = index;
    currentSlide = slide;

    if (slide.type === 'game' && current.slot) {
      current.slot.appendChild(gameWrap);
      if (gameSlideId !== slide.id) {
        gameSlideId = slide.id;
        hideQuestion();
        game.toStartScreen();
      }
    } else {
      $('game-home').appendChild(gameWrap);
      if (leaving?.type === 'game') game.pause();
    }

    stage.classList.toggle('on-game', slide.type === 'game');
    syncGameUi();
    refreshData();
  }

  function render() {
    const waiting = control.waiting_screen && !NO_COVER;
    $('cover-wait').hidden = !waiting;
    $('cover-eyes').hidden = waiting || !control.eyes_up || NO_COVER;
    $('gate').hidden = MODE !== 'student' || !!name || waiting;

    const banner = $('banner');
    banner.textContent = control.message || '';
    banner.hidden = !control.message;

    const index = Math.max(0, Math.min(DECK.length - 1, control.slide | 0));
    const changed = index !== currentIndex || forceRender;
    if (changed) showSlide(index);
    const step = Math.min(control.step | 0, BJ.slideSteps(currentSlide));
    current.setStep(step);
    if (!changed && step !== renderedStep) refreshData();
    renderedStep = step;
    pushData();

    cells.forEach((c, i) => {
      c.classList.toggle('is-done', i < index);
      c.classList.toggle('is-head', i === index);
    });
    $('progress-section').textContent = BJ.SECTIONS[currentSlide.section] || '';
    syncGameUi();
  }

  function pushData() {
    current?.update({
      control,
      summary,
      results,
      mode: MODE,
      best: Math.max(stats.best, game.started ? game.state.score : 0),
    });
  }

  function checkEpoch() {
    if (MODE !== 'student') return;
    const epoch = String(control.data_epoch ?? 0);
    const stored = store.getItem('bj_epoch');
    if (stored === epoch) return;
    store.setItem('bj_epoch', epoch);
    if (stored === null) return;
    stats = freshStats();
    votes = {};
    saveStats();
    saveVotes();
    store.removeItem('bj_name');
    name = '';
    registered = false;
    hideQuestion();
    game.toStartScreen();
    forceRender = true;
  }

  function applyControl(row) {
    if (!row) return;
    if (loaded && row.updated_at && control.updated_at && Date.parse(row.updated_at) < Date.parse(control.updated_at)) return;
    const prev = { ...control };
    Object.assign(control, row);

    if (!loaded) {
      loaded = true;
      lastEndAll = control.end_all_at;
      document.documentElement.classList.remove('is-loading');
    } else if (control.end_all_at && control.end_all_at !== lastEndAll) {
      lastEndAll = control.end_all_at;
      hideQuestion();
      game.endByAdmin();
    }
    checkEpoch();

    const lifted = (prev.paused && !control.paused)
      || (prev.waiting_screen && !control.waiting_screen)
      || (prev.eyes_up && !control.eyes_up);
    if (lifted) game.pause();

    render();
  }

  async function fetchControl() {
    const { data, error } = await sb.from(cfg.table).select('*').eq('id', 1).single();
    if (!error) applyControl(data);
  }

  async function syncClock() {
    const t0 = Date.now();
    const { data, error } = await sb.rpc('bjsnake_now');
    const t1 = Date.now();
    if (!error && data) clockOffset = Date.parse(data) - (t0 + t1) / 2;
  }

  function pollsFor(slide) {
    if (!slide) return [];
    if (slide.type === 'poll') return [slide.poll, slide.compare].filter(Boolean);
    if (slide.type === 'multipoll') return slide.items.map((_, i) => `${slide.poll}:${i}`);
    return [];
  }

  const LIVE_SUMMARY = /\{(measured|qWeird)\}/;
  function needsSummary(slide) {
    if (!slide) return false;
    return slide.type === 'game' || slide.type === 'stats' || slide.type === 'weird'
      || LIVE_SUMMARY.test(JSON.stringify(slide.items || []));
  }

  let fetching = false;
  let fetchAgain = false;
  async function refreshData() {
    if (!sb) return;
    if (fetching) {
      fetchAgain = true;
      return;
    }
    const slide = currentSlide;
    const polls = pollsFor(slide);
    const wantResults = polls.length && (MODE !== 'student' || control.step >= 1);
    const wantSummary = needsSummary(slide);
    if (!wantResults && !wantSummary) return;
    fetching = true;
    try {
      const jobs = [];
      if (wantResults) {
        jobs.push(sb.rpc('bjsnake_results', { p_polls: polls }).then(({ data }) => {
          if (!data) return;
          const next = {};
          for (const r of data) (next[r.poll] ||= []).push({ choice: r.choice, votes: Number(r.votes) });
          for (const p of polls) results[p] = next[p] || [];
        }));
      }
      if (wantSummary) {
        jobs.push(sb.rpc('bjsnake_summary').then(({ data }) => {
          if (data) summary = data;
        }));
      }
      await Promise.all(jobs);
    } finally {
      fetching = false;
    }
    if (slide === currentSlide) pushData();
    if (fetchAgain) {
      fetchAgain = false;
      refreshData();
    }
  }

  function statusNow() {
    if (control.waiting_screen) return 'waiting';
    if (currentSlide?.type !== 'game') return 'watching';
    return game.status();
  }

  async function heartbeat() {
    clearTimeout(hbTimer);
    hbTimer = null;
    if (MODE !== 'student' || !name || !loaded) return false;
    const status = statusNow();
    lastStatus = status;
    const { error } = await sb.rpc('bjsnake_heartbeat', {
      p_id: player.id,
      p_secret: player.secret,
      p_name: name,
      p_status: status,
      p_best: Math.max(stats.best, game.started ? game.state.score : 0),
      p_q_asked: stats.q_asked,
      p_q_correct: stats.q_correct,
      p_q_wrong: stats.q_wrong,
      p_q_weird: stats.q_weird,
      p_exp_spawned: stats.exp_spawned,
      p_exp_ms: Math.round(stats.exp_ms),
    });
    if (!error) registered = true;
    return !error;
  }

  function heartbeatSoon(delay = 1000) {
    if (MODE !== 'student' || hbTimer) return;
    hbTimer = setTimeout(heartbeat, delay);
  }

  async function vote(poll, choice) {
    if (MODE !== 'student') return;
    votes[poll] = choice;
    saveVotes();
    if (!registered) await heartbeat();
    const send = () => sb.rpc('bjsnake_vote', { p_id: player.id, p_secret: player.secret, p_poll: poll, p_choice: choice });
    let { error } = await send();
    if (error && await heartbeat()) ({ error } = await send());
    if (!error) setTimeout(refreshData, 300);
  }

  $('gate-form').addEventListener('submit', e => {
    e.preventDefault();
    const value = $('gate-name').value.trim().replace(/\s+/g, ' ').slice(0, 20);
    if (!value) return;
    name = value;
    store.setItem('bj_name', name);
    $('gate').hidden = true;
    $('gate-name').blur();
    heartbeat();
  });

  let timerShown = '';
  function renderTimer() {
    const pill = $('timer');
    let text = '';
    let fraction = 0;
    let done = false;
    if (control.timer_end) {
      const remaining = (Date.parse(control.timer_end) - (Date.now() + clockOffset)) / 1000;
      if (remaining > -20) {
        const s = Math.max(0, Math.ceil(remaining));
        done = remaining <= 0;
        text = done ? 'Time’s up' : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
        fraction = control.timer_total ? Math.max(0, Math.min(1, remaining / control.timer_total)) : 0;
      }
    }
    pill.hidden = !text;
    $('timer-bar').style.transform = `scaleX(${fraction})`;
    if (text !== timerShown) {
      timerShown = text;
      $('timer-text').textContent = text;
      pill.classList.toggle('is-done', done);
    }
  }

  let last = performance.now();
  let lastDraw = 0;
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(now - last, 100);
    last = now;
    if (MODE === 'preview' && now - lastDraw < 45) return;
    lastDraw = now;
    if (currentSlide?.type === 'game' && MODE !== 'display') {
      game.frame(dt, now);
      if (activeQuestion && !game.state.question) hideQuestion();
    }
    current?.frame(now);
    renderTimer();
    if (MODE === 'student' && name && loaded && statusNow() !== lastStatus) heartbeatSoon();
  }

  BJ.app = { game, control, get stats() { return stats; }, get summary() { return summary; } };

  async function boot() {
    await Promise.all([BJ.loadImages(), document.fonts?.ready]);
    render();
    requestAnimationFrame(loop);

    if (MODE === 'preview') {
      addEventListener('message', e => {
        if (e.origin !== location.origin || e.data?.type !== 'bj-state') return;
        Object.assign(control, e.data.control);
        summary = e.data.summary || summary;
        results = e.data.results || results;
        clockOffset = e.data.clockOffset || 0;
        loaded = true;
        document.documentElement.classList.remove('is-loading');
        render();
        fit();
      });
      const ping = () => parent.postMessage({ type: 'bj-ready' }, location.origin);
      ping();
      let n = 0;
      const pingId = setInterval(() => { ping(); if (++n > 20) clearInterval(pingId); }, 400);
      return;
    }

    sb.channel('bjsnake-control')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: cfg.table, filter: 'id=eq.1' }, payload => {
        applyControl(payload.new);
      })
      .subscribe(status => {
        if (status === 'SUBSCRIBED') fetchControl();
      });

    await fetchControl();
    syncClock();
    heartbeat();
    setInterval(fetchControl, 10000);
    setInterval(heartbeat, 15000);
    setInterval(refreshData, MODE === 'display' ? 2000 : 2500);
    setInterval(syncClock, 300000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        fetchControl();
        heartbeatSoon(200);
      }
    });
  }

  boot();
})();
