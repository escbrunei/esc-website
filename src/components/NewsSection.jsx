import React, { useEffect, useState } from 'react';
import AskButton from './AskButton.jsx';
import { bruneiDateTime } from '../lib/time.js';
import { CONFIG } from '../config.js';

const TABS = [
  ['brunei', 'Brunei'],
  ['asean', 'ASEAN'],
  ['global', 'Global'],
];

export default function NewsSection({ showTitle = true }) {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  const [tab, setTab] = useState('brunei');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('data/news.json', { cache: 'no-cache' })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  const items = (data?.items || [])
    .filter((i) => i.region === tab)
    .filter((i) => filter === 'all' || i.kind === filter)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  const onTabKey = (e, idx) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = (idx + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length;
    setTab(TABS[next][0]);
    document.getElementById(`tab-${TABS[next][0]}`)?.focus();
  };

  return (
    <section id="news" className="section news-section" aria-labelledby="news-h">
      <div className="container">
        <h2 id="news-h" className={showTitle ? 'section-title' : 'sr-only'}>Economic News &amp; Releases</h2>
        <p className="muted">
          Latest headlines and official economic releases.
        </p>
        <p className="refresh">
          {data?.lastSuccessfulRefresh
            ? <>Last successful refresh: <strong>{bruneiDateTime(data.lastSuccessfulRefresh)}</strong></>
            : <>Last successful refresh: <strong>not yet run</strong></>}
        </p>
        {data?.sample && (
          <p className="notice notice-sample" role="note"><strong>Sample headlines:</strong> {data.note || 'These items are placeholders, not real news.'}</p>
        )}

        <div className="tabs" role="tablist" aria-label="News region">
          {TABS.map(([id, label], idx) => (
            <button
              key={id}
              id={`tab-${id}`}
              role="tab"
              aria-selected={tab === id}
              aria-controls="news-panel"
              tabIndex={tab === id ? 0 : -1}
              className={tab === id ? 'active' : ''}
              onClick={() => setTab(id)}
              onKeyDown={(e) => onTabKey(e, idx)}
            >{label}</button>
          ))}
        </div>
        <div className="news-filter" role="group" aria-label="Item type">
          {[['all', 'All'], ['official', 'Official releases'], ['headline', 'Headlines']].map(([v, l]) => (
            <button key={v} className={`chip ${filter === v ? 'active' : ''}`} aria-pressed={filter === v} onClick={() => setFilter(v)}>{l}</button>
          ))}
        </div>

        <div id="news-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
          {failed && <p className="notice notice-error">News could not be loaded right now. Please try again later.</p>}
          {!data && !failed && <p className="muted">Loading news…</p>}
          {data && items.length === 0 && (
            <div className="empty">
              <p>No items here yet. The news feed refreshes once a day.</p>
              <p>For ESC announcements, follow <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{CONFIG.INSTAGRAM_HANDLE}</a>.</p>
            </div>
          )}
          <ul className="news-list">
            {items.map((item) => <NewsItem key={item.id} item={item} sample={data.sample} />)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function NewsItem({ item, sample }) {
  const official = item.kind === 'official';
  const context = {
    origin: 'news',
    title: item.title,
    details: {
      headline: item.title,
      type: official ? 'Official release' : 'News headline',
      source: item.publisher,
      url: item.url,
      published: bruneiDateTime(item.publishedAt),
      summary: item.summary || '',
      onlyHeadline: !item.summary,
      sample: !!sample,
    },
  };
  return (
    <li className="card news-item">
      <a className="news-thumb" href={item.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
        <Thumb src={item.image} publisher={item.publisher} official={official} url={item.url} />
      </a>
      <div className="news-body">
        <span className={`kind ${official ? 'kind-official' : 'kind-headline'}`}>{official ? 'Official release' : 'Headline'}</span>
        <h3><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a></h3>
        <p className="news-meta">
          <span>{item.publisher}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={item.publishedAt}>{bruneiDateTime(item.publishedAt)}</time>
        </p>
        {item.summary && <p className="news-summary">{item.summary}</p>}
        <div className="card-actions">
          <a className="btn btn-small btn-ghost" href={item.url} target="_blank" rel="noopener noreferrer">Read original source</a>
          <AskButton className="btn-small" context={context} />
        </div>
      </div>
    </li>
  );
}

const SKIP = new Set(['of', 'and', 'the', 'for', '&', '(sample)']);
function initials(name = '') {
  const words = name.replace(/[()]/g, ' ').split(/\s+/).filter((w) => w && !SKIP.has(w.toLowerCase()));
  if (words.length === 1) return words[0].slice(0, 6).toUpperCase();
  return words.map((w) => w[0]).join('').slice(0, 4).toUpperCase();
}

// Publisher's picture; if none, the publisher's own logo (site icon) on a clean tile.
function hostOf(url) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; } }
function Thumb({ src, publisher, official, url }) {
  const [failed, setFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  if (src && !failed) {
    return <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />;
  }
  const host = hostOf(url);
  return (
    <span className={`thumb-logo ${official ? 'official' : ''}`}>
      {host && !logoFailed ? (
        <img src={`https://www.google.com/s2/favicons?domain=${host}&sz=128`} alt="" loading="lazy" onError={() => setLogoFailed(true)} />
      ) : (
        <span className="thumb-initials">{initials(publisher) || 'ESC'}</span>
      )}
      <span className="thumb-name">{publisher}</span>
    </span>
  );
}
