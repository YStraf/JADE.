// Forum : publications, catégories, réactions, signalements.
import { $, esc, uidGen } from '../core/dom.js';
import { t, C, relTime, fmt } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { toast } from '../core/toast.js';
import { openModal } from '../core/modal.js';
import { CATS, catColor } from '../data/game.js';
import { DEMO_POSTS } from '../data/demo.js';
import { posts, savePosts, reactions, saveReactions, addReport } from '../state/community.js';
import { me, profile, isAdmin } from '../state/account.js';
import { hasPerk, settings } from '../state/economy.js';
import { awardXP } from '../state/progress.js';
import { getPlayer } from '../state/players.js';
import { pageHead, seg, avatar, empty } from '../components/ui.js';
import { playerLink } from '../components/minicard.js';
import { openAuth } from '../components/auth.js';
import { ytId } from './challenges.js';

let cat = 'all', sort = 'new', q = '';
function allPosts() {
  const P = C('posts');
  const seeds = DEMO_POSTS.map(p => ({ id: p.id, author: p.author, cat: p.cat, title: P[p.id].title, body: P[p.id].body, likes: p.likes, t: Date.now() - p.ago, seed: true, hidden: (settings().hiddenSeeds || []).includes(p.id) }));
  return posts().concat(seeds);
}
function nameJade(pseudo) { const pl = getPlayer(pseudo); return !!pl && pl.level.lvl >= 10 && (!pl.style || pl.style.nameColor !== false); }
function card(p, i) {
  const r = reactions(); const liked = !!r['gg:' + p.id], fire = !!r['hs:' + p.id];
  const y = p.video && ytId(p.video); const pl = getPlayer(p.author) || { pseudo: p.author, style: {} };
  const hidden = p.hidden;
  return '<article class="post reveal' + (hidden ? ' is-hidden' : '') + '" style="animation-delay:' + Math.min(i, 8) * 40 + 'ms"><div class="meta">' + avatar(pl, 30) + playerLink(p.author, { jade: nameJade(p.author) }) + '<span class="cat" style="--c:' + catColor(p.cat) + '">' + esc(t('cat.' + p.cat)) + '</span><span>' + esc(relTime(p.t)) + '</span>' + (hidden ? '<span class="tag danger">' + esc(t('forum.hidden')) + '</span>' : '') + '</div>' +
    '<h3>' + esc(p.title) + '</h3><p class="post-body">' + esc(p.body) + '</p>' +
    (y ? '<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/' + y + '" title="' + esc(t('forum.videoBy', { name: p.author })) + '" allowfullscreen loading="lazy"></iframe></div>' : '') +
    '<div class="actions"><button data-gg="' + p.id + '" class="' + (liked ? 'on' : '') + '" aria-pressed="' + liked + '">' + ic('heart') + 'GG ' + ((p.likes || 0) + (liked ? 1 : 0)) + '</button>' +
    (hasPerk('emote') ? '<button data-hs="' + p.id + '" class="' + (fire ? 'on' : '') + '" aria-pressed="' + fire + '" title="' + esc(t('item.perk.emote')) + '">' + ic('fire') + 'HS ' + ((p.hs || 0) + (fire ? 1 : 0)) + '</button>' : '') +
    '<span class="spacer"></span><button data-report="' + p.id + '">' + ic('flag') + esc(t('forum.report')) + '</button>' +
    (me() && p.uid === me().id ? '<button data-del="' + p.id + '">' + ic('trash') + esc(t('common.delete')) + '</button>' : '') + '</div></article>';
}
function paint(root) {
  const qq = q.toLowerCase();
  let l = allPosts().filter(p => (!p.hidden || isAdmin() || (me() && p.uid === me().id)) && (cat === 'all' || p.cat === cat) && (!qq || (p.title + ' ' + p.body + ' ' + p.author).toLowerCase().includes(qq)));
  l.sort(sort === 'top' ? (a, b) => (b.likes || 0) - (a.likes || 0) : (a, b) => b.t - a.t);
  $('#posts', root).innerHTML = l.length ? l.map(card).join('') : empty(t('forum.empty'), 'chat');
}
function newPost(root) {
  if (!me()) { openAuth('in'); return; }
  let pc = cat === 'all' ? 'perf' : cat;
  const { el, close } = openModal('<h2>' + esc(t('forum.new')) + '</h2><p class="lead">' + esc(t('forum.newSub')) + '</p><div class="field"><span class="label">' + esc(t('forum.category')) + '</span><div class="catpick" id="catPick"></div></div>' +
    '<div class="field"><label for="pTitle">' + esc(t('forum.titleLbl')) + '</label><input type="text" id="pTitle" maxlength="90" placeholder="' + esc(t('forum.titlePh')) + '"></div>' +
    '<div class="field"><label for="pBody">' + esc(t('forum.message')) + '</label><textarea id="pBody" maxlength="1500" placeholder="' + esc(t('forum.messagePh')) + '"></textarea></div>' +
    '<div class="field"><label for="pVideo">' + esc(t('forum.video')) + '</label><input type="url" id="pVideo" placeholder="https://youtu.be/..."></div>' +
    '<p class="error" id="pErr"></p><div class="row-flex" style="justify-content:flex-end"><button class="btn" data-close>' + esc(t('common.cancel')) + '</button><button class="btn primary" id="pGo">' + esc(t('forum.publish')) + '</button></div><p class="inline-note">' + t('forum.rules') + '</p>', { width: '680px' });
  const pick = () => { el.querySelector('#catPick').innerHTML = CATS.map(c => '<button type="button" style="--c:' + c.color + '" data-c="' + c.id + '" aria-pressed="' + (c.id === pc) + '">' + esc(t('cat.' + c.id)) + '</button>').join(''); };
  pick(); el.querySelector('#catPick').onclick = e => { const b = e.target.closest('[data-c]'); if (b) { pc = b.dataset.c; pick(); } };
  el.querySelector('#pGo').onclick = () => {
    const title = el.querySelector('#pTitle').value.trim(), body = el.querySelector('#pBody').value.trim(), video = el.querySelector('#pVideo').value.trim(), err = el.querySelector('#pErr');
    let m = ''; if (!title) m = t('forum.err.title'); else if (body.length < 10) m = t('forum.err.body'); else if (video && !ytId(video)) m = t('forum.err.video');
    if (m) { err.textContent = m; err.classList.add('show'); return; }
    const p = { id: uidGen(), uid: me().id, author: me().pseudo, cat: pc, title, body, video, likes: 0, t: Date.now() };
    const l = posts(); l.unshift(p); savePosts(l); awardXP('post', p.id, title);
    close(); cat = 'all'; toast(t('forum.published')); draw(root);
  };
}
function report(id) {
  const { el, close } = openModal('<h2>' + esc(t('forum.report')) + '</h2><p class="lead">' + esc(t('forum.reportSub')) + '</p><div class="stack" style="--gap:8px">' + ['spam', 'cheat', 'scam', 'harass', 'illegal', 'other'].map((r, i) => '<label class="check"><input type="radio" name="rr" value="' + r + '"' + (i === 0 ? ' checked' : '') + '><span>' + esc(t('report.' + r)) + '</span></label>').join('') + '</div><div class="field" style="margin-top:12px"><label for="rDet">' + esc(t('forum.reportDetails')) + '</label><textarea id="rDet" style="min-height:80px"></textarea></div><button class="btn primary block" id="rGo">' + esc(t('forum.reportSend')) + '</button><p class="inline-note">' + t('forum.reportLegal') + '</p>', { width: '480px' });
  el.querySelector('#rGo').onclick = () => { addReport({ id: uidGen(), post: id, reason: el.querySelector('input[name=rr]:checked').value, details: el.querySelector('#rDet').value.trim(), by: me() ? me().pseudo : 'invité', t: Date.now(), status: 'open' }); close(); toast(t('forum.reported')); };
}
function draw(root) { seg($('#fSeg', root), [{ id: 'all', label: t('cat.all') }].concat(CATS.map(c => ({ id: c.id, label: t('cat.' + c.id), color: c.color }))), cat, v => { cat = v; draw(root); }); seg($('#sortSeg', root), [{ id: 'new', label: t('forum.recent') }, { id: 'top', label: t('forum.top') }], sort, v => { sort = v; draw(root); }); paint(root); }
export default {
  title: () => t('nav.forum'),
  render() {
    return pageHead(esc(t('nav.forum')), esc(t('forum.sub')), '<button class="btn primary" id="newPost">' + ic('plus') + esc(t('forum.publish')) + '</button>') +
      '<div class="filters"><div class="seg" id="fSeg" aria-label="' + esc(t('forum.category')) + '"></div><div class="seg" id="sortSeg" aria-label="' + esc(t('forum.sort')) + '"></div><input type="search" id="fSearch" class="compact" placeholder="' + esc(t('forum.search')) + '" aria-label="' + esc(t('forum.search')) + '"></div><div id="posts"></div>';
  },
  mount(root) {
    draw(root);
    $('#newPost', root).onclick = () => newPost(root);
    $('#fSearch', root).oninput = e => { q = e.target.value; paint(root); };
    root.addEventListener('click', e => {
      const g = e.target.closest('[data-gg],[data-hs]'); if (g) { if (!me()) { openAuth('in'); return; } const k = g.dataset.gg ? 'gg:' + g.dataset.gg : 'hs:' + g.dataset.hs; const r = reactions(); r[k] = !r[k]; saveReactions(r); paint(root); return; }
      const rp = e.target.closest('[data-report]'); if (rp) { report(rp.dataset.report); return; }
      const d = e.target.closest('[data-del]'); if (d) { savePosts(posts().filter(p => p.id !== d.dataset.del)); paint(root); toast(t('forum.deleted')); }
    });
  },
};
