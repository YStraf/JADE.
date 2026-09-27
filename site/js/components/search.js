// Recherche globale (Ctrl K ou /) : pages, routines, scénarios, réglages d'optimisation, fiches sécurité, documents légaux, réglages du profil.
import { esc } from '../core/dom.js';
import { t, C } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { openModal } from '../core/modal.js';
import { go } from '../core/router.js';
import { ROUTINES } from '../data/routines.js';
import { OPTI } from '../data/opti.js';
import { FICHES } from '../data/security.js';

const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function buildIndex() {
  const idx = [];
  const pages = [['', 'home', 'nav.home'], ['routines', 'routine', 'nav.routines'], ['tests', 'target', 'nav.tests'], ['progression', 'chart', 'nav.progression'], ['optimisation', 'sliders', 'nav.optimisation'], ['defis', 'trophy', 'nav.challenges'], ['rangs', 'rank', 'nav.ranks'], ['pass', 'ticket', 'nav.pass'], ['forum', 'chat', 'nav.forum'], ['shop', 'bag', 'nav.shop'], ['actus', 'news', 'nav.news'], ['securite', 'shield', 'nav.security'], ['formules', 'card', 'nav.pricing'], ['application', 'device', 'nav.app'], ['profil', 'user', 'nav.profile'], ['legal', 'scale', 'nav.legal']];
  pages.forEach(([r, i, k]) => idx.push({ g: 'search.g.pages', icon: i, title: t(k), sub: t(k + '.desc'), to: r }));
  const R = C('routines');
  ROUTINES.forEach(r => { const tr = R[r.id] || {}; idx.push({ g: 'search.g.routines', icon: 'routine', title: tr.title || r.id, sub: r.soft + ' · ' + r.blocks.map(b => b[1]).join(', '), to: 'routines/' + r.id }); });
  const O = C('opti');
  OPTI.forEach(cat => cat.tips.forEach(tip => { const x = O.tips[tip.id] || {}; idx.push({ g: 'search.g.opti', icon: cat.icon, title: x.t || tip.id, sub: (O.cats[cat.id] || {}).name + ' · ' + (x.w || ''), to: 'optimisation/' + cat.id + '/' + tip.id }); }));
  const S = C('security');
  FICHES.forEach(f => { const x = S.fiches[f.id] || {}; idx.push({ g: 'search.g.security', icon: 'shield', title: x.t || f.id, sub: x.how || '', to: 'securite/' + f.id }); });
  (C('legal') || []).forEach(d => idx.push({ g: 'search.g.legal', icon: 'scale', title: d.title, sub: t('nav.legal'), to: 'legal/' + d.id }));
  ['account', 'showcase', 'xp', 'inventory', 'security', 'perso', 'notif', 'support', 'data'].forEach(k => idx.push({ g: 'search.g.settings', icon: 'settings', title: t('profile.tab.' + k), sub: t('nav.profile'), to: 'profil/' + k }));
  ['flick', 'precision', 'reaction', 'tracking', 'switching'].forEach(k => idx.push({ g: 'search.g.tests', icon: 'target', title: t('test.' + k + '.name'), sub: t('test.' + k + '.desc'), to: 'tests/' + k }));
  idx.forEach(x => { x.n = norm(x.title + ' ' + x.sub); });
  return idx;
}
export function openSearch() {
  if (document.querySelector('.palette')) return;
  const idx = buildIndex();
  const { el, close } = openModal('<div class="search-in">' + ic('search') + '<input type="search" id="qIn" placeholder="' + esc(t('search.placeholder')) + '" autocomplete="off" aria-label="' + esc(t('search.open')) + '"></div><div class="results" id="qRes" role="listbox"></div><div class="hint"><span><kbd>↑</kbd> <kbd>↓</kbd> ' + esc(t('search.move')) + '</span><span><kbd>↵</kbd> ' + esc(t('search.go')) + '</span><span><kbd>Esc</kbd> ' + esc(t('common.close')) + '</span></div>', { cls: 'palette', label: t('search.open') });
  const inp = el.querySelector('#qIn'), res = el.querySelector('#qRes');
  let items = [], sel = 0;
  const draw = () => {
    const q = norm(inp.value.trim()); const words = q.split(/\s+/).filter(Boolean);
    items = words.length ? idx.filter(x => words.every(w => x.n.includes(w))).slice(0, 40) : idx.filter(x => x.g === 'search.g.pages');
    sel = 0;
    if (!items.length) { res.innerHTML = '<p class="empty" style="margin:8px">' + esc(t('search.none')) + '</p>'; return; }
    let last = '', h = '';
    items.forEach((x, i) => { if (x.g !== last) { h += '<div class="grp">' + esc(t(x.g)) + '</div>'; last = x.g; } h += '<button class="res" role="option" data-i="' + i + '" aria-selected="' + (i === sel) + '"><span class="ic">' + ic(x.icon) + '</span><span style="min-width:0"><b>' + esc(x.title) + '</b><small>' + esc(x.sub) + '</small></span></button>'; });
    res.innerHTML = h;
  };
  const pick = i => { const x = items[i]; if (!x) return; close(); go(x.to); };
  const mark = () => { res.querySelectorAll('.res').forEach(b => b.setAttribute('aria-selected', +b.dataset.i === sel)); const b = res.querySelector('[data-i="' + sel + '"]'); b && b.scrollIntoView({ block: 'nearest' }); };
  inp.addEventListener('input', draw);
  inp.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(items.length - 1, sel + 1); mark(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); mark(); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(sel); }
  });
  res.addEventListener('click', e => { const b = e.target.closest('.res'); if (b) pick(+b.dataset.i); });
  draw(); setTimeout(() => inp.focus(), 30);
}
