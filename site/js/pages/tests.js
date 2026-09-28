// Tests d'aim jouables dans le navigateur (moteurs du prototype).
import { $, esc } from '../core/dom.js';
import { t, fmt } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { SFX } from '../core/sfx.js';
import { us } from '../core/store.js';
import { toast } from '../core/toast.js';
import { TESTS, norm, rankOf } from '../data/game.js';
import { bests, submitTest } from '../state/progress.js';
import { me } from '../state/account.js';
import { pageHead } from '../components/ui.js';
import { emblem } from '../components/emblem.js';
import { rankLabel } from '../components/minicard.js';

const ICON = { flick: 'target', precision: 'eye', reaction: 'bolt', tracking: 'mouse', switching: 'layers' };
let cur = null, engine = null;
export function fmtVal(k, v) { if (v == null) return '—'; const u = TESTS[k].unit; return u === 'ms' ? Math.round(v) + ' ms' : (u === '%' ? fmt(v, 1) + ' %' : fmt(v, 2) + ' s'); }
function skillBadge(k, v) { const n = norm(k, v); if (n == null) return '<span class="muted">' + esc(t('rank.unranked')) + '</span>'; const r = rankOf(Math.round(n * 10)); return '<span class="sk-rank">' + emblem(r.index, { size: 22 }) + '<span style="color:' + r.c + '">' + esc(rankLabel(r)) + '</span></span>'; }
function grid(root) {
  const b = bests();
  $('#tGrid', root).innerHTML = Object.keys(TESTS).map(k => '<button type="button" class="tcard" data-test="' + k + '" aria-pressed="' + (k === cur) + '"><span class="t-ic">' + ic(ICON[k]) + '</span><b>' + esc(t('test.' + k + '.name')) + '</b><span>' + esc(t('test.' + k + '.short')) + '</span><span class="best">' + esc(t('test.record')) + ' : ' + fmtVal(k, b[k]) + '</span></button>').join('');
  $('#tRecords', root).innerHTML = Object.keys(TESTS).map(k => '<div class="rec-row"><span>' + esc(t('test.' + k + '.name')) + '</span><b>' + fmtVal(k, b[k]) + '</b>' + skillBadge(k, b[k]) + '</div>').join('');
}
function pick(root, k) {
  stop(); cur = k; grid(root);
  $('#tTitle', root).textContent = k ? t('test.' + k + '.name') : t('test.choose');
  $('#tDesc', root).textContent = k ? t('test.' + k + '.desc') : t('test.select');
  $('#tHint', root).textContent = k ? t('test.' + k + '.hint') : '';
  $('#tStart', root).style.display = k ? '' : 'none';
  const ov = $('#tOv', root);
  ov.innerHTML = k ? '<button type="button" class="ov-start" data-start><span class="big">' + esc(t('test.' + k + '.name')) + '</span><span class="muted">' + esc(t('test.' + k + '.short')) + '</span><span class="press">' + ic('play') + esc(t('test.clickStart')) + '</span></button>' : '<div><p class="muted">' + esc(t('test.select')) + '</p></div>';
  ov.style.display = 'grid';
}
function stop() { if (engine) { engine(); engine = null; } }
// Petit viseur façon CS2 qui remplace le curseur dans la zone de test (souris uniquement).
function crosshair(arena) {
  const x = document.createElement('span'); x.className = 'xhair'; x.setAttribute('aria-hidden', 'true'); x.innerHTML = '<i></i><i></i><i></i><i></i><b></b>'; arena.appendChild(x);
  arena.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = arena.getBoundingClientRect(); x.style.transform = 'translate(' + (e.clientX - r.left) + 'px,' + (e.clientY - r.top) + 'px)'; arena.classList.add('aiming'); });
  arena.addEventListener('pointerleave', () => arena.classList.remove('aiming'));
}
function end(root, k, val, extra) {
  const res = submitTest(k, val); grid(root);
  const n = norm(k, val); const r = n == null ? null : rankOf(Math.round(n * 10));
  const ov = $('#tOv', root);
  ov.innerHTML = '<div><div class="big">' + fmtVal(k, val) + '</div><div class="ov-stats">' + (extra || '') + (r ? '<div>' + emblem(r.index, { size: 34 }) + '<span class="muted">' + esc(rankLabel(r)) + '</span></div>' : '') + '</div>' + (res.invalid ? '<p class="inline-note" style="color:var(--danger)">' + esc(t('test.invalid')) + '</p>' : res.better ? '<p class="rec">' + esc(t('test.newRecord')) + '</p>' : '') + (!me() ? '<p class="inline-note">' + esc(t('test.guest')) + '</p>' : '') + '<button class="btn primary" data-start>' + ic('play') + esc(t('test.again')) + '</button></div>';
  ov.style.display = 'grid'; if (res.better) SFX.enter();
}
// Compte à rebours 3-2-1 dans la zone, puis lancement.
function countdown(root) {
  const k = cur; if (!k) return; stop();
  const ov = $('#tOv', root); let n = 3, to = 0;
  const tick = () => { if (n === 0) { engine = null; run(root); return; } ov.innerHTML = '<div class="count">' + n + '</div>'; n--; to = setTimeout(tick, 650); };
  engine = () => clearTimeout(to); ov.style.display = 'grid'; tick();
}
function run(root) {
  const k = cur; if (!k) return; stop();
  const arena = $('#tArena', root), ov = $('#tOv', root), A = $('#tA', root), B = $('#tB', root);
  ov.style.display = 'none'; arena.querySelectorAll('.dot-target').forEach(e => e.remove());
  const W = () => arena.clientWidth, H = () => arena.clientHeight;
  let raf = 0, stopped = false, handlers = [], tos = [];
  const on = (el, ev, fn) => { el.addEventListener(ev, fn); handlers.push([el, ev, fn]); };
  const halt = () => { stopped = true; cancelAnimationFrame(raf); tos.forEach(clearTimeout); handlers.forEach(([el, ev, fn]) => el.removeEventListener(ev, fn)); arena.querySelectorAll('.dot-target').forEach(e => e.remove()); };
  engine = halt;
  const dot = (size, cls) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'dot-target' + (cls ? ' ' + cls : ''); b.style.width = b.style.height = size + 'px'; b.style.margin = (-size / 2) + 'px 0 0 ' + (-size / 2) + 'px'; b.setAttribute('aria-label', t('test.target')); arena.appendChild(b); return b; };
  const place = (b, size) => { b.style.left = (size / 2 + Math.random() * (W() - size)) + 'px'; b.style.top = (size / 2 + 20 + Math.random() * (H() - size - 40)) + 'px'; };
  const cfg = TESTS[k];
  if (k === 'flick' || k === 'precision') {
    let hits = 0, miss = 0; const t0 = performance.now(); A.textContent = '0 / ' + cfg.n;
    const b = dot(cfg.size); place(b, cfg.size);
    on(b, 'pointerdown', e => { e.stopPropagation(); hits++; A.textContent = hits + ' / ' + cfg.n; if (hits >= cfg.n) { const v = (performance.now() - t0) / 1000 + miss * cfg.pen; halt(); end(root, k, v, '<div><b>' + Math.round(cfg.n / (cfg.n + miss) * 100) + ' %</b><span class="muted">' + esc(t('test.accuracy')) + '</span></div><div><b>' + miss + '</b><span class="muted">' + esc(t('test.misses')) + '</span></div>'); } else place(b, cfg.size); });
    on(arena, 'pointerdown', e => { if (!e.target.classList.contains('dot-target')) miss++; });
    (function tick() { if (stopped) return; B.textContent = ((performance.now() - t0) / 1000).toFixed(2) + ' s'; raf = requestAnimationFrame(tick); })();
  } else if (k === 'reaction') {
    let i = 0, times = [], shown = 0, b = null; A.textContent = '0 / ' + cfg.n; B.textContent = '—';
    const next = () => { if (stopped) return; if (b) { b.remove(); b = null; } A.textContent = i + ' / ' + cfg.n;
      tos.push(setTimeout(() => { if (stopped) return; b = dot(56); b.style.left = '50%'; b.style.top = '52%'; shown = performance.now();
        b.addEventListener('pointerdown', e => { e.stopPropagation(); const ms = performance.now() - shown; times.push(ms); i++; B.textContent = Math.round(ms) + ' ms';
          if (i >= cfg.n) { const avg = times.reduce((a, c) => a + c, 0) / times.length; halt(); end(root, k, avg, '<div><b>' + Math.round(Math.min(...times)) + ' ms</b><span class="muted">' + esc(t('test.bestTry')) + '</span></div>'); } else next(); });
      }, 900 + Math.random() * 2100)); };
    on(arena, 'pointerdown', e => { if (!b && !e.target.classList.contains('dot-target')) { B.textContent = t('test.early'); tos.forEach(clearTimeout); tos = []; next(); } });
    next();
  } else if (k === 'tracking') {
    const size = cfg.size, dur = cfg.dur, b = dot(size); let onT = false, onTime = 0, last = performance.now(); const t0 = last; let x = W() / 2, y = H() / 2, ang = Math.random() * 6.28; const speed = W() * cfg.speed;
    on(b, 'pointerenter', () => onT = true); on(b, 'pointerleave', () => onT = false); on(arena, 'pointerleave', () => onT = false);
    (function tick(now) { if (stopped) return; const dt = now - last; last = now; ang += (Math.random() - .5) * cfg.turn; x += Math.cos(ang) * speed * dt; y += Math.sin(ang) * speed * dt * .6;
      if (x < size / 2) { x = size / 2; ang = Math.PI - ang; } if (x > W() - size / 2) { x = W() - size / 2; ang = Math.PI - ang; } if (y < size / 2 + 20) { y = size / 2 + 20; ang = -ang; } if (y > H() - size / 2) { y = H() - size / 2; ang = -ang; }
      b.style.left = x + 'px'; b.style.top = y + 'px'; if (onT) onTime += dt; const el = now - t0;
      A.textContent = Math.max(0, (dur - el) / 1000).toFixed(1) + ' s'; B.textContent = (onTime / Math.max(el, 1) * 100).toFixed(0) + ' %';
      if (el >= dur) { const pct = onTime / dur * 100; halt(); end(root, k, pct, '<div><b>' + (onTime / 1000).toFixed(1) + ' s</b><span class="muted">' + esc(t('test.onTarget')) + '</span></div>'); } else raf = requestAnimationFrame(tick); })(performance.now());
  } else if (k === 'switching') {
    let hits = 0, miss = 0; const t0 = performance.now(); A.textContent = '0 / ' + cfg.n;
    const a = dot(cfg.size), c = dot(cfg.size, 'alt'); a.style.left = '28%'; a.style.top = '52%'; c.style.left = '72%'; c.style.top = '52%';
    let active = a; active.classList.add('hot');
    const move = el => { el.style.left = (15 + Math.random() * 70) + '%'; el.style.top = (25 + Math.random() * 55) + '%'; };
    [a, c].forEach(el => on(el, 'pointerdown', e => { e.stopPropagation(); if (el !== active) { miss++; return; } hits++; A.textContent = hits + ' / ' + cfg.n; active.classList.remove('hot');
      if (hits >= cfg.n) { const v = (performance.now() - t0) / 1000 + miss * cfg.pen; halt(); end(root, k, v, '<div><b>' + miss + '</b><span class="muted">' + esc(t('test.errors')) + '</span></div>'); }
      else { active = active === a ? c : a; active.classList.add('hot'); move(active === a ? c : a); } }));
    on(arena, 'pointerdown', e => { if (!e.target.classList.contains('dot-target')) miss++; });
    (function tick() { if (stopped) return; B.textContent = ((performance.now() - t0) / 1000).toFixed(2) + ' s'; raf = requestAnimationFrame(tick); })();
  }
}
export default {
  title: () => t('nav.tests'),
  render() {
    return pageHead(esc(t('nav.tests')), esc(t('tests.sub')), '<a class="btn small" href="#/rangs">' + ic('rank') + esc(t('tests.seeRanks')) + '</a>') +
      '<div class="test-grid" id="tGrid"></div>' +
      '<div class="test-stage big-stage"><div class="arena test-arena" id="tArena" aria-label="' + esc(t('tests.zone')) + '"><div class="hud"><span id="tA">—</span><span id="tB">—</span></div><div class="overlay" id="tOv"></div></div>' +
      '<div class="test-info"><div class="card"><h3 id="tTitle"></h3><p class="muted" id="tDesc" style="margin-top:6px"></p><p class="muted small-note" id="tHint" style="margin-top:6px"></p><button class="btn primary" id="tStart" style="margin-top:14px">' + ic('play') + esc(t('test.start')) + '</button></div>' +
      '<div class="card"><h4 style="margin-bottom:8px">' + esc(t('test.records')) + '</h4><div class="rec-list" id="tRecords"></div><p class="inline-note">' + esc(t('tests.rankNote')) + '</p></div></div></div>';
  },
  mount(root, sub) {
    cur = TESTS[sub[0]] ? sub[0] : null; pick(root, cur); crosshair($('#tArena', root));
    if (us.get('testsReset', false)) { us.set('testsReset', false); toast(t('test.reset')); }
    root.addEventListener('click', e => {
      const c = e.target.closest('[data-test]'); if (c) { pick(root, c.dataset.test); return; }
      if (e.target.closest('[data-start]') || e.target.closest('#tStart')) { if (e.target.closest('#tStart')) $('#tArena', root).scrollIntoView({ block: 'center', behavior: 'smooth' }); countdown(root); }
    });
  },
  unmount() { stop(); },
};
