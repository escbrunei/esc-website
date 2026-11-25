import React from 'react';
import NewsSection from '../components/NewsSection.jsx';

export default function News() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Economic News &amp; Releases</p>
          <h1>Economic News</h1>
          <p className="lead">The latest economic headlines and official releases for Brunei, ASEAN and the world, refreshed every hour. Tap Ask ESynC on any item to learn what it means.</p>
        </div>
      </section>
      <NewsSection showTitle={false} />
    </>
  );
}
