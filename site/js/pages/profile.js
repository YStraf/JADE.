// Mon profil : compte, vitrine (apparence), niveau, inventaire, sécurité, préférences, notifications, abonnement, support, données.
import { $, $$, esc, download, uidGen } from '../core/dom.js';
import { store, us } from '../core/store.js';
import { t, C, fmt, fmtDate } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { toast } from '../core/toast.js';
import { SFX } from '../core/sfx.js';
import { confirmModal } from '../core/modal.js';
import { applyMotionPref } from '../core/motion.js';
import { go } from '../core/router.js';
import { ITEMS, ITEM, levelFromXP } from '../data/game.js';
import { me, profile, saveProfile, updateAccount, changePassword, deleteAccount, accounts, PSEUDO, DEMO_NAMES, isAdmin } from '../state/account.js';
import { owned, inventory } from '../state/economy.js';
import { level, runs, saveRuns, xpData } from '../state/progress.js';
import { getPlayer } from '../state/players.js';
import { setTheme } from '../state/theme.js';
import { pageHead, avatar, itemCard, itemName, rarityLabel, seg } from '../components/ui.js';
import { showcaseHTML } from '../components/showcase.js';
import { isPlus, subOf, purchases, cancelRenew } from '../state/premium.js';
import { PORTAL_LINK, fmtPrice } from '../data/premium.js';
import { editorBar, editorHint, editState, bindEditor } from '../components/wedit.js';
import { rankLabel } from '../components/minicard.js';
import { emblem } from '../components/emblem.js';
import { openAuth } from '../components/auth.js';

const TABS = [['account', 'user'], ['showcase', 'brush'], ['xp', 'star'], ['inventory', 'crate'], ['security', 'shield'], ['perso', 'settings'], ['notif', 'bell'], ['sub', 'card'], ['support', 'headset'], ['data', 'layers']];
let tab = 'account';
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
function readImage(file, max, cb) {
  if (!file || !/^image\//.test(file.type)) return toast(t('img.notImage'));
  if (file.size > 4 * 1024 * 1024) return toast(t('img.tooBig'));
  const fr = new FileReader();
  fr.onload = () => { const img = new Image(); img.onload = () => { const sc = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); try { cb(c.toDataURL('image/jpeg', .84)); } catch (e) { toast(t('img.unreadable')); } }; img.onerror = () => toast(t('img.unreadable')); img.src = fr.result; };
  fr.readAsDataURL(file);
}
const upd = fn => { const p = profile(); fn(p); saveProfile(p); return p; };
function lockSub(it) { if (it.source === 'plus') return t('lock.plus'); if (it.source === 'founder') return t('lock.founder'); if (it.source === 'tier') return t('lock.tier', { n: it.lvl }); if (it.source === 'crate') return t('lock.crate'); if (it.source === 'secret') return t('lock.secret'); return ''; }
function picker(type, cur, attr) {
  const list = ITEMS.filter(i => i.type === type && (owned(i.id) || (i.source !== 'secret' && i.source !== 'founder')));
  const sorted = list.sort((a, b) => (owned(b.id) - owned(a.id)));
  return '<div class="item-grid">' + sorted.map(i => { const own = owned(i.id); return itemCard(i.id, { pressed: cur === i.key, locked: !own, attr: attr + '="' + i.key + '"', sub: own ? rarityLabel(i.rarity) : esc(lockSub(i)) }); }).join('') + '</div>';
}
function tabBody() {
  const u = me(); const p = profile(); const st = p.style;
  if (tab === 'account') return '<div class="card"><h3>' + esc(t('profile.tab.account')) + '</h3><p class="desc">' + esc(t('profile.accountSub')) + '</p>' +
    '<div class="field"><label for="uPseudo">' + esc(t('auth.pseudo')) + '</label><input type="text" id="uPseudo" maxlength="24" value="' + esc(u.pseudo) + '"></div>' +
    '<div class="field"><label for="uEmail">' + esc(t('auth.email')) + '</label><input type="email" id="uEmail" value="' + esc(u.email) + '"></div>' +
    '<div class="field"><label for="uBio">' + esc(t('profile.bio')) + '</label><textarea id="uBio" maxlength="240" placeholder="' + esc(t('profile.bioPh')) + '">' + esc(p.bio || '') + '</textarea></div>' +
    '<button class="btn primary" id="saveAcc">' + esc(t('common.save')) + '</button></div>' +
    '<div class="card"><h3>' + esc(t('profile.avatar')) + '</h3><p class="desc">' + esc(t('profile.avatarSub')) + '</p><div class="upl"><span id="avPrev">' + avatar({ pseudo: u.pseudo, style: st }, 84) + '</span><div class="row-flex"><button class="btn small" id="upAv">' + ic('upload') + esc(t('profile.upload')) + '</button>' + (st.avatarImg ? '<button class="btn small danger" id="rmAv">' + esc(t('common.remove')) + '</button>' : '') + '</div></div>' +
    (st.avatarImg ? '<div class="crop"><label>' + esc(t('crop.zoom')) + '<input type="range" data-crop="avatarZoom" min="100" max="320" value="' + st.avatarZoom + '"></label><label>' + esc(t('crop.x')) + '<input type="range" data-crop="avatarX" min="0" max="100" value="' + st.avatarX + '"></label><label>' + esc(t('crop.y')) + '<input type="range" data-crop="avatarY" min="0" max="100" value="' + st.avatarY + '"></label></div>' : '') +
    '<input type="file" id="fileAv" accept="image/*" hidden></div>';
  if (tab === 'showcase') {
    const me2 = getPlayer(u.pseudo);
    const titles = ITEMS.filter(i => i.type === 'title' && owned(i.id));
    return '<div class="row-flex" style="margin-bottom:14px"><a class="btn small" href="#/joueur/' + encodeURIComponent(u.pseudo) + '">' + ic('eye') + esc(t('profile.public')) + '</a><button class="btn small ghost" id="copyLink">' + ic('copy') + esc(t('profile.copyLink')) + '</button>' + editorBar() + '</div>' + editorHint() + showcaseHTML(me2, editState()) +
      '<div class="card"><h3>' + esc(t('look.banner')) + '</h3><p class="desc">' + esc(t('look.bannerSub')) + '</p>' +
        '<div class="row-flex plus-row"><button class="btn small" id="upBn"' + (isPlus() ? '' : ' data-needplus') + '>' + ic(isPlus() ? 'upload' : 'lock') + esc(t('look.bannerUpload')) + '</button>' + (st.bannerImg ? '<button class="btn small danger" id="rmBn">' + esc(t('common.remove')) + '</button>' : '') + '<span class="tag plus-tag">Jade+</span><span class="muted small-note">' + esc(t('look.bannerUploadSub')) + '</span><input type="file" id="fileBn" accept="image/*" hidden></div>' + picker('banner', st.bannerImg ? '' : st.banner, 'data-bn') + '</div>' +
      '<div class="card"><h3>' + esc(t('look.frame')) + '</h3><p class="desc">' + esc(t('look.frameSub')) + '</p>' + picker('frame', st.frame, 'data-fr') + '</div>' +
      '<div class="card"><h3>' + esc(t('look.title')) + '</h3><p class="desc">' + esc(t('look.titleSub')) + '</p>' +
      '<div class="title-pick"><button type="button" class="chip-btn" data-ti="" aria-pressed="' + (!st.title && !st.customTitle) + '">' + esc(t('look.noTitle')) + '</button>' + titles.map(i => '<button type="button" class="chip-btn rar-' + (i.rarity === 'base' ? 'tier' : i.rarity) + '" data-ti="' + i.key + '" aria-pressed="' + (st.title === i.key && !st.customTitle) + '">' + esc(itemName(i.id)) + '</button>').join('') + '</div>' +
      (titles.length ? '' : '<p class="muted small-note" style="margin-top:10px">' + esc(t('look.noTitles')) + '</p>') +
      (isAdmin() ? '<div class="field" style="margin-top:16px;max-width:380px"><label for="cTitle">' + esc(t('look.customTitle')) + '</label><input type="text" id="cTitle" maxlength="40" value="' + esc(st.customTitle || '') + '" placeholder="' + esc(t('look.customTitlePh')) + '"></div><p class="inline-note">' + esc(t('look.customTitleNote')) + '</p>' : '<p class="inline-note">' + esc(t('look.titleRule')) + '</p>') + '</div>' +
      '<div class="card"><h3>' + esc(t('look.bg')) + '</h3><p class="desc">' + esc(t('look.bgSub')) + '</p><div class="item-grid"><button type="button" class="item-card" data-bgpick="none" aria-pressed="' + (!st.bg || st.bg === 'none') + '"><div class="item-prev"></div><b>' + esc(t('look.noBg')) + '</b></button>' + ITEMS.filter(i => i.type === 'bg').map(i => itemCard(i.id, { pressed: st.bg === i.key, locked: !owned(i.id), attr: 'data-bgpick="' + i.key + '"', sub: owned(i.id) ? '' : esc(lockSub(i)) })).join('') + '</div></div>' +
      '<div class="card"><h3>' + esc(t('look.extras')) + '</h3><div class="row"><div class="lbl"><b>' + esc(t('item.perk.namecolor')) + '</b><span>' + esc(owned('perk:namecolor') ? t('look.nameColorSub') : t('lock.tier', { n: 10 })) + '</span></div><button class="toggle" data-namecolor aria-pressed="' + (owned('perk:namecolor') && st.nameColor !== false) + '"' + (owned('perk:namecolor') ? '' : ' disabled') + '></button></div></div>';
  }
  if (tab === 'xp') {
    const L = level(); const pl = getPlayer(u.pseudo); const r = pl.rank;
    return '<div class="grid" style="--min:260px"><a class="card hover" href="#/pass"><div class="row-flex"><span class="lvl-big sm"><b>' + L.lvl + '</b><span>' + esc(t('xp.level')) + '</span></span><div style="flex:1"><b>' + fmt(xpData().total) + ' XP</b><div class="bar" style="margin:8px 0"><i style="width:' + L.pct + '%"></i></div><small class="muted">' + esc(t('pass.toNext', { n: fmt(L.need - L.into), lvl: L.lvl + 1 })) + '</small></div></div><p class="inline-note">' + esc(t('profile.seePass')) + ' →</p></a>' +
      '<a class="card hover" href="#/rangs"><div class="row-flex">' + (r ? emblem(r.index, { size: 64, div: r.div }) : emblem(0, { size: 56, cls: 'dim' })) + '<div><span class="muted small-note">' + esc(t('rank.label')) + '</span><h3 style="color:' + (r ? r.c : 'inherit') + '">' + esc(rankLabel(r)) + '</h3></div></div><p class="inline-note">' + esc(t('profile.seeRanks')) + ' →</p></a></div>';
  }
  if (tab === 'inventory') { const inv = inventory(); const mine = ITEMS.filter(i => inv[i.id]); return '<div class="card"><h3>' + esc(t('shop.tab.inventory')) + '</h3><p class="desc">' + esc(t('profile.invSub', { n: mine.length })) + '</p>' + (mine.length ? '<div class="item-grid">' + mine.map(i => itemCard(i.id, { qty: inv[i.id].q, attr: 'data-goequip="' + i.id + '"' })).join('') + '</div>' : '<p class="muted">' + esc(t('shop.invEmpty')) + '</p>') + '<a class="btn small" style="margin-top:16px" href="#/shop">' + ic('bag') + esc(t('nav.shop')) + '</a></div>'; }
  if (tab === 'security') return '<div class="card"><h3>' + esc(t('sec.password')) + '</h3><p class="desc">' + esc(t('sec.passwordSub')) + '</p><div class="field"><label for="pw1">' + esc(t('sec.newPw')) + '</label><input type="password" id="pw1" autocomplete="new-password"></div><div class="field"><label for="pw2">' + esc(t('sec.confirmPw')) + '</label><input type="password" id="pw2" autocomplete="new-password"></div><button class="btn primary" id="savePw">' + esc(t('common.save')) + '</button></div>' +
    '<div class="card"><h3>' + esc(t('sec.2fa')) + '</h3><div class="row"><div class="lbl"><b>' + esc(t('sec.2faApp')) + '</b><span>' + esc(t('sec.2faSub')) + '</span></div><span class="badge">' + esc(t('common.soon')) + '</span></div></div>' +
    '<div class="card"><h3>' + esc(t('sec.links')) + '</h3><p class="desc">' + esc(t('sec.linksSub')) + '</p>' + [['steam', 'Steam'], ['faceit', 'FACEIT'], ['google', 'Google'], ['riot', 'Riot Games']].map(([k, n]) => '<div class="row"><div class="lbl"><b>' + n + '</b><span>' + esc(t('sec.link.' + k)) + '</span></div><span class="badge">' + esc(t('common.soon')) + '</span></div>').join('') + '</div>' +
    '<div class="card"><h3>' + esc(t('sec.sessions')) + '</h3><div class="row"><div class="lbl"><b>' + esc(t('sec.thisBrowser')) + '</b><span>' + esc(t('sec.localOnly')) + '</span></div><span class="badge ok">' + esc(t('sec.active')) + '</span></div></div>';
  if (tab === 'perso') {
    const th = document.documentElement.getAttribute('data-theme');
    const themes = [['dark', 'theme:dark'], ['light', 'theme:light'], ['contrast', 'theme:contrast'], ['jade', 'theme:jade']];
    return '<div class="card"><h3>' + esc(t('perso.theme')) + '</h3><p class="desc">' + esc(t('perso.themeSub')) + '</p><div class="item-grid">' + themes.map(([k, id]) => itemCard(id, { pressed: th === k, locked: !owned(id), attr: 'data-theme-pick="' + k + '"', sub: owned(id) ? '' : esc(lockSub(ITEM[id])) })).join('') + '</div></div>' +
      '<div class="card"><h3>' + esc(t('perso.display')) + '</h3>' +
      '<div class="row"><div class="lbl"><b>' + esc(t('perso.anims')) + '</b><span>' + esc(t('perso.animsSub')) + '</span></div><button class="toggle" data-anims aria-pressed="' + (store.get('anims', true) !== false) + '"></button></div>' +
      '<div class="row"><div class="lbl"><b>' + esc(t('perso.sounds')) + '</b><span>' + esc(t('perso.soundsSub')) + '</span></div><button class="toggle" data-sfx aria-pressed="' + SFX.on + '"></button></div></div>' +
      '<div class="card"><h3>' + esc(t('perso.privacy')) + '</h3><div class="row"><div class="lbl"><b>' + esc(t('perso.public')) + '</b><span>' + esc(t('perso.publicSub')) + '</span></div><button class="toggle" data-pref="publicProfile" aria-pressed="' + (p.prefs.publicProfile !== false) + '"></button></div><div class="row"><div class="lbl"><b>' + esc(t('perso.scores')) + '</b><span>' + esc(t('perso.scoresSub')) + '</span></div><button class="toggle" data-pref="showScores" aria-pressed="' + (p.prefs.showScores !== false) + '"></button></div></div>';
  }
  if (tab === 'notif') return '<div class="card"><h3>' + esc(t('profile.tab.notif')) + '</h3><p class="desc">' + esc(t('notif.sub')) + '</p>' + ['weekly', 'challenge', 'replies', 'news'].map(k => '<div class="row"><div class="lbl"><b>' + esc(t('notif.' + k)) + '</b><span>' + esc(t('notif.' + k + '.sub')) + '</span></div><button class="toggle" data-notif="' + k + '" aria-pressed="' + (p.notif[k] !== false) + '"></button></div>').join('') + '<p class="inline-note">' + esc(t('notif.legal')) + '</p></div>';
  if (tab === 'sub') {
    const sb = subOf(), on = isPlus(), buys = purchases();
    return '<div class="card"><h3>' + esc(t('profile.tab.sub')) + '</h3>' +
      '<div class="row"><div class="lbl"><b>' + (on ? 'Jade+' : esc(t('pr.free'))) + '</b><span>' + esc(on ? (sb.renew ? t('sub.renewsOn', { d: fmtDate(sb.until) }) : t('sub.endsOn', { d: fmtDate(sb.until) })) : t('sub.freeSub')) + '</span></div>' + (on ? '<span class="tag plus-tag">Jade+</span>' : '<a class="btn small primary" href="#/formules">' + ic('sparkles') + esc(t('pr.plus.cta')) + '</a>') + '</div>' +
      (on && sb.renew ? '<div class="row"><div class="lbl"><b>' + esc(t('sub.cancel')) + '</b><span>' + esc(t('sub.cancelSub')) + '</span></div><button class="btn small danger" id="subCancel">' + esc(t('sub.cancelBtn')) + '</button></div>' : '') +
      (on && PORTAL_LINK ? '<div class="row"><div class="lbl"><b>' + esc(t('sub.method')) + '</b><span>' + esc(t('sub.portalSub')) + '</span></div><a class="btn small" href="' + esc(PORTAL_LINK) + '" target="_blank" rel="noopener">' + ic('ext') + esc(t('sub.portal')) + '</a></div>' : '') + '</div>' +
      '<div class="card"><h3>' + esc(t('sub.history')) + '</h3>' + (buys.length ? buys.map(b => '<div class="row"><div class="lbl"><b>' + esc(t('pay.title.' + b.offer)) + '</b><span>' + fmtDate(b.t) + '</span></div><b>' + fmtPrice(b.price) + '</b></div>').join('') : '<p class="muted">' + esc(t('sub.noHistory')) + '</p>') + '<p class="inline-note">' + esc(t('sub.coinsNever')) + '</p></div>';
  }
  if (tab === 'support') return '<div class="card"><h3>' + esc(t('support.faq')) + '</h3><div class="faq">' + C('support').map(f => '<details><summary>' + esc(f[0]) + '</summary><p>' + esc(f[1]) + '</p></details>').join('') + '</div></div>' +
    '<div class="card"><h3>' + esc(t('support.contact')) + '</h3><div class="field"><label for="sSub">' + esc(t('support.subject')) + '</label><select id="sSub">' + ['tech', 'billing', 'content', 'scam', 'other'].map(k => '<option value="' + k + '">' + esc(t('support.s.' + k)) + '</option>').join('') + '</select></div><div class="field"><label for="sMsg">' + esc(t('support.message')) + '</label><textarea id="sMsg" placeholder="' + esc(t('support.messagePh')) + '"></textarea></div><button class="btn primary" id="sSend">' + esc(t('support.send')) + '</button><p class="inline-note">' + esc(t('support.delay')) + '</p></div>';
  if (tab === 'data') { const n = runs().length; return '<div class="card"><h3>' + esc(t('data.title')) + '</h3><p class="desc">' + esc(t('data.sub')) + '</p><div class="row"><div class="lbl"><b>' + esc(t('data.export')) + '</b><span>' + esc(t('data.exportSub')) + '</span></div><button class="btn small" id="expData">' + ic('download') + esc(t('data.exportBtn')) + '</button></div><div class="row"><div class="lbl"><b>' + esc(t('data.sessions')) + '</b><span>' + esc(t('data.sessionsSub', { n })) + '</span></div><button class="btn small" id="clrRuns">' + esc(t('common.erase')) + '</button></div></div>' +
    '<div class="card danger-zone"><h3>' + esc(t('data.delete')) + '</h3><p class="desc">' + esc(t('data.deleteSub')) + '</p><div class="field" style="max-width:320px"><label for="delConf">' + esc(t('data.typePseudo', { p: u.pseudo })) + '</label><input type="text" id="delConf" autocomplete="off"></div><button class="btn danger" id="delAcc">' + esc(t('data.deleteBtn')) + '</button></div>'; }
  return '';
}
function paint(root) {
  const u = me(); const L = level(); const pl = getPlayer(u.pseudo);
  $('#pNav', root).innerHTML = '<div class="vhead"><div class="row-flex" style="gap:12px;flex-wrap:nowrap">' + avatar(pl, 46) + '<div style="min-width:0"><b class="nm">' + esc(u.pseudo) + '</b><span class="muted small-note" style="display:block">' + esc(rankLabel(pl.rank)) + '</span></div></div><div class="bar" style="margin-top:12px"><i style="width:' + L.pct + '%"></i></div><small class="muted">' + esc(t('xp.level')) + ' ' + L.lvl + ' · ' + fmt(L.into) + ' / ' + fmt(L.need) + ' XP</small></div>' +
    TABS.map(([id, i]) => '<button type="button" data-tab="' + id + '" aria-current="' + (id === tab) + '">' + ic(i) + esc(t('profile.tab.' + id)) + '</button>').join('');
  $('#pBody', root).innerHTML = '<div class="reveal">' + tabBody() + '</div>';
}
function bind(root) {
  const rerender = () => paint(root);
  bindEditor(root, rerender);
  root.addEventListener('click', async e => {
    const tb = e.target.closest('[data-tab]'); if (tb) { tab = tb.dataset.tab; history.replaceState(null, '', '#/profil/' + tab); paint(root); return; }
    const u = me(); if (!u) return;
    if (e.target.closest('#saveAcc')) {
      const ps = $('#uPseudo', root).value.trim(), em = $('#uEmail', root).value.trim().toLowerCase(), bio = $('#uBio', root).value.trim();
      if (!PSEUDO.test(ps)) return toast(t('auth.err.pseudo'));
      if (ps.toLowerCase() !== u.pseudo.toLowerCase() && (accounts().some(a => a.id !== u.id && a.pseudo.toLowerCase() === ps.toLowerCase()) || DEMO_NAMES.includes(ps.toLowerCase()))) return toast(t('auth.err.pseudoTaken'));
      if (!EMAIL.test(em)) return toast(t('auth.err.email'));
      if (em !== u.email && accounts().some(a => a.id !== u.id && a.email === em)) return toast(t('auth.err.emailTaken'));
      updateAccount({ pseudo: ps, email: em }); upd(p => { p.bio = bio; }); toast(t('common.saved')); rerender(); return;
    }
    if (e.target.closest('#upAv')) { $('#fileAv', root).click(); return; }
    if (e.target.closest('[data-needplus]')) { toast(t('plus.needed')); go('formules'); return; }
    if (e.target.closest('#upBn')) { $('#fileBn', root).click(); return; }
    if (e.target.closest('#rmBn')) { upd(p => { p.style.bannerImg = ''; }); rerender(); return; }
    if (e.target.closest('#subCancel')) { if (await confirmModal(t('sub.cancelConfirm'), { ok: t('sub.cancelBtn') })) { cancelRenew(); rerender(); toast(t('sub.canceled')); } return; }
    if (e.target.closest('#rmAv')) { upd(p => { p.style.avatarImg = ''; }); rerender(); return; }
    const bn = e.target.closest('[data-bn]'); if (bn && !bn.disabled) { upd(p => { p.style.banner = bn.dataset.bn; p.style.bannerImg = ''; }); rerender(); return; }
    const fr = e.target.closest('[data-fr]'); if (fr && !fr.disabled) { upd(p => { p.style.frame = fr.dataset.fr; }); rerender(); toast(t('look.frameApplied')); return; }
    const ti = e.target.closest('[data-ti]'); if (ti) { const k = ti.dataset.ti; if (k && !owned('title:' + k)) return; upd(p => { p.style.title = k; p.style.customTitle = ''; }); rerender(); return; }
    const bg = e.target.closest('[data-bgpick]'); if (bg && !bg.disabled) { upd(p => { p.style.bg = bg.dataset.bgpick; }); rerender(); return; }
    if (e.target.closest('[data-namecolor]')) { upd(p => { p.style.nameColor = p.style.nameColor === false; }); rerender(); return; }
    const gq = e.target.closest('[data-goequip]'); if (gq) { const { equip } = await import('./shop.js'); equip(gq.dataset.goequip); rerender(); return; }
    const tp = e.target.closest('[data-theme-pick]'); if (tp && !tp.disabled) { setTheme(tp.dataset.themePick); rerender(); return; }
    if (e.target.closest('[data-anims]')) { store.set('anims', store.get('anims', true) === false); applyMotionPref(); rerender(); return; }
    if (e.target.closest('[data-sfx]')) { SFX.set(!SFX.on); rerender(); return; }
    const pf = e.target.closest('[data-pref]'); if (pf) { upd(p => { p.prefs[pf.dataset.pref] = p.prefs[pf.dataset.pref] === false; }); rerender(); return; }
    const nf = e.target.closest('[data-notif]'); if (nf) { upd(p => { p.notif[nf.dataset.notif] = p.notif[nf.dataset.notif] === false; }); rerender(); return; }
    if (e.target.closest('[data-paysoon]')) { toast(t('sub.notActive')); return; }
    if (e.target.closest('#savePw')) { const a = $('#pw1', root).value, c = $('#pw2', root).value; if (a.length < 8) return toast(t('auth.err.password')); if (a !== c) return toast(t('sec.mismatch')); await changePassword(a); $('#pw1', root).value = ''; $('#pw2', root).value = ''; toast(t('sec.pwChanged')); return; }
    if (e.target.closest('#sSend')) { const m = $('#sMsg', root).value.trim(); if (m.length < 10) return toast(t('support.tooShort')); const l = store.get('tickets', []); l.unshift({ id: uidGen(), by: u.pseudo, subject: $('#sSub', root).value, msg: m, t: Date.now(), status: 'open', plus: isPlus() }); store.set('tickets', l.slice(0, 200)); $('#sMsg', root).value = ''; toast(t('support.sent')); return; }
    if (e.target.closest('#copyLink')) { try { await navigator.clipboard.writeText(location.origin + location.pathname + '#/joueur/' + encodeURIComponent(u.pseudo)); toast(t('common.copied')); } catch (x) { toast(t('common.copyFail')); } return; }
    if (e.target.closest('#expData')) { const data = { account: { ...u, pw: undefined }, profile: profile(), xp: xpData(), coins: us.get('coins', 0), coinLog: us.get('coinlog', []), inventory: inventory(), runs: runs(), bests: us.get('bests', {}), entries: us.get('entries', {}) }; download('jade-donnees.json', JSON.stringify(data, null, 2)); toast(t('data.exported')); return; }
    if (e.target.closest('#clrRuns')) { if (await confirmModal(t('prog.clearConfirm'))) { saveRuns([]); rerender(); toast(t('prog.cleared')); } return; }
    if (e.target.closest('#delAcc')) { if ($('#delConf', root).value.trim() !== u.pseudo) return toast(t('data.typeMismatch')); if (await confirmModal(t('data.deleteConfirm'))) { deleteAccount(); toast(t('data.deleted')); go(''); } return; }
  });
  root.addEventListener('change', e => {
    if (e.target.id === 'fileBn' && isPlus()) { const f = e.target.files[0]; const done = url => { upd(p => { p.style.bannerImg = url; p.style.bannerZoom = 100; p.style.bannerX = 50; p.style.bannerY = 50; }); paint(root); toast(t('common.saved')); }; if (f && /^image\/gif$/.test(f.type)) { if (f.size > 1.5 * 1024 * 1024) toast(t('wg.gif.tooBig')); else { const fr = new FileReader(); fr.onload = () => done(fr.result); fr.readAsDataURL(f); } } else readImage(f, 1400, done); }
    if (e.target.id === 'fileAv') readImage(e.target.files[0], 320, url => { upd(p => { p.style.avatarImg = url; p.style.avatarZoom = 100; p.style.avatarX = 50; p.style.avatarY = 50; }); paint(root); toast(t('profile.avatarSet')); });
    if (e.target.id === 'cTitle' && isAdmin()) { upd(p => { p.style.customTitle = e.target.value.trim(); }); paint(root); toast(t('common.saved')); }
    const cr = e.target.closest('[data-crop]'); if (cr) upd(p => { p.style[cr.dataset.crop] = +cr.value; });
  });
  root.addEventListener('input', e => { const cr = e.target.closest('[data-crop]'); if (cr) { const av = $('#avPrev .av-in', root); const p = profile(); p.style[cr.dataset.crop] = +cr.value; if (av) av.style.cssText = 'background-image:url(' + p.style.avatarImg + ');background-size:' + p.style.avatarZoom + '%;background-position:' + p.style.avatarX + '% ' + p.style.avatarY + '%'; } });
}
export default {
  title: () => t('nav.profile'),
  render() {
    if (!me()) return pageHead(esc(t('nav.profile')), esc(t('profile.sub'))) + '<div class="card center" style="max-width:520px;margin:30px auto"><span class="big-ic">' + ic('user') + '</span><h3>' + esc(t('profile.guestTitle')) + '</h3><p class="muted" style="margin:8px 0 18px">' + esc(t('profile.guestText')) + '</p><div class="row-flex" style="justify-content:center"><button class="btn primary" data-auth="up">' + esc(t('auth.signup')) + '</button><button class="btn" data-auth="in">' + esc(t('auth.signin')) + '</button></div></div>';
    return pageHead(esc(t('nav.profile')), esc(t('profile.sub'))) + '<div class="tabs-layout"><nav class="vnav" id="pNav" aria-label="' + esc(t('nav.profile')) + '"></nav><div id="pBody"></div></div>';
  },
  mount(root, sub) {
    if (!me()) return;
    if (TABS.some(x => x[0] === sub[0])) tab = sub[0];
    paint(root); bind(root);
  },
};
