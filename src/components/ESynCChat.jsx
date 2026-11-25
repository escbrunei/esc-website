import React, { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config.js';
import { getContext, onContextChange } from '../lib/esync.js';
import { loadIndicators } from '../lib/data.js';

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

export function ESynCChat({ popup = false, onClose, open = true }) {
  const [ctx, setCtx] = useState(getContext());
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => onContextChange(setCtx), []);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open]);
  useEffect(() => { if (popup && open) setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 250); }, [popup, open]);
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
          messages: next.filter((m) => !m.system).map(({ role, content }) => ({ role, content })),
          context: ctx,
          datasets,
        }),
      });
      let data = {};
      try { data = await res.json(); } catch { /* not JSON */ }
      if (!res.ok) {
        setMessages([...next, { role: 'assistant', system: true, content: `Sorry, ESynC isn’t available right now (error ${res.status}${data.error ? `: ${data.error}` : ''}). Please try again later.` }]);
        return;
      }
      setMessages([...next, { role: 'assistant', content: data.reply || 'Sorry, I didn’t get an answer. Please try again.', sources: data.sources || [] }]);
    } catch {
      setMessages([...next, { role: 'assistant', system: true, content: 'Sorry, ESynC couldn’t be reached. Please check your connection and try again.' }]);
    } finally {
      setBusy(false);
    }
  };

  const d = ctx.details;
  const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };
  return (
    <div className={`esync-chat ${popup ? 'popup' : ''}`}>
      <header className="esync-chat-head">
        <img src="images/esync-robot.png" alt="" className="esync-chat-avatar" />
        <div className="esync-chat-title">
          <h2>ESynC</h2>
          <p>ESC’s AI assistant</p>
        </div>
        {onClose && <button type="button" className="esync-close" onClick={onClose} aria-label="Close chat">×</button>}
      </header>

      <div className="esync-chat-body" ref={listRef}>
        {ctx.origin !== 'home' && d && (
          <details className="context-card">
            <summary>About: {ORIGIN_LABEL[ctx.origin] || ctx.origin}{ctx.title ? ` — ${ctx.title}` : ''}</summary>
            <ContextDetails ctx={ctx} />
          </details>
        )}
        <ol className="messages" aria-live="polite">
          {messages.map((m, i) => (
            <li key={i} className={`msg-row ${m.role}`}>
              {m.role === 'assistant' && <img src="images/esync-robot.png" alt="" className="msg-avatar" />}
              <div className={`msg ${m.role} ${m.system ? 'system' : ''}`}>
                <span className="sr-only">{m.role === 'user' ? 'You said:' : 'ESynC said:'}</span>
                <RichText text={m.content} />
                {m.sources?.length > 0 && (
                  <div className="msg-sources">
                    <span className="msg-sources-label">Sources</span>
                    <ol>
                      {m.sources.map((src) => (
                        <li key={src.url + src.title}><a href={src.url} target="_blank" rel="noopener noreferrer">{src.title}</a> <span className="src-host">{host(src.url)}</span></li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </li>
          ))}
          {busy && <li className="msg-row assistant"><img src="images/esync-robot.png" alt="" className="msg-avatar" /><div className="msg assistant typing"><span className="sr-only">ESynC is typing</span><i /><i /><i /></div></li>}
        </ol>
        {messages.length === 0 && (
          <div className="starters" aria-label="Suggested questions">
            {starters(ctx).map((s) => (
              <button key={s} className="chip" onClick={() => send(s)} disabled={busy}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <label htmlFor={popup ? 'chat-q-pop' : 'chat-q'} className="sr-only">Ask ESynC a question</label>
        <textarea
          id={popup ? 'chat-q-pop' : 'chat-q'}
          ref={inputRef}
          rows={1}
          value={input}
          placeholder="Type a message…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
        />
        <button className="send-btn" type="submit" disabled={busy || !input.trim()} aria-label="Send">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M3 11.5 20 4l-6.5 17-2.6-7.2L3 11.5z" fill="currentColor" /></svg>
        </button>
      </form>
      <p className="fineprint">ESynC can make mistakes. Check important figures against the source.</p>
    </div>
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
