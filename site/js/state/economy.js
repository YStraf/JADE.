// Jade Coins, inventaire, caisses et Arcade. Monnaie gratuite, sans valeur réelle, jamais achetable.
import { us, store } from '../core/store.js';
import { emit } from '../core/bus.js';
import { dayKey } from '../core/dom.js';
import { ITEM, ITEMS, CRATES, RARITY_W, ARCADE, levelFromXP } from '../data/game.js';
import { isAdminSession, isAdult, me } from './account.js';

export function settings() { return { arcadeEnabled: true, crateMult: 1, announce: '', ...store.get('settings', {}) }; }
export function saveSettings(s) { store.set('settings', s); emit('settings'); }

// ---- Coins ----
export function coins() { return us.get('coins', 0); }
export function coinLog() { return us.get('coinlog', []); }
// Ajoute (ou retire) des coins. key = clé de déduplication facultative. Renvoie le montant réellement appliqué.
export function addCoins(n, reason, key, label) {
  n = Math.round(n); if (!n) return 0;
  if (key) { const done = us.get('coindone', {}); if (done[key]) return 0; done[key] = 1; us.set('coindone', done); }
  const bal = coins(); const applied = n < 0 ? -Math.min(bal, -n) : n;
  us.set('coins', bal + applied);
  const log = coinLog(); log.unshift({ t: Date.now(), n: applied, r: reason, l: label || '' }); us.set('coinlog', log.slice(0, 200));
  if (applied > 0) { const tot = us.get('coinsEarned', 0); us.set('coinsEarned', tot + applied); }
  emit('coins'); return applied;
}
export function spend(n, reason, label) { if (coins() < n) return false; addCoins(-n, reason, null, label); return true; }

// ---- Inventaire ----
export function inventory() { return us.get('inv', {}); }
export function addItem(id, src) { const inv = inventory(); const x = inv[id] || { q: 0, t: Date.now(), src }; x.q++; x.last = Date.now(); inv[id] = x; us.set('inv', inv); emit('inventory'); return x.q === 1; }
export function removeItem(id) { const inv = inventory(); delete inv[id]; us.set('inv', inv); emit('inventory'); }
function level() { return levelFromXP(us.get('xp', { total: 0 }).total).lvl; }
// Un objet est possédé s'il est gratuit, débloqué par le pass, présent dans l'inventaire, ou si la session admin est ouverte.
export function owned(id) {
  const it = ITEM[id]; if (!it) return false;
  if (isAdminSession()) return true;
  if (it.source === 'base') return true;
  if (it.source === 'tier') return level() >= it.lvl;
  return !!inventory()[id];
}
export function ownedOfType(type) { return ITEMS.filter(i => i.type === type && owned(i.id)); }
export function hasPerk(k) { return owned('perk:' + k); }

// ---- Limites quotidiennes ----
function counter(k) { const c = us.get('daily', {}); const d = dayKey(Date.now()); return c.d === d ? (c[k] || 0) : 0; }
function bump(k) { const d = dayKey(Date.now()); let c = us.get('daily', {}); if (c.d !== d) c = { d }; c[k] = (c[k] || 0) + 1; us.set('daily', c); }
export function limits() { return { crates: Math.max(0, ARCADE.crateDailyLimit - counter('crates')), arcade: Math.max(0, ARCADE.dailyLimit - counter('arcade')) }; }

// Aléa cryptographique (pas de Math.random pour les tirages).
export function rand(n) { const a = new Uint32Array(1); const lim = Math.floor(0xffffffff / n) * n; let x; do { crypto.getRandomValues(a); x = a[0]; } while (x >= lim); return x % n; }
function weighted(list, w) { const tot = list.reduce((s, x) => s + w(x), 0); let r = rand(tot); for (const x of list) { r -= w(x); if (r < 0) return x; } return list[list.length - 1]; }

// ---- Caisses ----
export function crateCost(k) { return Math.max(1, Math.round(CRATES[k].cost * (settings().crateMult || 1))); }
// Renvoie { error } ou { item, fresh }.
export function openCrate(k) {
  if (!me()) return { error: 'shop.err.account' };
  if (limits().crates <= 0) return { error: 'shop.err.limit' };
  const cost = crateCost(k);
  if (coins() < cost) return { error: 'shop.err.funds' };
  const item = weighted(CRATES[k].pool.map(id => ITEM[id]), it => RARITY_W[it.rarity]);
  spend(cost, 'crate', k); bump('crates');
  const fresh = addItem(item.id, 'crate');
  const hist = us.get('openings', []); hist.unshift({ t: Date.now(), c: k, i: item.id }); us.set('openings', hist.slice(0, 100));
  return { item, fresh };
}

// ---- Arcade ----
export function arcadeStatus() {
  const ex = us.get('arcadeExclusion', null);
  if (!settings().arcadeEnabled) return 'disabled';
  if (!me()) return 'account';
  if (!isAdult()) return 'underage';
  if (ex && (ex.until === null || ex.until > Date.now())) return 'excluded';
  if (limits().arcade <= 0) return 'limit';
  return 'ok';
}
export function excludeArcade(days) { us.set('arcadeExclusion', { until: days ? Date.now() + days * 864e5 : null }); emit('coins'); }
function play(stake) { const s = arcadeStatus(); if (s !== 'ok') return { error: 'arcade.err.' + s }; if (!spend(stake, 'arcade', 'stake')) return { error: 'shop.err.funds' }; bump('arcade'); return null; }
export function playWheel() {
  const cfg = ARCADE.wheel; const err = play(cfg.stake); if (err) return err;
  const idx = cfg.segs.indexOf(weighted(cfg.segs, s => s.w)); const m = cfg.segs[idx].m; const win = Math.round(cfg.stake * m);
  return { idx, m, win };
}
export function playCoinflip(side) {
  const cfg = ARCADE.coinflip; const err = play(cfg.stake); if (err) return err;
  const res = rand(2) ? 'heads' : 'tails'; const win = res === side ? cfg.stake * cfg.mult : 0;
  return { res, win };
}
export function playMystery(cell) {
  const cfg = ARCADE.mystery; const err = play(cfg.stake); if (err) return err;
  const good = rand(9); const win = good === cell ? cfg.stake * cfg.mult : 0;
  return { good, win };
}
export function payout(win, game) { if (win > 0) addCoins(win, 'arcade', null, game); }
