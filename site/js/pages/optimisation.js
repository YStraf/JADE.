// Optimisation : checklist détaillée par catégorie + convertisseur de sensibilité multi-jeux.
import { $, esc } from '../core/dom.js';
import { store } from '../core/store.js';
import { t, C, fmt } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { OPTI, GAMES_YAW } from '../data/opti.js';
import { pageHead, seg } from '../components/ui.js';

let cat = 'windows', impactF = 'all';
const done = () => store.get('opti2', {});
const all = () => OPTI.flatMap(c => c.tips.map(x => x.id));
function ring(pct) { const r = 34, c = 2 * Math.PI * r; return '<svg class="ring" width="84" height="84" viewBox="0 0 84 84" aria-hidden="true"><circle cx="42" cy="42" r="' + r + '" fill="none" stroke="var(--line)" stroke-width="8"/><circle cx="42" cy="42" r="' + r + '" fill="none" stroke="var(--jade)" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + (c * (1 - pct / 100)) + '" transform="rotate(-90 42 42)"/><text x="42" y="47" text-anchor="middle" font-family="Chakra Petch" font-weight="700" font-size="17" fill="var(--text)">' + pct + '%</text></svg>'; }
function side(root) {
  const d = done(); const O = C('opti');
  const tot = all(), n = tot.filter(id => d[id]).length, pct = Math.round(n / tot.length * 100);
  $('#oScore', root).innerHTML = ring(pct) + '<div><b>' + esc(t('opti.score')) + '</b><p class="muted small-note">' + esc(t('opti.scoreSub', { n, total: tot.length })) + '</p></div>';
  $('#oCats', root).innerHTML = OPTI.map(c => { const k = c.tips.filter(x => d[x.id]).length; return '<button type="button" data-cat="' + c.id + '" aria-current="' + (c.id === cat) + '">' + ic(c.icon) + '<span style="flex:1">' + esc(O.cats[c.id].name) + '</span><small>' + k + '/' + c.tips.length + '</small></button>'; }).join('');
}
function tips(root) {
  const O = C('opti'); const d = done(); const c = OPTI.find(x => x.id === cat);
  const list = c.tips.filter(x => impactF === 'all' || x.impact === impactF);
  const n = c.tips.filter(x => d[x.id]).length;
  $('#oHead', root).innerHTML = '<div><h3>' + ic(c.icon) + esc(O.cats[cat].name) + '</h3><p class="muted">' + esc(O.cats[cat].desc) + '</p></div><div class="o-prog"><span class="muted small-note">' + esc(t('opti.done', { n, total: c.tips.length })) + '</span><div class="bar"><i style="width:' + (n / c.tips.length * 100) + '%"></i></div></div>';
  $('#oList', root).innerHTML = list.map(x => { const tx = O.tips[x.id] || {}; return '<details class="tip' + (d[x.id] ? ' is-done' : '') + '" id="tip-' + x.id + '"><summary><label class="tip-check" onclick="event.stopPropagation()"><input type="checkbox" data-tip="' + x.id + '"' + (d[x.id] ? ' checked' : '') + ' aria-label="' + esc(t('opti.markDone')) + '"></label><div class="tip-main"><b>' + esc(tx.t) + '</b><span class="muted">' + esc(tx.w) + '</span></div><div class="tip-tags"><span class="tag imp-' + x.impact + '">' + esc(O.impact[x.impact]) + '</span><span class="tag">' + esc(O.diff[x.diff]) + '</span></div></summary><div class="tip-how">' + ic('info') + '<p>' + esc(tx.how) + '</p></div></details>'; }).join('');
}
function conv(root) {
  const from = $('#cvFrom', root).value, to = $('#cvTo', root).value, s = parseFloat($('#cvSens', root).value), dpi = parseFloat($('#cvDpi', root).value), res = $('#cvRes', root).value;
  const O = C('opti').converter;
  $('#cvNote', root).textContent = res.startsWith('4:3s') ? O.stretchNote : O.resNote;
  $('#cvToLabel', root).textContent = t('conv.equiv', { game: O.games[to] });
  if (!(s > 0)) { ['cvOut', 'cvEdpi', 'cvCm'].forEach(i => $('#' + i, root).textContent = '–'); return; }
  const out = s * GAMES_YAW[from] / GAMES_YAW[to];
  $('#cvOut', root).textContent = fmt(out, out < 1 ? 3 : 2);
  $('#cvEdpi', root).textContent = dpi > 0 ? fmt(Math.round(s * dpi)) : '–';
  $('#cvCm', root).textContent = dpi > 0 ? fmt(360 / (s * GAMES_YAW[from] * dpi) * 2.54, 1) + ' cm' : '–';
  store.set('conv', { from, to, s, dpi, res });
}
export default {
  title: () => t('nav.optimisation'),
  render() {
    const O = C('opti'); const cv = store.get('conv', { from: 'cs2', to: 'valorant', s: 1.2, dpi: 800, res: '16:9' });
    const games = Object.keys(GAMES_YAW).map(g => '<option value="' + g + '">' + esc(O.converter.games[g]) + '</option>').join('');
    const RES = [['16:9', '1920 × 1080 (16:9)'], ['16:9b', '2560 × 1440 (16:9)'], ['16:9c', '1600 × 900 (16:9)'], ['16:10', '1680 × 1050 (16:10)'], ['5:4', '1280 × 1024 (5:4)'], ['4:3s', '1440 × 1080 (' + t('conv.stretched') + ')'], ['4:3s2', '1280 × 960 (' + t('conv.stretched') + ')'], ['4:3s3', '1024 × 768 (' + t('conv.stretched') + ')'], ['4:3b', '1280 × 960 (' + t('conv.bars') + ')']];
    return pageHead(esc(t('nav.optimisation')), esc(t('opti.sub')), '<a class="btn small" href="#opti-conv" data-scroll="convCard">' + ic('mouse') + esc(t('conv.title')) + '</a>') +
      '<div class="tabs-layout opti"><aside class="vnav"><div class="vhead o-score" id="oScore"></div><div id="oCats"></div></aside>' +
      '<div><div class="o-head" id="oHead"></div><div class="filters" style="margin:14px 0"><div class="seg" id="impSeg" aria-label="' + esc(t('opti.impact')) + '"></div></div><div class="tips" id="oList"></div></div></div>' +
      '<div class="section card conv" id="convCard"><div class="section-head"><div><h3>' + ic('mouse') + esc(t('conv.title')) + '</h3><p class="muted">' + esc(t('conv.sub')) + '</p></div></div><div class="conv-grid">' +
      '<label class="field"><span class="label">' + esc(t('conv.from')) + '</span><select id="cvFrom">' + games + '</select></label>' +
      '<label class="field"><span class="label">' + esc(t('conv.to')) + '</span><select id="cvTo">' + games + '</select></label>' +
      '<label class="field"><span class="label">' + esc(t('conv.sens')) + '</span><input type="number" id="cvSens" step="0.01" min="0" value="' + cv.s + '"></label>' +
      '<label class="field"><span class="label">DPI</span><input type="number" id="cvDpi" step="50" min="0" value="' + cv.dpi + '"></label>' +
      '<label class="field"><span class="label">' + esc(t('conv.res')) + '</span><select id="cvRes">' + RES.map(r => '<option value="' + r[0] + '">' + esc(r[1]) + '</option>').join('') + '</select></label></div>' +
      '<div class="conv-out"><div><span class="muted small-note" id="cvToLabel"></span><div class="result" id="cvOut">–</div></div><div><span class="muted small-note">eDPI</span><div class="result sm" id="cvEdpi">–</div></div><div><span class="muted small-note">cm/360</span><div class="result sm" id="cvCm">–</div></div></div>' +
      '<p class="inline-note" id="cvNote"></p></div>' +
      '<div class="section card app-teaser"><div><h3>' + ic('device') + esc(t('opti.appTitle')) + '</h3><p class="muted">' + esc(t('opti.appText')) + '</p></div><a class="btn small" href="#/application">' + esc(t('nav.app')) + '</a></div>';
  },
  mount(root, sub) {
    if (sub[0] && OPTI.find(c => c.id === sub[0])) cat = sub[0];
    const cv = store.get('conv', { from: 'cs2', to: 'valorant', res: '16:9' });
    $('#cvFrom', root).value = cv.from; $('#cvTo', root).value = cv.to; $('#cvRes', root).value = cv.res || '16:9';
    const O = C('opti');
    const draw = () => { side(root); seg($('#impSeg', root), [{ id: 'all', label: t('opti.all') }, { id: 'high', label: O.impact.high }, { id: 'med', label: O.impact.med }, { id: 'low', label: O.impact.low }], impactF, v => { impactF = v; draw(); }); tips(root); };
    draw();
    if (sub[1]) setTimeout(() => { const el = $('#tip-' + sub[1], root); if (el) { el.open = true; el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('flash'); } }, 120);
    root.addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (b) { cat = b.dataset.cat; impactF = 'all'; draw(); } const s = e.target.closest('[data-scroll]'); if (s) { e.preventDefault(); $('#' + s.dataset.scroll, root).scrollIntoView({ behavior: 'smooth' }); } });
    root.addEventListener('change', e => { const c = e.target.closest('[data-tip]'); if (c) { const d = done(); d[c.dataset.tip] = c.checked; store.set('opti2', d); c.closest('.tip').classList.toggle('is-done', c.checked); side(root); const cc = OPTI.find(x => x.id === cat); const n = cc.tips.filter(x => d[x.id]).length; $('#oHead .o-prog', root).innerHTML = '<span class="muted small-note">' + esc(t('opti.done', { n, total: cc.tips.length })) + '</span><div class="bar"><i style="width:' + (n / cc.tips.length * 100) + '%"></i></div>'; } });
    ['cvFrom', 'cvTo', 'cvSens', 'cvDpi', 'cvRes'].forEach(i => $('#' + i, root).addEventListener('input', () => conv(root)));
    conv(root);
  },
};
