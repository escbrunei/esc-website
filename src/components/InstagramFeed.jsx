import React, { useEffect, useState } from 'react';

// Shows the latest posts of an Instagram account from a Behold JSON feed
// (behold.so). Re-checks every 5 minutes while the page is open.
// Without a feed URL (or if the feed fails) it shows a "Follow" card instead.
export default function InstagramFeed({ feedUrl, handle, url, title }) {
  const [posts, setPosts] = useState(null);
  const [profile, setProfile] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!feedUrl) return undefined;
    let alive = true;
    const load = () =>
      fetch(feedUrl, { cache: 'no-cache' })
        .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
        .then((d) => {
          if (!alive) return;
          const list = Array.isArray(d) ? d : d.posts || [];
          setPosts(list.slice(0, 6));
          setProfile(Array.isArray(d) ? null : d);
          setFailed(false);
        })
        .catch(() => alive && setFailed(true));
    load();
    const t = setInterval(load, 5 * 60 * 1000);
    return () => { alive = false; clearInterval(t); };
  }, [feedUrl]);

  const header = (
    <a className="ig-head" href={url} target="_blank" rel="noopener noreferrer">
      {profile?.profilePictureUrl ? (
        <img className="ig-avatar" src={profile.profilePictureUrl} alt="" />
      ) : (
        <span className="ig-icon small" aria-hidden="true"><IgGlyph size={22} /></span>
      )}
      <span>
        <span className="ig-title">{title || handle}</span>
        <span className="ig-sub">{handle}{profile?.followersCount ? ` · ${profile.followersCount} followers` : ''}</span>
      </span>
      <span className="btn btn-small ig-follow">Follow</span>
    </a>
  );

  if (!feedUrl || failed || (posts && posts.length === 0)) {
    return (
      <div className="card ig-feed">
        {header}
        <p className="muted ig-note">See our latest posts on Instagram.</p>
      </div>
    );
  }

  return (
    <div className="card ig-feed">
      {header}
      {!posts ? (
        <div className="ig-grid">{Array.from({ length: 6 }, (_, i) => <span key={i} className="ig-tile loading" />)}</div>
      ) : (
        <div className="ig-grid">
          {posts.map((p) => {
            const img = p.sizes?.medium?.mediaUrl || p.sizes?.small?.mediaUrl || p.thumbnailUrl || p.mediaUrl;
            const alt = (p.prunedCaption || p.caption || '').slice(0, 120) || `Instagram post by ${handle}`;
            return (
              <a key={p.id} className="ig-tile" href={p.permalink} target="_blank" rel="noopener noreferrer">
                {img && <img src={img} alt={alt} loading="lazy" />}
                {(p.mediaType === 'VIDEO') && <span className="ig-badge" aria-hidden="true">▶</span>}
                {(p.mediaType === 'CAROUSEL_ALBUM') && <span className="ig-badge" aria-hidden="true">❐</span>}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function IgGlyph({ size = 34 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4.3" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" /></svg>
  );
}
