// Petits outils Windows : PowerShell, registre (reg.exe), processus, élévation (UAC).
const { execFile } = require('node:child_process');
const isWin = process.platform === 'win32';
function run(cmd, args, timeout = 20000) {
  return new Promise(res => execFile(cmd, args, { windowsHide: true, timeout, maxBuffer: 8e6 }, (err, out, errOut) => res({ ok: !err, out: String(out || '').trim(), err: String(errOut || (err && err.message) || '').trim() })));
}
const ps = (script, timeout) => run('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', script], timeout);
// Lit une valeur : renvoie { type, data } ou null.
async function regGet(key, name) {
  const r = await run('reg', ['query', key, '/v', name]); if (!r.ok) return null;
  const m = r.out.split(/\r?\n/).map(l => l.trim()).find(l => l.startsWith(name + ' ')); if (!m) return null;
  const p = m.split(/\s{2,}|\t/).filter(Boolean); const type = p[1], raw = p.slice(2).join(' ');
  return { type, data: type === 'REG_DWORD' ? parseInt(raw, 16) : raw };
}
async function regSet(key, name, type, data) { return (await run('reg', ['add', key, '/v', name, '/t', type, '/d', String(data), '/f'])).ok; }
async function regDel(key, name) { return (await run('reg', ['delete', key, '/v', name, '/f'])).ok; }
// Commandes qui demandent les droits administrateur : une seule fenêtre UAC pour la liste.
async function elevated(commands) {
  const body = commands.map(c => c.replace(/'/g, "''")).join('; ');
  const r = await ps("Start-Process -FilePath powershell.exe -Verb RunAs -Wait -WindowStyle Hidden -ArgumentList '-NoProfile','-Command','" + body + "'", 120000);
  return r.ok;
}
async function isRunning(exe) { const r = await run('tasklist', ['/FI', 'IMAGENAME eq ' + exe, '/NH']); return r.ok && r.out.toLowerCase().includes(exe.toLowerCase()); }
module.exports = { isWin, run, ps, regGet, regSet, regDel, elevated, isRunning };
