import React, { useEffect, useState } from 'react';
import pubs from '../data/publications.json';
import { CONFIG } from '../config.js';

const ICON = {
  'dpe-insight': 'M4 20V10m6 10V4m6 16v-7m4 7H2',
  bitesize: 'M12 3a9 9 0 1 0 9 9h-9z M14 1v9h9a9 9 0 0 0-9-9z',
  'ihs-takeaways': 'M8 12l3 3 5-6 M4 4h16v16H4z',
};

const fmtDate = (d) => {
  if (!d) return '';
  const t = new Date(`${d}T00:00:00`);
  return Number.isNaN(t.getTime()) ? d : t.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

function Cover({ item, series }) {
  if (item.cover) return <img src={item.cover} alt="" loading="lazy" />;
  return (
    <div className={`pub-cover-ph ${series.id}`} aria-hidden="true">
      <img src="images/esc-door.png" alt="" />
      <span className="pub-cover-series">{series.title}</span>
      <span className="pub-cover-title">{item.title}</span>
    </div>
  );
}

function Viewer({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const k = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="pdf-modal" role="dialog" aria-modal="true" aria-label={open.title} onClick={onClose}>
      <div className="pdf-box" onClick={(e) => e.stopPropagation()}>
        <header className="pdf-head">
          <div>
            <p className="pdf-series">{open.seriesTitle}</p>
            <h2>{open.title}</h2>
          </div>
          <div className="pdf-actions">
            <a className="btn btn-small btn-ghost" href={open.file} target="_blank" rel="noopener noreferrer">Full screen ↗</a>
            <a className="btn btn-small" href={open.file} download>Download</a>
            <button type="button" className="esync-close" onClick={onClose} aria-label="Close">×</button>
          </div>
        </header>
        <iframe className="pdf-frame" src={`${open.file}#view=FitH`} title={open.title} />
      </div>
    </div>
  );
}

export default function Publications() {
  const series = pubs.series || [];
  const [tab, setTab] = useState((series.find((s) => s.items?.length) || series[0])?.id);
  const [open, setOpen] = useState(null);
  const current = series.find((s) => s.id === tab) || series[0];
  const items = (current?.items || []).filter((i) => i && i.file && i.title);

  const read = (item) => {
    // Phones show embedded PDFs poorly, so open the file directly there.
    if (window.matchMedia('(max-width: 760px)').matches) {
      window.open(item.file, '_blank', 'noopener');
      return;
    }
    setOpen({ ...item, seriesTitle: current.title });
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">ESC Publications</p>
          <h1>Publications</h1>
          <p className="lead">Reports, explainers and event takeaways written by ESC members. Read them here or download the PDF.</p>
        </div>
      </section>

      <section className="section container" aria-label="Publication series">
        <div className="pub-tabs" role="tablist">
          {series.map((s) => (
            <button key={s.id} role="tab" aria-selected={s.id === current?.id} className={`pub-tab ${s.id === current?.id ? 'on' : ''}`} onClick={() => setTab(s.id)}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d={ICON[s.id] || ICON['dpe-insight']} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {s.title}
            </button>
          ))}
        </div>

        {current && (
          <div className="pub-panel" role="tabpanel">
            <p className="pub-blurb">{current.blurb}</p>
            {items.length === 0 ? (
              <div className="empty pub-empty">
                <p>The first {current.title.replace(/s$/, '')} issue is coming soon.</p>
                <p>Follow <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{CONFIG.INSTAGRAM_HANDLE}</a> for the release.</p>
              </div>
            ) : (
              <div className="pub-grid">
                {items.map((item) => (
                  <article key={item.file} className="card pub-card">
                    <button type="button" className="pub-cover" onClick={() => read(item)} aria-label={`Read ${item.title}`}>
                      <Cover item={item} series={current} />
                    </button>
                    <div className="pub-body">
                      {(item.date || item.pages) && <p className="pub-date">{[item.date && fmtDate(item.date), item.pages && `${item.pages} pages`].filter(Boolean).join(' · ')}</p>}
                      <h3>{item.title}</h3>
                      {item.summary && <p className="muted">{item.summary}</p>}
                      <div className="pub-btns">
                        <button type="button" className="btn btn-small" onClick={() => read(item)}>Read</button>
                        <a className="btn btn-small btn-ghost" href={item.file} download>Download PDF</a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
      <Viewer open={open} onClose={() => setOpen(null)} />
    </>
  );
}
