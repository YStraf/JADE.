import { BASE, launch } from './lib.mjs';
const routes = ['', 'routines', 'tests', 'progression', 'optimisation', 'defis', 'rangs', 'pass', 'forum', 'shop', 'shop/inventory', 'shop/arcade', 'shop/earn', 'shop/history', 'actus', 'securite', 'formules', 'application', 'profil', 'joueur/Kyro', 'legal', 'legal/privacy', 'admin', 'nimporte'];
const langs = (process.argv[2] || 'fr').split(',');
const browser = await launch();
let errors = 0;
for (const lang of langs) {
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 } });
  await ctx.addInitScript(l => { localStorage.setItem('jade:lang', JSON.stringify(l)); sessionStorage.setItem('jade:seenIntro', 'true'); localStorage.setItem('jade:cookies', JSON.stringify({ essential: true, analytics: false, date: Date.now() })); }, lang);
  const page = await ctx.newPage();
  page.on('pageerror', e => { errors++; console.log('[' + lang + '] PAGEERROR', e.message); });
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') { if (!/favicon|manifest|sw\.js/.test(m.text())) { console.log('[' + lang + '] console.' + m.type(), m.text()); if (m.type() === 'error') errors++; } } });
  for (const r of routes) {
    await page.goto(BASE + '#/' + r); await page.waitForTimeout(350);
    const txt = await page.evaluate(() => document.querySelector('#view').innerText.length);
    const raw = await page.evaluate(() => (document.body.innerText.match(/\b[a-z]+\.[a-zA-Z]+(\.[a-zA-Z]+)+\b/g) || []).filter(s => !/\.(gouv|fr|com|gg|net|js|app|csv|json|org|pl)\b/.test(s)).slice(0, 5));
    if (txt < 40 || raw.length) console.log('[' + lang + '] #/' + r, 'len', txt, raw.length ? 'RAW KEYS: ' + raw.join(' ') : '');
  }
  await ctx.close();
}
await browser.close();
console.log('errors', errors);
