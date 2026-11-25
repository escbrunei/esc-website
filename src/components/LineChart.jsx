import React, { useEffect, useRef, useState } from 'react';

const COLORS = ['#62160d', '#d98e04', '#2f6f8f'];

function niceTicks(min, max, count = 5) {
  if (min === max) { min -= 1; max += 1; }
  const span = max - min;
  const step0 = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count) || step0;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.round(v * 1000) / 1000);
  return ticks;
}

/**
 * Multi-series line chart with tooltips (mouse, touch and keyboard).
 * series: [{ label, points: [{ x: year, y: number|null }] }]
 */
export default function LineChart({ series, unit, sample, title }) {
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(600);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(260, e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const height = width < 480 ? 230 : 280;
  const m = { top: 16, right: 16, bottom: 30, left: 44 };
  const xs = [...new Set(series.flatMap((s) => s.points.map((p) => p.x)))].sort((a, b) => a - b);
  const ys = series.flatMap((s) => s.points.map((p) => p.y)).filter((v) => typeof v === 'number');

  if (!xs.length || !ys.length) {
    return <div className="chart-empty">No data in the selected years.</div>;
  }

  const ticks = niceTicks(Math.min(0, ...ys), Math.max(0, ...ys));
  const yMin = ticks[0];
  const yMax = ticks[ticks.length - 1];
  const iw = width - m.left - m.right;
  const ih = height - m.top - m.bottom;
  const xPos = (x) => (xs.length === 1 ? iw / 2 : ((x - xs[0]) / (xs[xs.length - 1] - xs[0])) * iw);
  const yPos = (y) => ih - ((y - yMin) / (yMax - yMin)) * ih;
  const labelEvery = Math.ceil(xs.length / Math.max(2, Math.floor(iw / 48)));

  const pick = (clientX) => {
    const rect = wrapRef.current.querySelector('svg').getBoundingClientRect();
    const px = clientX - rect.left - m.left;
    let best = 0;
    xs.forEach((x, i) => { if (Math.abs(xPos(x) - px) < Math.abs(xPos(xs[best]) - px)) best = i; });
    setActive(best);
  };

  const onKey = (e) => {
    if (e.key === 'ArrowRight') { setActive((a) => Math.min(xs.length - 1, a == null ? 0 : a + 1)); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { setActive((a) => Math.max(0, a == null ? xs.length - 1 : a - 1)); e.preventDefault(); }
    if (e.key === 'Escape') setActive(null);
  };

  const ax = active != null ? xs[active] : null;
  const tipLeft = ax != null ? m.left + xPos(ax) : 0;

  return (
    <div className="chart" ref={wrapRef}>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={`${title} chart${sample ? ' (sample data)' : ''}. Use left and right arrow keys to read values.`}
        tabIndex={0}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
      >
        <g transform={`translate(${m.left},${m.top})`}>
          {sample && (
            <text x={iw / 2} y={ih / 2} textAnchor="middle" className="chart-watermark">SAMPLE DATA</text>
          )}
          {ticks.map((t) => (
            <g key={t} transform={`translate(0,${yPos(t)})`}>
              <line x2={iw} className={t === 0 ? 'grid zero' : 'grid'} />
              <text x={-8} dy="0.32em" textAnchor="end" className="tick">{t}</text>
            </g>
          ))}
          {xs.map((x, i) => ((i % labelEvery === 0 && xs.length - 1 - i >= Math.ceil(labelEvery / 2) + (labelEvery > 1 ? 0 : 0)) || i === xs.length - 1) && (
            <text key={x} x={xPos(x)} y={ih + 20} textAnchor="middle" className="tick">{x}</text>
          ))}
          {series.map((s, si) => {
            const pts = s.points.filter((p) => typeof p.y === 'number');
            const d = pts.map((p, i) => `${i ? 'L' : 'M'}${xPos(p.x)},${yPos(p.y)}`).join(' ');
            return (
              <g key={s.label}>
                <path d={d} fill="none" stroke={COLORS[si % COLORS.length]} strokeWidth="2.5" strokeLinejoin="round" />
                {pts.map((p) => (
                  <circle key={p.x} cx={xPos(p.x)} cy={yPos(p.y)} r={p.x === ax ? 5.5 : 3} fill={COLORS[si % COLORS.length]} stroke="#fff" strokeWidth="1.5" />
                ))}
              </g>
            );
          })}
          {ax != null && <line x1={xPos(ax)} x2={xPos(ax)} y2={ih} className="crosshair" />}
          <rect
            width={iw}
            height={ih}
            fill="transparent"
            style={{ touchAction: 'pan-y' }}
            onPointerMove={(e) => pick(e.clientX)}
            onPointerDown={(e) => pick(e.clientX)}
            onPointerLeave={(e) => { if (e.pointerType === 'mouse') setActive(null); }}
          />
        </g>
      </svg>
      {ax != null && (
        <div
          className="chart-tooltip"
          role="status"
          style={{ left: Math.min(Math.max(tipLeft, 70), width - 70) }}
        >
          <strong>{ax}{sample ? ' · sample' : ''}</strong>
          {series.map((s, si) => {
            const p = s.points.find((q) => q.x === ax);
            return (
              <span key={s.label}>
                <i style={{ background: COLORS[si % COLORS.length] }} />
                {series.length > 1 ? `${s.label}: ` : ''}
                {p && typeof p.y === 'number' ? `${p.y}%` : 'n/a'}
              </span>
            );
          })}
          <small>{unit}</small>
        </div>
      )}
      {series.length > 1 && (
        <div className="legend">
          {series.map((s, si) => (
            <span key={s.label}><i style={{ background: COLORS[si % COLORS.length] }} />{s.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}
