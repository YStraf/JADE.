// Jade+ : abonnement et achats. Stocké par compte ; la vérification réelle des paiements passera par le serveur.
import { us } from '../core/store.js';
import { emit } from '../core/bus.js';
import { OFFERS, LIMITS } from '../data/premium.js';
const DAY = 864e5;
export const subOf = id => (id ? us.getFor(id, 'sub', null) : us.get('sub', null));
export const isActive = s => !!s && s.until > Date.now();
export const isPlus = id => isActive(subOf(id));
export const maxWidgets = id => (isPlus(id) ? LIMITS.plus : LIMITS.free);
export const purchases = () => us.get('purchases', []);
function setSub(s, id) { if (id) us.setFor(id, 'sub', s); else us.set('sub', s); emit('user'); }
// Ajoute des jours d'accès (paiement confirmé, offre Fondateur, geste de l'équipe).
export function grantPlus(days, source, offer = 'plus_m', id) {
  const cur = subOf(id); const on = isActive(cur);
  setSub({ offer, since: on ? cur.since : Date.now(), until: (on ? cur.until : Date.now()) + days * DAY, renew: source === 'stripe' && OFFERS[offer].kind === 'sub', source }, id);
}
export function cancelRenew(id) { const s = subOf(id); if (!s) return; s.renew = false; setSub(s, id); }
export function endPlus(id) { if (id) us.setFor(id, 'sub', undefined); else us.set('sub', undefined); emit('user'); }
export function recordPurchase(offer, source) {
  const l = purchases(); l.unshift({ offer, t: Date.now(), price: OFFERS[offer].price, source }); us.set('purchases', l.slice(0, 100));
}
export const hasFounder = () => purchases().some(p => p.offer === 'founder');
