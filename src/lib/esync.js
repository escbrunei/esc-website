import { CONFIG } from '../config.js';
import { navigate } from './router.js';

const CTX_KEY = 'esync-context';
const listeners = new Set();
const openers = new Set();

// The floating popup registers here so ESynC opens in place.
export function onOpenRequest(fn) {
  openers.add(fn);
  return () => openers.delete(fn);
}

export function getContext() {
  try { return JSON.parse(sessionStorage.getItem(CTX_KEY)) || { origin: 'home' }; }
  catch { return { origin: 'home' }; }
}

function setContext(ctx) {
  try { sessionStorage.setItem(CTX_KEY, JSON.stringify(ctx)); } catch { /* storage unavailable */ }
  listeners.forEach((fn) => fn(ctx));
}

export function onContextChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Opens ESynC. Call this from a tap/click handler.
 * context = { origin: 'home'|'chart'|'simulator'|'news'|'lab', title, details: {...} }
 */
export function openESynC(context = { origin: 'home' }) {
  setContext({ ...context, openedAt: Date.now() });
  if (openers.size) openers.forEach((fn) => fn());
  else navigate('/esync');
}
