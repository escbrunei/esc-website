import React from 'react';

const M = '#62160d'; const G = '#FFC549'; const S = '#fff4d6';

// Small animated illustrations for each ESC objective.
export default function ObjectiveIcon({ n }) {
  const p = { viewBox: '0 0 120 90', width: 120, height: 90, 'aria-hidden': true, className: `obj-icon obj-${n}` };
  switch (n) {
    case 1: // skills: laptop with a chart that draws itself + spinning gear
      return (
        <svg {...p}>
          <rect x="22" y="16" width="64" height="44" rx="5" fill={S} stroke={M} strokeWidth="3" />
          <rect x="14" y="60" width="80" height="7" rx="3" fill={M} />
          <polyline className="draw" points="30,50 42,42 52,46 64,32 76,26" fill="none" stroke={M} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <g className="spin" style={{ transformOrigin: '96px 26px' }}>
            <circle cx="96" cy="26" r="9" fill={G} stroke={M} strokeWidth="3" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <rect key={a} x="94" y="12" width="4" height="6" fill={M} transform={`rotate(${a} 96 26)`} />)}
            <circle cx="96" cy="26" r="3" fill={M} />
          </g>
        </svg>
      );
    case 2: // dialogue: two speech bubbles taking turns
      return (
        <svg {...p}>
          <g className="talk-a">
            <path d="M14 14 h50 a8 8 0 0 1 8 8 v18 a8 8 0 0 1 -8 8 h-30 l-10 10 v-10 h-10 a8 8 0 0 1 -8 -8 v-18 a8 8 0 0 1 8 -8z" fill={G} stroke={M} strokeWidth="3" />
            {[30, 40, 50].map((x, i) => <circle key={x} className={`dot d${i}`} cx={x} cy="31" r="3.2" fill={M} />)}
          </g>
          <g className="talk-b">
            <path d="M56 38 h48 a8 8 0 0 1 8 8 v16 a8 8 0 0 1 -8 8 h-8 v10 l-10 -10 h-30 a8 8 0 0 1 -8 -8 v-16 a8 8 0 0 1 8 -8z" fill={S} stroke={M} strokeWidth="3" />
            <line x1="66" y1="50" x2="100" y2="50" stroke={M} strokeWidth="3" strokeLinecap="round" />
            <line x1="66" y1="59" x2="90" y2="59" stroke={M} strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );
    case 3: // networks: nodes connecting with pulses
      return (
        <svg {...p}>
          {[[60, 45, 22, 20], [60, 45, 98, 18], [60, 45, 18, 70], [60, 45, 100, 72], [22, 20, 98, 18]].map(([a, b, c, d], i) => (
            <line key={i} className={`link l${i}`} x1={a} y1={b} x2={c} y2={d} stroke={M} strokeWidth="2.5" strokeDasharray="4 4" />
          ))}
          {[[22, 20], [98, 18], [18, 70], [100, 72]].map(([x, y], i) => <circle key={i} className={`node n${i}`} cx={x} cy={y} r="9" fill={G} stroke={M} strokeWidth="3" />)}
          <circle cx="60" cy="45" r="14" fill={M} />
          <circle cx="60" cy="40" r="5" fill={G} /><path d="M51 54 a9 7 0 0 1 18 0" fill={G} />
        </svg>
      );
    case 4: // grassroots education: open book with a plant growing
      return (
        <svg {...p}>
          <path d="M60 70 Q40 60 16 64 V30 Q40 26 60 36 Q80 26 104 30 V64 Q80 60 60 70z" fill={S} stroke={M} strokeWidth="3" strokeLinejoin="round" />
          <line x1="60" y1="36" x2="60" y2="70" stroke={M} strokeWidth="3" />
          <g className="grow" style={{ transformOrigin: '60px 36px' }}>
            <path d="M60 36 V14" stroke="#3f7a4f" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M60 22 q-14 -2 -16 -12 q12 0 16 12z" fill="#3f7a4f" />
            <path d="M60 18 q14 -4 18 -14 q-13 -1 -18 14z" fill="#5a9a68" />
          </g>
        </svg>
      );
    case 5: // community: three people waving, heart floats up
      return (
        <svg {...p}>
          {[[30, M], [60, '#d98e04'], [90, M]].map(([x, c], i) => (
            <g key={x} className={`person p${i}`} style={{ transformOrigin: `${x}px 80px` }}>
              <circle cx={x} cy="40" r="9" fill="#f2c9a6" stroke={c} strokeWidth="2" />
              <path d={`M${x - 13} 78 v-12 a13 13 0 0 1 26 0 v12z`} fill={c} />
            </g>
          ))}
          <path className="heart" d="M60 22 c-4 -6 -14 -3 -10 5 l10 9 l10 -9 c4 -8 -6 -11 -10 -5z" fill="#d9534f" />
        </svg>
      );
    default: // national development: buildings rising with an arrow
      return (
        <svg {...p}>
          <line x1="10" y1="78" x2="110" y2="78" stroke={M} strokeWidth="3" />
          {[[22, 34, M], [44, 50, '#d98e04'], [66, 62, M]].map(([x, h, c], i) => (
            <rect key={x} className={`bar b${i}`} x={x} y={78 - h} width="16" height={h} rx="2" fill={c} style={{ transformOrigin: `${x}px 78px` }} />
          ))}
          <g className="rise">
            <polyline points="18,52 44,36 66,30 96,10" fill="none" stroke={G} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M86 8 h12 v12" fill="none" stroke={G} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      );
  }
}
