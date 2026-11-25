import React, { useState } from 'react';

const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

export default function Avatar({ name, photo }) {
  const [broken, setBroken] = useState(false);
  return photo && !broken ? (
    <img className="avatar" src={photo} alt={`Photo of ${name}`} loading="lazy" onError={() => setBroken(true)} />
  ) : (
    <span className="avatar avatar-initials" aria-hidden="true">{initials(name)}</span>
  );
}
