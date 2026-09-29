// App : « PC & jeux ». Scan du matériel, optimisations Windows appliquées pour de vrai (et réversibles),
// graphismes CS2 / Valorant réglés avec un curseur Performance ↔ Équilibré ↔ Qualité.
import { $, esc } from '../core/dom.js';
import { t } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { toast } from '../core/toast.js';
import { us } from '../core/store.js';
import { N, isApp } from '../core/native.js';
import { pageHead } from '../components/ui.js';

const TW = ['gameMode', 'gameDvr', 'mouseAccel', 'powerPlan', 'backgroundApps', 'visualFx', 'hags'];
const GAMES = [['cs2', 'CS2'], ['valorant', 'VALORANT']];
let hw = null, opt = null, gs = null;
const tierOf = s => (s >= 80 ? 'high' : s >= 55 ? 'mid' : 'low');
const levelOf = v => (v < 34 ? 'perf' : v < 67 ? 'bal' : 'qual');
function hwCard() {
  if (!hw) return '<div class="card pc-hw skeleton"><p class="muted">' + esc(t('pc.scanning')) + '</p></div>';
  const row = (i, k, v) => v ? '<div class="pc-spec">' + ic(i) + '<div><small>' + esc(t('pc.' + k)) + '</small><b>' + esc(v) + '</b></div></div>' : '';
  const circ = 2 * Math.PI * 52;
  return '<div class="card pc-hw"><div class="pc-gauge"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="bg"/><circle cx="60" cy="60" r="52" class="fg" style="stroke-dasharray:' + circ + ';stroke-dashoffset:' + (circ * (1 - hw.score / 100)) + '"/></svg><div><b>' + hw.score + '</b><small>/ 100</small></div></div>' +
    '<div class="pc-specs"><h3>' + esc(t('pc.tier.' + tierOf(hw.score))) + '</h3><p class="muted small-note">' + esc(t('pc.tierSub')) + '</p><div class="pc-grid">' +
    row('gpu', 'gpu', hw.gpu + (hw.vramGB ? ' · ' + hw.vramGB + ' Go' : '')) + row('cpu', 'cpu', hw.cpu + (hw.threads ? ' · ' + hw.threads + ' threads' : '')) + row('layers', 'ram', hw.ramGB + ' Go') + row('monitor', 'screen', (hw.res || '') + (hw.hz ? ' · ' + hw.hz + ' Hz' : '')) +
    '</div><button class="btn small ghost" id="pcRescan">' + ic('search') + esc(t('pc.rescan')) + '</button></div></div>';
}
function optCard() {
  const st = opt && opt.tweaks;
  return '<div class="section"><div class="section-head"><h3>' + ic('bolt') + esc(t('pc.optTitle')) + '</h3><span class="muted small-note">' + esc(t('pc.optSub')) + '</span></div><div class="pc-tweaks">' +
    TW.map(id => { const s = st ? st[id] : null; return '<div class="card pc-tw' + (s && s.on ? ' on' : '') + '"><div><b>' + esc(t('pc.tw.' + id)) + '</b><p class="muted small-note">' + esc(t('pc.tw.' + id + '.sub')) + '</p><div class="tags">' + (s && s.admin ? '<span class="tag outline">' + ic('shield') + esc(t('pc.admin')) + '</span>' : '') + (s && s.reboot ? '<span class="tag warn">' + esc(t('pc.reboot')) + '</span>' : '') + (s && s.relog ? '<span class="tag outline">' + esc(t('pc.relog')) + '</span>' : '') + '</div></div><button class="toggle" data-tw="' + id + '" aria-pressed="' + !!(s && s.on) + '"' + (st ? '' : ' disabled') + ' aria-label="' + esc(t('pc.tw.' + id)) + '"></button></div>'; }).join('') +
    '</div><p class="inline-note">' + esc(t('pc.optNote')) + '</p></div>';
}
function gameCard([id, name]) {
  const s = gs && gs[id]; const v = us.get('gfx:' + id, hw ? hw.recommended : 50);
  const state = !s ? t('pc.checking') : !s.found ? t('pc.notFound') : s.running ? t('pc.running') : t('pc.ready');
  return '<div class="card pc-game"><div class="pc-game-head"><span class="glogo g-' + id + '">' + name + '</span><span class="tag ' + (s && s.found && !s.running ? 'jade' : 'outline') + '">' + esc(state) + '</span></div>' +
    '<div class="gfx"><input type="range" min="0" max="100" step="1" value="' + v + '" data-gfx="' + id + '" aria-label="' + esc(t('pc.gfx')) + '" style="--v:' + v + '%">' +
    (hw ? '<i class="gfx-rec" style="left:' + hw.recommended + '%" title="' + esc(t('pc.recommended')) + '"></i>' : '') +
    '<div class="gfx-labels"><span>' + esc(t('pc.perf')) + '</span><span>' + esc(t('pc.bal')) + '</span><span>' + esc(t('pc.qual')) + '</span></div></div>' +
    '<p class="gfx-now">' + ic('sliders') + '<b data-gfxlabel="' + id + '">' + esc(t('pc.lv.' + levelOf(v))) + '</b><span class="muted small-note">' + esc(t('pc.lvSub.' + levelOf(v))) + '</span></p>' +
    '<div class="row-flex"><button class="btn primary small" data-apply="' + id + '"' + (s && s.found ? '' : ' disabled') + '>' + ic('check') + esc(t('pc.apply')) + '</button><button class="btn small ghost" data-restore="' + id + '"' + (s && s.found ? '' : ' disabled') + '>' + esc(t('pc.restore')) + '</button>' + (hw ? '<button class="btn small ghost" data-rec="' + id + '">' + ic('sparkles') + esc(t('pc.useRec')) + '</button>' : '') + '</div>' +
    (id === 'valorant' ? '<p class="inline-note">' + esc(t('pc.valNote')) + '</p>' : '') + '</div>';
}
function paint(root) {
  $('#pcBody', root).innerHTML = hwCard() + optCard() + '<div class="section"><div class="section-head"><h3>' + ic('monitor') + esc(t('pc.gfxTitle')) + '</h3><span class="muted small-note">' + esc(t('pc.gfxSub')) + '</span></div><div class="grid-2">' + GAMES.map(gameCard).join('') + '</div></div>';
}
async function load(root) {
  paint(root);
  [hw, opt, gs] = await Promise.all([N.scan(), N.optStatus(), N.gameStatus()]);
  paint(root);
}
export default {
  title: () => t('nav.pc'),
  render() {
    const head = pageHead(esc(t('nav.pc')), esc(t('pc.sub')));
    if (!isApp) return head + '<div class="card center" style="max-width:560px;margin:20px auto"><span class="big-ic">' + ic('device') + '</span><h3>' + esc(t('pc.appOnly')) + '</h3><p class="muted" style="margin:8px 0 16px">' + esc(t('pc.appOnlySub')) + '</p><a class="btn primary" href="#/application">' + esc(t('nav.app')) + '</a></div>';
    return head + '<div id="pcBody"></div>';
  },
  mount(root) {
    if (!isApp) return;
    load(root);
    root.addEventListener('input', e => {
      const r = e.target.closest('[data-gfx]'); if (!r) return; const v = +r.value; r.style.setProperty('--v', v + '%');
      const lb = root.querySelector('[data-gfxlabel="' + r.dataset.gfx + '"]'); lb.textContent = t('pc.lv.' + levelOf(v)); lb.nextElementSibling.textContent = t('pc.lvSub.' + levelOf(v));
      us.set('gfx:' + r.dataset.gfx, v);
    });
    root.addEventListener('click', async e => {
      if (e.target.closest('#pcRescan')) { hw = null; paint(root); hw = await N.scan(); paint(root); return; }
      const tw = e.target.closest('[data-tw]'); if (tw && !tw.disabled) { tw.disabled = true; const on = tw.getAttribute('aria-pressed') !== 'true'; const r = await N.optSet(tw.dataset.tw, on); opt = await N.optStatus(); paint(root); toast(r && r.ok ? t(r.reboot ? 'pc.doneReboot' : r.relog ? 'pc.doneRelog' : 'pc.done') : t('pc.fail')); return; }
      const ap = e.target.closest('[data-apply]'); if (ap) { const g = ap.dataset.apply; const r = await N.gameApply(g, us.get('gfx:' + g, hw ? hw.recommended : 50)); toast(r && r.ok ? t('pc.applied', { n: r.changed }) : t('pc.err.' + ((r && r.error) || 'x'))); gs = await N.gameStatus(); paint(root); return; }
      const rs = e.target.closest('[data-restore]'); if (rs) { const r = await N.gameRestore(rs.dataset.restore); toast(r && r.ok ? t('pc.restored') : t('pc.err.' + ((r && r.error) || 'x'))); return; }
      const rc = e.target.closest('[data-rec]'); if (rc && hw) { us.set('gfx:' + rc.dataset.rec, hw.recommended); paint(root); }
    });
  },
};
