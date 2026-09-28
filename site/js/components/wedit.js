// Éditeur de vitrine : ajout, déplacement (glisser le widget, appui long au doigt, ou toucher puis choisir une case),
// changement de taille (tailles imposées), réglages et suppression des widgets.
import { esc, uidGen } from '../core/dom.js';
import { us } from '../core/store.js';
import { t } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { toast } from '../core/toast.js';
import { openModal } from '../core/modal.js';
import { WTYPES, WCATS, SIZES, SIZE_GROUPS, COLS, fits, firstFree, layoutFrom } from '../data/widgets.js';
import { isPlus, maxWidgets } from '../state/premium.js';
import { go } from '../core/router.js';
import { profile, updateProfile, me } from '../state/account.js';
import { getPlayer } from '../state/players.js';
import { validHandle } from '../state/trackers.js';
import { gridHTML, clipEmbed, safeUrl, CS_RAR } from './showcase.js';

let editing = false, sel = null;
export const editState = () => ({ edit: editing, sel });
const lay = () => layoutFrom(profile());
const save = l => updateProfile(p => { p.layout = l; });
const find = id => lay().find(w => w.id === id);

export function editorBar() {
  return editing
    ? '<button class="btn small primary" data-wedit>' + ic('check') + esc(t('wg.done')) + '</button><button class="btn small" data-wadd>' + ic('plus') + esc(t('wg.add')) + '</button>'
    : '<button class="btn small primary" data-wedit>' + ic('grid') + esc(t('wg.edit')) + '</button>';
}
export const editorHint = () => editing ? '<p class="inline-note wg-hint">' + esc(t('wg.hint')) + '</p>' : '';

// Re-dessine la grille ; les widgets glissent de leur ancienne position à la nouvelle (animation FLIP).
function refresh(root) {
  const wrap = root.querySelector('#wWrap'); if (!wrap) return;
  const old = {}; wrap.querySelectorAll('.wbox').forEach(b => { old[b.dataset.wid] = b.getBoundingClientRect(); });
  wrap.innerHTML = gridHTML(getPlayer(me().pseudo), { edit: editing, sel });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('no-anim')) return;
  wrap.querySelectorAll('.wbox').forEach(b => {
    const o = old[b.dataset.wid]; const n = b.getBoundingClientRect();
    if (!o) { b.animate([{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)' }); return; }
    const dx = o.left - n.left, dy = o.top - n.top, sx = o.width / n.width, sy = o.height / n.height;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < .01 && Math.abs(sy - 1) < .01) return;
    b.animate([{ transformOrigin: '0 0', transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')' }, { transformOrigin: '0 0', transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' });
  });
}

// ---- Ajout ----
function openAdd(root) {
  const l = lay(); const used = new Set(l.map(w => w.type));
  const { el, close } = openModal('<h2>' + esc(t('wg.addTitle')) + '</h2><p class="lead">' + esc(t('wg.addSub', { n: l.length, max: maxWidgets() }) + (isPlus() ? '' : ' ' + t('wg.plusMore'))) + '</p>' +
    WCATS.map(cat => '<h4 class="wcat">' + esc(t('wcat.' + cat)) + '</h4><div class="wadd-grid">' + Object.entries(WTYPES).filter(([, T]) => T.cat === cat).map(([k, T]) => {
      const off = T.cat !== 'perso' && used.has(k), lock = T.plus && !isPlus();
      return '<button type="button" class="wadd-card' + (lock ? ' plus-lock' : '') + '" data-addtype="' + k + '"' + (off ? ' disabled' : '') + '>' + ic(T.icon) + '<b>' + esc(t('wt.' + k)) + (T.plus ? ' <span class="tag plus-tag">Jade+</span>' : '') + '</b><small>' + esc(off ? t('wg.already') : t('wd.' + k)) + '</small></button>';
    }).join('') + '</div>').join(''), { width: '720px', label: t('wg.addTitle') });
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-addtype]'); if (!b || b.disabled) return;
    const type = b.dataset.addtype, T = WTYPES[type]; const cur = lay();
    if (T.plus && !isPlus()) { close(); toast(t('plus.needed')); go('formules'); return; }
    if (cur.length >= maxWidgets()) { toast(t(isPlus() ? 'wg.full' : 'wg.fullFree')); return; }
    const order = [T.def, ...T.sizes.filter(s => s !== T.def).sort((a, c) => SIZES[a][0] * SIZES[a][1] - SIZES[c][0] * SIZES[c][1])];
    let at = null, size = null;
    for (const s of order) { at = firstFree(cur, s); if (at) { size = s; break; } }
    if (!at) { toast(t('wg.noRoom')); return; }
    const w = { id: uidGen(), type, size, ...at, cfg: {} };
    cur.push(w); save(cur); close(); refresh(root);
    if (T.cfg) openCfg(root, w.id);
  });
}

// ---- Taille ----
function openSize(root, id) {
  const w = find(id); if (!w) return; const T = WTYPES[w.type];
  const shape = s => { const [a, b] = SIZES[s]; return '<span class="wsz-shape"><i style="grid-column:1 / span ' + a + ';grid-row:1 / span ' + b + '"></i></span>'; };
  const ext = s => t(s.length === 1 ? 'wsize.base' : s[1] === 'v' ? 'wsize.v' : 'wsize.h');
  const { el, close } = openModal('<h2>' + esc(t('wg.sizeTitle')) + '</h2><p class="lead">' + esc(t('wg.sizeSub')) + '</p>' +
    SIZE_GROUPS.map(g => { const ok = g.filter(s => T.sizes.includes(s)); return ok.length ? '<div class="wsz-row"><b>' + esc(t('wsize.' + g[0])) + '</b><div class="wsz-opts">' + ok.map(s => '<button type="button" class="wsz" data-pick="' + s + '" aria-pressed="' + (w.size === s) + '">' + shape(s) + '<small>' + esc(ext(s)) + '</small></button>').join('') + '</div></div>' : ''; }).join(''), { width: '560px', label: t('wg.sizeTitle') });
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-pick]'); if (!b) return;
    const s = b.dataset.pick; const l = lay(); const cur = l.find(x => x.id === id);
    if (fits(l, s, cur.x, cur.y, id)) Object.assign(cur, { size: s });
    else { const at = firstFree(l, s, id); if (!at) { toast(t('wg.noRoom')); return; } Object.assign(cur, { size: s }, at); }
    save(l); close(); refresh(root);
  });
}

// ---- Réglages ----
const fld = (id, label, val, attrs = '') => '<div class="field"><label for="' + id + '">' + esc(label) + '</label><input type="text" id="' + id + '" value="' + esc(val ?? '') + '" ' + attrs + '></div>';
const sel2 = (id, label, opts, cur) => '<div class="field"><label for="' + id + '">' + esc(label) + '</label><select id="' + id + '">' + opts.map(([v, n]) => '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(n) + '</option>').join('') + '</select></div>';
// ---- Collection CS2 : on choisit ses skins dans la base complète (data/cs2-skins.json) ----
export const WEARS = [['FN', 0, .07], ['MW', .07, .15], ['FT', .15, .38], ['WW', .38, .45], ['BS', .45, 1]];
const wearOf = f => (WEARS.find(([, a, b]) => f >= a && f < b) || WEARS[4])[0];
let skinDB = null;
function loadSkins() { if (!skinDB) skinDB = fetch('data/cs2-skins.json').then(r => r.json()).catch(e => { skinDB = null; throw e; }); return skinDB; }
function collItem(x) {
  const min = x.min ?? 0, max = x.max ?? 1, fl = x.fl ?? 0;
  const wears = WEARS.filter(([, a, b]) => b > min && a < max);
  const q = x.q || (x.st ? 'st' : '');
  return '<div class="coll-item" style="--rc:' + (CS_RAR[x.rar] || CS_RAR.milspec) + '" data-min="' + min + '" data-max="' + max + '" data-name="' + esc(x.name) + '" data-rar="' + esc(x.rar || 'milspec') + '" data-img="' + esc(x.img || '') + '" data-fl="' + fl + '">' +
    (x.img ? '<img src="' + esc(x.img) + '" alt="" loading="lazy" referrerpolicy="no-referrer">' : '<span class="csi-ph">' + ic('crate') + '</span>') +
    '<div class="ci-name"><b>' + esc(x.name) + '</b><small>' + esc(t('csr.' + (x.rar || 'milspec'))) + '</small></div>' +
    '<select data-k="wear" aria-label="' + esc(t('wg.coll.wear')) + '">' + wears.map(([k]) => '<option' + (x.wear === k ? ' selected' : '') + '>' + k + '</option>').join('') + '</select>' +
    '<input type="text" data-k="float" inputmode="decimal" maxlength="12" placeholder="' + esc(t('wg.coll.floatPh', { min, max })) + '" value="' + esc(x.float || '') + '" aria-label="Float">' +
    '<select data-k="q" aria-label="' + esc(t('wg.coll.quality')) + '"><option value="">' + esc(t('wg.coll.q.normal')) + '</option>' + (fl & 1 || q === 'st' ? '<option value="st"' + (q === 'st' ? ' selected' : '') + '>StatTrak™</option>' : '') + (fl & 2 || q === 'sv' ? '<option value="sv"' + (q === 'sv' ? ' selected' : '') + '>Souvenir</option>' : '') + '</select>' +
    '<button type="button" class="btn small ghost" data-rmrow aria-label="' + esc(t('common.remove')) + '">' + ic('trash') + '</button></div>';
}
function openSkinPicker(onPick) {
  let cat = -1, db = null;
  const { el, close } = openModal('<h2>' + esc(t('wg.coll.addSkin')) + '</h2><div class="field"><input type="search" id="skQ" placeholder="' + esc(t('wg.coll.search')) + '" autocomplete="off"></div><div class="sk-cats" id="skCats"></div><div id="skRes" class="sk-grid"><p class="muted">' + esc(t('wg.coll.loading')) + '</p></div>', { width: '860px', label: t('wg.coll.addSkin') });
  const q = s => el.querySelector(s);
  const norm = v => v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[|★™]/g, ' ');
  const draw = () => {
    if (!db) return;
    const words = norm(q('#skQ').value).split(/\s+/).filter(Boolean);
    const hits = db.items.filter(it => (cat < 0 || it[1] === cat) && words.every(w => it._n.includes(w)));
    q('#skRes').innerHTML = hits.length ? hits.slice(0, 60).map(it => { const i = db.items.indexOf(it); return '<button type="button" class="sk" data-sk="' + i + '" style="--rc:' + CS_RAR[db.rar[it[2]]] + '"><img src="' + esc(db.img + it[6]) + '/120fx90f" alt="" loading="lazy" referrerpolicy="no-referrer"><b>' + esc(it[0]) + '</b></button>'; }).join('') + (hits.length > 60 ? '<p class="muted small-note sk-more">' + esc(t('wg.coll.more', { n: hits.length - 60 })) + '</p>' : '') : '<p class="muted">' + esc(t('wg.coll.noResult')) + '</p>';
  };
  loadSkins().then(d => {
    db = d; d.items.forEach(it => { if (!it._n) it._n = norm(it[0]); });
    q('#skCats').innerHTML = [-1, ...d.cats.map((_, i) => i)].map(i => '<button type="button" class="chip-btn" data-cat="' + i + '" aria-pressed="' + (i === cat) + '">' + esc(t('wg.coll.cat.' + (i < 0 ? 'all' : d.cats[i].toLowerCase()))) + '</button>').join('');
    draw();
  }).catch(() => { q('#skRes').innerHTML = '<p class="muted">' + esc(t('wg.coll.loadFail')) + '</p>'; });
  let h = 0; q('#skQ').addEventListener('input', () => { clearTimeout(h); h = setTimeout(draw, 120); });
  el.addEventListener('click', e => {
    const c = e.target.closest('[data-cat]'); if (c) { cat = +c.dataset.cat; el.querySelectorAll('[data-cat]').forEach(b => b.setAttribute('aria-pressed', b === c)); draw(); return; }
    const b = e.target.closest('[data-sk]'); if (!b) return;
    const it = db.items[+b.dataset.sk];
    onPick({ name: it[0], rar: db.rar[it[2]], min: it[3], max: it[4], fl: it[5], img: db.img + it[6] + '/256fx192f' });
    close();
  });
}
function readColl(el) {
  const out = [];
  for (const r of el.querySelectorAll('.coll-item')) {
    const g = k => r.querySelector('[data-k="' + k + '"]'); const min = +r.dataset.min, max = +r.dataset.max;
    let fv = g('float').value.trim().replace(',', '.'), wear = g('wear').value;
    if (fv) { const f = +fv; if (!(f >= min && f <= max)) { toast(t('wg.coll.floatBad', { name: r.dataset.name, min, max })); g('float').focus(); return null; } wear = wearOf(f); fv = String(f); }
    out.push({ name: r.dataset.name, rar: r.dataset.rar, img: r.dataset.img, min, max, fl: +r.dataset.fl, wear, float: fv, q: g('q').value });
  }
  return out;
}

function cfgForm(w) {
  const c = w.cfg || {};
  if (WTYPES[w.type].cat === 'games') return fld('cHandle', t('wg.handle.' + w.type), c.handle, 'maxlength="100" placeholder="' + esc(t('wg.ph.' + w.type)) + '"') + '<p class="inline-note">' + esc(t('wg.previewNote')) + '</p>';
  if (w.type === 'image' || w.type === 'gif') return '<div class="field"><span class="label">' + esc(t('wg.media.file')) + '</span><div class="row-flex"><button type="button" class="btn small" id="cPick">' + ic('upload') + esc(t('profile.upload')) + '</button><span class="muted small-note" id="cFileSt">' + esc(c.media ? t('wg.media.stored') : '') + '</span>' + (c.media ? '<button type="button" class="btn small ghost" id="cRmMedia">' + esc(t('common.remove')) + '</button>' : '') + '</div><input type="file" id="cFile" accept="' + (w.type === 'gif' ? 'image/gif,image/webp' : 'image/*') + '" hidden><p class="inline-note">' + esc(t(w.type === 'gif' ? 'wg.gif.limit' : 'wg.image.limit')) + '</p></div>' +
    fld('cUrl', t('wg.media.url'), c.url, 'maxlength="500" placeholder="https://…"') +
    sel2('cFit', t('wg.media.fit'), [['cover', t('wg.fit.cover')], ['contain', t('wg.fit.contain')]], c.fit || 'cover') +
    fld('cCap', t('wg.media.caption'), c.caption, 'maxlength="80"');
  if (w.type === 'clip') return fld('cUrl', t('wg.clip.url'), c.url, 'maxlength="300" placeholder="https://…"') + '<p class="inline-note">' + esc(t('wg.clip.supported')) + '</p>' + fld('cTitle', t('wg.titleOpt'), c.title, 'maxlength="60"');
  if (w.type === 'collection') return fld('cTitle', t('wg.titleOpt'), c.title, 'maxlength="40"') + '<div id="cRows" class="coll-list">' + (c.items || []).filter(x => x && x.name).map(collItem).join('') + '</div><button type="button" class="btn small" id="cAddRow">' + ic('plus') + esc(t('wg.coll.addSkin')) + '</button><p class="inline-note">' + esc(t('wg.coll.note')) + '</p>';
  if (w.type === 'gallery') return [0, 1, 2, 3, 4, 5].map(i => fld('cG' + i, t('wg.gallery.url', { n: i + 1 }), (c.urls || [])[i], 'maxlength="500" placeholder="https://…"')).join('') + sel2('cFit', t('wg.media.fit'), [['cover', t('wg.fit.cover')], ['contain', t('wg.fit.contain')]], c.fit || 'cover');
  if (w.type === 'text') return fld('cTitle', t('wg.titleOpt'), c.title, 'maxlength="40"') + '<div class="field"><label for="cText">' + esc(t('wg.text.label')) + '</label><textarea id="cText" maxlength="400">' + esc(c.text || '') + '</textarea></div>' + sel2('cAlign', t('wg.text.align'), [['left', t('wg.align.left')], ['center', t('wg.align.center')], ['right', t('wg.align.right')]], c.align || 'left');
  if (w.type === 'setup') return '<div class="grid" style="--min:200px;gap:0 14px">' + [['mouse', 60], ['dpi', 6], ['sensCs', 8], ['sensVal', 8], ['res', 20], ['hz', 4], ['keyboard', 60], ['headset', 60]].map(([k, n]) => fld('cs_' + k, t('wg.setup.' + k), c[k], 'maxlength="' + n + '"' + (['dpi', 'sensCs', 'sensVal', 'hz'].includes(k) ? ' inputmode="decimal"' : ''))).join('') + '</div>';
  return '';
}
function readImage(file, isGif, cb) {
  if (!file || !/^image\//.test(file.type)) return toast(t('img.notImage'));
  if (isGif) {
    if (!/^image\/(gif|webp)$/.test(file.type)) return toast(t('img.notImage'));
    if (file.size > 1024 * 1024) return toast(t('wg.gif.tooBig'));
    const fr = new FileReader(); fr.onload = () => cb(fr.result); fr.readAsDataURL(file); return;
  }
  if (file.size > 8 * 1024 * 1024) return toast(t('img.tooBig'));
  const fr = new FileReader();
  fr.onload = () => { const img = new Image(); img.onload = () => { const sc = Math.min(1, 1000 / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); try { cb(c.toDataURL('image/jpeg', .82)); } catch (e) { toast(t('img.unreadable')); } }; img.onerror = () => toast(t('img.unreadable')); img.src = fr.result; };
  fr.readAsDataURL(file);
}
function openCfg(root, id) {
  const w = find(id); if (!w) return;
  let media = null, dropMedia = false;
  const { el, close } = openModal('<h2>' + esc(t('wt.' + w.type)) + '</h2><form id="cForm">' + cfgForm(w) + '<div class="row-flex" style="justify-content:flex-end;margin-top:8px"><button type="button" class="btn" data-close>' + esc(t('common.cancel')) + '</button><button class="btn primary">' + esc(t('common.save')) + '</button></div></form>', { width: w.type === 'collection' ? '820px' : '520px', label: t('wt.' + w.type) });
  const q = s => el.querySelector(s);
  el.addEventListener('click', e => {
    if (e.target.closest('#cPick')) q('#cFile').click();
    if (e.target.closest('#cRmMedia')) { dropMedia = true; media = null; q('#cFileSt').textContent = ''; e.target.closest('#cRmMedia').remove(); }
    if (e.target.closest('#cAddRow')) { const rows = q('#cRows'); if (rows.children.length >= 12) return toast(t('wg.coll.max')); openSkinPicker(sk => rows.insertAdjacentHTML('beforeend', collItem(sk))); }
    const rm = e.target.closest('[data-rmrow]'); if (rm) rm.closest('.coll-item').remove();
  });
  el.addEventListener('input', e => {
    if (e.target.dataset.k !== 'float') return; const r = e.target.closest('.coll-item'); const f = +e.target.value.replace(',', '.');
    if (e.target.value && f >= +r.dataset.min && f <= +r.dataset.max) r.querySelector('[data-k="wear"]').value = wearOf(f);
  });
  el.addEventListener('change', e => { if (e.target.id === 'cFile') readImage(e.target.files[0], w.type === 'gif', url => { media = url; dropMedia = false; q('#cFileSt').textContent = t('wg.media.ready'); }); });
  q('#cForm').addEventListener('submit', e => {
    e.preventDefault();
    const v = s => (q(s) ? q(s).value.trim() : '');
    const c = { ...(w.cfg || {}) };
    if (WTYPES[w.type].cat === 'games') { const h = v('#cHandle'); if (h && !validHandle(w.type, h)) return toast(t('wg.handle.bad')); c.handle = h; }
    if (w.type === 'image' || w.type === 'gif') {
      const u = v('#cUrl'); if (u && !safeUrl(u)) return toast(t('wg.url.bad'));
      if (media) { if (!us.set('wmedia:' + id, media)) return toast(t('wg.quota')); c.media = true; }
      else if (dropMedia) { us.set('wmedia:' + id, undefined); c.media = false; }
      Object.assign(c, { url: u, fit: v('#cFit'), caption: v('#cCap') });
    }
    if (w.type === 'clip') { const u = v('#cUrl'); if (u && !clipEmbed(u)) return toast(t('wg.clip.bad')); Object.assign(c, { url: u, title: v('#cTitle') }); }
    if (w.type === 'collection') {
      c.title = v('#cTitle');
      const items = readColl(el); if (!items) return; c.items = items.slice(0, 12);
    }
    if (w.type === 'gallery') { const urls = [0, 1, 2, 3, 4, 5].map(i => v('#cG' + i)).filter(Boolean); if (urls.some(u => !safeUrl(u))) return toast(t('wg.url.bad')); Object.assign(c, { urls, fit: v('#cFit') }); }
    if (w.type === 'text') Object.assign(c, { title: v('#cTitle'), text: v('#cText'), align: v('#cAlign') });
    if (w.type === 'setup') ['mouse', 'dpi', 'sensCs', 'sensVal', 'res', 'hz', 'keyboard', 'headset'].forEach(k => { c[k] = v('#cs_' + k); });
    const l = lay(); const cur = l.find(x => x.id === id); if (!cur) return close();
    cur.cfg = c; save(l); close(); refresh(root); toast(t('common.saved'));
  });
}

// ---- Déplacement ----
function moveTo(root, id, x, y) {
  const l = lay(); const w = l.find(v => v.id === id); if (!w) return false;
  x = Math.min(x, COLS - SIZES[w.size][0]);
  if (!fits(l, w.size, x, y, id)) { toast(t('wg.noRoom')); return false; }
  w.x = x; w.y = y; save(l); sel = null; refresh(root); return true;
}
// Glisser : tout le widget se prend à la souris (après 4 px) ou au doigt (appui long, pour laisser défiler la page).
let noClick = false;
function dragger(root, box, sx, sy) {
  const grid = box.parentElement, id = box.dataset.wid, w = find(id); if (!w) return null;
  const gs = getComputedStyle(grid), gap = parseFloat(gs.columnGap) || 0, rows = +gs.getPropertyValue('--rows') || 4;
  const R = grid.getBoundingClientRect(), cw = (R.width + gap) / COLS, rh = (R.height + gap) / rows;
  const B = box.getBoundingClientRect(), ox = sx - B.left, oy = sy - B.top;
  const [sw, sh] = SIZES[w.size];
  const ghost = document.createElement('div'); ghost.className = 'wghost';
  ghost.style.cssText = 'width:' + (sw * cw - gap) + 'px;height:' + (sh * rh - gap) + 'px;transform:translate(' + w.x * cw + 'px,' + w.y * rh + 'px)';
  grid.appendChild(ghost); box.classList.add('dragging'); grid.classList.add('is-dragging');
  let tx = w.x, ty = w.y, ok = true, raf = 0, last = null;
  const frame = () => {
    raf = 0; const ev = last; const r = grid.getBoundingClientRect();
    box.style.transform = 'translate(' + (ev.clientX - sx) + 'px,' + (ev.clientY - sy) + 'px) scale(1.03)';
    const nx = Math.max(0, Math.min(COLS - sw, Math.round((ev.clientX - ox - r.left) / cw)));
    const ny = Math.max(0, Math.min(rows - sh, Math.round((ev.clientY - oy - r.top) / rh)));
    if (nx !== tx || ny !== ty) { tx = nx; ty = ny; ghost.style.transform = 'translate(' + tx * cw + 'px,' + ty * rh + 'px)'; }
    ok = fits(lay(), w.size, tx, ty, id); ghost.classList.toggle('bad', !ok);
    if (ev.clientY < 70) scrollBy(0, -14); else if (ev.clientY > innerHeight - 70) scrollBy(0, 14);
  };
  const end = () => { cancelAnimationFrame(raf); ghost.remove(); grid.classList.remove('is-dragging'); };
  return {
    move(ev) { last = ev; if (!raf) raf = requestAnimationFrame(frame); },
    drop() {
      end();
      if (ok && (tx !== w.x || ty !== w.y)) { const l = lay(); Object.assign(l.find(v => v.id === id), { x: tx, y: ty }); save(l); sel = null; refresh(root); return; }
      if (!ok) toast(t('wg.noRoom'));
      box.classList.remove('dragging'); box.style.transition = 'transform .22s cubic-bezier(.2,.8,.2,1)'; box.style.transform = '';
      setTimeout(() => { box.style.transition = ''; }, 240);
    },
    cancel() { end(); box.classList.remove('dragging'); box.style.transform = ''; },
  };
}
function arm(root, e, box) {
  const touch = e.pointerType === 'touch', sx = e.clientX, sy = e.clientY;
  let d = null, lx = sx, ly = sy, timer = 0;
  const begin = () => { d = dragger(root, box, sx, sy); if (d) { d.move({ clientX: lx, clientY: ly }); if (touch && navigator.vibrate) navigator.vibrate(12); } };
  const stop = () => { clearTimeout(timer); removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', cn); removeEventListener('touchmove', tm); };
  const mv = ev => {
    lx = ev.clientX; ly = ev.clientY;
    if (d) return d.move(ev);
    const dist = Math.hypot(lx - sx, ly - sy);
    if (touch) { if (dist > 10) stop(); } else if (dist > 4) begin();
  };
  const tm = ev => { if (d) ev.preventDefault(); };
  const up = () => { stop(); if (d) { noClick = true; setTimeout(() => { noClick = false; }, 0); d.drop(); } };
  const cn = () => { stop(); if (d) d.cancel(); };
  if (touch) timer = setTimeout(begin, 260);
  addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', cn); addEventListener('touchmove', tm, { passive: false });
}

export function bindEditor(root, repaint) {
  root.addEventListener('pointerdown', e => {
    const box = e.target.closest('.editing .wbox'); if (!box || e.button > 0 || e.target.closest('.wtools button:not(.wmove)')) return;
    if (e.pointerType !== 'touch') e.preventDefault();
    arm(root, e, box);
  });
  root.addEventListener('click', e => {
    if (noClick) { noClick = false; return; }
    if (e.target.closest('[data-wedit]')) { editing = !editing; sel = null; repaint(); return; }
    if (e.target.closest('[data-wadd]')) { openAdd(root); return; }
    if (!e.target.closest('.editing')) return;
    const box = e.target.closest('.wbox'); const id = box && box.dataset.wid;
    if (e.target.closest('[data-wcfg]')) { openCfg(root, id); return; }
    if (e.target.closest('[data-wsize]')) { openSize(root, id); return; }
    if (e.target.closest('[data-wdel]')) { const l = lay().filter(w => w.id !== id); us.set('wmedia:' + id, undefined); save(l); sel = null; refresh(root); toast(t('wg.removed')); return; }
    if (e.target.closest('[data-wmove]')) { sel = sel === id ? null : id; refresh(root); return; }
    const cell = e.target.closest('.wcell');
    if (cell) { if (sel) moveTo(root, sel, +cell.dataset.cx, +cell.dataset.cy); else toast(t('wg.pickFirst')); return; }
    if (box) { sel = sel === id ? null : id; refresh(root); }
  });
}
