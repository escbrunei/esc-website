import HeroVideo from '../components/HeroVideo.jsx';
import React, { useEffect, useMemo, useState } from 'react';
import LineChart from '../components/LineChart.jsx';
import AskButton from '../components/AskButton.jsx';
import { loadIndicators } from '../lib/data.js';
import { toCSV, downloadText } from '../lib/csv.js';

export default function Dashboard() {
  const [indicators, setIndicators] = useState(null);
  const [error, setError] = useState(false);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  useEffect(() => {
    loadIndicators().then((list) => {
      setIndicators(list);
      setFrom(Math.min(...list.map((i) => i.minYear)));
      setTo(Math.max(...list.map((i) => i.maxYear)));
    }).catch(() => setError(true));
  }, []);

  const years = useMemo(() => {
    if (!indicators) return [];
    const lo = Math.min(...indicators.map((i) => i.minYear));
    const hi = Math.max(...indicators.map((i) => i.maxYear));
    return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  }, [indicators]);

  const anySample = indicators?.some((i) => i.status !== 'official');

  return (
    <>
      <section className="page-hero video-hero">
        <HeroVideo name="dashboard" />
        <div className="container">
          <p className="eyebrow">Brunei Economy Dashboard</p>
          <h1>Explore Brunei’s Economy</h1>
          <p className="lead">Key indicators with their sources. Tap or hover over a chart to read the values, then download the data or ask ESynC what it means.</p>
          <p className="dash-disclaimer">For education and general information only. Official figures may be revised, so always check the original source. <a href="#/terms">Terms of Use</a></p>
          <a className="btn btn-outline-light" href="#/news">Latest economic news →</a>
        </div>
      </section>

      <section className="section container">
        {error && <p className="notice notice-error">The dashboard data could not be loaded. Please refresh the page.</p>}
        {!indicators && !error && <p className="muted">Loading data…</p>}
        {indicators && (
          <>
            {anySample && (
              <p className="notice notice-sample" role="note">
                <strong>Sample data:</strong> charts marked “Sample” use placeholder figures for demonstration. They are not official statistics. The committee will replace them with verified DEPS figures.
              </p>
            )}
            <div className="filter-bar" role="group" aria-label="Year range">
              <span className="filter-label">Year range</span>
              <label>From
                <select value={from} onChange={(e) => { const v = +e.target.value; setFrom(v); if (v > to) setTo(v); }}>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>
              <label>To
                <select value={to} onChange={(e) => { const v = +e.target.value; setTo(v); if (v < from) setFrom(v); }}>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>
              <button className="btn btn-small btn-ghost" onClick={() => { setFrom(years[0]); setTo(years[years.length - 1]); }}>All years</button>
            </div>
            <div className="chart-grid">
              {indicators.map((ind) => <IndicatorCard key={ind.id} ind={ind} from={from} to={to} />)}
            </div>
          </>
        )}
      </section>

    </>
  );
}

function IndicatorCard({ ind, from, to }) {
  const sample = ind.status !== 'official';
  const rows = ind.rows.filter((r) => r.year >= from && r.year <= to);
  const series = ind.series.map((s) => ({ label: s.label, points: rows.map((r) => ({ x: r.year, y: r[s.column] })) }));
  const rangeText = rows.length ? `${rows[0].year}–${rows[rows.length - 1].year}` : `${from}–${to}`;

  const download = () => {
    const out = rows.map((r) => {
      const o = { year: r.year };
      ind.series.forEach((s) => { o[s.column] = r[s.column]; });
      o.unit = ind.unit;
      o.source = ind.source;
      o.data_status = sample ? 'SAMPLE DATA - placeholder figures, not official statistics' : 'Official';
      o.source_url = ind.sourceUrl;
      return o;
    });
    const headers = ['year', ...ind.series.map((s) => s.column), 'unit', 'source', 'source_url', 'data_status'];
    downloadText(`${ind.id}_${rangeText.replace('–', '-')}${sample ? '_SAMPLE' : ''}.csv`, toCSV(out, headers));
  };

  const context = () => ({
    origin: 'chart',
    title: `${ind.title}, ${rangeText}`,
    details: {
      indicator: ind.title,
      indicatorId: ind.id,
      yearRange: rangeText,
      unit: ind.unit,
      source: ind.source,
      sourceUrl: ind.sourceUrl,
      latestPeriod: ind.latestPeriod,
      dataStatus: sample ? 'sample (placeholder, not official)' : 'official',
      values: rows.map((r) => {
        const o = { year: r.year };
        ind.series.forEach((s) => { o[s.label] = r[s.column]; });
        return o;
      }),
    },
  });

  return (
    <article className="card chart-card" aria-labelledby={`h-${ind.id}`}>
      <header className="chart-head">
        <h2 id={`h-${ind.id}`}>{ind.title}</h2>
        {sample ? <span className="badge badge-sample">Sample data</span> : <span className="badge badge-official">Official</span>}
      </header>
      <LineChart series={series} unit={ind.unit} sample={sample} title={ind.title} suffix={ind.suffix ?? '%'} />
      <dl className="meta">
        <div><dt>Source{(ind.sources || []).length > 1 ? 's' : ''}</dt><dd>
          {(ind.sources || [{ label: ind.source, url: ind.sourceUrl }]).map((src) => (
            <a key={src.url + src.label} className="src-link" href={src.url} target="_blank" rel="noopener noreferrer">{src.label} <span aria-hidden="true">↗</span></a>
          ))}
        </dd></div>
        <div><dt>Unit</dt><dd>{ind.unit}</dd></div>
        <div><dt>Latest available period</dt><dd>{ind.latestPeriod}{sample ? ' (sample)' : ''}</dd></div>
        {ind.note && <div><dt>Note</dt><dd>{ind.note}</dd></div>}
      </dl>
      <div className="card-actions">
        <a className="btn btn-small btn-ghost" href={(ind.sources?.[0]?.url) || ind.sourceUrl} target="_blank" rel="noopener noreferrer">View source ↗</a>
        <button className="btn btn-small btn-ghost" onClick={download}>Download CSV</button>
        <AskButton className="btn-small" context={context} />
      </div>
    </article>
  );
}
