// Profil public d'un joueur : #/joueur/<pseudo>
import { esc } from '../core/dom.js';
import { t } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { toast } from '../core/toast.js';
import { me } from '../state/account.js';
import { getPlayer } from '../state/players.js';
import { pageHead } from '../components/ui.js';
import { showcaseHTML } from '../components/showcase.js';

export default {
  title: sub => sub[0] ? decodeURIComponent(sub[0]) : t('nav.player'),
  render(sub) {
    const name = sub[0] || (me() && me().pseudo);
    if (!name) return pageHead(esc(t('nav.player')), '') + '<div class="card center"><p class="muted">' + esc(t('player.needName')) + '</p><button class="btn primary" style="margin-top:14px" data-auth="in">' + esc(t('auth.signin')) + '</button></div>';
    const p = getPlayer(name);
    if (!p) return pageHead(esc(name), '') + '<div class="card center"><span class="big-ic">' + ic('user') + '</span><h3>' + esc(t('player.notFound')) + '</h3><p class="muted">' + esc(t('player.notFoundSub')) + '</p></div>';
    if (!p.self && p.prefs && p.prefs.publicProfile === false) return pageHead(esc(p.pseudo), '') + '<div class="card center"><span class="big-ic">' + ic('lock') + '</span><h3>' + esc(t('player.privateTitle')) + '</h3><p class="muted">' + esc(t('player.private')) + '</p></div>';
    return '<div class="row-flex" style="margin-bottom:14px">' + (p.self ? '<a class="btn small" href="#/profil/showcase">' + ic('brush') + esc(t('player.edit')) + '</a>' : '') + '<button class="btn small ghost" id="share">' + ic('copy') + esc(t('profile.copyLink')) + '</button>' + (p.demo ? '<span class="tag outline">' + esc(t('player.demo')) + '</span>' : '') + '</div>' + showcaseHTML(p);
  },
  mount(root) { const b = root.querySelector('#share'); if (b) b.onclick = async () => { try { await navigator.clipboard.writeText(location.href); toast(t('common.copied')); } catch (e) { toast(t('common.copyFail')); } }; },
};
