import React from 'react';
import { CONFIG } from '../config.js';
import { openESynC } from '../lib/esync.js';
import ESynCCharacter from './ESynCCharacter.jsx';

export function LinkedInLink({ className = '' }) {
  return CONFIG.LINKEDIN_URL ? (
    <a className={className} href={CONFIG.LINKEDIN_URL} target="_blank" rel="noopener noreferrer">{CONFIG.LINKEDIN_NAME}</a>
  ) : (
    <span className={className}>{CONFIG.LINKEDIN_NAME}</span>
  );
}

export default function Footer() {
  const speakMail = `mailto:${CONFIG.ESC_EMAIL}?subject=${encodeURIComponent('Speaking at an ESC event')}`;
  return (
    <footer className="site-footer">
      <div className="footer-peek container">
        <button type="button" className="peek-button" onClick={() => openESynC({ origin: 'home' })} aria-label="Ask ESynC">
          <ESynCCharacter size={130} peeking />
        </button>
        <button type="button" className="btn btn-gold footer-ask" onClick={() => openESynC({ origin: 'home' })}>
          Ask ESynC
        </button>
      </div>
      <div className="footer-inner">
        <div className="container footer-grid">
          <div className="footer-brand">
            <p className="footer-title">Economic Students’ Chamber</p>
            <p className="footer-sub">(DPE) Brunei · Student-led, non-profit · Bandar Seri Begawan</p>
          </div>
          <div className="footer-col">
            <h2>Explore</h2>
            <ul>
              <li><a href="#/">Home</a></li>
              <li><a href="#/dashboard">Brunei Economy Dashboard</a></li>
              <li><a href="#/news">Economic News</a></li>
              <li><a href="#/lab">Economics Lab</a></li>
              <li><a href="#/events">Events</a></li>
              <li><a href="#/about">About Us</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h2>Get Involved</h2>
            <ul>
              <li><a href="#/join">Join ESC</a></li>
              <li><a href="#/invisible-handshake">The Invisible Handshake</a></li>
              <li><a href={speakMail}>Speak at an ESC event</a></li>
              <li><button type="button" className="linklike" onClick={() => openESynC({ origin: 'home' })}>Ask ESynC</button></li>
            </ul>
          </div>
          <div className="footer-col">
            <h2>Contact Us</h2>
            <ul>
              <li><span className="lbl">Email</span><a href={`mailto:${CONFIG.ESC_EMAIL}`}>{CONFIG.ESC_EMAIL}</a></li>
              <li><span className="lbl">Instagram</span><a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{CONFIG.INSTAGRAM_HANDLE}</a></li>
              <li><span className="lbl">LinkedIn</span><LinkedInLink /></li>
            </ul>
          </div>
        </div>
        <div className="container footer-bottom">© {new Date().getFullYear()} Economic Students’ Chamber (DPE) Brunei</div>
      </div>
    </footer>
  );
}
