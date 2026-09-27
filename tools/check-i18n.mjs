// Vérifie que toutes les clés utilisées existent en français, et que chaque langue couvre tout (interface + contenu).
// Usage : node tools/check-i18n.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'site', 'js');
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith('.js') ? [p] : []; });
const files = walk(root).filter(f => !f.includes('/i18n/') && !f.includes('/content/'));
const used = new Set();
for (const f of files) for (const m of readFileSync(f, 'utf8').matchAll(/\bt\('([a-zA-Z0-9_]+\.[a-zA-Z0-9_.]+)'(?!\s*\+)/g)) used.add(m[1]);
const imp = p => import(pathToFileURL(join(root, p)).href).then(m => m.default ?? m);
const G = await imp('data/game.js'); const R = await imp('data/routines.js');
const add = (...ks) => ks.forEach(k => used.add(k));
['home', 'routines', 'tests', 'progression', 'optimisation', 'challenges', 'ranks', 'pass', 'forum', 'shop', 'news', 'security', 'pricing', 'app', 'profile', 'legal'].forEach(k => add('nav.' + k, 'nav.' + k + '.desc'));
['train', 'compete', 'community', 'info'].forEach(k => add('nav.g.' + k));
Object.keys(G.TESTS).forEach(k => ['name', 'short', 'desc', 'hint'].forEach(s => add('test.' + k + '.' + s)));
G.RANKS.forEach(r => add('rank.' + r.id));
R.ROUTINES.forEach(r => { add('rt.f.' + r.focus, 'rt.n.' + r.focus); if (r.v) add('rt.v.' + r.v); }); Object.keys(R.SCEN_LIB).forEach(k => add('lib.' + k));
G.TIERS.forEach(tr => add('tier.' + tr.key + '.name', 'tier.' + tr.key + '.desc'));
G.ITEMS.forEach(i => add('item.' + i.type + '.' + i.key));
['common', 'rare', 'epic', 'legend', 'base', 'tier', 'secret'].forEach(r => add('rarity.' + r));
G.BADGES.forEach(b => add('badge.' + b.id, 'badge.' + b.id + '.how'));
Object.keys(G.XP_RULES).forEach(k => { add('xp.type.' + k); if (G.XP_RULES[k] > 0) add('xp.type.' + k + '.how'); });
['session', 'record', 'streak', 'milestone', 'challenge', 'crate', 'arcade', 'admin', 'adminRemove'].forEach(k => add('coins.reason.' + k));
Object.keys(G.CRATES).forEach(k => add('crate.' + k, 'crate.' + k + '.desc'));
['all', ...R.LEVELS].forEach(k => add('level.' + k)); ['all', 'cs2', 'valorant', 'both'].forEach(k => add('game.' + k));
R.TYPES.forEach(k => add('type.' + k)); Object.keys(R.GOALS).forEach(k => add('goal.' + k)); ['clicking', 'tracking', 'precision', 'switching', 'reaction', 'other'].forEach(k => add('skill.' + k));
['all', ...G.CATS.map(c => c.id)].forEach(k => add('cat.' + k)); ['spam', 'cheat', 'scam', 'harass', 'illegal', 'other'].forEach(k => add('report.' + k)); G.ROLES.forEach(k => add('role.' + k));
['account', 'showcase', 'xp', 'inventory', 'security', 'perso', 'notif', 'sub', 'support', 'data'].forEach(k => add('profile.tab.' + k));
['crates', 'inventory', 'arcade', 'earn', 'history'].forEach(k => add('shop.tab.' + k)); ['account', 'limit', 'funds'].forEach(k => add('shop.err.' + k));
['disabled', 'account', 'underage', 'excluded'].forEach(k => add('arcade.gate.' + k, 'arcade.gate.' + k + '.sub')); ['disabled', 'account', 'underage', 'excluded', 'limit'].forEach(k => add('arcade.err.' + k)); add('arcade.heads', 'arcade.tails');
['dash', 'users', 'economy', 'items', 'brand', 'forum', 'challenge', 'content', 'tickets', 'logs', 'settings'].forEach(k => add('adm.tab.' + k)); ['open', 'accepted', 'rejected', 'closed'].forEach(k => add('adm.st.' + k));
[1, 2, 3, 4].forEach(i => add('adm.modRule' + i, 'challenge.rule' + i)); [1, 2, 3, 4, 5].forEach(i => add('ranks.how' + i));
['title', 'scen', 'scenAim', 'prize'].forEach(k => add('adm.ch.' + k)); add('adm.log.ban', 'adm.log.unban', 'adm.log.hide', 'adm.log.show');
['ok', 'pending', 'required', 'notreq'].forEach(k => add('challenge.v.' + k));
['weekly', 'challenge', 'replies', 'news'].forEach(k => add('notif.' + k, 'notif.' + k + '.sub')); ['tech', 'billing', 'content', 'scam', 'other'].forEach(k => add('support.s.' + k));
['steam', 'faceit', 'google', 'riot'].forEach(k => add('sec.link.' + k)); ['mentions', 'cgu', 'cgv', 'privacy', 'cookies', 'community', 'challenges', 'coins', 'accessibility', 'report'].forEach(k => add('legal.short.' + k));
['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].forEach(k => add('day.' + k)); ['records', 'scen', 'skills', 'streak', 'badges', 'rank', 'plan'].forEach(k => add('wg.' + k)); ['zoom', 'x', 'y'].forEach(k => add('crop.' + k));
['challenge', 'session', 'streak', 'record', 'milestone'].forEach(k => add('earn.' + k, 'earn.' + k + '.how')); ['pages', 'routines', 'opti', 'security', 'legal', 'settings', 'tests'].forEach(k => add('search.g.' + k));
['pseudo', 'email', 'password', 'birth', 'age', 'terms', 'emailTaken', 'pseudoTaken', 'bad', 'banned'].forEach(k => add('auth.err.' + k)); ['planned', 'study', 'online', 'progress', 'notStarted'].forEach(k => add('app.' + k));
const fr = await imp('i18n/fr.js');
let bad = 0;
const miss = [...used].filter(k => !(k in fr)).sort(); if (miss.length) { bad++; console.log('Clés utilisées absentes de fr :', miss.length, '\n  ' + miss.join('\n  ')); }
const unused = Object.keys(fr).filter(k => !used.has(k)); if (unused.length) console.log('(info) clés fr non détectées dans le code :', unused.length, unused.slice(0, 40).join(', '));
// Comparaison de structure du contenu
const shape = (o, p = '') => o && typeof o === 'object' ? Object.entries(o).flatMap(([k, v]) => shape(v, p + '.' + k)) : [p];
const frC = await imp('content/fr.js');
for (const l of ['en', 'es', 'de', 'it', 'pl']) {
  let ui, c; try { ui = await imp('i18n/' + l + '.js'); c = await imp('content/' + l + '.js'); } catch (e) { console.log(l, ': fichier absent'); bad++; continue; }
  const m = Object.keys(fr).filter(k => !(k in ui)); const extra = Object.keys(ui).filter(k => !(k in fr));
  const sf = new Set(shape(frC)), sl = new Set(shape(c)); const cm = [...sf].filter(k => !sl.has(k)); const same = shape(frC).filter(k => { const get = (o, p) => p.split('.').slice(1).reduce((a, x) => a && a[x], o); const a = get(frC, k), b = get(c, k); return typeof a === 'string' && a.length > 25 && a === b; });
  const sameUi = Object.keys(fr).filter(k => typeof fr[k] === 'string' && fr[k].length > 18 && ui[k] === fr[k]);
  console.log(l + ' : interface manquantes ' + m.length + ', en trop ' + extra.length + ', identiques au FR ' + sameUi.length + ' | contenu manquant ' + cm.length + ', non traduit ' + same.length);
  if (m.length) console.log('   ', m.slice(0, 30).join(', ')); if (cm.length) console.log('   ', cm.slice(0, 20).join(', ')); if (same.length) console.log('    non traduit :', same.slice(0, 10).join(', ')); if (sameUi.length) console.log('    UI identique :', sameUi.slice(0, 15).join(', '));
  if (m.length || cm.length) bad++;
}
process.exit(bad ? 1 : 0);
