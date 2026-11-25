import React from 'react';

// Students hiding behind the crest. One at a time they peek out from
// behind the rim, wave hello, and duck back behind it.
const PEEKERS = [
  // angle around the crest (0 = top), body colour, style, scarf, skin
  { a: -44, body: '#f6dfb0', style: 'short', skin: '#e9b98f' },
  { a: -15, body: '#FFC549', style: 'hijab', scarf: '#2f4f7a', skin: '#c98d63' },
  { a: 15, body: '#f6dfb0', style: 'cap', skin: '#f0c8a0' },
  { a: 44, body: '#FFC549', style: 'hijab', scarf: '#3d6b5a', skin: '#e2a97f' },
];
const M = '#62160d';
const HAIR = '#2a0f0a';

function Peeker({ body, style, scarf, skin, flip }) {
  const hijab = style === 'hijab';
  const fy = hijab ? -50.5 : -54;
  return (
    <svg viewBox="-34 -84 68 84" className="peek-svg">
      <g transform={flip ? 'scale(-1 1)' : undefined}>
        <path d="M-22 0 v-14 a22 20 0 0 1 44 0 v14z" fill={body} stroke={M} strokeWidth="2.5" />
        {!hijab && <path d="M-6 -33 l6 8 6 -8" fill="none" stroke={M} strokeWidth="2" strokeLinejoin="round" />}
        <g className="peek-hand">
          <path d="M17 -26 l8 -30" stroke={body} strokeWidth="9" strokeLinecap="round" />
          <circle cx="26" cy="-59" r="6" fill={skin} />
        </g>
        {hijab ? (
          <>
            <path d="M-17 -55 a17 17 0 0 1 34 0 v14 q0 8 -9 10 h-16 q-9 -2 -9 -10z" fill={scarf} />
            <ellipse cx="0" cy="-50.5" rx="9.5" ry="10.5" fill={skin} />
          </>
        ) : (
          <>
            <circle cx="0" cy="-54" r="13" fill={skin} />
            {style === 'short' && <path d="M-13.5 -55 a13.5 13.5 0 0 1 27 0 q-8 -6 -13.5 -5 q-7 0 -13.5 5z" fill={HAIR} />}
            {style === 'cap' && <path d="M-14 -57 a14 12 0 0 1 28 0z M10 -59 h11 v3.5 h-11z" fill="#FFC549" stroke={HAIR} strokeWidth="1.5" />}
          </>
        )}
        <circle cx="-4.5" cy={fy + 1} r="1.4" fill={HAIR} /><circle cx="4.5" cy={fy + 1} r="1.4" fill={HAIR} />
        <path d={`M-4 ${fy + 6} q4 3.5 8 0`} fill="none" stroke={HAIR} strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function HeroSociety() {
  return (
    <div className="peekers" aria-hidden="true">
      {PEEKERS.map((p, i) => (
        <div key={i} className="peek-arm" style={{ transform: `rotate(${p.a}deg)`, '--i': i }}>
          <div className="peek-who"><div style={{ transform: `rotate(${-p.a * 0.45}deg)`, transformOrigin: '50% 100%' }}><Peeker {...p} flip={p.a < 0} /></div></div>
        </div>
      ))}
    </div>
  );
}
