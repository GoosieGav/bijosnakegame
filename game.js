window.BJ = window.BJ || {};

BJ.GRID = { W: 12, H: 9, SIZE: 100 };
BJ.DIR = { UP: [0, -1], DOWN: [0, 1], LEFT: [-1, 0], RIGHT: [1, 0] };
BJ.FONT_DISPLAY = '"Bricolage Grotesque", "Trebuchet MS", sans-serif';
BJ.FONT_BODY = '"Figtree", "Trebuchet MS", sans-serif';

BJ.images = {};

BJ.loadImages = () => {
  const load = src => new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
  const files = {
    bijoForward: 'bijo_forward.png',
    bijoLeft: 'bijo_left.png',
    bijoRight: 'bijo_right.png',
    dumpling: 'image.png',
    robux: 'robux.png',
    creditCard: 'creditcard.png',
    background: 'background.png',
  };
  return Promise.all(Object.entries(files).map(async ([key, src]) => {
    BJ.images[key] = await load(src);
  })).then(() => {
    if (BJ.images.dumpling) BJ.images.goldenDumpling = BJ.tintImage(BJ.images.dumpling, 0.39);
  });
};

BJ.tintImage = (img, alpha) => {
  const c = document.createElement('canvas');
  c.width = 100;
  c.height = 100;
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0, 100, 100);
  g.globalCompositeOperation = 'source-atop';
  g.fillStyle = `rgba(255, 255, 0, ${alpha})`;
  g.fillRect(0, 0, 100, 100);
  return c;
};

BJ.drawBijo = (ctx, x, y, direction, size) => {
  const { LEFT, RIGHT, UP, DOWN } = BJ.DIR;
  let img = BJ.images.bijoForward;
  if (direction === LEFT) img = BJ.images.bijoLeft;
  else if (direction === RIGHT) img = BJ.images.bijoRight;
  if (img) {
    ctx.drawImage(img, x, y, size, size);
  } else {
    ctx.fillStyle = direction === UP || direction === DOWN ? '#a0522d' : '#8b4513';
    ctx.fillRect(x, y, size, size);
  }
};

BJ.drawItem = (ctx, kind, x, y, size) => {
  const imgs = {
    dumpling: BJ.images.dumpling,
    special_dumpling: BJ.images.goldenDumpling,
    robux: BJ.images.robux,
    credit_card: BJ.images.creditCard,
  };
  const img = imgs[kind];
  if (img) {
    ctx.drawImage(img, x, y, size, size);
  } else {
    ctx.fillStyle = kind === 'robux' ? '#d33' : kind === 'credit_card' ? '#33d' : '#eee';
    ctx.fillRect(x + size * 0.2, y + size * 0.2, size * 0.6, size * 0.6);
  }
};

BJ.drawBoard = (ctx, cols, rows, size, shade = 0) => {
  const w = cols * size;
  const h = rows * size;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  if (BJ.images.background) ctx.drawImage(BJ.images.background, 0, 0, w, h);
  if (shade) {
    ctx.fillStyle = `rgba(12, 18, 26, ${shade})`;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.strokeStyle = 'rgba(70, 70, 70, 0.9)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= cols; x++) {
    ctx.moveTo(x * size + 0.5, 0);
    ctx.lineTo(x * size + 0.5, h);
  }
  for (let y = 0; y <= rows; y++) {
    ctx.moveTo(0, y * size + 0.5);
    ctx.lineTo(w, y * size + 0.5);
  }
  ctx.stroke();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, w - 3, h - 3);
};

BJ.createGame = (canvas, hooks) => {
  const { W, H, SIZE } = BJ.GRID;
  const { UP, DOWN, LEFT, RIGHT } = BJ.DIR;
  const ctx = canvas.getContext('2d');
  const WIDTH = W * SIZE;
  const HEIGHT = H * SIZE;

  const samePos = (a, b) => a[0] === b[0] && a[1] === b[1];
  const containsPos = (list, p) => list.some(q => samePos(q, p));
  const choice = arr => arr[Math.floor(Math.random() * arr.length)];

  function freeCell(occupied) {
    if (occupied.length >= W * H) return null;
    while (true) {
      const p = [Math.floor(Math.random() * W), Math.floor(Math.random() * H)];
      if (!containsPos(occupied, p)) return p;
    }
  }

  let started = false;
  let state;

  function reset() {
    const start = [Math.floor(W / 2), Math.floor(H / 2)];
    state = {
      body: [start],
      prevBody: [start],
      facing: [RIGHT],
      direction: RIGHT,
      grow: false,
      food: { position: freeCell([start]), type: choice(['dumpling', 'special_dumpling']) },
      obstacles: [],
      score: 0,
      gameOver: false,
      endReason: null,
      wrong: null,
      paused: false,
      question: null,
      flashUntil: 0,
      moveTimer: 0,
      obstacleTimer: 0,
    };
  }

  function changeDirection(dir) {
    const last = state.facing[0];
    if (-last[0] !== dir[0] || -last[1] !== dir[1]) {
      state.direction = dir;
    }
  }

  function moveSnake() {
    const [hx, hy] = state.body[0];
    const head = [hx + state.direction[0], hy + state.direction[1]];

    if (head[0] < 0 || head[0] >= W || head[1] < 0 || head[1] >= H) return false;
    if (containsPos(state.body, head)) return false;

    state.prevBody = state.body.slice();
    state.body.unshift(head);
    state.facing.unshift(state.direction);
    if (state.grow) {
      state.grow = false;
    } else {
      state.body.pop();
      state.facing.pop();
    }
    return true;
  }

  function finish(reason, extra) {
    state.gameOver = true;
    state.endReason = reason;
    state.question = null;
    Object.assign(state, extra);
    hooks.onGameOver?.(state.score, reason);
    hooks.onChange?.();
  }

  function collectAt(cell) {
    let collected = null;
    const hit = state.obstacles.findIndex(o => samePos(o.position, cell));
    if (hit !== -1) {
      collected = state.obstacles[hit].type;
      state.obstacles.splice(hit, 1);
      state.grow = true;
      state.score += 10;
    }

    if (samePos(cell, state.food.position)) {
      collected = state.food.type;
      state.grow = true;
      state.score += state.food.type === 'dumpling' ? 10 : 50;
      const occupied = [...state.body, ...state.obstacles.map(o => o.position)];
      state.food = {
        position: freeCell(occupied) || state.food.position,
        type: choice(['dumpling', 'special_dumpling']),
      };
    }

    if (collected) {
      const question = hooks.onPickup?.(collected);
      if (question) {
        state.question = question;
        state.moveTimer = hooks.control().move_delay;
        hooks.onChange?.();
        return true;
      }
    }
    return false;
  }

  function update(dt, now) {
    const control = hooks.control();
    if (!started || state.gameOver || state.paused || state.question) return;
    if (hooks.isFrozen?.() || now < state.flashUntil) return;

    hooks.onPlayTime?.(dt);

    state.obstacleTimer += dt;
    if (state.obstacleTimer >= control.spawn_delay) {
      state.obstacleTimer = 0;
      if (Math.random() < control.spawn_chance) {
        const occupied = [...state.body, state.food.position, ...state.obstacles.map(o => o.position)];
        const position = freeCell(occupied);
        if (position) {
          state.obstacles.push({ position, type: choice(['robux', 'credit_card']) });
          hooks.onSpawn?.();
        }
      }
    }

    const moveDelay = control.move_delay;
    state.moveTimer += dt;
    if (state.moveTimer < moveDelay) return;
    state.moveTimer = Math.min(state.moveTimer - moveDelay, moveDelay);

    if (collectAt(state.body[0])) return;

    if (!moveSnake()) finish('crash');
  }

  function text(str, x, y, size, color, { align = 'center', font = BJ.FONT_DISPLAY, weight = 700 } = {}) {
    ctx.font = `${weight} ${size}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(str, x, y);
  }

  function dim(alpha) {
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  function drawStartScreen() {
    dim(0.55);
    if (BJ.images.bijoForward) ctx.drawImage(BJ.images.bijoForward, WIDTH / 2 - 110, 150, 220, 220);
    text('Bijo Snake', WIDTH / 2, 450, 96, '#ffd24a');
    text('Collect dumplings, Robux and credit cards to grow', WIDTH / 2, 520, 28, '#fff', { font: BJ.FONT_BODY, weight: 400 });
    text('Arrow keys or WASD to move.  Space to pause.', WIDTH / 2, 760, 24, '#d8d8d8', { font: BJ.FONT_BODY, weight: 400 });
  }

  function draw(now) {
    const control = hooks.control();
    BJ.drawBoard(ctx, W, H, SIZE);

    if (!started) {
      drawStartScreen();
      return;
    }

    if (!state.gameOver) {
      BJ.drawItem(ctx, state.food.type, state.food.position[0] * SIZE, state.food.position[1] * SIZE, SIZE);
      for (const o of state.obstacles) BJ.drawItem(ctx, o.type, o.position[0] * SIZE, o.position[1] * SIZE, SIZE);

      const t = Math.min(state.moveTimer / control.move_delay, 1);
      for (let i = state.body.length - 1; i >= 0; i--) {
        const to = state.body[i];
        const from = state.prevBody[i] || to;
        const x = (from[0] + (to[0] - from[0]) * t) * SIZE;
        const y = (from[1] + (to[1] - from[1]) * t) * SIZE;
        BJ.drawBijo(ctx, x, y, state.facing[i], SIZE);
      }
    }

    text(`Score: ${state.score}`, 16, 34, 36, '#fff', { align: 'left' });

    const cx = WIDTH / 2;
    const cy = HEIGHT / 2;

    if (state.gameOver) {
      dim(0.35);
      const titles = { crash: 'Game over', admin: 'Game ended by admin', wrong: 'Wrong answer' };
      text(titles[state.endReason] || 'Game over', cx, cy - 70, 84, '#ff6a3d');
      if (state.endReason === 'wrong' && state.wrong) {
        const answer = state.wrong.weird ? '???' : String(state.wrong.answer);
        text(`The answer was ${answer}`, cx, cy + 4, 36, '#fff', { font: BJ.FONT_BODY });
      }
      text(`Final score: ${state.score}`, cx, cy + 60, 34, '#fff', { font: BJ.FONT_BODY });
      if (control.start_blocked) {
        text('New games are locked right now', cx, cy + 120, 26, '#d0d0d0', { font: BJ.FONT_BODY, weight: 400 });
      } else {
        text('Press Space or tap to play again', cx, cy + 120, 26, '#fff', { font: BJ.FONT_BODY, weight: 400 });
      }
    } else if (state.question) {
      dim(0.4);
    } else if (now < state.flashUntil) {
      text('Correct!', cx, cy, 110, '#7dff9a');
    } else if (control.paused) {
      dim(0.45);
      text('Paused by admin', cx, cy, 80, '#ffd24a');
      text('Hang tight', cx, cy + 64, 28, '#fff', { font: BJ.FONT_BODY, weight: 400 });
    } else if (state.paused) {
      dim(0.3);
      text('Paused', cx, cy, 88, '#ffd24a');
      text('Press Space to resume', cx, cy + 64, 28, '#fff', { font: BJ.FONT_BODY, weight: 400 });
    }
  }

  reset();

  return {
    get started() { return started; },
    get state() { return state; },
    reset,
    toStartScreen() {
      started = false;
      reset();
      hooks.onChange?.();
    },
    start() {
      reset();
      started = true;
      hooks.onChange?.();
    },
    frame(dt, now) {
      update(dt, now);
      draw(now);
    },
    draw,
    input(dir) {
      if (!started || state.gameOver || state.paused || state.question || hooks.isFrozen?.()) return;
      changeDirection(dir);
    },
    togglePause() {
      if (!started || state.gameOver || state.question || hooks.isFrozen?.()) return;
      state.paused = !state.paused;
      hooks.onChange?.();
    },
    pause() {
      if (started && !state.gameOver && !state.question) {
        state.paused = true;
        hooks.onChange?.();
      }
    },
    answer(correct, question, now) {
      if (!state.question) return;
      if (correct) {
        state.question = null;
        state.flashUntil = now + 800;
        hooks.onChange?.();
      } else {
        finish('wrong', { wrong: { answer: question.answer, weird: question.weird } });
      }
    },
    endByAdmin() {
      if (started && !state.gameOver) finish('admin');
    },
    status() {
      if (!started) return 'menu';
      if (state.gameOver) return 'over';
      if (state.question) return 'question';
      if (state.paused || hooks.isFrozen?.()) return 'paused';
      return 'playing';
    },
    dirs: { UP, DOWN, LEFT, RIGHT },
  };
};
