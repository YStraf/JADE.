// Comptes locaux (pas encore de serveur) : plusieurs comptes possibles sur un même navigateur.
import { store, us, session, setUid } from '../core/store.js';
import { sha256, uidGen } from '../core/dom.js';
import { emit } from '../core/bus.js';
import * as cloud from './cloud.js';

export const DEF_PROFILE = {
  bio: '', plan: 'free',
  style: { banner: 'aurora', frame: 'jade', title: '', bg: 'none', avatarImg: '', avatarZoom: 100, avatarX: 50, avatarY: 50, bannerImg: '', bannerZoom: 100, bannerX: 50, bannerY: 50, nameColor: true, customTitle: '' },
  widgets: ['records', 'scen', 'streak', 'badges'],
  prefs: { publicProfile: true, showScores: true },
  notif: { weekly: true, challenge: true, replies: true, news: false },
  links: { steam: false, faceit: false, google: false, riot: false },
  secrets: [],
};
export function accounts() { return store.get('accounts', []); }
function saveAccounts(l) { store.set('accounts', l); }
let cur = null;
export function initAccount() {
  const id = store.get('current', null);
  cur = accounts().find(a => a.id === id) || null;
  setUid(cur ? cur.id : 'guest');
}
export function me() { return cur; }
export function isAdminSession() { return session.get('adm', false) === true; }
export function isAdmin() { return isAdminSession() || (cur && cur.role === 'admin'); }
export function profile(id) {
  const p = id ? us.getFor(id, 'profile', null) : us.get('profile', null);
  const d = JSON.parse(JSON.stringify(DEF_PROFILE));
  if (!p) return d;
  return { ...d, ...p, style: { ...d.style, ...(p.style || {}) }, prefs: { ...d.prefs, ...(p.prefs || {}) }, notif: { ...d.notif, ...(p.notif || {}) }, links: { ...d.links, ...(p.links || {}) } };
}
export function saveProfile(p) { us.set('profile', p); emit('user'); }
export function updateProfile(fn) { const p = profile(); fn(p); saveProfile(p); return p; }
export function updateAccount(patch, id) {
  const l = accounts(); const a = l.find(x => x.id === (id || (cur && cur.id))); if (!a) return;
  Object.assign(a, patch); saveAccounts(l); if (cur && a.id === cur.id) cur = a; emit('user');
}
export function ageOf(birth) { if (!birth) return null; const b = new Date(birth), n = new Date(); let a = n.getFullYear() - b.getFullYear(); const m = n.getMonth() - b.getMonth(); if (m < 0 || (m === 0 && n.getDate() < b.getDate())) a--; return a; }
export function isAdult() { return !!cur && ageOf(cur.birth) >= 18; }
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const PSEUDO = /^[A-Za-z0-9_.-]{3,24}$/;
// Renvoie une clé d'erreur i18n ou null.
export async function signup({ pseudo, email, password, birth, terms }) {
  pseudo = (pseudo || '').trim(); email = (email || '').trim().toLowerCase();
  if (!PSEUDO.test(pseudo)) return 'auth.err.pseudo';
  if (!EMAIL.test(email)) return 'auth.err.email';
  if ((password || '').length < 8) return 'auth.err.password';
  if (!birth) return 'auth.err.birth';
  if (ageOf(birth) < 15) return 'auth.err.age';
  if (!terms) return 'auth.err.terms';
  const l = accounts();
  if (l.some(a => a.email === email)) return 'auth.err.emailTaken';
  if (l.some(a => a.pseudo.toLowerCase() === pseudo.toLowerCase()) || DEMO_NAMES.includes(pseudo.toLowerCase())) return 'auth.err.pseudoTaken';
  let id = uidGen();
  if (cloud.enabled()) { const r = await cloud.signUp(email, password, { pseudo, birth }); if (r.error) return r.error; if (r.confirm) return 'auth.confirmSent'; id = r.user.id; }
  const acc = { id, pseudo, email, pw: await sha256(email + ':' + password), birth, created: Date.now(), role: l.length ? 'member' : 'member', banned: false, terms: Date.now() };
  l.push(acc); saveAccounts(l);
  migrateGuest(acc.id);
  loginAs(acc); if (cloud.enabled()) cloud.push(acc.id);
  return null;
}
export async function login(email, password) {
  email = (email || '').trim().toLowerCase();
  if (cloud.enabled()) {
    const r = await cloud.signIn(email, password); if (r.error) return r.error;
    const l = accounts(); let a = l.find(x => x.id === r.user.id);
    if (!a) { const m = r.user.user_metadata || {}; a = { id: r.user.id, pseudo: m.pseudo || email.split('@')[0], email, birth: m.birth || '', created: Date.parse(r.user.created_at) || Date.now(), role: 'member', banned: false, terms: Date.now() }; l.push(a); saveAccounts(l); }
    await cloud.pull(a.id); loginAs(a); return null;
  }
  const a = accounts().find(x => x.email === email);
  if (!a || a.pw !== await sha256(email + ':' + password)) return 'auth.err.bad';
  if (a.banned) return 'auth.err.banned';
  loginAs(a); return null;
}
function loginAs(a) { cur = a; store.set('current', a.id); setUid(a.id); emit('user'); emit('xp'); emit('coins'); }
export function logout() { if (cur && cloud.enabled()) { const id = cur.id; cloud.push(id).finally(() => cloud.signOut()); } cur = null; store.set('current', null); setUid('guest'); emit('user'); emit('xp'); emit('coins'); }
export async function changePassword(pw) { if (!cur) return; updateAccount({ pw: await sha256(cur.email + ':' + pw) }); }
export function deleteAccount(id) {
  id = id || (cur && cur.id); if (!id) return;
  saveAccounts(accounts().filter(a => a.id !== id));
  try { Object.keys(localStorage).filter(k => k.startsWith('jade:u:' + id + ':')).forEach(k => localStorage.removeItem(k)); } catch (e) { /* ignoré */ }
  if (cur && cur.id === id) logout();
}
// Les progrès faits en invité suivent le joueur quand il crée son compte.
function migrateGuest(id) {
  try {
    Object.keys(localStorage).filter(k => k.startsWith('jade:u:guest:')).forEach(k => {
      localStorage.setItem(k.replace('jade:u:guest:', 'jade:u:' + id + ':'), localStorage.getItem(k));
      localStorage.removeItem(k);
    });
  } catch (e) { /* ignoré */ }
}
export const DEMO_NAMES = ['straf', 'nsx', 'luma', 'kyro', 'tidal', 'brixo', 'vesper'];
