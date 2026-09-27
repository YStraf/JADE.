// Mini-profil au survol de n'importe quel pseudo (.player[data-player]).
import { $, esc } from '../core/dom.js';
import { t, fmt } from '../core/i18n.js';
import { avatar, banner, titlePill, itemName } from './ui.js';
import { emblem } from './emblem.js';
import { getPlayer, playTime } from '../state/players.js';
import { DIV_LABEL, ITEM } from '../data/game.js';

export function playerLink(pseudo, { jade = false } = {}) { return '<a class="player' + (jade ? ' jade-name' : '') + '" href="#/joueur/' + encodeURIComponent(pseudo) + '" data-player="' + esc(pseudo) + '">' + esc(pseudo) + '</a>'; }
export function rankLabel(r) { return r ? t('rank.' + r.id) + (r.div ? ' ' + DIV_LABEL[r.div] : '') : t('rank.unranked'); }
export function titleOf(st) { if (!st) return ''; if (st.customTitle) return titlePill(st.customTitle, 'admin'); const id = 'title:' + st.title; return st.title && ITEM[id] ? titlePill(itemName(id), ITEM[id].rarity === 'base' ? 'tier' : ITEM[id].rarity) : ''; }
function card(p) {
  if (!p) return '<div style="padding:16px" class="muted">' + esc(t('player.unknown')) + '</div>';
  const priv = p.prefs && p.prefs.publicProfile === false && !p.self;
  const show = p.self || !p.prefs || p.prefs.showScores !== false;
  const r = p.rank;
  return banner(p.style, '', 64) + '<div class="hd">' + avatar(p, 52) + '<div class="who"><b>' + esc(p.pseudo) + '</b>' + titleOf(p.style) + '</div></div>' +
    (priv ? '<p class="muted" style="padding:12px 16px 14px;font-size:13.5px">' + esc(t('player.private')) + '</p>' :
      '<div class="rows">' +
      '<div><span>' + esc(t('rank.label')) + '</span><b style="display:flex;gap:6px;align-items:center">' + (r ? emblem(r.index, { size: 18 }) : '') + '<span style="color:' + (r ? r.c : 'var(--muted)') + '">' + esc(rankLabel(r)) + '</span></b></div>' +
      '<div><span>' + esc(t('xp.level')) + '</span><b>' + p.level.lvl + '</b></div>' +
      '<div><span>XP</span><b>' + fmt(p.xp) + '</b></div>' +
      (show ? '<div><span>' + esc(t('stats.sessions')) + '</span><b>' + fmt(p.sessions) + '</b></div>' + (p.streak != null ? '<div><span>' + esc(t('stats.streak')) + '</span><b>' + p.streak + ' ' + esc(t('unit.days')) + '</b></div>' : '') + '<div><span>' + esc(t('stats.timeOnJade')) + '</span><b>' + playTime(p.minutes || 0) + '</b></div>' : '') +
      '</div><div class="foot-mini"><div class="bar"><i style="width:' + p.level.pct + '%"></i></div>' +
      ((p.level.lvl >= 20) ? '<div style="margin-top:10px"><span class="tag jade">★ ' + esc(t('item.perk.regular')) + '</span></div>' : '') +
      (p.demo ? '<p class="inline-note" style="margin-top:8px">' + esc(t('player.demo')) + '</p>' : '') + '</div>');
}
export function bindMini() {
  const box = $('#miniProfile'); let hideT = 0, cur = null;
  const hide = () => { box.classList.remove('show'); cur = null; };
  document.addEventListener('pointerover', e => {
    if (e.pointerType === 'touch') return;
    const a = e.target.closest && e.target.closest('[data-player]'); if (!a) return;
    clearTimeout(hideT); if (cur === a) return; cur = a;
    box.innerHTML = card(getPlayer(a.dataset.player));
    box.classList.add('show');
    const rc = a.getBoundingClientRect();
    const top = Math.min(rc.bottom + 8, innerHeight - box.offsetHeight - 12), left = Math.min(rc.left, innerWidth - 312);
    box.style.top = Math.max(8, top) + 'px'; box.style.left = Math.max(8, left) + 'px';
  });
  document.addEventListener('pointerout', e => { if (e.target.closest && e.target.closest('[data-player]')) hideT = setTimeout(hide, 250); });
  box.addEventListener('pointerenter', () => clearTimeout(hideT));
  box.addEventListener('pointerleave', hide);
  addEventListener('hashchange', hide);
}
