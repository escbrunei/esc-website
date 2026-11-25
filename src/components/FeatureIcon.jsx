import React from 'react';

// Small animated icons for the homepage feature cards.
export default function FeatureIcon({ kind }) {
  const common = { viewBox: '0 0 64 64', width: 64, height: 64, 'aria-hidden': true, className: `ficon ficon-${kind}` };
  if (kind === 'dashboard') {
    return (
      <svg {...common}>
        <rect x="6" y="8" width="52" height="48" rx="8" className="f-bg" />
        <rect x="14" y="34" width="8" height="14" rx="2" className="f-bar b1" />
        <rect x="28" y="26" width="8" height="22" rx="2" className="f-bar b2" />
        <rect x="42" y="18" width="8" height="30" rx="2" className="f-bar b3" />
        <polyline points="12,30 26,22 38,25 52,12" className="f-line" />
        <circle cx="52" cy="12" r="3" className="f-dot" />
      </svg>
    );
  }
  if (kind === 'news') {
    return (
      <svg {...common}>
        <g className="f-paper">
          <rect x="8" y="10" width="44" height="44" rx="6" className="f-bg" />
          <path d="M52 22h4v26a6 6 0 0 1-6 6" className="f-stroke" fill="none" />
          <rect x="14" y="17" width="32" height="7" rx="2" className="f-fill" />
          <rect x="14" y="29" width="14" height="12" rx="2" className="f-fill soft" />
          <line x1="32" y1="31" x2="46" y2="31" className="f-stroke" />
          <line x1="32" y1="37" x2="46" y2="37" className="f-stroke" />
          <line x1="14" y1="47" x2="46" y2="47" className="f-stroke" />
        </g>
      </svg>
    );
  }
  if (kind === 'lab') {
    return (
      <svg {...common}>
        <rect x="6" y="6" width="52" height="52" rx="8" className="f-bg" />
        <polyline points="12,12 12,52 52,52" className="f-stroke" fill="none" />
        <line x1="18" y1="16" x2="48" y2="46" className="f-demand" />
        <line x1="18" y1="46" x2="48" y2="16" className="f-supply" />
        <circle cx="33" cy="31" r="4" className="f-dot eq" />
      </svg>
    );
  }
  // ESynC: the cat with a speech bubble
  return (
    <span className="ficon ficon-esync" aria-hidden="true">
      <img src="images/esync-robot.png" alt="" />
      <span className="f-bubble">?</span>
    </span>
  );
}
