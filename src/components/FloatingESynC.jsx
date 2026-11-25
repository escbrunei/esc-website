import React, { useEffect, useState } from 'react';
import { onOpenRequest } from '../lib/esync.js';
import { ESynCChat } from './ESynCChat.jsx';

// ESynC robot cat floating bottom-right on every page. Tapping it pops the
// chat open on top of the page, so visitors never leave what they're reading.
export default function FloatingESynC({ path }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => onOpenRequest(() => { setMounted(true); setOpen(true); }), []);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (path === '/esync') return null; // the full-page chat is already showing
  return (
    <>
      {mounted && (
        <div className={`esync-pop ${open ? 'open' : ''}`} role="dialog" aria-label="Chat with ESynC" aria-hidden={!open}>
          <ESynCChat popup open={open} onClose={() => setOpen(false)} />
        </div>
      )}
      <button
        type="button"
        className={`float-esync ${open ? 'is-open' : ''}`}
        onClick={() => { setMounted(true); setOpen((o) => !o); }}
        aria-label={open ? 'Close ESynC chat' : 'Chat with ESynC, our economics assistant'}
        aria-expanded={open}
      >
        <span className="float-label" aria-hidden="true">{open ? 'Close chat' : 'Chat with ESynC'}</span>
        <span className="float-body" aria-hidden="true">
          <img src="images/esync-robot.png" alt="" />
          <span className="float-spark s1" /><span className="float-spark s2" />
        </span>
        <span className="float-shadow" aria-hidden="true" />
      </button>
    </>
  );
}
