import React from 'react';

// ESynC mascot: ESC's cat illustration (public/images/esync.png).
// badge: shows the cat in a cream circle (use on maroon backgrounds).
// peeking: crops the cat's lower body so it looks over the edge of the footer.
export default function ESynCCharacter({ size = 96, peeking = false, badge = false, className = '' }) {
  const img = (
    <img
      src="images/esync.png"
      alt="ESynC, the ESC economics assistant"
      width={size}
      height={Math.round(size * 1.14)}
      className="esync-img"
      draggable="false"
    />
  );
  if (peeking) return <span className={`esync-char peeking ${className}`} style={{ width: size, height: Math.round(size * 0.6) }}>{img}</span>;
  if (badge) return <span className={`esync-char badge ${className}`} style={{ width: size, height: size }}>{img}</span>;
  return <span className={`esync-char ${className}`} style={{ width: size }}>{img}</span>;
}
