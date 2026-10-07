window.BJ = window.BJ || {};

(() => {
  const INK = '#1b2a3a';
  const RED = '#d23c32';
  const GOLD = '#f2b33d';

  function setup(canvas, w, h) {
    const ratio = 2;
    canvas.width = w * ratio;
    canvas.height = h * ratio;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return ctx;
  }

  function label(ctx, str, x, y, { size = 18, color = '#fff', bg = 'rgba(15, 23, 33, 0.85)', align = 'center', font = BJ.FONT_BODY } = {}) {
    ctx.font = `700 ${size}px ${font}`;
    const w = ctx.measureText(str).width + size * 0.9;
    const h = size * 1.6;
    let left = x - w / 2;
    if (align === 'left') left = x;
    if (align === 'right') left = x - w;
    const m = ctx.getTransform();
    const minX = -m.e / m.a + 4;
    const maxX = (ctx.canvas.width - m.e) / m.a - 4;
    left = Math.max(minX, Math.min(maxX - w, left));
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(left, y - h / 2, w, h, h / 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(str, left + w / 2, y + 1);
  }

  function arrow(ctx, x1, y1, x2, y2, color, width = 4) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const head = 12 + width;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2 - Math.cos(angle) * head * 0.6, y2 - Math.sin(angle) * head * 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(angle - 0.45), y2 - head * Math.sin(angle - 0.45));
    ctx.lineTo(x2 - head * Math.cos(angle + 0.45), y2 - head * Math.sin(angle + 0.45));
    ctx.closePath();
    ctx.fill();
  }

  function directionOf(a, b) {
    const { UP, DOWN, LEFT, RIGHT } = BJ.DIR;
    if (b[0] > a[0]) return RIGHT;
    if (b[0] < a[0]) return LEFT;
    if (b[1] > a[1]) return DOWN;
    if (b[1] < a[1]) return UP;
    return RIGHT;
  }

  function loopPath(x1, y1, x2, y2) {
    const cells = [];
    for (let x = x1; x < x2; x++) cells.push([x, y1]);
    for (let y = y1; y < y2; y++) cells.push([x2, y]);
    for (let x = x2; x > x1; x--) cells.push([x, y2]);
    for (let y = y2; y > y1; y--) cells.push([x1, y]);
    return cells;
  }

  function hamiltonCycle(W, H) {
    const cells = [];
    for (let x = 0; x < W; x++) cells.push([x, 0]);
    for (let x = W - 1; x >= 1; x--) {
      const down = (W - 1 - x) % 2 === 0;
      for (let i = 1; i < H; i++) cells.push([x, down ? i : H - i]);
    }
    for (let y = H - 1; y >= 1; y--) cells.push([0, y]);
    return cells;
  }

  function drawSnakeOnPath(ctx, path, headIndex, length, t, tile, wrap = true) {
    for (let k = length - 1; k >= 0; k--) {
      const i = headIndex - k;
      const at = idx => path[wrap ? ((idx % path.length) + path.length) % path.length : Math.max(0, idx)];
      const from = at(i - 1);
      const to = at(i);
      const x = (from[0] + (to[0] - from[0]) * t) * tile;
      const y = (from[1] + (to[1] - from[1]) * t) * tile;
      BJ.drawBijo(ctx, x, y, directionOf(from, to), tile);
    }
  }

  BJ.demos = {};

  BJ.demos.grid = (canvas, opts = {}) => {
    const W = 12;
    const H = 9;
    const tile = 50;
    const pad = 34;
    const ctx = setup(canvas, W * tile + pad, H * tile + pad);
    const path = loopPath(2, 2, 9, 6);
    const stepMs = 520;
    let step = 0;
    const at = key => opts[key] !== undefined && step >= opts[key];

    return {
      setStep(s) { step = s; },
      frame(now) {
        ctx.clearRect(0, 0, W * tile + pad, H * tile + pad);
        ctx.save();
        ctx.translate(pad, pad);
        BJ.drawBoard(ctx, W, H, tile, 0.62);

        const progress = now / stepMs;
        const headIndex = Math.floor(progress);
        const t = progress - headIndex;
        drawSnakeOnPath(ctx, path, headIndex, 3, t, tile);

        const head = path[headIndex % path.length];
        const prev = path[(headIndex - 1 + path.length) % path.length];
        const hx = (prev[0] + (head[0] - prev[0]) * t) * tile;
        const hy = (prev[1] + (head[1] - prev[1]) * t) * tile;

        if (at('wallsAt')) {
          ctx.strokeStyle = RED;
          ctx.lineWidth = 5;
          ctx.strokeRect(2.5, 2.5, W * tile - 5, H * tile - 5);
          label(ctx, '0 ≤ x < 12   and   0 ≤ y < 9', (W * tile) / 2, H * tile - 26, { size: 18, bg: RED });
        }

        if (at('vectorAt')) {
          const next = path[(headIndex + 1) % path.length];
          const dir = directionOf(head, next);
          const cx = head[0] * tile + tile / 2;
          const cy = head[1] * tile + tile / 2;
          arrow(ctx, cx, cy, cx + dir[0] * tile * 1.5, cy + dir[1] * tile * 1.5, GOLD, 6);
          label(ctx, `direction = (${dir[0]}, ${dir[1]})`, cx + dir[0] * tile * 1.6, cy + dir[1] * tile * 1.6 + (dir[1] === 0 ? -34 : 0), { size: 16, color: INK, bg: GOLD });
        }

        if (at('coordsAt')) {
          label(ctx, `(${head[0]}, ${head[1]})`, hx + tile / 2, hy - 18, { size: 20 });
        }
        ctx.restore();

        if (at('axesAt')) {
          arrow(ctx, pad, pad / 2, pad + 220, pad / 2, INK, 3);
          arrow(ctx, pad / 2, pad, pad / 2, pad + 170, INK, 3);
          ctx.fillStyle = INK;
          ctx.font = `italic 700 20px "STIX Two Text", serif`;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText('x', pad + 228, pad / 2);
          ctx.fillText('y', pad / 2 - 5, pad + 186);
          label(ctx, '(0, 0)', pad + 34, pad + 24, { size: 14 });
        }
      },
    };
  };

  BJ.demos.wall = (canvas) => {
    const W = 12;
    const H = 9;
    const tile = 50;
    const ctx = setup(canvas, W * tile, H * tile);
    const path = [];
    for (let x = 2; x <= 12; x++) path.push([x, 4]);
    const stepMs = 380;
    const crashAt = (path.length - 2) * stepMs;
    const cycle = crashAt + 2200;

    return {
      setStep() {},
      frame(now) {
        const local = now % cycle;
        BJ.drawBoard(ctx, W, H, tile, 0.62);
        const crashed = local >= crashAt;
        const progress = crashed ? path.length - 2 : local / stepMs;
        const headIndex = Math.min(Math.floor(progress), path.length - 2);
        const t = crashed ? 1 : progress - headIndex;
        drawSnakeOnPath(ctx, path, headIndex, 3, t, tile, false);

        const head = path[headIndex];
        label(ctx, `x = ${head[0]}`, head[0] * tile + tile / 2, head[1] * tile - 22, { size: 18 });

        if (crashed) {
          ctx.fillStyle = 'rgba(210, 60, 50, 0.25)';
          ctx.fillRect(0, 0, W * tile, H * tile);
          ctx.strokeStyle = RED;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(W * tile - 4, 0);
          ctx.lineTo(W * tile - 4, H * tile);
          ctx.stroke();
          label(ctx, 'x = 12 breaks the rule  x < 12', (W * tile) / 2, 120, { size: 22, bg: RED });
          label(ctx, 'Game over', (W * tile) / 2, 330, { size: 30 });
        }
      },
    };
  };

  BJ.demos.lerp = (canvas, opts = {}) => {
    const w = 600;
    const h = 450;
    const ctx = setup(canvas, w, h);
    let step = 0;
    const tile = 150;
    const left = 120;
    const top = 40;

    return {
      setStep(s) { step = s; },
      frame(now) {
        ctx.clearRect(0, 0, w, h);
        const showTint = opts.tintAt !== undefined && step >= opts.tintAt;
        const period = 2600;
        const local = now % period;
        let t;
        if (local < 400) t = 0;
        else if (local < 1800) t = (local - 400) / 1400;
        else t = 1;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(left - 20, top - 20, tile * 2 + 40, tile + 40, 18);
        ctx.clip();
        BJ.drawBoard(ctx, 3, 2, tile, 0.62);
        ctx.restore();

        ctx.fillStyle = 'rgba(242, 179, 61, 0.22)';
        ctx.fillRect(left, top, tile, tile);
        ctx.fillRect(left + tile, top, tile, tile);
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(left, top, tile, tile);
        ctx.strokeRect(left + tile, top, tile, tile);

        BJ.drawBijo(ctx, left + tile * t, top, BJ.DIR.RIGHT, tile);

        label(ctx, 'from (2, 4)', left + tile / 2, top + tile + 34, { size: 17, color: INK, bg: '#e6edf4' });
        label(ctx, 'to (3, 4)', left + tile * 1.5, top + tile + 34, { size: 17, color: INK, bg: '#e6edf4' });

        const barY = top + tile + 84;
        ctx.fillStyle = '#d9e2ec';
        ctx.beginPath();
        ctx.roundRect(left, barY, tile * 2, 10, 5);
        ctx.fill();
        ctx.fillStyle = GOLD;
        ctx.beginPath();
        ctx.roundRect(left, barY, tile * 2 * t, 10, 5);
        ctx.fill();

        ctx.fillStyle = INK;
        ctx.font = `italic 600 26px "STIX Two Text", serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`t = ${t.toFixed(2)}`, left + tile, barY + 36);
        ctx.font = `600 22px "STIX Two Text", serif`;
        ctx.fillText(`x = 2 + (3 − 2) × ${t.toFixed(2)} = ${(2 + t).toFixed(2)}`, left + tile, barY + 72);

        if (showTint && BJ.images.dumpling) {
          const alpha = 0.39 * (0.5 - 0.5 * Math.cos((now / 2600) * Math.PI * 2));
          const y = barY + 108;
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.roundRect(40, y - 8, w - 80, 92, 16);
          ctx.fill();
          ctx.drawImage(BJ.images.dumpling, 60, y, 76, 76);
          ctx.drawImage(BJ.tintImage(BJ.images.dumpling, alpha), 150, y, 76, 76);
          ctx.fillStyle = INK;
          ctx.font = `600 19px "STIX Two Text", serif`;
          ctx.textAlign = 'left';
          ctx.fillText(`color = pixel + (gold − pixel) × ${alpha.toFixed(2)}`, 244, y + 38);
        }
      },
    };
  };

  BJ.demos.hamilton = (canvas) => {
    const W = 12;
    const H = 9;
    const tile = 50;
    const ctx = setup(canvas, W * tile, H * tile);
    const path = hamiltonCycle(W, H);
    const stepMs = 70;
    const total = path.length;

    return {
      setStep() {},
      frame(now) {
        BJ.drawBoard(ctx, W, H, tile, 0.62);
        ctx.strokeStyle = 'rgba(242, 179, 61, 0.85)';
        ctx.lineWidth = 4;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        path.forEach(([x, y], i) => {
          const px = x * tile + tile / 2;
          const py = y * tile + tile / 2;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.stroke();

        const progress = now / stepMs;
        const headIndex = Math.floor(progress);
        const t = progress - headIndex;
        const cycleLength = total * 2.2;
        const phase = (headIndex % Math.floor(cycleLength)) / cycleLength;
        const length = Math.max(3, Math.min(total - 1, Math.floor(3 + phase * (total + 20))));
        drawSnakeOnPath(ctx, path, headIndex, length, t, tile);
        label(ctx, `length ${length} of ${total}`, W * tile - 110, H * tile - 26, { size: 17 });
      },
    };
  };

  BJ.demos.probability = (canvas, opts = {}) => {
    const w = 600;
    const h = 450;
    const ctx = setup(canvas, w, h);
    const maxTrials = 400;
    const perSecond = 30;
    let trials = [];
    let successes = 0;
    let startedAt = null;
    let doneAt = null;
    let p = 0.8;

    const chart = { x: 64, y: 30, w: 500, h: 300 };
    const px = n => chart.x + (n / maxTrials) * chart.w;
    const py = v => chart.y + chart.h - v * chart.h;

    function restart(now) {
      trials = [];
      successes = 0;
      startedAt = now;
      doneAt = null;
      p = opts.chance ? opts.chance() : 0.8;
    }

    return {
      setStep() {},
      frame(now) {
        if (startedAt === null) restart(now);
        if (doneAt !== null && now - doneAt > 3500) restart(now);
        const target = Math.min(maxTrials, Math.floor(((now - startedAt) / 1000) * perSecond));
        while (trials.length < target) {
          if (Math.random() < p) successes++;
          trials.push(successes / (trials.length + 1));
        }
        if (trials.length >= maxTrials && doneAt === null) doneAt = now;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.roundRect(0, 0, w, h, 18);
        ctx.fill();

        ctx.strokeStyle = '#d6dee8';
        ctx.lineWidth = 1;
        ctx.font = `400 15px ${BJ.FONT_BODY}`;
        ctx.fillStyle = '#6b7c8f';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for (let v = 0; v <= 1.001; v += 0.25) {
          ctx.beginPath();
          ctx.moveTo(chart.x, py(v));
          ctx.lineTo(chart.x + chart.w, py(v));
          ctx.stroke();
          ctx.fillText(v.toFixed(2), chart.x - 10, py(v));
        }
        ctx.textAlign = 'center';
        ctx.fillText('spawn attempts', chart.x + chart.w / 2, chart.y + chart.h + 26);

        ctx.setLineDash([8, 7]);
        ctx.strokeStyle = RED;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(chart.x, py(p));
        ctx.lineTo(chart.x + chart.w, py(p));
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = INK;
        ctx.lineWidth = 3;
        ctx.beginPath();
        trials.forEach((v, i) => {
          if (i === 0) ctx.moveTo(px(i + 1), py(v));
          else ctx.lineTo(px(i + 1), py(v));
        });
        ctx.stroke();

        const n = trials.length;
        const observed = n ? successes / n : 0;
        label(ctx, `predicted ${p.toFixed(2)}`, chart.x + chart.w - 70, py(p) - 22, { size: 15, bg: RED });
        ctx.fillStyle = INK;
        ctx.font = `700 20px ${BJ.FONT_BODY}`;
        ctx.textAlign = 'left';
        ctx.fillText(`${n} attempts, ${successes} spawned`, chart.x, h - 46);
        ctx.fillText(`measured: ${observed.toFixed(3)}`, chart.x, h - 18);
      },
    };
  };

  BJ.demos.circles = (canvas, opts = {}) => {
    const w = 1200;
    const h = 250;
    const ctx = setup(canvas, w, h);
    const angles = {
      1: [-90],
      2: [-90, 90],
      3: [-90, 30, 150],
      4: [-90, 0, 90, 180],
      5: [-90, -18, 54, 126, 198],
      6: [-90, -22, 38, 101, 167, 228],
    };
    const regions = [1, 2, 4, 8, 16, 31];
    let step = 0;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let n = 1; n <= 6; n++) {
        const cx = 100 + (n - 1) * 200;
        const cy = 100;
        const r = 72;
        const hidden = n === 6 && step < (opts.revealAt ?? 99);
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        if (hidden) {
          ctx.fillStyle = INK;
          ctx.font = `700 64px ${BJ.FONT_DISPLAY}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('?', cx, cy + 4);
        } else {
          const pts = angles[n].map(a => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)]);
          ctx.strokeStyle = n === 6 ? RED : '#4a6a8a';
          ctx.lineWidth = 2;
          for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
              ctx.beginPath();
              ctx.moveTo(pts[i][0], pts[i][1]);
              ctx.lineTo(pts[j][0], pts[j][1]);
              ctx.stroke();
            }
          }
          ctx.fillStyle = INK;
          for (const [x, y] of pts) {
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.fillStyle = n === 6 && !hidden ? RED : INK;
        ctx.font = `700 34px ${BJ.FONT_DISPLAY}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(hidden ? '?' : String(regions[n - 1]), cx, cy + r + 38);
      }
    }

    return {
      setStep(s) { step = s; draw(); },
      frame() {},
      init() { draw(); },
    };
  };
})();
