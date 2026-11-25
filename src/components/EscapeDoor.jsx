import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * "ESCape the ordinary": a little street with shops and people walking by.
 * The ESynC robot cat walks up, the ESC door opens, and it steps inside.
 * Plays when it scrolls into view; tap or hover the door to play again.
 */
const PEOPLE = [
  { c: '#2f6f8f', d: 26, delay: -2, dir: 1, s: 1 },
  { c: '#d98e04', d: 32, delay: -14, dir: -1, s: .92 },
  { c: '#62160d', d: 29, delay: -21, dir: 1, s: .85 },
  { c: '#3f7a4f', d: 35, delay: -7, dir: -1, s: 1 },
  { c: '#c96a4a', d: 24, delay: -18, dir: 1, s: .95 },
];

export default function EscapeDoor() {
  const ref = useRef(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const el = ref.current; if (!el) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setRun((r) => (r === 0 ? 1 : r)); }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const replay = () => setRun((r) => r + 1);

  // Scale the 1200x300 street so it fills the whole section (like background-size: cover).
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return undefined;
    const fit = () => setScale(Math.max(el.clientWidth / 1200, (el.clientHeight * 0.62) / 300));
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="escape-street" ref={ref}>
      <span className="cloud c1" /><span className="cloud c2" /><span className="cloud c3" /><span className="street-sun" />
      <div className="street-world" style={{ transform: `translateX(-50%) scale(${scale})` }}>
      <svg className="street-bg" viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <Street />
      </svg>
      <div className="street-people" aria-hidden="true">
        {PEOPLE.map((p, i) => (
          <span key={i} className={`walker ${p.dir < 0 ? 'rev' : ''}`} style={{ animationDuration: `${p.d}s`, animationDelay: `${p.delay}s` }}>
            <Person color={p.c} scale={p.s} />
          </span>
        ))}
      </div>
      <button type="button" className={`escape ${run ? 'play' : ''}`} key={run} onClick={replay}
        onMouseEnter={() => { if (run) replay(); }} aria-label="ESCape the ordinary: play the animation">
        <span className="escape-stage" aria-hidden="true">
          <span className="escape-frame" style={{ WebkitMaskImage: "url(images/esc-door-hd.png)", maskImage: "url(images/esc-door-hd.png)" }} />
          <span className="escape-man"><span className="escape-cat"><img src="images/esc-cat.png" alt="" /></span></span>
          <span className="escape-door"><img src="images/esc-door-hd.png" alt="" /></span>
        </span>
        <span className="escape-tag"><b>ESC</b>ape the ordinary</span>
      </button>
      <div className="street-curb" aria-hidden="true" />
      </div>
    </div>
  );
}

function Person({ color, scale }) {
  return (
    <svg viewBox="0 0 40 80" width={34 * scale} height={68 * scale}>
      <circle cx="20" cy="11" r="8" fill="#f2c9a6" />
      <path d="M12 9 q8 -10 16 0" fill="#3a2a27" />
      <rect x="11" y="20" width="18" height="30" rx="8" fill={color} />
      <g className="w-leg a" style={{ transformOrigin: '20px 48px' }}><rect x="16.5" y="46" width="5" height="28" rx="2.5" fill="#3a2a27" /></g>
      <g className="w-leg b" style={{ transformOrigin: '20px 48px' }}><rect x="18.5" y="46" width="5" height="28" rx="2.5" fill="#4a3a37" /></g>
      <g className="w-arm" style={{ transformOrigin: '20px 24px' }}><rect x="17.5" y="22" width="5" height="22" rx="2.5" fill={color} opacity=".85" /></g>
    </svg>
  );
}

function Street() {
  return (
    <>
      {/* far skyline */}
      <g fill="#f0dfd6">
        <rect x="40" y="70" width="70" height="160" /><rect x="300" y="50" width="60" height="180" /><rect x="820" y="60" width="80" height="170" /><rect x="1100" y="80" width="70" height="150" />
      </g>
      {/* ---- left side: café ---- */}
      <g>
        <rect x="70" y="110" width="200" height="130" fill="#f6e3c8" stroke="#d9bfa2" strokeWidth="2" />
        <rect x="64" y="100" width="212" height="14" fill="#62160d" />
        <text x="170" y="111" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#FFC549" letterSpacing="3">KOPI &amp; CAFÉ</text>
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${70 + i * 22.2} 114 h22.2 v14 a11.1 8 0 0 1 -22.2 0 z`} fill={i % 2 ? '#fff' : '#c96a4a'} />)}
        <rect x="88" y="150" width="70" height="60" rx="4" fill="#cfe6ee" stroke="#b9917f" strokeWidth="2" />
        <rect x="178" y="150" width="70" height="90" rx="4" fill="#9a6b55" />
        <circle cx="236" cy="196" r="3" fill="#FFC549" />
        {/* table + umbrella */}
        <rect x="18" y="215" width="40" height="5" fill="#62160d" /><rect x="36" y="220" width="4" height="20" fill="#62160d" />
        <line x1="38" y1="215" x2="38" y2="168" stroke="#62160d" strokeWidth="3" />
        <path d="M8 170 Q38 140 68 170 Z" fill="#FFC549" stroke="#62160d" strokeWidth="2" />
        <path d="M30 210 h12 v-6 a6 6 0 0 0 -12 0 z" fill="#fff" stroke="#b9917f" />
      </g>
      {/* ---- left side: bookshop ---- */}
      <g>
        <rect x="290" y="90" width="150" height="150" fill="#eadbe8" stroke="#cdb7c8" strokeWidth="2" />
        <rect x="290" y="90" width="150" height="22" fill="#2f6f8f" />
        <text x="365" y="106" textAnchor="middle" fontFamily="Georgia, serif" fontSize="12" fill="#fff" letterSpacing="3">BOOKS</text>
        <rect x="305" y="128" width="120" height="70" rx="3" fill="#cfe6ee" stroke="#9fb6c0" strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={312 + i * 16} y={172} width="10" height="22" fill={['#c96a4a', '#62160d', '#d98e04', '#3f7a4f'][i % 4]} />)}
        <rect x="350" y="205" width="30" height="35" fill="#7a5a4c" />
      </g>
      {/* ---- right side: bakery ---- */}
      <g>
        <rect x="760" y="100" width="170" height="140" fill="#fbe9d0" stroke="#e0c49f" strokeWidth="2" />
        <rect x="760" y="100" width="170" height="20" fill="#d98e04" />
        <text x="845" y="115" textAnchor="middle" fontFamily="Georgia, serif" fontSize="12" fill="#62160d" letterSpacing="3">BAKERY</text>
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${760 + i * 24.3} 120 h24.3 v12 a12.15 7 0 0 1 -24.3 0 z`} fill={i % 2 ? '#fff' : '#d98e04'} />)}
        <rect x="778" y="150" width="90" height="56" rx="4" fill="#cfe6ee" stroke="#c9a77d" strokeWidth="2" />
        <circle cx="800" cy="192" r="7" fill="#e0a35a" /><circle cx="822" cy="194" r="6" fill="#c98a3f" /><ellipse cx="846" cy="193" rx="10" ry="6" fill="#e0a35a" />
        <rect x="880" y="160" width="36" height="80" fill="#8a5a3c" />
      </g>
      {/* ---- right side: shophouse ---- */}
      <g>
        <rect x="950" y="80" width="190" height="160" fill="#e9d4c9" stroke="#cdb3a5" strokeWidth="2" />
        {[0, 1, 2].map((i) => <rect key={i} x={968 + i * 58} y={96} width="40" height="40" rx="3" fill="#fff6e6" stroke="#b9917f" strokeWidth="2" />)}
        <rect x="950" y="146" width="190" height="12" fill="#3f7a4f" />
        <text x="1045" y="155" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fill="#fff" letterSpacing="2">MINI MART</text>
        <rect x="970" y="170" width="70" height="70" fill="#cfe6ee" stroke="#b9917f" strokeWidth="2" />
        <rect x="1060" y="170" width="60" height="70" fill="#9a6b55" />
      </g>
      {/* trees + lamps */}
      {[470, 700].map((x) => <g key={x}><rect x={x - 3} y="170" width="6" height="70" fill="#6a4a3c" /><circle cx={x} cy="160" r="26" fill="#3f7a4f" /><circle cx={x - 14} cy="172" r="16" fill="#2f6440" /></g>)}
      {[560, 640].map((x) => <g key={x}><rect x={x - 2} y="150" width="4" height="90" fill="#62160d" /><circle cx={x} cy="148" r="7" fill="#FFC549" /></g>)}
      {/* pavement */}
      <rect x="0" y="238" width="1200" height="22" fill="#e6d3c8" />
      {Array.from({ length: 30 }, (_, i) => <line key={i} x1={i * 42} y1="238" x2={i * 42} y2="260" stroke="#d6c0b2" strokeWidth="2" />)}
    </>
  );
}
