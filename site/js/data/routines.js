// Routines : structure (logiciel, niveau, jeu, types, blocs [minutes, scénario]).
// Les textes (titre, consignes, note) sont traduits dans content/<lang>.js → routines[id].
export const LEVELS = ['beginner', 'intermediate', 'advanced'];
export const GAMES = ['all', 'cs2', 'valorant'];
export const TYPES = ['clicking', 'precision', 'tracking', 'flick', 'switching', 'micro', 'reaction'];
export const SOFTS = ['kovaaks', 'aimlab'];
const K = 'kovaaks', A = 'aimlab';
export const ROUTINES = [
  { id: 'k-warmup', soft: K, lvl: 'beginner', game: 'all', types: ['clicking', 'tracking'], blocks: [[3, 'Tile Frenzy'], [4, 'Close Long Strafes Invincible'], [3, '1wall 6targets small']] },
  { id: 'k-basics', soft: K, lvl: 'beginner', game: 'all', types: ['clicking', 'precision'], blocks: [[4, 'Jumbo Tile Frenzy'], [6, '1wall 6targets small'], [6, 'Close Long Strafes Invincible'], [4, 'Tile Frenzy']] },
  { id: 'k-vt-novice', soft: K, lvl: 'beginner', game: 'all', types: ['clicking', 'tracking', 'switching'], blocks: [[3, 'VT Pasu Rasp Novice'], [3, 'VT Bounceshot Novice'], [3, 'VT 1w5ts Novice'], [3, 'VT Multiclick 120 Novice'], [3, 'VT Smoothbot Novice'], [3, 'VT PreciseOrb Novice'], [3, 'VT Plaza Novice'], [3, 'VT Air Novice'], [3, 'VT psalmTS Novice'], [3, 'VT skyTS Novice'], [3, 'VT evaTS Novice'], [3, 'VT bounceTS Novice']] },
  { id: 'k-tracking', soft: K, lvl: 'intermediate', game: 'all', types: ['tracking'], blocks: [[5, 'Close Long Strafes Invincible'], [8, 'Smoothbot'], [8, 'Air Angelic 4'], [5, 'Ground Plaza Sparky v3'], [4, 'Close Long Strafes Invincible']] },
  { id: 'k-flickswitch', soft: K, lvl: 'intermediate', game: 'valorant', types: ['flick', 'switching'], blocks: [[5, 'Tile Frenzy'], [8, '1wall5targets_pasu'], [9, 'Pokeball Frenzy Auto TE Wide'], [8, 'Bounce 180']] },
  { id: 'k-switch-speed', soft: K, lvl: 'intermediate', game: 'all', types: ['switching'], blocks: [[5, 'VT psalmTS Intermediate'], [7, 'VT skyTS Intermediate'], [7, 'VT evaTS Intermediate'], [6, 'VT bounceTS Intermediate']] },
  { id: 'k-vt-intermediate', soft: K, lvl: 'intermediate', game: 'all', types: ['clicking', 'tracking', 'switching'], blocks: [[3, 'VT Pasu Rasp Intermediate'], [3, 'VT Bounceshot Intermediate'], [3, 'VT 1w5ts Intermediate'], [3, 'VT Multiclick 120 Intermediate'], [3, 'VT Smoothbot Intermediate'], [3, 'VT PreciseOrb Intermediate'], [3, 'VT Plaza Intermediate'], [3, 'VT Air Intermediate'], [3, 'VT psalmTS Intermediate'], [3, 'VT skyTS Intermediate'], [3, 'VT evaTS Intermediate'], [3, 'VT bounceTS Intermediate']] },
  { id: 'k-valorant-heads', soft: K, lvl: 'intermediate', game: 'valorant', types: ['micro', 'precision'], blocks: [[5, '1wall 6targets small'], [8, 'Sphere Hipfire extra small'], [6, '1w4ts reload'], [6, 'Range Valorant']] },
  { id: 'k-cs2-first', soft: K, lvl: 'advanced', game: 'cs2', types: ['micro', 'flick'], blocks: [[5, '1wall 6targets small'], [10, '1w4ts reload'], [10, 'Sphere Hipfire extra small'], [10, 'Deathmatch CS2']] },
  { id: 'k-dynamic', soft: K, lvl: 'advanced', game: 'all', types: ['clicking', 'flick'], blocks: [[5, 'VT Pasu Rasp Intermediate'], [7, 'VT Bounceshot Intermediate'], [7, 'VT Multiclick 120 Intermediate'], [6, 'Pasu Reload']] },
  { id: 'k-reactive', soft: K, lvl: 'advanced', game: 'all', types: ['tracking', 'reaction'], blocks: [[6, 'VT Plaza Intermediate'], [8, 'VT Air Intermediate'], [8, 'Ground Plaza Sparky v3'], [8, 'VT Smoothbot Intermediate']] },
  { id: 'k-full', soft: K, lvl: 'advanced', game: 'all', types: ['clicking', 'tracking', 'switching'], blocks: [[5, 'Tile Frenzy'], [10, '1wall 6targets small'], [10, 'Smoothbot'], [10, 'Pasu Reload'], [10, 'Air no UFO no SKYBOTS']] },
  { id: 'a-warmup', soft: A, lvl: 'beginner', game: 'all', types: ['clicking', 'tracking'], blocks: [[4, 'Gridshot'], [3, 'Strafetrack'], [3, 'Microshot']] },
  { id: 'a-basics', soft: A, lvl: 'beginner', game: 'all', types: ['clicking', 'precision'], blocks: [[5, 'Gridshot'], [7, 'Sixshot'], [5, 'Strafetrack'], [3, 'Gridshot']] },
  { id: 'a-micro', soft: A, lvl: 'intermediate', game: 'cs2', types: ['micro', 'clicking'], blocks: [[5, 'Sixshot'], [10, 'Microshot'], [10, 'Deathmatch CS2']] },
  { id: 'a-tracking', soft: A, lvl: 'intermediate', game: 'all', types: ['tracking'], blocks: [[5, 'Strafetrack'], [12, 'Circletrack'], [8, 'Motionshot'], [5, 'Strafetrack']] },
  { id: 'a-valorant-flick', soft: A, lvl: 'intermediate', game: 'valorant', types: ['flick', 'reaction'], blocks: [[5, 'Spidershot'], [10, 'Sixshot'], [8, 'Detection'], [7, 'Range Valorant']] },
  { id: 'a-reflex', soft: A, lvl: 'advanced', game: 'valorant', types: ['flick', 'switching', 'reaction'], blocks: [[5, 'Gridshot'], [10, 'Spidershot'], [10, 'Switchtrack'], [10, 'Reflexshot']] },
  { id: 'a-full', soft: A, lvl: 'advanced', game: 'all', types: ['clicking', 'tracking', 'switching'], blocks: [[5, 'Gridshot'], [10, 'Sixshot'], [10, 'Circletrack'], [8, 'Switchtrack'], [7, 'Reflexshot']] },
];
export const minutesOf = r => r.blocks.reduce((s, b) => s + b[0], 0);
// Parcours guidé : objectif → niveaux et types recherchés.
export const GOALS = {
  start: { lvls: ['beginner'], type: null },
  flicks: { lvls: ['intermediate', 'advanced'], type: ['flick', 'clicking'] },
  tracking: { lvls: ['intermediate', 'advanced'], type: ['tracking'] },
  precision: { lvls: ['intermediate', 'advanced'], type: ['precision', 'micro'] },
  switching: { lvls: ['intermediate', 'advanced'], type: ['switching'] },
  compet: { lvls: ['advanced'], type: null },
};
export function recommend(goal, game, minutes, soft) {
  const g = GOALS[goal]; let list = ROUTINES.filter(r => r.soft === soft && g.lvls.includes(r.lvl) && (game === 'both' || r.game === game || r.game === 'all'));
  if (g.type) { const typed = list.filter(r => r.types.some(x => g.type.includes(x))); if (typed.length) list = typed; }
  return list.sort((a, b) => Math.abs(minutesOf(a) - minutes) - Math.abs(minutesOf(b) - minutes)).slice(0, 2);
}
// Catégorisation d'un scénario par compétence (mots-clés).
export const SKILLS = [['clicking', ['tile', '1wall', 'gridshot', 'sixshot', 'spidershot', 'flick', 'frenzy', 'pasu', 'bounceshot', '1w5ts', '1w4ts', 'multiclick', 'hipfire']], ['tracking', ['track', 'smooth', 'air', 'strafe', 'circle', 'motion', 'plaza', 'preciseorb', 'sphere']], ['precision', ['micro', 'small', 'precision', 'thin', 'dot']], ['switching', ['ts ', 'ts', 'switch', 'popcorn', 'bounce']], ['reaction', ['reflex', 'react', 'detect', 'speed']]];
export function skillOf(scen) { const s = (scen || '').toLowerCase(); for (const [n, keys] of SKILLS) if (keys.some(k => s.includes(k))) return n; return 'other'; }
