// Interface de l'application (mode « app ») avec un faux pont natif : PC et jeux, tracker, lancement, synchro, Jade+.
// Captures dans $OUT (défaut /tmp) : app-pc.png, app-tracker.png, app-tests.png.
import { BASE, launch } from './lib.mjs';
const OUT = process.env.OUT || '/tmp';
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await ctx.addInitScript(() => {
  try { sessionStorage.setItem('jade:seenIntro', 'true'); localStorage.setItem('jade:cookies', JSON.stringify({ essential: true, analytics: false, date: Date.now() })); } catch (e) { return; }
  const log = window.__nativeLog = [];
  const tw = { gameMode: { on: true }, gameDvr: { on: false }, mouseAccel: { on: false }, powerPlan: { on: false }, backgroundApps: { on: false }, visualFx: { on: false, relog: true }, hags: { on: false, admin: true, reboot: true } };
  const csv = 'Kill #,Timestamp,Bot,Weapon,TTK,Shots,Hits,Accuracy,Damage Done,Damage Possible,Efficiency,Cheated\n1,00:00:01,Bot,gun,0.5,1,1,1,100,100,1,false\n\nScore:,812.5\nScenario:,1w4ts reload\nChallenge Start:,12:00:00\n';
  window.jadeNative = {
    info: async () => ({ version: '0.1.0', platform: 'win32' }), open: async u => { log.push(['open', u]); return true; },
    scan: async () => ({ gpu: 'NVIDIA GeForce RTX 4070', vramGB: 12, cpu: 'AMD Ryzen 7 7800X3D', threads: 16, ramGB: 32, res: '2560×1440', hz: 240, score: 84, recommended: 45 }),
    optStatus: async () => ({ supported: true, tweaks: tw }), optSet: async (id, on) => { tw[id].on = on; log.push(['opt', id, on]); return { ok: true, reboot: !!tw[id].reboot }; },
    gameStatus: async () => ({ cs2: { found: true, running: false }, valorant: { found: true, running: true } }),
    gameApply: async (g, v) => { log.push(['apply', g, v]); return g === 'valorant' ? { ok: false, error: 'running' } : { ok: true, changed: 11 }; }, gameRestore: async () => ({ ok: true }),
    launch: async (s, o) => { log.push(['launch', s, o]); return true; },
    statsDir: async () => 'C:\\Steam\\steamapps\\common\\FPSAimTrainer\\FPSAimTrainer\\stats', statsPick: async () => null,
    statsRead: async known => (known.includes('1w4ts reload - Challenge - 2026.09.28-12.00.00 Stats.csv') ? [] : [{ name: '1w4ts reload - Challenge - 2026.09.28-12.00.00 Stats.csv', text: csv }]),
    statsWatch: async () => true, onStats: () => () => {},
  };
});
const page = await ctx.newPage();
const errs = []; page.on('pageerror', e => errs.push(e.message));
const log = (...a) => console.log('✓', ...a);
await page.goto(BASE + '#/pc'); await page.waitForTimeout(800);
log('classe is-app', await page.evaluate(() => document.documentElement.classList.contains('is-app')), 'menu App', await page.locator('.nav-link[href="#/pc"]').count());
log('matériel', (await page.locator('.pc-hw').textContent()).slice(0, 80));
await page.click('[data-tw="mouseAccel"]'); await page.waitForTimeout(200);
log('interrupteur souris', await page.locator('[data-tw="mouseAccel"]').getAttribute('aria-pressed'));
await page.locator('[data-gfx="cs2"]').fill('10'); await page.click('[data-apply="cs2"]'); await page.waitForTimeout(200);
await page.click('[data-apply="valorant"]'); await page.waitForTimeout(200); log('toast valorant ouvert', await page.locator('.toast').last().textContent());
await page.screenshot({ path: OUT + '/app-pc.png', fullPage: true });
await page.goto(BASE + '#/tracker'); await page.waitForTimeout(300);
await page.fill('#trkH', '76561198000000000'); await page.click('#trkForm button'); await page.waitForTimeout(300);
log('tracker lignes', await page.locator('.trk-table tbody tr').count());
await page.screenshot({ path: OUT + '/app-tracker.png', fullPage: true });
await page.goto(BASE + '#/routines'); await page.waitForTimeout(400);
await page.locator('details.routine').first().evaluate(d => d.open = true); await page.locator('.launch-btn').first().click(); await page.waitForTimeout(100);
await page.goto(BASE + '#/progression'); await page.waitForTimeout(800);
log('synchro', (await page.locator('#pSync').textContent()).slice(0, 60), 'séances', await page.evaluate(() => JSON.parse(localStorage.getItem('jade:u:guest:runs') || '[]').length));
await page.goto(BASE + '#/formules'); await page.waitForTimeout(300); await page.click('[data-site]');
await page.goto(BASE + '#/tests/flick'); await page.waitForTimeout(300); await page.click('[data-diff="easy"]'); await page.waitForTimeout(100);
log('difficulté facile', await page.locator('#tA').textContent(), await page.locator('.diff-bar [aria-pressed="true"]').textContent());
await page.screenshot({ path: OUT + '/app-tests.png' });
log('appels natifs', JSON.stringify(await page.evaluate(() => window.__nativeLog)));
console.log('ERREURS', errs);
await browser.close();
