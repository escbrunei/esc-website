// Fetches news and official releases and writes public/data/news.json.
// Runs hourly in GitHub Actions (see .github/workflows/deploy.yml).
// Needs Node 20+. No extra packages.
//
// Rules:
// - Duplicate items (same link or same headline) are removed.
// - If a source fails, its items from the last successful run are kept.
// - If nothing has ever worked, the existing sample file is left in place.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'public/data/news.json');
const CONFIG_FILE = path.join(root, 'scripts/news-sources.json');
const UA = 'ESC-Brunei-NewsBot/1.0 (+https://www.instagram.com/escbrunei/)';

// ---------- helpers ----------
const decode = (s = '') =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&rsquo;|&lsquo;/g, "'").replace(/&rdquo;|&ldquo;/g, '"').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—');

const stripTags = (s = '') => decode(decode(s).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? m[1] : '';
};

const truncate = (s, n = 280) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s);

const normUrl = (u) => {
  try {
    const x = new URL(u);
    x.hash = '';
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'at_medium', 'at_campaign'].forEach((k) => x.searchParams.delete(k));
    return x.toString().replace(/\/$/, '');
  } catch { return u; }
};
const normTitle = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

async function get(url, headers = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: '*/*', ...headers }, signal: ctrl.signal, redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally { clearTimeout(timer); }
}

// ---------- parsers ----------
export function parseFeed(xml) {
  const items = [];
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  for (const b of blocks) {
    const title = stripTags(tag(b, 'title'));
    let link = stripTags(tag(b, 'link'));
    if (!link) {
      const m = b.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i) || b.match(/<link[^>]*href=["']([^"']+)["']/i);
      link = m ? decode(m[1]) : '';
    }
    if (!link) link = stripTags(tag(b, 'guid'));
    const date = stripTags(tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated') || tag(b, 'dc:date'));
    const summary = truncate(stripTags(tag(b, 'description') || tag(b, 'summary') || ''));
    const image = feedImage(b);
    if (title && /^https?:\/\//.test(link)) items.push({ title, url: link, publishedAt: date, summary, image });
  }
  return items;
}

// Finds a picture for a feed item: media:content / media:thumbnail / enclosure / first <img>.
function feedImage(b) {
  const pats = [
    /<media:content[^>]+url=["']([^"']+)["'][^>]*medium=["']image["']/i,
    /<media:content[^>]+medium=["']image["'][^>]*url=["']([^"']+)["']/i,
    /<media:thumbnail[^>]+url=["']([^"']+)["']/i,
    /<media:content[^>]+url=["']([^"']+\.(?:jpe?g|png|webp|gif)(?:\?[^"']*)?)["']/i,
    /<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image\//i,
    /<enclosure[^>]+type=["']image\/[^"']*["'][^>]*url=["']([^"']+)["']/i,
    /<image>\s*<url>([^<]+)<\/url>/i,
  ];
  for (const re of pats) { const m = b.match(re); if (m) return cleanImg(m[1]); }
  const html = decode(tag(b, 'content:encoded') || tag(b, 'description') || '');
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? cleanImg(m[1]) : '';
}
const cleanImg = (u) => { const v = decode(u).trim(); return /^https:\/\//.test(v) ? v : (/^http:\/\//.test(v) ? v.replace(/^http:/, 'https:') : ''); };

// Reads the og:image (preview picture) from an article page.
async function pageImage(url) {
  const html = await get(url, { Accept: 'text/html' });
  const head = html.slice(0, 200000);
  const m = head.match(/<meta[^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image)["'][^>]*content=["']([^"']+)["']/i)
    || head.match(/<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["'](?:og:image|twitter:image)["']/i);
  if (!m) return '';
  try { return cleanImg(new URL(decode(m[1]), url).toString()); } catch { return ''; }
}

const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
export function parseBDCB(html, base) {
  const items = [];
  const re = /<a[^>]+href=["']([^"']*publications\/details\?id=[a-z0-9]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const title = stripTags(m[2]);
    if (!title || title.length < 6) continue;
    const before = html.slice(Math.max(0, m.index - 1500), m.index);
    const dates = [...stripTags(before).matchAll(new RegExp(`(\\d{1,2})\\s+(${MONTHS})\\s+(\\d{4})`, 'g'))];
    const d = dates.length ? dates[dates.length - 1][0] : '';
    items.push({
      title,
      url: new URL(decode(m[1]), base).toString(),
      publishedAt: d ? `${d} 09:00 GMT+0800` : '',
      summary: '',
    });
  }
  return items;
}

async function fetchSource(src) {
  if (src.format === 'rss') return parseFeed(await get(src.url, { Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' }));
  if (src.format === 'bdcb') return parseBDCB(await get(src.url, { Accept: 'text/html' }), src.url);
  if (src.format === 'newsapi') {
    const key = process.env.NEWS_API_KEY;
    if (!key) throw new Error('NEWS_API_KEY secret not set');
    const json = JSON.parse(await get(src.url, { 'X-Api-Key': key }));
    return (json.articles || []).map((a) => ({
      title: a.title, url: a.url, publishedAt: a.publishedAt, summary: truncate(stripTags(a.description || '')), image: cleanImg(a.urlToImage || ''), publisher: a.source?.name,
    }));
  }
  throw new Error(`Unknown format "${src.format}"`);
}

// ---------- main ----------
export async function main() {
  const cfg = JSON.parse(await readFile(CONFIG_FILE, 'utf8'));
  let prev = { items: [], sources: [] };
  try { prev = JSON.parse(await readFile(OUT, 'utf8')); } catch { /* first run */ }
  const prevItems = prev.sample ? [] : prev.items || [];
  const prevSources = Object.fromEntries((prev.sources || []).map((s) => [s.id, s]));

  const now = new Date().toISOString();
  const minDate = Date.now() - (cfg.maxAgeDays || 45) * 864e5;
  const enabled = cfg.sources.filter((s) => s.enabled);
  const status = [];
  let all = [];

  for (const src of enabled) {
    try {
      const raw = await fetchSource(src);
      const items = raw
        .map((r) => {
          const t = new Date(r.publishedAt);
          return {
            id: '', region: src.region, kind: src.kind, title: r.title, publisher: r.publisher || src.publisher,
            url: r.url, publishedAt: isNaN(t) ? null : t.toISOString(), summary: r.summary || '', image: r.image || '', sourceId: src.id,
          };
        })
        .filter((i) => i.publishedAt && new Date(i.publishedAt).getTime() >= minDate);
      if (!items.length) throw new Error('No recent items found');
      all.push(...items);
      status.push({ id: src.id, name: src.name, ok: true, lastSuccess: now, count: items.length });
      console.log(`✓ ${src.id}: ${items.length} items`);
    } catch (e) {
      const kept = prevItems.filter((i) => i.sourceId === src.id);
      all.push(...kept);
      status.push({ id: src.id, name: src.name, ok: false, error: String(e.message || e), lastSuccess: prevSources[src.id]?.lastSuccess || null, keptFromLastSuccess: kept.length });
      console.warn(`✗ ${src.id}: ${e.message || e} (kept ${kept.length} previous items)`);
    }
  }

  // Remove duplicates by link and by headline, keeping the earliest-listed copy.
  const seenUrl = new Set();
  const seenTitle = new Set();
  all = all.filter((i) => {
    const u = normUrl(i.url);
    const t = normTitle(i.title);
    if (seenUrl.has(u) || seenTitle.has(t)) return false;
    seenUrl.add(u); seenTitle.add(t);
    return true;
  });

  all.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const perRegion = {};
  all = all.filter((i) => (perRegion[i.region] = (perRegion[i.region] || 0) + 1) <= (cfg.maxItemsPerRegion || 30));
  // Items with no feed picture: reuse a picture found on an earlier run, else read the article's preview image.
  const known = new Map(prevItems.filter((i) => i.image !== undefined).map((i) => [normUrl(i.url), i.image]));
  let lookups = 0;
  for (const i of all) {
    if (i.image) continue;
    const k = normUrl(i.url);
    if (known.has(k)) { i.image = known.get(k); continue; }
    if (lookups >= (cfg.maxImageLookupsPerRun || 30)) continue;
    lookups++;
    try { i.image = await pageImage(i.url); } catch { i.image = ''; }
  }
  console.log(`Looked up ${lookups} article preview images`);

  all.forEach((i, n) => { i.id = `${i.sourceId}-${Buffer.from(normUrl(i.url)).toString('base64url').slice(-16)}-${n}`; });

  const anySuccess = status.some((s) => s.ok);
  if (!all.length) {
    console.warn('No items from any source. Leaving the existing news.json unchanged.');
    return;
  }
  const out = {
    sample: false,
    generatedAt: now,
    lastSuccessfulRefresh: anySuccess ? now : prev.lastSuccessfulRefresh || null,
    sources: status,
    items: all,
  };
  await writeFile(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(`Wrote ${all.length} items to public/data/news.json`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((e) => { console.error(e); process.exit(0); /* never fail the deploy because of news */ });
}
