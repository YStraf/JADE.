export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
export function on(root, sel, ev, fn) { root.addEventListener(ev, e => { const el = e.target.closest && e.target.closest(sel); if (el && root.contains(el)) fn(e, el); }); }
export function debounce(fn, ms = 200) { let h; return (...a) => { clearTimeout(h); h = setTimeout(() => fn(...a), ms); }; }
export function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
export async function sha256(txt) { try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); } catch (e) { return null; } }
export function download(name, data, type = 'application/json') { const blob = new Blob([data], { type }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
export function uidGen() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
export function dayKey(ts) { const d = new Date(ts); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
