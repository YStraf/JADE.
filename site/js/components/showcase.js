// Vitrine de profil (utilisée par Mon profil et la page publique d'un joueur).
// Les widgets sont placés sur une grille invisible (data/widgets.js) ; en mode édition, les cases sont visibles.
import { esc } from '../core/dom.js';
import { t, fmt } from '../core/i18n.js';
import { ic } from '../core/icons.js';
import { TESTS } from '../data/game.js';
import { skillOf } from '../data/routines.js';
import { WTYPES, COLS, ROWS, SHORT, dims, rowsUsed, layoutFrom } from '../data/widgets.js';
import { LIMITS } from '../data/premium.js';
import { avatar, banner } from './ui.js';
import { emblem } from './emblem.js';
import { rankLabel, titleOf } from './minicard.js';
import { playTime } from '../state/players.js';
import { runs, badges } from '../state/progress.js';
import { trackerStats, shortHandle } from '../state/trackers.js';
import { fmtVal } from '../pages/tests.js';
import { store } from '../core/store.js';

const head = (icon, title, extra = '') => '<h4>' + ic(icon) + '<span>' + esc(title) + '</span>' + extra + '</h4>';
const li = (k, v) => '<div class="li"><span class="muted">' + esc(k) + '</span><b>' + v + '</b></div>';
const note = k => '<p class="muted small-note">' + esc(t(k)) + '</p>';
const HTTPS = /^https:\/\/[^\s"'<>]+$/i;
export const safeUrl = u => (HTTPS.test(u || '') ? u : '');

// Lien de clip -> lecteur intégrable. Seules les plateformes connues sont acceptées.
export function clipEmbed(url) {
  const u = String(url || '').trim(); let m;
  if ((m = u.match(/^https:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/))) return { kind: 'iframe', src: 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1', p: 'YouTube' };
  if ((m = u.match(/^https:\/\/(?:clips\.twitch\.tv\/|(?:www\.)?twitch\.tv\/\w+\/clip\/)([\w-]+)/))) return { kind: 'iframe', src: 'https://clips.twitch.tv/embed?clip=' + m[1] + '&parent=' + location.hostname + '&autoplay=true', p: 'Twitch' };
  if ((m = u.match(/^https:\/\/(?:www\.)?streamable\.com\/(?:e\/)?(\w+)/))) return { kind: 'iframe', src: 'https://streamable.com/e/' + m[1] + '?autoplay=1', p: 'Streamable' };
  if (/^https:\/\/[^\s"'<>]+\.(mp4|webm)(\?[^\s"'<>]*)?$/i.test(u)) return { kind: 'video', src: u, p: '' };
  return null;
}

// ---- Widgets de jeu ----
const GAME = { cs2: 'CS2', faceit: 'FACEIT', valorant: 'VALORANT' };
function gameW(type, w, p) {
  const h = (w.cfg || {}).handle;
  const top = '<div class="gh"><span class="glogo g-' + type + '">' + GAME[type] + '</span>' + (h ? '<span class="muted gname">' + esc(shortHandle(h)) + '</span>' : '') + '<span class="tag outline gprev" title="' + esc(t('wg.previewTip')) + '">' + esc(t('wg.preview')) + '</span></div>';
  if (!h) return p.self ? top + note('wg.game.setup') : '';
  const s = trackerStats(type, h);
  const rank = type === 'cs2' ? '<div class="grank" style="--rc:' + s.c + '"><div><b>' + fmt(s.rating) + '</b><small>Premier</small></div></div>'
    : type === 'faceit' ? '<div class="grank" style="--rc:' + s.c + '"><span class="flvl">' + s.lvl + '</span><div><b>' + fmt(s.elo) + '</b><small>ELO</small></div></div>'
      : '<div class="grank" style="--rc:' + s.c + '"><div><b>' + esc(t('val.' + s.tier)) + (s.div ? ' ' + s.div : '') + '</b><small>' + esc(t('wg.game.ranked')) + '</small></div></div>';
  const stats = '<div class="gstats"><div><small>K/D</small><b>' + s.kd + '</b></div><div><small>' + esc(t('wg.game.hs')) + '</small><b>' + s.hs + ' %</b></div><div><small>' + esc(t('wg.game.win')) + '</small><b>' + s.win + ' %</b></div></div>';
  const form = '<div class="gform">' + s.matches.map(m => '<i class="' + (m.win ? 'w' : 'l') + '" title="' + esc(m.map + ' ' + m.score) + '">' + esc(m.win ? t('wg.game.w') : t('wg.game.l')) + '</i>').join('') + '</div>';
  const list = '<div class="gmatches"><div class="gm hd"><span>' + esc(t('wg.game.map')) + '</span><span>' + esc(t('wg.game.score')) + '</span><span>K/D/A</span><span>HS</span></div>' + s.matches.map(m => '<div class="gm ' + (m.win ? 'w' : 'l') + '"><span>' + esc(m.map) + '</span><b>' + m.score + '</b><span>' + m.k + '/' + m.d + '/' + m.a + '</span><span>' + m.hs + ' %</span></div>').join('') + '</div>';
  return top + rank + stats + form + list;
}

// ---- Widgets Jade (stats du site) ----
function jadeW(id, p) {
  if (id === 'records') return head('target', t('wg.records')) + Object.keys(TESTS).map(k => li(t('test.' + k + '.name'), fmtVal(k, (p.bests || {})[k]))).join('');
  if (id === 'scen') { const by = {}; runs().forEach(r => { by[r.scen] = Math.max(by[r.scen] || 0, r.score); }); const top = Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 5); return head('chart', t('wg.scen')) + (top.length ? top.map(x => li(x[0], fmt(Math.round(x[1])))).join('') : note('wg.noSessions')); }
  if (id === 'skills') { const g = {}; const rs = runs(); rs.forEach(r => { const k = skillOf(r.scen); g[k] = (g[k] || 0) + 1; }); return head('layers', t('wg.skills')) + (Object.keys(g).length ? Object.entries(g).map(x => li(t('skill.' + x[0]), Math.round(x[1] / rs.length * 100) + ' %')).join('') : note('wg.nothing')); }
  if (id === 'streak') return head('fire', t('wg.streak')) + '<div class="big-num"><b>' + (p.streak ?? 0) + '</b><span>' + esc(t('unit.days')) + '</span></div>' + li(t('stats.sessions'), fmt(p.sessions || 0)) + li(t('stats.timeOnJade'), playTime(p.minutes || 0));
  if (id === 'badges') { const got = (p.self ? badges() : []).filter(b => b.got); return head('star', t('wg.badges')) + (got.length ? '<div class="tags">' + got.map(b => '<span class="tag jade">' + esc(t('badge.' + b.id)) + '</span>').join('') + '</div>' : note('wg.noBadge')) + (p.level.lvl >= 20 ? '<div style="margin-top:8px"><span class="tag warn">★ ' + esc(t('item.perk.regular')) + '</span></div>' : ''); }
  if (id === 'rank') { const r = p.rank; return head('rank', t('wg.rank')) + (r ? '<div class="wrank">' + emblem(r.index, { size: 52, div: r.div }) + '<div><b style="color:' + r.c + '">' + esc(rankLabel(r)) + '</b><div class="muted small-note">' + fmt(p.rankPoints) + ' ' + esc(t('ranks.points')) + '</div></div></div>' : '<p class="muted small-note">' + esc(t('ranks.needTests', { n: Object.keys(p.bests || {}).length })) + '</p>'); }
  if (id === 'plan') { const pl = store.get('plan', null); return head('routine', t('wg.plan')) + (pl && pl.goal ? li(t('wizard.goal'), esc(t('goal.' + pl.goal))) + li(t('wizard.game'), esc(t('game.' + pl.game))) + li(t('wizard.time'), pl.time + ' min') : note('wg.noPlan')); }
  return '';
}

// ---- Widgets de personnalisation ----
export const CS_RAR = { consumer: '#b0c3d9', industrial: '#5e98d9', milspec: '#4b69ff', restricted: '#8847ff', classified: '#d32ce6', covert: '#eb4b4b', gold: '#e4ae39', contraband: '#e4ae39' };
export const CS_WEAR = ['FN', 'MW', 'FT', 'WW', 'BS'];
function persoW(w, p) {
  const c = w.cfg || {}; const media = c.media && p.media ? p.media(w.id) : '';
  if (w.type === 'image' || w.type === 'gif') {
    const src = (typeof media === 'string' && /^data:image\//.test(media) ? media : '') || safeUrl(c.url);
    if (!src) return p.self ? head(WTYPES[w.type].icon, t('wt.' + w.type)) + note('wg.media.empty') : '';
    return '<figure class="wmedia"><img src="' + esc(src) + '" alt="' + esc(c.caption || '') + '" loading="lazy" referrerpolicy="no-referrer" style="object-fit:' + (c.fit === 'contain' ? 'contain' : 'cover') + '">' + (c.caption ? '<figcaption>' + esc(c.caption) + '</figcaption>' : '') + '</figure>';
  }
  if (w.type === 'clip') {
    const e = clipEmbed(c.url);
    if (!e) return p.self ? head('play', t('wt.clip')) + note('wg.clip.empty') : '';
    return '<div class="wclip"><button type="button" class="clip-fac" data-clip="' + esc(e.src) + '" data-kind="' + e.kind + '">' + ic('play') + '<b>' + esc(c.title || t('wg.clip.play')) + '</b><small>' + esc(e.kind === 'iframe' ? t('wg.clip.consent', { p: e.p }) : t('wg.clip.video')) + '</small></button></div>';
  }
  if (w.type === 'collection') {
    const items = (c.items || []).filter(x => x && x.name);
    return head('crate', c.title || t('wt.collection')) + (items.length ? '<div class="wcoll">' + items.map(x => { const img = safeUrl(x.img); return '<div class="csi" style="--rc:' + (CS_RAR[x.rar] || CS_RAR.milspec) + '">' + (img ? '<img src="' + esc(img) + '" alt="" loading="lazy" referrerpolicy="no-referrer">' : '<span class="csi-ph">' + ic('crate') + '</span>') + '<b>' + (x.q === 'st' || x.st ? '<span class="st">ST™</span> ' : x.q === 'sv' ? '<span class="sv">SV</span> ' : '') + esc(x.name) + '</b><small>' + esc(CS_WEAR.includes(x.wear) ? x.wear : '') + (x.float ? ' · ' + esc(String(x.float).slice(0, 8)) : '') + '</small></div>'; }).join('') + '</div>' : note('wg.coll.empty'));
  }
  if (w.type === 'gallery') {
    const imgs = (c.urls || []).map(safeUrl).filter(Boolean);
    if (!imgs.length) return p.self ? head('grid', t('wt.gallery')) + note('wg.media.empty') : '';
    return '<div class="wgal" tabindex="0" aria-label="' + esc(t('wt.gallery')) + '">' + imgs.map(u => '<img src="' + esc(u) + '" alt="" loading="lazy" referrerpolicy="no-referrer" style="object-fit:' + (c.fit === 'contain' ? 'contain' : 'cover') + '">').join('') + '</div>' + (imgs.length > 1 ? '<div class="wgal-dots">' + imgs.map(() => '<i></i>').join('') + '</div>' : '');
  }
  if (w.type === 'text') return (c.title ? head('edit', c.title) : '') + (c.text ? '<p class="wtext" style="text-align:' + (['center', 'right'].includes(c.align) ? c.align : 'left') + '">' + esc(c.text) + '</p>' : (p.self ? note('wg.text.empty') : ''));
  if (w.type === 'setup') {
    const edpi = s => (+c.dpi && +s ? ' <small class="muted">(' + Math.round(c.dpi * s) + ' eDPI)</small>' : '');
    const rows = [['mouse', c.mouse], ['dpi', c.dpi], ['sensCs', c.sensCs, edpi(c.sensCs)], ['sensVal', c.sensVal, edpi(c.sensVal)], ['res', c.res], ['hz', c.hz ? c.hz + ' Hz' : ''], ['keyboard', c.keyboard], ['headset', c.headset]].filter(x => x[1]);
    return head('mouse', t('wt.setup')) + (rows.length ? rows.map(([k, v, x]) => li(t('wg.setup.' + k), esc(v) + (x || ''))).join('') : note('wg.setup.empty'));
  }
  return '';
}

function body(w, p) {
  const T = WTYPES[w.type];
  if (T.cat === 'games') return gameW(w.type, w, p);
  if (T.cat === 'jade') return (T.self && !p.self) ? '' : jadeW(w.type, p);
  return persoW(w, p);
}

// Rend la grille. opts.edit : cases visibles + barre d'outils sur chaque widget.
export function gridHTML(p, opts = {}) {
  const all = layoutFrom(p); const edit = !!opts.edit;
  // Sans Jade+ : pas de widget réservé, et pas plus de widgets que la limite gratuite (les autres restent gardés).
  const cap = p.plus || p.demo ? LIMITS.plus : LIMITS.free;
  const lay = edit ? all : all.filter(w => p.plus || p.demo || !WTYPES[w.type].plus).sort((a, b) => a.y - b.y || a.x - b.x).slice(0, cap);
  const hideStats = !p.self && p.prefs && p.prefs.showScores === false;
  const boxes = lay.map(w => {
    const T = WTYPES[w.type]; if (!edit && hideStats && T.stats) return '';
    const inner = body(w, p); if (!inner && !edit) return '';
    const [cw, ch] = dims(w);
    const locked = edit && ((T.plus && !p.plus) || all.indexOf(w) >= cap);
    return '<div class="wbox wt-' + w.type + (opts.sel === w.id ? ' sel' : '') + (locked ? ' wlocked' : '') + '" data-wid="' + esc(w.id) + '" data-sz="' + w.size + '" style="--gc:' + (w.x + 1) + ' / span ' + cw + ';--gr:' + (w.y + 1) + ' / span ' + ch + ';--mc:span ' + Math.min(cw, 2) + ';--mr:span ' + ch + ';--o:' + (w.y * COLS + w.x) + '">' +
      (edit ? '<div class="wtools"><button type="button" class="wmove" data-wmove aria-label="' + esc(t('wg.move')) + '">' + ic('grid') + '</button><span class="wlabel">' + (locked ? ic('lock') : '') + esc(t('wt.' + w.type)) + ' · ' + SHORT[w.size] + '</span>' + (T.cfg ? '<button type="button" data-wcfg aria-label="' + esc(t('wg.settings')) + '">' + ic('settings') + '</button>' : '') + '<button type="button" data-wsize aria-label="' + esc(t('wg.size')) + '">' + ic('layers') + '</button><button type="button" data-wdel aria-label="' + esc(t('common.remove')) + '">' + ic('trash') + '</button></div>' : '') +
      '<div class="wbody">' + (inner || note('wg.nothing')) + '</div></div>';
  }).join('');
  const rows = edit ? Math.min(ROWS, Math.max(4, rowsUsed(lay) + 2)) : rowsUsed(lay);
  const cells = edit ? Array.from({ length: rows * COLS }, (_, i) => '<button type="button" class="wcell" data-cx="' + (i % COLS) + '" data-cy="' + Math.floor(i / COLS) + '" style="--gc:' + (i % COLS + 1) + ';--gr:' + (Math.floor(i / COLS) + 1) + '" aria-label="' + esc(t('wg.cell', { x: i % COLS + 1, y: Math.floor(i / COLS) + 1 })) + '"></button>').join('') : '';
  if (!edit && !boxes.trim()) return '';
  return '<div class="wlay' + (edit ? ' editing' : '') + '" style="--rows:' + rows + '">' + cells + boxes + '</div>';
}

export function showcaseHTML(p, opts = {}) {
  const st = p.style || {}; const r = p.rank;
  return '<div class="showcase"' + (st.bg && st.bg !== 'none' ? ' data-bg="' + esc(st.bg) + '"' : '') + '>' + banner(st, '', 150) +
    '<div class="idt">' + avatar(p, 96, 'big') + '<div class="nmz"><b>' + esc(p.pseudo) + '</b><div class="row-flex" style="gap:8px;margin-top:4px">' + titleOf(st) + '<span class="muted small-note">' + esc(t('xp.level')) + ' ' + p.level.lvl + '</span>' + (r ? '<span class="row-flex" style="gap:5px">' + emblem(r.index, { size: 20 }) + '<b style="color:' + r.c + ';font-size:13.5px">' + esc(rankLabel(r)) + '</b></span>' : '') + (p.plus ? '<span class="tag plus-tag">Jade+</span>' : '') + (p.level.lvl >= 65 ? '<span class="tag">' + esc(t('item.perk.beta')) + '</span>' : '') + (p.role === 'admin' ? '<span class="tag danger">' + esc(t('role.admin')) + '</span>' : '') + '</div>' + (p.bio ? '<p class="muted bio">' + esc(p.bio) + '</p>' : '') + '</div></div>' +
    (!p.self && p.prefs && p.prefs.showScores === false ? '<p class="muted" style="padding:0 24px 12px">' + esc(t('player.scoresHidden')) + '</p>' : '') +
    '<div class="wwrap" id="wWrap">' + gridHTML(p, opts) + '</div></div>';
}

// Lecteur de clip : chargé seulement au clic (pas de cookies tiers avant).
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('.clip-fac'); if (!b || b.closest('.editing')) return;
  const src = b.dataset.clip; if (!/^https:\/\//.test(src)) return;
  const box = b.parentElement;
  if (b.dataset.kind === 'video') box.innerHTML = '<video src="' + esc(src) + '" controls autoplay playsinline></video>';
  else box.innerHTML = '<iframe src="' + esc(src) + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-presentation allow-popups" title="' + esc(t('wt.clip')) + '"></iframe>';
});
