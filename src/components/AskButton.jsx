import React from 'react';
import { openESynC } from '../lib/esync.js';

export default function AskButton({ context, label = 'Ask ESynC', className = '' }) {
  return (
    <button
      type="button"
      className={`btn btn-ask ${className}`}
      onClick={() => openESynC(typeof context === 'function' ? context() : context)}
    >
      <span aria-hidden="true" className="ask-dot" /> {label}
    </button>
  );
}
