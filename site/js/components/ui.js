// Petits composants partagés (chaînes HTML).
import { esc } from '../core/dom.js';
import { t, fmt } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { ITEM } from '../data/game.js';

export function initials(n) { return (n || '?').trim().slice(0, 2).toUpperCase(); }
export function avatar(user, size = 36, extra = '') {
  const st = (user && user.style) || {};
  const bg = st.avatarImg ? 'background-image:url(' + st.avatarImg + ');background-size:' + (st.avatarZoom || 100) + '%;background-position:' + (st.avatarX ?? 50) + '% ' + (st.avatarY ?? 50) + '%;' : '';
  return '<span class="av' + (size < 34 ? ' sm' : '') + ' ' + extra + '" data-frame="' + esc(st.frame || 'none') + '" style="--s:' + size + 'px"><span class="av-in" style="' + bg + '">' + (st.avatarImg ? '' : esc(initials(user && user.pseudo))) + '</span></span>';
}
export function banner(st = {}, cls = '', h) {
  const img = st.bannerImg ? 'background:url(' + st.bannerImg + ');background-size:' + (st.bannerZoom || 100) + '%;background-position:' + (st.bannerX ?? 50) + '% ' + (st.bannerY ?? 50) + '%;background-repeat:no-repeat;' : '';
  return '<div class="banner ' + cls + '"' + (st.bannerImg ? '' : ' data-banner="' + esc(st.banner || 'aurora') + '"') + ' style="' + img + (h ? 'height:' + h + 'px;' : '') + '"><span class="sheen"></span></div>';
}
export function itemName(id) { return t('item.' + id.replace(':', '.')); }
export function rarityLabel(r) { return '<span class="rarity rar-' + r + '">' + esc(t('rarity.' + r)) + '</span>'; }
export function titlePill(txt, rarity = 'tier') { return txt ? '<span class="title-pill rar-' + rarity + '">' + esc(txt) + '</span>' : ''; }
// Aperçu visuel d'un objet cosmétique.
export function itemPreview(id, pseudo = 'JA') {
  const it = ITEM[id]; if (!it) return '';
  if (it.type === 'frame') return '<div class="item-prev">' + avatar({ pseudo, style: { frame: it.key } }, 44) + '</div>';
  if (it.type === 'banner') return '<div class="item-prev"><div class="banner" data-banner="' + it.key + '"></div></div>';
  if (it.type === 'title') return '<div class="item-prev">' + titlePill(itemName(id), it.rarity === 'base' ? 'tier' : it.rarity) + '</div>';
  if (it.type === 'bg') return '<div class="item-prev" data-bg="' + it.key + '"></div>';
  if (it.type === 'theme') return '<div class="item-prev theme-prev" data-prev-theme="' + it.key + '"><i></i><i></i><i></i></div>';
  const icn = { namecolor: 'brush', regular: 'star', emote: 'fire', beta: 'device' }[it.key] || 'sparkles';
  return '<div class="item-prev"><span style="width:34px;height:34px;color:var(--jade)">' + ic(icn) + '</span></div>';
}
export function itemCard(id, { pressed = false, locked = false, qty = 0, attr = '', sub = '' } = {}) {
  const it = ITEM[id];
  return '<button type="button" class="item-card" ' + attr + ' aria-pressed="' + pressed + '"' + (locked ? ' disabled' : '') + '>' +
    (locked ? '<span class="lock">' + ic('lock') + '</span>' : '') + (qty > 1 ? '<span class="qty">×' + qty + '</span>' : '') +
    itemPreview(id) + '<div><b>' + esc(itemName(id)) + '</b><small>' + (sub || rarityLabel(it.rarity)) + '</small></div></button>';
}
export function coinChip(n, extra = '') { return '<span class="chip ' + extra + '" style="cursor:default"><span class="coin"></span>' + fmt(n) + '</span>'; }
export function empty(msg, icon = 'info') { return '<div class="empty">' + ic(icon) + esc(msg) + '</div>'; }
export function pageHead(title, sub, right = '') { return '<div class="page-head"><div class="txt"><h2>' + title + '</h2>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + right + '</div>'; }
export function noteBox(html, icon = 'info', warn = false) { return '<div class="note-box' + (warn ? ' warn' : '') + '">' + ic(icon) + '<div>' + html + '</div></div>'; }
// Segments avec pastille glissante.
export function seg(el, items, cur, onPick) {
  if (!el) return;
  el.innerHTML = '<span class="pill"></span>' + items.map(it => '<button type="button" data-v="' + esc(it.id) + '" aria-pressed="' + (it.id === cur) + '">' + (it.color ? '<span class="swatch" style="--c:' + it.color + '"></span>' : '') + esc(it.label) + '</button>').join('');
  el.setAttribute('role', 'group');
  el.querySelectorAll('button').forEach(b => b.onclick = () => onPick(b.dataset.v));
  el.onkeydown = e => { if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return; const bs = [...el.querySelectorAll('button')]; const i = bs.indexOf(document.activeElement); if (i < 0) return; const j = (i + (e.key === 'ArrowRight' ? 1 : -1) + bs.length) % bs.length; bs[j].focus(); };
  requestAnimationFrame(() => movePill(el));
}
export function movePill(el) { const pill = el.querySelector('.pill'), on = el.querySelector('button[aria-pressed="true"]'); if (!pill) return; if (!on || !on.offsetWidth) { pill.style.width = '0'; return; } pill.style.left = on.offsetLeft + 'px'; pill.style.width = on.offsetWidth + 'px'; }
export function allPills() { document.querySelectorAll('.seg').forEach(movePill); }
addEventListener('resize', allPills);
export function countUp(el, to, suffix = '', dec = 0, reduced = false) {
  if (reduced) { el.textContent = fmt(to, dec) + suffix; return; }
  let s = null; const dur = 650;
  const step = ts => { if (!s) s = ts; const p = Math.min((ts - s) / dur, 1), v = to * (1 - Math.pow(1 - p, 3)); el.textContent = fmt(v, dec) + suffix; if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
