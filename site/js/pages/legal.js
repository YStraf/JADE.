// Informations légales : 10 documents, sommaire, version FR qui fait foi.
import { $, esc } from '../core/dom.js';
import { t, C, getLang, fmtDate } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { pageHead, noteBox } from '../components/ui.js';
export default {
  title: sub => { const d = (C('legal') || []).find(x => x.id === sub[0]); return d ? d.title : t('nav.legal'); },
  render(sub) {
    const docs = C('legal'); const cur = docs.find(d => d.id === sub[0]) || docs[0];
    return pageHead(esc(t('legal.title')), esc(t('legal.sub'))) +
      '<div class="tabs-layout legal"><nav class="vnav" aria-label="' + esc(t('nav.legal')) + '">' + docs.map(d => '<a href="#/legal/' + d.id + '" aria-current="' + (d.id === cur.id) + '">' + ic('scale') + esc(d.title) + '</a>').join('') + '</nav>' +
      '<article class="card legal-body">' + (getLang() !== 'fr' ? noteBox(esc(t('legal.notice')), 'info') + '<div style="height:14px"></div>' : '') + '<h2>' + esc(cur.title) + '</h2><p class="muted small-note" style="margin:6px 0 18px">' + esc(t('legal.updated', { d: fmtDate(new Date(cur.updated).getTime()) })) + '</p>' + cur.html + '</article></div>';
  },
};
