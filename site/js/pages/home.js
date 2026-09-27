// Accueil : présentation, tableau de bord personnel, mini-test, accès rapides.
import { $, esc } from '../core/dom.js';
import { store, us } from '../core/store.js';
import { t, fmt } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { me } from '../state/account.js';
import { level, myRank, streakInfo, runs } from '../state/progress.js';
import { coins } from '../state/economy.js';
import { challenge, nextMonday } from '../state/community.js';
import { emblem } from '../components/emblem.js';
import { rankLabel } from '../components/minicard.js';
import { crateArt } from '../components/crate-art.js';
import { C } from '../core/i18n.js';

let timer = 0, raf = 0;
function dash() {
  const u = me(); const L = level(); const r = myRank(); const st = streakInfo();
  if (!u) return '<div class="card dash-guest"><div><h3>' + esc(t('home.guest.title')) + '</h3><p class="muted">' + esc(t('home.guest.text')) + '</p></div><div class="row-flex"><button class="btn primary" data-auth="up">' + esc(t('auth.signup')) + '</button><button class="btn" data-auth="in">' + esc(t('auth.signin')) + '</button></div></div>';
  return '<div class="dash">' +
    '<a class="dash-tile" href="#/rangs">' + (r ? emblem(r.index, { size: 54, div: r.div }) : '<span class="dash-ic">' + ic('rank') + '</span>') + '<div><span>' + esc(t('rank.label')) + '</span><b style="color:' + (r ? r.c : 'inherit') + '">' + esc(rankLabel(r)) + '</b><small>' + (r ? (r.next ? fmt(r.toNext) + ' ' + esc(t('rank.ptsToNext')) : esc(t('rank.max'))) : esc(t('rank.doTests'))) + '</small></div></a>' +
    '<a class="dash-tile" href="#/pass"><span class="dash-lvl">' + L.lvl + '</span><div><span>' + esc(t('xp.level')) + '</span><b>' + fmt(L.into) + ' / ' + fmt(L.need) + ' XP</b><div class="bar"><i style="width:' + L.pct + '%"></i></div></div></a>' +
    '<a class="dash-tile" href="#/progression"><span class="dash-ic fire">' + ic('fire') + '</span><div><span>' + esc(t('stats.streak')) + '</span><b>' + st.n + ' ' + esc(t('unit.days')) + '</b><small>' + fmt(runs().length) + ' ' + esc(t('stats.sessionsLower')) + '</small></div></a>' +
    '<a class="dash-tile" href="#/shop"><span class="coin lg"></span><div><span>Jade Coins</span><b data-coins>' + fmt(coins()) + '</b><small>' + esc(t('home.openCrate')) + '</small></div></a>' +
    '</div>';
}
function cd() { let ms = nextMonday() - new Date(); const D = Math.floor(ms / 864e5); ms %= 864e5; const H = Math.floor(ms / 36e5); ms %= 36e5; const M = Math.floor(ms / 6e4); return [[D, t('unit.d')], [H, t('unit.h')], [M, t('unit.min')]].map(x => '<div><b>' + String(x[0]).padStart(2, '0') + '</b><span>' + esc(x[1]) + '</span></div>').join(''); }
export default {
  title: () => t('nav.home'),
  render() {
    const ch = { ...C('challenge'), ...challenge() };
    const best = store.get('best', null);
    const quick = [['routines', 'routine'], ['tests', 'target'], ['rangs', 'rank'], ['optimisation', 'sliders'], ['defis', 'trophy'], ['shop', 'bag']];
    return '<section class="hero"><div class="hero-txt"><span class="eyebrow">' + esc(t('home.eyebrow')) + '</span><h1>' + t('home.h1') + '</h1><p class="lead">' + esc(t('home.lead')) + '</p><div class="row-flex"><a class="btn primary" href="#/routines">' + ic('play') + esc(t('home.cta1')) + '</a><a class="btn" href="#/tests">' + esc(t('home.cta2')) + '</a></div></div>' +
      '<div class="hero-test"><div class="arena" id="arena" aria-label="' + esc(t('home.mini.label')) + '"><div class="hud"><span id="hudHits">0 / 20</span><span id="hudTime">0.00 s</span></div><div class="overlay" id="arenaOv"><div><div class="big">' + esc(t('home.mini.title')) + '</div><p class="muted" style="margin:8px 0 18px">' + esc(t('home.mini.text')) + '</p><button class="btn primary" id="arenaStart">' + esc(t('home.mini.start')) + '</button></div></div></div><p class="muted small-note">' + esc(t('home.mini.best')) + ' <b id="bestTime">' + (best ? best.toFixed(2) + ' s' : esc(t('common.none'))) + '</b></p></div></section>' +
      dash() +
      '<div class="section"><div class="section-head"><h3>' + esc(t('home.quick')) + '</h3><button class="btn small ghost" data-search>' + ic('search') + esc(t('search.open')) + ' <kbd>Ctrl K</kbd></button></div><div class="quick">' +
      quick.map(([r, i]) => { const k = { routines: 'routines', tests: 'tests', rangs: 'ranks', optimisation: 'optimisation', defis: 'challenges', shop: 'shop' }[r]; return '<a class="quick-card" href="#/' + r + '"><span class="q-ic">' + ic(i) + '</span><b>' + esc(t('nav.' + k)) + '</b><small>' + esc(t('nav.' + k + '.desc')) + '</small></a>'; }).join('') + '</div></div>' +
      '<div class="section band"><div class="card band-ch"><span class="tag jade">' + esc(t('challenge.current')) + '</span><h3>' + esc(ch.title) + '</h3><p class="muted">' + esc(t('challenge.scenario')) + ' ' + esc(ch.scen) + ' · Aim Lab : ' + esc(ch.scenAim) + '</p><div class="countdown" id="homeCd">' + cd() + '</div><a class="btn small primary" href="#/defis">' + esc(t('home.join')) + '</a></div>' +
      '<div class="card band-shop"><div class="band-art">' + crateArt('animated', { size: 150 }) + '</div><div><h3>' + esc(t('home.shop.title')) + '</h3><p class="muted">' + esc(t('home.shop.text')) + '</p><a class="btn small" href="#/shop">' + esc(t('nav.shop')) + '</a></div></div>' +
      '<div class="card band-sec"><span class="tag danger">' + ic('warn') + esc(t('home.alert')) + '</span><h3>' + esc(t('home.sec.title')) + '</h3><p class="muted">' + esc(t('home.sec.text')) + '</p><a class="btn small" href="#/securite">' + esc(t('home.sec.cta')) + '</a></div></div>';
  },
  mount(root) {
    timer = setInterval(() => { const el = $('#homeCd'); if (el) el.innerHTML = cd(); }, 30000);
    const arena = $('#arena', root), ov = $('#arenaOv', root), hH = $('#hudHits', root), hT = $('#hudTime', root);
    let hits = 0, miss = 0, t0 = 0, running = false; const N = 20;
    const spawn = () => { arena.querySelectorAll('.target').forEach(e => e.remove()); const b = document.createElement('button'); b.className = 'target'; b.type = 'button'; b.setAttribute('aria-label', t('test.target')); b.style.left = (8 + Math.random() * 84) + '%'; b.style.top = (16 + Math.random() * 76) + '%'; b.addEventListener('pointerdown', e => { e.stopPropagation(); hits++; hH.textContent = hits + ' / ' + N; hits >= N ? end() : spawn(); }); arena.appendChild(b); };
    const tick = () => { hT.textContent = ((performance.now() - t0) / 1000).toFixed(2) + ' s'; raf = requestAnimationFrame(tick); };
    const start = () => { hits = 0; miss = 0; running = true; ov.style.display = 'none'; hH.textContent = '0 / ' + N; t0 = performance.now(); spawn(); tick(); };
    const end = () => {
      running = false; cancelAnimationFrame(raf); arena.querySelectorAll('.target').forEach(e => e.remove());
      const tm = (performance.now() - t0) / 1000, acc = Math.round(N / (N + miss) * 100), pen = tm + miss * .25;
      let b = store.get('best', null), rec = false; if (!b || pen < b) { store.set('best', pen); b = pen; rec = true; }
      $('#bestTime', root).textContent = b.toFixed(2) + ' s';
      ov.innerHTML = '<div><div class="big">' + pen.toFixed(2) + ' s</div><div class="ov-stats"><div><b>' + acc + ' %</b><span class="muted">' + esc(t('test.accuracy')) + '</span></div><div><b>' + miss + '</b><span class="muted">' + esc(t('test.misses')) + '</span></div></div>' + (rec ? '<p class="rec">' + esc(t('test.newRecord')) + '</p>' : '') + '<div class="row-flex" style="justify-content:center"><button class="btn primary" id="again">' + esc(t('test.again')) + '</button><a class="btn" href="#/tests">' + esc(t('home.mini.more')) + '</a></div></div>';
      ov.style.display = 'grid'; $('#again', root).onclick = start;
    };
    arena.addEventListener('pointerdown', e => { if (running && !e.target.classList.contains('target')) miss++; });
    $('#arenaStart', root).onclick = start;
  },
  unmount() { clearInterval(timer); cancelAnimationFrame(raf); },
};
