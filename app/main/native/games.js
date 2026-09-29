// CS2 et Valorant : trouver les fichiers de réglages et appliquer un préréglage graphique
// sur un curseur 0 (performance) → 50 (équilibré) → 100 (qualité). Une copie de sauvegarde est faite avant chaque écriture.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { isWin, regGet, isRunning } = require('./win');

// ---- Steam ----
async function steamPath() {
  if (isWin) { const r = await regGet('HKCU\\Software\\Valve\\Steam', 'SteamPath'); if (r && r.data) return r.data.replace(/\//g, '\\'); }
  const c = [path.join(os.homedir(), '.steam', 'steam'), 'C:\\Program Files (x86)\\Steam'];
  return c.find(p => fs.existsSync(p)) || null;
}
// Dossiers de bibliothèque Steam (libraryfolders.vdf).
function parseLibraries(vdf) { return [...String(vdf).matchAll(/"path"\s+"([^"]+)"/g)].map(m => m[1].replace(/\\\\/g, '\\')); }
async function libraries() {
  const sp = await steamPath(); if (!sp) return [];
  const libs = [sp];
  try { libs.push(...parseLibraries(fs.readFileSync(path.join(sp, 'steamapps', 'libraryfolders.vdf'), 'utf8'))); } catch (e) { /* une seule bibliothèque */ }
  return [...new Set(libs)];
}
const newest = files => files.filter(f => fs.existsSync(f)).sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0] || null;
const backup = f => { const b = f + '.jade-backup'; if (!fs.existsSync(b)) fs.copyFileSync(f, b); return b; };

// ---- CS2 : userdata/<id>/730/local/cfg/cs2_video.txt ----
async function cs2VideoFile() {
  const sp = await steamPath(); if (!sp) return null;
  const ud = path.join(sp, 'userdata'); let dirs = [];
  try { dirs = fs.readdirSync(ud); } catch (e) { return null; }
  return newest(dirs.map(d => path.join(ud, d, '730', 'local', 'cfg', 'cs2_video.txt')));
}
const CS2 = {
  // [performance, équilibré, qualité]
  'setting.msaa_samples': [0, 4, 8], 'setting.r_csgo_cmaa_enable': [0, 0, 0], 'setting.videocfg_shadow_quality': [0, 1, 2],
  'setting.videocfg_dynamic_shadows': [0, 1, 1], 'setting.videocfg_texture_detail': [0, 1, 2], 'setting.r_texturefilteringquality': [1, 3, 5],
  'setting.shaderquality': [0, 0, 1], 'setting.videocfg_particle_detail': [0, 1, 2], 'setting.videocfg_ao_detail': [0, 1, 2],
  'setting.videocfg_fsr_detail': [0, 0, 0], 'setting.r_low_latency': [1, 1, 1], 'setting.mat_vsync': [0, 0, 0],
};
const level = v => (v < 34 ? 0 : v < 67 ? 1 : 2);
// Remplace uniquement les clés déjà présentes dans le fichier (format KeyValues de Valve).
function patchCs2(text, v) {
  const lv = level(v); let n = 0;
  const out = String(text).replace(/^(\s*"(setting\.[\w.]+)"\s+")([^"]*)(")/gm, (m, a, key, val, b) => { if (!(key in CS2)) return m; n++; return a + CS2[key][lv] + b; });
  return { text: out, changed: n };
}
// ---- Valorant : %LOCALAPPDATA%/VALORANT/Saved/Config/<compte>/Windows/GameUserSettings.ini ----
function valorantFile() {
  const base = path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'), 'VALORANT', 'Saved', 'Config');
  let dirs = []; try { dirs = fs.readdirSync(base); } catch (e) { return null; }
  return newest(dirs.map(d => path.join(base, d, 'Windows', 'GameUserSettings.ini')));
}
const VAL_KEYS = ['sg.ViewDistanceQuality', 'sg.AntiAliasingQuality', 'sg.ShadowQuality', 'sg.PostProcessQuality', 'sg.TextureQuality', 'sg.EffectsQuality', 'sg.FoliageQuality', 'sg.ShadingQuality'];
function patchValorant(text, v) {
  const q = v < 34 ? 0 : v < 67 ? 1 : 3; let s = String(text).replace(/\r\n/g, '\n');
  if (!/^\[ScalabilityGroups\]/m.test(s)) s += '\n[ScalabilityGroups]\n';
  const set = (k, val) => { const re = new RegExp('^' + k.replace('.', '\\.') + '=.*$', 'm'); s = re.test(s) ? s.replace(re, k + '=' + val) : s.replace(/^\[ScalabilityGroups\]\n/m, '[ScalabilityGroups]\n' + k + '=' + val + '\n'); };
  set('sg.ResolutionQuality', '100.000000'); VAL_KEYS.forEach(k => set(k, q));
  return { text: s.replace(/\n/g, '\r\n'), changed: VAL_KEYS.length + 1 };
}
async function status() {
  const cs = await cs2VideoFile(), val = valorantFile();
  return { cs2: { found: !!cs, file: cs, running: isWin ? await isRunning('cs2.exe') : false }, valorant: { found: !!val, file: val, running: isWin ? await isRunning('VALORANT-Win64-Shipping.exe') : false } };
}
async function apply(game, v) {
  const st = (await status())[game]; if (!st) return { ok: false, error: 'game' };
  if (!st.found) return { ok: false, error: 'notFound' };
  if (st.running) return { ok: false, error: 'running' };
  const text = fs.readFileSync(st.file, 'utf8'); backup(st.file);
  const r = game === 'cs2' ? patchCs2(text, v) : patchValorant(text, v);
  fs.writeFileSync(st.file, r.text);
  return { ok: true, changed: r.changed, level: level(v) };
}
async function restore(game) {
  const st = (await status())[game]; if (!st || !st.found) return { ok: false };
  const b = st.file + '.jade-backup'; if (!fs.existsSync(b)) return { ok: false, error: 'noBackup' };
  fs.copyFileSync(b, st.file); return { ok: true };
}
module.exports = { status, apply, restore, libraries, steamPath, parseLibraries, patchCs2, patchValorant, level };
