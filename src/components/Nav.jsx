import React, { useState, useEffect } from 'react';
import { openESynC } from '../lib/esync.js';
import { joinProps } from '../lib/join.js';

const LINKS = [
  ['/', 'Home'],
  ['/dashboard', 'Brunei Economy'],
  ['/news', 'News'],
  ['/lab', 'Economics Lab'],
  ['/events', 'Events'],
  ['/about', 'About Us'],
  ['/contact', 'Contact'],
];

export default function Nav({ path }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  return (
    <header className="site-header">
      <div className="container nav-bar">
        <a href="#/" className="brand" aria-label="ESC home">
          <span className="brand-mark">ESC</span>
          <span className="brand-text">Economic Students’ Chamber</span>
        </a>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">Menu</span>
          <span className="bars" aria-hidden="true" />
        </button>
        <nav id="site-nav" className={`site-nav ${open ? 'open' : ''}`} aria-label="Main">
          {LINKS.map(([to, label]) => (
            <a key={to} href={`#${to}`} className={path === to ? 'active' : ''} aria-current={path === to ? 'page' : undefined}>
              {label}
            </a>
          ))}
          <button type="button" className="nav-ask" onClick={() => openESynC({ origin: 'home' })}>Ask ESynC</button>
          <a {...joinProps} className="btn btn-gold nav-join">Join ESC</a>
        </nav>
      </div>
    </header>
  );
}
