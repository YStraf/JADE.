// Sons d'interface (Web Audio), coupés par défaut.
import { store } from './store.js';
let ctx = null, on = store.get('sfx', false);
function ac() { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* pas d'audio */ } } if (ctx && ctx.state === 'suspended') ctx.resume(); return ctx; }
function tone(f, dur, type, vol) {
  if (!on) return; const c = ac(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type || 'sine'; o.frequency.setValueAtTime(f, c.currentTime);
  g.gain.setValueAtTime(0, c.currentTime); g.gain.linearRampToValueAtTime(vol || .06, c.currentTime + .008);
  g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + dur);
  o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + dur + .02);
}
export const SFX = {
  hover() { tone(880, .05, 'sine', .035); },
  click() { tone(520, .07, 'triangle', .07); setTimeout(() => tone(780, .07, 'triangle', .05), 35); },
  enter() { tone(330, .18, 'sine', .07); setTimeout(() => tone(494, .22, 'sine', .06), 90); setTimeout(() => tone(660, .3, 'sine', .05), 180); },
  coin() { tone(988, .08, 'square', .03); setTimeout(() => tone(1319, .14, 'square', .03), 70); },
  tick() { tone(1200, .025, 'square', .02); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, .18, 'triangle', .05), i * 90)); },
  lose() { tone(300, .2, 'sawtooth', .03); setTimeout(() => tone(220, .25, 'sawtooth', .03), 120); },
  get on() { return on; },
  set(v) { on = v; store.set('sfx', v); if (v) { ac(); this.click(); } },
};
