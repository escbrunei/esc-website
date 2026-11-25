import React from 'react';
import members from '../data/members.json';
import Avatar from '../components/Avatar.jsx';
import ObjectiveIcon from '../components/ObjectiveIcon.jsx';
import { CONFIG } from '../config.js';
import { LinkedInLink } from '../components/Footer.jsx';
import { joinProps } from '../lib/join.js';

const OBJECTIVES = [
  'Equip aspiring economists with practical and analytical skills through professional development, workshops, and training programmes.',
  'Create opportunities for dialogue with economists, industry experts, practitioners, policymakers, and governments.',
  'Connect members with professional networks and opportunities to grow.',
  'Promote economics education at the grassroots level through outreach programmes.',
  'Cultivate a supportive and vibrant economics community.',
  'Contribute to discussions on national development and growth.',
];

export default function About() {

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">About Us</p>
          <h1>Who We Are</h1>
          <p className="lead">
            The Economic Students’ Chamber (DPE) Brunei is a student-led, non-profit organisation established in 2026 and based in Brunei Darussalam. We bring together students interested in economics and policy to learn from one
            another, meet practitioners, and contribute to conversations about Brunei’s development.
          </p>
        </div>
      </section>

      <section className="section container" aria-labelledby="mand-h">
        <h2 id="mand-h" className="section-title">Our Mandates</h2>
        <div className="card-grid three">
          <div className="card mandate"><ObjectiveIcon n="purpose" /><h3>Purpose</h3><p>To foster a vibrant, student-led community of economics enthusiasts and provide opportunities for learning, professional development, networking, and dialogue.</p></div>
          <div className="card mandate"><ObjectiveIcon n="vision" /><h3>Vision</h3><p>To be a leading national student-led economic association, recognised for developing aspiring economists and contributing to academic discourse and national development.</p></div>
          <div className="card mandate"><ObjectiveIcon n="mission" /><h3>Mission</h3><p>To empower aspiring economists through programmes that connect academic learning with real-world challenges.</p></div>
        </div>
      </section>

      <section className="section container" aria-labelledby="obj-h">
        <h2 id="obj-h" className="section-title">Our Objectives</h2>
        <ol className="objectives obj-grid">{OBJECTIVES.map((o, i) => <li key={o}><ObjectiveIcon n={i + 1} /><span>{o}</span></li>)}</ol>
      </section>

      <section className="section band">
        <div className="container handshake-feature">
          <div>
            <h2>The Invisible Handshake Series</h2>
            <p>The Invisible Handshake Series is ESC’s networking series, where students meet invited speakers from industry.</p>
            <a className="btn btn-gold" href="#/invisible-handshake">Explore the Series</a>
          </div>
        </div>
      </section>

      <section className="section container" aria-labelledby="members-h">
        <h2 id="members-h" className="section-title">Founding Members</h2>
        <p className="muted">Recognising the people who helped establish the Economic Students’ Chamber (DPE) Brunei in 2026.</p>
        <PeopleGrid people={members.founders || []} roleKey="foundingRole" empty="Founding member profiles will be added soon." />
      </section>

      <section className="section container get-involved" aria-labelledby="gi-h">
        <h2 id="gi-h" className="section-title">Get Involved</h2>
        <div className="hero-actions">
          <a className="btn btn-large" {...joinProps}>Join ESC</a>
          <a className="btn btn-large btn-ghost" href="#/merch">Shop ESC Merch</a>
        </div>
        <p className="muted">Instagram: <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{CONFIG.INSTAGRAM_HANDLE}</a> · LinkedIn: <LinkedInLink /></p>
      </section>
    </>
  );
}

function PeopleGrid({ people, roleKey, empty }) {
  if (!people.length) return <div className="empty"><p>{empty}</p></div>;
  return (
    <ul className="people">
      {people.map((p) => (
        <li key={`${p.name}-${p[roleKey] || ''}`} className="person">
          <Avatar name={p.name} photo={p.photo} />
          <strong>{p.name}</strong>
          {p[roleKey] && <span>{p[roleKey]}</span>}
        </li>
      ))}
    </ul>
  );
}
