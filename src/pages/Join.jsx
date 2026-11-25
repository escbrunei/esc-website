import React, { useState } from 'react';
import { CONFIG } from '../config.js';

const ACTIVITIES = ['The Invisible Handshake', 'Workshops and training', 'Outreach programmes', 'Research and policy discussions', 'Social and networking events'];
const YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5 or above', 'Postgraduate', 'Other'];

export default function Join() {
  const [state, setState] = useState('idle'); // idle | sending | success | error
  const [errors, setErrors] = useState({});
  const available = Boolean(CONFIG.REGISTRATION_ENDPOINT);

  const submit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = {
      fullName: (f.get('fullName') || '').trim(),
      email: (f.get('email') || '').trim(),
      institution: (f.get('institution') || '').trim(),
      programme: (f.get('programme') || '').trim(),
      yearOfStudy: f.get('yearOfStudy') || '',
      interests: f.getAll('interests'),
      website: f.get('website') || '', // spam trap, should stay empty
      submittedAt: new Date().toISOString(),
    };
    const errs = {};
    if (!data.fullName) errs.fullName = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Please enter a valid email address.';
    if (!data.institution) errs.institution = 'Please enter your institution.';
    if (!data.programme) errs.programme = 'Please enter your programme.';
    if (!data.yearOfStudy) errs.yearOfStudy = 'Please choose your year of study.';
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0])?.focus();
      return;
    }
    setState('sending');
    try {
      // text/plain avoids a CORS preflight, which Google Apps Script cannot answer.
      const res = await fetch(CONFIG.REGISTRATION_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let body = {};
      try { body = await res.json(); } catch { /* some services return no JSON */ }
      if (body.ok === false || body.error) throw new Error(body.error || 'Rejected');
      setState('success');
    } catch {
      setState('error');
    }
  };

  const emailLink = <a href={`mailto:${CONFIG.ESC_EMAIL}?subject=${encodeURIComponent('ESC membership')}`}>{CONFIG.ESC_EMAIL}</a>;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Membership</p>
          <h1>Join ESC</h1>
          <p className="lead">Register to hear about ESC events, workshops and opportunities.</p>
        </div>
      </section>
      <section className="section container narrow">
        {state === 'success' ? (
          <div className="card success-card" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
            <h2>Thank you for registering with ESC!</h2>
            <p>We’ll be in touch by email. Follow <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{CONFIG.INSTAGRAM_HANDLE}</a> for the latest news.</p>
          </div>
        ) : CONFIG.JOIN_URL ? (
          <div className="card notice-card" data-testid="join-link">
            <h2>Register with ESC</h2>
            <p>Fill in our membership form to join. It opens in a new tab.</p>
            <a className="btn btn-large" href={CONFIG.JOIN_URL} target="_blank" rel="noopener noreferrer">Open the membership form</a>
            <p className="fineprint" style={{ marginTop: '1rem' }}>Having trouble? Email the committee at {emailLink}.</p>
          </div>
        ) : !available ? (
          <div className="card notice-card" role="note" data-testid="registration-unavailable">
            <h2>Online registration isn’t open yet</h2>
            <p>To join ESC, please email the committee at {emailLink} with your full name, institution, programme and year of study.</p>
          </div>
        ) : (
          <form className="card form" onSubmit={submit} noValidate>
            {state === 'error' && (
              <p className="notice notice-error" role="alert">
                Sorry, your registration couldn’t be sent. Please try again, or email the committee at {emailLink}.
              </p>
            )}
            <Field id="fullName" label="Full name" error={errors.fullName}><input id="fullName" name="fullName" autoComplete="name" required /></Field>
            <Field id="email" label="Email address" error={errors.email}><input id="email" name="email" type="email" autoComplete="email" inputMode="email" required /></Field>
            <Field id="institution" label="Institution" error={errors.institution}><input id="institution" name="institution" placeholder="e.g. Universiti Brunei Darussalam" required /></Field>
            <Field id="programme" label="Programme" error={errors.programme}><input id="programme" name="programme" placeholder="e.g. BA Economics" required /></Field>
            <Field id="yearOfStudy" label="Year of study" error={errors.yearOfStudy}>
              <select id="yearOfStudy" name="yearOfStudy" defaultValue="" required>
                <option value="" disabled>Choose…</option>
                {YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </Field>
            <fieldset className="field">
              <legend>Which ESC activities are you interested in? <span className="muted">(optional)</span></legend>
              {ACTIVITIES.map((a) => (
                <label key={a} className="check"><input type="checkbox" name="interests" value={a} /> {a}</label>
              ))}
            </fieldset>
            <div className="hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            <p className="fineprint">Your details go privately to the ESC committee and are used only for ESC membership and communications.</p>
            <button className="btn btn-large" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Register'}</button>
          </form>
        )}
      </section>
    </>
  );
}

function Field({ id, label, error, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {React.cloneElement(children, { 'aria-invalid': !!error, 'aria-describedby': error ? `${id}-err` : undefined })}
      {error && <span className="field-error" id={`${id}-err`}>{error}</span>}
    </div>
  );
}
