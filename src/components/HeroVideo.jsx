import React, { useEffect, useState } from 'react';

// Free stock footage (Pexels License: free to use, no attribution required;
// we credit the creators anyway). Shown behind the maroon page banners.
export const VIDEOS = {
  home: { src: 'https://videos.pexels.com/video-files/6219763/6219763-uhd_2732_1440_30fps.mp4', by: 'Monstera Production', page: 'https://www.pexels.com/video/group-of-people-studying-6219763/' },
  news: { src: 'https://videos.pexels.com/video-files/8480232/8480232-hd_1920_1080_25fps.mp4', by: 'ArtHouse Studio', page: 'https://www.pexels.com/video/graphs-on-multiple-screens-8480232/' },
  dashboard: { src: 'https://videos.pexels.com/video-files/8480244/8480244-hd_1920_1080_25fps.mp4', by: 'ArtHouse Studio', page: 'https://www.pexels.com/video/video-of-a-stock-market-8480244/' },
  lab: { src: 'https://videos.pexels.com/video-files/8102869/8102869-hd_1920_1080_25fps.mp4', by: 'Mikhail Nilov', page: 'https://www.pexels.com/video/people-writing-on-whiteboard-8102869/' },
  contact: { src: 'https://videos.pexels.com/video-files/8170593/8170593-uhd_2560_1440_25fps.mp4', by: 'Kampus Production', page: 'https://www.pexels.com/video/group-of-people-shaking-hands-8170593/' },
  merch: { src: 'https://videos.pexels.com/video-files/4517768/4517768-hd_1920_1080_30fps.mp4', by: 'Anvar Tushakov', page: 'https://www.pexels.com/video/mannequins-inside-the-shopping-mall-4517768/' },
  publications: { src: 'https://videos.pexels.com/video-files/8141649/8141649-uhd_2560_1440_25fps.mp4', by: 'Alena Darmel', page: 'https://www.pexels.com/video/workmates-analyzing-some-papers-8141649/' },
};

export default function HeroVideo({ name }) {
  const v = VIDEOS[name];
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPlay(!reduce && !navigator.connection?.saveData);
  }, []);
  if (!v) return null;
  return (
    <>
      {play && <video className="hero-video" src={v.src} autoPlay muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1} />}
      <div className="hero-video-tint" aria-hidden="true" />
      <a className="video-credit" href={v.page} target="_blank" rel="noopener noreferrer">Video: {v.by} / Pexels</a>
    </>
  );
}
