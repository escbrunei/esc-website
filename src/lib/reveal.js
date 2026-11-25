// Scroll reveal: sections and cards fade and slide up as they come into view.
const SELECTOR = [
  'main > section:not(.hero):not(.page-hero):not(.ihs-banner)',
  'main section .section-title',
  'main section .card',
  'main .mp',
  'main .pub-card',
  'main .chart-card',
  'main .mstore-head',
  'main .mstore-cta',
].join(',');

let io;
export function setupReveal() {
  if (typeof window === 'undefined') return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  io?.disconnect();
  io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('rv-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  const scan = () => {
    const els = document.querySelectorAll(SELECTOR);
    const byParent = new Map();
    els.forEach((el) => {
      if (el.classList.contains('rv')) return;
      // stagger siblings (cards in a grid) a little
      const p = el.parentElement; const n = byParent.get(p) || 0; byParent.set(p, n + 1);
      el.style.setProperty('--rv-delay', `${Math.min(n, 5) * 80}ms`);
      el.classList.add('rv');
      io.observe(el);
    });
  };
  scan();
  // pick up content that loads later (news, charts)
  const mo = new MutationObserver(() => scan());
  mo.observe(document.getElementById('main') || document.body, { childList: true, subtree: true });
  return () => { mo.disconnect(); io.disconnect(); };
}
