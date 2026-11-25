import React from 'react';
import { getEvents } from '../lib/events.js';
import EventCard from '../components/EventCard.jsx';
import { CONFIG } from '../config.js';

export const HANDSHAKE_INTRO = 'The Invisible Handshake is the Economic Students’ Chamber’s networking series connecting students with invited speakers from industry.';

export default function Handshake() {
  const { upcoming, past } = getEvents();
  const up = upcoming.filter((e) => e.series === 'invisible-handshake');
  const done = past.filter((e) => e.series === 'invisible-handshake');
  return (
    <>
      <section className="page-hero handshake-hero">
        <div className="container">
          <p className="eyebrow">ESC networking series</p>
          <h1>The Invisible Handshake</h1>
          <p className="lead">{HANDSHAKE_INTRO}</p>
          <div className="hero-actions">
            <a className="btn btn-gold" href={CONFIG.IHS_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Follow {CONFIG.IHS_INSTAGRAM_HANDLE} on Instagram</a>
            <a className="btn btn-outline-light" href="#/events">All ESC events</a>
          </div>
        </div>
      </section>
      <section className="section container" aria-labelledby="ih-up">
        <h2 id="ih-up" className="section-title">Next session</h2>
        {up.length ? (
          <div className="card-grid">{up.map((e) => <EventCard key={e.id} ev={e} />)}</div>
        ) : (
          <div className="empty">
            <p>The next session hasn’t been announced yet.</p>
            <p>Follow <a href={CONFIG.IHS_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{CONFIG.IHS_INSTAGRAM_HANDLE}</a> to hear first.</p>
          </div>
        )}
      </section>
      <section className="section container" aria-labelledby="ih-past">
        <h2 id="ih-past" className="section-title">Past sessions</h2>
        {done.length ? (
          <>
            <div className="card-grid">{done.map((e) => <EventCard key={e.id} ev={e} past />)}</div>
            <p className="ig-more">More photos on <a href={CONFIG.IHS_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{CONFIG.IHS_INSTAGRAM_HANDLE}</a></p>
          </>
        ) : (
          <a className="card ig-card" href={CONFIG.IHS_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            <span className="ig-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="34" height="34"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="4.3" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>
            </span>
            <span>
              <span className="ig-title">See past sessions on Instagram</span>
              <span className="ig-sub">Photos and highlights from every Invisible Handshake session are on {CONFIG.IHS_INSTAGRAM_HANDLE}.</span>
            </span>
            <span className="more" aria-hidden="true">→</span>
          </a>
        )}
      </section>
    </>
  );
}
