import React, { useState } from 'react';
import members from '../data/members.json';
import Avatar from '../components/Avatar.jsx';
import { CONFIG } from '../config.js';
import { LinkedInLink } from '../components/Footer.jsx';

const OBJECTIVES = [
  'Equip aspiring economists with practical and analytical skills through professional development, workshops, and training programmes.',
  'Create opportunities for dialogue with economists, industry experts, practitioners, policymakers, and governments.',
  'Connect members with professional networks and opportunities to grow.',
  'Promote economics education at the grassroots level through outreach programmes.',
  'Cultivate a supportive and vibrant economics community.',
  'Contribute to discussions on national development and growth.',
];

const termLabel = (c) => c.label || `Committee ${c.term}`;

export default function About() {
  const committees = members.committees || [];
  const current = committees.find((c) => c.term === members.currentTerm);
  const past = committees.filter((c) => c.term !== members.currentTerm).sort((a, b) => String(b.term).localeCompare(String(a.term)));
  const [pastTerm, setPastTerm] = useState(past[0]?.term || '');
  const selected = past.find((c) => c.term === pastTerm);
  const speakMail = `mailto:${CONFIG.ESC_EMAIL}?subject=${encodeURIComponent('Speaking at an ESC event')}`;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">About Us</p>
          <h1>Who We Are</h1>
          <p className="lead">
            The Economic Students’ Chamber (DPE) Brunei is a student-led, non-profit organisation founded in 2026 and
            based in Bandar Seri Begawan. We bring together students interested in economics and policy to learn from one
            another, meet practitioners, and contribute to conversations about Brunei’s development.
          </p>
        </div>
      </section>

      <section className="section container" aria-labelledby="mand-h">
        <h2 id="mand-h" className="section-title">Our Mandates</h2>
        <div className="card-grid three">
          <div className="card mandate"><h3>Purpose</h3><p>To foster a vibrant, student-led community of economics enthusiasts and provide opportunities for learning, professional development, networking, and dialogue.</p></div>
          <div className="card mandate"><h3>Vision</h3><p>To be a leading national student-led economic association, recognised for developing aspiring economists and contributing to academic discourse and national development.</p></div>
          <div className="card mandate"><h3>Mission</h3><p>To empower aspiring economists through programmes that connect academic learning with real-world challenges.</p></div>
        </div>
      </section>

      <section className="section container" aria-labelledby="obj-h">
        <h2 id="obj-h" className="section-title">Our Objectives</h2>
        <ol className="objectives">{OBJECTIVES.map((o) => <li key={o}>{o}</li>)}</ol>
      </section>

      <section className="section band">
        <div className="container handshake-feature">
          <div>
            <h2>The Invisible Handshake</h2>
            <p>The Invisible Handshake is ESC’s networking series, where students meet invited speakers from industry.</p>
            <a className="btn btn-gold" href="#/invisible-handshake">Explore the Series</a>
          </div>
        </div>
      </section>

      <section className="section container" aria-labelledby="members-h">
        <h2 id="members-h" className="section-title">Meet Our Members</h2>

        <h3 className="sub-title">Current Committee{current ? ` · ${termLabel(current)}` : ''}</h3>
        <PeopleGrid people={current?.members || []} roleKey="role" empty="Committee profiles will be added soon." />

        <h3 className="sub-title">Founding Members</h3>
        <p className="muted">Recognising the people who helped establish the Economic Students’ Chamber (DPE) Brunei in 2026.</p>
        <PeopleGrid people={members.founders || []} roleKey="foundingRole" empty="Founding member profiles will be added soon." />

        <h3 className="sub-title">Past Committees</h3>
        {past.length ? (
          <>
            <label className="term-select">Select a term{' '}
              <select value={pastTerm} onChange={(e) => setPastTerm(e.target.value)}>
                {past.map((c) => <option key={c.term} value={c.term}>{termLabel(c)}</option>)}
              </select>
            </label>
            {selected && <PeopleGrid people={selected.members} roleKey="role" empty="No profiles were recorded for this term." />}
          </>
        ) : (
          <div className="empty"><p>Past committees will appear here once the inaugural committee’s term ends.</p></div>
        )}
      </section>

      <section className="section container get-involved" aria-labelledby="gi-h">
        <h2 id="gi-h" className="section-title">Get Involved</h2>
        <div className="hero-actions">
          <a className="btn btn-large" href="#/join">Join ESC</a>
          <a className="btn btn-large btn-ghost" href={speakMail}>Speak at an ESC Event</a>
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
