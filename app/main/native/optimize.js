// Optimisations Windows réellement appliquées (et réversibles) depuis l'onglet Optimisation.
// Chaque réglage sait lire son état, s'activer et revenir à la valeur d'origine (sauvegardée au premier changement).
const fs = require('node:fs');
const path = require('node:path');
const { isWin, ps, regGet, regSet, regDel, elevated } = require('./win');
const HKCU = 'HKCU', HKLM = 'HKLM';
const GAMEBAR = HKCU + '\\Software\\Microsoft\\GameBar', GCS = HKCU + '\\System\\GameConfigStore', DVR = HKCU + '\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR';
const MOUSE = HKCU + '\\Control Panel\\Mouse', VFX = HKCU + '\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects';
const BGAPPS = HKCU + '\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications', GFX = HKLM + '\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers';
const HIGH_PERF = '8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c', BALANCED = '381b4222-f694-41f0-9685-da5bb0bd5c73';
// Désactive l'accélération de la souris tout de suite (SystemParametersInfo), sans redémarrer la session.
const setMouse = on => ps("Add-Type -Namespace J -Name U -MemberDefinition '[DllImport(\"user32.dll\")] public static extern bool SystemParametersInfo(int a,int b,int[] c,int d);'; [J.U]::SystemParametersInfo(4,0,[int[]](" + (on ? '0,0,0' : '6,10,1') + "),3) | Out-Null");
const TWEAKS = {
  gameMode: { read: async () => ((await regGet(GAMEBAR, 'AutoGameModeEnabled')) || { data: 1 }).data === 1, keys: [[GAMEBAR, 'AutoGameModeEnabled', 'REG_DWORD', 1]] },
  gameDvr: { read: async () => ((await regGet(GCS, 'GameDVR_Enabled')) || { data: 1 }).data === 0, keys: [[GCS, 'GameDVR_Enabled', 'REG_DWORD', 0], [DVR, 'AppCaptureEnabled', 'REG_DWORD', 0]] },
  mouseAccel: { read: async () => ((await regGet(MOUSE, 'MouseSpeed')) || { data: '1' }).data === '0', keys: [[MOUSE, 'MouseSpeed', 'REG_SZ', '0'], [MOUSE, 'MouseThreshold1', 'REG_SZ', '0'], [MOUSE, 'MouseThreshold2', 'REG_SZ', '0']], after: setMouse },
  visualFx: { read: async () => ((await regGet(VFX, 'VisualFXSetting')) || { data: 0 }).data === 2, keys: [[VFX, 'VisualFXSetting', 'REG_DWORD', 2]], relog: true },
  backgroundApps: { read: async () => ((await regGet(BGAPPS, 'GlobalUserDisabled')) || { data: 0 }).data === 1, keys: [[BGAPPS, 'GlobalUserDisabled', 'REG_DWORD', 1]] },
  powerPlan: {
    read: async () => (await ps('powercfg /getactivescheme')).out.toLowerCase().includes(HIGH_PERF),
    apply: async on => (await ps('powercfg /setactive ' + (on ? HIGH_PERF : BALANCED))).ok,
  },
  hags: { admin: true, reboot: true, read: async () => ((await regGet(GFX, 'HwSchMode')) || { data: 1 }).data === 2, keys: [[GFX, 'HwSchMode', 'REG_DWORD', 2]] },
};
let backupFile = null;
function init(dir) { backupFile = path.join(dir, 'optimisation-backup.json'); }
const loadBackup = () => { try { return JSON.parse(fs.readFileSync(backupFile, 'utf8')); } catch (e) { return {}; } };
const saveBackup = b => { try { fs.writeFileSync(backupFile, JSON.stringify(b, null, 2)); } catch (e) { /* ignoré */ } };
async function status() {
  const out = {};
  for (const [id, tw] of Object.entries(TWEAKS)) out[id] = { on: isWin ? await tw.read().catch(() => false) : false, admin: !!tw.admin, reboot: !!tw.reboot, relog: !!tw.relog };
  return { supported: isWin, tweaks: out };
}
async function set(id, on) {
  const tw = TWEAKS[id]; if (!tw || !isWin) return { ok: false, error: 'unsupported' };
  if (tw.apply) return { ok: await tw.apply(on) };
  const b = loadBackup();
  if (on && !b[id]) { b[id] = []; for (const [k, n] of tw.keys) b[id].push([k, n, await regGet(k, n)]); saveBackup(b); }
  const ops = on ? tw.keys.map(([k, n, t, d]) => ({ k, n, t, d })) : (b[id] || []).map(([k, n, v]) => ({ k, n, t: v && v.type, d: v && v.data, del: !v }));
  if (!on && !ops.length) return { ok: true };
  let ok = true;
  if (tw.admin) ok = await elevated(ops.map(o => o.del ? 'reg delete "' + o.k + '" /v ' + o.n + ' /f' : 'reg add "' + o.k + '" /v ' + o.n + ' /t ' + o.t + ' /d ' + o.d + ' /f'));
  else for (const o of ops) ok = (o.del ? await regDel(o.k, o.n) : await regSet(o.k, o.n, o.t, o.d)) && ok;
  if (tw.after) await tw.after(on);
  if (!on) { delete b[id]; saveBackup(b); }
  return { ok, reboot: !!tw.reboot, relog: !!tw.relog };
}
module.exports = { init, status, set, TWEAKS };
