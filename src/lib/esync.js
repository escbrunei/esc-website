import { CONFIG } from '../config.js';
import { navigate } from './router.js';

const CTX_KEY = 'esync-context';
const GREETED_KEY = 'esync-greeted';
const listeners = new Set();

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

let audio = null;

// Plays the recorded greeting. Resolves true if it played, false otherwise.
// Never throws, so the chat keeps working when the file is missing.
export function playGreeting() {
  try {
    if (audio) { audio.pause(); }
    audio = new Audio(CONFIG.GREETING_AUDIO);
    const p = audio.play();
    return (p && p.then ? p : Promise.resolve()).then(() => true).catch(() => false);
  } catch {
    return Promise.resolve(false);
  }
}

function hasGreeted() {
  try { return sessionStorage.getItem(GREETED_KEY) === '1'; } catch { return window.__escGreeted === true; }
}
function markGreeted() {
  try { sessionStorage.setItem(GREETED_KEY, '1'); } catch { window.__escGreeted = true; }
}

/**
 * Opens ESynC. Call this from a tap/click handler.
 * context = { origin: 'home'|'chart'|'simulator'|'news'|'lab', title, details: {...} }
 * The first tap during a visit plays the recorded greeting.
 */
export function openESynC(context = { origin: 'home' }) {
  if (!hasGreeted()) {
    markGreeted();
    playGreeting();
  }
  setContext({ ...context, openedAt: Date.now() });
  navigate('/esync');
}
