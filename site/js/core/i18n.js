// Traductions : dictionnaire d'interface (i18n/<lang>.js) + contenu éditorial (content/<lang>.js).
// Le français est la langue source ; toute clé absente retombe sur le français.
import frUI from '../i18n/fr.js';
import frC from '../content/fr.js';
import { store } from './store.js';

export const LANGS = {
  fr: { flag: '🇫🇷', name: 'Français', locale: 'fr-FR' },
  en: { flag: '🇬🇧', name: 'English', locale: 'en-GB' },
  es: { flag: '🇪🇸', name: 'Español', locale: 'es-ES' },
  de: { flag: '🇩🇪', name: 'Deutsch', locale: 'de-DE' },
  it: { flag: '🇮🇹', name: 'Italiano', locale: 'it-IT' },
  pl: { flag: '🇵🇱', name: 'Polski', locale: 'pl-PL' },
};
let lang = 'fr', ui = frUI, content = frC;
export const missing = new Set();

function detect() {
  const saved = store.get('lang', null);
  if (saved && LANGS[saved]) return saved;
  const nav = (navigator.language || 'fr').slice(0, 2).toLowerCase();
  return LANGS[nav] ? nav : 'fr';
}
export async function initLang() { await setLang(detect()); }
export async function setLang(l) {
  if (!LANGS[l]) l = 'fr';
  if (l === 'fr') { ui = frUI; content = frC; }
  else {
    try {
      const [a, b] = await Promise.all([import(`../i18n/${l}.js`), import(`../content/${l}.js`)]);
      ui = a.default; content = b.default;
    } catch (e) { console.error(e); l = 'fr'; ui = frUI; content = frC; }
  }
  lang = l; store.set('lang', l);
  document.documentElement.lang = l;
}
export function getLang() { return lang; }
export function locale() { return LANGS[lang].locale; }
export function t(k, vars) {
  let s = ui[k];
  if (s == null) { s = frUI[k]; if (lang !== 'fr') missing.add(k); }
  if (s == null) { missing.add(k); return k; }
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, n) => (vars[n] ?? m));
  return s;
}
// Contenu : C('routines') renvoie l'objet traduit, repli sur le français.
export function C(k) { return content[k] ?? frC[k]; }
export function fmt(n, d = 0) { return Number(n || 0).toLocaleString(locale(), { maximumFractionDigits: d, minimumFractionDigits: d }); }
export function fmtDate(ts, opts) { return new Date(ts).toLocaleDateString(locale(), opts || { day: 'numeric', month: 'short', year: 'numeric' }); }
export function fmtDateTime(ts) { return new Date(ts).toLocaleString(locale(), { dateStyle: 'short', timeStyle: 'short' }); }
export function relTime(ts) {
  const rtf = new Intl.RelativeTimeFormat(locale(), { numeric: 'auto' });
  const s = Math.round((ts - Date.now()) / 1000), a = Math.abs(s);
  if (a < 60) return rtf.format(0, 'second');
  if (a < 3600) return rtf.format(Math.round(s / 60), 'minute');
  if (a < 86400) return rtf.format(Math.round(s / 3600), 'hour');
  if (a < 2592000) return rtf.format(Math.round(s / 86400), 'day');
  return fmtDate(ts);
}
