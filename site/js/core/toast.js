import { $ } from './dom.js';
let h;
export function toast(m) { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.add('show'); clearTimeout(h); h = setTimeout(() => t.classList.remove('show'), 2600); }
// Pastilles empilées (XP, coins, niveau)
export function pop(txt, kind = '') { const box = $('#pops'); if (!box) return; const el = document.createElement('div'); if (kind) el.className = kind; el.innerHTML = (kind === 'coins' ? '<span class="coin"></span>' : '') + txt.replace(/</g, '&lt;'); box.appendChild(el); setTimeout(() => el.remove(), 3300); }
