import React, { useEffect, useRef, useState } from 'react';

// Real 3D product viewer (WebGL, no libraries).
// The product photo's outline is turned into a rounded, padded body: flat
// across the middle like real fabric, curving smoothly round the edges, with
// the front photo on one side and the back photo on the other. Lighting moves
// with the turn, so it reads like a garment rather than a flat card.

const VS = `
attribute vec3 aPos; attribute vec3 aNor; attribute vec2 aUv; attribute float aSide;
uniform mat4 uMV; uniform mat4 uP;
varying vec2 vUv; varying vec3 vN; varying float vSide; varying vec3 vPos;
void main(){ vec4 p = uMV * vec4(aPos,1.0); vPos=p.xyz; vN = (uMV*vec4(aNor,0.0)).xyz; vUv=aUv; vSide=aSide; gl_Position = uP * p; }`;
const FS = `
precision mediump float;
uniform sampler2D uFront; uniform sampler2D uBack; uniform float uHasBack;
varying vec2 vUv; varying vec3 vN; varying float vSide; varying vec3 vPos;
void main(){
  vec4 c;
  if (vSide > 0.5) { c = texture2D(uFront, vUv); }
  else if (uHasBack > 0.5) { c = texture2D(uBack, vec2(1.0 - vUv.x, vUv.y)); }
  else { c = texture2D(uFront, vec2(1.0 - vUv.x, vUv.y)); c.rgb *= 0.55; }
  if (c.a < 0.5) discard;
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  vec3 L = normalize(vec3(-0.35, 0.55, 1.0));
  float d = max(dot(n, L), 0.0);
  vec3 V = normalize(-vPos); vec3 H = normalize(L + V);
  float s = pow(max(dot(n, H), 0.0), 40.0) * 0.12;
  float rim = pow(1.0 - max(dot(n, V), 0.0), 2.5) * 0.18;
  vec3 col = c.rgb * (0.62 + 0.48 * d) + s - rim * 0.5;
  gl_FragColor = vec4(col, 1.0);
}`;

function loadImg(src) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
}

// Build the rounded body from the picture's outline.
function buildMesh(img, opts) {
  const COLS = 170;
  const ROWS = Math.round(COLS * img.height / img.width);
  const cv = document.createElement('canvas'); cv.width = COLS; cv.height = ROWS;
  const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0, COLS, ROWS);
  const a = cx.getImageData(0, 0, COLS, ROWS).data;
  const inside = new Uint8Array(COLS * ROWS);
  for (let i = 0; i < COLS * ROWS; i++) inside[i] = a[i * 4 + 3] > 110 ? 1 : 0;
  // distance to the outline (two-pass chamfer)
  const INF = 1e9; const d = new Float32Array(COLS * ROWS);
  for (let i = 0; i < d.length; i++) d[i] = inside[i] ? INF : 0;
  const at = (x, y) => (x < 0 || y < 0 || x >= COLS || y >= ROWS ? 0 : d[y * COLS + x]);
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) { const i = y * COLS + x; if (!d[i]) continue;
    d[i] = Math.min(d[i], at(x - 1, y) + 1, at(x, y - 1) + 1, at(x - 1, y - 1) + 1.414, at(x + 1, y - 1) + 1.414); }
  for (let y = ROWS - 1; y >= 0; y--) for (let x = COLS - 1; x >= 0; x--) { const i = y * COLS + x; if (!d[i]) continue;
    d[i] = Math.min(d[i], at(x + 1, y) + 1, at(x, y + 1) + 1, at(x + 1, y + 1) + 1.414, at(x - 1, y + 1) + 1.414); }
  // rounded profile: curves near the edge, flat across the middle
  const R = COLS * opts.round;
  let h = new Float32Array(COLS * ROWS);
  for (let i = 0; i < h.length; i++) { const t = Math.min(1, d[i] / R); h[i] = inside[i] ? Math.sqrt(1 - (1 - t) * (1 - t)) : 0; }
  for (let pass = 0; pass < 3; pass++) { // soften creases
    const o = new Float32Array(h.length);
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) { const i = y * COLS + x;
      if (!inside[i]) continue; let s = 0, n = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < COLS && yy < ROWS) { s += h[yy * COLS + xx]; n++; } }
      o[i] = s / n; }
    h = o;
  }
  const W = 2, Hh = 2 * ROWS / COLS; const Z = opts.depth * W; // model units
  const pos = [], nor = [], uv = [], side = [], idx = [];
  const H = (x, y) => (x < 0 || y < 0 || x >= COLS || y >= ROWS ? 0 : h[y * COLS + x]);
  for (const sgn of [1, -1]) {
    const base = pos.length / 3;
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      const px = (x / (COLS - 1) - 0.5) * W, py = (0.5 - y / (ROWS - 1)) * Hh, pz = sgn * H(x, y) * Z;
      const gx = (H(x + 1, y) - H(x - 1, y)) * Z / (2 * W / COLS), gy = (H(x, y - 1) - H(x, y + 1)) * Z / (2 * Hh / ROWS);
      let nx = -gx * sgn, ny = -gy * sgn, nz = sgn; const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
      pos.push(px, py, pz); nor.push(nx, ny, nz); uv.push(x / (COLS - 1), y / (ROWS - 1)); side.push(sgn > 0 ? 1 : 0);
    }
    for (let y = 0; y < ROWS - 1; y++) for (let x = 0; x < COLS - 1; x++) {
      const i = y * COLS + x;
      if (!(inside[i] || inside[i + 1] || inside[i + COLS] || inside[i + COLS + 1])) continue;
      const v = base + i;
      idx.push(v, v + COLS, v + 1, v + 1, v + COLS, v + COLS + 1);
    }
  }
  return { pos: new Float32Array(pos), nor: new Float32Array(nor), uv: new Float32Array(uv), side: new Float32Array(side), idx: new Uint32Array(idx), aspect: Hh / W };
}

const persp = (f, asp, n, fa) => { const t = 1 / Math.tan(f / 2); return new Float32Array([t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (fa + n) / (n - fa), -1, 0, 0, (2 * fa * n) / (n - fa), 0]); };
function modelView(rx, ry, dist) {
  const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
  // R = Rx * Ry, then translate z
  return new Float32Array([cy, sx * sy, -cx * sy, 0, 0, cx, sx, 0, sy, -sx * cy, cx * cy, 0, 0, 0, -dist, 1]);
}

export default function Merch3D({ front, back, label, depth = 0.06, round = 0.14 }) {
  const wrap = useRef(null); const canvas = useRef(null);
  const st = useRef({ ry: -0.35, rx: 0.06, vy: 0, drag: null, idle: true, visible: false });
  const [hint, setHint] = useState(true); const [failed, setFailed] = useState(false);
  const twoSided = Boolean(back); const limit = twoSided ? Infinity : 1.0;

  useEffect(() => {
    let alive = true; let raf = 0; let gl; let n = 0; let aspect = 1.25;
    const c = canvas.current; const s = st.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    (async () => {
      try {
        gl = c.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true });
        if (!gl || !gl.getExtension('OES_element_index_uint')) throw new Error('no webgl');
        const [fi, bi] = await Promise.all([loadImg(front), back ? loadImg(back) : null]);
        if (!alive) return;
        const m = buildMesh(fi, { depth, round }); aspect = m.aspect; n = m.idx.length;
        const sh = (t, src) => { const o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); return o; };
        const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
        if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error('shader');
        gl.useProgram(pr);
        const buf = (data, name, size) => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); const l = gl.getAttribLocation(pr, name); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, size, gl.FLOAT, false, 0, 0); };
        buf(m.pos, 'aPos', 3); buf(m.nor, 'aNor', 3); buf(m.uv, 'aUv', 2); buf(m.side, 'aSide', 1);
        const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, m.idx, gl.STATIC_DRAW);
        const tex = (img, unit) => { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); };
        tex(fi, 0); tex(bi || fi, 1);
        gl.uniform1i(gl.getUniformLocation(pr, 'uFront'), 0); gl.uniform1i(gl.getUniformLocation(pr, 'uBack'), 1);
        gl.uniform1f(gl.getUniformLocation(pr, 'uHasBack'), bi ? 1 : 0);
        const uMV = gl.getUniformLocation(pr, 'uMV'); const uP = gl.getUniformLocation(pr, 'uP');
        gl.enable(gl.DEPTH_TEST); gl.clearColor(0, 0, 0, 0);
        let last = 0;
        const frame = (t) => {
          raf = requestAnimationFrame(frame);
          if (!s.visible) return;
          const dt = Math.min(48, t - (last || t)); last = t;
          if (!s.drag) {
            if (s.idle && !reduce) s.ry = -0.35 + Math.sin(t / 1700) * (twoSided ? 0.55 : 0.4);
            else if (Math.abs(s.vy) > 0.00002) { s.ry += s.vy * dt; s.vy *= 0.94; }
            else if (!twoSided) s.ry += (0 - s.ry) * 0.05;
            s.rx += (0.06 - s.rx) * 0.08;
          }
          if (s.ry > limit) { s.ry = limit; s.vy = 0; } if (s.ry < -limit) { s.ry = -limit; s.vy = 0; }
          const dpr = Math.min(2, window.devicePixelRatio || 1);
          const w = c.clientWidth, h = c.clientHeight;
          if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
          gl.viewport(0, 0, c.width, c.height); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          const fov = 0.5; const objH = 2 * aspect; const asp = w / h;
          const fitH = (objH / 2) / Math.tan(fov / 2) * 1.08; const fitW = (1 / Math.tan(fov / 2)) / asp * 1.15;
          gl.uniformMatrix4fv(uP, false, persp(fov, asp, 0.1, 50));
          gl.uniformMatrix4fv(uMV, false, modelView(s.rx, s.ry, Math.max(fitH, fitW) + 0.2));
          gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_INT, 0);
        };
        raf = requestAnimationFrame(frame);
      } catch { if (alive) setFailed(true); }
    })();
    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; }, { rootMargin: '100px' });
    io.observe(wrap.current);
    return () => { alive = false; cancelAnimationFrame(raf); io.disconnect(); gl?.getExtension('WEBGL_lose_context')?.loseContext(); };
  }, [front, back, depth, round, twoSided, limit]);

  const down = (e) => { const s = st.current; s.drag = { x: e.clientX, y: e.clientY, ry: s.ry, rx: s.rx, t: performance.now(), lx: e.clientX }; s.idle = false; s.vy = 0; setHint(false); e.currentTarget.setPointerCapture?.(e.pointerId); };
  const move = (e) => { const s = st.current; const d = s.drag; if (!d) return; const now = performance.now();
    s.ry = d.ry + (e.clientX - d.x) * 0.011; s.rx = Math.max(-0.3, Math.min(0.3, d.rx + (e.clientY - d.y) * 0.004));
    s.vy = ((e.clientX - d.lx) * 0.011) / Math.max(1, now - d.t); d.lx = e.clientX; d.t = now; };
  const up = () => { st.current.drag = null; };

  return (
    <div ref={wrap} className="m3d" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} role="img" aria-label={`${label}. Drag to rotate.`}>
      {failed ? <img src={front} alt="" className="m3d-fallback" /> : <canvas ref={canvas} className="m3d-canvas" />}
      <div className="m3d-shadow" aria-hidden="true" />
      {hint && !failed && <span className="m3d-hint" aria-hidden="true">↔ Drag to rotate</span>}
    </div>
  );
}
