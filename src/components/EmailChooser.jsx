import React, { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config.js';

// Email link that lets people choose Gmail, Outlook, their mail app, or copy the address.
export default function EmailChooser({ email = CONFIG.ESC_EMAIL, subject = '', className = '', label }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', esc); };
  }, []);
  const su = encodeURIComponent(subject);
  const options = [
    { name: 'Gmail', href: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}${subject ? `&su=${su}` : ''}`, ext: true },
    { name: 'Outlook', href: `https://outlook.live.com/mail/0/deeplink/compose?to=${email}${subject ? `&subject=${su}` : ''}`, ext: true },
    { name: 'Yahoo Mail', href: `https://compose.mail.yahoo.com/?to=${email}${subject ? `&subject=${su}` : ''}`, ext: true },
    { name: 'Mail app on this device', href: `mailto:${email}${subject ? `?subject=${su}` : ''}` },
  ];
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); } catch { /* clipboard unavailable */ }
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };
  return (
    <span className={`email-chooser ${open ? 'is-open' : ''} ${className}`} ref={ref}>
      <button type="button" className="email-btn" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {label || email} <span className="caret" aria-hidden="true">▾</span>
      </button>
      {open && (
        <span className="email-menu" role="menu">
          {options.map((o) => (
            <a key={o.name} role="menuitem" href={o.href} {...(o.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} onClick={() => setOpen(false)}>{o.name}</a>
          ))}
          <button type="button" role="menuitem" onClick={copy}>{copied ? 'Copied!' : 'Copy email address'}</button>
        </span>
      )}
    </span>
  );
}
