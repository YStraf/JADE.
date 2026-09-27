// Rangs : rang global, rangs par compétence (radar), échelle complète, classement.
import { esc } from '../core/dom.js';
import { t, fmt } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { RANKS, DIV_LABEL, TESTS, rankOf } from '../data/game.js';
import { myRank, rankPoints, aimScore, assiduity, skillRanks, bests } from '../state/progress.js';
import { me } from '../state/account.js';
import { DEMO_PLAYERS } from '../data/demo.js';
import { getPlayer } from '../state/players.js';
import { pageHead, avatar } from '../components/ui.js';
import { emblem } from '../components/emblem.js';
import { rankLabel, playerLink } from '../components/minicard.js';

function radar(sk) {
  const N = sk.length, R = 90, cx = 120, cy = 110;
  const pt = (i, v) => { const a = -Math.PI / 2 + i * 2 * Math.PI / N; return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v]; };
  let g = ''; [.25, .5, .75, 1].forEach(l => { g += '<polygon points="' + sk.map((_, i) => pt(i, l).join(',')).join(' ') + '" fill="none" stroke="var(--line)"/>'; });
  sk.forEach((_, i) => { const [x, y] = pt(i, 1); g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x + '" y2="' + y + '" stroke="var(--line)"/>'; });
  const poly = sk.map((s, i) => pt(i, (s.n || 0) / 100).join(',')).join(' ');
  const labels = sk.map((s, i) => { const [x, y] = pt(i, 1.2); return '<text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="var(--muted)">' + esc(t('test.' + s.k + '.name')) + '</text>'; }).join('');
  return '<svg viewBox="-34 -6 308 236" class="radar" role="img" aria-label="' + esc(t('ranks.radar')) + '">' + g + '<polygon points="' + poly + '" fill="var(--jade-soft)" stroke="var(--jade)" stroke-width="2.5" stroke-linejoin="round"/>' + sk.map((s, i) => { const [x, y] = pt(i, (s.n || 0) / 100); return '<circle cx="' + x + '" cy="' + y + '" r="3.5" fill="var(--jade)"/>'; }).join('') + labels + '</svg>';
}
export default {
  title: () => t('nav.ranks'),
  render() {
    const r = myRank(), pts = rankPoints(), done = Object.keys(bests()).length;
    const mine = r ? (() => {
      const a = aimScore(), as = assiduity(), next = r.next; const span = next ? next.min - r.min : 1; const pct = next ? Math.round((pts - r.min) / span * 100) : 100;
      return '<div class="card rank-hero" style="--rc:' + r.c + '"><div class="rank-em">' + emblem(r.index, { size: 132, div: r.div }) + '</div><div class="rank-info"><span class="muted small-note">' + esc(t('ranks.yours')) + '</span><h2 style="color:var(--rc)">' + esc(rankLabel(r)) + '</h2><p class="muted">' + fmt(pts) + ' ' + esc(t('ranks.points')) + (next ? ' · ' + esc(t('ranks.toNext', { n: next.min - pts, rank: t('rank.' + next.id) })) : ' · ' + esc(t('rank.max'))) + '</p>' +
        '<div class="bar lg" style="margin:12px 0 16px"><i style="width:' + pct + '%;background:var(--rc)"></i></div>' +
        '<div class="rank-bars"><div><span>' + esc(t('ranks.aim')) + '</span><span class="bar"><i style="width:' + a.toFixed(0) + '%;background:var(--rc)"></i></span><b>' + a.toFixed(0) + '</b></div><div><span>' + esc(t('ranks.assiduity')) + '</span><span class="bar"><i style="width:' + as.toFixed(0) + '%;background:var(--rc)"></i></span><b>' + as.toFixed(0) + '</b></div></div></div></div>';
    })() : '<div class="card rank-hero unranked"><div class="rank-em">' + emblem(0, { size: 120, cls: 'dim' }) + '</div><div class="rank-info"><h2>' + esc(t('rank.unranked')) + '</h2><p class="muted">' + esc(t('ranks.needTests', { n: done })) + '</p><div class="row-flex" style="margin-top:14px"><a class="btn primary" href="#/tests">' + ic('target') + esc(t('ranks.doTests')) + '</a></div></div></div>';
    const sk = skillRanks();
    const skills = '<div class="grid-2 section"><div class="card"><h3>' + esc(t('ranks.bySkill')) + '</h3><p class="muted small-note" style="margin-bottom:12px">' + esc(t('ranks.bySkillSub')) + '</p><div class="stack" style="--gap:8px">' + sk.map(s => '<a class="skill-row" href="#/tests/' + s.k + '">' + (s.rank ? emblem(s.rank.index, { size: 36, div: s.rank.div }) : '<span class="sk-empty">' + ic('target') + '</span>') + '<div style="flex:1"><b>' + esc(t('test.' + s.k + '.name')) + '</b><div class="bar"><i style="width:' + (s.n || 0) + '%;background:' + (s.rank ? s.rank.c : 'var(--line2)') + '"></i></div></div><span style="color:' + (s.rank ? s.rank.c : 'var(--muted)') + ';font-weight:700;font-size:13.5px">' + esc(s.rank ? rankLabel(s.rank) : t('ranks.notDone')) + '</span></a>').join('') + '</div></div><div class="card center">' + radar(sk) + '<p class="inline-note">' + esc(t('ranks.radarNote')) + '</p></div></div>';
    const ladder = '<div class="section"><div class="section-head"><h3>' + esc(t('ranks.ladder')) + '</h3><span class="muted small-note">' + esc(t('ranks.divNote')) + '</span></div><div class="ladder-grid">' + RANKS.map((x, i) => { const cur = r && r.index === i; const nx = RANKS[i + 1]; return '<div class="ladder-card' + (cur ? ' cur' : '') + '" style="--rc:' + x.c + '">' + emblem(i, { size: 76 }) + '<b style="color:var(--rc)">' + esc(t('rank.' + x.id)) + '</b><small>' + fmt(x.min) + (nx ? ' – ' + fmt(nx.min - 1) : '+') + ' ' + esc(t('ranks.pts')) + '</small>' + (i < 10 ? '<span class="divs">III · II · I</span>' : '<span class="divs">' + esc(t('ranks.elite')) + '</span>') + (cur ? '<span class="tag jade">' + esc(t('common.you')) + '</span>' : '') + '</div>'; }).join('') + '</div></div>';
    const u = me(); const players = DEMO_PLAYERS.map(p => ({ pseudo: p.pseudo, pts: p.rankPoints })); if (u && pts != null) players.push({ pseudo: u.pseudo, pts, me: true }); players.sort((a, b) => b.pts - a.pts);
    const lb = '<div class="section grid-2"><div class="card"><h3>' + esc(t('ranks.leaderboard')) + ' <span class="tag outline">' + esc(t('common.example')) + '</span></h3><div class="table-wrap" style="margin-top:10px"><table><tbody>' + players.map((p, i) => { const rr = rankOf(p.pts); const pl = getPlayer(p.pseudo) || { pseudo: p.pseudo, style: {} }; return '<tr class="' + (p.me ? 'me' : '') + '"><td class="rank-n">' + (i + 1) + '</td><td><span class="row-flex" style="gap:10px">' + avatar(pl, 28) + playerLink(p.pseudo) + '</span></td><td><span class="row-flex" style="gap:6px">' + emblem(rr.index, { size: 22 }) + '<span style="color:' + rr.c + ';font-weight:700">' + esc(rankLabel(rr)) + '</span></span></td><td><b>' + fmt(p.pts) + '</b></td></tr>'; }).join('') + '</tbody></table></div></div>' +
      '<div class="card"><h3>' + esc(t('ranks.how')) + '</h3><ul class="rules">' + [1, 2, 3, 4, 5].map(i => '<li>' + esc(t('ranks.how' + i)) + '</li>').join('') + '</ul></div></div>';
    return pageHead(esc(t('nav.ranks')), esc(t('ranks.sub'))) + mine + skills + ladder + lb;
  },
};
