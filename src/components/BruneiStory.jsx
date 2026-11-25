import React, { useEffect, useMemo, useRef, useState } from 'react';
import { loadIndicators } from '../lib/data.js';

/**
 * Scroll-driven Brunei panorama. As you scroll, the scene pans from Bandar Seri Begawan
 * (Omar Ali Saifuddien Mosque) past Kampong Ayer and offshore oil & gas to the Temburong
 * Bridge. Each stop shows a figure from the dashboard data (labelled sample until official).
 */
const W = 2400; const H = 600;

export default function BruneiStory() {
  const sceneRef = useRef(null);
  const svgRef = useRef(null);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState({});
  const drag = useRef(null);

  useEffect(() => {
    loadIndicators().then((list) => {
      const by = Object.fromEntries(list.map((i) => [i.id, i]));
      const latest = (id, col = 'value') => {
        const ind = by[id]; if (!ind) return null;
        const row = [...ind.rows].reverse().find((r) => typeof r[col] === 'number');
        return row ? { year: row.year, value: row[col], sample: ind.status !== 'official', source: ind.source, sourceUrl: ind.sourceUrl } : null;
      };
      setData({ gdp: latest('real-gdp-growth'), infl: latest('inflation'), unemp: latest('unemployment'),
        oil: latest('oil-vs-non-oil-gdp', 'oil_and_gas'), nonoil: latest('oil-vs-non-oil-gdp', 'non_oil_and_gas') });
    }).catch(() => {});
  }, []);

  const fmt = (d) => (d ? `${d.value > 0 ? '+' : ''}${d.value}%` : '…');
  const stat = (d, label) => d && { label: `${label}, ${d.year}`, value: label.startsWith('Unemployment') ? `${d.value}%` : fmt(d), sample: d.sample, source: d.source, sourceUrl: d.sourceUrl };
  const steps = [
    { x: 380, name: 'Welcome', title: 'Welcome to Brunei’s economy', text: 'Start at the Omar Ali Saifuddien Mosque in Bandar Seri Begawan. Use the arrows or swipe to travel across the economy.', stats: [] },
    { x: 400, name: 'The capital', title: 'Jobs and prices in the capital', text: 'Bandar Seri Begawan is where most people work, shop and pay the bills. Two numbers matter most to households: how fast prices rise, and how many people can’t find work.', stats: [stat(data.infl, 'Inflation'), stat(data.unemp, 'Unemployment')] },
    { x: 1010, name: 'Visit Brunei 2027', title: 'Visit Brunei Year 2027', text: 'Brunei is preparing for Visit Brunei Year 2027, a national campaign to grow tourism and diversify the economy. Heritage sites like Kampong Ayer, one of the world’s largest water villages, are part of the draw.', stats: [], link: { href: 'https://www.thestar.com.my/aseanplus/aseanplus-news/2026/06/25/visit-brunei-year-to-be-held-in-2027', label: 'Read about the campaign' } },
    { x: 1620, name: 'Oil and gas', title: 'Oil and gas', text: 'Offshore platforms and LNG exports are still the backbone of the economy. Compare their growth with everything else.', stats: [stat(data.oil, 'Oil & gas GDP growth'), stat(data.nonoil, 'Non-oil & gas GDP growth')] },
    { x: 2150, name: 'Temburong', title: 'Temburong Bridge: the road ahead', text: 'New links and new sectors to diversify the economy. Overall, how fast is the economy growing?', stats: [stat(data.gdp, 'Real GDP growth')] },
  ];
  const go = (i) => setStep(Math.max(0, Math.min(steps.length - 1, i)));

  // centre the current stop on screen
  useEffect(() => {
    const place = () => {
      const scene = sceneRef.current; const svg = svgRef.current; if (!scene || !svg) return;
      const sw = svg.getBoundingClientRect().width; const vw = scene.clientWidth;
      const want = vw * 0.62 - (steps[step].x / W) * sw;
      setOffset(Math.min(0, Math.max(vw - sw, want)));
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [step]);

  // gentle autoplay, paused on hover/touch
  useEffect(() => {
    if (paused || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setTimeout(() => setStep((s) => (s + 1) % steps.length), 7000);
    return () => clearTimeout(t);
  }, [step, paused]);

  const onDown = (e) => { drag.current = { x: e.clientX }; setPaused(true); };
  const onUp = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x; drag.current = null;
    if (dx < -40) go(step + 1); else if (dx > 40) go(step - 1);
  };
  const onKey = (e) => { if (e.key === 'ArrowRight') { go(step + 1); setPaused(true); } if (e.key === 'ArrowLeft') { go(step - 1); setPaused(true); } };

  const cur = steps[step];
  const anySample = Object.values(data).some((d) => d && d.sample);
  return (
    <section className="brunei-story" aria-roledescription="carousel" aria-label="Brunei’s economy at a glance"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onKeyDown={onKey}>
      <div className="bs-scene" ref={sceneRef} onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => { drag.current = null; }}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMinYMid meet" className="bs-svg"
          style={{ transform: `translateX(${offset}px)` }} aria-hidden="true">
          <Scene sunX={300 + step * 470} sunY={150 - Math.sin((step / (steps.length - 1)) * Math.PI) * 70} tankerIn={step >= 3} />
        </svg>
      </div>
      <div className="bs-panel container">
        <div className="bs-card" key={step} aria-live="polite">
          <span className="bs-step">{step + 1} / {steps.length}</span>
          <h2>{cur.title}</h2>
          <p>{cur.text}</p>
          {cur.stats.filter(Boolean).length > 0 && (
            <div className="bs-stats">
              {cur.stats.filter(Boolean).map((s) => (
                <div key={s.label} className="bs-stat"><span className="bs-value">{s.value}</span><span className="bs-label">{s.label}{s.sample ? ' · sample' : ''}</span>{s.source && <a className="bs-src" href={s.sourceUrl} target="_blank" rel="noopener noreferrer">Source: {s.source}</a>}</div>
              ))}
            </div>
          )}
          {cur.link && <a className="bs-link" href={cur.link.href} target="_blank" rel="noopener noreferrer">{cur.link.label} ↗</a>}
          {step === steps.length - 1 && <a className="btn btn-small" href="#/dashboard">Explore the data →</a>}
        </div>
        <div className="bs-controls">
          <button type="button" className="bs-arrow" onClick={() => { go(step - 1); setPaused(true); }} disabled={step === 0} aria-label="Previous stop">←</button>
          <div className="bs-chips" role="tablist" aria-label="Stops">
            {steps.map((s, i) => (
              <button key={s.name} type="button" role="tab" aria-selected={i === step} className={`bs-chip ${i === step ? 'on' : ''}`} onClick={() => { go(i); setPaused(true); }}>{s.name}</button>
            ))}
          </div>
          <button type="button" className="bs-arrow" onClick={() => { go(step + 1); setPaused(true); }} disabled={step === steps.length - 1} aria-label="Next stop">→</button>
        </div>
        {anySample && <p className="bs-note">Figures are sample data until official DEPS figures are added.</p>}
      </div>
    </section>
  );
}

function Scene({ sunX, sunY, tankerIn }) {
  const houses = useMemo(() => {
    const out = [];
    for (let i = 0; i < 16; i++) {
      const x = 760 + i * 34 + (i % 3) * 6; const y = 420 - (i % 2) * 12;
      const roof = ['#c96a4a', '#62160d', '#d98e04', '#2f6f8f'][i % 4];
      out.push(<g key={i}>
        <rect x={x} y={y} width="28" height="26" fill="#fff6e6" stroke="#b9917f" />
        <path d={`M${x - 3} ${y} L${x + 14} ${y - 14} L${x + 31} ${y} Z`} fill={roof} />
        <rect x={x + 10} y={y + 10} width="8" height="16" fill="#b9917f" />
        <line x1={x + 4} y1={y + 26} x2={x + 4} y2={470} stroke="#8a6a5c" strokeWidth="2" />
        <line x1={x + 24} y1={y + 26} x2={x + 24} y2={470} stroke="#8a6a5c" strokeWidth="2" />
      </g>);
    }
    return out;
  }, []);
  const trees = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const x = 1960 + i * 32; const h = 40 + (i * 37) % 30;
    return <g key={i}><rect x={x + 9} y={440 - h / 2} width="4" height={h / 2 + 30} fill="#5a3b2e" /><circle cx={x + 11} cy={440 - h / 2} r={16 + (i % 3) * 3} fill={i % 2 ? '#3f7a4f' : '#2f6440'} /></g>;
  }), []);

  return (
    <>
      <defs>
        <linearGradient id="bs-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff3d1" /><stop offset="1" stopColor="#ffe6a6" /></linearGradient>
        <linearGradient id="bs-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fbfcf" /><stop offset="1" stopColor="#5f97ab" /></linearGradient>
        <linearGradient id="bs-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe08a" /><stop offset="1" stopColor="#d9a12a" /></linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#bs-sky)" />
      <circle className="bs-sun" cx={sunX} cy={sunY} r="46" fill="#FFC549" opacity=".9" />
      {/* distant hills */}
      <path d={`M0 430 Q200 360 420 410 T860 400 T1300 420 T1760 390 T2400 410 V470 H0Z`} fill="#e9cdbf" />

      {/* ===== Bandar Seri Begawan: towers + Omar Ali Saifuddien Mosque ===== */}
      <g fill="#d9b8aa">
        <rect x="40" y="300" width="60" height="170" /><rect x="110" y="260" width="48" height="210" /><rect x="560" y="290" width="56" height="180" /><rect x="624" y="320" width="50" height="150" />
      </g>
      <g fill="#fff6e6" opacity=".9">{[0, 1, 2, 3, 4, 5].map((r) => <g key={r}><rect x="52" y={312 + r * 24} width="10" height="12" /><rect x="76" y={312 + r * 24} width="10" height="12" /><rect x="120" y={276 + r * 26} width="10" height="12" /><rect x="138" y={276 + r * 26} width="10" height="12" /></g>)}</g>
      {/* mosque */}
      <g>
        <rect x="236" y="380" width="250" height="90" fill="#fbf7ef" stroke="#cdbba8" strokeWidth="2" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${252 + i * 46} 470 v-42 a14 14 0 0 1 28 0 v42`} fill="#e9dccb" />)}
        <rect x="300" y="320" width="120" height="62" fill="#fbf7ef" stroke="#cdbba8" strokeWidth="2" />
        <path d="M296 322 Q360 196 424 322 Z" fill="url(#bs-gold)" stroke="#b07a10" strokeWidth="2" />
        <line x1="360" y1="236" x2="360" y2="212" stroke="#b07a10" strokeWidth="3" />
        <path d="M352 214 a8 8 0 1 0 16 0 a6 6 0 1 1 -16 0" fill="#d9a12a" />
        {[236, 486].map((x) => <path key={x} d={`M${x - 14} 382 Q${x} 352 ${x + 14} 382 Z`} fill="url(#bs-gold)" />)}
        {/* minaret */}
        <rect x="508" y="230" width="18" height="240" fill="#fbf7ef" stroke="#cdbba8" strokeWidth="2" />
        <rect x="502" y="300" width="30" height="8" fill="#e9dccb" /><rect x="502" y="380" width="30" height="8" fill="#e9dccb" />
        <path d="M504 232 Q517 196 530 232 Z" fill="url(#bs-gold)" />
      </g>

      {/* water across the whole scene */}
      <rect x="0" y="470" width={W} height="130" fill="url(#bs-water)" />
      <g stroke="#cfe6ee" strokeWidth="3" strokeLinecap="round" opacity=".7">
        {Array.from({ length: 30 }, (_, i) => <line key={i} x1={i * 82 + 10} y1={500 + (i % 3) * 30} x2={i * 82 + 44} y2={500 + (i % 3) * 30} />)}
      </g>
      {/* mosque reflection */}
      <path d="M296 472 Q360 560 424 472 Z" fill="#ffe08a" opacity=".25" />

      {/* ===== Kampong Ayer ===== */}
      <rect x="745" y="444" width="560" height="6" fill="#8a6a5c" />
      {houses}
      {/* water taxis */}
      {[0, 1].map((i) => {
        return <g key={i} className={`bs-taxi t${i}`} style={{ transform: `translate(720px, ${520 + i * 30}px)` }}>
          <path d="M0 0 h70 l-10 16 h-52 z" fill={i ? '#62160d' : '#2f6f8f'} />
          <rect x="18" y="-12" width="30" height="12" rx="3" fill="#fff6e6" stroke="#8a6a5c" />
          <path d="M-6 10 q-12 4 -24 0" stroke="#e8f4f8" strokeWidth="3" fill="none" />
        </g>;
      })}

      {/* Visit Brunei 2027 banner plane */}
      <g className="bs-plane">
        <line x1="940" y1="150" x2="1000" y2="150" stroke="#8a6a5c" strokeWidth="2" />
        <rect x="700" y="128" width="240" height="44" rx="6" fill="#62160d" />
        <text x="820" y="157" textAnchor="middle" fontFamily="Georgia, serif" fontSize="22" fill="#FFC549" letterSpacing="2">VISIT BRUNEI 2027</text>
        <path d="M1000 150 l30 -10 h40 q14 0 14 10 q0 10 -14 10 h-40 z" fill="#fff6e6" stroke="#62160d" strokeWidth="2.5" />
        <path d="M1040 140 l-14 -22 h14 l18 22 z M1040 160 l-14 22 h14 l18 -22 z" fill="#FFC549" stroke="#62160d" strokeWidth="2" />
        <path d="M1002 142 l-8 -12 h8 l8 12 z" fill="#FFC549" stroke="#62160d" strokeWidth="2" />
      </g>

      {/* ===== Offshore oil & gas ===== */}
      <g transform="translate(1440 0)">
        <rect x="0" y="400" width="200" height="14" fill="#62160d" />
        {[10, 60, 130, 180].map((x) => <rect key={x} x={x} y="414" width="10" height="120" fill="#8a3a2a" />)}
        <path d="M20 400 L60 260 L100 400" fill="none" stroke="#62160d" strokeWidth="6" />
        <path d="M36 344 H84 M46 304 H74" stroke="#62160d" strokeWidth="4" />
        <rect x="120" y="350" width="60" height="50" fill="#d98e04" />
        <rect x="150" y="300" width="10" height="50" fill="#62160d" />
        <path className="bs-flame" d="M155 300 q-14 -22 0 -44 q14 22 0 44" fill="#ff8a2a" />
      </g>
      {/* LNG tanker sails in */}
      <g className="bs-tanker" style={{ transform: `translate(${tankerIn ? 1860 : 1300}px, 500px)` }}>
        <path d="M0 0 h220 l-24 34 h-176 z" fill="#62160d" />
        {[40, 90, 140].map((x) => <circle key={x} cx={x} cy="-8" r="20" fill="#fff6e6" stroke="#b9917f" strokeWidth="2" />)}
        <rect x="176" y="-30" width="28" height="30" fill="#fff6e6" stroke="#b9917f" />
        <text x="110" y="24" textAnchor="middle" fontFamily="Georgia, serif" fontSize="14" fill="#FFC549" letterSpacing="2">LNG</text>
      </g>

      {/* ===== Temburong Bridge + rainforest ===== */}
      {trees}
      <rect x="1880" y="455" width="520" height="10" fill="#7a5a4c" />
      {[1900, 1990, 2080, 2170, 2260, 2350].map((x) => <rect key={x} x={x} y="465" width="8" height="40" fill="#7a5a4c" />)}
      {[2040, 2240].map((x) => <g key={x}>
        <rect x={x - 6} y="330" width="12" height="130" fill="#62160d" />
        {[-110, -70, -35, 35, 70, 110].map((dx) => <line key={dx} x1={x} y1="336" x2={x + dx} y2="455" stroke="#62160d" strokeWidth="2" />)}
      </g>)}
    </>
  );
}
