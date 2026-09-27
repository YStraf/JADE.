// Routage par ancre (#/page/sous-page) : compatible hébergement statique.
import { $ } from './dom.js';
import { t } from './i18n.js';
import { emit } from './bus.js';
import { reduced } from './motion.js';

export const ROUTES = {
  '': 'home', routines: 'routines', tests: 'tests', progression: 'progression', optimisation: 'optimisation',
  defis: 'challenges', rangs: 'ranks', pass: 'pass', forum: 'forum', shop: 'shop',
  actus: 'news', securite: 'security', formules: 'pricing', application: 'app',
  profil: 'profile', joueur: 'player', legal: 'legal', admin: 'admin',
};
// Anciens liens du prototype
const LEGACY = { accueil: '', opti: 'optimisation', tarifs: 'formules', app: 'application', defis: 'defis' };
let current = null, mod = null;
export function parse() {
  let h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
  const parts = h.split('/').filter(Boolean);
  let name = parts[0] || '';
  if (!(name in ROUTES) && name in LEGACY) name = LEGACY[name];
  return { name, sub: parts.slice(1), known: name in ROUTES };
}
export function go(path) { location.hash = '#/' + path.replace(/^#?\/?/, ''); }
export function href(path) { return '#/' + path; }
export async function render({ keepScroll = false } = {}) {
  const r = parse(); const view = $('#view');
  let file = r.known ? ROUTES[r.name] : 'notfound';
  try { mod = (await import('../pages/' + file + '.js')).default; }
  catch (e) { console.error(e); mod = (await import('../pages/notfound.js')).default; file = 'notfound'; }
  if (current && current.unmount) { try { current.unmount(); } catch (e) { console.error(e); } }
  current = mod;
  const html = await mod.render(r.sub);
  const paint = () => {
    view.innerHTML = '<div class="page page-' + file + '">' + html + '</div>';
    if (mod.mount) mod.mount(view.firstElementChild, r.sub);
    document.title = (mod.title ? mod.title(r.sub) + ' · ' : '') + 'Jade — ' + t('meta.tagline');
    if (!keepScroll) window.scrollTo({ top: 0, behavior: 'instant' });
    emit('route', r);
  };
  if (document.startViewTransition && !reduced() && !keepScroll) document.startViewTransition(paint); else paint();
}
export function rerender() { return render({ keepScroll: true }); }
export function startRouter() { addEventListener('hashchange', () => render()); return render(); }
