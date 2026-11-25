import React, { useRef, useState } from 'react';
import merch from '../data/merch.json';
import { CONFIG } from '../config.js';

const SECTIONS = [
  { key: 'apparel', title: 'ESC Apparel', form: () => CONFIG.MERCH_APPAREL_URL },
  { key: 'accessories', title: 'ESC Accessories', form: () => CONFIG.MERCH_ACCESSORIES_URL },
];

// Turnable product view: drag or swipe sideways to spin it round,
// or tap "Turn around" to see the back.
function Turntable({ view, name }) {
  const [angle, setAngle] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef(null);

  const snap = (a) => Math.round(a / 180) * 180;
  const onDown = (e) => {
    start.current = { x: e.clientX, a: angle };
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    if (!start.current) return;
    setAngle(start.current.a + (e.clientX - start.current.x) * 0.9);
  };
  const onUp = () => {
    if (!start.current) return;
    start.current = null;
    setDragging(false);
    setAngle((a) => snap(a));
  };
  const showingBack = Math.abs(((Math.round(angle / 180) % 2) + 2) % 2) === 1;

  return (
    <div className="turn">
      <div
        className={`turn-stage ${dragging ? 'dragging' : ''}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        role="img"
        aria-label={`${name}, ${showingBack ? 'back' : 'front'} view. Drag sideways to turn it around.`}
      >
        <div className="turn-spin" style={{ transform: `rotateY(${angle}deg)` }}>
          <img className="turn-face" src={view.front} alt="" draggable="false" />
          <img className="turn-face back" src={view.back} alt="" draggable="false" />
        </div>
        <div className="turn-floor" aria-hidden="true" />
      </div>
      <div className="turn-bar">
        <span className="turn-side">{showingBack ? 'Back' : 'Front'}</span>
        <button type="button" className="turn-btn" onClick={() => setAngle((a) => snap(a) + 180)}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Turn around
        </button>
      </div>
    </div>
  );
}

function MerchCard({ item, formUrl }) {
  const [vi, setVi] = useState(0);
  const view = item.views[vi];
  return (
    <article className="card merch-card">
      <Turntable key={view.front} view={view} name={`${item.name} in ${view.name}`} />
      <h3>{item.name}</h3>
      {item.note && <p className="merch-note">{item.note}</p>}
      {item.views.length > 1 ? (
        <div className="swatches" role="radiogroup" aria-label="Colour">
          {item.views.map((v, i) => (
            <button key={v.name} type="button" role="radio" aria-checked={i === vi} className={`swatch ${i === vi ? 'on' : ''}`} onClick={() => setVi(i)}>
              <span className={`dot ${v.name.toLowerCase()}`} aria-hidden="true" />{v.name}
            </button>
          ))}
        </div>
      ) : (
        <p className="merch-colour">{view.name}</p>
      )}
      {typeof item.price === 'number' && <p className="merch-price">B${item.price.toFixed(2)}</p>}
      <a className="btn btn-small" href={formUrl} target="_blank" rel="noopener noreferrer">Order now</a>
    </article>
  );
}

export default function Merch() {
  const items = (merch.items || []).filter((i) => i && i.name && i.views?.length);
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">ESC Merch</p>
          <h1>ESC Merch</h1>
          <p className="lead">Wear the Economic Students’ Chamber. Drag any item to turn it around and see the back.</p>
        </div>
      </section>
      {SECTIONS.map((sec) => {
        const list = items.filter((i) => i.category === sec.key);
        if (!list.length) return null;
        return (
          <section key={sec.key} className="section container merch-section" aria-labelledby={`m-${sec.key}`}>
            <h2 id={`m-${sec.key}`} className="section-title">{sec.title}</h2>
            <div className="merch-grid">
              {list.map((item) => <MerchCard key={item.id} item={item} formUrl={sec.form()} />)}
            </div>
            <p className="merch-form-note">
              <a className="btn btn-ghost btn-small" href={sec.form()} target="_blank" rel="noopener noreferrer">Open the {sec.title.replace('ESC ', '').toLowerCase()} order form ↗</a>
            </p>
          </section>
        );
      })}
      {items.length === 0 && (
        <section className="section container"><div className="empty merch-empty"><p>Our merch line is coming soon.</p></div></section>
      )}
    </>
  );
}
