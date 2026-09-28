// Constantes de jeu (indépendantes de la langue). Les libellés sont dans i18n/<lang>.js.

// ---- XP ----
export const XP_RULES = {
  session: 10, record_test: 60, record_scen: 40, streak_day: 15, post: 20, link: 30,
  challenge: 250, routine: 25, secret: 250, test_day: 5, admin: 0,
};
export const MAXLVL = 100;
// Passer du niveau N à N+1 coûte 300 + (N-1) × 180 XP.
export function levelFromXP(total) {
  let lvl = 1, need = 300, acc = 0;
  while (total >= acc + need && lvl < MAXLVL) { acc += need; lvl++; need = Math.round(300 + (lvl - 1) * 180); }
  const into = total - acc;
  return { lvl, into, need, pct: lvl >= MAXLVL ? 100 : Math.min(100, Math.round(into / need * 100)) };
}
export function xpForLevel(l) { let acc = 0; for (let i = 1; i < l; i++) acc += Math.round(300 + (i - 1) * 180); return acc; }

// ---- Coins ----
export const COIN_RULES = { session: 5, sessionDailyCap: 20, record_test: 25, streak_week: 50, level_milestone: 75 };
export const CHALLENGE_COINS = [[1, 300], [3, 250], [10, 200], [25, 150], [Infinity, 100]]; // [rang max, coins]

// ---- Tests d'aim ----
export const TESTS = {
  flick: { unit: 's', lower: true, n: 20, size: 42, pen: .25, skill: 'clicking' },
  precision: { unit: 's', lower: true, n: 15, size: 20, pen: .5, skill: 'precision' },
  reaction: { unit: 'ms', lower: true, n: 5, skill: 'reaction' },
  tracking: { unit: '%', lower: false, dur: 20000, size: 64, skill: 'tracking' },
  switching: { unit: 's', lower: true, n: 20, size: 48, pen: .25, skill: 'switching' },
};
// Bornes de plausibilité (en dessous/au-dessus : résultat ignoré).
export const TEST_BOUNDS = { flick: v => v >= 4, precision: v => v >= 5, reaction: v => v >= 100, tracking: v => v <= 100, switching: v => v >= 4 };
// Repères [excellent, faible] pour normaliser chaque test sur 0-100.
export const REFS = { flick: [12, 30], precision: [18, 45], reaction: [180, 400], tracking: [85, 30], switching: [14, 35] };
export function norm(k, v) { if (v == null) return null; const [g, b] = REFS[k]; return Math.max(0, Math.min(100, (v - b) / (g - b) * 100)); }

// ---- Rangs ----
// 12 rangs, 3 divisions (III → I) pour les 10 premiers. Points 0-1000 = 70 % aim + 30 % assiduité.
export const RANKS = [
  { id: 'iron', c: '#8f979c', min: 0 },
  { id: 'bronze', c: '#c98a55', min: 100 },
  { id: 'silver', c: '#c5cfd6', min: 200 },
  { id: 'gold', c: '#e8b93f', min: 300 },
  { id: 'platinum', c: '#4fd6c8', min: 400 },
  { id: 'diamond', c: '#5ac8ff', min: 500 },
  { id: 'amethyst', c: '#b07cff', min: 600 },
  { id: 'obsidian', c: '#6f7dff', min: 690 },
  { id: 'master', c: '#ff6fb1', min: 770 },
  { id: 'grandmaster', c: '#ff5a4f', min: 850 },
  { id: 'mythic', c: '#ffb547', min: 920 },
  { id: 'jade', c: '#2EE88A', min: 970 },
];
export function rankOf(points) {
  if (points == null) return null;
  let i = 0; RANKS.forEach((r, k) => { if (points >= r.min) i = k; });
  const r = RANKS[i], next = RANKS[i + 1];
  let div = 0;
  if (i < 10 && next) { const span = (next.min - r.min) / 3; div = 3 - Math.min(2, Math.floor((points - r.min) / span)); }
  return { ...r, index: i, div, next: next || null, toNext: next ? next.min - points : 0 };
}
export const DIV_LABEL = ['', 'I', 'II', 'III'];

// ---- Badges ----
export const BADGES = [
  { id: 'first', need: s => s.sessions >= 1 },
  { id: 'ten', need: s => s.sessions >= 10 },
  { id: 'fifty', need: s => s.sessions >= 50 },
  { id: 'week', need: s => s.streak >= 7 },
  { id: 'month', need: s => s.streak >= 30 },
  { id: 'tests', need: s => s.tests >= 5 },
  { id: 'social', need: s => s.posts >= 3 },
  { id: 'linked', need: s => s.links >= 1 },
  { id: 'collector', need: s => s.items >= 10 },
  { id: 'gold', need: s => s.rankIndex >= 3 },
  { id: 'challenger', need: s => s.challenges >= 1 },
  { id: 'secret', need: s => s.secrets >= 1 },
];

// ---- Cosmétiques ----
// id = type:clé. source : base (gratuit), tier (pass), crate, secret, admin.
export const RARITY_W = { common: 60, rare: 28, epic: 10, legend: 2 };
const I = (type, key, rarity, source, extra = {}) => ({ id: type + ':' + key, type, key, rarity, source, ...extra });
export const ITEMS = [
  // Base
  ...['none', 'jade', 'steel', 'amber', 'violet', 'dash', 'double'].map(k => I('frame', k, 'base', 'base')),
  ...['aurora', 'night', 'grid', 'dots', 'carbon', 'scope', 'sunset', 'ice'].map(k => I('banner', k, 'base', 'base')),
  I('theme', 'dark', 'base', 'base'), I('theme', 'light', 'base', 'base'),
  // Pass de progression
  I('frame', 'bronze', 'tier', 'tier', { lvl: 5 }),
  I('perk', 'namecolor', 'tier', 'tier', { lvl: 10 }),
  I('theme', 'contrast', 'tier', 'tier', { lvl: 15 }),
  I('perk', 'regular', 'tier', 'tier', { lvl: 20 }),
  I('frame', 'crosshair', 'tier', 'tier', { lvl: 25 }),
  I('frame', 'silver', 'tier', 'tier', { lvl: 30 }),
  I('perk', 'emote', 'tier', 'tier', { lvl: 30 }),
  ...['nebula', 'arena', 'forest', 'ember', 'neon'].map(k => I('bg', k, 'tier', 'tier', { lvl: 40 })),
  I('banner', 'radar', 'tier', 'tier', { lvl: 45, anim: true }),
  I('frame', 'gold', 'tier', 'tier', { lvl: 50 }),
  ...['sharpshooter', 'grinder', 'strategist', 'clutch'].map(k => I('title', k, 'tier', 'tier', { lvl: 50 })),
  I('perk', 'beta', 'tier', 'tier', { lvl: 65 }),
  I('frame', 'obsidian', 'tier', 'tier', { lvl: 70, anim: true }),
  I('theme', 'jade', 'tier', 'tier', { lvl: 80 }),
  I('banner', 'eclipse', 'tier', 'tier', { lvl: 90, anim: true }),
  I('frame', 'jade_anim', 'tier', 'tier', { lvl: 100, anim: true }),
  I('title', 'veteran', 'tier', 'tier', { lvl: 100 }),
  // Caisses
  I('frame', 'copper', 'common', 'crate'), I('frame', 'slate', 'common', 'crate'),
  I('banner', 'topo', 'common', 'crate'), I('banner', 'slate', 'common', 'crate'),
  I('banner', 'mist', 'rare', 'crate'), I('frame', 'emerald', 'rare', 'crate'), I('frame', 'glacier', 'rare', 'crate'),
  I('banner', 'dusk', 'epic', 'crate'), I('frame', 'goldsolid', 'legend', 'crate'),
  I('frame', 'pulse', 'rare', 'crate', { anim: true }), I('frame', 'neon', 'rare', 'crate', { anim: true }),
  I('banner', 'aurora_live', 'rare', 'crate', { anim: true }), I('banner', 'wave', 'rare', 'crate', { anim: true }),
  I('frame', 'flux', 'epic', 'crate', { anim: true }), I('banner', 'particles', 'epic', 'crate', { anim: true }),
  I('frame', 'prism', 'legend', 'crate', { anim: true }), I('banner', 'comet', 'legend', 'crate', { anim: true }),
  I('frame', 'crimson', 'common', 'crate'), I('banner', 'tactical', 'common', 'crate'),
  I('frame', 'cobalt', 'rare', 'crate'), I('banner', 'inferno', 'rare', 'crate'),
  I('frame', 'ember', 'epic', 'crate', { anim: true }), I('banner', 'glitch', 'epic', 'crate', { anim: true }),
  I('title', 'visionary', 'common', 'crate'), I('title', 'grindset', 'common', 'crate'), I('frame', 'basicplus', 'common', 'crate'),
  I('title', 'tryhard', 'rare', 'crate'), I('banner', 'circuit', 'rare', 'crate'), I('title', 'tracker', 'rare', 'crate'),
  I('title', 'localleg', 'epic', 'crate'), I('banner', 'holo', 'epic', 'crate', { anim: true }), I('title', 'flickgod', 'epic', 'crate'),
  I('frame', 'mystery', 'legend', 'crate', { anim: true }), I('title', 'untouchable', 'legend', 'crate'),
  // Secrets
  I('banner', 'darkmatter', 'secret', 'secret', { anim: true }), I('frame', 'darkmatter', 'secret', 'secret'), I('title', 'darkmatter', 'secret', 'secret'),
  I('banner', 'sakura', 'secret', 'secret', { anim: true }), I('frame', 'sakura', 'secret', 'secret'), I('title', 'sakura', 'secret', 'secret'),
];
export const ITEM = Object.fromEntries(ITEMS.map(i => [i.id, i]));

export const CRATES = {
  static: { cost: 150, art: 'static', pool: ['frame:copper', 'frame:slate', 'banner:topo', 'banner:slate', 'banner:mist', 'frame:emerald', 'frame:glacier', 'banner:dusk', 'frame:goldsolid', 'frame:crimson', 'banner:tactical', 'frame:cobalt', 'banner:inferno'] },
  animated: { cost: 350, art: 'animated', pool: ['frame:pulse', 'frame:neon', 'banner:aurora_live', 'banner:wave', 'frame:flux', 'banner:particles', 'frame:prism', 'banner:comet', 'frame:ember', 'banner:glitch'] },
  mixed: { cost: 220, art: 'mixed', pool: ['title:visionary', 'title:grindset', 'frame:basicplus', 'title:tryhard', 'banner:circuit', 'title:tracker', 'title:localleg', 'banner:holo', 'title:flickgod', 'frame:mystery', 'title:untouchable'] },
};
export function crateOdds(key) {
  const pool = CRATES[key].pool.map(id => ITEM[id]);
  const tot = pool.reduce((s, it) => s + RARITY_W[it.rarity], 0);
  const byItem = pool.map(it => ({ it, p: RARITY_W[it.rarity] / tot * 100 }));
  const byRarity = {};
  byItem.forEach(x => { byRarity[x.it.rarity] = (byRarity[x.it.rarity] || 0) + x.p; });
  return { byItem, byRarity };
}

// Pass de progression : paliers et récompenses réelles.
export const TIERS = [
  { lvl: 5, key: 'bronze', items: ['frame:bronze'] },
  { lvl: 10, key: 'namecolor', items: ['perk:namecolor'] },
  { lvl: 15, key: 'contrast', items: ['theme:contrast'] },
  { lvl: 20, key: 'regular', items: ['perk:regular'] },
  { lvl: 25, key: 'crosshair', items: ['frame:crosshair'] },
  { lvl: 30, key: 'silver', items: ['frame:silver', 'perk:emote'] },
  { lvl: 40, key: 'bgs', items: ['bg:nebula', 'bg:arena', 'bg:forest', 'bg:ember', 'bg:neon'] },
  { lvl: 45, key: 'radar', items: ['banner:radar'] },
  { lvl: 50, key: 'gold', items: ['frame:gold', 'title:sharpshooter', 'title:grinder', 'title:strategist', 'title:clutch'] },
  { lvl: 65, key: 'beta', items: ['perk:beta'] },
  { lvl: 70, key: 'obsidian', items: ['frame:obsidian'] },
  { lvl: 80, key: 'jadetheme', items: ['theme:jade'] },
  { lvl: 90, key: 'eclipse', items: ['banner:eclipse'] },
  { lvl: 100, key: 'veteran', items: ['frame:jade_anim', 'title:veteran'] },
];

// ---- Arcade (espérance de gain ≤ 1 pour chaque jeu) ----
export const ARCADE = {
  dailyLimit: 15, crateDailyLimit: 10, minAge: 18,
  wheel: { stake: 20, segs: [{ m: 0, w: 35 }, { m: .5, w: 25 }, { m: 1, w: 10 }, { m: 2, w: 12 }, { m: 1, w: 10 }, { m: 3, w: 5 }, { m: 5, w: 2 }, { m: 10, w: 1 }] },
  coinflip: { stake: 10, mult: 2 },
  mystery: { stake: 15, mult: 6 },
};
export function wheelEV() { const s = ARCADE.wheel.segs, tot = s.reduce((a, x) => a + x.w, 0); return s.reduce((a, x) => a + x.m * x.w, 0) / tot; }

// ---- Forum ----
export const CATS = [
  { id: 'perf', color: 'var(--jade)' }, { id: 'advice', color: 'var(--blue)' }, { id: 'setup', color: 'var(--violet)' },
  { id: 'challenge', color: 'var(--amber)' }, { id: 'team', color: 'var(--danger)' },
];
export const catColor = id => (CATS.find(c => c.id === id) || CATS[0]).color;

// ---- Rôles ----
export const ROLES = ['member', 'support', 'mod', 'admin'];
export const ADMIN_HASH = 'ff178d9a9f02011a3b076ac291106f6f6961598658d64709525a8e08c6136508';
