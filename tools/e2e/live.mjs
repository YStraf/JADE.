import { BASE, launch } from './lib.mjs';
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 } });
await ctx.addInitScript(() => { if (!localStorage.getItem('jade:lang')) localStorage.setItem('jade:lang', '"fr"'); sessionStorage.setItem('jade:seenIntro', 'true'); localStorage.setItem('jade:cookies', JSON.stringify({ essential: true, analytics: false, date: Date.now() })); });
const page = await ctx.newPage();
await page.goto(BASE + '#/optimisation'); await page.waitForTimeout(500);
const snap = async () => page.evaluate(() => ({ lang: document.documentElement.lang, side: document.querySelector('#side').innerText.split('\n').slice(0, 6).join(' | '), h1: document.querySelector('#view h1')?.innerText, foot: document.querySelector('#foot').innerText.slice(0, 80).replace(/\n/g, ' '), tip: document.querySelector('#oList')?.innerText.slice(0, 60), title: document.title }));
console.log('FR', await snap());
for (const l of ['de', 'pl', 'it']) {
  await page.click('#langBtn'); await page.click('#langMenu [data-lang="' + l + '"]'); await page.waitForTimeout(700);
  console.log(l.toUpperCase(), await snap());
}
await browser.close();
