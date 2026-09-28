// Vitrine à widgets : ajout de chaque type, réglages, taille, déplacement, vue publique, mobile.
// Captures dans $OUT (défaut /tmp) : showcase-edit.png, showcase-view.png, showcase-mobile.png.
import { BASE, launch } from './lib.mjs';
const OUT = process.env.OUT || '/tmp';
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 }, reducedMotion: 'reduce' });
await ctx.addInitScript(() => { try { sessionStorage.setItem('jade:seenIntro', 'true'); localStorage.setItem('jade:cookies', JSON.stringify({ essential: true, analytics: false, date: Date.now() })); } catch (e) { /* iframe tiers */ } });
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
await add('collection');
for (const [q, f] of [['redline ak', '0.12'], ['karambit fade', '0.01']]) { await page.click('#cAddRow'); await page.waitForSelector('.sk'); await page.fill('#skQ', q); await page.waitForTimeout(250); await page.locator('.sk').first().click(); await page.waitForTimeout(100); await page.locator('.coll-item [data-k="float"]').last().fill(f); }
log('skins choisis', await page.locator('.coll-item b').allTextContents(), 'usure auto', await page.locator('.coll-item [data-k="wear"]').first().inputValue());
await page.locator('.coll-item [data-k="float"]').first().fill('0.9'); await save(); log('float hors limites refusé', await page.locator('#cForm').count() === 1); await page.locator('.coll-item [data-k="float"]').first().fill('0.12'); await save();
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
await page.setViewportSize({ width: 1360, height: 2600 }); await page.evaluate(() => scrollTo(0, 0)); await page.locator('.wt-streak').scrollIntoViewIfNeeded(); const before2 = await page.locator('.wt-streak').getAttribute('style'); const b = await page.locator('.wt-streak .wbody').boundingBox(); const c = await page.locator('.wcell').nth(await page.locator('.wcell').count() - 5).boundingBox();
await page.mouse.move(b.x + 20, b.y + 20); await page.mouse.down(); await page.mouse.move(c.x + 30, c.y + 30, { steps: 12 }); await page.mouse.up(); await page.waitForTimeout(400);
log('glisser le widget entier', before2 !== await page.locator('.wt-streak').getAttribute('style'), 'sans erreur', errs.length === 0); await page.setViewportSize({ width: 1360, height: 900 });

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
// Jade+ : limite, galerie, tarifs, commande, analyse
await page.setViewportSize({ width: 1360, height: 900 });
await page.goto(BASE + '#/formules'); await page.waitForTimeout(300);
await page.click('[data-choose="plus_y"]'); await page.waitForTimeout(200);
await page.click('#coPay'); log('commande sans CGV refusée', await page.locator('#coPay').count() === 1);
await page.check('#coCgv'); await page.check('#coNow'); await page.click('#coPay'); await page.waitForTimeout(200);
log('paiement fermé (toast)', await page.locator('.toast').last().textContent());
await page.keyboard.press('Escape');
await page.evaluate(() => { const id = JSON.parse(localStorage.getItem('jade:current')); localStorage.setItem('jade:u:' + id + ':sub', JSON.stringify({ offer: 'plus_y', since: Date.now(), until: Date.now() + 864e5 * 30, renew: true, source: 'test' })); localStorage.setItem('jade:u:' + id + ':bests', JSON.stringify({ flick: 22, reaction: 260, tracking: 60 })); });
await page.goto(BASE + '#/progression'); await page.reload(); await page.waitForTimeout(400);
log('analyse Jade+', (await page.locator('#pAna').textContent()).slice(0, 90));
await page.goto(BASE + '#/profil/showcase'); await page.waitForTimeout(300); await page.click('[data-wedit]');
await add('gallery'); await page.fill('#cG0', 'https://example.com/a.png'); await save();
log('galerie ajoutée', await page.locator('.wt-gallery').count(), 'badge Jade+', await page.locator('.showcase .plus-tag').count());
await page.goto(BASE + '#/profil/sub'); await page.waitForTimeout(300);
await page.click('#subCancel'); await page.click('[data-yes]'); await page.waitForTimeout(200);
log('résiliation', (await page.locator('#pBody .row .lbl span').first().textContent()));
await page.screenshot({ path: OUT + '/premium-sub.png' });
await page.goto(BASE + '#/formules'); await page.waitForTimeout(300); await page.screenshot({ path: OUT + '/premium-pricing.png', fullPage: true });
console.log('ERREURS', errs);
await browser.close();
