// Panel d'administration (accès par empreinte SHA-256 tant qu'il n'y a pas de serveur).
import { $, esc, sha256, download, uidGen } from '../core/dom.js';
import { store, us, session, purgeAll } from '../core/store.js';
import { t, C, fmt, fmtDateTime } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { toast } from '../core/toast.js';
import { emit } from '../core/bus.js';
import { openModal, confirmModal } from '../core/modal.js';
import { ADMIN_HASH, ROLES, ITEMS, ITEM, CRATES, crateOdds, wheelEV, levelFromXP, xpForLevel } from '../data/game.js';
import { ROUTINES, minutesOf } from '../data/routines.js';
import { DEMO_PLAYERS } from '../data/demo.js';
import { accounts, me, profile, saveProfile, updateAccount, deleteAccount, isAdminSession } from '../state/account.js';
import { coins, addCoins, addItem, removeItem, inventory, settings, saveSettings } from '../state/economy.js';
import { adminGrantXP, setTotalXP, xpData } from '../state/progress.js';
import { posts, savePosts, reports, saveReports, challenge, saveChallenge } from '../state/community.js';
import { pageHead, avatar, itemPreview, itemName, rarityLabel } from '../components/ui.js';
import { isPlus, grantPlus, endPlus } from '../state/premium.js';

const TABS = [['dash', 'grid'], ['users', 'users'], ['economy', 'coin'], ['items', 'crate'], ['brand', 'brush'], ['forum', 'chat'], ['challenge', 'trophy'], ['content', 'megaphone'], ['tickets', 'headset'], ['logs', 'log'], ['settings', 'settings']];
let tab = 'dash', tries = 0, lockUntil = 0;
export function admLog(a) { const l = store.get('admlogs', []); l.unshift({ t: Date.now(), a, by: me() ? me().pseudo : 'admin' }); store.set('admlogs', l.slice(0, 500)); }
// Coins d'un autre compte local
function coinsOf(id) { return id === (me() && me().id) ? coins() : us.getFor(id, 'coins', 0); }
function grantCoins(id, n) {
  if (me() && id === me().id) return addCoins(n, n >= 0 ? 'admin' : 'adminRemove', null, '');
  const bal = us.getFor(id, 'coins', 0); const applied = n < 0 ? -Math.min(bal, -n) : n;
  us.setFor(id, 'coins', bal + applied); const log = us.getFor(id, 'coinlog', []); log.unshift({ t: Date.now(), n: applied, r: n >= 0 ? 'admin' : 'adminRemove', l: '' }); us.setFor(id, 'coinlog', log.slice(0, 200)); return applied;
}
function lockScreen() {
  return '<div class="card admin-lock"><span class="big-ic">' + ic('lock') + '</span><h3>' + esc(t('adm.lock')) + '</h3><p class="muted" style="margin:6px 0 18px">' + esc(t('adm.lockSub')) + '</p><form id="admForm"><div class="field"><label for="admUser">' + esc(t('adm.id')) + '</label><input type="text" id="admUser" autocomplete="username"></div><div class="field"><label for="admPass">' + esc(t('auth.password')) + '</label><input type="password" id="admPass" autocomplete="current-password"></div><p class="error" id="admErr"></p><button class="btn primary block" type="submit">' + esc(t('adm.unlock')) + '</button></form><p class="inline-note">' + esc(t('adm.lockNote')) + '</p></div>';
}
function kpi(label, val, icon) { return '<div class="stat"><span>' + ic(icon, 'kpi-ic') + esc(label) + '</span><b>' + val + '</b></div>'; }
function body() {
  const accs = accounts();
  if (tab === 'dash') {
    const totalCoins = accs.reduce((s, a) => s + coinsOf(a.id), 0); const opens = accs.reduce((s, a) => s + us.getFor(a.id, 'openings', []).length, 0);
    const logs = store.get('admlogs', []).slice(0, 8);
    return '<div class="stats">' + kpi(t('adm.k.accounts'), fmt(accs.length), 'users') + kpi(t('adm.k.posts'), fmt(posts().length), 'chat') + kpi(t('adm.k.reports'), fmt(reports().filter(r => r.status === 'open').length), 'flag') + kpi(t('adm.k.tickets'), fmt(store.get('tickets', []).filter(x => x.status === 'open').length), 'headset') + kpi(t('adm.k.coins'), fmt(totalCoins), 'coin') + kpi(t('adm.k.crates'), fmt(opens), 'crate') + '</div>' +
      '<div class="grid-2 section"><div class="card"><h3>' + esc(t('adm.quick')) + '</h3><div class="row-flex" style="margin-top:10px">' + (me() ? '<button class="btn small primary" data-selfcoins="1000"><span class="coin"></span>+1 000</button><button class="btn small" data-selfcoins="10000"><span class="coin"></span>+10 000</button>' : '') + '<button class="btn small" data-goto="users">' + ic('users') + esc(t('adm.tab.users')) + '</button><button class="btn small" data-goto="forum">' + ic('flag') + esc(t('adm.tab.forum')) + '</button><button class="btn small" data-goto="content">' + ic('megaphone') + esc(t('adm.announce')) + '</button></div>' + (me() ? '' : '<p class="inline-note">' + esc(t('adm.noAccount')) + '</p>') + '</div>' +
      '<div class="card"><h3>' + esc(t('adm.tab.logs')) + '</h3>' + (logs.length ? logs.map(l => '<div class="log"><span class="mono">' + fmtDateTime(l.t) + '</span> — <b>' + esc(l.a) + '</b></div>').join('') : '<p class="muted">' + esc(t('adm.noLogs')) + '</p>') + '</div></div>' +
      '<div class="note-box warn section">' + ic('warn') + '<div>' + esc(t('adm.localWarn')) + '</div></div>';
  }
  if (tab === 'users') {
    return '<div class="card"><h3>' + esc(t('adm.tab.users')) + '</h3><p class="desc">' + esc(t('adm.usersSub')) + '</p><input type="search" id="uSearch" class="compact" placeholder="' + esc(t('adm.searchUser')) + '" style="max-width:320px;margin-bottom:12px"><div class="table-wrap"><table class="adm-users"><thead><tr><th>' + esc(t('adm.player')) + '</th><th>' + esc(t('adm.role')) + '</th><th>' + esc(t('xp.level')) + '</th><th>Coins</th><th>' + esc(t('adm.actions')) + '</th></tr></thead><tbody id="uRows">' +
      accs.map(a => { const x = us.getFor(a.id, 'xp', { total: 0 }).total; const pr = profile(a.id); return '<tr data-row="' + esc(a.pseudo.toLowerCase() + ' ' + a.email) + '"><td><div class="row-flex" style="gap:10px;flex-wrap:nowrap">' + avatar({ pseudo: a.pseudo, style: pr.style }, 32) + '<div><b>' + esc(a.pseudo) + '</b>' + (me() && a.id === me().id ? ' <span class="tag jade">' + esc(t('common.you')) + '</span>' : '') + (a.banned ? ' <span class="tag danger">' + esc(t('adm.banned')) + '</span>' : '') + '<div class="muted small-note">' + esc(a.email) + '</div></div></div></td>' +
        '<td><select class="compact" data-role="' + a.id + '">' + ROLES.map(r => '<option value="' + r + '"' + ((a.role || 'member') === r ? ' selected' : '') + '>' + esc(t('role.' + r)) + '</option>').join('') + '</select></td>' +
        '<td><b>' + levelFromXP(x).lvl + '</b><div class="muted small-note">' + fmt(x) + ' XP</div></td><td><b>' + fmt(coinsOf(a.id)) + '</b></td>' +
        '<td><div class="row-flex" style="gap:6px"><button class="btn tiny' + (isPlus(a.id) ? ' primary' : '') + '" data-plus="' + a.id + '" title="' + esc(t(isPlus(a.id) ? 'adm.plusOff' : 'adm.plusOn')) + '">Jade+</button><button class="btn tiny" data-give="' + a.id + '">' + ic('plus') + 'XP / coins</button><button class="btn tiny ' + (a.banned ? 'primary' : 'danger') + '" data-ban="' + a.id + '">' + esc(a.banned ? t('adm.unban') : t('adm.ban')) + '</button>' + (me() && a.id === me().id ? '' : '<button class="btn tiny danger" data-deluser="' + a.id + '">' + ic('trash') + '</button>') + '</div></td></tr>'; }).join('') +
      DEMO_PLAYERS.map(d => '<tr data-row="' + esc(d.pseudo.toLowerCase()) + '" class="demo-row"><td><div class="row-flex" style="gap:10px;flex-wrap:nowrap">' + avatar(d, 32) + '<div><b>' + esc(d.pseudo) + '</b> <span class="tag outline">' + esc(t('common.demo')) + '</span></div></div></td><td>' + esc(t('role.member')) + '</td><td><b>' + levelFromXP(d.xp).lvl + '</b></td><td>—</td><td class="muted small-note">' + esc(t('adm.demoRow')) + '</td></tr>').join('') +
      '</tbody></table></div><p class="inline-note">' + esc(t('adm.rolesNote')) + '</p></div>';
  }
  if (tab === 'economy') {
    const s = settings();
    return '<div class="card"><h3>' + ic('coin') + esc(t('adm.eco.self')) + '</h3><p class="desc">' + esc(me() ? t('adm.eco.selfSub', { n: fmt(coins()) }) : t('adm.noAccount')) + '</p>' + (me() ? '<div class="row-flex">' + [100, 500, 1000, 5000, 10000].map(n => '<button class="btn small" data-selfcoins="' + n + '"><span class="coin"></span>+' + fmt(n) + '</button>').join('') + '</div><div class="row-flex" style="margin-top:14px"><input type="number" id="coinAmt" class="compact" value="2500" step="50" style="max-width:160px"><button class="btn small primary" id="coinGive">' + esc(t('adm.give')) + '</button><button class="btn small danger" id="coinTake">' + esc(t('adm.take')) + '</button><button class="btn small" id="coinSet">' + esc(t('adm.setBalance')) + '</button></div>' : '') + '</div>' +
      '<div class="card"><h3>' + esc(t('adm.eco.settings')) + '</h3>' +
      '<div class="row"><div class="lbl"><b>' + esc(t('adm.eco.arcade')) + '</b><span>' + esc(t('adm.eco.arcadeSub', { ev: fmt(wheelEV(), 3) })) + '</span></div><button class="toggle" data-arcade aria-pressed="' + (s.arcadeEnabled !== false) + '"></button></div>' +
      '<div class="row"><div class="lbl"><b>' + esc(t('adm.eco.crateMult')) + '</b><span>' + esc(t('adm.eco.crateMultSub')) + '</span></div><select class="compact" id="crateMult" style="width:auto">' + [.5, .75, 1, 1.5, 2].map(m => '<option value="' + m + '"' + ((s.crateMult || 1) === m ? ' selected' : '') + '>×' + String(m).replace('.', ',') + '</option>').join('') + '</select></div>' +
      '<div class="row"><div class="lbl"><b>' + esc(t('adm.eco.resetLimits')) + '</b><span>' + esc(t('adm.eco.resetLimitsSub')) + '</span></div><button class="btn small" id="resetDaily">' + esc(t('common.reset')) + '</button></div></div>' +
      '<div class="card"><h3>' + esc(t('adm.eco.odds')) + '</h3><div class="grid" style="--min:200px;margin-top:10px">' + Object.keys(CRATES).map(k => { const o = crateOdds(k).byRarity; return '<div class="stat"><span>' + esc(t('crate.' + k)) + '</span>' + Object.entries(o).map(([r, v]) => '<div class="li" style="display:flex;justify-content:space-between;font-size:13px">' + rarityLabel(r) + '<b>' + fmt(v, 1) + ' %</b></div>').join('') + '</div>'; }).join('') + '</div></div>';
  }
  if (tab === 'items') {
    if (!me()) return '<div class="card"><p class="muted">' + esc(t('adm.noAccount')) + '</p></div>';
    const inv = inventory();
    return '<div class="card"><h3>' + esc(t('adm.items')) + '</h3><p class="desc">' + esc(t('adm.itemsSub')) + '</p><div class="row-flex" style="margin-bottom:14px"><button class="btn small primary" id="giveAll">' + esc(t('adm.giveAll')) + '</button><button class="btn small danger" id="clearInv">' + esc(t('adm.clearInv')) + '</button></div><div class="item-grid">' +
      ITEMS.filter(i => ['crate', 'secret'].includes(i.source)).map(i => '<div class="item-card" style="cursor:default">' + (inv[i.id] ? '<span class="qty">×' + inv[i.id].q + '</span>' : '') + itemPreview(i.id) + '<div><b>' + esc(itemName(i.id)) + '</b><small>' + rarityLabel(i.rarity) + '</small></div><div class="row-flex" style="gap:4px"><button class="btn tiny" data-giveitem="' + i.id + '">' + ic('plus') + '</button>' + (inv[i.id] ? '<button class="btn tiny danger" data-rmitem="' + i.id + '">' + ic('minus') + '</button>' : '') + '</div></div>').join('') + '</div></div>';
  }
  if (tab === 'brand') {
    if (!me()) return '<div class="card"><p class="muted">' + esc(t('adm.noAccount')) + '</p></div>';
    const st = profile().style; const L = levelFromXP(xpData().total);
    return '<div class="card"><h3>' + esc(t('adm.brand')) + '</h3><p class="desc">' + esc(t('adm.brandSub')) + '</p>' +
      '<div class="field"><span class="label">' + esc(t('profile.avatar')) + '</span><div class="upl">' + avatar({ pseudo: me().pseudo, style: st }, 72) + '<button class="btn small" id="bAv">' + ic('upload') + esc(t('profile.upload')) + '</button>' + (st.avatarImg ? '<button class="btn small danger" id="bAvRm">' + esc(t('common.remove')) + '</button>' : '') + '</div>' + (st.avatarImg ? '<div class="crop">' + [['avatarZoom', 100, 320], ['avatarX', 0, 100], ['avatarY', 0, 100]].map(([k, a, b]) => '<label>' + esc(t('crop.' + (k.endsWith('Zoom') ? 'zoom' : k.endsWith('X') ? 'x' : 'y'))) + '<input type="range" data-bcrop="' + k + '" min="' + a + '" max="' + b + '" value="' + st[k] + '"></label>').join('') + '</div>' : '') + '</div>' +
      '<div class="field"><span class="label">' + esc(t('look.banner')) + '</span><div class="upl"><div class="banner" style="width:220px;height:80px;border-radius:12px;' + (st.bannerImg ? 'background:url(' + st.bannerImg + ');background-size:' + st.bannerZoom + '%;background-position:' + st.bannerX + '% ' + st.bannerY + '%' : '') + '"' + (st.bannerImg ? '' : ' data-banner="' + esc(st.banner) + '"') + '></div><button class="btn small" id="bBn">' + ic('upload') + esc(t('profile.upload')) + '</button>' + (st.bannerImg ? '<button class="btn small danger" id="bBnRm">' + esc(t('common.remove')) + '</button>' : '') + '</div>' + (st.bannerImg ? '<div class="crop">' + [['bannerZoom', 100, 300], ['bannerX', 0, 100], ['bannerY', 0, 100]].map(([k, a, b]) => '<label>' + esc(t('crop.' + (k.endsWith('Zoom') ? 'zoom' : k.endsWith('X') ? 'x' : 'y'))) + '<input type="range" data-bcrop="' + k + '" min="' + a + '" max="' + b + '" value="' + st[k] + '"></label>').join('') + '</div>' : '') + '</div>' +
      '<div class="field" style="max-width:380px"><label for="bTitle">' + esc(t('look.customTitle')) + '</label><input type="text" id="bTitle" maxlength="40" value="' + esc(st.customTitle || '') + '"></div>' +
      '<div class="field" style="max-width:220px"><label for="bLvl">' + esc(t('adm.forceLevel')) + '</label><input type="number" id="bLvl" min="1" max="100" value="' + L.lvl + '"></div>' +
      '<button class="btn primary" id="bSave">' + esc(t('adm.apply')) + '</button><input type="file" id="bFileAv" accept="image/*" hidden><input type="file" id="bFileBn" accept="image/*" hidden></div>';
  }
  if (tab === 'forum') {
    const rs = reports(); const ps = posts(); const P = C('posts');
    const hiddenSeeds = settings().hiddenSeeds || [];
    return '<div class="card"><h3>' + esc(t('adm.reports')) + ' <span class="tag">' + rs.filter(r => r.status === 'open').length + '</span></h3>' + (rs.length ? '<div class="table-wrap"><table><thead><tr><th>' + esc(t('adm.post')) + '</th><th>' + esc(t('adm.reason')) + '</th><th>' + esc(t('adm.by')) + '</th><th></th></tr></thead><tbody>' + rs.map(r => { const p = ps.find(x => x.id === r.post); const title = p ? p.title : (P[r.post] ? P[r.post].title : r.post); return '<tr><td><b>' + esc(title) + '</b><div class="muted small-note">' + esc(r.details || '') + '</div></td><td>' + esc(t('report.' + r.reason)) + '</td><td>' + esc(r.by) + '<div class="muted small-note">' + fmtDateTime(r.t) + '</div></td><td>' + (r.status === 'open' ? '<div class="row-flex" style="gap:6px"><button class="btn tiny danger" data-accept="' + r.id + '">' + esc(t('adm.hidePost')) + '</button><button class="btn tiny" data-reject="' + r.id + '">' + esc(t('adm.reject')) + '</button></div>' : '<span class="badge">' + esc(t('adm.st.' + r.status)) + '</span>') + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="muted">' + esc(t('adm.noReports')) + '</p>') + '</div>' +
      '<div class="card"><h3>' + esc(t('adm.posts')) + '</h3><div class="table-wrap"><table><thead><tr><th>' + esc(t('adm.author')) + '</th><th>' + esc(t('adm.title')) + '</th><th>' + esc(t('adm.status')) + '</th><th></th></tr></thead><tbody>' +
      ps.map(p => '<tr><td>' + esc(p.author) + '</td><td>' + esc(p.title) + '</td><td>' + (p.hidden ? '<span class="tag danger">' + esc(t('forum.hidden')) + '</span>' : '<span class="tag jade">' + esc(t('adm.visible')) + '</span>') + '</td><td><div class="row-flex" style="gap:6px"><button class="btn tiny" data-togglepost="' + p.id + '">' + esc(p.hidden ? t('adm.show') : t('adm.hide')) + '</button><button class="btn tiny danger" data-delpost="' + p.id + '">' + ic('trash') + '</button></div></td></tr>').join('') +
      Object.keys(P).map(id => '<tr><td>' + esc(t('common.demo')) + '</td><td>' + esc(P[id].title) + '</td><td>' + (hiddenSeeds.includes(id) ? '<span class="tag danger">' + esc(t('forum.hidden')) + '</span>' : '<span class="tag jade">' + esc(t('adm.visible')) + '</span>') + '</td><td><button class="btn tiny" data-toggleseed="' + id + '">' + esc(hiddenSeeds.includes(id) ? t('adm.show') : t('adm.hide')) + '</button></td></tr>').join('') +
      '</tbody></table></div></div><div class="card"><h3>' + esc(t('adm.modRules')) + '</h3><ul class="rules">' + [1, 2, 3, 4].map(i => '<li>' + esc(t('adm.modRule' + i)) + '</li>').join('') + '</ul></div>';
  }
  if (tab === 'challenge') {
    const c = { ...C('challenge'), ...challenge() };
    return '<div class="card"><h3>' + esc(t('adm.challenge')) + '</h3><p class="desc">' + esc(t('adm.challengeSub')) + '</p>' + [['chTitle', 'title', 'adm.ch.title'], ['chScen', 'scen', 'adm.ch.scen'], ['chScenAim', 'scenAim', 'adm.ch.scenAim'], ['chPrize', 'prize', 'adm.ch.prize']].map(([id, k, l]) => '<div class="field"><label for="' + id + '">' + esc(t(l)) + '</label><input type="text" id="' + id + '" value="' + esc(c[k] || '') + '"></div>').join('') + '<div class="field"><label for="chDesc">' + esc(t('adm.ch.desc')) + '</label><textarea id="chDesc">' + esc(c.desc || '') + '</textarea></div><div class="row-flex"><button class="btn primary" id="chSave">' + esc(t('adm.ch.publish')) + '</button><button class="btn" id="chReset">' + esc(t('common.reset')) + '</button></div><p class="inline-note">' + esc(t('adm.ch.legal')) + '</p></div>';
  }
  if (tab === 'content') {
    const s = settings();
    return '<div class="card"><h3>' + ic('megaphone') + esc(t('adm.announce')) + '</h3><p class="desc">' + esc(t('adm.announceSub')) + '</p><div class="field"><input type="text" id="annTxt" maxlength="180" value="' + esc(s.announce || '') + '" placeholder="' + esc(t('adm.announcePh')) + '"></div><div class="row-flex"><button class="btn primary" id="annSave">' + esc(t('common.save')) + '</button><button class="btn" id="annClear">' + esc(t('common.remove')) + '</button></div></div>' +
      '<div class="card"><h3>' + esc(t('adm.routines')) + '</h3><p class="desc">' + esc(t('adm.routinesSub', { n: ROUTINES.length })) + '</p><div class="table-wrap"><table><thead><tr><th>' + esc(t('routine.soft')) + '</th><th>' + esc(t('adm.title')) + '</th><th>' + esc(t('routine.level')) + '</th><th>' + esc(t('routine.game')) + '</th><th>min</th></tr></thead><tbody>' + ROUTINES.map(r => '<tr><td>' + (r.soft === 'kovaaks' ? "Kovaak's" : 'Aim Lab') + '</td><td><a href="#/routines/' + r.id + '">' + esc(C('routines')[r.id].title) + '</a></td><td>' + esc(t('level.' + r.lvl)) + '</td><td>' + esc(t('game.' + r.game)) + '</td><td>' + minutesOf(r) + '</td></tr>').join('') + '</tbody></table></div><p class="inline-note">' + esc(t('adm.routinesNote')) + '</p></div>';
  }
  if (tab === 'tickets') {
    const l = store.get('tickets', []);
    return '<div class="card"><h3>' + esc(t('adm.tab.tickets')) + '</h3>' + (l.length ? [...l].sort((a, b) => (b.plus && b.status === 'open') - (a.plus && a.status === 'open')).map(x => '<div class="ticket"><div class="row-flex" style="justify-content:space-between"><b>' + esc(t('support.s.' + x.subject)) + ' · ' + esc(x.by) + '</b>' + (x.plus ? ' <span class="tag plus-tag">' + esc(t('support.priority')) + '</span>' : '') + '<span class="muted small-note">' + fmtDateTime(x.t) + '</span></div><p class="muted" style="margin:6px 0 10px">' + esc(x.msg) + '</p><div class="row-flex"><span class="badge ' + (x.status === 'open' ? '' : 'ok') + '">' + esc(t('adm.st.' + x.status)) + '</span>' + (x.status === 'open' ? '<button class="btn tiny" data-closeticket="' + x.id + '">' + esc(t('adm.closeTicket')) + '</button>' : '') + '</div></div>').join('') : '<p class="muted">' + esc(t('adm.noTickets')) + '</p>') + '</div>';
  }
  if (tab === 'logs') {
    const l = store.get('admlogs', []);
    return '<div class="card"><div class="row-flex" style="justify-content:space-between"><h3>' + esc(t('adm.tab.logs')) + '</h3><button class="btn small" id="logCsv">' + ic('download') + ' CSV</button></div><input type="search" id="logQ" class="compact" placeholder="' + esc(t('adm.filterLogs')) + '" style="max-width:320px;margin:12px 0"><div id="logList">' + (l.length ? l.map(x => '<div class="log" data-log="' + esc(x.a.toLowerCase()) + '"><span class="mono">' + fmtDateTime(x.t) + '</span> — <b>' + esc(x.a) + '</b> <span class="muted">(' + esc(x.by || '') + ')</span></div>').join('') : '<p class="muted">' + esc(t('adm.noLogs')) + '</p>') + '</div><p class="inline-note">' + esc(t('adm.logsNote')) + '</p></div>';
  }
  if (tab === 'settings') {
    return '<div class="card"><h3>' + esc(t('adm.session')) + '</h3><div class="row"><div class="lbl"><b>' + esc(t('adm.sessionLbl')) + '</b><span>' + esc(t('adm.sessionSub')) + '</span></div><button class="btn small" id="admOut">' + ic('lock') + esc(t('adm.lockBtn')) + '</button></div></div>' +
      '<div class="card"><h3>' + esc(t('adm.hash')) + '</h3><p class="desc">' + esc(t('adm.hashSub')) + '</p><div class="field"><input type="text" id="genPass" placeholder="identifiant:motdepasse" autocomplete="off"></div><button class="btn" id="genGo">' + esc(t('adm.hashBtn')) + '</button><p class="inline-note mono" id="genOut" style="word-break:break-all"></p></div>' +
      '<div class="card danger-zone"><h3>' + esc(t('adm.purge')) + '</h3><p class="desc">' + esc(t('adm.purgeSub')) + '</p><button class="btn danger" id="purge">' + esc(t('adm.purgeBtn')) + '</button></div>';
  }
  return '';
}
function giveDialog(root, id) {
  const a = accounts().find(x => x.id === id); if (!a) return;
  const { el, close } = openModal('<h2>' + esc(a.pseudo) + '</h2><p class="lead">' + esc(t('adm.giveSub')) + '</p><div class="grid" style="--min:180px"><div class="field"><label for="gXp">XP</label><input type="number" id="gXp" value="0" step="50"></div><div class="field"><label for="gCoins">Jade Coins</label><input type="number" id="gCoins" value="0" step="50"></div></div><p class="inline-note">' + esc(t('adm.giveNote')) + '</p><div class="row-flex" style="justify-content:flex-end;margin-top:12px"><button class="btn" data-close>' + esc(t('common.cancel')) + '</button><button class="btn primary" id="gGo">' + esc(t('adm.apply')) + '</button></div>', { width: '460px' });
  el.querySelector('#gGo').onclick = () => {
    const x = Math.max(-100000, Math.min(100000, parseInt(el.querySelector('#gXp').value || 0, 10))), c = Math.max(-100000, Math.min(100000, parseInt(el.querySelector('#gCoins').value || 0, 10)));
    if (x) { adminGrantXP(x, me() && me().id === id ? null : id); admLog(t('adm.log.xp', { n: x, p: a.pseudo })); }
    if (c) { grantCoins(id, c); admLog(t('adm.log.coins', { n: c, p: a.pseudo })); }
    close(); toast(t('adm.applied')); paint(root);
  };
}
function readImage(file, max, cb) { if (!file || !/^image\//.test(file.type)) return toast(t('img.notImage')); if (file.size > 6 * 1024 * 1024) return toast(t('img.tooBig')); const fr = new FileReader(); fr.onload = () => { const img = new Image(); img.onload = () => { const sc = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); cb(c.toDataURL('image/jpeg', .84)); }; img.src = fr.result; }; fr.readAsDataURL(file); }
function paint(root) {
  if (!isAdminSession()) { root.querySelector('#admRoot').innerHTML = lockScreen(); bindLock(root); return; }
  root.querySelector('#admRoot').innerHTML = '<div class="tabs-layout"><nav class="vnav" aria-label="Admin"><div class="vhead"><b>' + ic('key') + ' ' + esc(t('adm.title')) + '</b><div class="muted small-note">' + esc(me() ? me().pseudo : t('adm.noAccountShort')) + '</div></div>' + TABS.map(([id, i]) => '<button type="button" data-atab="' + id + '" aria-current="' + (id === tab) + '">' + ic(i) + esc(t('adm.tab.' + id)) + '</button>').join('') + '</nav><div class="reveal" id="admBody">' + body() + '</div></div>';
}
function bindLock(root) {
  const f = root.querySelector('#admForm'); if (!f) return;
  f.onsubmit = async e => {
    e.preventDefault(); const err = root.querySelector('#admErr');
    if (Date.now() < lockUntil) { err.textContent = t('adm.wait', { s: Math.ceil((lockUntil - Date.now()) / 1000) }); err.classList.add('show'); return; }
    const h = await sha256(root.querySelector('#admUser').value.trim() + ':' + root.querySelector('#admPass').value);
    if (h && h === ADMIN_HASH) { session.set('adm', true); tries = 0; admLog(t('adm.log.login')); toast(t('adm.opened')); emit('user'); paint(root); }
    else { tries++; if (tries >= 5) { lockUntil = Date.now() + 30000; tries = 0; } err.textContent = t('adm.bad'); err.classList.add('show'); admLog(t('adm.log.fail')); }
  };
}
export default {
  title: () => t('nav.admin'),
  render: () => pageHead(esc(t('nav.admin')), esc(t('adm.sub'))) + '<div id="admRoot"></div>',
  mount(root, sub) {
    if (TABS.some(x => x[0] === sub[0])) tab = sub[0];
    paint(root);
    root.addEventListener('click', async e => {
      const at = e.target.closest('[data-atab],[data-goto]'); if (at) { tab = at.dataset.atab || at.dataset.goto; history.replaceState(null, '', '#/admin/' + tab); paint(root); return; }
      if (!isAdminSession()) return;
      const sc = e.target.closest('[data-selfcoins]'); if (sc) { const n = +sc.dataset.selfcoins; addCoins(n, 'admin'); admLog(t('adm.log.coins', { n, p: me().pseudo })); toast(t('adm.coinsGiven', { n: fmt(n) })); paint(root); return; }
      const amt = () => Math.max(0, Math.min(1000000, parseInt(($('#coinAmt', root) || {}).value || 0, 10)));
      if (e.target.closest('#coinGive')) { const n = amt(); addCoins(n, 'admin'); admLog(t('adm.log.coins', { n, p: me().pseudo })); paint(root); toast(t('adm.coinsGiven', { n: fmt(n) })); return; }
      if (e.target.closest('#coinTake')) { const n = amt(); addCoins(-n, 'adminRemove'); admLog(t('adm.log.coins', { n: -n, p: me().pseudo })); paint(root); return; }
      if (e.target.closest('#coinSet')) { const n = amt(); addCoins(n - coins(), n >= coins() ? 'admin' : 'adminRemove'); admLog(t('adm.log.setCoins', { n })); paint(root); return; }
      if (e.target.closest('[data-arcade]')) { const s = settings(); s.arcadeEnabled = s.arcadeEnabled === false; saveSettings(s); admLog(t('adm.log.arcade', { v: s.arcadeEnabled ? 'ON' : 'OFF' })); paint(root); return; }
      if (e.target.closest('#resetDaily')) { us.set('daily', {}); admLog(t('adm.log.resetDaily')); toast(t('adm.applied')); return; }
      const gi = e.target.closest('[data-giveitem]'); if (gi) { addItem(gi.dataset.giveitem, 'admin'); admLog(t('adm.log.item', { i: itemName(gi.dataset.giveitem) })); paint(root); return; }
      const ri = e.target.closest('[data-rmitem]'); if (ri) { removeItem(ri.dataset.rmitem); paint(root); return; }
      if (e.target.closest('#giveAll')) { ITEMS.filter(i => ['crate', 'secret'].includes(i.source)).forEach(i => { if (!inventory()[i.id]) addItem(i.id, 'admin'); }); admLog(t('adm.log.allItems')); paint(root); return; }
      if (e.target.closest('#clearInv')) { if (await confirmModal(t('adm.clearInvConfirm'))) { us.set('inv', {}); emit('inventory'); paint(root); } return; }
      const gv = e.target.closest('[data-give]'); if (gv) { giveDialog(root, gv.dataset.give); return; }
      const bn = e.target.closest('[data-ban]'); if (bn) { const a = accounts().find(x => x.id === bn.dataset.ban); if (me() && a.id === me().id) return toast(t('adm.selfBan')); if (!a.banned && !(await confirmModal(t('adm.banConfirm', { p: a.pseudo })))) return; updateAccount({ banned: !a.banned }, a.id); admLog(t(a.banned ? 'adm.log.unban' : 'adm.log.ban', { p: a.pseudo })); paint(root); return; }
      const du = e.target.closest('[data-deluser]'); if (du) { const a = accounts().find(x => x.id === du.dataset.deluser); if (await confirmModal(t('adm.delConfirm', { p: a.pseudo }))) { deleteAccount(a.id); admLog(t('adm.log.delete', { p: a.pseudo })); paint(root); } return; }
      const ac = e.target.closest('[data-accept],[data-reject]'); if (ac) { const l = reports(); const r = l.find(x => x.id === (ac.dataset.accept || ac.dataset.reject)); r.status = ac.dataset.accept ? 'accepted' : 'rejected'; if (ac.dataset.accept) { const ps = posts(); const p = ps.find(x => x.id === r.post); if (p) { p.hidden = true; savePosts(ps); } else { const s = settings(); s.hiddenSeeds = [...new Set([...(s.hiddenSeeds || []), r.post])]; saveSettings(s); } } saveReports(l); admLog(t('adm.log.report', { s: t('adm.st.' + r.status) })); paint(root); return; }
      const tp = e.target.closest('[data-togglepost]'); if (tp) { const ps = posts(); const p = ps.find(x => x.id === tp.dataset.togglepost); p.hidden = !p.hidden; savePosts(ps); admLog(t(p.hidden ? 'adm.log.hide' : 'adm.log.show', { p: p.title })); paint(root); return; }
      const ts = e.target.closest('[data-toggleseed]'); if (ts) { const s = settings(); const h = new Set(s.hiddenSeeds || []); h.has(ts.dataset.toggleseed) ? h.delete(ts.dataset.toggleseed) : h.add(ts.dataset.toggleseed); s.hiddenSeeds = [...h]; saveSettings(s); paint(root); return; }
      const dp = e.target.closest('[data-delpost]'); if (dp) { if (await confirmModal(t('adm.delPostConfirm'))) { const p = posts().find(x => x.id === dp.dataset.delpost); savePosts(posts().filter(x => x.id !== dp.dataset.delpost)); admLog(t('adm.log.delPost', { p: p ? p.title : '' })); paint(root); } return; }
      if (e.target.closest('#chSave')) { const c = { title: $('#chTitle', root).value.trim(), scen: $('#chScen', root).value.trim(), scenAim: $('#chScenAim', root).value.trim(), prize: $('#chPrize', root).value.trim(), desc: $('#chDesc', root).value.trim() }; if (!c.title || !c.scen) return toast(t('adm.ch.required')); saveChallenge(c); admLog(t('adm.log.challenge', { p: c.title })); toast(t('adm.ch.published')); return; }
      if (e.target.closest('#chReset')) { saveChallenge({}); paint(root); return; }
      if (e.target.closest('#annSave')) { const s = settings(); s.announce = $('#annTxt', root).value.trim(); saveSettings(s); admLog(t('adm.log.announce')); toast(t('common.saved')); return; }
      if (e.target.closest('#annClear')) { const s = settings(); s.announce = ''; saveSettings(s); paint(root); return; }
      const ct = e.target.closest('[data-closeticket]'); if (ct) { const l = store.get('tickets', []); l.find(x => x.id === ct.dataset.closeticket).status = 'closed'; store.set('tickets', l); admLog(t('adm.log.ticket')); paint(root); return; }
      if (e.target.closest('#logCsv')) { const l = store.get('admlogs', []); download('jade-journal.csv', 'date;action;par\n' + l.map(x => new Date(x.t).toISOString() + ';"' + x.a.replace(/"/g, '""') + '";' + (x.by || '')).join('\n'), 'text/csv'); return; }
      if (e.target.closest('#admOut')) { session.del('adm'); emit('user'); paint(root); toast(t('adm.locked')); return; }
      if (e.target.closest('#genGo')) { const v = $('#genPass', root).value.trim(); if (!v.includes(':')) return toast(t('adm.hashFormat')); $('#genOut', root).textContent = await sha256(v); return; }
      if (e.target.closest('#purge')) { if (await confirmModal(t('adm.purgeConfirm'))) { purgeAll(); location.reload(); } return; }
      if (e.target.closest('#bAv')) { $('#bFileAv', root).click(); return; }
      if (e.target.closest('#bBn')) { $('#bFileBn', root).click(); return; }
      if (e.target.closest('#bAvRm')) { const p = profile(); p.style.avatarImg = ''; saveProfile(p); paint(root); return; }
      if (e.target.closest('#bBnRm')) { const p = profile(); p.style.bannerImg = ''; saveProfile(p); paint(root); return; }
      if (e.target.closest('#bSave')) { const p = profile(); p.style.customTitle = $('#bTitle', root).value.trim(); saveProfile(p); const lv = Math.max(1, Math.min(100, parseInt($('#bLvl', root).value || 1, 10))); if (lv !== levelFromXP(xpData().total).lvl) setTotalXP(xpForLevel(lv)); admLog(t('adm.log.brand', { n: lv })); toast(t('adm.applied')); paint(root); return; }
    });
    root.addEventListener('change', e => {
      if (!isAdminSession()) return;
      const pl = e.target.closest('[data-plus]'); if (pl) { const a = accounts().find(x => x.id === pl.dataset.plus); if (isPlus(a.id)) { endPlus(a.id); admLog(t('adm.log.plusOff', { p: a.pseudo })); } else { grantPlus(30, 'admin', 'plus_m', a.id); admLog(t('adm.log.plusOn', { p: a.pseudo })); } paint(root); toast(t('adm.applied')); return; }
      const rl = e.target.closest('[data-role]'); if (rl) { const a = accounts().find(x => x.id === rl.dataset.role); updateAccount({ role: rl.value }, a.id); admLog(t('adm.log.role', { p: a.pseudo, r: t('role.' + rl.value) })); toast(t('adm.applied')); return; }
      if (e.target.id === 'crateMult') { const s = settings(); s.crateMult = +e.target.value; saveSettings(s); admLog(t('adm.log.crateMult', { m: e.target.value })); return; }
      if (e.target.id === 'bFileAv') readImage(e.target.files[0], 400, u => { const p = profile(); p.style.avatarImg = u; saveProfile(p); admLog(t('adm.log.avatar')); paint(root); });
      if (e.target.id === 'bFileBn') readImage(e.target.files[0], 1400, u => { const p = profile(); p.style.bannerImg = u; saveProfile(p); admLog(t('adm.log.banner')); paint(root); });
      const bc = e.target.closest('[data-bcrop]'); if (bc) { const p = profile(); p.style[bc.dataset.bcrop] = +bc.value; saveProfile(p); paint(root); }
    });
    root.addEventListener('input', e => {
      if (e.target.id === 'uSearch') { const q = e.target.value.toLowerCase(); root.querySelectorAll('#uRows tr').forEach(r => { r.style.display = r.dataset.row.includes(q) ? '' : 'none'; }); }
      if (e.target.id === 'logQ') { const q = e.target.value.toLowerCase(); root.querySelectorAll('[data-log]').forEach(r => { r.style.display = r.dataset.log.includes(q) ? '' : 'none'; }); }
    });
  },
};
