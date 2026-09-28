import { BASE, launch } from './lib.mjs';
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 }, reducedMotion: 'reduce' });
await ctx.addInitScript(() => { sessionStorage.setItem('jade:seenIntro', 'true'); localStorage.setItem('jade:cookies', JSON.stringify({ essential: true, analytics: false, date: Date.now() })); });
const page = await ctx.newPage();
const errs = []; page.on('pageerror', e => errs.push(e.message));
const log = (...a) => console.log('✓', ...a);
await page.goto(BASE);
// Inscription
await page.click('#acctBtn'); await page.click('[data-auth="up"]');
await page.fill('#aPseudo', 'Testeur'); await page.fill('#aEmail', 'test@jade.fr'); await page.fill('#aPass', 'motdepasse1'); await page.fill('#aBirth', '2000-01-01');
await page.click('button[type=submit]'); await page.waitForTimeout(300);
let err = await page.textContent('#aErr'); log('erreur CGU attendue :', err);
await page.check('#aTerms'); await page.click('button[type=submit]'); await page.waitForTimeout(500);
log('route après inscription', await page.evaluate(() => location.hash));
// Test flick rapide : on clique 20 fois la cible
await page.goto(BASE + '#/tests/flick'); await page.waitForTimeout(300);
await page.click('#tStart');
for (let i = 0; i < 20; i++) { await page.waitForTimeout(260); await page.locator('.dot-target').first().dispatchEvent('pointerdown'); }
await page.waitForTimeout(300);
log('résultat test', (await page.textContent('#tOv')).slice(0, 60));
log('XP après test', await page.evaluate(() => JSON.parse(localStorage.getItem('jade:u:' + JSON.parse(localStorage.getItem('jade:current')) + ':xp')).total));
log('coins après record', await page.textContent('[data-coins]'));
// Donner des coins via stockage puis ouvrir une caisse
await page.evaluate(() => { const id = JSON.parse(localStorage.getItem('jade:current')); localStorage.setItem('jade:u:' + id + ':coins', '1000'); });
await page.goto(BASE + '#/shop'); await page.reload(); await page.waitForTimeout(400);
await page.click('[data-open="animated"]'); await page.waitForTimeout(600);
log('caisse :', (await page.textContent('#openRes')).trim().slice(0, 80));
await page.click('[data-eq]').catch(() => {}); await page.waitForTimeout(200);
log('coins après caisse', await page.textContent('[data-coins]'));
// Arcade : 26 ans → autorisé
await page.goto(BASE + '#/shop/arcade'); await page.waitForTimeout(300);
log('arcade', (await page.textContent('#shopBody')).slice(0, 70));
await page.click('[data-cf="heads"]'); await page.waitForTimeout(400); log('pile ou face', await page.textContent('#cfRes'));
// Forum
await page.goto(BASE + '#/forum'); await page.waitForTimeout(200); await page.click('#newPost');
await page.fill('#pTitle', 'Mon premier post'); await page.fill('#pBody', 'Bonjour à tous, je teste Jade.'); await page.click('#pGo'); await page.waitForTimeout(300);
log('post publié', await page.locator('.post h3').first().textContent());
// Recherche
await page.keyboard.press('Control+k'); await page.fill('#qIn', 'smoothbot'); await page.waitForTimeout(150);
log('recherche', await page.locator('.palette .res b').first().textContent()); await page.keyboard.press('Enter'); await page.waitForTimeout(300);
log('après recherche', await page.evaluate(() => location.hash));
// Titre : un membre ne peut pas saisir de titre libre
await page.goto(BASE + '#/profil/showcase'); await page.waitForTimeout(300);
log('champ titre libre visible (membre) ?', await page.locator('#cTitle').count());
// Langue
await page.click('#langBtn'); await page.click('#langMenu [data-lang="en"]'); await page.waitForTimeout(600);
log('titre en anglais ?', await page.textContent('h2'));
console.log('ERREURS', errs);
await browser.close();
