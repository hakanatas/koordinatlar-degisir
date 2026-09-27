/* SAHNE 1 — ÜÇGEN (0–10 s)  Koordinatlar ne olur?
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  function tally(ctx, env, t, rows) {
    const T = KD.L(env).TL;
    rows.forEach(([t0, t1, txt, hot], i) => { const al = win(t, t0, t1) * END(t); if (al > 0) F().T(ctx, txt, T.x, T.y[i], { size: T.s, alpha: al, halo: true, color: hot ? A.amber : undefined }); });
  }

  function dashL(ctx, p, q, a, seed, color, w = 2.5) {
    if (a <= 0) return; const n = Math.max(6, Math.round(Math.hypot(q[0] - p[0], q[1] - p[1]) / 14));
    for (let j = 0; j < n; j += 2) Ink.path(ctx, [[lerp(p[0], q[0], j / n), lerp(p[1], q[1], j / n)], [lerp(p[0], q[0], (j + 1) / n), lerp(p[1], q[1], (j + 1) / n)]], { w, alpha: a, seed: seed + j, taper: [0, 0], color });
  }
  function seg2(ctx, p, q, a, k, seed, color, w = 3.5) { if (a > 0 && k > 0) Ink.path(ctx, [p, [lerp(p[0], q[0], k), lerp(p[1], q[1], k)]], { w, alpha: a, seed, taper: [0, 0], color }); }
  function dot(ctx, p, a, color) { if (a <= 0) return; ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 7); ctx.fillStyle = color ? `rgba(${color},${a})` : `rgba(${LI.INK_RGB},${a})`; ctx.fill(); }
  function txt(ctx, env, p, s, a, hot, sz = 0.8) { if (a > 0) F().T(ctx, s, p[0], p[1], { size: KD.L(env).G.s * sz, alpha: a, halo: true, color: hot ? A.amber : undefined }); }
  function arcAt(ctx, C, r, u0, u1, a, seed, color) {
    if (a <= 0) return; const P = []; for (let j = 0; j <= 16; j++) { const u = lerp(u0, u1, j / 16); P.push([C[0] + r * Math.cos(u), C[1] + r * Math.sin(u)]); }
    Ink.path(ctx, P, { w: 2.5, alpha: a, seed, taper: [0, 0], color });
  }
  const lerpP = (p, q, k) => [lerp(p[0], q[0], k), lerp(p[1], q[1], k)];
  function fillP(ctx, P, fill) { ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
  const G = (env, x, y) => { const p = KD.L(env).PL; return [p.x + x * p.u, p.y - y * p.u]; };
  const m = (v) => (v < 0 ? '−' + (-v) : String(v));
  const pt = (n, [x, y]) => `${n}(${m(x)}, ${m(y)})`;
  function plane(ctx, env, a) {
    if (a <= 0) return; const p = KD.L(env).PL, s = KD.L(env).G.s;
    ctx.save(); ctx.strokeStyle = `rgba(${LI.INK_RGB},${0.12 * a})`; ctx.lineWidth = 1.2; ctx.beginPath();
    for (let x = -p.X; x <= p.X; x++) { ctx.moveTo(...G(env, x, -p.Y)); ctx.lineTo(...G(env, x, p.Y)); }
    for (let y = -p.Y; y <= p.Y; y++) { ctx.moveTo(...G(env, -p.X, y)); ctx.lineTo(...G(env, p.X, y)); }
    ctx.stroke(); ctx.restore();
    Ink.path(ctx, [G(env, -p.X - 0.4, 0), G(env, p.X + 0.4, 0)], { w: 3, alpha: a, seed: 3950, taper: [0, 0] });
    Ink.path(ctx, [G(env, 0, -p.Y - 0.4), G(env, 0, p.Y + 0.4)], { w: 3, alpha: a, seed: 3951, taper: [0, 0] });
    F().T(ctx, 'x', ...G(env, p.X + 0.9, 0.1), { size: s * 0.6, alpha: a, halo: true }); F().T(ctx, 'y', ...G(env, 0.5, p.Y + 0.5), { size: s * 0.6, alpha: a, halo: true });
    [-5, 5].forEach((v) => { F().T(ctx, m(v), ...G(env, v, -0.55), { size: s * 0.45, alpha: a * 0.8, halo: true }); });
    F().T(ctx, m(5), ...G(env, -0.5, 5), { size: s * 0.45, alpha: a * 0.8, halo: true });
  }
  function shape(ctx, env, pts, a, k, seed, color, fill, w = 4) {
    if (a <= 0 || k <= 0) return; const P = pts.map(([c, r]) => G(env, c, r));
    if (fill) fillP(ctx, P, fill);
    const Q = P.concat([P[0]]), n = (Q.length - 1) * k, mm = Math.floor(n), R = Q.slice(0, mm + 1); if (mm < Q.length - 1) R.push(lerpP(Q[mm], Q[mm + 1], n - mm));
    Ink.path(ctx, R, { w, alpha: a, seed, taper: [0, 0], color });
    P.forEach((q) => dot(ctx, q, a * k));
  }
  function arrow(ctx, p, q, a, k, seed, color = LI.AMBER_RGB, w = 3) {
    if (a <= 0 || k <= 0) return; const e = lerpP(p, q, k); Ink.path(ctx, [p, e], { w, alpha: a, seed, taper: [0, 0], color });
    const d = Math.atan2(e[1] - p[1], e[0] - p[0]), L = 14; Ink.path(ctx, [[e[0] - L * Math.cos(d - 0.45), e[1] - L * Math.sin(d - 0.45)], e, [e[0] - L * Math.cos(d + 0.45), e[1] - L * Math.sin(d + 0.45)]], { w, alpha: a, seed: seed + 1, taper: [0, 0], color });
  }
  function labels(ctx, env, pts, names, a) {
    if (a <= 0) return; const s = KD.L(env).G.s, cx = pts.reduce((p, q) => p + q[0], 0) / 3, cy = pts.reduce((p, q) => p + q[1], 0) / 3;
    pts.forEach(([x, y], i) => { const P = G(env, x, y), C = G(env, cx, cy), d = [P[0] - C[0], P[1] - C[1]], n = Math.hypot(...d) || 1; F().T(ctx, names[i], P[0] + d[0] / n * 26, P[1] + d[1] / n * 26, { size: s * 0.6, alpha: a, halo: true }); });
  }
  const T0 = [[1, 1], [4, 1], [1, 3]];
  const TR = T0.map(([x, y]) => [x - 3, y - 4]), RX = T0.map(([x, y]) => [x, -y]), RY = T0.map(([x, y]) => [-x, y]);
  const D = [[-5, 2], [-3, 2], [-5, 4]], K = D.map(([x, y]) => [x + 8, y - 5]), DY = D.map(([x, y]) => [-x, y]);
  function image(ctx, env, t, src, dst, t0, a, names, seed, dash) {
    if (a <= 0) return;
    src.forEach((p, i) => (dash ? dashL(ctx, G(env, ...p), lerpP(G(env, ...p), G(env, ...dst[i]), seg(t, t0 + i * 0.4, t0 + i * 0.4 + 0.6)), a * 0.9, seed + i * 20, LI.AMBER_RGB) : arrow(ctx, G(env, ...p), G(env, ...dst[i]), a * 0.9, seg(t, t0 + i * 0.4, t0 + i * 0.4 + 0.6), seed + i * 3)));
    shape(ctx, env, dst, a, seg(t, t0 + 1.4, t0 + 2.2), seed + 90, undefined, `rgba(${LI.AMBER_RGB},${0.22 * a})`);
    labels(ctx, env, dst, names, a * seg(t, t0 + 2.0, t0 + 2.4));
  }

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Şekil taşınınca koordinatları ne olur?'],
      [10.6, 27.8, 'Öteleme: 3 birim sola, 4 birim aşağı'],
      [28.4, 45.8, 'x eksenine göre yansıma'],
      [46.4, 63.8, 'y eksenine göre yansıma'],
      [64.4, 79.8, 'Bu iki üçgen arasında nasıl bir ilişki var?'],
    ]);
  }

  function figure(ctx, env, t) {
    const a = END(t);
    plane(ctx, env, a * seg(t, 4.6, 5.2));
    const a0 = a * win(t, 5.2, 63.8);
    shape(ctx, env, T0, a0, seg(t, 5.4, 6.6), 3960, undefined, `rgba(${LI.INK_RGB},${0.07 * a0})`);
    labels(ctx, env, T0, ['A', 'B', 'C'], a0 * seg(t, 6.6, 7.0));
    image(ctx, env, t, T0, TR, 11.8, a * win(t, 11.6, 27.8), ['A′', 'B′', 'C′'], 3970);
    image(ctx, env, t, T0, RX, 29.6, a * win(t, 29.4, 45.8), ['A′', 'B′', 'C′'], 3990, true);
    const ax = a * win(t, 29.0, 45.8); if (ax > 0) { const p = KD.L(env).PL; Ink.path(ctx, [G(env, -p.X - 0.4, 0), G(env, p.X + 0.4, 0)], { w: 5, alpha: ax * 0.8, seed: 3999, taper: [0, 0], color: LI.AMBER_RGB }); }
    image(ctx, env, t, T0, RY, 47.6, a * win(t, 47.4, 63.8), ['A′', 'B′', 'C′'], 4010, true);
    const ay = a * win(t, 47.0, 63.8); if (ay > 0) { const p = KD.L(env).PL; Ink.path(ctx, [G(env, 0, -p.Y - 0.4), G(env, 0, p.Y + 0.4)], { w: 5, alpha: ay * 0.8, seed: 4019, taper: [0, 0], color: LI.AMBER_RGB }); }
    // S5
    const a5 = a * win(t, 64.8, 79.8);
    shape(ctx, env, D, a5, seg(t, 65.0, 65.8), 4030, undefined, `rgba(${LI.INK_RGB},${0.07 * a5})`); labels(ctx, env, D, ['D', 'E', 'F'], a5 * seg(t, 65.6, 66.0));
    const k1 = a * win(t, 66.2, 72.0); shape(ctx, env, K, k1, seg(t, 66.2, 67.0), 4031, undefined, `rgba(${LI.AMBER_RGB},${0.22 * k1})`); labels(ctx, env, K, ['K', 'L', 'M'], k1 * seg(t, 66.8, 67.2));
    D.forEach((p, i) => arrow(ctx, G(env, ...p), G(env, ...K[i]), k1 * 0.8, seg(t, 68.4 + i * 0.4, 69.0 + i * 0.4), 4040 + i * 3));
    const k2 = a * win(t, 72.4, 79.8); shape(ctx, env, DY, k2, seg(t, 72.4, 73.2), 4050, undefined, `rgba(${LI.AMBER_RGB},${0.22 * k2})`); labels(ctx, env, DY, ['P', 'R', 'S'], k2 * seg(t, 73.0, 73.4));
    D.forEach((p, i) => dashL(ctx, G(env, ...p), lerpP(G(env, ...p), G(env, ...DY[i]), seg(t, 74.4 + i * 0.3, 75.0 + i * 0.3)), k2 * 0.9, 4060 + i * 20, LI.AMBER_RGB));
    tally(ctx, env, t, [[5.6, 10.2, pt('A', T0[0]) + ' ' + pt('B', T0[1]) + ' ' + pt('C', T0[2])]]);
    tally(ctx, env, t, [[12.4, 27.8, pt('A', T0[0]) + ' → ' + pt('A′', TR[0])], [13.0, 27.8, pt('B', T0[1]) + ' → ' + pt('B′', TR[1])], [13.6, 27.8, pt('C', T0[2]) + ' → ' + pt('C′', TR[2])], [18.6, 27.8, '(x, y) → (x − 3, y − 4)', true]]);
    tally(ctx, env, t, [[30.2, 45.8, pt('A', T0[0]) + ' → ' + pt('A′', RX[0])], [30.8, 45.8, pt('B', T0[1]) + ' → ' + pt('B′', RX[1])], [31.4, 45.8, pt('C', T0[2]) + ' → ' + pt('C′', RX[2])], [36.6, 45.8, '(x, y) → (x, −y)', true]]);
    tally(ctx, env, t, [[48.2, 63.8, pt('A', T0[0]) + ' → ' + pt('A′', RY[0])], [48.8, 63.8, pt('B', T0[1]) + ' → ' + pt('B′', RY[1])], [49.4, 63.8, pt('C', T0[2]) + ' → ' + pt('C′', RY[2])], [54.6, 63.8, '(x, y) → (−x, y)', true]]);
    tally(ctx, env, t, [[67.4, 79.8, pt('D', D[0]) + ' → ' + pt('K', K[0])], [69.2, 79.8, 'Hepsi 8 sağa, 5 aşağı: öteleme ✓'], [73.6, 79.8, pt('D', D[0]) + ' → ' + pt('P', DY[0])], [75.6, 79.8, '(−x, y): y eksenine göre ✓', true]]);
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[7.0, 10.2, 'Varsayım: öteleme ekler ya da çıkarır, yansıma işaret değiştirir'],
      [11.4, 27.8, 'Her köşeyi 3 sola, 4 aşağı taşıyalım'],
      [29.4, 45.8, 'x ekseni bir ayna gibi'],
      [47.4, 63.8, 'Şimdi ayna y ekseni'],
      [65.4, 79.8, 'Karşılık gelen noktaların koordinatlarını karşılaştıralım']]);
    exprs(ctx, t, at(W, 1), [[15.4, 27.8, 'Apsisten 3, ordinattan 4 çıktı'],
      [33.4, 45.8, 'Apsis aynı kaldı, ordinatın işareti değişti'],
      [51.4, 63.8, 'Ordinat aynı kaldı, apsisin işareti değişti'],
      [70.0, 72.0, 'Her noktada aynı fark: öteleme'], [76.4, 79.8, 'Apsisin işareti değişti: yansıma']]);
    exprs(ctx, t, at(W, 2), [[22.4, 27.8, 'Sağa-sola apsis, yukarı-aşağı ordinat değişir', true], [40.4, 45.8, 'Noktalar eksene eşit uzaklıkta', true],
      [58.4, 63.8, 'Varsayımımız doğrulandı', true], [77.8, 79.8, 'Koordinatlar ilişkiyi ele verir', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Öteleme: (x, y) → (x + a, y + b)', 80.6], ['x eksenine göre: (x, y) → (x, −y)', 81.6], ['y eksenine göre: (x, y) → (−x, y)', 82.6], ['Koordinatlar dönüşümü anlatır!', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'A triangle', nameTr: 'Üçgen', concept: 'A guess', conceptTr: 'Varsayım', render });
})(window.LI = window.LI || {});
