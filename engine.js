/* Builder 001: one car, five handovers. Scroll drives a three.js scene. Illustrative people, not CARS24 data. */
(function () {
  var root = document.documentElement;
  var cv = document.getElementById('gl'), journey = document.getElementById('journey');
  var panels = [].slice.call(document.querySelectorAll('.panel'));
  function webgl() { try { var c = document.createElement('canvas'); return !!(window.THREE && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; } }
  if (!cv || !webgl()) { root.classList.add('nogl'); return; }
  root.classList.add('gl');
  var rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var phone = matchMedia('(pointer:coarse)').matches || innerWidth < 760;

  var R = new THREE.WebGLRenderer({ canvas: cv, antialias: !phone, powerPreference: 'high-performance' });
  var dprMax = phone ? 1.5 : 2; R.setPixelRatio(Math.min(devicePixelRatio || 1, dprMax));
  var S = new THREE.Scene();
  var BG = [0xEDEBFF, 0xE6E3FF, 0xD9D5FF, 0xC9C3FF, 0xB3ABFA, 0x9D93F4];
  S.background = new THREE.Color(BG[0]); S.fog = new THREE.Fog(BG[0], 38, 120);
  var cam = new THREE.PerspectiveCamera(38, 1, .1, 300);
  S.add(new THREE.HemisphereLight(0xffffff, 0xb8b0ff, .95));
  var sun = new THREE.DirectionalLight(0xffffff, .85); sun.position.set(-20, 30, 24); S.add(sun);

  function M(c, e) { return new THREE.MeshLambertMaterial({ color: c, flatShading: true, emissive: e || 0x000000 }); }
  var G_BOX = new THREE.BoxGeometry(1, 1, 1);
  function box(w, h, d, mat, x, y, z, p) { var m = new THREE.Mesh(G_BOX, mat); m.scale.set(w, h, d); m.position.set(x, y, z); (p || S).add(m); return m; }
  function sph(r, mat, x, y, z, p) { var m = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), mat); m.position.set(x, y, z); (p || S).add(m); return m; }
  function cyl(rt, rb, h, seg, mat, x, y, z, p) { var m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat); m.position.set(x, y, z); (p || S).add(m); return m; }

  var IND = 0x4736FE, INK = 0x15142B, WHITE = 0xFFFFFF, LAV = 0xDCD8FF, AMB = 0xFFB43B;
  var mInd = M(IND), mInk = M(INK), mWhite = M(WHITE), mLav = M(LAV), mGlass = M(0x7F93D6), mAmb = M(AMB, 0x553300);
  var mRoad = M(0x2A2A44), mGround = M(0xD3CEFF), mWheel = M(0x111122), mHub = M(0xEDEBFF);

  function label(text, w, h, fg, bg) {
    var c = document.createElement('canvas'); c.width = 512; c.height = Math.round(512 * h / w);
    var x = c.getContext('2d'), r = 26;
    x.fillStyle = bg; x.beginPath(); x.moveTo(r, 0); x.arcTo(c.width, 0, c.width, c.height, r); x.arcTo(c.width, c.height, 0, c.height, r); x.arcTo(0, c.height, 0, 0, r); x.arcTo(0, 0, c.width, 0, r); x.fill();
    x.fillStyle = fg; x.font = '800 ' + Math.round(c.height * .46) + 'px Geist, Helvetica, Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, c.width / 2, c.height / 2 + 3);
    var tx = new THREE.CanvasTexture(c); tx.anisotropy = 4;
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthWrite: false })); s.scale.set(w, h, 1); return s;
  }

  // ---- ground, road, skyline ----
  var ground = new THREE.Mesh(new THREE.PlaneGeometry(700, 260), mGround); ground.rotation.x = -Math.PI / 2; ground.position.set(90, 0, -10); S.add(ground);
  box(600, .06, 9.5, mRoad, 90, .03, 0);
  for (var i = -20; i < 230; i += 5) box(2.2, .07, .22, mWhite, i, .07, 0);
  var rs = 7; function rnd() { rs = (rs * 16807) % 2147483647; return rs / 2147483647; }
  for (var k = 0; k < 46; k++) { var bh = 7 + rnd() * 24, bw = 5 + rnd() * 7; box(bw, bh, 6 + rnd() * 5, M(rnd() > .5 ? 0xCFCAFF : 0xE0DDFF), -30 + k * 5.6, bh / 2, -44 - rnd() * 10); }

  // ---- car ----
  function car(color, scale, mini) {
    var g = new THREE.Group(), cm = color == null ? mInd : M(color);
    box(4.4, .8, 1.9, cm, 0, .78, 0, g); box(2.3, .78, 1.72, mGlass, -.2, 1.5, 0, g); box(2.0, .12, 1.6, mWhite, -.2, 1.94, 0, g);
    if (!mini) { box(.12, .22, .5, M(0xFFF1B0, 0xAA9933), 2.2, .9, .6, g); box(.12, .22, .5, M(0xFFF1B0, 0xAA9933), 2.2, .9, -.6, g); box(.12, .2, .5, M(0xFF4040, 0x660000), -2.2, .9, .6, g); box(.12, .2, .5, M(0xFF4040, 0x660000), -2.2, .9, -.6, g); }
    var w = [];
    if (mini) [[1.4, .95], [1.4, -.95], [-1.4, .95], [-1.4, -.95]].forEach(function (p) { var t = new THREE.Mesh(G_WH, mWheel); t.rotation.x = Math.PI / 2; t.position.set(p[0], .46, p[1]); g.add(t); });
    if (!mini) [[1.4, .95], [1.4, -.95], [-1.4, .95], [-1.4, -.95]].forEach(function (p) {
      var wg = new THREE.Group(); wg.position.set(p[0], .46, p[1]);
      var t = new THREE.Mesh(new THREE.CylinderGeometry(.46, .46, .36, 14), mWheel); t.rotation.x = Math.PI / 2; wg.add(t);
      var h = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .38, 8), mHub); h.rotation.x = Math.PI / 2; wg.add(h); box(.5, .08, .4, mInd, 0, 0, 0, wg);
      g.add(wg); w.push(wg);
    });
    g.scale.setScalar(scale || 1); g.userData.wheels = w; S.add(g); return g;
  }
  var G_WH = new THREE.CylinderGeometry(.46, .46, .36, 10);
  var hero = car(null, 1.0); hero.position.set(-24, 0, 0);

  // ---- people (illustrative) ----
  function person(body, skin, x, z, face) {
    var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = face || 0;
    box(.32, .8, .36, mInk, -.17, .4, 0, g); box(.32, .8, .36, mInk, .17, .4, 0, g);
    box(.74, .9, .42, M(body), 0, 1.25, 0, g); sph(.27, M(skin), 0, 1.98, 0, g);
    var arm = new THREE.Group(); arm.position.set(.46, 1.6, 0); box(.2, .8, .22, M(body), 0, -.35, 0, arm); g.add(arm);
    var arm2 = new THREE.Group(); arm2.position.set(-.46, 1.6, 0); box(.2, .8, .22, M(body), 0, -.35, 0, arm2); g.add(arm2);
    g.userData = { arm: arm, arm2: arm2, ph: rnd() * 6 }; S.add(g); return g;
  }
  var SK = [0xE0AC84, 0xC68863, 0x8D5A3B, 0xF2C7A5];
  var people = [];
  function P(body, i, x, z, f) { var p = person(body, SK[i % 4], x, z, f); people.push(p); return p; }
  function tree(x, z, s) { cyl(.18 * s, .24 * s, 1.6 * s, 6, M(0x6B4A3A), x, .8 * s, z); sph(1.1 * s, M(0x6FCB9F), x, 2.3 * s, z); }

  function bldg(x, z, w, h, d, col, band) {
    box(w, h, d, M(col), x, h / 2, z); if (band) box(w + .2, 1.2, d + .2, mInd, x, .6, z);
    var rows = Math.max(1, Math.floor((h - 2) / 2.4)), cols = Math.max(2, Math.floor((w - 1) / 2.8)), fz = z + d / 2 + .03;
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) { var lit = rnd() > .45; box(1.3, 1.1, .1, lit ? M(0xFFE9A8, 0x99781A) : M(0xA9B4E8), x - w / 2 + (c + .5) * (w / cols), 2.4 + r * 2.4, fz); }
  }
  for (var lx = -20; lx < 215; lx += 12) { cyl(.07, .07, 4.4, 6, mInk, lx, 2.2, -5.6); box(.9, .18, .3, M(0xFFF1B0, 0x998844), lx + .3, 4.5, -5.6); cyl(.07, .07, 4.4, 6, mInk, lx + 6, 2.2, 5.6); box(.9, .18, .3, M(0xFFF1B0, 0x998844), lx + 6.3, 4.5, 5.6); }
  box(600, .25, .5, mWhite, 90, .12, -5); box(600, .25, .5, mWhite, 90, .12, 5);
  var X = [-24, 0, 46, 92, 138, 184];
  // station 1: home, the seller family
  (function () {
    var x0 = X[1]; box(10, 6, 8, mWhite, x0 + 7, 3, -12); var roof = new THREE.Mesh(new THREE.ConeGeometry(8.2, 3.4, 4), mInd); roof.rotation.y = Math.PI / 4; roof.position.set(x0 + 7, 7.7, -12); S.add(roof);
    box(1.6, 3, .2, mInk, x0 + 7, 1.5, -7.9); [[x0 + 3.5, 3.6], [x0 + 10.5, 3.6]].forEach(function (p) { box(1.8, 1.6, .2, M(0xFFE9A8, 0x886600), p[0], p[1], -7.9); });
    tree(x0 - 5, -9, 1.4); tree(x0 + 15, -9, 1.2);
    P(0x4736FE, 0, x0 - 5.2, -5.9, 0.4); P(0xFFB43B, 1, x0 - 3.9, -5.9, 0.2); var kid = P(0x6FCB9F, 3, x0 - 4.6, -6.1, 0.3); kid.scale.setScalar(.62);
    var fs = label('FOR SALE', 3.4, 1.1, '#fff', '#4736FE'); fs.position.set(x0 + 3.2, 3.6, 3.6); S.add(fs); cyl(.06, .06, 2.6, 6, mInk, x0 + 3.2, 1.3, 3.6);
  })();
  // station 2: inspection bay
  var beam;
  (function () {
    var x0 = X[2]; bldg(x0 + 9, -12, 16, 9, 3, 0xFFFFFF, 1); var sg = label('INSPECTION BAY', 8, 1.4, '#4736FE', '#ffffff'); sg.position.set(x0 + 11, 8, -10.4); S.add(sg);
    box(.5, 5.4, .5, mInk, x0 - 3.6, 2.7, -5.4); box(.5, 5.4, .5, mInk, x0 - 3.6, 2.7, 5.4); box(.6, .5, 11.4, mInk, x0 - 3.6, 5.5, 0);
    beam = box(.08, 3.6, 4.6, new THREE.MeshBasicMaterial({ color: 0x4736FE, transparent: true, opacity: .32 }), x0, 1.9, 0);
    P(0x15142B, 2, x0 - 1.2, -5.9, 0.1); P(0x4736FE, 3, x0 + 3.2, 5.4, 3.0); var ok = label('CHECKED', 2.6, .9, '#15142B', '#6FCB9F'); ok.position.set(x0 + 3, 3.6, 2.5); S.add(ok); ok.userData.bob = 1; people.push(ok);
  })();
  // station 3: the price, from data
  var bars = [];
  (function () {
    var x0 = X[3]; bldg(x0 + 9, -12, 18, 9, 3, 0xFFFFFF, 1);
    for (var b = 0; b < 8; b++) { var m = box(1, 1, 1, M(b % 3 === 0 ? 0x4736FE : 0x8D84FF), x0 + 3 + b * 1.7, .5, -8.5); m.userData = { b: b }; bars.push(m); }
    var tl = label('FAIR, FROM DATA', 7, 1.3, '#fff', '#15142B'); tl.position.set(x0 + 9, 8.2, -10.2); S.add(tl);
    P(0xFFB43B, 0, x0 - 1.8, 5.6, 3.3); P(0x4736FE, 1, x0 + 2.6, 5.6, 3.0);
    var q = label('IS IT FAIR?', 3.2, 1.0, '#4736FE', '#ffffff'); q.position.set(x0 + 1, 4.2, 5.6); S.add(q); q.userData.bob = 1; people.push(q);
    tree(x0 + 14, 6, 1.1);
  })();
  // station 4: the hub
  (function () {
    var x0 = X[4]; bldg(x0 + 6, -29, 40, 8, 8, 0xF1EEFF, 1); box(40.4, .8, 8.4, mInd, x0 + 6, 8.4, -29);
    var hl = label('THE HUB', 7, 1.5, '#fff', '#4736FE'); hl.position.set(x0 + 15, 5.6, -24.8); S.add(hl);
    box(34, .06, 17, M(0x4A4A66), x0 + 2, .04, -14.5);
    var cols = [0x4736FE, 0xFFFFFF, 0x15142B, 0x8D84FF, 0xFFB43B, 0x6FCB9F];
    for (var r = 0; r < 3; r++) for (var c = 0; c < 7; c++) {
      var bx = x0 - 10 + c * 4.4, bz = -9.5 - r * 4.6; box(.12, .02, 3.6, mWhite, bx - 2.1, .08, bz);
      var m = car(cols[(r * 3 + c * 2) % 6], .82, true); m.position.set(bx, 0, bz); m.rotation.y = Math.PI / 2;
      if ((r + c) % 2 === 0) { var tg = label('QR', 1, .5, '#15142B', '#ffffff'); tg.position.set(bx, 2.25, bz + 1); S.add(tg); }
    }
    box(.12, .02, 3.6, mWhite, x0 - 10 + 7 * 4.4 - 2.1, .08, -9.5);
    P(0x15142B, 1, x0 - 3.2, -6.4, 0.3); P(0x4736FE, 2, x0 + 5, -6.4, -0.2);
  })();
  // station 5: the new owner
  var conf, confV = [];
  (function () {
    var x0 = X[5]; box(.7, 8, .7, mInk, x0 + 6, 4, -4.5); box(.7, 8, .7, mInk, x0 + 6, 4, 4.5); box(.8, 1.3, 10.6, mInd, x0 + 6, 8.2, 0);
    var dl = label('DELIVERED', 7, 1.3, '#4736FE', '#ffffff'); dl.position.set(x0 + 6.8, 8.2, 0); dl.material.rotation = 0; S.add(dl);
    var o1 = P(0xFFB43B, 3, x0 + 3.4, 5.5, 3.0), o2 = P(0x6FCB9F, 0, x0 + 5, 5.5, 3.0); o1.userData.cheer = 1; o2.userData.cheer = 1;
    for (var b = 0; b < 5; b++) { var col = [0x4736FE, 0xFFB43B, 0x6FCB9F, 0xFF6B6B, 0x8D84FF][b]; sph(.6, M(col), x0 - 4 + b * 1.6, 5 + (b % 2), -8, S); cyl(.01, .01, 3, 3, mInk, x0 - 4 + b * 1.6, 2.5, -8); }
    tree(x0 - 7, -9, 1.3); tree(x0 + 15, -9, 1.2);
    var n = 90, pos = new Float32Array(n * 3), col2 = new Float32Array(n * 3), pal = [[.28, .21, 1], [1, .7, .23], [.43, .8, .62], [1, .42, .42]];
    for (var i = 0; i < n; i++) { pos[i * 3] = x0 + (rnd() - .5) * 18; pos[i * 3 + 1] = rnd() * 14; pos[i * 3 + 2] = (rnd() - .5) * 14; var c = pal[i % 4]; col2[i * 3] = c[0]; col2[i * 3 + 1] = c[1]; col2[i * 3 + 2] = c[2]; confV.push(.02 + rnd() * .05); }
    var geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col2, 3));
    conf = new THREE.Points(geo, new THREE.PointsMaterial({ size: .32, vertexColors: true })); S.add(conf); conf.visible = false;
  })();
  tree(-30, -8, 1.3); tree(-18, -9, 1.1);

  // ---- progress -> state ----
  var TL = .55, DW = 1, segs = [], total = 0;
  for (var s = 0; s < 6; s++) { if (s > 0) segs.push({ t: 'T', len: TL, a: X[s - 1], b: X[s], to: s }); segs.push({ t: 'D', len: DW, i: s }); }
  segs.forEach(function (q) { q.at = total; total += q.len; });
  var sm = function (k) { return k * k * (3 - 2 * k); };
  function state(p) {
    var u = Math.max(0, Math.min(1, p)) * total;
    for (var i = 0; i < segs.length; i++) { var q = segs[i]; if (u <= q.at + q.len || i === segs.length - 1) { var k = Math.max(0, Math.min(1, (u - q.at) / q.len)); return q.t === 'T' ? { x: q.a + (q.b - q.a) * sm(k), i: -1, k: k, to: q.to } : { x: X[q.i], i: q.i, k: k }; } }
  }
  function scrollForStation(i) { var q = segs.filter(function (z) { return z.t === 'D' && z.i === i; })[0]; return (q.at + q.len * .5) / total; }

  // ---- layout ----
  var W = 0, H = 0, narrow = false;
  function resize() {
    W = cv.clientWidth; H = cv.clientHeight; R.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix(); narrow = W / H < 1;
  }
  addEventListener('resize', resize); resize();

  var hud = document.getElementById('hud'), dots = [].slice.call(document.querySelectorAll('.dot'));
  dots.forEach(function (d, i) { d.addEventListener('click', function () { var top = journey.offsetTop + scrollForStation(i + 1) * (journey.offsetHeight - innerHeight); scrollTo({ top: top, behavior: rm ? 'auto' : 'smooth' }); }); });
  var startBtn = document.getElementById('start'); if (startBtn) startBtn.addEventListener('click', function (e) { e.preventDefault(); scrollTo({ top: journey.offsetTop + scrollForStation(1) * (journey.offsetHeight - innerHeight), behavior: rm ? 'auto' : 'smooth' }); });

  var cur = state(0), carX = X[0], prevX = X[0], camX = X[0], t0 = performance.now(), slow = 0, last = t0, bgc = new THREE.Color(BG[0]);
  function frame(now) {
    requestAnimationFrame(frame);
    var dt = Math.min(.05, (now - last) / 1000); last = now; var t = (now - t0) / 1000;
    if (dt > .034) { slow++; if (slow > 40 && R.getPixelRatio() > 1) { R.setPixelRatio(Math.max(1, R.getPixelRatio() - .25)); resize(); slow = 0; } } else if (slow > 0) slow--;
    var top = journey.offsetTop, span = journey.offsetHeight - innerHeight, p = span > 0 ? (scrollY - top) / span : 0;
    var inView = p > -0.05 && p < 1.05; cv.style.visibility = inView ? 'visible' : 'hidden'; if (!inView) return;
    cur = state(p); carX += (cur.x - carX) * Math.min(1, dt * 9);
    var moved = carX - prevX; prevX = carX;
    var wr = moved / .46; hero.userData.wheels.forEach(function (w) { w.rotation.z -= wr; });
    hero.position.x = carX; hero.position.y = rm ? 0 : Math.sin(t * 22) * .012 * (Math.abs(moved) > .001 ? 1 : .3);
    hero.rotation.z = Math.max(-.04, Math.min(.04, -moved * .06));
    // camera
    var tx = carX - (narrow ? 1.5 : 5.5), ty = narrow ? -3.4 : 2.4, cz = narrow ? 29 : 20;
    camX += (tx - camX) * Math.min(1, dt * 6);
    cam.position.set(camX - (narrow ? 3 : 7), narrow ? 8 : 5, cz); cam.lookAt(camX + 2, ty, 0);
    // background mood
    var si = cur.i >= 0 ? cur.i : cur.to - 1 + cur.k; si = Math.max(0, Math.min(5, si)); var a = Math.floor(si), b = Math.min(5, a + 1);
    bgc.set(BG[a]).lerp(new THREE.Color(BG[b]), si - a); S.background.copy(bgc); S.fog.color.copy(bgc);
    // panels
    panels.forEach(function (el, i) {
      var o = 0; if (cur.i === i) { var k = cur.k; o = Math.max(0, Math.min(1, Math.min(i === 0 ? 1 : k / .14, (1 - k) / .14))); }
      el.style.opacity = o.toFixed(3); el.style.visibility = o > .01 ? 'visible' : 'hidden'; el.style.pointerEvents = o > .5 ? 'auto' : 'none'; el.style.transform = 'translateY(' + ((1 - o) * 16).toFixed(1) + 'px)';
    });
    var stn = cur.i >= 1 ? cur.i : (cur.i === -1 ? Math.round(cur.to - 1 + cur.k) : 0);
    if (hud) hud.classList.toggle('on', cur.i !== 0 && p < 1.01);
    var cue = document.querySelector('.scrollcue'); if (cue) cue.style.opacity = p < .04 ? 1 : 0;
    dots.forEach(function (d, i) { d.classList.toggle('on', i + 1 === (cur.i >= 1 ? cur.i : Math.max(1, stn))); });
    // ambient animation
    if (!rm) {
      people.forEach(function (q) { if (q.isSprite) { q.position.y += Math.sin(t * 2 + q.position.x) * .003; return; } var u = q.userData; u.arm.rotation.z = Math.sin(t * 2.4 + u.ph) * .25 - (u.cheer ? 2.4 + Math.sin(t * 6) * .3 : .1); u.arm2.rotation.z = -Math.sin(t * 2 + u.ph) * .2 + (u.cheer ? 2.4 + Math.cos(t * 6) * .3 : .1); q.position.y = u.cheer ? Math.abs(Math.sin(t * 4 + u.ph)) * .35 : 0; });
      if (beam) beam.position.x = X[2] + Math.sin(t * 1.6) * 2.4;
      bars.forEach(function (m) { var h = 1.2 + (Math.sin(t * 1.3 + m.userData.b * .9) + 1) * 1.1 + m.userData.b * .3; m.scale.y = h; m.position.y = h / 2; });
      if (conf) { conf.visible = cur.i === 5 || (cur.i === -1 && cur.to === 5 && cur.k > .6); if (conf.visible) { var pa = conf.geometry.attributes.position; for (var i = 0; i < confV.length; i++) { var y = pa.getY(i) - confV[i]; if (y < 0) y = 14; pa.setY(i, y); pa.setX(i, pa.getX(i) + Math.sin(t + i) * .01); } pa.needsUpdate = true; } }
    }
    R.render(S, cam);
  }
  requestAnimationFrame(frame);
  window.__yatra24 = { state: function () { return cur; }, X: X, info: function () { return { calls: R.info.render.calls, tris: R.info.render.triangles, dpr: R.getPixelRatio(), cam: cam.position.toArray(), carX: carX }; } };
})();
