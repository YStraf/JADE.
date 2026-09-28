// Fenêtre de commande : récapitulatif, acceptation des CGV, renonciation au droit de rétractation (contenu numérique
// fourni immédiatement), puis redirection vers le paiement Stripe. Tant que les liens de paiement sont vides, rien n'est débité.
import { esc } from '../core/dom.js';
import { t } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { toast } from '../core/toast.js';
import { openModal } from '../core/modal.js';
import { OFFERS, PAY_LINKS, fmtPrice } from '../data/premium.js';
import { me } from '../state/account.js';
import { isPlus, subOf } from '../state/premium.js';
import { openAuth } from './auth.js';

export function openCheckout(offer) {
  const o = OFFERS[offer]; if (!o) return;
  const u = me(); if (!u) { openAuth('up'); return; }
  if (o.kind === 'sub' && isPlus() && subOf().renew) { toast(t('pay.already')); return; }
  const open = !!PAY_LINKS[offer];
  const { el, close } = openModal('<h2>' + esc(t('pay.title.' + offer)) + '</h2><p class="lead">' + esc(t('pay.desc.' + offer)) + '</p>' +
    '<div class="co-sum"><span>' + esc(t('pay.total')) + '</span><b>' + fmtPrice(o.price) + '</b><small>' + esc(t('pay.per.' + offer)) + '</small></div>' +
    '<ul class="co-list">' + t('pay.list.' + offer).split('|').map(x => '<li>' + ic('check') + esc(x) + '</li>').join('') + '</ul>' +
    '<label class="check"><input type="checkbox" id="coCgv"><span>' + t('pay.cgv', { link: '<a href="#/legal/cgv" target="_blank">' + esc(t('legal.short.cgv')) + '</a>' }) + '</span></label>' +
    '<label class="check" style="margin-top:8px"><input type="checkbox" id="coNow"><span>' + esc(t('pay.waiver')) + '</span></label>' +
    (o.kind === 'sub' ? '<p class="inline-note">' + esc(t('pay.renewNote.' + o.cycle)) + '</p>' : '') +
    (open ? '' : '<p class="note-box warn" style="margin-top:12px">' + ic('info') + '<span>' + esc(t('pay.closed')) + '</span></p>') +
    '<div class="row-flex" style="justify-content:flex-end;margin-top:16px"><button class="btn" data-close>' + esc(t('common.cancel')) + '</button><button class="btn primary" id="coPay">' + ic('card') + esc(t('pay.btn', { p: fmtPrice(o.price) })) + '</button></div>' +
    '<p class="inline-note co-secure">' + ic('lock') + esc(t('pay.secure')) + '</p>', { width: '520px', label: t('pay.title.' + offer) });
  el.querySelector('#coPay').addEventListener('click', () => {
    if (!el.querySelector('#coCgv').checked) return toast(t('pay.needCgv'));
    if (!el.querySelector('#coNow').checked) return toast(t('pay.needWaiver'));
    if (!open) { toast(t('pay.closedToast')); return; }
    const url = new URL(PAY_LINKS[offer]);
    url.searchParams.set('client_reference_id', u.id); url.searchParams.set('prefilled_email', u.email);
    close(); location.href = url.toString();
  });
}
