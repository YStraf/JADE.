// Application Jade (vitrine) + inscription « Me prévenir ».
import { $, esc } from '../core/dom.js';
import { store } from '../core/store.js';
import { t, C } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { toast } from '../core/toast.js';
import { hasPerk } from '../state/economy.js';
import { pageHead } from '../components/ui.js';
const B = { planned: ['badge', 'app.planned'], study: ['badge', 'app.study'], online: ['badge ok', 'app.online'], progress: ['badge', 'app.progress'], notstarted: ['badge no', 'app.notStarted'] };
export default {
  title: () => t('nav.app'),
  render() {
    const A = C('app');
    return pageHead(esc(t('app.title')) + ' <span class="tag jade">' + esc(t('app.dev')) + '</span>', esc(t('app.sub'))) +
      (hasPerk('beta') ? '<div class="note-box" style="margin-bottom:18px">' + ic('sparkles') + '<div><b>' + esc(t('app.betaUnlocked')) + '</b><br>' + esc(t('app.betaSub')) + '</div></div>' : '') +
      '<div class="grid-2"><div><div class="card"><h3>' + esc(t('app.features')) + '</h3>' + A.features.map(f => '<div class="row"><div class="lbl"><b>' + esc(f[0]) + '</b><span>' + esc(f[1]) + '</span></div><span class="' + B[f[2]][0] + '">' + esc(t(B[f[2]][1])) + '</span></div>').join('') + '</div>' +
      '<div class="card"><h3>' + esc(t('app.status')) + '</h3>' + A.status.map(f => '<div class="row"><div class="lbl"><b>' + esc(f[0]) + '</b><span>' + esc(f[1]) + '</span></div><span class="' + B[f[2]][0] + '">' + esc(t(B[f[2]][1])) + '</span></div>').join('') + '</div></div>' +
      '<div class="card"><span class="big-ic">' + ic('bell') + '</span><h3>' + esc(t('app.notify')) + '</h3><p class="desc">' + esc(t('app.notifySub')) + '</p><div class="field"><label for="appMail">' + esc(t('auth.email')) + '</label><input type="email" id="appMail" placeholder="toi@exemple.fr"></div><label class="check" style="margin-bottom:14px"><input type="checkbox" id="appOk"><span>' + esc(t('app.consent')) + '</span></label><p class="error" id="appErr"></p><button class="btn primary block" id="appGo">' + esc(t('app.notifyBtn')) + '</button><p class="inline-note">' + esc(t('app.notifyNote')) + '</p></div></div>';
  },
  mount(root) {
    $('#appGo', root).onclick = () => { const v = $('#appMail', root).value.trim(), er = $('#appErr', root); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { er.textContent = t('auth.err.email'); er.classList.add('show'); return; } if (!$('#appOk', root).checked) { er.textContent = t('app.errConsent'); er.classList.add('show'); return; } er.classList.remove('show'); store.set('notifyMail', { v, t: Date.now() }); toast(t('app.noted')); };
  },
};
