// Vitrine de profil (utilisée par Mon profil et la page publique d'un joueur).
import { esc } from '../core/dom.js';
import { t, fmt } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { TESTS } from '../data/game.js';
import { skillOf } from '../data/routines.js';
import { avatar, banner } from './ui.js';
import { emblem } from './emblem.js';
import { rankLabel, titleOf } from './minicard.js';
import { playTime } from '../state/players.js';
import { runs, streakInfo, badges } from '../state/progress.js';
import { fmtVal } from '../pages/tests.js';
import { store } from '../core/store.js';

export const WIDGETS = ['records', 'scen', 'skills', 'streak', 'badges', 'rank', 'plan'];
function widget(id, p) {
  const self = p.self;
  if (id === 'records') return '<div class="wg"><h4>' + ic('target') + esc(t('wg.records')) + '</h4>' + Object.keys(TESTS).map(k => '<div class="li"><span class="muted">' + esc(t('test.' + k + '.name')) + '</span><b>' + fmtVal(k, (p.bests || {})[k]) + '</b></div>').join('') + '</div>';
  if (id === 'scen') { if (!self) return ''; const by = {}; runs().forEach(r => { by[r.scen] = Math.max(by[r.scen] || 0, r.score); }); const top = Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 5); return '<div class="wg"><h4>' + ic('chart') + esc(t('wg.scen')) + '</h4>' + (top.length ? top.map(x => '<div class="li"><span class="muted">' + esc(x[0]) + '</span><b>' + fmt(Math.round(x[1])) + '</b></div>').join('') : '<p class="muted small-note">' + esc(t('wg.noSessions')) + '</p>') + '</div>'; }
  if (id === 'skills') { if (!self) return ''; const g = {}; const rs = runs(); rs.forEach(r => { const k = skillOf(r.scen); g[k] = (g[k] || 0) + 1; }); return '<div class="wg"><h4>' + ic('layers') + esc(t('wg.skills')) + '</h4>' + (Object.keys(g).length ? Object.entries(g).map(x => '<div class="li"><span class="muted">' + esc(t('skill.' + x[0])) + '</span><b>' + Math.round(x[1] / rs.length * 100) + ' %</b></div>').join('') : '<p class="muted small-note">' + esc(t('wg.nothing')) + '</p>') + '</div>'; }
  if (id === 'streak') return '<div class="wg"><h4>' + ic('fire') + esc(t('wg.streak')) + '</h4><div class="li"><span class="muted">' + esc(t('stats.streak')) + '</span><b>' + (p.streak ?? 0) + ' ' + esc(t('unit.days')) + '</b></div><div class="li"><span class="muted">' + esc(t('stats.sessions')) + '</span><b>' + fmt(p.sessions || 0) + '</b></div><div class="li"><span class="muted">' + esc(t('stats.timeOnJade')) + '</span><b>' + playTime(p.minutes || 0) + '</b></div></div>';
  if (id === 'badges') { const got = (self ? badges() : []).filter(b => b.got); return '<div class="wg"><h4>' + ic('star') + esc(t('wg.badges')) + '</h4>' + (got.length ? '<div class="tags">' + got.map(b => '<span class="tag jade">' + esc(t('badge.' + b.id)) + '</span>').join('') + '</div>' : '<p class="muted small-note">' + esc(t('wg.noBadge')) + '</p>') + (p.level.lvl >= 20 ? '<div style="margin-top:8px"><span class="tag warn">★ ' + esc(t('item.perk.regular')) + '</span></div>' : '') + '</div>'; }
  if (id === 'rank') { const r = p.rank; return '<div class="wg"><h4>' + ic('rank') + esc(t('wg.rank')) + '</h4>' + (r ? '<div class="row-flex">' + emblem(r.index, { size: 44, div: r.div }) + '<div><b style="color:' + r.c + '">' + esc(rankLabel(r)) + '</b><div class="muted small-note">' + fmt(p.rankPoints) + ' ' + esc(t('ranks.points')) + '</div></div></div>' : '<p class="muted small-note">' + esc(t('ranks.needTests', { n: Object.keys(p.bests || {}).length })) + '</p>') + '</div>'; }
  if (id === 'plan') { if (!self) return ''; const pl = store.get('plan', null); return '<div class="wg"><h4>' + ic('routine') + esc(t('wg.plan')) + '</h4>' + (pl && pl.goal ? '<div class="li"><span class="muted">' + esc(t('wizard.goal')) + '</span><b>' + esc(t('goal.' + pl.goal)) + '</b></div><div class="li"><span class="muted">' + esc(t('wizard.game')) + '</span><b>' + esc(t('game.' + pl.game)) + '</b></div><div class="li"><span class="muted">' + esc(t('wizard.time')) + '</span><b>' + pl.time + ' min</b></div>' : '<p class="muted small-note">' + esc(t('wg.noPlan')) + '</p>') + '</div>'; }
  return '';
}
export function showcaseHTML(p) {
  const st = p.style || {}; const r = p.rank;
  const w = (p.widgets || ['records', 'streak', 'badges']).filter(x => WIDGETS.includes(x)).sort((a, b) => WIDGETS.indexOf(a) - WIDGETS.indexOf(b));
  const privScores = !p.self && p.prefs && p.prefs.showScores === false;
  return '<div class="showcase"' + (st.bg && st.bg !== 'none' ? ' data-bg="' + esc(st.bg) + '"' : '') + '>' + banner(st, '', 150) +
    '<div class="idt">' + avatar(p, 96, 'big') + '<div class="nmz"><b>' + esc(p.pseudo) + '</b><div class="row-flex" style="gap:8px;margin-top:4px">' + titleOf(st) + '<span class="muted small-note">' + esc(t('xp.level')) + ' ' + p.level.lvl + '</span>' + (r ? '<span class="row-flex" style="gap:5px">' + emblem(r.index, { size: 20 }) + '<b style="color:' + r.c + ';font-size:13.5px">' + esc(rankLabel(r)) + '</b></span>' : '') + (p.level.lvl >= 65 ? '<span class="tag">' + esc(t('item.perk.beta')) + '</span>' : '') + (p.role === 'admin' ? '<span class="tag danger">' + esc(t('role.admin')) + '</span>' : '') + '</div>' + (p.bio ? '<p class="muted bio">' + esc(p.bio) + '</p>' : '') + '</div></div>' +
    (privScores ? '<p class="muted" style="padding:0 24px 22px">' + esc(t('player.scoresHidden')) + '</p>' : '<div class="wgrid">' + w.map(id => widget(id, p)).join('') + '</div>') + '</div>';
}
