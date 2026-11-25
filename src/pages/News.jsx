import React from 'react';
import HeroVideo from '../components/HeroVideo.jsx';
import NewsSection from '../components/NewsSection.jsx';

export default function News() {
  return (
    <>
      <section className="page-hero video-hero">
        <HeroVideo name="news" />
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
