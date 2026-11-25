/**
 * ESynC backend — a Cloudflare Worker (free tier is enough).
 * Keeps the AI API key secret; the public website only knows this URL.
 *
 * Secrets / variables (set in Cloudflare, never in GitHub):
 *   ANTHROPIC_API_KEY  (secret)  your Anthropic API key
 *   ALLOWED_ORIGIN     (var)     e.g. https://yourname.github.io  (comma-separate several)
 *   MODEL              (var, optional) defaults to claude-sonnet-5-5
 */

const MAX_MESSAGES = 16;
const MAX_CHARS = 4000;

const SYSTEM_PROMPT = `You are ESynC, the economics assistant of the Economic Students' Chamber (ESC) (DPE) Brunei, a student-led non-profit in Bandar Seri Begawan.

How you help:
- Explain economics in plain, friendly language for university and school students. Define jargon when you use it.
- Help students interpret Brunei's economic data and guide them through calculations and exercises step by step. Let them try steps themselves when they are practising.
- Keep answers focused: usually 2-5 short paragraphs or a short list. Use B$ for Brunei dollars.

Brunei figures:
- For Brunei-specific figures, use ONLY the WEBSITE DATASETS provided below. Cite the source and the period, e.g. "(DEPS, 2024)".
- If a dataset's status is "sample", say clearly that the figures are sample placeholder data, not official statistics, every time you use them.
- If the requested figure is not in the datasets, say it is not available on the ESC website and suggest the official source (DEPS: https://deps.mofe.gov.bn, BDCB: https://www.bdcb.gov.bn). Never invent statistics.

News and releases:
- When the student asks about a news item or official release, link to the original source URL.
- Separate clearly "What was reported" (facts in the item) from "Possible effects" (your reasoning, which is uncertain).
- If you only have the headline (no summary), say so and keep your interpretation cautious.
- If the item is marked as a sample, say it is not real news.

Stay neutral on politics, avoid personal financial advice, and say when you are unsure.`;

function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
  const ok = allowed.length === 0 || allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin || '*' : allowed[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

const json = (body, status, headers) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ error: 'Use POST' }, 405, cors);

    const allowed = (env.ALLOWED_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (allowed.length && !allowed.includes(origin)) return json({ error: 'Origin not allowed' }, 403, cors);
    if (!env.ANTHROPIC_API_KEY) return json({ error: 'Server not configured' }, 500, cors);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400, cors); }

    const messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
      .slice(-MAX_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
    while (messages.length && messages[0].role !== 'user') messages.shift();
    if (!messages.length) return json({ error: 'No question' }, 400, cors);

    const context = JSON.stringify(body.context || {}).slice(0, 6000);
    const datasets = JSON.stringify(body.datasets || []).slice(0, 20000);
    const system = `${SYSTEM_PROMPT}

WHERE THE STUDENT OPENED ESYNC (context from the website):
${context}

WEBSITE DATASETS (Brunei indicators shown on the ESC dashboard):
${datasets}`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({ model: env.MODEL || 'claude-sonnet-5-5', max_tokens: 1000, system, messages }),
      });
      if (!res.ok) {
        console.log('AI error', res.status, await res.text());
        return json({ error: 'AI service error' }, 502, cors);
      }
      const data = await res.json();
      const reply = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n').trim();
      return json({ reply }, 200, cors);
    } catch (e) {
      return json({ error: 'AI service unreachable' }, 502, cors);
    }
  },
};
