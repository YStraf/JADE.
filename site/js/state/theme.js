import { store } from '../core/store.js';
import { emit } from '../core/bus.js';
import { owned } from './economy.js';
export function applyTheme(th) {
  if (th === 'contrast' && !owned('theme:contrast')) th = 'dark';
  if (th === 'jade' && !owned('theme:jade')) th = 'dark';
  document.documentElement.setAttribute('data-theme', th);
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = th === 'light' ? '#FFFFFF' : th === 'jade' ? '#04140d' : '#0B0F0D';
}
// Les variantes sombres débloquées (contraste, Jade) deviennent le « sombre » du bouton soleil/lune.
export function setTheme(th) { store.set('theme', th); if (th !== 'light') store.set('darkVariant', th); applyTheme(th); emit('theme'); }
