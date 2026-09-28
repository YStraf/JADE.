// Stockage local préfixé. Toutes les lectures/écritures sont protégées (navigation privée, quota).
const P = 'jade:';
function read(s, k, d) { try { const v = s.getItem(P + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
function write(s, k, v) { try { if (v === undefined) s.removeItem(P + k); else s.setItem(P + k, JSON.stringify(v)); return true; } catch (e) { return false; } }
const LS = (() => { try { return window.localStorage; } catch (e) { return null; } })();
const SS = (() => { try { return window.sessionStorage; } catch (e) { return null; } })();
export const store = { get: (k, d) => LS ? read(LS, k, d) : d, set: (k, v) => LS && write(LS, k, v), del: k => LS && write(LS, k, undefined) };
export const session = { get: (k, d) => SS ? read(SS, k, d) : d, set: (k, v) => SS && write(SS, k, v), del: k => SS && write(SS, k, undefined) };

// Données propres au compte courant (ou à l'invité).
let UID = 'guest';
export function setUid(id) { UID = id || 'guest'; }
export function uid() { return UID; }
export const us = {
  get: (k, d) => store.get('u:' + UID + ':' + k, d),
  set: (k, v) => store.set('u:' + UID + ':' + k, v),
  getFor: (id, k, d) => store.get('u:' + id + ':' + k, d),
  setFor: (id, k, v) => store.set('u:' + id + ':' + k, v),
};
export function purgeAll() { try { Object.keys(localStorage).filter(k => k.startsWith(P)).forEach(k => localStorage.removeItem(k)); } catch (e) { /* ignoré */ } }
