// Point d'entrée : coque (barre latérale, barre du haut, pied de page) + services globaux.
import { $, $$, esc, on } from './core/dom.js';
import { store } from './core/store.js';
import { initLang, setLang, t, LANGS, getLang, fmt } from './core/i18n.js';
import { onBus, emit } from './core/bus.js';
import { ic } from './core/icons.js';
import { SFX } from './core/sfx.js';
import { toast } from './core/toast.js';
import { applyMotionPref } from './core/motion.js';
import { startRouter, rerender, parse, go } from './core/router.js';
import { initAccount, me, profile, logout } from './state/account.js';
import { coins } from './state/economy.js';
import { applyTheme, setTheme } from './state/theme.js';
import { level, addMinute } from './state/progress.js';
import { avatar } from './components/ui.js';
import { allPills } from './components/ui.js';
import { openAuth } from './components/auth.js';
import { openSearch } from './components/search.js';
import { bindMini } from './components/minicard.js';
import { renderCookieBar, reopenCookies } from './components/cookies.js';
import { initIntro, replayIntro } from './components/intro.js';
import { bindSecrets } from './components/secrets.js';

export const NAV = [
  { items: [['', 'home', 'nav.home']] },
  { g: 'nav.g.train', items: [['routines', 'routine', 'nav.routines'], ['tests', 'target', 'nav.tests'], ['progression', 'chart', 'nav.progression'], ['optimisation', 'sliders', 'nav.optimisation']] },
  { g: 'nav.g.compete', items: [['defis', 'trophy', 'nav.challenges'], ['rangs', 'rank', 'nav.ranks'], ['pass', 'ticket', 'nav.pass']] },
  { g: 'nav.g.community', items: [['forum', 'chat', 'nav.forum'], ['shop', 'bag', 'nav.shop']] },
  { g: 'nav.g.info', items: [['actus', 'news', 'nav.news'], ['securite', 'shield', 'nav.security'], ['formules', 'card', 'nav.pricing'], ['application', 'device', 'nav.app']] },
];

function sideHTML() {
  const cur = parse().name;
  return '<div class="brand"><a class="logo" href="#/" data-logo>Jade<span class="dot" id="logoDot">.</span></a><button class="tool menu-close" data-nav-close aria-label="' + esc(t('common.close')) + '" style="display:none">' + ic('x') + '</button></div>' +
    '<button class="side-search" data-search>' + ic('search') + '<span>' + esc(t('search.open')) + '</span><kbd>Ctrl K</kbd></button>' +
    NAV.map(g => '<div class="nav-group">' + (g.g ? '<span>' + esc(t(g.g)) + '</span>' : '') + g.items.map(([r, icn, k]) => '<a class="nav-link" href="#/' + r + '"' + (cur === r ? ' aria-current="page"' : '') + '>' + ic(icn) + esc(t(k)) + (r === 'pass' && me() ? '<span class="pill-new">' + level().lvl + '</span>' : '') + '</a>').join('') + '</div>').join('') +
    '<div class="side-foot">' +
    '<a class="nav-link" href="#/profil"' + (cur === 'profil' ? ' aria-current="page"' : '') + '>' + ic('user') + esc(t('nav.profile')) + '</a>' +
    '<a class="nav-link" href="#/legal"' + (cur === 'legal' ? ' aria-current="page"' : '') + '>' + ic('scale') + esc(t('nav.legal')) + '</a></div>';
}
function topHTML() {
  const r = parse(); const u = me();
  const crumbKey = { '': 'nav.home', routines: 'nav.routines', tests: 'nav.tests', progression: 'nav.progression', optimisation: 'nav.optimisation', defis: 'nav.challenges', rangs: 'nav.ranks', pass: 'nav.pass', forum: 'nav.forum', shop: 'nav.shop', actus: 'nav.news', securite: 'nav.security', formules: 'nav.pricing', application: 'nav.app', profil: 'nav.profile', joueur: 'nav.player', legal: 'nav.legal', admin: 'nav.admin' }[r.name];
  const group = NAV.find(g => g.items.some(i => i[0] === r.name));
  const L = level();
  const theme = document.documentElement.getAttribute('data-theme');
  return '<button class="tool menu-btn" data-nav-open aria-label="' + esc(t('nav.menu')) + '">' + ic('menu') + '</button>' +
    '<div class="crumb">' + (group && group.g ? esc(t(group.g)) + ' / ' : '') + '<b>' + esc(crumbKey ? t(crumbKey) : '404') + '</b></div>' +
    '<div class="tools">' +
    '<button class="tool" data-search aria-label="' + esc(t('search.open')) + '" title="Ctrl K">' + ic('search') + '</button>' +
    '<a class="chip hide-sm" href="#/pass" title="' + esc(t('nav.pass')) + '"><span class="lvl-dot">' + L.lvl + '</span>' + esc(t('xp.level')) + '</a>' +
    '<a class="chip" href="#/shop" title="Jade Coins"><span class="coin"></span><span data-coins>' + fmt(coins()) + '</span></a>' +
    '<div class="menu-wrap hide-sm"><button class="tool" id="langBtn" aria-haspopup="true" aria-expanded="false" aria-label="' + esc(t('lang.label')) + '">' + ic('globe') + '</button><div class="menu" id="langMenu" role="menu">' +
    Object.entries(LANGS).map(([c, l]) => '<button type="button" role="menuitem" data-lang="' + c + '" aria-pressed="' + (c === getLang()) + '"><span class="flag">' + l.flag + '</span>' + l.name + '</button>').join('') + '</div></div>' +
    '<button class="tool hide-sm' + (SFX.on ? '' : ' off') + '" data-sound aria-pressed="' + SFX.on + '" aria-label="' + esc(SFX.on ? t('sound.off') : t('sound.on')) + '">' + ic(SFX.on ? 'sound' : 'mute') + '</button>' +
    '<button class="tool" data-theme-toggle aria-label="' + esc(theme === 'light' ? t('theme.dark') : t('theme.light')) + '">' + ic(theme === 'light' ? 'moon' : 'sun') + '</button>' +
    '<div class="menu-wrap"><button class="acct' + (u ? '' : ' signed-out') + '" id="acctBtn" aria-haspopup="true" aria-expanded="false">' + (u ? avatar({ pseudo: u.pseudo, style: profile().style }, 28) + '<span class="hide-sm">' + esc(u.pseudo) + '</span>' : esc(t('auth.signin'))) + '</button>' +
    '<div class="menu acct-menu" id="acctMenu" role="menu">' + (u
      ? '<a class="menu-head" href="#/pass">' + avatar({ pseudo: u.pseudo, style: profile().style }, 40) + '<div class="mh-body"><b>' + esc(u.pseudo) + '</b><span class="mh-row"><span>' + esc(t('xp.level')) + ' ' + L.lvl + '</span><span class="mh-coins">' + ic('coin') + fmt(coins()) + '</span></span><span class="mh-bar"><i style="width:' + L.pct + '%"></i></span></div></a>' +
        '<div class="menu-sec"><a href="#/profil">' + ic('user') + esc(t('nav.profile')) + '</a><a href="#/joueur/' + encodeURIComponent(u.pseudo) + '">' + ic('eye') + esc(t('profile.public')) + '</a><a href="#/profil/showcase">' + ic('brush') + esc(t('profile.tab.showcase')) + '</a><a href="#/shop/inventory">' + ic('crate') + esc(t('shop.tab.inventory')) + '</a></div>' +
        '<div class="show-sm-only"><hr><button data-lang-open>' + ic('globe') + esc(t('lang.label')) + '</button><button data-sound>' + ic(SFX.on ? 'sound' : 'mute') + esc(SFX.on ? t('sound.off') : t('sound.on')) + '</button></div>' +
        '<hr><button class="danger" data-logout>' + ic('logout') + esc(t('auth.logout')) + '</button>'
      : '<button data-auth="in">' + ic('user') + esc(t('auth.signin')) + '</button><button data-auth="up">' + ic('plus') + esc(t('auth.signup')) + '</button>' +
        '<div class="show-sm-only"><hr><button data-lang-open>' + ic('globe') + esc(t('lang.label')) + '</button><button data-sound>' + ic(SFX.on ? 'sound' : 'mute') + esc(SFX.on ? t('sound.off') : t('sound.on')) + '</button></div>') +
    '</div></div></div>';
}
function footHTML() {
  const docs = ['mentions', 'cgu', 'cgv', 'privacy', 'cookies', 'community', 'challenges', 'coins', 'accessibility', 'report', 'sources'];
  return '<div class="in"><div class="links">' + docs.map(d => '<a href="#/legal/' + d + '">' + esc(t('legal.short.' + d)) + '</a>').join('') +
    '<button class="link-btn" data-cookies>' + esc(t('cookie.reopen')) + '</button><button class="link-btn" data-replay>' + esc(t('intro.replay')) + '</button><span class="admin-hint" id="admDot" title="Ctrl + Shift + A">·</span></div>' +
    '<div class="bottom"><span>Jade<span class="dot">.</span> ' + esc(t('meta.tagline')) + ' · © ' + new Date().getFullYear() + '</span><span>' + esc(t('footer.independent')) + '</span></div></div>';
}
function announceHTML() { try { const s = store.get('settings', {}); return s.announce ? '<div class="announce" role="status">' + ic('megaphone') + '<span>' + esc(s.announce) + '</span></div>' : ''; } catch (e) { return ''; } }

export function paintShell() {
  $('#side').innerHTML = sideHTML();
  $('#top').innerHTML = topHTML();
  $('#foot').innerHTML = footHTML();
  $('#announce').innerHTML = announceHTML();
}
function closeMenus() { $$('.menu.open').forEach(m => m.classList.remove('open')); $$('[aria-haspopup]').forEach(b => b.setAttribute('aria-expanded', 'false')); }
function toggleMenu(btn, menu) { const open = menu.classList.contains('open'); closeMenus(); if (!open) { menu.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); } }
function langMenuModal() {
  import('./core/modal.js').then(({ openModal }) => {
    const { el, close } = openModal('<h2>' + esc(t('lang.label')) + '</h2><div class="stack" style="margin-top:16px">' + Object.entries(LANGS).map(([c, l]) => '<button class="btn" data-lang="' + c + '" style="justify-content:flex-start">' + l.flag + ' ' + l.name + '</button>').join('') + '</div>', { width: '380px' });
    el.addEventListener('click', e => { const b = e.target.closest('[data-lang]'); if (b) { close(); changeLang(b.dataset.lang); } });
  });
}
async function changeLang(l) { await setLang(l); paintShell(); await rerender(); emit('lang'); toast(t('lang.changed')); }

function bindShell() {
  const root = document.body;
  on(root, '[data-search]', 'click', e => { e.preventDefault(); openSearch(); });
  on(root, '[data-nav-open]', 'click', () => document.body.classList.add('nav-open'));
  on(root, '[data-nav-close],.scrim', 'click', () => document.body.classList.remove('nav-open'));
  on(root, '.side a', 'click', () => document.body.classList.remove('nav-open'));
  on(root, '#langBtn', 'click', e => { e.stopPropagation(); toggleMenu($('#langBtn'), $('#langMenu')); });
  on(root, '#acctBtn', 'click', e => { e.stopPropagation(); toggleMenu($('#acctBtn'), $('#acctMenu')); });
  on(root, '[data-lang]', 'click', (e, b) => { if (!b.closest('#langMenu')) return; closeMenus(); changeLang(b.dataset.lang); });
  on(root, '[data-lang-open]', 'click', () => { closeMenus(); langMenuModal(); });
  on(root, '[data-sound]', 'click', () => { SFX.set(!SFX.on); paintShell(); toast(SFX.on ? t('sound.enabled') : t('sound.disabled')); });
  on(root, '[data-theme-toggle]', 'click', () => { const cur = document.documentElement.getAttribute('data-theme'); setTheme(cur === 'light' ? (store.get('darkVariant', 'dark')) : 'light'); paintShell(); setTimeout(allPills, 60); });
  on(root, '[data-auth]', 'click', (e, b) => { closeMenus(); openAuth(b.dataset.auth); });
  on(root, '[data-logout]', 'click', () => { closeMenus(); logout(); toast(t('auth.loggedOut')); if (parse().name === 'profil') go(''); });
  on(root, '[data-cookies]', 'click', () => { reopenCookies(); });
  on(root, '[data-replay]', 'click', () => replayIntro());
  on(root, '.menu a', 'click', () => closeMenus());
  document.addEventListener('click', e => { if (!e.target.closest('.menu-wrap')) closeMenus(); });
  // Raccourcis
  addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === 'k') { e.preventDefault(); openSearch(); }
    else if (e.ctrlKey && e.shiftKey && k === 'a') { e.preventDefault(); go('admin'); }
    else if (k === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName) && !document.querySelector('.modal')) { e.preventDefault(); openSearch(); }
  });
  // Point discret du pied de page : triple clic → admin
  let n = 0, h = 0; on(root, '#admDot', 'click', () => { clearTimeout(h); n++; h = setTimeout(() => n = 0, 1200); if (n >= 3) { n = 0; go('admin'); } });
  // Sons au survol / clic
  const SEL = '.btn,.seg button,.nav-link,.tool,.chip,.acct,.vnav button,.item-card,.tcard';
  document.addEventListener('pointerover', e => { const el = e.target.closest && e.target.closest(SEL); if (el && el !== document._lh) { document._lh = el; SFX.hover(); } }, { passive: true });
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest(SEL)) SFX.click(); }, { passive: true });
}

async function boot() {
  applyMotionPref();
  initAccount();
  applyTheme(store.get('theme', 'dark'));
  await initLang();
  paintShell(); bindShell();
  onBus('route', () => { $('#side').innerHTML = sideHTML(); $('#top').innerHTML = topHTML(); allPills(); });
  onBus('user', () => { applyTheme(store.get('theme', 'dark')); paintShell(); });
  onBus('xp', () => { $('#top').innerHTML = topHTML(); $('#side').innerHTML = sideHTML(); });
  onBus('coins', () => { $$('[data-coins]').forEach(el => el.textContent = fmt(coins())); });
  onBus('settings', () => { $('#announce').innerHTML = announceHTML(); });
  await startRouter();
  bindMini(); bindSecrets();
  initIntro();
  setTimeout(renderCookieBar, 700);
  // Temps passé sur le site (onglet visible)
  setInterval(() => { if (document.visibilityState !== 'hidden') addMinute(); }, 60000);
  // PWA
  if ('serviceWorker' in navigator && location.protocol === 'https:') addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); window.__installPrompt = e; emit('installable'); });
}
boot();
