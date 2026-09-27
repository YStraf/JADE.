import { esc } from '../core/dom.js';
import { t } from '../core/i18n.js';
export default {
  title: () => '404',
  render: () => '<div class="nf"><div class="nf-code">404</div><h2>' + esc(t('nf.title')) + '</h2><p class="muted">' + esc(t('nf.text')) + '</p><div class="row-flex" style="justify-content:center;margin-top:22px"><a class="btn primary" href="#/">' + esc(t('nf.home')) + '</a><button class="btn" data-search>' + esc(t('search.open')) + '</button></div></div>',
};
