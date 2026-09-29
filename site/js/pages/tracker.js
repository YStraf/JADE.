// Tracker CS2 / FACEIT / Valorant : rang, K/D, % HS, victoires et dernières parties.
// Les vraies données passent par le serveur Jade (clés API secrètes) ; sans lui, un aperçu est affiché.
import { $, esc } from '../core/dom.js';
import { t, fmt } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { toast } from '../core/toast.js';
import { us } from '../core/store.js';
import { pageHead } from '../components/ui.js';
import { trackerStats, validHandle, shortHandle, liveStats } from '../state/trackers.js';

const GAMES = [['cs2', 'CS2'], ['faceit', 'FACEIT'], ['valorant', 'VALORANT']];
let game = 'cs2';
const handles = () => us.get('trackers', {});
async function view() {
  const h = handles()[game];
  const form = '<form class="trk-form" id="trkForm"><input type="text" id="trkH" maxlength="100" value="' + esc(h || '') + '" placeholder="' + esc(t('wg.ph.' + game)) + '" aria-label="' + esc(t('wg.handle.' + game)) + '"><button class="btn primary">' + ic('search') + esc(t('trk.track')) + '</button></form>';
  if (!h) return form + '<div class="card center trk-empty">' + ic('chart') + '<p class="muted">' + esc(t('trk.empty.' + game)) + '</p></div>';
  const live = await liveStats(game, h); const s = live || trackerStats(game, h);
  const rank = game === 'cs2' ? '<b style="color:' + s.c + '">' + fmt(s.rating) + '</b><small>Premier</small>' : game === 'faceit' ? '<span class="flvl big" style="--rc:' + s.c + '">' + s.lvl + '</span><div><b style="color:' + s.c + '">' + fmt(s.elo) + '</b><small>ELO</small></div>' : '<b style="color:' + s.c + '">' + esc(t('val.' + s.tier)) + (s.div ? ' ' + s.div : '') + '</b><small>' + esc(t('wg.game.ranked')) + '</small>';
  const kpi = (k, v) => '<div class="trk-kpi"><small>' + esc(k) + '</small><b>' + v + '</b></div>';
  return form + '<div class="trk-hero h-' + game + '"><div class="trk-id"><span class="glogo g-' + game + '">' + GAMES.find(g => g[0] === game)[1] + '</span><h2>' + esc(shortHandle(h)) + '</h2>' + (live ? '' : '<span class="tag outline" title="' + esc(t('wg.previewTip')) + '">' + esc(t('wg.preview')) + '</span>') + '</div><div class="trk-rank">' + rank + '</div></div>' +
    '<div class="trk-kpis">' + kpi('K/D', s.kd) + kpi(t('wg.game.hs'), s.hs + ' %') + kpi(t('wg.game.win'), s.win + ' %') + kpi(t('trk.form'), s.matches.map(m => '<i class="' + (m.win ? 'w' : 'l') + '">' + esc(m.win ? t('wg.game.w') : t('wg.game.l')) + '</i>').join('')) + '</div>' +
    '<div class="card"><h3>' + esc(t('trk.last')) + '</h3><div class="table-wrap"><table class="trk-table"><thead><tr><th>' + esc(t('wg.game.map')) + '</th><th>' + esc(t('wg.game.score')) + '</th><th>K/D/A</th><th>K/D</th><th>HS</th></tr></thead><tbody>' +
    s.matches.map(m => '<tr class="' + (m.win ? 'w' : 'l') + '"><td>' + esc(m.map) + '</td><td><b>' + m.score + '</b></td><td>' + m.k + ' / ' + m.d + ' / ' + m.a + '</td><td>' + (m.k / Math.max(1, m.d)).toFixed(2) + '</td><td>' + m.hs + ' %</td></tr>').join('') + '</tbody></table></div>' + (live ? '' : '<p class="inline-note">' + esc(t('wg.previewNote')) + '</p>') + '</div>';
}
async function paint(root) {
  $('#trkTabs', root).innerHTML = GAMES.map(([id, n]) => '<button type="button" class="trk-tab g-' + id + '" data-g="' + id + '" aria-pressed="' + (id === game) + '">' + n + '</button>').join('');
  $('#trkBody', root).innerHTML = await view();
}
export default {
  title: () => t('nav.tracker'),
  render() { return pageHead(esc(t('nav.tracker')), esc(t('trk.sub'))) + '<div class="trk-tabs" id="trkTabs"></div><div id="trkBody"></div>'; },
  mount(root) {
    paint(root);
    root.addEventListener('click', e => { const b = e.target.closest('[data-g]'); if (b) { game = b.dataset.g; paint(root); } });
    root.addEventListener('submit', e => {
      if (e.target.id !== 'trkForm') return; e.preventDefault();
      const v = $('#trkH', root).value.trim(); if (v && !validHandle(game, v)) return toast(t('wg.handle.bad'));
      const h = handles(); h[game] = v; us.set('trackers', h); paint(root);
    });
  },
};
