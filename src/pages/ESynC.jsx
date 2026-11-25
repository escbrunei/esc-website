import React, { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config.js';
import { getContext, onContextChange, playGreeting } from '../lib/esync.js';
import { loadIndicators } from '../lib/data.js';
import ESynCCharacter from '../components/ESynCCharacter.jsx';

function starters(ctx) {
  const d = ctx.details || {};
  switch (ctx.origin) {
    case 'chart':
      return [
        `Explain what the ${d.indicator} chart shows for ${d.yearRange}.`,
        `What might explain the biggest change in ${d.indicator}?`,
        `Why does ${d.indicator?.toLowerCase()} matter for people in Brunei?`,
      ];
    case 'simulator':
      return [
        'Why did the equilibrium price and quantity change?',
        'What real-world event in Brunei could cause this shift?',
        'Walk me through calculating the new equilibrium step by step.',
      ];
    case 'news':
      return [
        'What does this mean?',
        'Why might this matter for Brunei?',
        'Which economic terms in this item should I understand?',
      ];
    case 'lab':
      return [
        'Walk me through the 2022 inflation calculation step by step.',
        'What is the difference between CPI and inflation?',
        'Why can inflation be negative?',
      ];
    default:
      return [
        'What does GDP measure, in plain language?',
        'Why is oil and gas so important to Brunei’s economy?',
        'How do I calculate inflation from CPI?',
      ];
  }
}

const ORIGIN_LABEL = {
  home: 'Homepage', chart: 'Dashboard chart', simulator: 'Supply and demand simulator', news: 'News item', lab: 'Economics Lab exercise',
};

// Turns plain text into paragraphs with safe, clickable links.
function RichText({ text }) {
  return text.split(/\n{2,}/).map((para, i) => (
    <p key={i}>
      {para.split(/(https?:\/\/[^\s)]+)/g).map((part, j) =>
        /^https?:\/\//.test(part)
          ? <a key={j} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
          : part.split('\n').map((line, k, arr) => <React.Fragment key={`${j}-${k}`}>{line}{k < arr.length - 1 && <br />}</React.Fragment>)
      )}
    </p>
  ));
}

export default function ESynC() {
  const [ctx, setCtx] = useState(getContext());
  const [messages, setMessages] = useState([{ role: 'assistant', content: CONFIG.GREETING_TEXT, greeting: true }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [audioNote, setAudioNote] = useState('');
  const listRef = useRef(null);

  useEffect(() => onContextChange(setCtx), []);
  useEffect(() => { listRef.current?.lastElementChild?.scrollIntoView({ block: 'end', behavior: 'smooth' }); }, [messages, busy]);

  const replay = async () => {
    setAudioNote('');
    const ok = await playGreeting();
    if (!ok) setAudioNote('The recorded greeting isn’t available right now.');
  };

  const send = async (text) => {
    const q = text.trim();
    if (!q || busy) return;
    const next = [...messages, { role: 'user', content: q }];
    setMessages(next);
    setInput('');

    if (!CONFIG.ESYNC_ENDPOINT) {
      setMessages([...next, {
        role: 'assistant', system: true,
        content: 'ESynC’s AI service isn’t connected yet, so I can’t answer just now. The ESC committee is setting it up. In the meantime, the dashboard and Economics Lab are fully working.',
      }]);
      return;
    }

    setBusy(true);
    try {
      let datasets = [];
      try {
        datasets = (await loadIndicators()).map((i) => ({
          indicator: i.title, unit: i.unit, source: i.source, sourceUrl: i.sourceUrl,
          latestPeriod: i.latestPeriod, status: i.status, rows: i.rows,
        }));
      } catch { /* send without datasets */ }
      const res = await fetch(CONFIG.ESYNC_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.filter((m) => !m.system && !m.greeting).map(({ role, content }) => ({ role, content })),
          context: ctx,
          datasets,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages([...next, { role: 'assistant', content: data.reply || 'Sorry, I didn’t get an answer. Please try again.' }]);
    } catch {
      setMessages([...next, { role: 'assistant', system: true, content: 'Sorry, ESynC couldn’t be reached. Please check your connection and try again.' }]);
    } finally {
      setBusy(false);
    }
  };

  const d = ctx.details;
  return (
    <section className="chat-page">
      <div className="container chat-wrap">
        <header className="chat-header">
          <ESynCCharacter size={56} />
          <div>
            <h1>ESynC</h1>
            <p className="muted">ESC’s economics assistant</p>
          </div>
          <button className="btn btn-ghost btn-small replay" onClick={replay}>▶ Replay greeting</button>
        </header>
        {audioNote && <p className="notice" role="status">{audioNote}</p>}

        {ctx.origin !== 'home' && d && (
          <details className="context-card" open>
            <summary>Opened from: <strong>{ORIGIN_LABEL[ctx.origin] || ctx.origin}</strong>{ctx.title ? ` — ${ctx.title}` : ''}</summary>
            <ContextDetails ctx={ctx} />
          </details>
        )}

        <ol className="messages" ref={listRef} aria-live="polite">
          {messages.map((m, i) => (
            <li key={i} className={`msg ${m.role} ${m.system ? 'system' : ''}`}>
              <span className="sr-only">{m.role === 'user' ? 'You said:' : 'ESynC said:'}</span>
              <RichText text={m.content} />
            </li>
          ))}
          {busy && <li className="msg assistant typing"><span className="sr-only">ESynC is typing</span><i /><i /><i /></li>}
        </ol>

        <div className="starters" aria-label="Suggested questions">
          {starters(ctx).map((s) => (
            <button key={s} className="chip" onClick={() => send(s)} disabled={busy}>{s}</button>
          ))}
        </div>

        <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <label htmlFor="chat-q" className="sr-only">Ask ESynC a question</label>
          <textarea
            id="chat-q"
            rows={1}
            value={input}
            placeholder="Ask an economics question…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
          />
          <button className="btn" type="submit" disabled={busy || !input.trim()}>Send</button>
        </form>
        <p className="fineprint">ESynC can make mistakes. Check important figures against the original source.</p>
      </div>
    </section>
  );
}

function ContextDetails({ ctx }) {
  const d = ctx.details;
  if (ctx.origin === 'chart') {
    return (
      <ul>
        <li>Indicator: {d.indicator} ({d.unit})</li>
        <li>Years: {d.yearRange} · Latest available: {d.latestPeriod}</li>
        <li>Source: {d.source}</li>
        <li>Data: {d.dataStatus}</li>
      </ul>
    );
  }
  if (ctx.origin === 'simulator') {
    return (
      <ul>
        <li>Demand shift: {d.demandShift}</li>
        <li>Supply shift: {d.supplyShift}</li>
        <li>Original equilibrium: price {d.originalEquilibrium.price}, quantity {d.originalEquilibrium.quantity}</li>
        <li>New equilibrium: price {d.newEquilibrium.price}, quantity {d.newEquilibrium.quantity}</li>
      </ul>
    );
  }
  if (ctx.origin === 'news') {
    return (
      <ul>
        <li>{d.type}: {d.headline}</li>
        <li>Source: {d.source} · {d.published}</li>
        <li><a href={d.url} target="_blank" rel="noopener noreferrer">Original source</a></li>
        {d.onlyHeadline && <li>Only the headline is available, so answers will be limited.</li>}
        {d.sample && <li>This is a sample item, not real news.</li>}
      </ul>
    );
  }
  return <ul>{Object.entries(d).filter(([, v]) => typeof v === 'string').map(([k, v]) => <li key={k}>{k}: {v}</li>)}</ul>;
}
