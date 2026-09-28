// Vitrine à widgets : ajout de chaque type, réglages, taille, déplacement, vue publique, mobile.
// Captures dans $OUT (défaut /tmp) : showcase-edit.png, showcase-view.png, showcase-mobile.png.
import { BASE, launch } from './lib.mjs';
const OUT = process.env.OUT || '/tmp';
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 }, reducedMotion: 'reduce' });
await ctx.addInitScript(() => { sessionStorage.setItem('jade:seenIntro', 'true'); localStorage.setItem('jade:cookies', JSON.stringify({ essential: true, analytics: false, date: Date.now() })); });
const page = await ctx.newPage();
const errs = []; page.on('pageerror', e => errs.push(e.message));
const log = (...a) => console.log('✓', ...a);
await page.goto(BASE);
await page.click('#acctBtn'); await page.click('[data-auth="up"]');
await page.fill('#aPseudo', 'Vitrine'); await page.fill('#aEmail', 'vitrine@jade.fr'); await page.fill('#aPass', 'motdepasse1'); await page.fill('#aBirth', '2000-01-01');
await page.check('#aTerms'); await page.click('button[type=submit]'); await page.waitForTimeout(400);
await page.goto(BASE + '#/profil/showcase'); await page.waitForTimeout(300);
await page.click('[data-wedit]'); await page.waitForTimeout(200);
log('widgets de départ', await page.locator('.wbox').count());
// Supprime tout, puis ajoute chaque type
while (await page.locator('[data-wdel]').count()) { await page.locator('[data-wdel]').first().click(); await page.waitForTimeout(60); }
const save = async () => { await page.click('#cForm button.primary'); await page.waitForTimeout(150); };
const add = async type => { await page.click('[data-wadd]'); await page.click('[data-addtype="' + type + '"]'); await page.waitForTimeout(150); };
await add('cs2'); await page.fill('#cHandle', 's1mple'); await save();
await add('faceit'); await page.fill('#cHandle', 'bad name!'); await save(); log('refus pseudo invalide', await page.locator('#cForm').count() === 1); await page.fill('#cHandle', 'ZywOo'); await save();
await add('valorant'); await page.fill('#cHandle', 'TenZ#0505'); await save();
await add('clip'); await page.fill('#cUrl', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'); await page.fill('#cTitle', 'Ace sur Mirage'); await save();
await add('collection'); await page.fill('.coll-row [data-k="name"]', 'AK-47 | Redline'); await page.click('#cAddRow'); await page.locator('.coll-row [data-k="name"]').nth(1).fill('★ Karambit | Fade'); await page.locator('.coll-row [data-k="rar"]').nth(1).selectOption('gold'); await save();
await add('text'); await page.fill('#cText', 'Entraînement tous les soirs, objectif Level 10.'); await save();
await add('setup'); await page.fill('#cs_mouse', 'Logitech G Pro X Superlight'); await page.fill('#cs_dpi', '800'); await page.fill('#cs_sensCs', '1.2'); await save();
await add('image'); await page.setInputFiles('#cFile', { name: 'a.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64') }); await page.waitForTimeout(300); await save();
await add('streak'); await add('rank');
log('widgets ajoutés', await page.locator('.wbox').count());
// Taille : passe le tracker CS2 en Grand étendu horizontal
await page.locator('.wt-cs2 [data-wsize]').click(); await page.click('[data-pick="lh"]'); await page.waitForTimeout(150);
log('taille CS2', await page.locator('.wt-cs2').getAttribute('data-sz'));
// Déplacement par toucher : sélection du widget Rang puis case libre
await page.locator('.wt-rank [data-wmove]').click(); await page.waitForTimeout(100);
const before = await page.locator('.wt-rank').getAttribute('style');
await page.locator('.wcell').last().click(); await page.waitForTimeout(150);
log('déplacement toucher', before !== await page.locator('.wt-rank').getAttribute('style'));
// Déplacement par glisser
const h = page.locator('.wt-streak [data-wmove]'); const b = await h.boundingBox(); const c = await page.locator('.wcell').nth(await page.locator('.wcell').count() - 5).boundingBox();
await page.mouse.move(b.x + 5, b.y + 5); await page.mouse.down(); await page.mouse.move(c.x + 20, c.y + 20, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(150);
log('glisser OK (sans erreur)', errs.length === 0);
await page.screenshot({ path: OUT + '/showcase-edit.png', fullPage: true });
await page.click('[data-wedit]'); await page.waitForTimeout(200);
await page.goto(BASE + '#/joueur/Vitrine'); await page.waitForTimeout(400);
log('widgets vue publique', await page.locator('.wbox').count());
await page.click('.clip-fac'); await page.waitForTimeout(200);
log('lecteur chargé au clic', await page.locator('.wclip iframe').count());
await page.screenshot({ path: OUT + '/showcase-view.png', fullPage: true });
await page.goto(BASE + '#/joueur/Kyro'); await page.waitForTimeout(300);
log('démo Kyro : widgets', await page.locator('.wbox').count());
await page.setViewportSize({ width: 390, height: 844 }); await page.goto(BASE + '#/joueur/Vitrine'); await page.waitForTimeout(300);
log('débordement mobile', await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
await page.screenshot({ path: OUT + '/showcase-mobile.png', fullPage: true });
await page.goto(BASE + '#/profil/showcase'); await page.waitForTimeout(300); await page.click('[data-wedit]'); await page.waitForTimeout(200);
log('débordement mobile (édition)', await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
await page.screenshot({ path: OUT + '/showcase-mobile-edit.png' });
console.log('ERREURS', errs);
await browser.close();
