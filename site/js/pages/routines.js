// Routines : méthode, parcours guidé, filtres, bibliothèque.
import { $, $$, esc, dayKey } from '../core/dom.js';
import { store } from '../core/store.js';
import { t, C } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { toast } from '../core/toast.js';
import { ROUTINES, SCEN_LIB, LEVELS, GAMES, SOFTS, TYPES, GOALS, minutesOf, recommend, routineTitle, blockQty, scenAlts } from '../data/routines.js';
import { seg, pageHead, empty, noteBox } from '../components/ui.js';
import { awardXP, markActive } from '../state/progress.js';
import { me, updateProfile } from '../state/account.js';

const st = { soft: store.get('soft', 'kovaaks'), lvl: 'all', game: 'all', type: 'all', q: '' };
const softName = s => s === 'kovaaks' ? "Kovaak's" : 'Aim Lab';
const copyBtn = s => ' <button class="copy-scen" data-copy="' + esc(s) + '" title="' + esc(t('common.copy')) + '" aria-label="' + esc(t('common.copy')) + ' ' + esc(s) + '">' + ic('copy') + '</button>';
function card(r, open) {
  const src = r.code
    ? '<div class="pl-code"><span class="label">' + esc(t('routine.code')) + '</span><code>' + esc(r.code) + '</code><button class="btn small" data-copy="' + esc(r.code) + '">' + ic('copy') + esc(t('routine.copyCode')) + '</button><small class="muted">' + esc(t('routine.codeHow')) + '</small></div>'
    : '<p class="muted small-note">' + ic('info') + esc(t(r.soft === 'aimlab' ? 'routine.aimlabHow' : 'routine.kvkHow')) + '</p>';
  return '<details class="routine" id="r-' + r.id + '"' + (open ? ' open' : '') + '><summary><div><h3>' + esc(routineTitle(r)) + '</h3><div class="tags"><span class="tag jade">' + esc(t('level.' + r.lvl)) + '</span><span class="tag">' + esc(t('game.' + r.game)) + '</span>' + r.types.map(x => '<span class="tag">' + esc(t('type.' + x)) + '</span>').join('') + '</div></div><div class="time">≈ ' + minutesOf(r) + '<small> min</small></div></summary>' +
    '<div class="body"><p class="rt-note">' + esc(t('rt.n.' + r.focus)) + '</p>' + src + '<ol class="blocks">' + r.blocks.map(b => '<li class="block"><span class="min">' + esc(blockQty(b)) + '</span><span class="scen">' + scenAlts(b).map(s => esc(s) + copyBtn(s)).join('<span class="or">' + esc(t('auth.or')) + '</span>') + '</span></li>').join('') + '</ol>' +
    '<div class="row-flex" style="margin-top:14px"><button class="btn small primary" data-done="' + r.id + '">' + ic('check') + esc(t('routine.done')) + '</button><button class="btn small" data-copyall="' + r.id + '">' + ic('copy') + esc(t('routine.copyAll')) + '</button><span class="muted small-note">' + esc(softName(r.soft)) + ' · ' + esc(t('routine.source')) + '</span></div></div></details>';
}
function library() {
  return '<details class="card lib"><summary><div><h3>' + ic('book') + esc(t('lib.title')) + '</h3><p class="muted">' + esc(t('lib.sub')) + '</p></div>' + ic('plus') + '</summary>' +
    '<div class="lib-grid">' + Object.entries(SCEN_LIB).map(([k, l]) => '<div class="lib-cat"><h4>' + esc(t('lib.' + k)) + ' <small class="muted">' + l.length + '</small></h4><ul>' + l.map(s => '<li>' + esc(s) + copyBtn(s) + '</li>').join('') + '</ul></div>').join('') + '</div></details>';
}
function list(root, openId) {
  const q = st.q.toLowerCase();
  const l = ROUTINES.filter(r => r.soft === st.soft && (st.lvl === 'all' || r.lvl === st.lvl) && (st.game === 'all' || r.game === st.game || r.game === 'all') && (st.type === 'all' || r.types.includes(st.type)) && (!q || (routineTitle(r) + ' ' + r.blocks.map(b => b[1]).join(' ')).toLowerCase().includes(q)));
  $('#rCount', root).textContent = t('routine.count', { n: l.length });
  $('#rList', root).innerHTML = l.length ? l.map(r => card(r, r.id === openId)).join('') : empty(t('routine.none', { soft: softName(st.soft) }), 'routine');
}
function wizard() {
  const saved = store.get('plan', null) || {};
  const goals = Object.keys(GOALS);
  return '<details class="card wizard"' + (saved.goal ? '' : ' open') + '><summary><div><h3>' + ic('sparkles') + esc(t('wizard.title')) + '</h3><p class="muted">' + esc(t('wizard.sub')) + '</p></div><span class="tag jade">3 ' + esc(t('wizard.questions')) + '</span></summary>' +
    '<div class="qs"><label class="field"><span class="label">' + esc(t('wizard.goal')) + '</span><select id="wGoal">' + goals.map(g => '<option value="' + g + '"' + (saved.goal === g ? ' selected' : '') + '>' + esc(t('goal.' + g)) + '</option>').join('') + '</select></label>' +
    '<label class="field"><span class="label">' + esc(t('wizard.game')) + '</span><select id="wGame">' + ['cs2', 'valorant', 'both'].map(g => '<option value="' + g + '"' + (saved.game === g ? ' selected' : '') + '>' + esc(t('game.' + g)) + '</option>').join('') + '</select></label>' +
    '<label class="field"><span class="label">' + esc(t('wizard.time')) + '</span><select id="wTime">' + [10, 20, 30, 45].map(m => '<option value="' + m + '"' + (+saved.time === m ? ' selected' : '') + '>' + m + ' min</option>').join('') + '</select></label></div>' +
    '<button class="btn primary" id="wGo">' + esc(t('wizard.go')) + '</button><div id="planOut"></div></details>';
}
function planOut(root, silent) {
  const goal = $('#wGoal', root).value, game = $('#wGame', root).value, time = +$('#wTime', root).value;
  store.set('plan', { goal, game, time, soft: st.soft });
  if (me()) updateProfile(p => { p.plan2 = { goal, game, time, soft: st.soft }; });
  const l = recommend(goal, game, time, st.soft); const g = GOALS[goal];
  $('#planOut', root).innerHTML = l.length ? '<div class="plan-out"><h4>' + esc(t('wizard.yourPlan', { soft: softName(st.soft) })) + '</h4><p class="muted">' + esc(t('wizard.freq', { time })) + '</p>' +
    l.map((r, i) => '<a class="plan-step" href="#/routines/' + r.id + '"><span class="n">' + (i + 1) + '</span><span><b>' + esc(routineTitle(r)) + ' · ≈ ' + minutesOf(r) + ' min</b><small>' + esc(r.blocks.map(b => scenAlts(b)[0]).join(' → ')) + '</small></span>' + ic('ext') + '</a>').join('') +
    '<p class="note">' + ic('target') + esc(t('wizard.test', { test: t('type.' + (g.type ? g.type[0] : 'flick')) })) + '</p></div>' : '<p class="muted" style="margin-top:14px">' + esc(t('wizard.none')) + '</p>';
  if (!silent) toast(t('wizard.ready'));
}
export default {
  title: () => t('nav.routines'),
  render() {
    return pageHead(esc(t('nav.routines')), esc(t('routines.sub'))) +
      '<details class="card method"><summary><div><h3>' + ic('book') + esc(t('method.title')) + '</h3><p class="muted">' + esc(t('method.sub')) + '</p></div>' + ic('plus') + '</summary><div class="method-grid">' + C('method').map((m, i) => '<div class="m-item"><span class="m-n">' + (i + 1) + '</span><div><b>' + esc(m.t) + '</b><p class="muted">' + esc(m.d) + '</p></div></div>').join('') + '</div></details>' +
      wizard() +
      '<div class="filters sticky-filters"><div class="seg" id="softSeg" aria-label="' + esc(t('routine.soft')) + '"></div><div class="seg" id="lvlSeg" aria-label="' + esc(t('routine.level')) + '"></div><div class="seg" id="gameSeg" aria-label="' + esc(t('routine.game')) + '"></div>' +
      '<select id="typeSel" class="compact" aria-label="' + esc(t('routine.type')) + '"><option value="all">' + esc(t('routine.allTypes')) + '</option>' + TYPES.map(x => '<option value="' + x + '">' + esc(t('type.' + x)) + '</option>').join('') + '</select>' +
      '<input type="search" id="rSearch" class="compact" placeholder="' + esc(t('routine.search')) + '" aria-label="' + esc(t('routine.search')) + '"></div>' +
      '<p class="muted small-note" id="rCount"></p><div class="routine-list" id="rList"></div>' + library() +
      noteBox(esc(t('routine.sourceNote')), 'info');
  },
  mount(root, sub) {
    const openId = sub[0];
    if (openId) { const r = ROUTINES.find(x => x.id === openId); if (r) { st.soft = r.soft; st.lvl = 'all'; st.game = 'all'; st.type = 'all'; st.q = ''; } }
    const draw = () => {
      seg($('#softSeg', root), SOFTS.map(s => ({ id: s, label: softName(s) })), st.soft, v => { st.soft = v; store.set('soft', v); draw(); });
      seg($('#lvlSeg', root), [{ id: 'all', label: t('level.all') }].concat(LEVELS.map(l => ({ id: l, label: t('level.' + l) }))), st.lvl, v => { st.lvl = v; draw(); });
      seg($('#gameSeg', root), GAMES.map(g => ({ id: g, label: t('game.' + g) })), st.game, v => { st.game = v; draw(); });
      list(root, openId);
    };
    $('#typeSel', root).value = st.type; $('#typeSel', root).onchange = e => { st.type = e.target.value; draw(); };
    $('#rSearch', root).oninput = e => { st.q = e.target.value; list(root); };
    draw();
    if (openId) setTimeout(() => { const el = $('#r-' + openId, root); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 120);
    $('#wGo', root).onclick = () => planOut(root);
    if ((store.get('plan', null) || {}).goal) planOut(root, true);
    root.addEventListener('click', async e => {
      const c = e.target.closest('[data-copy]'); if (c) { e.preventDefault(); try { await navigator.clipboard.writeText(c.dataset.copy); toast(t('routine.copied', { s: c.dataset.copy })); } catch (x) { toast(t('common.copyFail')); } return; }
      const a = e.target.closest('[data-copyall]'); if (a) { const r = ROUTINES.find(x => x.id === a.dataset.copyall); try { await navigator.clipboard.writeText((r.code ? r.code + '\n\n' : '') + r.blocks.map(b => scenAlts(b)[0] + ' (' + blockQty(b) + ')').join('\n')); toast(t('routine.copiedAll')); } catch (x) { toast(t('common.copyFail')); } return; }
      const d = e.target.closest('[data-done]'); if (d) { const r = ROUTINES.find(x => x.id === d.dataset.done); markActive(); const res = awardXP('routine', r.id + ':' + dayKey(Date.now()), routineTitle(r)); if (!res) toast(t('routine.alreadyToday')); if (!me()) toast(t('routine.guestNote')); }
    });
  },
};
