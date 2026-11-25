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
          <a className="btn btn-outline-light" href="#/events">All ESC events</a>
        </div>
      </section>
      <section className="section container" aria-labelledby="ih-up">
        <h2 id="ih-up" className="section-title">Next session</h2>
        {up.length ? (
          <div className="card-grid">{up.map((e) => <EventCard key={e.id} ev={e} />)}</div>
        ) : (
          <div className="empty">
            <p>The next session hasn’t been announced yet.</p>
            <p>Follow <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{CONFIG.INSTAGRAM_HANDLE}</a> to hear first.</p>
          </div>
        )}
      </section>
      <section className="section container" aria-labelledby="ih-past">
        <h2 id="ih-past" className="section-title">Past sessions</h2>
        {done.length ? (
          <div className="card-grid">{done.map((e) => <EventCard key={e.id} ev={e} past />)}</div>
        ) : (
          <div className="empty"><p>Session recaps will appear here after each event.</p></div>
        )}
      </section>
    </>
  );
}
