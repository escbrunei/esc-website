import React from 'react';
import { bruneiDate } from '../lib/time.js';

export default function EventCard({ ev, past }) {
  const s = ev.speaker;
  return (
    <article className="card event-card" id={`event-${ev.id}`}>
      {ev.series === 'invisible-handshake' && <span className="kind kind-series">The Invisible Handshake</span>}
      <h3>{ev.title}</h3>
      {ev.topic && <p className="event-topic">Topic: {ev.topic}</p>}
      <p className="event-meta">
        <time dateTime={ev.date}>{bruneiDate(ev.date)}</time>{ev.time ? ` · ${ev.time}` : ''}{ev.venue ? ` · ${ev.venue}` : ''}
      </p>
      {s && s.name && (
        <p className="event-speaker"><strong>{s.name}</strong>{[s.role, s.organisation].filter(Boolean).length ? `, ${[s.role, s.organisation].filter(Boolean).join(', ')}` : ''}</p>
      )}
      {!past && ev.summary && <p>{ev.summary}</p>}
      {past && (ev.recap || ev.summary) && <p>{ev.recap || ev.summary}</p>}
      {past && ev.photos?.length > 0 && (
        <div className="photos">
          {ev.photos.map((p) => <img key={p.src} src={p.src} alt={p.alt || ''} loading="lazy" />)}
        </div>
      )}
      <div className="card-actions">
        {!past && ev.registrationUrl && <a className="btn btn-small" href={ev.registrationUrl} target="_blank" rel="noopener noreferrer">Register</a>}
        {ev.postUrl && <a className="btn btn-small btn-ghost" href={ev.postUrl} target="_blank" rel="noopener noreferrer">{past ? 'See the highlights' : 'View the announcement'}</a>}
      </div>
    </article>
  );
}
