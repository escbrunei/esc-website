import React from 'react';
import { getEvents } from '../lib/events.js';
import EventCard from '../components/EventCard.jsx';
import { CONFIG } from '../config.js';

export default function Events() {
  const { upcoming, past } = getEvents();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Events</p>
          <h1>ESC Events</h1>
          <p className="lead">Talks, workshops and networking for students interested in economics and policy.</p>
          <a className="btn btn-gold" href="#/invisible-handshake">The Invisible Handshake series</a>
        </div>
      </section>
      <section className="section container" aria-labelledby="up-h">
        <h2 id="up-h" className="section-title">Upcoming Events</h2>
        {upcoming.length ? (
          <div className="card-grid">{upcoming.map((e) => <EventCard key={e.id} ev={e} />)}</div>
        ) : (
          <div className="empty">
            <p>No upcoming events are listed yet.</p>
            <p>Follow <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{CONFIG.INSTAGRAM_HANDLE}</a> on Instagram for announcements.</p>
          </div>
        )}
      </section>
      <section className="section container" aria-labelledby="past-h">
        <h2 id="past-h" className="section-title">Past Events</h2>
        {past.length ? (
          <div className="card-grid">{past.map((e) => <EventCard key={e.id} ev={e} past />)}</div>
        ) : (
          <div className="empty"><p>Recaps of past events will appear here.</p></div>
        )}
      </section>
    </>
  );
}
