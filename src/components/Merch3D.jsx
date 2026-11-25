import React, { useEffect, useRef, useState } from 'react';

// A product you can spin with a finger or the mouse. The picture is given
// real depth by stacking slices of its silhouette between the front and
// back faces, so turning it shows thickness instead of a flat card.
const SLICES = 16;

export default function Merch3D({ front, back, label, depth = 0.07 }) {
  const stage = useRef(null);
  const obj = useRef(null);
  const st = useRef({ ry: -18, rx: 4, vy: 0, drag: null, idle: true, raf: 0, last: 0 });
  const [hint, setHint] = useState(true);
  const [w, setW] = useState(300);
  const twoSided = Boolean(back);
  const limit = twoSided ? Infinity : 55;

  useEffect(() => {
    const el = stage.current;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const s = st.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tick = (t) => {
      const dt = Math.min(48, t - (s.last || t)); s.last = t;
      if (!s.drag) {
        if (s.idle && !reduce) {
          // gentle showroom sway until someone touches it
          s.ry = -18 + Math.sin(t / 1600) * (twoSided ? 28 : 22);
        } else if (Math.abs(s.vy) > 0.01) {
          s.ry += s.vy * dt; s.vy *= 0.94;
        } else if (!twoSided) {
          s.ry += (0 - s.ry) * 0.06; // one-sided items ease back to face you
        }
        s.rx += (4 - s.rx) * 0.08;
      }
      if (s.ry > limit) { s.ry = limit; s.vy = 0; }
      if (s.ry < -limit) { s.ry = -limit; s.vy = 0; }
      if (obj.current) obj.current.style.transform = `rotateX(${s.rx}deg) rotateY(${s.ry}deg)`;
      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(s.raf);
  }, [twoSided, limit]);

  const down = (e) => {
    const s = st.current;
    s.drag = { x: e.clientX, y: e.clientY, ry: s.ry, rx: s.rx, t: performance.now(), lx: e.clientX };
    s.idle = false; s.vy = 0; setHint(false);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const move = (e) => {
    const s = st.current; const d = s.drag; if (!d) return;
    const now = performance.now();
    s.ry = d.ry + (e.clientX - d.x) * 0.6;
    s.rx = Math.max(-18, Math.min(18, d.rx - (e.clientY - d.y) * 0.25));
    s.vy = ((e.clientX - d.lx) * 0.6) / Math.max(1, now - d.t);
    d.lx = e.clientX; d.t = now;
  };
  const up = () => { st.current.drag = null; };

  const z = (w * 0.82 * depth) / 2;
  const faceStyle = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' };
  return (
    <div
      ref={stage}
      className="m3d"
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      role="img"
      aria-label={`${label}. Drag to rotate.`}
    >
      <div className="m3d-obj" ref={obj}>
        {Array.from({ length: SLICES }, (_, i) => {
          const zz = -z + ((i + 1) * 2 * z) / (SLICES + 1);
          return <img key={i} src={front} alt="" draggable="false" className="m3d-slice" style={{ ...faceStyle, transform: `translateZ(${zz.toFixed(2)}px)` }} />;
        })}
        <img src={front} alt="" draggable="false" className="m3d-face" style={{ ...faceStyle, transform: `translateZ(${z.toFixed(2)}px)` }} />
        <img src={back || front} alt="" draggable="false" className={`m3d-face ${back ? '' : 'm3d-noback'}`} style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${z.toFixed(2)}px)` }} />
      </div>
      <div className="m3d-shadow" aria-hidden="true" />
      {hint && <span className="m3d-hint" aria-hidden="true">↔ Drag to rotate</span>}
    </div>
  );
}
