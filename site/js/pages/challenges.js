// Défi de la semaine : scénario imposé, compte à rebours, classement, soumission de score.
import { $, esc } from '../core/dom.js';
import { t, C, fmt, fmtDate } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { toast, pop } from '../core/toast.js';
import { openModal } from '../core/modal.js';
import { challenge, nextMonday, weekKey, myEntries, saveEntry } from '../state/community.js';
import { me, profile } from '../state/account.js';
import { awardXP } from '../state/progress.js';
import { addCoins } from '../state/economy.js';
import { CHALLENGE_COINS } from '../data/game.js';
import { DEMO_BOARD } from '../data/demo.js';
import { getPlayer } from '../state/players.js';
import { pageHead, avatar } from '../components/ui.js';
import { playerLink } from '../components/minicard.js';
import { emblem } from '../components/emblem.js';
import { openAuth } from '../components/auth.js';

let timer = 0;
const ytId = u => { const m = String(u).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/); return m ? m[1] : null; };
function board() {
  const l = DEMO_BOARD.map(([n, s, v]) => ({ n, s, v }));
  const u = me(); const e = myEntries()[weekKey()];
  if (u && e) l.push({ n: u.pseudo, s: e.score, v: e.video ? 'pending' : 'none', me: true });
  l.sort((a, b) => b.s - a.s);
  return l.map((x, i) => ({ ...x, pos: i + 1, v: i < 3 ? (x.v === 'none' ? 'required' : x.v) : 'notreq' }));
}
function cd() { let ms = nextMonday() - new Date(); const D = Math.floor(ms / 864e5); ms %= 864e5; const H = Math.floor(ms / 36e5); ms %= 36e5; const M = Math.floor(ms / 6e4); return [[D, t('unit.days')], [H, t('unit.hours')], [M, t('unit.minutes')]].map(x => '<div><b>' + String(x[0]).padStart(2, '0') + '</b><span>' + esc(x[1]) + '</span></div>').join(''); }
function coinsFor(pos) { return CHALLENGE_COINS.find(([max]) => pos <= max)[1]; }
function boardHTML() {
  const l = board(); const top = l.slice(0, 3);
  const vid = { ok: ['badge ok', 'challenge.v.ok'], pending: ['badge', 'challenge.v.pending'], required: ['badge no', 'challenge.v.required'], notreq: ['badge', 'challenge.v.notreq'] };
  return '<div class="podium">' + [top[1], top[0], top[2]].filter(Boolean).map(x => { const p = getPlayer(x.n) || { pseudo: x.n, style: {} }; return '<div class="pod pod-' + x.pos + '">' + avatar(p, x.pos === 1 ? 64 : 52) + '<b>' + playerLink(x.n) + '</b><span class="pod-score">' + fmt(x.s) + '</span><span class="pod-n">' + x.pos + '</span></div>'; }).join('') + '</div>' +
    '<div class="table-wrap"><table><thead><tr><th>#</th><th>' + esc(t('challenge.player')) + '</th><th>' + esc(t('challenge.score')) + '</th><th>' + esc(t('challenge.video')) + '</th><th>' + esc(t('challenge.reward')) + '</th></tr></thead><tbody>' +
    l.map(x => { const p = getPlayer(x.n); return '<tr class="' + (x.me ? 'me' : '') + '"><td class="rank-n">' + x.pos + '</td><td><span class="row-flex" style="gap:8px">' + (p && p.rank ? emblem(p.rank.index, { size: 20 }) : '') + playerLink(x.n) + (x.me ? ' <span class="tag jade">' + esc(t('common.you')) + '</span>' : '') + '</span></td><td><b>' + fmt(x.s) + '</b></td><td><span class="' + vid[x.v][0] + '">' + esc(t(vid[x.v][1])) + '</span></td><td><span class="row-flex" style="gap:6px"><span class="coin"></span>' + coinsFor(x.pos) + '</span></td></tr>'; }).join('') + '</tbody></table></div>';
}
function submit(root) {
  if (!me()) { openAuth('up'); return; }
  const wk = weekKey(); const prev = myEntries()[wk];
  const { el, close } = openModal('<h2>' + esc(t('challenge.submit')) + '</h2><p class="lead">' + esc(t('challenge.submitSub')) + '</p><div class="field"><label for="chScore">' + esc(t('challenge.yourScore')) + '</label><input type="number" id="chScore" min="0" step="1" value="' + (prev ? prev.score : '') + '"></div><div class="field"><label for="chVid">' + esc(t('challenge.videoLink')) + '</label><input type="url" id="chVid" placeholder="https://youtu.be/..." value="' + esc(prev ? prev.video || '' : '') + '"></div><p class="error" id="chErr"></p><button class="btn primary block" id="chGo">' + esc(t('challenge.send')) + '</button><p class="inline-note">' + esc(t('challenge.honest')) + '</p>', { width: '460px' });
  el.querySelector('#chGo').onclick = () => {
    const s = parseFloat(el.querySelector('#chScore').value), v = el.querySelector('#chVid').value.trim(), err = el.querySelector('#chErr');
    if (!(s > 0) || s > 100000) { err.textContent = t('challenge.errScore'); err.classList.add('show'); return; }
    if (v && !ytId(v)) { err.textContent = t('forum.err.video'); err.classList.add('show'); return; }
    if (prev && s < prev.score) { err.textContent = t('challenge.errLower', { n: fmt(prev.score) }); err.classList.add('show'); return; }
    saveEntry(wk, { score: s, video: v, t: Date.now() });
    const pos = board().find(x => x.me).pos;
    const aw = awardXP('challenge', wk, t('challenge.title'));
    if (aw) { const c = addCoins(coinsFor(pos), 'challenge', 'ch:' + wk, String(pos)); if (c) setTimeout(() => pop('+' + c + ' coins · ' + t('challenge.title'), 'coins'), 400); }
    close(); toast(t('challenge.sent', { pos })); $('#chBoard', root).innerHTML = boardHTML(); history(root);
  };
}
function history(root) {
  const e = Object.entries(myEntries()).sort((a, b) => b[1].t - a[1].t);
  $('#chHist', root).innerHTML = e.length ? '<div class="stack" style="--gap:8px">' + e.map(([wk, x]) => '<div class="row"><div class="lbl"><b>' + esc(t('challenge.weekOf', { d: fmtDate(x.t) })) + '</b><span>' + esc(t('challenge.score')) + ' : ' + fmt(x.score) + '</span></div>' + (x.video ? '<span class="badge">' + esc(t('challenge.v.pending')) + '</span>' : '') + '</div>').join('') + '</div>' : '<p class="muted">' + esc(t('challenge.noHistory')) + '</p>';
}
export default {
  title: () => t('nav.challenges'),
  render() {
    const ch = { ...C('challenge'), ...Object.fromEntries(Object.entries(challenge()).filter(([, v]) => v)) };
    return pageHead(esc(t('nav.challenges')), esc(t('challenge.sub'))) +
      '<div class="challenge-grid"><div class="card ch-main"><span class="tag jade">' + ic('calendar') + esc(t('challenge.current')) + '</span><h2 style="margin-top:14px">' + esc(ch.title) + '</h2>' +
      '<div class="ch-scen"><div><span class="muted small-note">Kovaak\'s</span><b>' + esc(ch.scen) + '</b></div><div><span class="muted small-note">Aim Lab</span><b>' + esc(ch.scenAim) + '</b></div></div>' +
      '<p class="muted">' + esc(ch.desc) + '</p><div class="countdown" id="chCd" aria-live="polite">' + cd() + '</div>' +
      '<p><b>' + esc(t('challenge.prize')) + ' :</b> <span class="muted">' + esc(ch.prize) + '</span></p>' +
      '<div class="row-flex" style="margin-top:18px"><button class="btn primary" id="chSubmit">' + ic('upload') + esc(t('challenge.submit')) + '</button><a class="btn" href="#/forum">' + esc(t('challenge.runs')) + '</a></div></div>' +
      '<div class="card"><h3>' + esc(t('challenge.rewards')) + '</h3><p class="muted small-note" style="margin-bottom:10px">' + esc(t('challenge.rewardsSub')) + '</p><div class="stack" style="--gap:6px">' + [['1', 300], ['2 – 3', 250], ['4 – 10', 200], ['11 – 25', 150], ['26+', 100]].map(([p, c]) => '<div class="row"><div class="lbl"><b>' + esc(t('challenge.place', { p })) + '</b></div><span class="row-flex" style="gap:6px"><span class="coin"></span><b>' + c + '</b> + 250 XP</span></div>').join('') + '</div></div></div>' +
      '<div class="section"><div class="section-head"><h3>' + esc(t('challenge.board')) + ' <span class="tag outline">' + esc(t('common.example')) + '</span></h3></div><div class="card" id="chBoard">' + boardHTML() + '</div></div>' +
      '<div class="section grid-2"><div class="card"><h3>' + esc(t('challenge.rules')) + '</h3><ul class="rules">' + [1, 2, 3, 4].map(i => '<li>' + esc(t('challenge.rule' + i)) + '</li>').join('') + '</ul><a class="btn small" href="#/legal/challenges">' + esc(t('challenge.fullRules')) + '</a></div><div class="card"><h3>' + esc(t('challenge.history')) + '</h3><div id="chHist"></div></div></div>';
  },
  mount(root) {
    timer = setInterval(() => { const el = $('#chCd', root); if (el) el.innerHTML = cd(); }, 30000);
    $('#chSubmit', root).onclick = () => submit(root);
    history(root);
  },
  unmount() { clearInterval(timer); },
};
export { ytId };
