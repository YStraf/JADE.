// Forum et défis (stockage local en attendant le serveur).
import { store, us } from '../core/store.js';
import { emit } from '../core/bus.js';
import { me } from './account.js';

export function posts() { return store.get('posts2', null) || []; }
export function savePosts(p) { store.set('posts2', p); emit('forum'); }
export function myPostsCount() { const m = me(); return m ? posts().filter(p => p.uid === m.id).length : 0; }
export function reactions() { return us.get('reactions', {}); }
export function saveReactions(r) { us.set('reactions', r); emit('forum'); }
export function reports() { return store.get('reports', []); }
export function addReport(r) { const l = reports(); l.unshift(r); store.set('reports', l.slice(0, 200)); }
export function saveReports(l) { store.set('reports', l); }

export function nextMonday(from = new Date()) { const d = new Date(from); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7)); return d; }
export function weekKey(d = new Date()) { const m = nextMonday(d); m.setDate(m.getDate() - 7); return m.getFullYear() + '-' + (m.getMonth() + 1) + '-' + m.getDate(); }
export function challenge() { return { title: '', scen: 'Air Angelic 4', scenAim: 'Motionshot', desc: '', prize: '', ...store.get('challenge', {}) }; }
export function saveChallenge(c) { store.set('challenge', c); emit('challenge'); }
export function myEntries() { return us.get('entries', {}); }
export function myChallengeCount() { return Object.keys(myEntries()).length; }
export function saveEntry(wk, e) { const en = myEntries(); en[wk] = e; us.set('entries', en); emit('challenge'); }
