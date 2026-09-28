// Vitrine : grille invisible de 4 colonnes, widgets à tailles imposées (comme sur iPhone).
// Tailles : s (petit), m (moyen), l (grand) + étendues : v (vertical) ou h (horizontal).
export const COLS = 4, ROWS = 12, MAXW = 16;
export const SIZES = { s: [1, 1], sv: [1, 2], m: [2, 1], mh: [4, 1], l: [2, 2], lv: [2, 3], lh: [4, 2] };
export const SHORT = { s: 'S', sv: 'S ↕', m: 'M', mh: 'M ↔', l: 'L', lv: 'L ↕', lh: 'L ↔' };
export const SIZE_GROUPS = [['s', 'sv'], ['m', 'mh'], ['l', 'lv', 'lh']];
const ALL = Object.keys(SIZES), NOS = ALL.filter(s => s !== 's'), WIDE = ['m', 'mh', 'l', 'lv', 'lh'];

// cat : games (trackers), jade (stats du site), perso (personnalisation). stats : masqué si l'utilisateur cache ses scores.
export const WTYPES = {
  cs2: { cat: 'games', icon: 'target', sizes: ALL, def: 'm', cfg: true, stats: true },
  faceit: { cat: 'games', icon: 'trophy', sizes: ALL, def: 'm', cfg: true, stats: true },
  valorant: { cat: 'games', icon: 'spark', sizes: ALL, def: 'm', cfg: true, stats: true },
  records: { cat: 'jade', icon: 'target', sizes: NOS, def: 'm', stats: true },
  rank: { cat: 'jade', icon: 'rank', sizes: ALL, def: 's', stats: true },
  streak: { cat: 'jade', icon: 'fire', sizes: ALL, def: 's', stats: true },
  badges: { cat: 'jade', icon: 'star', sizes: ALL, def: 'm' },
  scen: { cat: 'jade', icon: 'chart', sizes: NOS, def: 'm', stats: true, self: true },
  skills: { cat: 'jade', icon: 'layers', sizes: NOS, def: 'm', stats: true, self: true },
  plan: { cat: 'jade', icon: 'routine', sizes: NOS, def: 'm', self: true },
  image: { cat: 'perso', icon: 'upload', sizes: ALL, def: 'l', cfg: true },
  gif: { cat: 'perso', icon: 'sparkles', sizes: ALL, def: 'm', cfg: true },
  clip: { cat: 'perso', icon: 'play', sizes: WIDE, def: 'l', cfg: true },
  collection: { cat: 'perso', icon: 'crate', sizes: WIDE, def: 'mh', cfg: true },
  text: { cat: 'perso', icon: 'edit', sizes: ALL, def: 'm', cfg: true },
  setup: { cat: 'perso', icon: 'mouse', sizes: NOS, def: 'sv', cfg: true },
};
export const WCATS = ['games', 'jade', 'perso'];

export const dims = w => SIZES[w.size] || SIZES.m;
function occupied(layout, skip) {
  const g = new Set();
  layout.forEach(w => { if (w.id === skip) return; const [cw, ch] = dims(w); for (let i = 0; i < cw; i++) for (let j = 0; j < ch; j++) g.add((w.x + i) + ',' + (w.y + j)); });
  return g;
}
export function fits(layout, size, x, y, skip) {
  const [cw, ch] = SIZES[size];
  if (x < 0 || y < 0 || x + cw > COLS || y + ch > ROWS) return false;
  const g = occupied(layout, skip);
  for (let i = 0; i < cw; i++) for (let j = 0; j < ch; j++) if (g.has((x + i) + ',' + (y + j))) return false;
  return true;
}
export function firstFree(layout, size, skip) {
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (fits(layout, size, x, y, skip)) return { x, y };
  return null;
}
export const rowsUsed = layout => layout.reduce((m, w) => Math.max(m, w.y + dims(w)[1]), 0);

// Ancien format (liste d'encarts cochés) -> grille.
export function layoutFrom(p) {
  if (Array.isArray(p.layout)) return p.layout.filter(w => WTYPES[w.type] && SIZES[w.size]);
  const out = [];
  (p.widgets || ['records', 'streak', 'badges']).filter(k => WTYPES[k]).forEach((type, i) => {
    const size = WTYPES[type].def, at = firstFree(out, size);
    if (at) out.push({ id: 'w' + i, type, size, ...at, cfg: {} });
  });
  return out;
}
