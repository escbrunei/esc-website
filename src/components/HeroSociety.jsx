import React from 'react';

// A small community of students standing in an arc under the crest.
// They pop in one by one after the crest rolls into place, and the
// middle one waves.
const PEOPLE = [
  // x, y (feet line), scale, body colour, style, scarf colour, waves
  [38, 160, 1.1, '#f6dfb0', 'short'],
  [100, 174, 1.22, '#FFC549', 'hijab', '#2f4f7a'],
  [165, 184, 1.32, '#f6dfb0', 'cap'],
  [230, 188, 1.4, '#FFC549', 'short', null, true],
  [295, 184, 1.32, '#f6dfb0', 'hijab', '#3d6b5a'],
  [360, 174, 1.22, '#FFC549', 'short'],
  [422, 160, 1.1, '#f6dfb0', 'hijab', '#e8a0a8'],
];
const SKIN = ['#e9b98f', '#c98d63', '#f0c8a0', '#b97a52', '#e2a97f', '#d49a70', '#f0c8a0'];
const M = '#62160d';
const HAIR = '#2a0f0a';

function Person({ x, y, s, body, style, scarf, skin, wave, i }) {
  const hijab = style === 'hijab';
  const faceY = hijab ? -52.5 : -56;
  return (
    <g className={`soc-p p${i}`} style={{ '--d': `${1.5 + i * 0.12}s` }} transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="soc-in">
        {/* body */}
        <path d="M-22 0 v-22 a22 20 0 0 1 44 0 v22z" fill={body} stroke={M} strokeWidth="2.5" />
        {!hijab && <path d="M-6 -41 l6 9 6 -9" fill="none" stroke={M} strokeWidth="2" strokeLinejoin="round" />}
        {wave && (
          <g className="soc-wave" style={{ transformOrigin: '16px -34px' }}>
            <path d="M16 -34 l10 -24" stroke={body} strokeWidth="9" strokeLinecap="round" />
            <circle cx="27" cy="-60" r="5.5" fill={skin} />
          </g>
        )}
        {hijab ? (
          <>
            {/* scarf covers the head and drapes onto the shoulders */}
            <path d="M-17 -57 a17 17 0 0 1 34 0 v14 q0 8 -9 10 h-16 q-9 -2 -9 -10z" fill={scarf} />
            <ellipse cx="0" cy="-52.5" rx="9.5" ry="10.5" fill={skin} />
          </>
        ) : (
          <>
            <circle cx="0" cy="-56" r="13" fill={skin} />
            {style === 'short' && <path d="M-13.5 -57 a13.5 13.5 0 0 1 27 0 q-8 -6 -13.5 -5 q-7 0 -13.5 5z" fill={HAIR} />}
            {style === 'cap' && <path d="M-14 -59 a14 12 0 0 1 28 0z M10 -61 h11 v3.5 h-11z" fill="#FFC549" stroke={HAIR} strokeWidth="1.5" />}
          </>
        )}
        <circle cx="-4.5" cy={faceY + 1} r="1.4" fill={HAIR} /><circle cx="4.5" cy={faceY + 1} r="1.4" fill={HAIR} />
        <path d={`M-4 ${faceY + 6} q4 3.5 8 0`} fill="none" stroke={HAIR} strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </g>
  );
}

export default function HeroSociety() {
  return (
    <svg className="hero-society" viewBox="0 0 460 192" aria-hidden="true">
      {PEOPLE.map(([x, y, s, body, style, scarf, wave], i) => (
        <Person key={i} i={i} x={x} y={y} s={s} body={body} style={style} scarf={scarf} skin={SKIN[i]} wave={wave} />
      ))}
    </svg>
  );
}
