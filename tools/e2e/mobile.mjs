import { BASE, launch } from './lib.mjs';
const routes = ['', 'routines', 'tests', 'progression', 'optimisation', 'defis', 'rangs', 'pass', 'forum', 'shop', 'shop/arcade', 'actus', 'securite', 'formules', 'application', 'profil', 'profil/showcase', 'joueur/Kyro', 'legal', 'admin'];
const langs = (process.argv[2] || 'fr').split(',');
const shots = (process.argv[3] || '').split(',').filter(Boolean);
const browser = await launch();
for (const lang of langs) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await ctx.addInitScript(l => { localStorage.setItem('jade:lang', JSON.stringify(l)); sessionStorage.setItem('jade:seenIntro', 'true'); localStorage.setItem('jade:cookies', JSON.stringify({ essential: true, analytics: false, date: Date.now() })); }, lang);
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('[' + lang + '] PAGEERROR', e.message));
  await page.goto(BASE + '#/'); await page.waitForTimeout(300);
  await page.evaluate(async () => { const m = await import('./js/state/account.js'); try { await m.signup({ pseudo: 'Mobile', email: 'm@t.io', password: 'password123', birth: '1995-01-01', terms: true }); } catch (e) { } });
  await page.reload(); await page.waitForTimeout(300);
  for (const r of routes) {
    await page.goto(BASE + '#/' + r); await page.waitForTimeout(350);
    const o = await page.evaluate(() => {
      const W = document.documentElement.clientWidth; const out = [];
      if (document.documentElement.scrollWidth > W + 1) out.push('PAGE scrollWidth ' + document.documentElement.scrollWidth);
      for (const el of document.querySelectorAll('#view *')) {
        const r = el.getBoundingClientRect(); if (!r.width) continue;
        if (r.right > W + 1) { let p = el.parentElement, clipped = false; while (p) { const s = getComputedStyle(p); if (/(auto|scroll|hidden)/.test(s.overflowX)) { clipped = true; break; } p = p.parentElement; } if (!clipped) out.push((el.className || el.tagName) + ' right=' + Math.round(r.right) + ' "' + (el.innerText || '').slice(0, 40).replace(/\n/g, ' ') + '"'); }
      }
      return [...new Set(out)].slice(0, 6);
    });
    if (o.length) console.log('[' + lang + '] #/' + r + '\n   ' + o.join('\n   '));
    if (shots.includes(r || 'home')) await page.screenshot({ path: (process.env.OUT || '/tmp') + `/m-${lang}-${(r || 'home').replace(/\//g, '_')}.png`, fullPage: false });
  }
  await ctx.close();
}
await browser.close();
console.log('done');
