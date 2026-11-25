import React from 'react';
import { openESynC } from '../lib/esync.js';
import { getEvents } from '../lib/events.js';
import { HANDSHAKE_INTRO } from './Handshake.jsx';
import { bruneiDate } from '../lib/time.js';
import { joinProps } from '../lib/join.js';

export default function Home() {
  const next = getEvents().upcoming.find((e) => e.series === 'invisible-handshake');
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Economic Students’ Chamber (DPE) Brunei</p>
            <h1 className="hero-title">Empowering and Mobilising Aspiring Ekonomist</h1>
            <p className="lead">
              ESC is a student-led, non-profit community for students interested in economics and policy.
              We learn together, meet practitioners and join conversations about Brunei’s development.
            </p>
            <div className="hero-actions">
              <a className="btn btn-gold btn-large" href="#/dashboard">Explore Brunei’s Economy</a>
              <a className="btn btn-outline-light btn-large" href="#/lab">Open Economics Lab</a>
            </div>
            <p className="hero-links">
              <button type="button" className="linklike light" onClick={() => openESynC({ origin: 'home' })}>Ask ESynC, our economics assistant →</button>
              <a {...joinProps} className="light">Join ESC →</a>
            </p>
          </div>
          <div className="hero-art">
            <img className="hero-crest" src="images/esc-crest-v2.png" alt="Economic Students’ Chamber crest — Dewan Pelajar Ekonomi" width="320" height="320" />
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="feature-grid">
          <a className="card feature" href="#/dashboard">
            <h2>Brunei Economy Dashboard</h2>
            <p>GDP growth, inflation, unemployment and the oil and gas economy in interactive charts you can filter, download and ask about.</p>
            <span className="more">Open the dashboard →</span>
          </a>
          <a className="card feature" href="#/news">
            <h2>Economic News</h2>
            <p>Hourly headlines and official DEPS and BDCB releases for Brunei, ASEAN and the world.</p>
            <span className="more">Read the news →</span>
          </a>
          <a className="card feature" href="#/lab">
            <h2>Economics Lab</h2>
            <p>Shift supply and demand to see what happens to prices, and practise calculating inflation from CPI.</p>
            <span className="more">Start experimenting →</span>
          </a>
          <button type="button" className="card feature as-button" onClick={() => openESynC({ origin: 'home' })}>
            <h2>Ask ESynC</h2>
            <p>Get plain-language explanations, help reading Brunei’s data and step-by-step guidance on calculations.</p>
            <span className="more">Start a chat →</span>
          </button>
        </div>
      </section>

      <section className="section band">
        <div className="container handshake-feature">
          <div>
            <p className="eyebrow">Featured series</p>
            <h2>The Invisible Handshake</h2>
            <p>{HANDSHAKE_INTRO}</p>
            {next && <p className="next-session"><strong>Next session:</strong> {next.topic || next.title} · {bruneiDate(next.date)}</p>}
            <a className="btn btn-gold" href="#/invisible-handshake">Explore the series</a>
          </div>
        </div>
      </section>

      <section className="section container join-cta">
        <h2>Be part of ESC</h2>
        <p>Membership is open to students interested in economics and policy.</p>
        <a className="btn btn-large" {...joinProps}>Join ESC</a>
      </section>
    </>
  );
}
