import React from 'react';

// Original ESynC mascot: a round gold "coin" character with a rising-chart antenna.
export default function ESynCCharacter({ size = 96, peeking = false, className = '' }) {
  return (
    <svg
      className={`esync-char ${peeking ? 'peeking' : ''} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="ESynC, the ESC economics assistant"
    >
      {/* antenna: a small rising line chart */}
      <polyline points="48,26 56,18 62,22 72,8" fill="none" stroke="#62160d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="72" cy="8" r="5" fill="#FFC549" stroke="#62160d" strokeWidth="3" />
      {/* head */}
      <circle cx="60" cy="68" r="44" fill="#FFC549" stroke="#62160d" strokeWidth="5" />
      <circle cx="60" cy="68" r="35" fill="none" stroke="#62160d" strokeWidth="2" strokeDasharray="3 5" opacity="0.45" />
      {/* eyes */}
      <ellipse cx="45" cy="62" rx="6" ry="8" fill="#62160d" />
      <ellipse cx="75" cy="62" rx="6" ry="8" fill="#62160d" />
      <circle cx="47" cy="59" r="2" fill="#fff" />
      <circle cx="77" cy="59" r="2" fill="#fff" />
      {/* cheeks */}
      <circle cx="36" cy="76" r="5" fill="#f08a5d" opacity="0.6" />
      <circle cx="84" cy="76" r="5" fill="#f08a5d" opacity="0.6" />
      {/* smile */}
      <path d="M48 80 Q60 92 72 80" fill="none" stroke="#62160d" strokeWidth="4" strokeLinecap="round" />
      {/* hands gripping the edge when peeking */}
      {peeking && (
        <>
          <ellipse cx="26" cy="110" rx="11" ry="7" fill="#FFC549" stroke="#62160d" strokeWidth="4" />
          <ellipse cx="94" cy="110" rx="11" ry="7" fill="#FFC549" stroke="#62160d" strokeWidth="4" />
        </>
      )}
    </svg>
  );
}
