// Modale connexion / inscription (comptes locaux en attendant le serveur).
import { esc } from '../core/dom.js';
import { t } from '../core/i18n.js';
import { openModal } from '../core/modal.js';
import { toast } from '../core/toast.js';
import { SFX } from '../core/sfx.js';
import { signup, login } from '../state/account.js';
import { go } from '../core/router.js';

export function openAuth(mode = 'in') {
  const up = mode === 'up';
  const html = '<h2>' + esc(up ? t('auth.signup') : t('auth.signin')) + '</h2><p class="lead">' + esc(up ? t('auth.subUp') : t('auth.subIn')) + '</p>' +
    '<form data-form novalidate>' +
    (up ? '<div class="field"><label for="aPseudo">' + esc(t('auth.pseudo')) + '</label><input id="aPseudo" type="text" maxlength="24" autocomplete="nickname" placeholder="' + esc(t('auth.pseudoPh')) + '"></div>' : '') +
    '<div class="field"><label for="aEmail">' + esc(t('auth.email')) + '</label><input id="aEmail" type="email" autocomplete="email"></div>' +
    '<div class="field"><label for="aPass">' + esc(t('auth.password')) + '</label><input id="aPass" type="password" autocomplete="' + (up ? 'new-password' : 'current-password') + '" minlength="8"></div>' +
    (up ? '<div class="field"><label for="aBirth">' + esc(t('auth.birth')) + '</label><input id="aBirth" type="date" max="' + new Date().toISOString().slice(0, 10) + '"></div>' +
      '<label class="check" style="margin-bottom:14px"><input type="checkbox" id="aTerms"><span>' + t('auth.terms', { cgu: '<a href="#/legal/cgu" data-close>' + esc(t('legal.short.cgu')) + '</a>', privacy: '<a href="#/legal/privacy" data-close>' + esc(t('legal.short.privacy')) + '</a>' }) + '</span></label>' : '') +
    '<p class="error" id="aErr"></p>' +
    '<button class="btn primary block" type="submit">' + esc(up ? t('auth.signup') : t('auth.signin')) + '</button></form>' +
    '<div class="row-flex" style="margin:16px 0 6px"><span style="flex:1;height:1px;background:var(--line)"></span><span class="muted" style="font-size:12.5px">' + esc(t('auth.or')) + '</span><span style="flex:1;height:1px;background:var(--line)"></span></div>' +
    '<div class="stack" style="--gap:8px"><button class="btn block" disabled>' + esc(t('auth.google')) + ' · ' + esc(t('common.soon')) + '</button><button class="btn block" disabled>' + esc(t('auth.steam')) + ' · ' + esc(t('common.soon')) + '</button></div>' +
    '<p class="inline-note">' + esc(t('auth.localNote')) + '</p>' +
    '<p class="center" style="margin-top:12px"><button class="link-btn" data-swap>' + esc(up ? t('auth.haveAccount') : t('auth.noAccount')) + '</button></p>';
  const { el, close } = openModal(html, { width: '480px', label: up ? t('auth.signup') : t('auth.signin') });
  el.querySelector('[data-swap]').onclick = () => { close(); openAuth(up ? 'in' : 'up'); };
  el.querySelector('[data-form]').onsubmit = async e => {
    e.preventDefault(); const err = el.querySelector('#aErr');
    const v = id => (el.querySelector(id) || {}).value;
    const res = up
      ? await signup({ pseudo: v('#aPseudo'), email: v('#aEmail'), password: v('#aPass'), birth: v('#aBirth'), terms: el.querySelector('#aTerms').checked })
      : await login(v('#aEmail'), v('#aPass'));
    if (res) { err.textContent = t(res); err.classList.add('show'); return; }
    close(); SFX.enter(); toast(t('auth.welcome', { name: v('#aPseudo') || '' }).replace(/,\s*$/, ''));
    if (up) go('profil');
  };
}
