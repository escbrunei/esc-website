import React, { useEffect, useRef, useState } from 'react';

/**
 * "ESCape the ordinary": a stickman walks up, opens the ESC door and steps through.
 * Plays when it scrolls into view; tap or hover to play again.
 */
export default function EscapeDoor() {
  const ref = useRef(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const el = ref.current; if (!el) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun((r) => (r === 0 ? 1 : r)); } }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const replay = () => setRun((r) => r + 1);

  return (
    <button type="button" className={`escape ${run ? 'play' : ''}`} key={run} ref={ref} onClick={replay}
      onMouseEnter={() => { if (run) replay(); }} aria-label="ESCape the ordinary: play the animation">
      <span className="escape-stage" aria-hidden="true">
        <span className="escape-frame" />
        <span className="escape-man">
          <svg viewBox="0 0 90 150" width="90" height="150">
            <g fill="none" stroke="#62160d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="45" cy="30" r="22" fill="#fff" />
              <path d="M36 12 q4 -10 12 -8 M44 9 q6 -9 14 -4 M52 11 q8 -5 12 2" strokeWidth="3" />
              <circle cx="37" cy="27" r="2.5" fill="#62160d" stroke="none" />
              <circle cx="53" cy="27" r="2.5" fill="#62160d" stroke="none" />
              <path d="M34 37 q11 12 22 0" />
              <line x1="45" y1="52" x2="45" y2="98" />
              <g className="arm a1"><line x1="45" y1="62" x2="45" y2="90" /></g>
              <g className="arm a2"><line x1="45" y1="62" x2="45" y2="90" /></g>
              <g className="leg l1"><line x1="45" y1="98" x2="45" y2="142" /></g>
              <g className="leg l2"><line x1="45" y1="98" x2="45" y2="142" /></g>
            </g>
          </svg>
        </span>
        <span className="escape-door"><img src="images/esc-door.png" alt="" /></span>
        <span className="escape-shadow" />
      </span>
      <span className="escape-tag" aria-hidden="true"><b>ESC</b>ape the ordinary</span>
    </button>
  );
}
