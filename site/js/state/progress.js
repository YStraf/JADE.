// XP, niveaux, séances, records, série, rang, badges.
import { us } from '../core/store.js';
import { emit } from '../core/bus.js';
import { dayKey } from '../core/dom.js';
import { pop } from '../core/toast.js';
import { SFX } from '../core/sfx.js';
import { t } from '../core/i18n.js';
import { XP_RULES, COIN_RULES, levelFromXP, TESTS, norm, rankOf, BADGES, TIERS, TEST_BOUNDS } from '../data/game.js';
import { addCoins, inventory } from './economy.js';
import { profile } from './account.js';
import { myPostsCount, myChallengeCount } from './community.js';

export function xpData() { return us.get('xp', { total: 0, events: [], done: {} }); }
export function level() { return levelFromXP(xpData().total); }

// Attribue l'XP d'une action (une seule fois par clé) + les coins associés.
export function awardXP(type, key, label, { silent = false } = {}) {
  const amount = XP_RULES[type]; if (amount == null) return null;
  const x = xpData(); const k = type + ':' + (key || '');
  if (x.done[k]) return null;
  x.done[k] = 1;
  const before = levelFromXP(x.total).lvl;
  x.total += amount; x.events.unshift({ t: Date.now(), type, xp: amount, l: label || '' }); x.events = x.events.slice(0, 80);
  us.set('xp', x);
  const after = levelFromXP(x.total).lvl;
  if (!silent && amount) pop('+' + amount + ' XP · ' + t('xp.type.' + type), '');
  // Coins liés à l'action
  let c = 0;
  if (type === 'session') {
    const d = dayKey(Date.now()), cnt = us.get('sessCoins', {});
    if ((cnt[d] || 0) < COIN_RULES.sessionDailyCap) { cnt[d] = (cnt[d] || 0) + 1; us.set('sessCoins', { [d]: cnt[d] }); c += addCoins(COIN_RULES.session, 'session', 'c:' + k, label); }
  }
  if (type === 'record_test') c += addCoins(COIN_RULES.record_test, 'record', 'c:' + k, label);
  // Palier tous les 5 niveaux
  for (let l = before + 1; l <= after; l++) if (l % 5 === 0) c += addCoins(COIN_RULES.level_milestone, 'milestone', 'lvl:' + l, String(l));
  if (c > 0 && !silent) setTimeout(() => pop('+' + c + ' coins', 'coins'), 250);
  if (after > before) {
    setTimeout(() => { pop(t('xp.levelUp', { n: after }), 'level'); SFX.enter(); }, 600);
    TIERS.filter(tr => tr.lvl > before && tr.lvl <= after).forEach((tr, i) => setTimeout(() => pop(t('pass.unlocked', { name: t('tier.' + tr.key + '.name') }), 'level'), 1200 + i * 500));
  }
  emit('xp');
  return { xp: amount, before, after, coins: c };
}
export function adminGrantXP(n, id) {
  const get = () => id ? us.getFor(id, 'xp', { total: 0, events: [], done: {} }) : xpData();
  const x = get(); x.total = Math.max(0, x.total + n); x.events.unshift({ t: Date.now(), type: 'admin', xp: n, l: '' });
  id ? us.setFor(id, 'xp', x) : us.set('xp', x); emit('xp');
}
export function setTotalXP(total) { const x = xpData(); x.total = Math.max(0, total); us.set('xp', x); emit('xp'); }

// ---- Jours d'activité et série ----
export function markActive(ts = Date.now()) {
  const days = us.get('days', []); const d = dayKey(ts);
  if (!days.includes(d)) { days.push(d); us.set('days', days.slice(-400)); }
  scanStreak();
}
export function activeDays() { const s = new Set(us.get('days', [])); runs().forEach(r => s.add(dayKey(r.date))); return s; }
export function streakInfo() {
  const days = activeDays(); const today = new Date(); today.setHours(0, 0, 0, 0);
  let n = 0; const cur = new Date(today);
  if (!days.has(dayKey(cur))) cur.setDate(cur.getDate() - 1);
  while (days.has(dayKey(cur))) { n++; cur.setDate(cur.getDate() - 1); }
  const week = []; const start = new Date(today); start.setDate(start.getDate() - 6);
  for (let i = 0; i < 7; i++) { const d = new Date(start); d.setDate(start.getDate() + i); week.push({ day: d.getDay(), on: days.has(dayKey(d)) }); }
  return { n, week };
}
function scanStreak() {
  const st = streakInfo();
  for (let i = 0; i < st.n; i++) { const d = new Date(); d.setDate(d.getDate() - i); awardXP('streak_day', dayKey(d), '', { silent: i > 0 }); }
  if (st.n > 0 && st.n % 7 === 0) { const got = addCoins(COIN_RULES.streak_week, 'streak', 'sw:' + dayKey(Date.now()) + ':' + st.n, String(st.n)); if (got) pop('+' + got + ' coins · ' + t('coins.reason.streak', { n: st.n }), 'coins'); }
}

// ---- Séances importées (Kovaak's) ----
export function runs() { return us.get('runs', []); }
export function saveRuns(r) { us.set('runs', r); emit('xp'); }
export function parseCSV(name, text) {
  let scen = null, date = null;
  const m = name.match(/^(.*?) - .*? - (\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2})/);
  if (m) { scen = m[1]; date = new Date(+m[2], m[3] - 1, +m[4], +m[5], +m[6], +m[7]).getTime(); }
  let score = null, hit = null, missed = null;
  text.split(/\r?\n/).forEach(l => {
    const p = l.split(','), k = (p[0] || '').trim().toLowerCase();
    if (k === 'score:') score = parseFloat(p[1]);
    if (k === 'scenario:' && !scen) scen = (p[1] || '').trim();
    if (k === 'hit count:') hit = parseFloat(p[1]);
    if (k === 'miss count:') missed = parseFloat(p[1]);
  });
  if (!scen || score == null || isNaN(score)) return null;
  if (date && (date > Date.now() + 864e5 || date < Date.now() - 5 * 365 * 864e5)) return null;
  const acc = (hit != null && missed != null && hit + missed > 0) ? hit / (hit + missed) * 100 : null;
  return { scen, date: date || Date.now(), score, acc, file: name };
}
export async function importFiles(files) {
  const list = runs(); const known = new Set(list.map(r => r.file)); let added = 0, bad = 0;
  const best = {}; list.forEach(r => { best[r.scen] = Math.max(best[r.scen] || 0, r.score); });
  for (const f of files) {
    if (!f.name.toLowerCase().endsWith('.csv')) { bad++; continue; }
    if (known.has(f.name)) continue;
    const r = parseCSV(f.name, await f.text());
    if (!r) { bad++; continue; }
    list.push(r); known.add(f.name); added++;
    awardXP('session', r.file, r.scen, { silent: added > 3 });
    if (best[r.scen] != null && r.score > best[r.scen]) awardXP('record_scen', r.scen + ':' + r.score, r.scen, { silent: added > 3 });
    best[r.scen] = Math.max(best[r.scen] || 0, r.score);
  }
  list.sort((a, b) => a.date - b.date); saveRuns(list); scanStreak();
  return { added, bad };
}

// ---- Records des tests ----
export function bests() { return us.get('bests', {}); }
export function bestOf(k) { const b = bests()[k]; return b == null ? null : b; }
export function submitTest(k, val) {
  const b = bests(); const prev = b[k]; const cfg = TESTS[k];
  if (!TEST_BOUNDS[k](val)) return { better: false, prev, award: null, invalid: true };
  const better = prev == null || (cfg.lower ? val < prev : val > prev);
  if (better) { b[k] = val; us.set('bests', b); }
  markActive(); awardXP('test_day', k + ':' + dayKey(Date.now()), k, { silent: true });
  let award = null; if (better) award = awardXP('record_test', k + ':' + val, t('test.' + k + '.name'));
  emit('xp'); return { better, prev, award };
}

// ---- Rang ----
export function aimScore(b = bests()) { const parts = Object.keys(TESTS).map(k => norm(k, b[k])).filter(v => v != null); return parts.length < 3 ? null : parts.reduce((a, c) => a + c, 0) / parts.length; }
export function assiduity() { const days = activeDays(); const now = Date.now(); let n = 0; days.forEach(d => { const [y, m, dd] = d.split('-').map(Number); if (now - new Date(y, m - 1, dd).getTime() < 30 * 864e5) n++; }); const st = streakInfo().n; return Math.min(100, n / 20 * 100) * .6 + Math.min(100, st / 14 * 100) * .4; }
export function rankPoints() { const a = aimScore(); if (a == null) return null; return Math.round((a * .7 + assiduity() * .3) * 10); }
export function myRank() { return rankOf(rankPoints()); }
export function skillRanks(b = bests()) { return Object.keys(TESTS).map(k => { const n = norm(k, b[k]); return { k, n, rank: n == null ? null : rankOf(Math.round(n * 10)) }; }); }

// ---- Badges ----
export function stats() {
  const r = myRank(); const p = profile();
  return { sessions: runs().length, streak: streakInfo().n, tests: Object.keys(bests()).length, posts: myPostsCount(), links: Object.values(p.links).filter(Boolean).length, items: Object.keys(inventory()).length, rankIndex: r ? r.index : -1, challenges: myChallengeCount(), secrets: (p.secrets || []).length };
}
export function badges() { const s = stats(); return BADGES.map(b => ({ id: b.id, got: b.need(s) })); }
export function minutes() { return us.get('minutes', 0); }
export function addMinute() { us.set('minutes', minutes() + 1); }
