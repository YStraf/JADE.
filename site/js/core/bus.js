// Petit bus d'événements : 'user', 'xp', 'coins', 'inventory', 'lang', 'theme', 'route'.
const M = new Map();
export function onBus(ev, fn) { if (!M.has(ev)) M.set(ev, new Set()); M.get(ev).add(fn); return () => M.get(ev).delete(fn); }
export function emit(ev, data) { (M.get(ev) || []).forEach(fn => { try { fn(data); } catch (e) { console.error(e); } }); }
