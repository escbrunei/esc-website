import React from 'react';

// A small community of students standing in an arc under the crest,
// linked by a dotted "network" line. They pop in one by one after the
// crest rolls into place, and the middle one waves.
const PEOPLE = [
  // x, y (feet line), scale, body colour, hair style, phoneHide
  [38, 160, 1.1, '#f6dfb0', 'short', true],
  [100, 174, 1.22, '#FFC549', 'long', false],
  [165, 184, 1.32, '#f6dfb0', 'cap', false],
  [230, 188, 1.4, '#FFC549', 'short', false, true],
  [295, 184, 1.32, '#f6dfb0', 'hijab', false],
  [360, 174, 1.22, '#FFC549', 'short', false],
  [422, 160, 1.1, '#f6dfb0', 'long', true],
];
const SKIN = ['#e9b98f', '#c98d63', '#f0c8a0', '#b97a52', '#e2a97f', '#d49a70', '#f0c8a0'];
const M = '#62160d';
const HAIR = '#2a0f0a';
const RIM = '#f6dfb0';

function Person({ x, y, s, body, hair, skin, wave, i }) {
  return (
    <g className={`soc-p p${i}`} style={{ '--d': `${1.5 + i * 0.12}s` }} transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="soc-in">
        {/* body */}
        <path d="M-22 0 v-22 a22 20 0 0 1 44 0 v22z" fill={body} stroke={M} strokeWidth="2.5" />
        <path d="M-6 -41 l6 9 6 -9" fill="none" stroke={M} strokeWidth="2" strokeLinejoin="round" />
        {/* arm */}
        {wave ? (
          <g className="soc-wave" style={{ transformOrigin: '16px -34px' }}>
            <path d="M16 -34 l10 -24" stroke={body} strokeWidth="9" strokeLinecap="round" />
                        <circle cx="27" cy="-60" r="5.5" fill={skin} stroke={M} strokeWidth="2" />
          </g>
        ) : null}
        {/* head */}
        {hair === 'hijab' ? (
          <>
            <path d="M-17 -50 a17 19 0 0 1 34 0 v10 q-17 10 -34 0z" fill="#3d6b5a" stroke={RIM} strokeWidth="1.5" />
            <circle cx="0" cy="-56" r="11.5" fill={skin} />
          </>
        ) : (
          <>
            {hair === 'long' && <path d="M-15 -56 a15 15 0 0 1 30 0 v16 h-30z" fill={HAIR} stroke={RIM} strokeWidth="1.5" />}
            <circle cx="0" cy="-56" r="13" fill={skin} stroke={RIM} strokeWidth="1.5" />
            {hair === 'short' && <path d="M-13.5 -57 a13.5 13.5 0 0 1 27 0 q-8 -6 -13.5 -5 q-7 0 -13.5 5z" fill={HAIR} />}
            {hair === 'long' && <path d="M-13.5 -57 a13.5 13.5 0 0 1 27 0 q-13.5 -4 -27 0z" fill={HAIR} />}
            {hair === 'cap' && <path d="M-14 -59 a14 12 0 0 1 28 0z M10 -61 h11 v3.5 h-11z" fill="#FFC549" stroke={HAIR} strokeWidth="1.5" />}
          </>
        )}
        <circle cx="-4.5" cy="-55" r="1.4" fill={HAIR} /><circle cx="4.5" cy="-55" r="1.4" fill={HAIR} />
        <path d="M-4 -50 q4 3.5 8 0" fill="none" stroke={HAIR} strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </g>
  );
}

export default function HeroSociety() {
  const heads = PEOPLE.map(([x, y, s]) => [x, y - 56 * s]);
  const line = heads.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y - 24}`).join(' ');
  return (
    <svg className="hero-society" viewBox="0 0 460 192" aria-hidden="true">
      <path className="soc-net" d={line} fill="none" stroke="#FFC549" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
      {heads.map(([x, y], i) => <circle key={i} className="soc-node" style={{ '--d': `${1.5 + i * 0.12}s` }} cx={x} cy={y - 24} r="3.4" fill="#FFC549" />)}
      {PEOPLE.map(([x, y, s, body, hair, phoneHide, wave], i) => (
        <g key={i} className={phoneHide ? 'soc-edge' : ''}>
          <Person i={i} x={x} y={y} s={s} body={body} hair={hair} skin={SKIN[i]} wave={wave} />
        </g>
      ))}
    </svg>
  );
}
