import React from 'react';
import merch from '../data/merch.json';
import { CONFIG } from '../config.js';

const STATUS = { available: 'Available', preorder: 'Pre-order', soldout: 'Sold out' };

function orderLink(item) {
  if (item.orderUrl) return item.orderUrl;
  if (CONFIG.MERCH_ORDER_URL) return CONFIG.MERCH_ORDER_URL;
  return `mailto:${CONFIG.ESC_EMAIL}?subject=${encodeURIComponent(`Merch order: ${item.name}`)}`;
}

export default function Merch() {
  const items = (merch.items || []).filter((i) => i && i.name);
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">ESC Merch</p>
          <h1>ESC Merch</h1>
          <p className="lead">Wear the Economic Students’ Chamber. Every purchase supports our student programmes.</p>
        </div>
      </section>
      <section className="section container" aria-labelledby="merch-h">
        <h2 id="merch-h" className="section-title">The merch line</h2>
        {items.length === 0 ? (
          <div className="empty merch-empty">
            <p>Our merch line is coming soon.</p>
            <p>Follow <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{CONFIG.INSTAGRAM_HANDLE}</a> for the launch.</p>
          </div>
        ) : (
          <div className="merch-grid">
            {items.map((item) => {
              const sold = item.status === 'soldout';
              const external = !orderLink(item).startsWith('mailto:');
              return (
                <article key={item.id || item.name} className="card merch-card">
                  <div className="merch-img">
                    {item.image ? <img src={item.image} alt={item.name} loading="lazy" /> : <span className="merch-ph">ESC</span>}
                    {item.status && <span className={`merch-status ${item.status}`}>{STATUS[item.status] || item.status}</span>}
                  </div>
                  <h3>{item.name}</h3>
                  {typeof item.price === 'number' && <p className="merch-price">B${item.price.toFixed(2)}</p>}
                  {item.description && <p className="muted">{item.description}</p>}
                  {item.options?.length > 0 && (
                    <ul className="merch-options" aria-label="Options">{item.options.map((o) => <li key={o}>{o}</li>)}</ul>
                  )}
                  {sold ? (
                    <span className="btn btn-ghost btn-small" aria-disabled="true">Sold out</span>
                  ) : (
                    <a className="btn btn-small" href={orderLink(item)} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      {item.status === 'preorder' ? 'Pre-order' : 'Order now'}
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
