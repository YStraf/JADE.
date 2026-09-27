// Bandeau cookies conforme CNIL : refuser aussi simple qu'accepter, choix redemandé au bout de 6 mois.
import { $, esc } from '../core/dom.js';
import { store } from '../core/store.js';
import { t } from '../core/i18n.js';
import { toast } from '../core/toast.js';
const VALID = 182 * 864e5;
export function consent() { const c = store.get('cookies', null); return c && Date.now() - c.date < VALID ? c : null; }
function save(analytics) { store.set('cookies', { essential: true, analytics, date: Date.now() }); $('#cookieBar').classList.remove('show'); }
export function renderCookieBar(force) {
  const bar = $('#cookieBar'); if (!bar) return; if (!force && consent()) return;
  bar.innerHTML = '<h3>' + esc(t('cookie.title')) + '</h3><p>' + esc(t('cookie.text')) + '</p>' +
    '<div class="prefs" id="ckPrefs">' +
    '<div class="row"><div class="lbl"><b>' + esc(t('cookie.essential')) + '</b><span>' + esc(t('cookie.essentialDesc')) + '</span></div><span class="badge ok">' + esc(t('cookie.always')) + '</span></div>' +
    '<div class="row"><div class="lbl"><b>' + esc(t('cookie.analytics')) + '</b><span>' + esc(t('cookie.analyticsDesc')) + '</span></div><button class="toggle" id="ckA" aria-pressed="false" aria-label="' + esc(t('cookie.analytics')) + '"></button></div>' +
    '<div class="row"><div class="lbl"><b>' + esc(t('cookie.ads')) + '</b><span>' + esc(t('cookie.adsDesc')) + '</span></div><span class="badge no">' + esc(t('cookie.off')) + '</span></div></div>' +
    '<div class="acts"><button class="btn" id="ckNo">' + esc(t('cookie.refuse')) + '</button><button class="btn" id="ckCustom">' + esc(t('cookie.custom')) + '</button><button class="btn primary" id="ckYes">' + esc(t('cookie.accept')) + '</button></div>' +
    '<p class="inline-note"><a href="#/legal/cookies">' + esc(t('cookie.more')) + '</a></p>';
  bar.classList.add('show');
  let an = false;
  $('#ckA').onclick = () => { an = !an; $('#ckA').setAttribute('aria-pressed', an); };
  $('#ckCustom').onclick = () => { const p = $('#ckPrefs'); if (p.classList.toggle('open')) $('#ckCustom').textContent = t('cookie.save'); else save(an); };
  $('#ckNo').onclick = () => { save(false); toast(t('cookie.refused')); };
  $('#ckYes').onclick = () => { save(true); toast(t('cookie.saved')); };
}
export function reopenCookies() { renderCookieBar(true); }
