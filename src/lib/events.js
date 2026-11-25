import data from '../data/events.json';
import { bruneiToday } from './time.js';

export function getEvents() {
  const today = bruneiToday();
  const all = (data.events || []).filter((e) => e && e.title && e.date);
  const upcoming = all.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = all.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}
