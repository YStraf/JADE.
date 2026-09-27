// Pass de progression : niveau, paliers et récompenses réelles, badges, historique d'XP.
import { esc } from '../core/dom.js';
import { t, fmt, fmtDate } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { TIERS, MAXLVL, xpForLevel, XP_RULES, COIN_RULES, ITEM } from '../data/game.js';
import { xpData, level, badges } from '../state/progress.js';
import { me } from '../state/account.js';
import { pageHead, itemPreview, itemName } from '../components/ui.js';

const BADGE_IC = { first: 'play', ten: 'layers', fifty: 'trophy', week: 'fire', month: 'calendar', tests: 'target', social: 'chat', linked: 'key', collector: 'crate', gold: 'rank', challenger: 'flag', secret: 'sparkles' };
export default {
  title: () => t('nav.pass'),
  render() {
    const L = level(), x = xpData();
    const head = '<div class="card pass-hero"><div class="lvl-big"><b>' + L.lvl + '</b><span>' + esc(t('xp.level')) + '</span></div><div style="flex:1;min-width:220px"><div class="row-flex" style="justify-content:space-between"><b class="xp-total">' + fmt(x.total) + ' XP</b><span class="muted small-note">' + (L.lvl >= MAXLVL ? esc(t('pass.max')) : esc(t('pass.toNext', { n: fmt(L.need - L.into), lvl: L.lvl + 1 }))) + '</span></div><div class="bar lg" style="margin:10px 0"><i style="width:' + L.pct + '%"></i></div><p class="muted small-note">' + esc(t('pass.note')) + '</p></div>' + (me() ? '' : '<button class="btn small primary" data-auth="up">' + esc(t('pass.saveProgress')) + '</button>') + '</div>';
    const tiers = '<div class="section"><div class="section-head"><h3>' + ic('ticket') + esc(t('pass.title')) + '</h3><span class="muted small-note">' + esc(t('pass.sub')) + '</span></div><div class="tiers">' + TIERS.map(tr => {
      const got = L.lvl >= tr.lvl; const need = xpForLevel(tr.lvl);
      return '<div class="tier-card' + (got ? ' got' : '') + '"><div class="tier-top"><span class="tier-lvl">' + esc(t('pass.level', { n: tr.lvl })) + '</span><span class="badge ' + (got ? 'ok' : '') + '">' + (got ? ic('check') + ' ' + esc(t('pass.unlockedLbl')) : fmt(need) + ' XP') + '</span></div>' +
        '<div class="tier-prev">' + tr.items.slice(0, 3).map(id => itemPreview(id, me() ? me().pseudo : 'JA')).join('') + '</div>' +
        '<b>' + esc(t('tier.' + tr.key + '.name')) + '</b><p class="muted small-note">' + esc(t('tier.' + tr.key + '.desc')) + '</p>' +
        (got && tr.items.some(id => ['frame', 'banner', 'title', 'bg', 'theme'].includes(ITEM[id].type)) ? '<a class="btn tiny" href="#/profil/' + (ITEM[tr.items[0]].type === 'theme' ? 'perso' : 'showcase') + '">' + esc(t('pass.equip')) + '</a>' : '') +
        (!got ? '<div class="bar"><i style="width:' + Math.min(100, Math.round(x.total / need * 100)) + '%"></i></div>' : '') + '</div>';
    }).join('') + '</div><p class="inline-note">' + esc(t('pass.max100', { n: fmt(xpForLevel(MAXLVL)) })) + '</p></div>';
    const bd = badges();
    const bgs = '<div class="section"><div class="section-head"><h3>' + esc(t('badges.title')) + '</h3><span class="muted small-note">' + esc(t('badges.count', { n: bd.filter(b => b.got).length, total: bd.length })) + '</span></div><div class="badge-grid">' + bd.map(b => '<div class="badge-it' + (b.got ? ' got' : '') + '"><span class="b-ic">' + ic(BADGE_IC[b.id]) + '</span><div><b>' + esc(t('badge.' + b.id)) + '</b><small>' + esc(t('badge.' + b.id + '.how')) + '</small></div></div>').join('') + '</div></div>';
    const earn = '<div class="section grid-2"><div class="card"><h3>' + esc(t('pass.earn')) + '</h3><div class="stack" style="--gap:0">' + Object.entries(XP_RULES).filter(([k, v]) => v > 0).map(([k, v]) => '<div class="row"><div class="lbl"><b>' + esc(t('xp.type.' + k)) + '</b><span>' + esc(t('xp.type.' + k + '.how')) + '</span></div><span class="tag jade">+' + v + ' XP</span></div>').join('') + '</div><p class="inline-note">' + esc(t('pass.coinsNote', { n: COIN_RULES.level_milestone })) + '</p></div>' +
      '<div class="card"><h3>' + esc(t('pass.history')) + '</h3>' + (x.events.length ? '<div class="xplog">' + x.events.slice(0, 40).map(e => '<div><span class="muted">' + fmtDate(e.t) + ' · ' + esc(t('xp.type.' + e.type)) + (e.l ? ' (' + esc(e.l) + ')' : '') + '</span><b>' + (e.xp >= 0 ? '+' : '') + e.xp + '</b></div>').join('') + '</div>' : '<p class="muted">' + esc(t('pass.empty')) + '</p>') + '</div></div>';
    return pageHead(esc(t('nav.pass')), esc(t('pass.pageSub'))) + head + tiers + bgs + earn;
  },
};
