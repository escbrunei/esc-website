import React from 'react';
import { openESynC } from '../lib/esync.js';

// ESynC robot cat that floats in the bottom-right corner on every page.
export default function FloatingESynC({ path }) {
  if (path === '/esync') return null; // already in the chat
  return (
    <button type="button" className="float-esync" onClick={() => openESynC({ origin: 'home' })} aria-label="Ask ESynC, our economics assistant">
      <span className="float-label" aria-hidden="true">Ask ESynC</span>
      <span className="float-body" aria-hidden="true">
        <img src="images/esync-robot.png" alt="" />
        <span className="float-spark s1" /><span className="float-spark s2" />
      </span>
      <span className="float-shadow" aria-hidden="true" />
    </button>
  );
}
