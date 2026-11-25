import HeroVideo from '../components/HeroVideo.jsx';
import React, { useState } from 'react';
import AskButton from '../components/AskButton.jsx';
import { toCSV, downloadText } from '../lib/csv.js';

// Linear model. Demand: P = A - B·Q.  Supply: P = C + D·Q.
// A demand shift of s units moves the curve right by s (more demanded at every price).
const A = 100, B = 1, C = 10, D = 1;
const QMAX = 100, PMAX = 110;

function equilibrium(dShift, sShift) {
  const a = A + B * dShift;           // demand: P = a - B·Q
  const c = C - D * sShift;           // supply: P = c + D·Q
  const q = (a - c) / (B + D);
  const p = a - B * q;
  return { q: Math.max(0, q), p: Math.max(0, p), a, c };
}

const r1 = (x) => Math.round(x * 10) / 10;

export default function Lab() {
  return (
    <>
      <section className="page-hero video-hero">
        <HeroVideo name="lab" />
        <div className="container">
          <p className="eyebrow">Economics Lab</p>
          <h1>Learn by doing</h1>
          <p className="lead">Experiment with supply and demand, then practise calculating inflation from CPI data.</p>
        </div>
      </section>
      <Simulator />
      <CPIExercise />
    </>
  );
}

function Simulator() {
  const [dShift, setD] = useState(0);
  const [sShift, setS] = useState(0);
  const e0 = equilibrium(0, 0);
  const e1 = equilibrium(dShift, sShift);
  const changed = dShift !== 0 || sShift !== 0;

  const describe = (v, curve) => (v === 0 ? 'no shift' : `${curve} shifted ${v > 0 ? 'right (increase)' : 'left (decrease)'} by ${Math.abs(v)} units`);

  const context = () => ({
    origin: 'simulator',
    title: 'Supply and demand simulator',
    details: {
      model: 'Linear: demand P = 100 − Q, supply P = 10 + Q (before shifts)',
      demandShift: `${dShift} (${describe(dShift, 'demand')})`,
      supplyShift: `${sShift} (${describe(sShift, 'supply')})`,
      originalEquilibrium: { price: r1(e0.p), quantity: r1(e0.q) },
      newEquilibrium: { price: r1(e1.p), quantity: r1(e1.q) },
      change: { price: r1(e1.p - e0.p), quantity: r1(e1.q - e0.q) },
    },
  });

  // graph geometry
  const W = 520, H = 400, m = { t: 20, r: 20, b: 44, l: 52 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const x = (q) => (q / QMAX) * iw;
  const y = (p) => ih - (p / PMAX) * ih;
  const lineD = (a) => { const q2 = Math.min(QMAX, a / B); return [x(0), y(Math.min(PMAX, a)), x(q2), y(a - B * q2)]; };
  const lineS = (c) => { const q1 = Math.max(0, -c / D); const q2 = Math.min(QMAX, (PMAX - c) / D); return [x(q1), y(c + D * q1), x(q2), y(c + D * q2)]; };
  const L = ([x1, y1, x2, y2], cls, key) => <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} className={cls} />;

  return (
    <section className="section container" aria-labelledby="sim-h">
      <h2 id="sim-h" className="section-title">Supply and demand simulator</h2>
      <p className="muted">Move the sliders to shift demand and supply independently. Dashed lines show the original curves; solid lines show the new ones.</p>
      <div className="sim-grid">
        <div className="card sim-graph">
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Supply and demand graph. Original equilibrium price ${r1(e0.p)}, quantity ${r1(e0.q)}. New equilibrium price ${r1(e1.p)}, quantity ${r1(e1.q)}.`}>
            <defs>
              <clipPath id="plot"><rect width={iw} height={ih} /></clipPath>
            </defs>
            <g transform={`translate(${m.l},${m.t})`}>
              {[0, 20, 40, 60, 80, 100].map((p) => (
                <g key={`p${p}`}><line x2={iw} y1={y(p)} y2={y(p)} className="grid" /><text x={-8} y={y(p)} dy="0.32em" textAnchor="end" className="tick">{p}</text></g>
              ))}
              {[0, 20, 40, 60, 80, 100].map((q) => (
                <text key={`q${q}`} x={x(q)} y={ih + 18} textAnchor="middle" className="tick">{q}</text>
              ))}
              <line y2={ih} className="axis" /><line y1={ih} y2={ih} x2={iw} className="axis" />
              <text x={iw / 2} y={ih + 38} textAnchor="middle" className="axis-label">Quantity</text>
              <text transform={`translate(-38,${ih / 2}) rotate(-90)`} textAnchor="middle" className="axis-label">Price (B$)</text>
              <g clipPath="url(#plot)">
                {changed && L(lineD(e0.a), 'curve demand original', 'd0')}
                {changed && L(lineS(e0.c), 'curve supply original', 's0')}
                {L(lineD(e1.a), 'curve demand', 'd1')}
                {L(lineS(e1.c), 'curve supply', 's1')}
                {/* original equilibrium guides */}
                <line x1={x(e0.q)} x2={x(e0.q)} y1={y(e0.p)} y2={ih} className="guide" />
                <line x1={0} x2={x(e0.q)} y1={y(e0.p)} y2={y(e0.p)} className="guide" />
                {changed && <>
                  <line x1={x(e1.q)} x2={x(e1.q)} y1={y(e1.p)} y2={ih} className="guide new" />
                  <line x1={0} x2={x(e1.q)} y1={y(e1.p)} y2={y(e1.p)} className="guide new" />
                </>}
                <circle cx={x(e0.q)} cy={y(e0.p)} r="6" className="eq original" />
                {changed && <circle cx={x(e1.q)} cy={y(e1.p)} r="7" className="eq new" />}
              </g>
              <text x={x(e0.q) + 9} y={y(e0.p) - 9} className="eq-label">E₀</text>
              {changed && <text x={x(e1.q) + 9} y={y(e1.p) + 18} className="eq-label new">E₁</text>}
              <text x={lineD(e1.a)[2] - 4} y={lineD(e1.a)[3] - 8} textAnchor="end" className="curve-label demand">D</text>
              <text x={lineS(e1.c)[2] - 6} y={lineS(e1.c)[3] + 16} textAnchor="end" className="curve-label supply">S</text>
            </g>
          </svg>
        </div>
        <div className="card sim-controls">
          <label className="slider">
            <span>Demand shift: <strong>{dShift > 0 ? '+' : ''}{dShift}</strong></span>
            <input type="range" min="-30" max="30" step="1" value={dShift} onChange={(e) => setD(+e.target.value)} aria-describedby="d-help" />
            <small id="d-help">Right = demand increases (e.g. higher incomes). Left = demand falls.</small>
          </label>
          <label className="slider">
            <span>Supply shift: <strong>{sShift > 0 ? '+' : ''}{sShift}</strong></span>
            <input type="range" min="-30" max="30" step="1" value={sShift} onChange={(e) => setS(+e.target.value)} aria-describedby="s-help" />
            <small id="s-help">Right = supply increases (e.g. lower costs). Left = supply falls.</small>
          </label>
          <table className="eq-table">
            <thead><tr><th scope="col"></th><th scope="col">Price (B$)</th><th scope="col">Quantity</th></tr></thead>
            <tbody>
              <tr><th scope="row">Original (E₀)</th><td data-testid="p0">{r1(e0.p)}</td><td data-testid="q0">{r1(e0.q)}</td></tr>
              <tr><th scope="row">New (E₁)</th><td data-testid="p1">{r1(e1.p)}</td><td data-testid="q1">{r1(e1.q)}</td></tr>
              <tr className="delta"><th scope="row">Change</th><td>{signed(e1.p - e0.p)}</td><td>{signed(e1.q - e0.q)}</td></tr>
            </tbody>
          </table>
          <div className="card-actions">
            <button className="btn btn-ghost btn-small" onClick={() => { setD(0); setS(0); }}>Reset</button>
            <AskButton className="btn-small" context={context} />
          </div>
        </div>
      </div>
    </section>
  );
}

const signed = (v) => { const r = r1(v); return r > 0 ? `+${r}` : `${r}`; };

const CPI = [
  { year: 2020, cpi: 100.0 }, { year: 2021, cpi: 101.7 }, { year: 2022, cpi: 105.5 },
  { year: 2023, cpi: 105.9 }, { year: 2024, cpi: 105.5 }, { year: 2025, cpi: 105.8 },
];

function CPIExercise() {
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState(null);
  const correct = ((105.5 - 101.7) / 101.7) * 100; // 2022

  const check = (e) => {
    e.preventDefault();
    const v = parseFloat(answer);
    setChecked(isNaN(v) ? 'empty' : Math.abs(v - correct) <= 0.05 ? 'right' : 'wrong');
  };

  return (
    <section className="section container" aria-labelledby="cpi-h">
      <h2 id="cpi-h" className="section-title">Guided exercise: annual inflation from CPI</h2>
      <p className="notice notice-sample" role="note"><strong>Practice data:</strong> the CPI values below are sample figures for learning, not official statistics.</p>
      <div className="exercise-grid">
        <div className="card">
          <h3>The data</h3>
          <table className="sheet">
            <thead><tr><th></th><th>A</th><th>B</th><th>C</th></tr></thead>
            <tbody>
              <tr><th>1</th><td>Year</td><td>CPI (2020 = 100)</td><td>Inflation (%)</td></tr>
              {CPI.map((r, i) => (
                <tr key={r.year}><th>{i + 2}</th><td>{r.year}</td><td>{r.cpi.toFixed(1)}</td><td className="muted">{i === 0 ? '—' : `=(B${i + 2}-B${i + 1})/B${i + 1}*100`}</td></tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-ghost btn-small" onClick={() => downloadText('cpi-practice_SAMPLE.csv', toCSV(CPI.map((r) => ({ year: r.year, cpi_index: r.cpi, note: 'SAMPLE practice data' })), ['year', 'cpi_index', 'note']))}>
            Download practice data (CSV)
          </button>
        </div>
        <div className="card">
          <h3>Steps in Excel or Google Sheets</h3>
          <ol className="steps">
            <li>Open the CSV in Excel or Google Sheets (File → Import in Sheets). Years go in column A and CPI in column B, with headings in row 1.</li>
            <li>Inflation compares each year’s CPI with the year before: <code>(CPI this year − CPI last year) ÷ CPI last year × 100</code>.</li>
            <li>2020 is the first year, so it has no previous year to compare with. Start in <strong>C3</strong> (2021) and type <code>=(B3-B2)/B2*100</code>, then press Enter.</li>
            <li>Drag the small square at the corner of C3 down to C7 to fill the formula for every year.</li>
            <li>Round to one decimal place: <code>=ROUND((B3-B2)/B2*100,1)</code>, or use the “Decrease decimal” button.</li>
            <li>A negative result means prices fell on average (deflation).</li>
          </ol>
          <form onSubmit={check} className="check-form">
            <label htmlFor="cpi-answer">Your turn: what was inflation in <strong>2022</strong>? (%)</label>
            <div className="row">
              <input id="cpi-answer" inputMode="decimal" value={answer} onChange={(e) => { setAnswer(e.target.value); setChecked(null); }} placeholder="e.g. 1.7" />
              <button className="btn btn-small" type="submit">Check</button>
            </div>
            <p aria-live="polite" className={`check-result ${checked || ''}`}>
              {checked === 'right' && `Correct! (105.5 − 101.7) ÷ 101.7 × 100 = ${correct.toFixed(2)}%, about ${r1(correct)}%.`}
              {checked === 'wrong' && 'Not quite. Use the 2022 CPI (105.5) and the 2021 CPI (101.7) in the formula from step 2.'}
              {checked === 'empty' && 'Type a number first.'}
            </p>
          </form>
          <AskButton
            className="btn-small"
            label="Ask ESynC for help"
            context={{ origin: 'lab', title: 'CPI inflation exercise', details: { exercise: 'Calculate annual inflation from CPI (sample practice data)', data: CPI, studentAnswer2022: answer || 'not answered yet' } }}
          />
        </div>
      </div>
    </section>
  );
}
