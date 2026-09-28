// Éditeur de vitrine : ajout, déplacement (glisser la poignée ou toucher puis choisir une case),
// changement de taille (tailles imposées), réglages et suppression des widgets.
import { esc, uidGen } from '../core/dom.js';
import { us } from '../core/store.js';
import { t } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { toast } from '../core/toast.js';
import { openModal } from '../core/modal.js';
import { WTYPES, WCATS, SIZES, SIZE_GROUPS, COLS, MAXW, fits, firstFree, layoutFrom } from '../data/widgets.js';
import { profile, updateProfile, me } from '../state/account.js';
import { getPlayer } from '../state/players.js';
import { validHandle } from '../state/trackers.js';
import { gridHTML, clipEmbed, safeUrl, CS_RAR, CS_WEAR } from './showcase.js';

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

function refresh(root) {
  const box = root.querySelector('#wWrap'); if (!box) return;
  box.innerHTML = gridHTML(getPlayer(me().pseudo), { edit: editing, sel });
}

// ---- Ajout ----
function openAdd(root) {
  const l = lay(); const used = new Set(l.map(w => w.type));
  const { el, close } = openModal('<h2>' + esc(t('wg.addTitle')) + '</h2><p class="lead">' + esc(t('wg.addSub', { n: l.length, max: MAXW })) + '</p>' +
    WCATS.map(cat => '<h4 class="wcat">' + esc(t('wcat.' + cat)) + '</h4><div class="wadd-grid">' + Object.entries(WTYPES).filter(([, T]) => T.cat === cat).map(([k, T]) => {
      const off = T.cat !== 'perso' && used.has(k);
      return '<button type="button" class="wadd-card" data-addtype="' + k + '"' + (off ? ' disabled' : '') + '>' + ic(T.icon) + '<b>' + esc(t('wt.' + k)) + '</b><small>' + esc(off ? t('wg.already') : t('wd.' + k)) + '</small></button>';
    }).join('') + '</div>').join(''), { width: '720px', label: t('wg.addTitle') });
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-addtype]'); if (!b || b.disabled) return;
    const type = b.dataset.addtype, T = WTYPES[type]; const cur = lay();
    if (cur.length >= MAXW) { toast(t('wg.full')); return; }
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
function collRow(x = {}) {
  return '<div class="coll-row"><input type="text" data-k="name" maxlength="60" placeholder="' + esc(t('wg.coll.name')) + '" value="' + esc(x.name || '') + '">' +
    '<select data-k="rar">' + Object.keys(CS_RAR).map(r => '<option value="' + r + '"' + (x.rar === r ? ' selected' : '') + '>' + esc(t('csr.' + r)) + '</option>').join('') + '</select>' +
    '<select data-k="wear" aria-label="' + esc(t('wg.coll.wear')) + '"><option value="">—</option>' + CS_WEAR.map(v => '<option' + (x.wear === v ? ' selected' : '') + '>' + v + '</option>').join('') + '</select>' +
    '<input type="text" data-k="float" maxlength="10" inputmode="decimal" placeholder="Float" value="' + esc(x.float || '') + '">' +
    '<label class="check"><input type="checkbox" data-k="st"' + (x.st ? ' checked' : '') + '><span>ST™</span></label>' +
    '<input type="url" data-k="img" placeholder="' + esc(t('wg.coll.img')) + '" value="' + esc(x.img || '') + '">' +
    '<button type="button" class="btn small ghost" data-rmrow aria-label="' + esc(t('common.remove')) + '">' + ic('trash') + '</button></div>';
}
function cfgForm(w) {
  const c = w.cfg || {};
  if (WTYPES[w.type].cat === 'games') return fld('cHandle', t('wg.handle.' + w.type), c.handle, 'maxlength="100" placeholder="' + esc(t('wg.ph.' + w.type)) + '"') + '<p class="inline-note">' + esc(t('wg.previewNote')) + '</p>';
  if (w.type === 'image' || w.type === 'gif') return '<div class="field"><span class="label">' + esc(t('wg.media.file')) + '</span><div class="row-flex"><button type="button" class="btn small" id="cPick">' + ic('upload') + esc(t('profile.upload')) + '</button><span class="muted small-note" id="cFileSt">' + esc(c.media ? t('wg.media.stored') : '') + '</span>' + (c.media ? '<button type="button" class="btn small ghost" id="cRmMedia">' + esc(t('common.remove')) + '</button>' : '') + '</div><input type="file" id="cFile" accept="' + (w.type === 'gif' ? 'image/gif,image/webp' : 'image/*') + '" hidden><p class="inline-note">' + esc(t(w.type === 'gif' ? 'wg.gif.limit' : 'wg.image.limit')) + '</p></div>' +
    fld('cUrl', t('wg.media.url'), c.url, 'maxlength="500" placeholder="https://…"') +
    sel2('cFit', t('wg.media.fit'), [['cover', t('wg.fit.cover')], ['contain', t('wg.fit.contain')]], c.fit || 'cover') +
    fld('cCap', t('wg.media.caption'), c.caption, 'maxlength="80"');
  if (w.type === 'clip') return fld('cUrl', t('wg.clip.url'), c.url, 'maxlength="300" placeholder="https://…"') + '<p class="inline-note">' + esc(t('wg.clip.supported')) + '</p>' + fld('cTitle', t('wg.titleOpt'), c.title, 'maxlength="60"');
  if (w.type === 'collection') return fld('cTitle', t('wg.titleOpt'), c.title, 'maxlength="40"') + '<div id="cRows" class="coll-rows">' + ((c.items && c.items.length ? c.items : [{}]).map(collRow).join('')) + '</div><button type="button" class="btn small" id="cAddRow">' + ic('plus') + esc(t('wg.coll.add')) + '</button>';
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
    if (e.target.closest('#cAddRow')) { const rows = q('#cRows'); if (rows.children.length >= 12) return toast(t('wg.coll.max')); rows.insertAdjacentHTML('beforeend', collRow()); }
    const rm = e.target.closest('[data-rmrow]'); if (rm) rm.closest('.coll-row').remove();
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
      c.items = [...el.querySelectorAll('.coll-row')].map(r => { const g = k => r.querySelector('[data-k="' + k + '"]'); return { name: g('name').value.trim(), rar: g('rar').value, wear: g('wear').value, float: g('float').value.trim(), st: g('st').checked, img: g('img').value.trim() }; }).filter(x => x.name).slice(0, 12);
      if (c.items.some(x => x.img && !safeUrl(x.img))) return toast(t('wg.url.bad'));
    }
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
function startDrag(root, e, box) {
  const grid = box.parentElement, id = box.dataset.wid, w = find(id); if (!w) return;
  e.preventDefault();
  const gap = parseFloat(getComputedStyle(grid).rowGap) || 0, rows = +getComputedStyle(grid).getPropertyValue('--rows') || 4;
  const R = grid.getBoundingClientRect(), cw = (R.width + gap) / COLS, rh = (R.height + gap) / rows;
  const B = box.getBoundingClientRect(); const gx = Math.floor((e.clientX - B.left) / cw), gy = Math.floor((e.clientY - B.top) / rh);
  const [sw, sh] = SIZES[w.size];
  const ghost = document.createElement('div'); ghost.className = 'wghost'; grid.appendChild(ghost);
  let tx = w.x, ty = w.y, ok = true, moved = false; const sx = e.clientX, sy = e.clientY;
  const place = ev => {
    if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) > 6) moved = true;
    if (!moved) return;
    const r = grid.getBoundingClientRect();
    tx = Math.max(0, Math.min(COLS - sw, Math.floor((ev.clientX - r.left) / cw) - gx));
    ty = Math.max(0, Math.floor((ev.clientY - r.top) / rh) - gy);
    ok = fits(lay(), w.size, tx, ty, id);
    ghost.style.cssText = '--gc:' + (tx + 1) + ' / span ' + sw + ';--gr:' + (ty + 1) + ' / span ' + sh;
    ghost.classList.toggle('bad', !ok);
  };
  box.classList.add('dragging');
  const tgt = e.target; try { tgt.setPointerCapture(e.pointerId); } catch (x) { /* ignoré */ }
  const up = () => {
    tgt.removeEventListener('pointermove', place); tgt.removeEventListener('pointerup', up); tgt.removeEventListener('pointercancel', up);
    ghost.remove(); box.classList.remove('dragging');
    if (moved && (tx !== w.x || ty !== w.y)) { if (ok) moveTo(root, id, tx, ty); else toast(t('wg.noRoom')); }
  };
  tgt.addEventListener('pointermove', place); tgt.addEventListener('pointerup', up); tgt.addEventListener('pointercancel', up);
}

export function bindEditor(root, repaint) {
  root.addEventListener('pointerdown', e => {
    const h = e.target.closest('.editing [data-wmove]'); if (h) startDrag(root, e, h.closest('.wbox'));
  });
  root.addEventListener('click', e => {
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
