import { BASE, launch } from './lib.mjs';
const routes = ['', 'routines', 'tests', 'progression', 'optimisation', 'defis', 'rangs', 'pass', 'forum', 'shop', 'shop/inventory', 'shop/arcade', 'shop/earn', 'shop/history', 'actus', 'securite', 'formules', 'application', 'profil', 'profil/showcase', 'profil/xp', 'profil/security', 'profil/perso', 'profil/notif', 'profil/sub', 'profil/support', 'profil/data', 'joueur/Kyro', 'legal', 'admin', 'nimporte'];
const FR = /\b(les|des|une|avec|pour|dans|votre|vous|joueur|niveau|séance|réglages|être|aussi|sans|plus de|déjà|très|chaque|semaine|aujourd'hui|connexion|compte|défi|rang)\b/gi;
const langs = (process.argv[2] || 'en').split(',');
const browser = await launch();
for (const lang of langs) {
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 } });
  await ctx.addInitScript(l => { localStorage.setItem('jade:lang', JSON.stringify(l)); sessionStorage.setItem('jade:seenIntro', 'true'); localStorage.setItem('jade:cookies', JSON.stringify({ essential: true, analytics: false, date: Date.now() })); }, lang);
  const page = await ctx.newPage();
  // sign up so profile tabs render
  await page.goto(BASE + '#/'); await page.waitForTimeout(400);
  await page.evaluate(async () => { const m = await import('./js/state/account.js'); try { await m.signup({ pseudo: 'LeakTest', email: 'l@t.io', password: 'password123', birth: '1995-01-01', terms: true }); } catch (e) { } });
  await page.reload(); await page.waitForTimeout(400);
  for (const r of routes) {
    await page.goto(BASE + '#/' + r); await page.waitForTimeout(350);
    const lines = await page.evaluate(() => document.body.innerText.split('\n').map(s => s.trim()).filter(Boolean));
    const hits = [...new Set(lines.filter(s => { const m = s.match(/\b(les|des|une|avec|pour|dans|votre|vous|joueur|niveau|séance|réglages|être|aussi|sans|déjà|très|chaque|semaine|aujourd'hui|connexion|défi)\b/gi); return m && m.length >= 1; }))];
    if (hits.length) console.log('[' + lang + '] #/' + r + '\n   ' + hits.slice(0, 8).map(s => s.slice(0, 110)).join('\n   '));
  }
  await ctx.close();
}
await browser.close();
