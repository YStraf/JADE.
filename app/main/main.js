// Jade — processus principal Electron. Affiche le site embarqué (renderer/) avec la couche « app » activée
// et donne accès aux fonctions natives (préload) : PC, optimisation, jeux, lancement Kovaak's / Aim Lab, stats.
const { app, BrowserWindow, ipcMain, shell, dialog, protocol, net, nativeTheme } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const system = require('./native/system');
const optimize = require('./native/optimize');
const games = require('./native/games');
const stats = require('./native/stats');
const launcher = require('./native/launcher');

const ROOT = path.join(__dirname, '..', 'renderer');
const SITE = 'https://jade-aim.vercel.app';
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true } }]);
if (!app.requestSingleInstanceLock()) app.quit();
app.setAsDefaultProtocolClient('jade');
let win = null;
const cfgFile = () => path.join(app.getPath('userData'), 'jade-app.json');
const cfg = () => { try { return JSON.parse(fs.readFileSync(cfgFile(), 'utf8')); } catch (e) { return {}; } };
const saveCfg = c => fs.writeFileSync(cfgFile(), JSON.stringify({ ...cfg(), ...c }, null, 2));

function createWindow() {
  nativeTheme.themeSource = 'dark';
  win = new BrowserWindow({
    width: 1440, height: 900, minWidth: 1100, minHeight: 700, show: false, backgroundColor: '#0B0F0D',
    title: 'Jade', icon: path.join(__dirname, '..', 'build', 'icon.png'),
    titleBarStyle: 'hidden', titleBarOverlay: { color: '#0B0F0D', symbolColor: '#9fb3a8', height: 40 },
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false, spellcheck: false },
  });
  win.once('ready-to-show', () => win.show());
  win.loadURL('app://jade/index.html');
  // Liens externes : navigateur par défaut ; seuls les liens Steam passent par le système.
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https:\/\//.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('app://jade/')) { e.preventDefault(); if (/^https:\/\//.test(url)) shell.openExternal(url); } });
}
app.whenReady().then(() => {
  protocol.handle('app', req => {
    const u = new URL(req.url); const file = path.normalize(path.join(ROOT, decodeURIComponent(u.pathname)));
    if (!file.startsWith(ROOT)) return new Response('Interdit', { status: 403 });
    return net.fetch(pathToFileURL(file).toString());
  });
  optimize.init(app.getPath('userData'));
  createWindow();
});
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.on('window-all-closed', () => app.quit());

// ---- Pont natif ----
const handle = (ch, fn) => ipcMain.handle(ch, async (e, ...a) => { try { return await fn(...a); } catch (err) { return { ok: false, error: String(err && err.message || err) }; } });
handle('app:info', () => ({ version: app.getVersion(), platform: process.platform, site: SITE }));
handle('app:open', url => { if (/^(https:\/\/|steam:\/\/)/.test(url)) return shell.openExternal(url).then(() => true); return false; });
handle('pc:scan', () => system.scan());
handle('opt:status', () => optimize.status());
handle('opt:set', (id, on) => optimize.set(String(id), !!on));
handle('game:status', () => games.status());
handle('game:apply', (game, v) => games.apply(String(game), Math.max(0, Math.min(100, +v || 0))));
handle('game:restore', game => games.restore(String(game)));
handle('launch', (soft, opts) => { const u = launcher.url(String(soft), opts || {}); return u ? shell.openExternal(u).then(() => true) : false; });
// Stats Kovaak's : dossier trouvé tout seul, ou choisi une seule fois puis mémorisé.
handle('stats:dir', async () => { const c = cfg(); if (c.statsDir && fs.existsSync(c.statsDir)) return c.statsDir; const d = await stats.findKovaaks(); if (d) saveCfg({ statsDir: d }); return d; });
handle('stats:pick', async () => { const r = await dialog.showOpenDialog(win, { properties: ['openDirectory'], title: 'Dossier « stats » de Kovaak\'s' }); if (r.canceled || !r.filePaths[0]) return null; saveCfg({ statsDir: r.filePaths[0] }); return r.filePaths[0]; });
handle('stats:read', known => { const d = cfg().statsDir; return d ? stats.readNew(d, known) : []; });
handle('stats:watch', () => { const d = cfg().statsDir; return d ? stats.watch(d, f => win && win.webContents.send('stats:new', f)) : false; });
