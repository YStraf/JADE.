import { esc } from './dom.js';
import { t } from './i18n.js';
let stack = [];
export function openModal(html, { width, cls = '', label = '', onClose } = {}) {
  const m = document.createElement('div');
  m.className = 'modal ' + cls; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
  if (label) m.setAttribute('aria-label', label);
  m.innerHTML = '<div class="veil" data-close></div><div class="sheet"' + (width ? ' style="--w:' + width + '"' : '') + '><button class="close" data-close aria-label="' + esc(t('common.close')) + '">×</button>' + html + '</div>';
  const prev = document.activeElement;
  document.body.appendChild(m); document.body.style.overflow = 'hidden';
  const close = () => { if (!m.isConnected) return; m.remove(); stack = stack.filter(x => x.m !== m); if (!stack.length) document.body.style.overflow = ''; onClose && onClose(); prev && prev.focus && prev.focus(); };
  m.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', close));
  stack.push({ m, close });
  setTimeout(() => { const f = m.querySelector('[autofocus],input,select,textarea,button:not(.close)'); f && f.focus(); }, 60);
  return { el: m, close };
}
export function closeTop() { const s = stack[stack.length - 1]; if (s) { s.close(); return true; } return false; }
export function hasModal() { return stack.length > 0; }
addEventListener('keydown', e => { if (e.key === 'Escape' && stack.length) { e.preventDefault(); closeTop(); } });
export function confirmModal(msg, { ok, danger = true } = {}) {
  return new Promise(res => {
    let done = false;
    const { el, close } = openModal('<h2 style="font-size:22px">' + esc(t('common.confirm')) + '</h2><p class="lead">' + esc(msg) + '</p><div class="row-flex" style="justify-content:flex-end"><button class="btn" data-no>' + esc(t('common.cancel')) + '</button><button class="btn ' + (danger ? 'danger' : 'primary') + '" data-yes>' + esc(ok || t('common.confirm')) + '</button></div>', { width: '440px', onClose: () => { if (!done) res(false); } });
    el.querySelector('[data-no]').onclick = () => { done = true; close(); res(false); };
    el.querySelector('[data-yes]').onclick = () => { done = true; close(); res(true); };
  });
}
