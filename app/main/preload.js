// Pont sécurisé entre l'interface (site embarqué) et les fonctions natives. Rien d'autre n'est exposé.
const { contextBridge, ipcRenderer } = require('electron');
const call = (ch, ...a) => ipcRenderer.invoke(ch, ...a);
contextBridge.exposeInMainWorld('jadeNative', {
  info: () => call('app:info'),
  open: url => call('app:open', url),
  scan: () => call('pc:scan'),
  optStatus: () => call('opt:status'),
  optSet: (id, on) => call('opt:set', id, on),
  gameStatus: () => call('game:status'),
  gameApply: (game, value) => call('game:apply', game, value),
  gameRestore: game => call('game:restore', game),
  launch: (soft, opts) => call('launch', soft, opts),
  statsDir: () => call('stats:dir'),
  statsPick: () => call('stats:pick'),
  statsRead: known => call('stats:read', known),
  statsWatch: () => call('stats:watch'),
  onStats: fn => { const h = (e, f) => fn(f); ipcRenderer.on('stats:new', h); return () => ipcRenderer.removeListener('stats:new', h); },
});
