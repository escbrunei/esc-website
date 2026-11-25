import React, { useState, useEffect, useRef } from 'react';
import { openESynC } from '../lib/esync.js';
import { joinProps } from '../lib/join.js';

// Short top bar: Home · Explore ▾ · Events · About ▾ · Join ESC
const GROUPS = [
  { type: 'link', to: '/', label: 'Home' },
  {
    type: 'menu', id: 'explore', label: 'Explore',
    items: [
      { to: '/dashboard', label: 'Brunei Economy', hint: 'Charts and data' },
      { to: '/news', label: 'News', hint: 'Daily headlines and releases' },
      { to: '/lab', label: 'Economics Lab', hint: 'Simulator and exercises' },
      { esync: true, label: 'Ask ESynC', hint: 'Our economics assistant' },
    ],
  },
  { type: 'link', to: '/events', label: 'Events' },
  { type: 'link', to: '/merch', label: 'Merch' },
  {
    type: 'menu', id: 'about', label: 'About',
    items: [
      { to: '/about', label: 'About Us', hint: 'Who we are' },
      { to: '/invisible-handshake', label: 'The Invisible Handshake', hint: 'Networking series' },
      { to: '/contact', label: 'Contact', hint: 'Email and socials' },
    ],
  },
];

export default function Nav({ path }) {
  const [open, setOpen] = useState(false);       // mobile panel
  const [menu, setMenu] = useState(null);        // open dropdown id
  const navRef = useRef(null);

  useEffect(() => { setOpen(false); setMenu(null); }, [path]);
  useEffect(() => {
    const onDoc = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setMenu(null); };
    const onKey = (e) => { if (e.key === 'Escape') setMenu(null); };
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey); };
  }, []);

  return (
    <header className="site-header">
      <div className="container nav-bar">
        <a href="#/" className="brand" aria-label="ESC home">
          <img className="brand-door" src="images/esc-door.png" alt="" width="30" height="40" />
          <span className="brand-text">Economic Students’ Chamber</span>
        </a>
        <button className="nav-toggle" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((o) => !o)}>
          <span className="sr-only">Menu</span>
          <span className="bars" aria-hidden="true" />
        </button>
        <nav id="site-nav" ref={navRef} className={`site-nav ${open ? 'open' : ''}`} aria-label="Main">
          {GROUPS.map((g) => {
            if (g.type === 'link') {
              return (
                <a key={g.to} href={`#${g.to}`} className={path === g.to ? 'active' : ''} aria-current={path === g.to ? 'page' : undefined}>{g.label}</a>
              );
            }
            const active = g.items.some((i) => i.to === path);
            const isOpen = menu === g.id;
            return (
              <div key={g.id} className={`nav-group ${isOpen ? 'is-open' : ''}`}
                onMouseEnter={() => window.matchMedia('(hover: hover) and (min-width: 1121px)').matches && setMenu(g.id)}
                onMouseLeave={() => window.matchMedia('(hover: hover) and (min-width: 1121px)').matches && setMenu(null)}>
                <button type="button" className={`nav-group-btn ${active ? 'active' : ''}`} aria-expanded={isOpen} aria-controls={`menu-${g.id}`}
                  onClick={() => setMenu(isOpen ? null : g.id)}>
                  {g.label} <span className="caret" aria-hidden="true">▾</span>
                </button>
                <div id={`menu-${g.id}`} className="nav-menu">
                  {g.items.map((i) => i.esync ? (
                    <button key={i.label} type="button" className="nav-item" onClick={() => { setMenu(null); setOpen(false); openESynC({ origin: 'home' }); }}>
                      <span className="nav-item-label">{i.label}</span><span className="nav-item-hint">{i.hint}</span>
                    </button>
                  ) : (
                    <a key={i.to} href={`#${i.to}`} className={`nav-item ${path === i.to ? 'current' : ''}`} aria-current={path === i.to ? 'page' : undefined}>
                      <span className="nav-item-label">{i.label}</span><span className="nav-item-hint">{i.hint}</span>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
          <a {...joinProps} className="btn btn-gold nav-join">Join ESC</a>
        </nav>
      </div>
    </header>
  );
}
