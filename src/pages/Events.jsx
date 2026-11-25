import React from 'react';
import { getEvents } from '../lib/events.js';
import EventCard from '../components/EventCard.jsx';
import { CONFIG } from '../config.js';
import InstagramFeed from '../components/InstagramFeed.jsx';
import InstagramPosts from '../components/InstagramEmbed.jsx';
import ihs from '../data/ihs-posts.json';

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
        {past.length > 0 && <div className="card-grid" style={{ marginBottom: '1.5rem' }}>{past.map((e) => <EventCard key={e.id} ev={e} past />)}</div>}
        {(ihs.posts || []).length > 0 ? (
          <>
            <InstagramPosts urls={ihs.posts} />
            <p className="ig-more">More photos on <a href={CONFIG.IHS_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{CONFIG.IHS_INSTAGRAM_HANDLE}</a></p>
          </>
        ) : (
          <InstagramFeed feedUrl={CONFIG.IHS_INSTAGRAM_FEED_URL} handle={CONFIG.IHS_INSTAGRAM_HANDLE} url={CONFIG.IHS_INSTAGRAM_URL} title="Past events on Instagram" />
        )}
      </section>
    </>
  );
}
