// Comptes en ligne (Supabase) : le même compte sur le site et dans l'application.
// Sans configuration (data/cloud-config.js vide), Jade garde ses comptes locaux.
// Les données du joueur (progression, objets, vitrine…) sont synchronisées en un bloc JSON par compte ;
// l'abonnement Jade+ et les achats ne viennent QUE du serveur (écrits par le webhook Stripe).
import { CLOUD } from '../data/cloud-config.js';
import { store } from '../core/store.js';
export const enabled = () => !!(CLOUD.url && CLOUD.anonKey);
const SKIP = /^(sub|purchases|wmedia:)/; // jamais envoyé par le navigateur
const sess = () => store.get('cloud:session', null);
async function req(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const h = { apikey: CLOUD.anonKey, 'Content-Type': 'application/json', ...headers };
  if (auth) { const s = await session(); if (s) h.Authorization = 'Bearer ' + s.access_token; }
  const r = await fetch(CLOUD.url + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => null);
  return { ok: r.ok, status: r.status, data: j };
}
const keep = d => { if (d && d.access_token) store.set('cloud:session', { access_token: d.access_token, refresh_token: d.refresh_token, expires_at: Date.now() + (d.expires_in || 3600) * 1000, user: d.user }); return d; };
export async function session() {
  const s = sess(); if (!s) return null;
  if (s.expires_at - Date.now() > 60000) return s;
  const r = await fetch(CLOUD.url + '/auth/v1/token?grant_type=refresh_token', { method: 'POST', headers: { apikey: CLOUD.anonKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: s.refresh_token }) });
  if (!r.ok) { store.del('cloud:session'); return null; }
  return keep(await r.json()) && sess();
}
export async function signUp(email, password, meta) {
  const r = await req('/auth/v1/signup', { method: 'POST', auth: false, body: { email, password, data: meta } });
  if (!r.ok) return { error: /registered|exists/i.test(JSON.stringify(r.data)) ? 'auth.err.emailTaken' : 'auth.err.cloud' };
  if (!r.data.access_token) return { confirm: true };
  keep(r.data);
  const p = await req('/rest/v1/profiles', { method: 'POST', body: { id: r.data.user.id, pseudo: meta.pseudo }, headers: { Prefer: 'return=minimal' } });
  if (!p.ok) return { error: p.status === 409 ? 'auth.err.pseudoTaken' : 'auth.err.cloud' };
  return { user: r.data.user };
}
export async function signIn(email, password) {
  const r = await req('/auth/v1/token?grant_type=password', { method: 'POST', auth: false, body: { email, password } });
  if (!r.ok) return { error: /confirm/i.test(JSON.stringify(r.data)) ? 'auth.err.confirm' : 'auth.err.bad' };
  keep(r.data); return { user: r.data.user };
}
export function signOut() { store.del('cloud:session'); }
function blob(uid) {
  const pre = 'jade:u:' + uid + ':', out = {};
  try { Object.keys(localStorage).filter(k => k.startsWith(pre)).forEach(k => { const n = k.slice(pre.length); if (!SKIP.test(n)) out[n] = localStorage.getItem(k); }); } catch (e) { /* ignoré */ }
  return out;
}
let lastPushed = '';
export async function push(uid) {
  if (!enabled() || !sess()) return false;
  const data = blob(uid), js = JSON.stringify(data); if (js === lastPushed) return true;
  const r = await req('/rest/v1/user_state', { method: 'POST', body: { user_id: uid, data, updated_at: new Date().toISOString() }, headers: { Prefer: 'resolution=merge-duplicates,return=minimal' } });
  if (r.ok) lastPushed = js; return r.ok;
}
// Récupère l'état du compte (et l'abonnement réel) dans le stockage local.
export async function pull(uid) {
  if (!enabled() || !sess()) return false;
  const pre = 'jade:u:' + uid + ':';
  const r = await req('/rest/v1/user_state?select=data&user_id=eq.' + uid);
  if (r.ok && r.data && r.data[0]) { Object.entries(r.data[0].data || {}).forEach(([k, v]) => { try { localStorage.setItem(pre + k, v); } catch (e) { /* quota */ } }); lastPushed = JSON.stringify(blob(uid)); }
  const s = await req('/rest/v1/subscriptions?select=offer,until,renew,source&user_id=eq.' + uid);
  try { if (s.ok && s.data && s.data[0]) localStorage.setItem(pre + 'sub', JSON.stringify({ ...s.data[0], until: Date.parse(s.data[0].until) })); else localStorage.removeItem(pre + 'sub'); } catch (e) { /* ignoré */ }
  const b = await req('/rest/v1/purchases?select=offer,created_at,price&user_id=eq.' + uid + '&order=created_at.desc');
  try { if (b.ok && Array.isArray(b.data)) localStorage.setItem(pre + 'purchases', JSON.stringify(b.data.map(x => ({ offer: x.offer, t: Date.parse(x.created_at), price: +x.price, source: 'stripe' })))); } catch (e) { /* ignoré */ }
  return true;
}
// Envoi automatique toutes les 20 s si quelque chose a changé.
let timer = 0;
export function autoPush(getUid) { clearInterval(timer); if (enabled()) timer = setInterval(() => { const u = getUid(); if (u) push(u); }, 20000); }
