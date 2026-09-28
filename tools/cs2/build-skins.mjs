// Génère site/data/cs2-skins.json (liste compacte de tous les skins CS2) depuis l'API libre ByMykel/CSGO-API (MIT).
// Usage : node tools/cs2/build-skins.mjs   (relancer après une mise à jour du jeu)
import { writeFileSync, mkdirSync } from 'node:fs';
const SRC = 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json';
const IMG = 'https://community.akamai.steamstatic.com/economy/image/';
const RAR = ['consumer', 'industrial', 'milspec', 'restricted', 'classified', 'covert', 'gold', 'contraband'];
const RMAP = { rarity_common_weapon: 0, rarity_uncommon_weapon: 1, rarity_rare_weapon: 2, rarity_mythical_weapon: 3, rarity_legendary_weapon: 4, rarity_ancient_weapon: 5, rarity_ancient: 5, rarity_contraband_weapon: 7 };
const CATS = ['Pistols', 'Rifles', 'SMGs', 'Heavy', 'Knives', 'Gloves', 'Equipment'];
const list = await (await fetch(SRC)).json();
const items = list.filter(s => s.image && s.image.startsWith(IMG)).map(s => {
  const rar = s.name.startsWith('★') ? 6 : (RMAP[s.rarity.id] ?? 2);
  const flags = (s.stattrak ? 1 : 0) | (s.souvenir ? 2 : 0);
  return [s.name, Math.max(0, CATS.indexOf(s.category && s.category.name)), rar, +(s.min_float ?? 0).toFixed(3), +(s.max_float ?? 1).toFixed(3), flags, s.image.slice(IMG.length)];
}).sort((a, b) => a[0].localeCompare(b[0]));
mkdirSync('site/data', { recursive: true });
writeFileSync('site/data/cs2-skins.json', JSON.stringify({ v: new Date().toISOString().slice(0, 10), img: IMG, rar: RAR, cats: CATS, items }));
console.log(items.length, 'skins');
