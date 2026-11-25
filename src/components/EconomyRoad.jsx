import React, { useEffect, useRef } from 'react';

/**
 * Animated "economy road": an ESC delivery truck drives past a small skyline
 * (an oil rig, offices, a rising-chart billboard). Hover or focus a feature card
 * and the truck drives over to park under it.
 * target: index of the hovered card (0-3) or null to keep cruising.
 */
export default function EconomyRoad({ target, count = 4 }) {
  const wrapRef = useRef(null);
  const truckRef = useRef(null);
  const state = useRef({ x: -0.1, speed: 0, target: null, parked: false });

  useEffect(() => { state.current.target = target; }, [target]);

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
        const narrow = wrap.clientWidth < 700;
        const goal = s.target != null && !narrow ? (s.target + 0.5) / count : null;
        if (goal == null) {
          // cruise left to right and wrap around
          s.speed += (0.085 - s.speed) * Math.min(1, dt * 2);
          s.x += s.speed * dt;
          if (s.x > 1.12) s.x = -0.12;
        } else {
          // drive to the hovered card and park
          if (s.x > 1.05) s.x = -0.12;
          const d = goal - s.x;
          const want = Math.max(-0.5, Math.min(0.5, d * 2.2));
          s.speed += (want - s.speed) * Math.min(1, dt * 4);
          s.x += s.speed * dt;
        }
        const moving = Math.abs(s.speed) > 0.01;
        wrap.classList.toggle('is-parked', !moving);
        wrap.classList.toggle('is-reversing', s.speed < -0.01);
        truck.style.transform = `translateX(calc(${(s.x * 100).toFixed(3)}cqw - 50%))`;
      }
      raf = requestAnimationFrame(tick);
    };
    if (reduce) {
      state.current.x = 0.5;
      truckRef.current && (truckRef.current.style.transform = 'translateX(calc(50cqw - 50%))');
      wrapRef.current?.classList.add('is-parked');
    } else {
      raf = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(raf);
  }, [count]);

  return (
    <div className="eco-road" ref={wrapRef} aria-hidden="true">
      <div className="eco-sky" />
      <div className="eco-road-surface"><span className="eco-dashes" /></div>
      <div className="eco-truck" ref={truckRef}>
        <svg viewBox="0 0 120 64" width="120" height="64">
          {/* cargo box */}
          <rect x="4" y="6" width="70" height="38" rx="5" fill="#62160d" />
          <text x="39" y="31" textAnchor="middle" fontFamily="Georgia, serif" fontSize="16" fill="#FFC549" letterSpacing="2">ESC</text>
          {/* coins on the roof */}
          <g className="eco-coins">
            <ellipse cx="22" cy="5" rx="6" ry="3" fill="#FFC549" stroke="#b07a10" />
            <ellipse cx="34" cy="3" rx="6" ry="3" fill="#FFC549" stroke="#b07a10" />
            <ellipse cx="46" cy="5" rx="6" ry="3" fill="#FFC549" stroke="#b07a10" />
          </g>
          {/* cab */}
          <path d="M76 18h22l14 14v12H76z" fill="#FFC549" stroke="#62160d" strokeWidth="2" />
          <path d="M82 22h14l9 9H82z" fill="#cfe6f2" stroke="#62160d" strokeWidth="1.5" />
          <rect x="108" y="36" width="6" height="4" rx="1" fill="#fff6c8" className="eco-light" />
          {/* wheels */}
          <g className="eco-wheel" style={{ transformOrigin: '24px 48px' }}>
            <circle cx="24" cy="48" r="9" fill="#2a1a17" /><circle cx="24" cy="48" r="4" fill="#FFC549" /><rect x="23" y="40" width="2" height="16" fill="#2a1a17" />
          </g>
          <g className="eco-wheel" style={{ transformOrigin: '94px 48px' }}>
            <circle cx="94" cy="48" r="9" fill="#2a1a17" /><circle cx="94" cy="48" r="4" fill="#FFC549" /><rect x="93" y="40" width="2" height="16" fill="#2a1a17" />
          </g>
        </svg>
        <span className="eco-puff p1" /><span className="eco-puff p2" />
      </div>
    </div>
  );
}
