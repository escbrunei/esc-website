import React from 'react';
import { getEvents } from '../lib/events.js';
import EventCard from '../components/EventCard.jsx';
import { CONFIG } from '../config.js';
import InstagramFeed from '../components/InstagramFeed.jsx';
import InstagramPosts from '../components/InstagramEmbed.jsx';
import ihs from '../data/ihs-posts.json';

export const HANDSHAKE_INTRO = 'The Invisible Handshake Series is the Economic Students’ Chamber’s networking series connecting students with invited speakers from industry.';

export default function Handshake() {
  const { upcoming, past } = getEvents();
  const up = upcoming.filter((e) => e.series === 'invisible-handshake');
  const done = past.filter((e) => e.series === 'invisible-handshake');
  return (
    <>
      <section className="page-hero handshake-hero">
        <div className="container">
          <p className="eyebrow">ESC networking series</p>
          <h1>The Invisible Handshake Series</h1>
          <p className="lead">{HANDSHAKE_INTRO}</p>
          <div className="hero-actions">
            <a className="btn btn-gold" href={CONFIG.IHS_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Follow {CONFIG.IHS_INSTAGRAM_HANDLE} on Instagram</a>
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
        {done.length > 0 && <div className="card-grid" style={{ marginBottom: '1.5rem' }}>{done.map((e) => <EventCard key={e.id} ev={e} past />)}</div>}
        {(ihs.posts || []).length > 0 ? (
          <>
            <InstagramPosts urls={ihs.posts} />
            <p className="ig-more">See every session on <a href={CONFIG.IHS_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{CONFIG.IHS_INSTAGRAM_HANDLE}</a></p>
          </>
        ) : (
          <InstagramFeed feedUrl={CONFIG.IHS_INSTAGRAM_FEED_URL} handle={CONFIG.IHS_INSTAGRAM_HANDLE} url={CONFIG.IHS_INSTAGRAM_URL} title="Past sessions on Instagram" />
        )}
      </section>
    </>
  );
}
