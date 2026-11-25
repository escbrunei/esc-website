import { CONFIG } from '../config.js';

// Link props for every "Join ESC" button.
export const joinProps = CONFIG.JOIN_URL
  ? { href: CONFIG.JOIN_URL, target: '_blank', rel: 'noopener noreferrer' }
  : { href: '#/join' };
