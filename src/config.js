// ESC site settings. The committee can edit these values on GitHub.
export const CONFIG = {
  ESC_EMAIL: 'info.escbrunei@gmail.com',
  INSTAGRAM_HANDLE: '@escbrunei',
  INSTAGRAM_URL: 'https://www.instagram.com/escbrunei/',
  // Merch: one link for all orders (Google Form, WhatsApp, etc.). A product's own orderUrl wins.
  MERCH_ORDER_URL: '',
  // Order forms for the merch page
  MERCH_APPAREL_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSfwXgJpqwG45blofMb0_lcicwaIxgUEgtOF70TemjJ4mrW5TA/viewform',
  MERCH_ACCESSORIES_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSfui_yz3jg4nLWop2PcYLIfxzu1IwhflNL1TmYxrESXzaHRew/viewform',

  // Live Instagram feeds (JSON feed URLs from behold.so, e.g. 'https://feeds.behold.so/AbC123').
  // Leave empty to show a simple Follow card instead.
  INSTAGRAM_FEED_URL: '',
  IHS_INSTAGRAM_FEED_URL: '',

  // The Invisible Handshake series Instagram
  IHS_INSTAGRAM_HANDLE: '@theihs.esc',
  IHS_INSTAGRAM_URL: 'https://www.instagram.com/theihs.esc/',

  LINKEDIN_NAME: 'Economic Students’ Chamber (DPE) Brunei',
  // Paste the official LinkedIn page URL here, e.g. 'https://www.linkedin.com/company/...'
  // Left empty, the site shows the page name without a link.
  LINKEDIN_URL: 'https://bn.linkedin.com/company/escbrunei',

  // ESynC AI backend URL (your deployed server/esync-worker.js), e.g.
  // 'https://esync.your-account.workers.dev'. Leave empty until it is set up.
  ESYNC_ENDPOINT: 'https://esync.info-escbrunei.workers.dev',

  // Membership registration link. Every "Join ESC" button opens this.
  // Leave empty to use the built-in form on the Join page instead.
  JOIN_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSdtmCNuFZ17RNhnbyEDyWUtd6DnvGy68laRsuifOLy_AQEd8g/viewform',

  // Membership form endpoint (Google Apps Script web app URL or Formspree URL).
  // Leave empty until it is set up; the form then shows the ESC email instead.
  REGISTRATION_ENDPOINT: '',
};
