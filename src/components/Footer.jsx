import React from 'react';
import { CONFIG } from '../config.js';
import { openESynC } from '../lib/esync.js';
import EmailChooser from './EmailChooser.jsx';
import { joinProps } from '../lib/join.js';

export function LinkedInLink({ className = '' }) {
  return CONFIG.LINKEDIN_URL ? (
    <a className={className} href={CONFIG.LINKEDIN_URL} target="_blank" rel="noopener noreferrer">{CONFIG.LINKEDIN_NAME}</a>
  ) : (
    <span className={className}>{CONFIG.LINKEDIN_NAME}</span>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="container footer-grid">
          <div className="footer-brand">
            <p className="footer-title">Economic Students’ Chamber</p>
            <p className="footer-sub">(DPE) Brunei · Student-led, non-profit · Brunei Darussalam</p>
          </div>
          <div className="footer-col">
            <h2>Explore</h2>
            <ul>
              <li><a href="#/">Home</a></li>
              <li><a href="#/dashboard">Brunei Economy Dashboard</a></li>
              <li><a href="#/news">Economic News</a></li>
              <li><a href="#/lab">Economics Lab</a></li>
              <li><a href="#/publications">Publications</a></li>
              <li><a href="#/about">About Us</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h2>Get Involved</h2>
            <ul>
              <li><a {...joinProps}>Join ESC</a></li>
              <li><a href="#/invisible-handshake">The Invisible Handshake Series</a></li>
              <li><a href="#/merch">Merch</a></li>
              <li><button type="button" className="linklike" onClick={() => openESynC({ origin: 'home' })}>Ask ESynC</button></li>
            </ul>
          </div>
          <div className="footer-col">
            <h2>Contact Us</h2>
            <EmailChooser className="footer-email-chooser" />
            <h2 className="follow-h">Follow Us</h2>
            <ul className="social-row">
              <li><a className="social" href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${CONFIG.INSTAGRAM_HANDLE}`} title={CONFIG.INSTAGRAM_HANDLE}><InstagramIcon /></a></li>
              {CONFIG.LINKEDIN_URL && <li><a className="social" href={CONFIG.LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="ESC on LinkedIn" title="LinkedIn"><LinkedInIcon /></a></li>}
              <li><a className="social" href={CONFIG.IHS_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={`The Invisible Handshake Series on Instagram ${CONFIG.IHS_INSTAGRAM_HANDLE}`} title={`The Invisible Handshake Series ${CONFIG.IHS_INSTAGRAM_HANDLE}`}><InstagramIcon /><span className="social-tag">IHS</span></a></li>
            </ul>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Economic Students’ Chamber (DPE) Brunei</span>
          <span className="footer-legal"><a href="#/terms">Terms of Use</a> · <a href="#/terms" onClick={() => setTimeout(() => document.getElementById('privacy')?.scrollIntoView(), 300)}>Privacy</a></span>
          <span className="footer-disclaimer">Content is for education and general information only, not financial or professional advice. Always check figures against the original source.</span>
        </div>
      </div>
    </footer>
  );
}

function MailIcon() {
  return (<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}
function InstagramIcon() {
  return (<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" /></svg>);
}
function LinkedInIcon() {
  return (<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" /><rect x="7" y="10" width="2.2" height="7" fill="currentColor" /><circle cx="8.1" cy="7.3" r="1.3" fill="currentColor" /><path d="M11.5 17v-7h2.1v1c.5-.8 1.4-1.2 2.4-1.2 1.8 0 2.7 1.1 2.7 3.2V17h-2.2v-3.6c0-1-.4-1.6-1.3-1.6s-1.5.6-1.5 1.7V17z" fill="currentColor" /></svg>);
}
