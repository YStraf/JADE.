// Sécurité : veille en cours, fiches arnaques, que faire, signalement.
import { $, esc, uidGen } from '../core/dom.js';
import { store } from '../core/store.js';
import { t, C } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { toast } from '../core/toast.js';
import { FICHES } from '../data/security.js';
import { me } from '../state/account.js';
import { pageHead, seg } from '../components/ui.js';
let game = 'cs2', lvl = 'all';
function watch(root) {
  const S = C('security');
  seg($('#wSeg', root), [{ id: 'cs2', label: 'CS2' }, { id: 'valorant', label: 'Valorant' }], game, v => { game = v; watch(root); });
  $('#wOut', root).innerHTML = S.watch[game].map(v => '<div class="alert"><b>' + ic('warn') + esc(v[0]) + '</b><p>' + esc(v[1]) + '</p><p class="how"><strong>' + esc(t('sec.reflex')) + ' :</strong> ' + esc(v[2]) + '</p></div>').join('');
}
function fiches(root, open) {
  const S = C('security');
  seg($('#lSeg', root), [{ id: 'all', label: t('sec.all') }, { id: 'crit', label: S.levels.crit }, { id: 'high', label: S.levels.high }, { id: 'mid', label: S.levels.mid }], lvl, v => { lvl = v; fiches(root); });
  $('#fOut', root).innerHTML = FICHES.filter(f => lvl === 'all' || f.lvl === lvl).map(f => { const x = S.fiches[f.id]; return '<details class="fiche" id="f-' + f.id + '"' + (open === f.id ? ' open' : '') + '><summary><b>' + esc(x.t) + '</b><span class="lvl lvl-' + f.lvl + '">' + esc(S.levels[f.lvl]) + '</span></summary><div class="in"><div><h4>' + esc(t('sec.how')) + '</h4><p>' + esc(x.how) + '</p></div><div><h4>' + esc(t('sec.signs')) + '</h4><ul>' + x.signs.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul></div><div class="reflex"><h4>' + esc(t('sec.reflex')) + '</h4><p>' + esc(x.reflex) + '</p></div></div></details>'; }).join('');
}
export default {
  title: () => t('nav.security'),
  render() {
    const S = C('security');
    return pageHead(esc(t('nav.security')), esc(t('sec.sub'))) +
      '<div class="section-head"><h3>' + ic('bell') + esc(t('sec.watch')) + '</h3><span class="tag jade">' + esc(t('sec.verified')) + '</span></div><div class="filters"><div class="seg" id="wSeg"></div></div><div class="watch-grid" id="wOut"></div>' +
      '<div class="section"><div class="section-head"><h3>' + ic('shield') + esc(t('sec.fiches')) + '</h3><span class="muted small-note">' + esc(t('sec.fichesSub', { n: FICHES.length })) + '</span></div><div class="filters"><div class="seg" id="lSeg"></div></div><div class="sec-grid" id="fOut"></div></div>' +
      '<div class="section grid-2"><div class="card"><h3>' + esc(t('sec.hacked')) + '</h3><p class="desc">' + esc(t('sec.hackedSub')) + '</p><div class="steps-sec">' + S.remedies.map((r, i) => '<div><i>' + (i + 1) + '</i><span>' + esc(r) + '</span></div>').join('') + '</div></div>' +
      '<div class="card"><h3>' + esc(t('sec.report')) + '</h3><p class="desc">' + esc(t('sec.reportSub')) + '</p><div class="field"><label for="secMsg">' + esc(t('sec.seen')) + '</label><textarea id="secMsg" placeholder="' + esc(t('sec.seenPh')) + '"></textarea></div><button class="btn primary" id="secSend">' + esc(t('sec.send')) + '</button><p class="inline-note">' + esc(t('sec.linkWarn')) + '</p><p class="inline-note">' + esc(t('sec.official')) + '</p></div></div>';
  },
  mount(root, sub) {
    watch(root); fiches(root, sub[0]);
    if (sub[0]) setTimeout(() => { const el = $('#f-' + sub[0], root); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 120);
    $('#secSend', root).onclick = () => { const v = $('#secMsg', root).value.trim(); if (v.length < 15) return toast(t('sec.tooShort')); const l = store.get('scamReports', []); l.unshift({ id: uidGen(), msg: v, by: me() ? me().pseudo : null, t: Date.now() }); store.set('scamReports', l.slice(0, 200)); $('#secMsg', root).value = ''; toast(t('sec.sent')); };
  },
};
