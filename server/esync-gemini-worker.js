/**
 * ESynC backend using Google's Gemini API (free tier available).
 * A Cloudflare Worker that keeps the API key secret and answers with sources
 * found through Google Search grounding.
 *
 * Set in Cloudflare (Worker → Settings → Variables and Secrets):
 *   GEMINI_API_KEY  (Secret)    from https://aistudio.google.com → Get API key
 *   ALLOWED_ORIGIN  (Variable)  e.g. https://escbrunei.github.io
 *   MODEL           (Variable, optional) default: gemini-flash-latest
 */

const MAX_MESSAGES = 16;
const MAX_CHARS = 4000;

const SYSTEM_PROMPT = `You are ESynC, the economics assistant of the Economic Students' Chamber (ESC) (DPE) Brunei, a student-led economic association in Brunei Darussalam.

How you help:
- Explain economics in plain, friendly language for students. Define jargon.
- Help students interpret Brunei's economic data and guide calculations step by step.
- Keep answers short: 2–5 short paragraphs or a short list. Use B$ for Brunei dollars.

Reliable sources (very important):
- For any fact, figure, date or current event, use Google Search and rely on official or reputable sources first: Department of Economic Planning and Statistics (deps.gov.bn / deps.mofe.gov.bn), Brunei Darussalam Central Bank (bdcb.gov.bn), Ministry of Finance and Economy (mofe.gov.bn), IMF, World Bank, ADB, ASEAN / ASEANstats, AMRO, OECD, then established news outlets.
- For Brunei indicators, prefer the WEBSITE DATASETS below (official DEPS figures) and cite them with source and period, e.g. "(DEPS, 2025)".
- Never invent figures or sources. If you cannot find a reliable source, say so plainly.

News items: separate "What was reported" from "Possible effects" (your reasoning), link the original article, and say when you only have the headline.

Stay neutral on politics, give no personal financial advice, and say when you are unsure.`;

function cors(origin, env) {
  const allowed = (env.ALLOWED_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
  const ok = !allowed.length || allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin || '*' : allowed[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}
const json = (b, s, h) => new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json', ...h } });

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const h = cors(origin, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
    if (request.method !== 'POST') return json({ error: 'Use POST' }, 405, h);
    const allowed = (env.ALLOWED_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (allowed.length && !allowed.includes(origin)) return json({ error: 'Origin not allowed' }, 403, h);
    if (!env.GEMINI_API_KEY) return json({ error: 'Server not configured' }, 500, h);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400, h); }
    const msgs = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
      .slice(-MAX_MESSAGES);
    while (msgs.length && msgs[0].role !== 'user') msgs.shift();
    if (!msgs.length) return json({ error: 'No question' }, 400, h);

    const system = `${SYSTEM_PROMPT}

WHERE THE STUDENT OPENED ESYNC:
${JSON.stringify(body.context || {}).slice(0, 6000)}

WEBSITE DATASETS (official Brunei indicators on the ESC dashboard):
${JSON.stringify(body.datasets || []).slice(0, 20000)}`;

    const payload = {
      systemInstruction: { parts: [{ text: system }] },
      contents: msgs.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content.slice(0, MAX_CHARS) }] })),
      tools: [{ google_search: {} }],
      generationConfig: { maxOutputTokens: 1200, temperature: 0.4 },
    };

    try {
      const model = env.MODEL || 'gemini-flash-latest';
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
        body: JSON.stringify(payload),
      });
      if (res.status === 429) return json({ reply: 'ESynC has reached today’s free question limit. Please try again tomorrow.', sources: [] }, 200, h);
      if (!res.ok) { console.log('Gemini error', res.status, await res.text()); return json({ error: 'AI service error' }, 502, h); }
      const data = await res.json();
      const cand = data.candidates?.[0] || {};
      const reply = (cand.content?.parts || []).map((p) => p.text || '').join('').trim();
      const seen = new Set();
      const sources = [];
      for (const c of cand.groundingMetadata?.groundingChunks || []) {
        const url = c.web?.uri; const title = c.web?.title || url;
        if (url && !seen.has(title)) { seen.add(title); sources.push({ title, url }); }
      }
      return json({ reply: reply || 'Sorry, I could not find an answer. Please rephrase your question.', sources: sources.slice(0, 6) }, 200, h);
    } catch {
      return json({ error: 'AI service unreachable' }, 502, h);
    }
  },
};
