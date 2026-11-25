import React, { useState } from 'react';
import merch from '../data/merch.json';
import { CONFIG } from '../config.js';
import Merch3D from '../components/Merch3D.jsx';

const SECTIONS = [
  { key: 'apparel', title: 'ESC Apparel.', sub: 'Wear the Chamber.', form: () => CONFIG.MERCH_APPAREL_URL, cta: 'Order apparel' },
  { key: 'accessories', title: 'ESC Accessories.', sub: 'The little things, done right.', form: () => CONFIG.MERCH_ACCESSORIES_URL, cta: 'Order accessories' },
];
const SWATCH = { maroon: '#6d1414', cream: '#efe8da' };

function Product({ item }) {
  const [vi, setVi] = useState(0);
  const view = item.views[vi];
  return (
    <article className="mp">
      <div className="mp-text">
        <h3>{item.name}</h3>
        <p className="mp-tag">{item.tagline}</p>
      </div>
      <Merch3D key={view.front} front={view.front} back={view.back} label={`${item.name}, ${view.name}`} depth={item.category === 'accessories' ? 0.03 : 0.06} />
      <div className="mp-foot">
        {item.views.length > 1 ? (
          <div className="mp-swatches" role="radiogroup" aria-label="Colour">
            {item.views.map((v, i) => (
              <button key={v.name} type="button" role="radio" aria-checked={i === vi} aria-label={v.name} title={v.name}
                className={`mp-dot ${i === vi ? 'on' : ''}`} style={{ background: SWATCH[v.name.toLowerCase()] || '#ccc' }} onClick={() => setVi(i)} />
            ))}
            <span className="mp-colour">{view.name}</span>
          </div>
        ) : (
          <span className="mp-colour">{view.name}</span>
        )}
        {typeof item.price === 'number' && <p className="mp-price">B${item.price.toFixed(2)}</p>}
        {!view.back && <p className="mp-note">Back view coming soon</p>}
      </div>
    </article>
  );
}

export default function Merch() {
  const items = (merch.items || []).filter((i) => i && i.name && i.views?.length);
  return (
    <div className="mstore">
      <header className="mstore-hero">
        <p className="mstore-kicker">ESC Merch</p>
        <h1>Made for aspiring ekonomists.</h1>
        <p className="mstore-lead">Drag any piece to turn it around.</p>
      </header>
      {SECTIONS.map((sec) => {
        const list = items.filter((i) => i.category === sec.key);
        if (!list.length) return null;
        return (
          <section key={sec.key} className="mstore-sec" aria-labelledby={`m-${sec.key}`}>
            <div className="mstore-head">
              <h2 id={`m-${sec.key}`}>{sec.title} <span>{sec.sub}</span></h2>
            </div>
            <div className={`mstore-grid n${list.length}`}>
              {list.map((item) => <Product key={item.id} item={item} />)}
            </div>
            <div className="mstore-cta">
              <a className="mstore-btn" href={sec.form()} target="_blank" rel="noopener noreferrer">{sec.cta}</a>
              <a className="mstore-link" href={sec.form()} target="_blank" rel="noopener noreferrer">Open the order form ›</a>
            </div>
          </section>
        );
      })}
    </div>
  );
}
