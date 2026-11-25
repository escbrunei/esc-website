import React from 'react';
import { CONFIG } from '../config.js';
import { LinkedInLink } from '../components/Footer.jsx';
import InstagramFeed from '../components/InstagramFeed.jsx';

export default function Contact() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Contact Us</p>
          <h1>Get in touch</h1>
          <p className="lead">Questions, partnerships or speaking at an event: we’d love to hear from you.</p>
        </div>
      </section>
      <section className="section container">
        <ul className="contact-list">
          <li className="card">
            <h2>Email</h2>
            <a href={`mailto:${CONFIG.ESC_EMAIL}`}>{CONFIG.ESC_EMAIL}</a>
          </li>
          <li className="card">
            <h2>Instagram</h2>
            <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{CONFIG.INSTAGRAM_HANDLE}</a>
          </li>
          <li className="card">
            <h2>LinkedIn</h2>
            <LinkedInLink />
          </li>
        </ul>
      </section>
      <section className="section container" aria-labelledby="ig-h">
        <h2 id="ig-h" className="section-title">Latest on Instagram</h2>
        <div className="ig-feeds">
          <InstagramFeed feedUrl={CONFIG.INSTAGRAM_FEED_URL} handle={CONFIG.INSTAGRAM_HANDLE} url={CONFIG.INSTAGRAM_URL} title="Economic Students’ Chamber" />
          <InstagramFeed feedUrl={CONFIG.IHS_INSTAGRAM_FEED_URL} handle={CONFIG.IHS_INSTAGRAM_HANDLE} url={CONFIG.IHS_INSTAGRAM_URL} title="The Invisible Handshake" />
        </div>
      </section>
    </>
  );
}
