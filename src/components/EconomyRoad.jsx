import React, { useEffect, useRef } from 'react';

/**
 * Full-width animated "economy road". The ESC delivery truck drives back and forth
 * across the page and never leaves the screen. Hover or focus a feature card and the
 * truck drives over and parks under it.
 * targetEl: the hovered card's DOM element, or null to keep cruising.
 */
export default function EconomyRoad({ targetEl }) {
  const wrapRef = useRef(null);
  const truckRef = useRef(null);
  const flipRef = useRef(null);
  const state = useRef({ x: 0.08, v: 0, dir: 1, target: null });

  useEffect(() => { state.current.target = targetEl; }, [targetEl]);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = state.current;
      const wrap = wrapRef.current;
      const truck = truckRef.current;
      if (wrap && truck) {
        const W = wrap.clientWidth || 1;
        const half = (truck.offsetWidth / 2) / W;       // keep the whole truck on screen
        const minX = half + 0.01;
        const maxX = 1 - half - 0.01;
        let goal = null;
        if (s.target && W >= 700) {
          const r = s.target.getBoundingClientRect();
          const w = wrap.getBoundingClientRect();
          goal = Math.min(maxX, Math.max(minX, (r.left + r.width / 2 - w.left) / w.width));
        }
        let want;
        if (goal == null) {
          // cruise: drive to one end, turn around, drive back
          if (s.x >= maxX) s.dir = -1;
          if (s.x <= minX) s.dir = 1;
          want = 0.07 * s.dir * (900 / Math.max(500, W)) ;
        } else {
          want = Math.max(-0.35, Math.min(0.35, (goal - s.x) * 2.2));
          if (Math.abs(goal - s.x) < 0.002) want = 0;
        }
        s.v += (want - s.v) * Math.min(1, dt * 3.5);
        s.x = Math.min(maxX, Math.max(minX, s.x + s.v * dt));
        if (Math.abs(s.v) > 0.004) s.dir = s.v > 0 ? 1 : -1;
        wrap.classList.toggle('is-parked', Math.abs(s.v) < 0.006);
        truck.style.transform = `translateX(calc(${(s.x * 100).toFixed(3)}cqw - 50%))`;
        if (flipRef.current) flipRef.current.style.transform = s.dir < 0 ? 'scaleX(-1)' : 'none';
      }
      raf = requestAnimationFrame(tick);
    };
    if (reduce) {
      truckRef.current && (truckRef.current.style.transform = 'translateX(calc(50cqw - 50%))');
      wrapRef.current?.classList.add('is-parked');
    } else {
      raf = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="eco-road" ref={wrapRef} aria-hidden="true">
      <div className="eco-sky" />
      <div className="eco-road-surface"><span className="eco-dashes" /></div>
      <div className="eco-truck" ref={truckRef}>
        <div className="eco-flip" ref={flipRef}>
          <svg viewBox="0 0 120 64" width="120" height="64">
            <rect x="4" y="6" width="70" height="38" rx="5" fill="#62160d" />
            <g className="eco-coins">
              <ellipse cx="22" cy="5" rx="6" ry="3" fill="#FFC549" stroke="#b07a10" />
              <ellipse cx="34" cy="3" rx="6" ry="3" fill="#FFC549" stroke="#b07a10" />
              <ellipse cx="46" cy="5" rx="6" ry="3" fill="#FFC549" stroke="#b07a10" />
            </g>
            <path d="M76 18h22l14 14v12H76z" fill="#FFC549" stroke="#62160d" strokeWidth="2" />
            <path d="M82 22h14l9 9H82z" fill="#cfe6f2" stroke="#62160d" strokeWidth="1.5" />
            <rect x="108" y="36" width="6" height="4" rx="1" fill="#fff6c8" />
            <g className="eco-wheel" style={{ transformOrigin: '24px 48px' }}>
              <circle cx="24" cy="48" r="9" fill="#2a1a17" /><circle cx="24" cy="48" r="4" fill="#FFC549" /><rect x="23" y="40" width="2" height="16" fill="#2a1a17" />
            </g>
            <g className="eco-wheel" style={{ transformOrigin: '94px 48px' }}>
              <circle cx="94" cy="48" r="9" fill="#2a1a17" /><circle cx="94" cy="48" r="4" fill="#FFC549" /><rect x="93" y="40" width="2" height="16" fill="#2a1a17" />
            </g>
          </svg>
          <span className="eco-puff p1" /><span className="eco-puff p2" />
        </div>
        {/* ESC lettering stays readable whichever way the truck faces */}
        <span className="eco-logo">ESC</span>
      </div>
    </div>
  );
}
