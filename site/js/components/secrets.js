// Épreuves secrètes : « Matière noire » (mémoire) et « Sakura » (duel de réflexes).
import { $, esc } from '../core/dom.js';
import { t } from '../core/i18n.js';
import { openModal } from '../core/modal.js';
import { SFX } from '../core/sfx.js';
import { me, updateProfile, profile } from '../state/account.js';
import { addItem } from '../state/economy.js';
import { awardXP } from '../state/progress.js';
import { itemPreview, itemName } from './ui.js';
import { openAuth } from './auth.js';
import { go } from '../core/router.js';

const SECRETS = ['darkmatter', 'sakura'];
function grant(k) {
  if (!me()) return false;
  const p = profile(); if ((p.secrets || []).includes(k)) return false;
  ['banner', 'frame', 'title'].forEach(ty => addItem(ty + ':' + k, 'secret'));
  updateProfile(pr => { pr.secrets = (pr.secrets || []).concat(k); pr.style.banner = k; pr.style.frame = k; if (!pr.style.title) pr.style.title = k; });
  awardXP('secret', k, t('item.title.' + k));
  return true;
}
function reward(body, k, close) {
  const fresh = grant(k);
  body.innerHTML = '<h3 class="center" style="font-size:24px">' + esc(t('item.title.' + k)) + '</h3><p class="muted center" style="margin-top:6px">' + esc(fresh ? t('secret.won') : (me() ? t('secret.already') : t('secret.won'))) + '</p>' +
    '<div class="item-grid" style="margin-top:18px">' + ['banner', 'frame', 'title'].map(ty => '<div class="item-card" style="cursor:default">' + itemPreview(ty + ':' + k) + '<b>' + esc(itemName(ty + ':' + k)) + '</b></div>').join('') + '</div>' +
    (me() ? '<div class="center" style="margin-top:20px"><button class="btn primary" data-apply>' + esc(t('secret.apply')) + '</button></div>'
      : '<p class="inline-note center">' + esc(t('secret.needAccount')) + '</p><div class="center" style="margin-top:12px"><button class="btn primary" data-signup>' + esc(t('auth.signup')) + '</button></div>');
  const a = body.querySelector('[data-apply]'); if (a) a.onclick = () => { close(); go('profil/showcase'); };
  const s = body.querySelector('[data-signup]'); if (s) s.onclick = () => { close(); openAuth('up'); };
  SFX.enter();
}
function memo(body, close) {
  const LEN = 6; let seq = [], step = 0, playing = false;
  body.innerHTML = '<p class="muted center">' + esc(t('secret.memo.rules')) + '</p><div class="egg-grid">' + Array.from({ length: 9 }, (_, i) => '<button type="button" data-cell="' + i + '" disabled aria-label="' + (i + 1) + '"></button>').join('') + '</div><p class="egg-state" id="eggState">' + esc(t('secret.ready')) + '</p><div class="center" style="margin-top:14px"><button class="btn primary" id="eggGo">' + esc(t('secret.start')) + '</button></div>';
  const cells = () => [...body.querySelectorAll('[data-cell]')], st = body.querySelector('#eggState');
  const show = () => { cells().forEach(c => c.disabled = true); playing = true; st.textContent = t('secret.memo.watch'); let i = 0; const s = () => { if (!body.isConnected) return; if (i >= seq.length) { st.textContent = t('secret.memo.you'); cells().forEach(c => c.disabled = false); playing = false; return; } const c = cells()[seq[i]]; c.classList.add('lit'); SFX.hover(); setTimeout(() => { c.classList.remove('lit'); i++; setTimeout(s, 180); }, 420); }; setTimeout(s, 450); };
  body.querySelector('#eggGo').onclick = e => { e.target.style.display = 'none'; seq = Array.from({ length: LEN }, () => Math.floor(Math.random() * 9)); step = 0; show(); };
  body.addEventListener('click', e => { const c = e.target.closest('[data-cell]'); if (!c || playing) return; const n = +c.dataset.cell;
    if (n === seq[step]) { c.classList.add('lit'); SFX.click(); setTimeout(() => c.classList.remove('lit'), 160); step++; st.textContent = step + ' / ' + LEN; if (step >= LEN) reward(body, 'darkmatter', close); }
    else { c.classList.add('bad'); setTimeout(() => c.classList.remove('bad'), 300); step = 0; st.textContent = t('secret.memo.fail'); setTimeout(show, 800); } });
}
function duel(body, close) {
  let round = 0, times = [], state = 'idle', shown = 0, to = 0;
  body.innerHTML = '<p class="muted center">' + esc(t('secret.duel.rules')) + '</p><div class="duel wait" id="duel" role="button" tabindex="0">待</div><div class="duel-rounds" id="dr"><span></span><span></span><span></span></div><p class="egg-hint" id="dm">' + esc(t('secret.duel.click')) + '</p>';
  const d = body.querySelector('#duel'), dm = body.querySelector('#dm');
  const paint = () => { body.querySelector('#dr').innerHTML = [0, 1, 2].map(i => '<span class="' + (i < round ? 'ok' : '') + '"></span>').join(''); };
  const arm = () => { state = 'armed'; d.className = 'duel wait'; d.textContent = '待'; dm.textContent = t('secret.duel.wait'); to = setTimeout(() => { if (state !== 'armed') return; state = 'go'; shown = performance.now(); d.className = 'duel go'; d.textContent = '斬'; }, 1200 + Math.random() * 2600); };
  const hit = () => {
    if (state === 'idle') return arm();
    if (state === 'armed') { clearTimeout(to); state = 'idle'; d.className = 'duel fail'; d.textContent = t('secret.duel.early'); dm.textContent = t('secret.duel.retry'); return; }
    if (state === 'go') { const ms = performance.now() - shown; times.push(ms); round++; paint(); SFX.click(); dm.textContent = Math.round(ms) + ' ms';
      if (round >= 3) { const avg = times.reduce((a, b) => a + b, 0) / 3; state = 'idle'; if (avg < 350) return reward(body, 'sakura', close); d.className = 'duel fail'; d.textContent = t('secret.duel.slow', { ms: Math.round(avg) }); round = 0; times = []; paint(); dm.textContent = t('secret.duel.retry'); }
      else { state = 'idle'; setTimeout(arm, 700); } }
  };
  d.addEventListener('pointerdown', hit); d.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); hit(); } });
}
export function openSecret(k) {
  if (document.querySelector('.egg-modal')) return;
  const { el, close } = openModal('<h2 class="center" style="padding:0">?</h2><div data-egg></div>', { width: '520px', cls: 'egg-modal', label: '?' });
  const body = el.querySelector('[data-egg]');
  (k === 'sakura' ? duel : memo)(body, close);
}
export function bindSecrets() {
  let n = 0, h = 0;
  document.addEventListener('click', e => { if (!e.target.closest('#logoDot')) return; e.preventDefault(); clearTimeout(h); n++; h = setTimeout(() => n = 0, 1400); if (n >= 5) { n = 0; openSecret('darkmatter'); } });
  const KO = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']; let k = 0, typed = '';
  addEventListener('keydown', e => {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName)) return;
    const key = (e.key || '').toLowerCase();
    if (key === KO[k]) { k++; if (k >= KO.length) { k = 0; openSecret('darkmatter'); } } else k = key === KO[0] ? 1 : 0;
    if (key.length === 1) { typed = (typed + key).slice(-6); if (typed === 'sakura') { typed = ''; openSecret('sakura'); } }
  });
}
export { SECRETS };
