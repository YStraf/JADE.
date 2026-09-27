// Actus : résultats esport et patch notes (la veille arnaques est dans Sécurité).
import { $, esc } from '../core/dom.js';
import { t, C } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { pageHead, seg, noteBox } from '../components/ui.js';
let game = 'cs2';
const SOURCES = { cs2: [['Counter-Strike 2 — News', 'https://www.counter-strike.net/news'], ['HLTV', 'https://www.hltv.org']], valorant: [['Valorant — Patch notes', 'https://playvalorant.com/news/tags/patch-notes/'], ['VLR.gg', 'https://www.vlr.gg']] };
function paint(root) {
  const d = C('news')[game];
  seg($('#gSeg', root), [{ id: 'cs2', label: 'CS2' }, { id: 'valorant', label: 'Valorant' }], game, v => { game = v; paint(root); });
  $('#nOut', root).innerHTML = '<div class="section-head"><h3>' + ic('trophy') + esc(t('news.esport')) + '</h3><span class="tag outline">' + esc(t('common.example')) + '</span></div><div class="rail">' +
    d.esport.map(m => '<article class="ncard"><div class="thumb"><div class="score"><div class="tm">' + esc(m.a) + '</div><div class="n ' + (m.sa > m.sb ? 'win' : '') + '">' + m.sa + '</div><div class="tm">–</div><div class="n ' + (m.sb > m.sa ? 'win' : '') + '">' + m.sb + '</div><div class="tm">' + esc(m.b) + '</div></div></div><div class="txt"><b>' + esc(m.title) + '</b><p class="muted">' + esc(m.txt) + '</p><div class="mini-stats">' + m.stats.map(s => '<div><span>' + esc(s[0]) + '</span><b>' + esc(s[1]) + '</b></div>').join('') + '</div></div></article>').join('') + '</div>' +
    '<div class="section-head section"><h3>' + ic('news') + esc(t('news.patch')) + '</h3><span class="tag outline">' + esc(t('common.example')) + '</span></div><div class="rail">' + d.patch.map(p => '<article class="ncard"><div class="txt"><b>' + esc(p[0]) + '</b><p class="muted">' + esc(p[1]) + '</p></div></article>').join('') + '</div>' +
    '<div class="section card"><h3>' + esc(t('news.sources')) + '</h3><p class="desc">' + esc(t('news.sourcesSub')) + '</p><div class="row-flex">' + SOURCES[game].map(([l, u]) => '<a class="btn small" href="' + u + '" target="_blank" rel="noopener noreferrer">' + ic('ext') + esc(l) + '</a>').join('') + '</div></div>';
}
export default {
  title: () => t('nav.news'),
  render: () => pageHead(esc(t('nav.news')), esc(t('news.sub'))) + '<div class="filters"><div class="seg" id="gSeg" aria-label="' + esc(t('routine.game')) + '"></div></div><div id="nOut"></div><div class="section">' + noteBox(esc(t('news.scamMoved')) + ' <a href="#/securite">' + esc(t('nav.security')) + ' →</a>', 'shield') + '</div>',
  mount(root) { paint(root); },
};
