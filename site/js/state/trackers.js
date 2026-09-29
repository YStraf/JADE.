import { CLOUD } from '../data/cloud-config.js';
// Statistiques de jeu des widgets CS2, FACEIT et Valorant.
// Les API officielles (Steam/Leetify, FACEIT Data API, Riot) demandent une clé secrète : elles passeront
// par le serveur de la refonte (Supabase Edge Functions, voir specs/). En attendant, le site statique
// affiche un aperçu stable calculé à partir de l'identifiant saisi, marqué « Aperçu » dans le widget.
function rng(seed) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
}
const MAPS = {
  cs2: ['Mirage', 'Inferno', 'Nuke', 'Ancient', 'Anubis', 'Dust II', 'Train'],
  valorant: ['Ascent', 'Bind', 'Haven', 'Lotus', 'Split', 'Sunset', 'Icebox'],
};
export const VAL_TIERS = [['iron', '#8b8b8b'], ['bronze', '#b0804a'], ['silver', '#c6ccd0'], ['gold', '#e8c04a'], ['platinum', '#4bb8c4'], ['diamond', '#c286f0'], ['ascendant', '#3fc07c'], ['immortal', '#e2465f'], ['radiant', '#ffe58a']];
const FACEIT_ELO = [0, 501, 751, 901, 1051, 1201, 1351, 1531, 1751, 2001];
const FACEIT_C = ['#eeeeee', '#1ce400', '#1ce400', '#ffc800', '#ffc800', '#ffc800', '#ffc800', '#ff6309', '#ff6309', '#fe1f00'];
const PREMIER_C = [[5000, '#b0c3d9'], [10000, '#8cc6ff'], [15000, '#6a7dff'], [20000, '#c166ff'], [25000, '#f03cff'], [30000, '#eb4b4b'], [Infinity, '#ffd700']];

export function trackerStats(game, handle) {
  const r = rng(game + ':' + String(handle).trim().toLowerCase());
  const maps = MAPS[game === 'valorant' ? 'valorant' : 'cs2'];
  const matches = Array.from({ length: 5 }, () => {
    const k = 8 + Math.floor(r() * 22), d = 8 + Math.floor(r() * 18), a = 2 + Math.floor(r() * 10), win = r() > .45;
    const lose = 3 + Math.floor(r() * 10);
    return { map: maps[Math.floor(r() * maps.length)], win, score: win ? '13-' + lose : lose + '-13', k, d, a, hs: 22 + Math.floor(r() * 38) };
  });
  const K = matches.reduce((s, m) => s + m.k, 0), D = matches.reduce((s, m) => s + m.d, 0);
  const base = { matches, kd: (K / Math.max(1, D)).toFixed(2), hs: Math.round(matches.reduce((s, m) => s + m.hs, 0) / 5), win: 40 + Math.floor(r() * 25) };
  if (game === 'cs2') { const rating = 4000 + Math.floor(r() * 26000); return { ...base, rating, c: PREMIER_C.find(x => rating < x[0])[1] }; }
  if (game === 'faceit') { const elo = 400 + Math.floor(r() * 2400); const lvl = FACEIT_ELO.filter(x => elo >= x).length; return { ...base, elo, lvl, c: FACEIT_C[lvl - 1] }; }
  const ti = Math.min(8, Math.floor(r() * 9)); const [tier, c] = VAL_TIERS[ti];
  return { ...base, tier, div: tier === 'radiant' ? 0 : 1 + Math.floor(r() * 3), c };
}

// Vérification simple de l'identifiant saisi pour chaque jeu.
export function validHandle(game, h) {
  h = String(h || '').trim();
  if (game === 'valorant') return /^[^#]{3,16}#[A-Za-z0-9]{3,5}$/.test(h);
  if (game === 'cs2') return /^(7656\d{13}|https:\/\/steamcommunity\.com\/(id|profiles)\/[A-Za-z0-9_-]{2,64}\/?|[A-Za-z0-9_-]{2,32})$/.test(h);
  return /^[A-Za-z0-9_-]{3,32}$/.test(h);
}
export function shortHandle(h) { const m = String(h).match(/steamcommunity\.com\/(?:id|profiles)\/([^/]+)/); return m ? m[1] : String(h); }

// Vraies stats via le serveur Jade (fonction « tracker », voir supabase/functions) quand il est configuré.
export async function liveStats(game, handle) {
  if (!CLOUD.url || !CLOUD.anonKey) return null;
  try {
    const r = await fetch(CLOUD.url + '/functions/v1/tracker?game=' + encodeURIComponent(game) + '&id=' + encodeURIComponent(handle), { headers: { apikey: CLOUD.anonKey, Authorization: 'Bearer ' + CLOUD.anonKey } });
    if (!r.ok) return null; const j = await r.json(); return j && j.matches ? j : null;
  } catch (e) { return null; }
}
