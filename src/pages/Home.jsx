import React, { useRef, useState } from 'react';
import EconomyRoad from '../components/EconomyRoad.jsx';
import FeatureIcon from '../components/FeatureIcon.jsx';
import BruneiStory from '../components/BruneiStory.jsx';
import EscapeDoor from '../components/EscapeDoor.jsx';
import { openESynC } from '../lib/esync.js';
import { getEvents } from '../lib/events.js';
import { HANDSHAKE_INTRO } from './Handshake.jsx';
import { bruneiDate } from '../lib/time.js';
import { joinProps } from '../lib/join.js';

export default function Home() {
  const [hover, setHover] = useState(null);
  const cardRefs = useRef([]);
  const hv = (i) => ({ ref: (el) => { cardRefs.current[i] = el; }, onMouseEnter: () => setHover(i), onMouseLeave: () => setHover(null), onFocus: () => setHover(i), onBlur: () => setHover(null) });
  const next = getEvents().upcoming.find((e) => e.series === 'invisible-handshake');
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="hero-org">Economic Students’ Chamber <span>(DPE) Brunei</span></p>
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

      <section className="section container features">
        <div className="feature-grid">
          <a className="card feature" href="#/dashboard" {...hv(0)}>
            <FeatureIcon kind="dashboard" />
            <h2>Brunei Economy Dashboard</h2>
            <p>GDP growth, inflation, unemployment and the oil and gas economy in interactive charts you can filter, download and ask about.</p>
            <span className="more">Open the dashboard →</span>
          </a>
          <a className="card feature" href="#/news" {...hv(1)}>
            <FeatureIcon kind="news" />
            <h2>Economic News</h2>
            <p>Daily headlines and official DEPS and BDCB releases for Brunei, ASEAN and the world.</p>
            <span className="more">Read the news →</span>
          </a>
          <a className="card feature" href="#/lab" {...hv(2)}>
            <FeatureIcon kind="lab" />
            <h2>Economics Lab</h2>
            <p>Shift supply and demand to see what happens to prices, and practise calculating inflation from CPI.</p>
            <span className="more">Start experimenting →</span>
          </a>
        </div>
      </section>
      <EconomyRoad targetEl={hover != null ? cardRefs.current[hover] : null} />
      <BruneiStory />

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
        <div className="join-grid">
          <EscapeDoor />
          <div className="join-text">
            <h2>Be part of ESC</h2>
            <p>Membership is open to students interested in economics and policy.</p>
            <a className="btn btn-large" {...joinProps}>Join ESC</a>
          </div>
        </div>
      </section>
    </>
  );
}
