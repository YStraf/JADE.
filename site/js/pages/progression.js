// Ma progression : import des CSV Kovaak's, courbe, série, compétences.
import { $, esc } from '../core/dom.js';
import { t, fmt, fmtDate } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { toast } from '../core/toast.js';
import { confirmModal } from '../core/modal.js';
import { reduced } from '../core/motion.js';
import { runs, saveRuns, importFiles, streakInfo, bests } from '../state/progress.js';
import { skillOf, ROUTINES, routineTitle } from '../data/routines.js';
import { pageHead, countUp, empty } from '../components/ui.js';
import { isPlus } from '../state/premium.js';
import { TESTS, norm } from '../data/game.js';

let curScen = null;
const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
function chart(data) {
  const W = 760, H = 280, P = 44, ys = data.map(d => d.score), min = Math.min(...ys), max = Math.max(...ys), span = max - min || 1;
  const X = i => P + (data.length < 2 ? .5 : i / (data.length - 1)) * (W - P * 2), Y = v => H - P - ((v - min) / span) * (H - P * 2);
  let grid = ''; for (let g = 0; g <= 4; g++) { const v = min + span * g / 4, y = Y(v); grid += '<line x1="' + P + '" x2="' + (W - P) + '" y1="' + y + '" y2="' + y + '" stroke="var(--line)"/><text x="' + (P - 10) + '" y="' + (y + 4) + '" text-anchor="end" font-size="12" fill="var(--muted)">' + Math.round(v) + '</text>'; }
  const pts = data.map((d, i) => X(i).toFixed(1) + ',' + Y(d.score).toFixed(1)).join(' ');
  const area = 'M' + X(0) + ',' + (H - P) + ' L' + pts.split(' ').join(' L') + ' L' + X(data.length - 1) + ',' + (H - P) + ' Z';
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(t('prog.chartLabel')) + '"><defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--jade)" stop-opacity=".28"/><stop offset="1" stop-color="var(--jade)" stop-opacity="0"/></linearGradient></defs>' + grid + '<path d="' + area + '" fill="url(#pg)"/><polyline class="line" points="' + pts + '" fill="none" stroke="var(--jade)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' + data.map((d, i) => '<circle cx="' + X(i) + '" cy="' + Y(d.score) + '" r="4.5" fill="var(--jade)"><title>' + fmtDate(d.date) + ' : ' + Math.round(d.score) + '</title></circle>').join('') + '</svg>';
}
function weekDelta(rs) { const now = Date.now(), W = 6048e5; const c = rs.filter(r => r.date > now - W), p = rs.filter(r => r.date <= now - W && r.date > now - 2 * W); if (!c.length || !p.length) return null; const avg = a => a.reduce((s, r) => s + r.score, 0) / a.length; const a = avg(c), b = avg(p); return (a - b) / b * 100; }
// Jade+ : analyse des points faibles à partir des records aux tests, et routines conseillées pour la semaine.
function analysis() {
  const b = bests(); const sc = Object.keys(TESTS).map(k => [k, norm(k, b[k])]).filter(x => x[1] != null).sort((x, y) => x[1] - y[1]);
  const head = '<div class="section-head"><h3>' + ic('sparkles') + esc(t('ana.title')) + ' <span class="tag plus-tag">Jade+</span></h3></div>';
  if (!isPlus()) return head + '<div class="card ana-lock"><div class="ana-blur" aria-hidden="true">' + ['flick', 'tracking', 'reaction'].map((k, i) => '<div class="li"><span>' + esc(t('test.' + k + '.name')) + '</span><div class="bar"><i style="width:' + (35 + i * 20) + '%"></i></div></div>').join('') + '</div><div class="ana-cta"><b>' + esc(t('ana.lockTitle')) + '</b><p class="muted">' + esc(t('ana.lockText')) + '</p><a class="btn primary small" href="#/formules">' + ic('sparkles') + esc(t('pr.plus.cta')) + '</a></div></div>';
  if (sc.length < 2) return head + '<div class="card"><p class="muted">' + esc(t('ana.needTests')) + '</p><a class="btn small" href="#/tests">' + esc(t('nav.tests')) + '</a></div>';
  const weak = sc.slice(0, 2);
  const recs = weak.map(([k]) => ROUTINES.find(r => (r.types || []).includes(TESTS[k].skill))).filter(Boolean);
  return head + '<div class="card ana"><div class="ana-bars">' + sc.map(([k, v]) => '<div class="li' + (weak.some(w => w[0] === k) ? ' weak' : '') + '"><span>' + esc(t('test.' + k + '.name')) + '</span><div class="bar"><i style="width:' + Math.round(v) + '%"></i></div><b>' + Math.round(v) + '</b></div>').join('') + '</div>' +
    '<div><p>' + esc(t('ana.weak', { a: t('test.' + weak[0][0] + '.name'), b: t('test.' + weak[1][0] + '.name') })) + '</p><div class="ana-recs">' + [...new Set(recs)].map(r => '<a class="chip-btn" href="#/routines/' + esc(r.id) + '">' + ic('routine') + esc(routineTitle(r)) + '</a>').join('') + '</div><p class="inline-note">' + esc(t('ana.note')) + '</p></div></div>';
}
function paint(root) {
  const ana = $('#pAna', root); if (ana) ana.innerHTML = analysis();
  const rs = runs(); const out = $('#pOut', root); const st = streakInfo();
  $('#pStreak', root).innerHTML = '<div class="streak-n">' + st.n + '</div><div><b>' + esc(t('prog.streak')) + '</b><div class="week">' + st.week.map(d => '<span class="' + (d.on ? 'on' : '') + '" title="' + esc(t('day.' + DAYS[d.day])) + '">' + esc(t('day.' + DAYS[d.day]).slice(0, 1).toUpperCase()) + '</span>').join('') + '</div></div>' + (() => { const wd = weekDelta(rs); return wd == null ? '' : '<div class="spacer"></div><div><span class="muted small-note">' + esc(t('prog.weekAvg')) + '</span> <span class="' + (wd >= 0 ? 'up' : 'down') + '">' + (wd >= 0 ? '+' : '') + fmt(wd, 1) + ' %</span></div>'; })();
  if (!rs.length) { out.innerHTML = empty(t('prog.empty'), 'chart'); $('#pSkills', root).innerHTML = ''; return; }
  const scens = [...new Set(rs.map(r => r.scen))];
  if (!scens.includes(curScen)) curScen = scens.reduce((a, b) => rs.filter(r => r.scen === b).length > rs.filter(r => r.scen === a).length ? b : a);
  const data = rs.filter(r => r.scen === curScen), best = Math.max(...data.map(d => d.score)), first = data[0].score, last = data[data.length - 1].score, prog = first ? (last - first) / first * 100 : 0, accs = data.filter(d => d.acc != null), acc = accs.length ? accs.reduce((s, d) => s + d.acc, 0) / accs.length : null;
  out.innerHTML = '<div class="stats">' +
    '<div class="stat"><span>' + esc(t('prog.sessions')) + '</span><b data-n="' + rs.length + '">0</b></div>' +
    '<div class="stat"><span>' + esc(t('prog.scenarios')) + '</span><b data-n="' + scens.length + '">0</b></div>' +
    '<div class="stat"><span>' + esc(t('prog.best')) + '</span><b data-n="' + Math.round(best) + '">0</b></div>' +
    '<div class="stat"><span>' + esc(t('prog.progress')) + '</span><b style="color:' + (prog >= 0 ? 'var(--jade)' : 'var(--danger)') + '" data-n="' + prog.toFixed(1) + '" data-d="1" data-s=" %">0</b></div>' +
    (acc != null ? '<div class="stat"><span>' + esc(t('prog.acc')) + '</span><b data-n="' + acc.toFixed(1) + '" data-d="1" data-s=" %">0</b></div>' : '') + '</div>' +
    '<div class="row-flex" style="margin:20px 0 12px"><label class="label" for="scenSel">' + esc(t('prog.scenario')) + '</label><select id="scenSel" class="compact" style="max-width:420px">' + scens.map(s => '<option' + (s === curScen ? ' selected' : '') + '>' + esc(s) + '</option>').join('') + '</select><span class="spacer"></span><button class="btn small danger" id="clearRuns">' + ic('trash') + esc(t('prog.clear')) + '</button></div>' +
    '<div class="chart-box">' + (data.length < 2 ? '<p class="empty">' + esc(t('prog.needTwo')) + '</p>' : chart(data)) + '</div>';
  out.querySelectorAll('.stat b').forEach(b => countUp(b, parseFloat(b.dataset.n), b.dataset.s || '', +(b.dataset.d || 0), reduced()));
  $('#scenSel', root).onchange = e => { curScen = e.target.value; paint(root); };
  $('#clearRuns', root).onclick = async () => { if (await confirmModal(t('prog.clearConfirm'))) { saveRuns([]); paint(root); toast(t('prog.cleared')); } };
  const groups = {}; rs.forEach(r => { const k = skillOf(r.scen); (groups[k] = groups[k] || []).push(r); });
  const arr = Object.entries(groups);
  $('#pSkills', root).innerHTML = '<div class="section-head"><h3>' + esc(t('prog.bySkill')) + '</h3></div><div class="grid" style="--min:190px">' + arr.map(([name, list]) => {
    const b = Math.max(...list.map(r => r.score)), f = list[0].score, l = list[list.length - 1].score, p = f ? (l - f) / f * 100 : 0, share = Math.round(list.length / rs.length * 100);
    return '<div class="stat"><span>' + esc(t('skill.' + name)) + '</span><b>' + fmt(Math.round(b)) + '</b><small class="muted">' + esc(t('prog.recordSessions', { n: list.length })) + '</small><div class="bar" style="margin:8px 0 6px"><i style="width:' + share + '%"></i></div><small class="muted">' + esc(t('prog.share', { n: share })) + ' · <span class="' + (p >= 0 ? 'up' : 'down') + '">' + (p >= 0 ? '+' : '') + fmt(p, 1) + ' %</span></small></div>';
  }).join('') + '</div>' + (arr.length > 1 ? (() => { const low = arr.map(([n, l]) => [n, l.length / rs.length]).sort((a, b) => a[1] - b[1])[0]; return '<p class="inline-note">' + esc(t('prog.weakest', { skill: t('skill.' + low[0]), n: Math.round(low[1] * 100) })) + ' <a href="#/routines">' + esc(t('prog.findRoutine')) + '</a></p>'; })() : '');
}
async function handle(root, files) { const { added, bad } = await importFiles(files); toast(added ? t('prog.imported', { n: added }) : t('prog.noneNew') + (bad ? ' (' + t('prog.bad', { n: bad }) + ')' : '')); paint(root); }
export default {
  title: () => t('nav.progression'),
  render() {
    return pageHead(esc(t('nav.progression')), esc(t('prog.sub'))) +
      '<div class="import"><div class="dropzone" id="drop"><div class="dz-ic">' + ic('upload') + '</div><h3>' + esc(t('prog.drop')) + '</h3><p class="muted">' + esc(t('prog.dropSub')) + '</p><div class="row-flex" style="justify-content:center;margin-top:16px"><button class="btn primary" id="pickFiles">' + esc(t('prog.pickFiles')) + '</button><button class="btn" id="pickFolder">' + esc(t('prog.pickFolder')) + '</button></div>' +
      '<input type="file" id="fileIn" accept=".csv" multiple hidden><input type="file" id="dirIn" webkitdirectory directory multiple hidden>' +
      '<div class="pathbox"><code id="statPath">...\\steamapps\\common\\FPSAimTrainer\\FPSAimTrainer\\stats</code><button class="btn tiny" id="copyPath">' + esc(t('common.copy')) + '</button></div></div>' +
      '<div class="card"><h3>' + esc(t('prog.where')) + '</h3><ol class="steps"><li>' + esc(t('prog.where1')) + '</li><li>' + esc(t('prog.where2')) + '</li><li>' + esc(t('prog.where3')) + '</li></ol><p class="inline-note">' + esc(t('prog.browserNote')) + '</p><p class="inline-note">' + esc(t('prog.rewards')) + '</p></div></div>' +
      '<div class="section" id="pAna"></div><div class="streak-card card" id="pStreak"></div><div id="pOut"></div><div class="section" id="pSkills"></div>';
  },
  mount(root) {
    const drop = $('#drop', root);
    $('#pickFiles', root).onclick = () => $('#fileIn', root).click();
    $('#pickFolder', root).onclick = () => $('#dirIn', root).click();
    $('#fileIn', root).onchange = e => handle(root, [...e.target.files]);
    $('#dirIn', root).onchange = e => handle(root, [...e.target.files]);
    $('#copyPath', root).onclick = async () => { try { await navigator.clipboard.writeText($('#statPath', root).textContent); toast(t('common.copied')); } catch (e) { toast(t('common.copyFail')); } };
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
    drop.addEventListener('drop', e => handle(root, [...e.dataTransfer.files]));
    paint(root);
  },
};
