import React, { useEffect, useRef, useState } from 'react';

// Product photo viewer. Drag (finger or mouse) to turn the product.
// With a full turntable set (e.g. 24–36 photos taken all the way round,
// listed in "frames"), dragging plays through them for a true 360° spin.
// With just a front and back photo, dragging turns it front ↔ back.
export default function MerchSpin({ frames, label }) {
  const [i, setI] = useState(0);
  const drag = useRef(null);
  const n = frames.length;
  const step = n > 2 ? 14 : 70; // px of drag per frame

  useEffect(() => { frames.forEach((src) => { const im = new Image(); im.src = src; }); }, [frames]);

  const down = (e) => { drag.current = { x: e.clientX, i }; e.currentTarget.setPointerCapture?.(e.pointerId); };
  const move = (e) => {
    const d = drag.current; if (!d) return;
    const k = Math.round((d.x - e.clientX) / step);
    setI((((d.i + k) % n) + n) % n);
  };
  const up = () => { drag.current = null; };

  return (
    <div className="spin">
      <div className={`spin-stage ${n > 2 ? 'draggable' : ''}`} {...(n > 2 ? { onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up } : {})}
        role="img" aria-label={label}>
        {frames.map((src, k) => (
          <img key={src} src={src} alt="" draggable="false" className={`spin-img ${k === i ? 'on' : ''}`} />
        ))}
        <div className="spin-shadow" aria-hidden="true" />
      </div>
      {n === 2 ? (
        <div className="spin-views" role="tablist" aria-label="View">
          {['Front', 'Back'].map((t, k) => (
            <button key={t} type="button" role="tab" aria-selected={k === i} className={k === i ? 'on' : ''} onClick={() => setI(k)}>{t}</button>
          ))}
        </div>
      ) : n > 2 ? (
        <p className="spin-hint">↔ Drag to turn 360°</p>
      ) : null}
    </div>
  );
}
