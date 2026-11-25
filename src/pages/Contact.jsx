import React from 'react';
import { CONFIG } from '../config.js';
import { LinkedInLink } from '../components/Footer.jsx';
import EmailChooser from '../components/EmailChooser.jsx';
import InstagramFeed from '../components/InstagramFeed.jsx';

export default function Contact() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Contact Us</p>
          <h1>Get in touch</h1>
          <p className="lead">Questions or partnerships: we’d love to hear from you.</p>
        </div>
      </section>
      <section className="section container">
        <ul className="contact-list">
          <li className="card contact-card">
            <div className="contact-cover email"><svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true"><path d="M3 6h18v12H3z M3 7l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg></div>
            <div className="contact-body">
              <h2>Email</h2>
              <EmailChooser />
            </div>
          </li>
          <li className="card contact-card">
            <div className="contact-cover" style={{ backgroundImage: 'url(images/esc-cover.jpg)' }} />
            <div className="contact-body">
              <img className="contact-avatar" src="images/esc-avatar.png" alt="" />
              <h2>Instagram</h2>
              <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{CONFIG.INSTAGRAM_HANDLE}</a>
            </div>
          </li>
          <li className="card contact-card">
            <div className="contact-cover" style={{ backgroundImage: 'url(images/esc-cover.jpg)' }} />
            <div className="contact-body">
              <img className="contact-avatar" src="images/esc-avatar.png" alt="" />
              <h2>LinkedIn</h2>
              <LinkedInLink />
            </div>
          </li>
        </ul>
      </section>
      <section className="section container" aria-labelledby="ig-h">
        <h2 id="ig-h" className="section-title">Latest on Instagram</h2>
        <div className="ig-feeds">
          <InstagramFeed feedUrl={CONFIG.INSTAGRAM_FEED_URL} handle={CONFIG.INSTAGRAM_HANDLE} url={CONFIG.INSTAGRAM_URL} title="Economic Students’ Chamber" avatar="images/esc-avatar.png" cover="images/esc-cover.jpg" />
          <InstagramFeed feedUrl={CONFIG.IHS_INSTAGRAM_FEED_URL} handle={CONFIG.IHS_INSTAGRAM_HANDLE} url={CONFIG.IHS_INSTAGRAM_URL} title="The Invisible Handshake Series" avatar="images/ihs-logo.png" cover="images/ihs-banner-1400.jpg" />
        </div>
      </section>
    </>
  );
}
