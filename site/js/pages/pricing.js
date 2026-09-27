// Formules et tarifs.
import { esc } from '../core/dom.js';
import { t, C } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { toast } from '../core/toast.js';
import { me } from '../state/account.js';
import { openAuth } from '../components/auth.js';
import { go } from '../core/router.js';
import { pageHead, noteBox } from '../components/ui.js';
export default {
  title: () => t('nav.pricing'),
  render() {
    return pageHead(esc(t('nav.pricing')), esc(t('pricing.sub'))) + noteBox(esc(t('pricing.notActive')), 'info') +
      '<div class="pricing section">' + C('plans').map(p => '<div class="plan' + (p.id === 'premium' ? ' best' : '') + '">' + (p.id === 'premium' ? '<span class="best-tag">' + esc(t('pricing.best')) + '</span>' : '') + '<b>' + esc(p.name) + '</b><p class="tagline">' + esc(p.tag) + '</p><div class="price">' + esc(p.price) + ' <small>' + esc(p.per) + '</small></div><ul>' + p.f.map(f => '<li>' + ic('check') + esc(f) + '</li>').join('') + '</ul><button class="btn ' + (p.id === 'free' ? '' : 'primary') + '" data-choose="' + p.id + '">' + esc(p.id === 'free' ? t('pricing.startFree') : t('common.soon')) + '</button></div>').join('') + '</div>' +
      '<div class="card section"><h3>' + esc(t('pricing.compare')) + '</h3><div class="table-wrap"><table class="cmp"><thead><tr><th></th>' + C('plans').map(p => '<th>' + esc(p.name) + '</th>').join('') + '</tr></thead><tbody>' + C('planRows').map(r => '<tr><td>' + esc(r[0]) + '</td>' + r.slice(1).map(v => '<td>' + (v === 1 ? '<span class="yes">' + ic('check') + '</span>' : v === 0 ? '<span class="no">—</span>' : '<span class="yes">' + esc(v) + '</span>') + '</td>').join('') + '</tr>').join('') + '</tbody></table></div></div>' +
      '<div class="card section"><h3>' + esc(t('pricing.faq')) + '</h3><div class="faq">' + C('payFaq').map(f => '<details><summary>' + esc(f[0]) + '</summary><p>' + esc(f[1]) + '</p></details>').join('') + '</div><p class="inline-note">' + esc(t('pricing.ttc')) + ' <a href="#/legal/cgv">' + esc(t('legal.short.cgv')) + '</a></p></div>';
  },
  mount(root) { root.addEventListener('click', e => { const b = e.target.closest('[data-choose]'); if (!b) return; if (b.dataset.choose === 'free') { if (me()) go('routines'); else openAuth('up'); } else toast(t('sub.notActive')); }); },
};
