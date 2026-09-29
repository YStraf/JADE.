// Jade+ : offres, comparatif, FAQ. Le paiement passe par components/checkout.js.
import { esc } from '../core/dom.js';
import { t, C, fmtDate } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { me } from '../state/account.js';
import { isPlus, subOf, hasFounder } from '../state/premium.js';
import { OFFERS, fmtPrice } from '../data/premium.js';
import { openAuth } from '../components/auth.js';
import { openCheckout } from '../components/checkout.js';
import { go } from '../core/router.js';
import { isApp, openSite } from '../core/native.js';
import { pageHead, avatar, banner, titlePill } from '../components/ui.js';

let yearly = true;
function cards() {
  const plus = isPlus(), s = subOf();
  const yr = OFFERS.plus_y, mo = OFFERS.plus_m, save = Math.round((1 - yr.price / (mo.price * 12)) * 100);
  const cur = id => '<button class="btn" disabled>' + esc(t('sub.current')) + '</button>';
  return '<div class="pr-toggle seg-lite" role="group"><button type="button" data-cycle="m" aria-pressed="' + !yearly + '">' + esc(t('pr.monthly')) + '</button><button type="button" data-cycle="y" aria-pressed="' + yearly + '">' + esc(t('pr.yearly')) + ' <span class="tag jade">-' + save + ' %</span></button></div>' +
    '<div class="pricing section">' +
    '<div class="plan"><b>' + esc(t('pr.free')) + '</b><p class="tagline">' + esc(t('pr.free.tag')) + '</p><div class="price">' + fmtPrice(0) + ' <small>' + esc(t('pr.forever')) + '</small></div><ul>' + t('pr.free.list').split('|').map(f => '<li>' + ic('check') + esc(f) + '</li>').join('') + '</ul>' + (me() ? (plus ? '' : cur()) : '<button class="btn" data-choose="free">' + esc(t('pricing.startFree')) + '</button>') + '</div>' +
    '<div class="plan best plus-card"><span class="best-tag">Jade+</span><b>Jade+</b><p class="tagline">' + esc(t('pr.plus.tag')) + '</p><div class="price">' + fmtPrice(yearly ? yr.price : mo.price) + ' <small>' + esc(t(yearly ? 'pr.perYear' : 'pr.perMonth')) + '</small></div>' + (yearly ? '<p class="muted small-note">' + esc(t('pr.yearEq', { p: fmtPrice(yr.price / 12) })) + '</p>' : '') + '<ul>' + t('pr.plus.list').split('|').map(f => '<li>' + ic('check') + esc(f) + '</li>').join('') + '</ul>' +
    (plus ? '<button class="btn" disabled>' + esc(t('pr.activeUntil', { d: fmtDate(s.until) })) + '</button>' : '<button class="btn primary" data-choose="' + (yearly ? 'plus_y' : 'plus_m') + '">' + ic('sparkles') + esc(t('pr.plus.cta')) + '</button>') + '</div>' +
    '<div class="plan founder-card"><span class="best-tag gold">' + esc(t('pr.limited')) + '</span><b>' + esc(t('pr.founder')) + '</b><p class="tagline">' + esc(t('pr.founder.tag')) + '</p><div class="price">' + fmtPrice(OFFERS.founder.price) + ' <small>' + esc(t('pr.once')) + '</small></div>' +
    '<div class="founder-prev">' + banner({ banner: 'founder' }, '', 64) + '<div class="row-flex">' + avatar({ pseudo: (me() || {}).pseudo || 'JA', style: { frame: 'founder' } }, 44) + titlePill(t('item.title.founder'), 'founder') + '</div></div>' +
    '<ul>' + t('pr.founder.list').split('|').map(f => '<li>' + ic('check') + esc(f) + '</li>').join('') + '</ul>' +
    (hasFounder() ? '<button class="btn" disabled>' + esc(t('pr.owned')) + '</button>' : '<button class="btn primary" data-choose="founder">' + esc(t('pr.founder.cta')) + '</button>') + '</div></div>';
}
export default {
  title: () => t('nav.pricing'),
  render() {
    if (isApp) {
      const s = subOf();
      return pageHead('Jade+', esc(t('pricing.sub'))) + '<div class="card app-plus"><div class="app-plus-head"><span class="tag plus-tag">Jade+</span><h3>' + esc(isPlus() ? t('pr.activeUntil', { d: fmtDate(s.until) }) : t('app.plusWeb')) + '</h3><p class="muted">' + esc(t('app.plusWebSub')) + '</p></div><ul class="co-list">' + t('pr.plus.list').split('|').map(f => '<li>' + ic('check') + esc(f) + '</li>').join('') + '</ul><button class="btn primary" data-site>' + ic('ext') + esc(t('app.openSite')) + '</button></div>';
    }
    return pageHead(esc(t('nav.pricing')), esc(t('pricing.sub'))) + '<div id="prCards">' + cards() + '</div>' +
      '<div class="card section"><h3>' + esc(t('pricing.compare')) + '</h3><div class="table-wrap"><table class="cmp"><thead><tr><th></th><th>' + esc(t('pr.free')) + '</th><th>Jade+</th></tr></thead><tbody>' + C('planRows').map(r => '<tr><td>' + esc(r[0]) + '</td>' + r.slice(1).map(v => '<td>' + (v === 1 ? '<span class="yes">' + ic('check') + '</span>' : v === 0 ? '<span class="no">—</span>' : '<span class="yes">' + esc(v) + '</span>') + '</td>').join('') + '</tr>').join('') + '</tbody></table></div></div>' +
      '<div class="card section"><h3>' + esc(t('pricing.faq')) + '</h3><div class="faq">' + C('payFaq').map(f => '<details><summary>' + esc(f[0]) + '</summary><p>' + esc(f[1]) + '</p></details>').join('') + '</div><p class="inline-note">' + esc(t('pricing.ttc')) + ' <a href="#/legal/cgv">' + esc(t('legal.short.cgv')) + '</a></p></div>';
  },
  mount(root) {
    root.addEventListener('click', e => {
      if (e.target.closest('[data-site]')) { openSite('formules'); return; }
      const cy = e.target.closest('[data-cycle]'); if (cy) { yearly = cy.dataset.cycle === 'y'; root.querySelector('#prCards').innerHTML = cards(); return; }
      const b = e.target.closest('[data-choose]'); if (!b) return;
      if (b.dataset.choose === 'free') { if (me()) go('routines'); else openAuth('up'); return; }
      openCheckout(b.dataset.choose);
    });
  },
};
