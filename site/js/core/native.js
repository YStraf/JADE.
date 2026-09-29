// Couche « application » : présente seulement dans l'app Windows (Electron, voir app/). Sur le site, tout vaut null/false.
export const N = typeof window !== 'undefined' && window.jadeNative ? window.jadeNative : null;
export const isApp = !!N;
// Adresse publique du site (liens depuis l'app : Jade+, pages légales…).
export const SITE_URL = 'https://jade-aim.vercel.app';
export const openSite = path => (N ? N.open(SITE_URL + '/#/' + (path || '')) : (location.hash = '#/' + (path || '')));
