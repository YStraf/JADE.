// Intro animée au premier chargement de la session (désactivée en mouvement réduit).
import { $, esc } from '../core/dom.js';
import { session } from '../core/store.js';
import { t } from '../core/i18n.js';
import { reduced } from '../core/motion.js';
let running = false, raf = 0;
function jade() { return getComputedStyle(document.documentElement).getPropertyValue('--jade').trim() || '#2EE88A'; }
function line() { return getComputedStyle(document.documentElement).getPropertyValue('--line').trim() || '#1F2A24'; }
function play() {
  const intro = $('#intro'), cv = $('#introCanvas'), word = $('#introWord'), term = $('#term');
  $('#introSub').textContent = t('intro.sub'); $('#enterBtn').textContent = t('intro.enter'); $('#skipBtn').textContent = t('intro.skip');
  intro.classList.remove('hidden', 'leaving'); document.body.classList.add('intro-on'); running = true;
  const ctx = cv.getContext('2d'); let dots = [], rings = [], tt = 0;
  const size = () => { const r = devicePixelRatio || 1; cv.width = innerWidth * r; cv.height = innerHeight * r; cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; ctx.setTransform(r, 0, 0, r, 0, 0); };
  size(); addEventListener('resize', () => running && size());
  for (let i = 0; i < 46; i++) dots.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.8 + .6 });
  const frame = () => {
    if (!running) return; const w = innerWidth, h = innerHeight; tt += .006; ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = line(); ctx.lineWidth = 1; const g = 54, off = (tt * 18) % g;
    for (let x = -g + off; x < w + g; x += g) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = -g + off; y < h + g; y += g) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    const c = jade(); ctx.fillStyle = c;
    dots.forEach(d => { d.x += d.vx; d.y += d.vy; if (d.x < 0) d.x = w; if (d.x > w) d.x = 0; if (d.y < 0) d.y = h; if (d.y > h) d.y = 0; ctx.globalAlpha = .35; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 7); ctx.fill(); });
    if (Math.random() < .02) rings.push({ x: Math.random() * w, y: Math.random() * h, r: 4, a: .55 });
    rings = rings.filter(r => r.a > 0); ctx.strokeStyle = c; ctx.lineWidth = 2;
    rings.forEach(r => { r.r += 1.5; r.a -= .008; ctx.globalAlpha = Math.max(r.a, 0); ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(r.x - r.r - 6, r.y); ctx.lineTo(r.x - r.r + 2, r.y); ctx.moveTo(r.x + r.r - 2, r.y); ctx.lineTo(r.x + r.r + 6, r.y); ctx.stroke(); });
    ctx.globalAlpha = 1; raf = requestAnimationFrame(frame);
  };
  const letters = () => { word.innerHTML = [...'JADE.'].map((ch, i) => '<span style="animation-delay:' + (i * 90) + 'ms;' + (ch === '.' ? 'color:var(--jade)' : '') + '">' + ch + '</span>').join(''); };
  const lines = [['jade --start', ''], [t('intro.l1'), 'ok'], [t('intro.l2'), 'ok'], [t('intro.l3'), 'ok']];
  const typeLines = () => { let html = '', i = 0; (function next() { if (i >= lines.length || !running) { letters(); return; } const [l, ok] = lines[i]; let j = 0; (function ch() { if (!running) return; term.innerHTML = html + '&gt; ' + esc(l.slice(0, ++j)) + (j < l.length ? '<span class="caret"></span>' : ''); if (j < l.length) setTimeout(ch, 20); else { html += '&gt; ' + esc(l) + (ok ? ' <span class="ok">' + ok + '</span>' : '') + '\n'; term.innerHTML = html; i++; setTimeout(next, 120); } })(); })(); };
  if (reduced()) { letters(); term.textContent = '> jade --start'; } else { frame(); typeLines(); }
  setTimeout(() => $('#enterBtn').focus({ preventScroll: true }), 50);
}
function enter() {
  const intro = $('#intro'); if (intro.classList.contains('hidden') || intro.classList.contains('leaving')) return;
  intro.classList.add('leaving'); document.body.classList.remove('intro-on'); document.body.classList.add('entered');
  session.set('seenIntro', true);
  setTimeout(() => { intro.classList.add('hidden'); running = false; cancelAnimationFrame(raf); }, reduced() ? 0 : 800);
}
export function initIntro() {
  $('#enterBtn').onclick = enter; $('#skipBtn').onclick = enter;
  addEventListener('keydown', e => { if (!$('#intro').classList.contains('hidden') && ['Enter', ' ', 'Escape'].includes(e.key)) { e.preventDefault(); enter(); } });
  if (!session.get('seenIntro', false)) play();
}
export function replayIntro() { play(); }
