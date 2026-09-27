import { store } from './store.js';
const mq = matchMedia('(prefers-reduced-motion: reduce)');
export function reduced() { return mq.matches || store.get('anims', true) === false; }
export function applyMotionPref() { document.documentElement.classList.toggle('no-anim', store.get('anims', true) === false); }
