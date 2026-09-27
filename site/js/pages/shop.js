// Shop : caisses, inventaire, Arcade, gains de coins, historique.
import { $, esc } from '../core/dom.js';
import { t, fmt, fmtDateTime } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { toast } from '../core/toast.js';
import { SFX } from '../core/sfx.js';
import { openModal, confirmModal } from '../core/modal.js';
import { reduced } from '../core/motion.js';
import { CRATES, crateOdds, ITEM, ITEMS, ARCADE, wheelEV, COIN_RULES } from '../data/game.js';
import { coins, coinLog, inventory, openCrate, crateCost, limits, arcadeStatus, playWheel, playCoinflip, playMystery, payout, excludeArcade, owned } from '../state/economy.js';
import { me, updateProfile, profile } from '../state/account.js';
import { pageHead, seg, itemPreview, itemName, rarityLabel, itemCard, empty, noteBox } from '../components/ui.js';
import { crateArt } from '../components/crate-art.js';
import { openAuth } from '../components/auth.js';
import { go } from '../core/router.js';

const TABS = ['crates', 'inventory', 'arcade', 'earn', 'history'];
let tab = 'crates';
const pct = v => fmt(v, v < 1 ? 2 : 1) + ' %';
export function equip(id) {
  const it = ITEM[id]; if (!owned(id)) return false;
  updateProfile(p => { if (it.type === 'frame') p.style.frame = it.key; if (it.type === 'banner') { p.style.banner = it.key; p.style.bannerImg = ''; } if (it.type === 'title') { p.style.title = it.key; } if (it.type === 'bg') p.style.bg = it.key; });
  toast(t('shop.equipped', { name: itemName(id) })); return true;
}
function odds(k) {
  const o = crateOdds(k);
  openModal('<h2>' + esc(t('crate.' + k)) + '</h2><p class="lead">' + esc(t('shop.oddsSub')) + '</p><div class="odds-r">' + ['common', 'rare', 'epic', 'legend'].filter(r => o.byRarity[r]).map(r => '<div>' + rarityLabel(r) + '<b>' + pct(o.byRarity[r]) + '</b></div>').join('') + '</div>' +
    '<div class="table-wrap"><table><thead><tr><th>' + esc(t('shop.item')) + '</th><th>' + esc(t('shop.rarity')) + '</th><th>' + esc(t('shop.chance')) + '</th></tr></thead><tbody>' + o.byItem.map(x => '<tr><td>' + esc(itemName(x.it.id)) + '</td><td>' + rarityLabel(x.it.rarity) + '</td><td><b>' + pct(x.p) + '</b></td></tr>').join('') + '</tbody></table></div><p class="inline-note">' + esc(t('shop.oddsNote')) + '</p>', { width: '560px' });
}
function openAnim(k, item) {
  const pool = CRATES[k].pool; const items = []; for (let i = 0; i < 40; i++) items.push(pool[Math.floor(Math.random() * pool.length)]);
  const win = 34; items[win] = item.id;
  const { el, close } = openModal('<h2 class="center" style="padding:0">' + esc(t('crate.' + k)) + '</h2><div class="open-track"><div class="open-strip" id="strip">' + items.map(id => '<div class="open-item r-' + ITEM[id].rarity + '">' + itemPreview(id) + '<small>' + esc(itemName(id)) + '</small></div>').join('') + '</div></div><div id="openRes" class="open-res" aria-live="polite"></div>', { width: '760px', label: t('crate.' + k) });
  const strip = el.querySelector('#strip');
  const show = () => {
    const eq = ['frame', 'banner', 'title'].includes(item.type);
    el.querySelector('#openRes').innerHTML = '<div class="won r-' + item.rarity + '">' + itemPreview(item.id, me().pseudo) + '<div><span class="muted small-note">' + esc(t('shop.youGot')) + '</span><h3>' + esc(itemName(item.id)) + '</h3>' + rarityLabel(item.rarity) + '</div></div><div class="row-flex" style="justify-content:center;margin-top:16px">' + (eq ? '<button class="btn primary" data-eq>' + esc(t('shop.equip')) + '</button>' : '') + '<button class="btn" data-again>' + esc(t('shop.again')) + '</button><button class="btn ghost" data-close>' + esc(t('common.close')) + '</button></div>';
    el.querySelector('[data-close]').onclick = close;
    const e = el.querySelector('[data-eq]'); if (e) e.onclick = () => { equip(item.id); close(); };
    el.querySelector('[data-again]').onclick = () => { close(); tryOpen(k); };
    item.rarity === 'legend' || item.rarity === 'epic' ? SFX.win() : SFX.enter();
  };
  if (reduced()) { const w = 128; strip.style.transform = 'translateX(' + (-(win * w) + el.querySelector('.open-track').clientWidth / 2 - w / 2) + 'px)'; show(); return; }
  requestAnimationFrame(() => { const w = 128, trackW = el.querySelector('.open-track').clientWidth; const off = win * w - trackW / 2 + w / 2 + (Math.random() * 60 - 30); strip.style.transition = 'transform 4.4s cubic-bezier(.08,.72,.06,1)'; strip.style.transform = 'translateX(' + (-off) + 'px)'; });
  let last = -1; const tk = setInterval(() => { const m = new DOMMatrix(getComputedStyle(strip).transform); const i = Math.floor(-m.m41 / 128); if (i !== last) { last = i; SFX.tick(); } }, 40);
  setTimeout(() => { clearInterval(tk); show(); }, 4600);
}
function tryOpen(k) {
  if (!me()) { openAuth('up'); return; }
  const r = openCrate(k);
  if (r.error) { toast(t(r.error)); return; }
  openAnim(k, r.item);
}
function crates() {
  const lim = limits();
  return '<div class="crates">' + Object.keys(CRATES).map(k => { const o = crateOdds(k).byRarity; return '<div class="crate crate-' + k + '"><div class="crate-art">' + crateArt(k, { size: 190 }) + '</div><h3>' + esc(t('crate.' + k)) + '</h3><p class="muted">' + esc(t('crate.' + k + '.desc')) + '</p><div class="crate-odds">' + ['common', 'rare', 'epic', 'legend'].filter(r => o[r]).map(r => '<span class="rar-' + r + '" title="' + esc(t('rarity.' + r)) + '"><i></i>' + pct(o[r]) + '</span>').join('') + '</div>' +
    '<div class="crate-prev">' + CRATES[k].pool.filter(id => ['epic', 'legend'].includes(ITEM[id].rarity)).slice(0, 3).map(id => '<div title="' + esc(itemName(id)) + '">' + itemPreview(id) + '</div>').join('') + '</div>' +
    '<div class="row-flex" style="justify-content:center"><button class="btn primary" data-open="' + k + '"><span class="coin"></span>' + esc(t('shop.open')) + ' · ' + fmt(crateCost(k)) + '</button><button class="btn small ghost" data-odds="' + k + '">' + esc(t('shop.odds')) + '</button></div></div>'; }).join('') + '</div>' +
    '<p class="fine-print">' + esc(t('shop.cratesLeft', { n: lim.crates })) + ' · ' + esc(t('shop.cratesNote')) + ' <a href="#/legal/coins">' + esc(t('legal.short.coins')) + '</a></p>';
}
function invTab() {
  if (!me()) return empty(t('shop.invGuest'), 'crate');
  const inv = inventory(); const p = profile();
  const mine = ITEMS.filter(i => inv[i.id]);
  if (!mine.length) return empty(t('shop.invEmpty'), 'crate');
  const on = id => { const it = ITEM[id]; return (it.type === 'frame' && p.style.frame === it.key) || (it.type === 'banner' && p.style.banner === it.key && !p.style.bannerImg) || (it.type === 'title' && p.style.title === it.key); };
  return '<p class="muted small-note" style="margin-bottom:12px">' + esc(t('shop.invCount', { n: mine.length })) + '</p><div class="item-grid">' + mine.map(i => itemCard(i.id, { pressed: on(i.id), qty: inv[i.id].q, attr: 'data-equip="' + i.id + '"', sub: rarityLabel(i.rarity) + (on(i.id) ? ' · ' + esc(t('shop.equippedLbl')) : '') })).join('') + '</div><p class="inline-note">' + esc(t('shop.invNote')) + '</p>';
}
function arcade() {
  const s = arcadeStatus(); const lim = limits();
  if (['disabled', 'account', 'underage', 'excluded'].includes(s)) return noteBox('<b>' + esc(t('arcade.gate.' + s)) + '</b><br>' + esc(t('arcade.gate.' + s + '.sub')), 'lock', true) + (s === 'account' ? '<div class="row-flex" style="margin-top:14px"><button class="btn primary" data-auth="up">' + esc(t('auth.signup')) + '</button></div>' : '');
  const W = ARCADE.wheel; const colors = ['#3a4a42', '#5a6b62', '#2EE88A', '#5aa8ff', '#2EE88A', '#a377ff', '#ffc46b', '#ff5f6d'];
  const conic = W.segs.map((sg, i) => colors[i] + ' ' + (i * 45) + 'deg ' + ((i + 1) * 45) + 'deg').join(',');
  return '<div class="arcade-info">' + noteBox(esc(t('arcade.info', { n: lim.arcade, total: ARCADE.dailyLimit })), 'info') + '</div><div class="arcade-grid">' +
    '<div class="card arcade-card"><h3>' + esc(t('arcade.wheel')) + '</h3><p class="muted small-note">' + esc(t('arcade.wheelSub', { n: W.stake })) + '</p><div class="wheel-wrap"><div class="wheel" id="wheel" style="background:conic-gradient(' + conic + ')">' + W.segs.map((sg, i) => '<span style="transform:rotate(' + (i * 45 + 22.5) + 'deg) translateY(-72px)">×' + String(sg.m).replace('.', ',') + '</span>').join('') + '</div><button class="btn primary" data-wheel>' + esc(t('arcade.spin', { n: W.stake })) + '</button><div class="result-line" id="wRes"></div></div></div>' +
    '<div class="card arcade-card"><h3>' + esc(t('arcade.coin')) + '</h3><p class="muted small-note">' + esc(t('arcade.coinSub', { n: ARCADE.coinflip.stake })) + '</p><div class="coin-flip" id="cf"><span class="coin lg"></span></div><div class="row-flex" style="justify-content:center"><button class="btn" data-cf="heads">' + esc(t('arcade.heads')) + '</button><button class="btn" data-cf="tails">' + esc(t('arcade.tails')) + '</button></div><div class="result-line" id="cfRes"></div></div>' +
    '<div class="card arcade-card"><h3>' + esc(t('arcade.grid')) + '</h3><p class="muted small-note">' + esc(t('arcade.gridSub', { n: ARCADE.mystery.stake, m: ARCADE.mystery.mult })) + '</p><div class="grid9" id="g9">' + Array.from({ length: 9 }, (_, i) => '<button type="button" data-cell="' + i + '">?</button>').join('') + '</div><div class="result-line" id="gRes"></div></div></div>' +
    '<div class="card section"><h3>' + esc(t('arcade.fair')) + '</h3><p class="muted small-note">' + esc(t('arcade.fairSub', { w: fmt(wheelEV(), 2), c: '1,00', g: fmt(ARCADE.mystery.mult / 9, 2) })) + '</p><hr class="sep"><h4>' + esc(t('arcade.exclude')) + '</h4><p class="muted small-note" style="margin:4px 0 10px">' + esc(t('arcade.excludeSub')) + '</p><div class="row-flex"><button class="btn small" data-ex="7">' + esc(t('arcade.ex7')) + '</button><button class="btn small" data-ex="30">' + esc(t('arcade.ex30')) + '</button><button class="btn small danger" data-ex="0">' + esc(t('arcade.exForever')) + '</button></div><p class="inline-note">' + esc(t('arcade.help')) + '</p></div>';
}
function earn() {
  const rows = [['earn.challenge', '100 – 300'], ['earn.session', '+' + COIN_RULES.session + ' (' + t('earn.cap', { n: COIN_RULES.sessionDailyCap }) + ')'], ['earn.streak', '+' + COIN_RULES.streak_week], ['earn.record', '+' + COIN_RULES.record_test], ['earn.milestone', '+' + COIN_RULES.level_milestone]];
  return '<div class="card"><div class="stack" style="--gap:0">' + rows.map(([k, v]) => '<div class="row"><div class="lbl"><b>' + esc(t(k)) + '</b><span>' + esc(t(k + '.how')) + '</span></div><span class="row-flex" style="gap:6px"><span class="coin"></span><b>' + esc(v) + '</b></span></div>').join('') + '</div></div>' + '<div class="section">' + noteBox(esc(t('earn.never')), 'info') + '</div>';
}
function hist() {
  const l = coinLog(); if (!l.length) return empty(t('shop.histEmpty'), 'coin');
  return '<div class="card"><div class="xplog" style="max-height:none">' + l.slice(0, 100).map(x => '<div><span class="muted">' + fmtDateTime(x.t) + ' · ' + esc(t('coins.reason.' + x.r, { n: x.l })) + (x.r === 'crate' ? ' (' + esc(t('crate.' + x.l)) + ')' : '') + '</span><b style="color:' + (x.n >= 0 ? 'var(--jade)' : 'var(--danger)') + '">' + (x.n >= 0 ? '+' : '') + fmt(x.n) + '</b></div>').join('') + '</div></div>';
}
function body(root) {
  seg($('#shopSeg', root), TABS.map(k => ({ id: k, label: t('shop.tab.' + k) })), tab, v => { tab = v; history.replaceState(null, '', '#/shop/' + v); body(root); });
  $('#shopBody', root).innerHTML = tab === 'crates' ? crates() : tab === 'inventory' ? invTab() : tab === 'arcade' ? arcade() : tab === 'earn' ? earn() : hist();
}
export default {
  title: () => t('nav.shop'),
  render() {
    return pageHead('Jade Shop', esc(t('shop.sub')), '<div class="shop-bal"><span class="muted small-note">' + esc(t('shop.balance')) + '</span><span class="chip" style="cursor:default;height:44px;font-size:18px"><span class="coin lg"></span><span data-coins>' + fmt(coins()) + '</span></span></div>') +
      '<div class="filters"><div class="seg" id="shopSeg" aria-label="Shop"></div></div><div id="shopBody"></div><p class="fine-print">' + esc(t('shop.noValue')) + '</p>';
  },
  mount(root, sub) {
    if (TABS.includes(sub[0])) tab = sub[0];
    body(root);
    let busy = false;
    root.addEventListener('click', async e => {
      const o = e.target.closest('[data-open]'); if (o) { tryOpen(o.dataset.open); return; }
      const od = e.target.closest('[data-odds]'); if (od) { odds(od.dataset.odds); return; }
      const eq = e.target.closest('[data-equip]'); if (eq) { equip(eq.dataset.equip); body(root); return; }
      const ex = e.target.closest('[data-ex]'); if (ex) { const d = +ex.dataset.ex; if (await confirmModal(d ? t('arcade.exConfirm', { n: d }) : t('arcade.exConfirmForever'))) { excludeArcade(d || null); body(root); } return; }
      if (busy) return;
      if (e.target.closest('[data-wheel]')) {
        const r = playWheel(); if (r.error) { toast(t(r.error)); return; } busy = true;
        const w = $('#wheel', root); const cur = +(w.dataset.rot || 0); const target = cur + 1440 + (360 - (r.idx * 45 + 22.5)) - (cur % 360) + (Math.random() * 24 - 12);
        w.dataset.rot = target; w.style.transform = 'rotate(' + target + 'deg)';
        setTimeout(() => { payout(r.win, 'wheel'); $('#wRes', root).innerHTML = r.win > 0 ? esc(t('arcade.won')) + ' <b>' + r.win + ' coins</b> (×' + String(r.m).replace('.', ',') + ')' : esc(t('arcade.lost')); r.win > 20 ? SFX.win() : r.win ? SFX.coin() : SFX.lose(); busy = false; }, reduced() ? 50 : 3900);
        return;
      }
      const cf = e.target.closest('[data-cf]'); if (cf) {
        const r = playCoinflip(cf.dataset.cf); if (r.error) { toast(t(r.error)); return; } busy = true;
        const c = $('#cf', root); c.classList.remove('flip'); void c.offsetWidth; c.classList.add('flip');
        setTimeout(() => { payout(r.win, 'coinflip'); $('#cfRes', root).innerHTML = esc(t('arcade.' + r.res)) + ' — ' + (r.win ? esc(t('arcade.won')) + ' <b>+' + r.win + ' coins</b>' : esc(t('arcade.lost'))); r.win ? SFX.coin() : SFX.lose(); busy = false; }, reduced() ? 50 : 900);
        return;
      }
      const g = e.target.closest('[data-cell]'); if (g) {
        const r = playMystery(+g.dataset.cell); if (r.error) { toast(t(r.error)); return; }
        const cells = root.querySelectorAll('#g9 button'); cells.forEach((b, i) => { b.disabled = true; b.textContent = i === r.good ? '★' : '·'; b.classList.toggle('good', i === r.good); }); g.classList.add('picked');
        payout(r.win, 'mystery'); $('#gRes', root).innerHTML = r.win ? esc(t('arcade.found')) + ' <b>+' + r.win + ' coins</b>' : esc(t('arcade.wasCell', { n: r.good + 1 })); r.win ? SFX.win() : SFX.lose();
        setTimeout(() => { cells.forEach(b => { b.disabled = false; b.textContent = '?'; b.classList.remove('good', 'picked'); }); }, 1600);
      }
    });
  },
};
