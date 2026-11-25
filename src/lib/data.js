import { parseCSV } from './csv.js';

let cache = null;

// Loads every indicator's metadata and CSV rows from public/data/.
export function loadIndicators() {
  if (!cache) {
    cache = fetch('data/indicators.json', { cache: 'no-cache' })
      .then((r) => r.json())
      .then(async (meta) => {
        const list = await Promise.all(
          meta.indicators.map(async (ind) => {
            const text = await fetch(`data/${ind.file}`, { cache: 'no-cache' }).then((r) => r.text());
            const rows = parseCSV(text).filter((r) => typeof r.year === 'number');
            const years = rows.map((r) => r.year);
            return { ...ind, rows, minYear: Math.min(...years), maxYear: Math.max(...years), latestPeriod: ind.latestPeriod || String(Math.max(...years)) };
          })
        );
        return list;
      })
      .catch((e) => { cache = null; throw e; });
  }
  return cache;
}
