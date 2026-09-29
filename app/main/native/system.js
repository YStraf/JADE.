// Scan du PC (GPU, CPU, RAM, écran) et note de puissance 0-100 pour conseiller les graphismes.
const os = require('node:os');
const { isWin, ps } = require('./win');
const GPU_TIERS = [
  [/rtx\s*50[89]0|rtx\s*4090|rx\s*79[05]0\s*xtx/i, 98], [/rtx\s*50[67]0|rtx\s*40[78]0|rtx\s*3090|rx\s*79[05]0|rx\s*9070/i, 90],
  [/rtx\s*4060|rtx\s*30[78]0|rx\s*6[89][05]0|rx\s*7[78]00|arc\s*b580/i, 80], [/rtx\s*3060|rtx\s*20[78]0|rx\s*6[67][05]0|rx\s*7600|arc\s*a7/i, 68],
  [/rtx\s*3050|rtx\s*2060|gtx\s*16[67]0|gtx\s*10[78]0|rx\s*5[67]00|rx\s*6600/i, 55], [/gtx\s*1650|gtx\s*1060|rx\s*5[78]0|rx\s*6500/i, 42],
  [/gtx\s*10[35]0|gt\s*\d|rx\s*[45][56]0/i, 30], [/intel.*(uhd|iris|hd)|radeon\(tm\)\s*graphics|radeon graphics|vega\s*\d/i, 15],
];
function gpuScore(name) { for (const [re, s] of GPU_TIERS) if (re.test(name || '')) return s; return /rtx|rx\s*\d{4}/i.test(name || '') ? 60 : 35; }
function scoreOf(h) {
  const g = gpuScore(h.gpu), c = Math.min(100, (h.threads || 4) * 5 + ((h.cpuMhz || 3000) - 2500) / 40), r = Math.min(100, (h.ramGB || 8) * 4);
  return Math.round(g * .65 + c * .2 + r * .15);
}
// Réglage conseillé sur le curseur (0 = performance, 50 = équilibré, 100 = qualité).
const recommend = s => (s >= 85 ? 60 : s >= 65 ? 45 : s >= 45 ? 30 : 10);
async function scan() {
  const cpus = os.cpus() || [];
  const base = { platform: process.platform, cpu: cpus[0] ? cpus[0].model.trim() : '', threads: cpus.length, cpuMhz: cpus[0] ? cpus[0].speed : 0, ramGB: Math.round(os.totalmem() / 2 ** 30), gpu: '', vramGB: null, hz: null, res: null };
  if (isWin) {
    const r = await ps("$g=Get-CimInstance Win32_VideoController | Select-Object Name,CurrentRefreshRate,CurrentHorizontalResolution,CurrentVerticalResolution; $m=Get-ItemProperty 'HKLM:\\SYSTEM\\ControlSet001\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0*' -Name HardwareInformation.qwMemorySize -ErrorAction SilentlyContinue | ForEach-Object { $_.'HardwareInformation.qwMemorySize' }; $c=Get-CimInstance Win32_Processor | Select-Object -First 1 Name,MaxClockSpeed; @{gpu=@($g);mem=@($m);cpu=$c} | ConvertTo-Json -Depth 4 -Compress");
    try {
      const j = JSON.parse(r.out); const gpus = (j.gpu || []).filter(Boolean);
      const best = gpus.sort((a, b) => gpuScore(b.Name) - gpuScore(a.Name))[0] || {};
      base.gpu = best.Name || ''; base.hz = best.CurrentRefreshRate || null;
      base.res = best.CurrentHorizontalResolution ? best.CurrentHorizontalResolution + '×' + best.CurrentVerticalResolution : null;
      const mem = (j.mem || []).map(Number).filter(Boolean); if (mem.length) base.vramGB = Math.round(Math.max(...mem) / 2 ** 30);
      if (j.cpu) { base.cpu = (j.cpu.Name || base.cpu).trim(); base.cpuMhz = j.cpu.MaxClockSpeed || base.cpuMhz; }
    } catch (e) { /* scan partiel */ }
  }
  const score = scoreOf(base);
  return { ...base, score, recommended: recommend(score) };
}
module.exports = { scan, gpuScore, scoreOf, recommend };
