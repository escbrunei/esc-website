import React, { useEffect, useState } from 'react';

// Background footage: "Graphs on Multiple Screens" by ArtHouse Studio, Pexels
// (free under the Pexels License; credit shown on the page).
const VIDEO = 'https://videos.pexels.com/video-files/8480232/8480232-hd_1920_1080_25fps.mp4';
const VIDEO_PAGE = 'https://www.pexels.com/video/graphs-on-multiple-screens-8480232/';
import NewsSection from '../components/NewsSection.jsx';

export default function News() {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection?.saveData;
    setPlay(!reduce && !saveData);
  }, []);
  return (
    <>
      <section className="page-hero video-hero">
        {play && (
          <video className="hero-video" src={VIDEO} autoPlay muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1} />
        )}
        <div className="hero-video-tint" aria-hidden="true" />
        <a className="video-credit" href={VIDEO_PAGE} target="_blank" rel="noopener noreferrer">Video: ArtHouse Studio / Pexels</a>
        <div className="container">
          <p className="eyebrow">Economic News &amp; Releases</p>
          <h1>Economic News</h1>
          <p className="lead">The latest economic headlines and official releases for Brunei, ASEAN and the world, refreshed every day. Tap Ask ESynC on any item to learn what it means.</p>
        </div>
      </section>
      <NewsSection showTitle={false} />
    </>
  );
}
