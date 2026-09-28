// Vue unifiée d'un joueur (moi, un autre compte local, ou un joueur de démonstration).
import { us } from '../core/store.js';
import { levelFromXP, rankOf, TESTS, norm, ITEM } from '../data/game.js';
import { DEMO_PLAYERS } from '../data/demo.js';
import { accounts, me, profile } from './account.js';
import { xpData, runs, streakInfo, rankPoints, minutes, bests, badges } from './progress.js';

export function getPlayer(pseudo) {
  if (!pseudo) return null;
  const p = pseudo.toLowerCase(); const m = me();
  if (m && m.pseudo.toLowerCase() === p) {
    const pr = profile(); const xp = xpData().total; const L = levelFromXP(xp);
    return { self: true, id: m.id, pseudo: m.pseudo, role: m.role, style: pr.style, bio: pr.bio, prefs: pr.prefs, widgets: pr.widgets, layout: pr.layout, media: id => us.get('wmedia:' + id, ''), xp, level: L, rank: rankOf(rankPoints()), rankPoints: rankPoints(), sessions: runs().length, streak: streakInfo().n, minutes: minutes(), bests: bests(), badges: badges(), created: m.created };
  }
  const acc = accounts().find(a => a.pseudo.toLowerCase() === p);
  if (acc) {
    const pr = profile(acc.id); const x = us.getFor(acc.id, 'xp', { total: 0 }).total; const b = us.getFor(acc.id, 'bests', {});
    const parts = Object.keys(TESTS).map(k => norm(k, b[k])).filter(v => v != null);
    const pts = parts.length >= 3 ? Math.round(parts.reduce((a, c) => a + c, 0) / parts.length * 7) : null;
    return { id: acc.id, pseudo: acc.pseudo, role: acc.role, banned: acc.banned, style: pr.style, bio: pr.bio, prefs: pr.prefs, widgets: pr.widgets, layout: pr.layout, media: id => us.getFor(acc.id, 'wmedia:' + id, ''), xp: x, level: levelFromXP(x), rank: rankOf(pts), rankPoints: pts, sessions: us.getFor(acc.id, 'runs', []).length, streak: null, minutes: us.getFor(acc.id, 'minutes', 0), bests: b, created: acc.created };
  }
  const d = DEMO_PLAYERS.find(x => x.pseudo.toLowerCase() === p);
  if (d) return { demo: true, id: d.id, pseudo: d.pseudo, style: { ...d.style, title: d.style.title && ITEM['title:' + d.style.title] ? d.style.title : '' }, bio: '', prefs: { publicProfile: true, showScores: true }, layout: demoLayout(d.pseudo), xp: d.xp, level: levelFromXP(d.xp), rank: rankOf(d.rankPoints), rankPoints: d.rankPoints, sessions: d.sessions, streak: d.streak, minutes: d.minutes, bests: {} };
  return null;
}
// Vitrine des joueurs de démonstration : trackers en aperçu + stats Jade.
function demoLayout(n) {
  const W = (id, type, size, x, y, cfg = {}) => ({ id, type, size, x, y, cfg });
  return [W('d1', 'cs2', 'l', 0, 0, { handle: n }), W('d2', 'faceit', 'm', 2, 0, { handle: n }), W('d3', 'valorant', 'm', 2, 1, { handle: n + '#EUW' }), W('d4', 'streak', 's', 0, 2), W('d5', 'rank', 's', 1, 2), W('d6', 'badges', 'm', 2, 2)];
}
export function playTime(m) { if (m < 60) return m + ' min'; const h = Math.floor(m / 60); return h + ' h ' + String(m % 60).padStart(2, '0'); }
