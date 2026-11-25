import React, { useEffect, useMemo, useRef, useState } from 'react';
import { loadIndicators } from '../lib/data.js';

/**
 * Scroll-driven Brunei panorama. As you scroll, the scene pans from Bandar Seri Begawan
 * (Omar Ali Saifuddien Mosque) past Kampong Ayer and offshore oil & gas to the Temburong
 * Bridge. Each stop shows a figure from the dashboard data (labelled sample until official).
 */
const W = 2400; const H = 600;

export default function BruneiStory() {
  const outerRef = useRef(null);
  const [p, setP] = useState(0);           // scroll progress 0..1
  const [data, setData] = useState({});

  useEffect(() => {
    loadIndicators().then((list) => {
      const by = Object.fromEntries(list.map((i) => [i.id, i]));
      const latest = (id, col = 'value') => {
        const ind = by[id]; if (!ind) return null;
        const row = [...ind.rows].reverse().find((r) => typeof r[col] === 'number');
        return row ? { year: row.year, value: row[col], sample: ind.status !== 'official', source: ind.source } : null;
      };
      setData({
        gdp: latest('real-gdp-growth'),
        infl: latest('inflation'),
        unemp: latest('unemployment'),
        oil: latest('oil-vs-non-oil-gdp', 'oil_and_gas'),
        nonoil: latest('oil-vs-non-oil-gdp', 'non_oil_and_gas'),
      });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = outerRef.current; if (!el) return;
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        setP(reduce ? 0 : Math.min(1, Math.max(0, -r.top / Math.max(1, total))));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const fmt = (d, unit = '%') => (d ? `${d.value > 0 ? '+' : ''}${d.value}${unit}` : '…');
  const steps = [
    { title: 'Bandar Seri Begawan', text: 'Brunei’s capital, home to the Omar Ali Saifuddien Mosque. Scroll to travel across Brunei’s economy.', stat: null },
    { title: 'Kampong Ayer', text: 'The water village where daily life and small businesses shape household spending.', stat: data.infl && { label: `Inflation, ${data.infl.year}`, value: fmt(data.infl), sample: data.infl.sample },
      stat2: data.unemp && { label: `Unemployment, ${data.unemp.year}`, value: `${data.unemp.value}%`, sample: data.unemp.sample } },
    { title: 'Oil and gas', text: 'Offshore platforms and LNG exports remain the backbone of Brunei’s economy.', stat: data.oil && { label: `Oil & gas GDP growth, ${data.oil.year}`, value: fmt(data.oil), sample: data.oil.sample },
      stat2: data.nonoil && { label: `Non-oil & gas GDP growth, ${data.nonoil.year}`, value: fmt(data.nonoil), sample: data.nonoil.sample } },
    { title: 'Temburong Bridge', text: 'New links and new sectors: diversifying the economy for the next generation.', stat: data.gdp && { label: `Real GDP growth, ${data.gdp.year}`, value: fmt(data.gdp), sample: data.gdp.sample } },
  ];
  const step = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999));
  const anySample = Object.values(data).some((d) => d && d.sample);

  // motion values driven by scroll
  const pan = p;                                  // camera 0..1
  const taxi = (p * 3) % 1;                       // water taxis loop
  const tanker = Math.min(1, Math.max(0, (p - 0.35) / 0.5));
  const sunX = 200 + p * 2000;
  const sunY = 150 - Math.sin(p * Math.PI) * 70;

  return (
    <section className="brunei-story" ref={outerRef} aria-label="Brunei’s economy at a glance">
      <div className="bs-sticky">
        <div className="bs-scene">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMinYMid slice" className="bs-svg"
            style={{ transform: `translateX(calc(${(-pan).toFixed(4)} * (100% - 100vw)))` }} aria-hidden="true">
            <Scene sunX={sunX} sunY={sunY} taxi={taxi} tanker={tanker} />
          </svg>
        </div>
        <div className="bs-panel container">
          <div className="bs-card" key={step}>
            <span className="bs-step">{step + 1} / {steps.length}</span>
            <h2>{steps[step].title}</h2>
            <p>{steps[step].text}</p>
            {(steps[step].stat || steps[step].stat2) && (
              <div className="bs-stats">
                {[steps[step].stat, steps[step].stat2].filter(Boolean).map((s) => (
                  <div key={s.label} className="bs-stat">
                    <span className="bs-value">{s.value}</span>
                    <span className="bs-label">{s.label}{s.sample ? ' · sample' : ''}</span>
                  </div>
                ))}
              </div>
            )}
            {step === steps.length - 1 && <a className="btn btn-small" href="#/dashboard">Explore the data →</a>}
          </div>
          <div className="bs-dots" aria-hidden="true">{steps.map((_, i) => <i key={i} className={i === step ? 'on' : ''} />)}</div>
          {anySample && <p className="bs-note">Figures come from the dashboard and are sample data until official DEPS figures are added.</p>}
        </div>
      </div>
    </section>
  );
}

function Scene({ sunX, sunY, taxi, tanker }) {
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
      <circle cx={sunX} cy={sunY} r="46" fill="#FFC549" opacity=".9" />
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
      {[0, 0.5].map((o, i) => {
        const x = 720 + ((taxi + o) % 1) * 640;
        return <g key={i} transform={`translate(${x} ${520 + i * 30})`}>
          <path d="M0 0 h70 l-10 16 h-52 z" fill={i ? '#62160d' : '#2f6f8f'} />
          <rect x="18" y="-12" width="30" height="12" rx="3" fill="#fff6e6" stroke="#8a6a5c" />
          <path d="M-6 10 q-12 4 -24 0" stroke="#e8f4f8" strokeWidth="3" fill="none" />
        </g>;
      })}

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
      <g transform={`translate(${1300 + tanker * 560} 500)`}>
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
