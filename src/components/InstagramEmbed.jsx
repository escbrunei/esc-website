import React, { useEffect } from 'react';

let loading = null;
function loadScript() {
  if (window.instgrm) return Promise.resolve();
  if (!loading) {
    loading = new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = 'https://www.instagram.com/embed.js';
      s.async = true;
      s.onload = resolve;
      s.onerror = resolve;
      document.body.appendChild(s);
    });
  }
  return loading;
}

// Shows Instagram posts with Instagram's official embed (photos + caption, always current).
export default function InstagramPosts({ urls }) {
  useEffect(() => {
    if (!urls.length) return;
    loadScript().then(() => window.instgrm?.Embeds?.process());
  }, [urls.join('|')]);

  return (
    <div className="ig-embeds">
      {urls.map((url) => {
        const clean = url.split('?')[0].replace(/\/?$/, '/');
        return (
          <div key={clean} className="ig-embed">
            <blockquote className="instagram-media" data-instgrm-permalink={`${clean}?utm_source=ig_embed`} data-instgrm-version="14" data-instgrm-captioned="">
              <a href={clean} target="_blank" rel="noopener noreferrer">View this post on Instagram</a>
            </blockquote>
          </div>
        );
      })}
    </div>
  );
}
