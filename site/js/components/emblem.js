// Emblèmes de rang dessinés en SVG. La forme se complexifie à mesure que le rang monte.
import { RANKS } from '../data/game.js';
let n = 0;
function shade(hex, amt) {
  const h = hex.replace('#', ''); const num = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  let r = num >> 16, g = (num >> 8) & 255, b = num & 255;
  const f = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((f - r) * p + r); g = Math.round((f - g) * p + g); b = Math.round((f - b) * p + b);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
const SHIELD = 'M50 10 L82 21 V47 C82 68 67 84 50 92 C33 84 18 68 18 47 V21 Z';
const SHIELD_IN = 'M50 17 L75 26 V47 C75 64 63 77 50 84 C37 77 25 64 25 47 V26 Z';
const HEX = 'M50 8 L84 27 V67 L50 92 L16 67 V27 Z';
const HEX_IN = 'M50 16 L77 31 V63 L50 83 L23 63 V31 Z';
const GEM = 'M50 36 L62 48 L50 66 L38 48 Z';
const WING_L = 'M22 30 C8 32 2 44 3 60 C8 54 12 52 18 52 C12 60 12 66 14 72 C18 64 22 60 26 58 Z';
const CROWN = 'M31 20 L36 6 L43 15 L50 1 L57 15 L64 6 L69 20 Z';
function star(cx, cy, ro, ri, pts) { let d = ''; for (let i = 0; i < pts * 2; i++) { const a = Math.PI / pts * i - Math.PI / 2, r = i % 2 ? ri : ro; d += (i ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1) + ' '; } return d + 'Z'; }
export function emblem(index, { size = 64, div = 0, cls = '', title = '' } = {}) {
  const r = RANKS[Math.max(0, Math.min(RANKS.length - 1, index))]; const c = r.c; const id = 'em' + (++n);
  const hi = shade(c, .45), lo = shade(c, -.45), deep = shade(c, -.7);
  const defs = '<defs><linearGradient id="' + id + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + hi + '"/><stop offset=".55" stop-color="' + c + '"/><stop offset="1" stop-color="' + lo + '"/></linearGradient>' +
    '<linearGradient id="' + id + 'd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + shade(c, -.25) + '"/><stop offset="1" stop-color="' + deep + '"/></linearGradient>' +
    '<radialGradient id="' + id + 'r" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".4" stop-color="' + hi + '"/><stop offset="1" stop-color="' + c + '"/></radialGradient></defs>';
  let body = '';
  const chev = k => { let s = ''; for (let i = 0; i < k; i++) s += '<path d="M36 ' + (50 + i * 9) + ' L50 ' + (59 + i * 9) + ' L64 ' + (50 + i * 9) + '" fill="none" stroke="' + hi + '" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>'; return s; };
  const gem = '<path d="' + GEM + '" fill="url(#' + id + 'r)" stroke="' + deep + '" stroke-width="1.5"/><path d="M38 48 H62 M50 36 V66" stroke="#fff" stroke-opacity=".35" stroke-width="1"/>';
  if (index <= 2) {
    body = '<path d="' + SHIELD + '" fill="url(#' + id + 'g)" stroke="' + deep + '" stroke-width="2.5"/><path d="' + SHIELD_IN + '" fill="url(#' + id + 'd)" opacity=".9"/>' +
      '<path d="M50 24 L56 34 L50 38 L44 34 Z" fill="' + hi + '"/>' + chev(Math.max(1, 4 - (div || 3)));
  } else if (index <= 5) {
    const wings = index >= 4 ? '<path d="' + WING_L + '" fill="url(#' + id + 'g)" stroke="' + deep + '" stroke-width="1.5"/><path d="' + WING_L + '" transform="matrix(-1 0 0 1 100 0)" fill="url(#' + id + 'g)" stroke="' + deep + '" stroke-width="1.5"/>' : '';
    body = wings + '<path d="' + SHIELD + '" fill="url(#' + id + 'g)" stroke="' + deep + '" stroke-width="2.5"/><path d="' + SHIELD_IN + '" fill="url(#' + id + 'd)"/>' + gem +
      '<path d="M30 30 L40 27 M70 30 L60 27" stroke="' + hi + '" stroke-width="3" stroke-linecap="round"/>';
  } else if (index <= 8) {
    body = '<path d="' + WING_L + '" fill="url(#' + id + 'g)" stroke="' + deep + '" stroke-width="1.5" transform="translate(-4 4)"/><path d="' + WING_L + '" transform="matrix(-1 0 0 1 104 4)" fill="url(#' + id + 'g)" stroke="' + deep + '" stroke-width="1.5"/>' +
      '<path d="' + CROWN + '" fill="url(#' + id + 'g)" stroke="' + deep + '" stroke-width="1.5" transform="translate(0 4)"/>' +
      '<path d="' + HEX + '" fill="url(#' + id + 'g)" stroke="' + deep + '" stroke-width="2.5"/><path d="' + HEX_IN + '" fill="url(#' + id + 'd)"/>' + gem +
      '<circle cx="50" cy="26" r="3" fill="' + hi + '"/>';
  } else if (index <= 10) {
    body = '<path d="' + star(50, 50, 48, 30, index === 10 ? 12 : 8) + '" fill="url(#' + id + 'd)" opacity=".85"/>' +
      '<path d="' + WING_L + '" fill="url(#' + id + 'g)" stroke="' + deep + '" stroke-width="1.5" transform="translate(-4 2) scale(1.04)"/><path d="' + WING_L + '" transform="matrix(-1.04 0 0 1.04 104 2)" fill="url(#' + id + 'g)" stroke="' + deep + '" stroke-width="1.5"/>' +
      '<path d="' + CROWN + '" fill="url(#' + id + 'g)" stroke="' + deep + '" stroke-width="1.5" transform="translate(0 3)"/>' +
      '<path d="' + HEX + '" fill="url(#' + id + 'g)" stroke="' + deep + '" stroke-width="2.5" transform="translate(50 52) scale(.86) translate(-50 -50)"/>' +
      '<path d="' + star(50, 52, 17, 7, 4) + '" fill="url(#' + id + 'r)" stroke="' + deep + '" stroke-width="1.2"/>';
  } else {
    // Jade : gemme taillée, lauriers et halo
    const leaf = (x, y, rot) => '<ellipse cx="' + x + '" cy="' + y + '" rx="4" ry="8" transform="rotate(' + rot + ' ' + x + ' ' + y + ')" fill="url(#' + id + 'g)" stroke="' + deep + '" stroke-width=".8"/>';
    let laurels = ''; [[20, 66, -35], [15, 54, -15], [14, 41, 5], [18, 29, 25], [26, 19, 45]].forEach(([x, y, a]) => { laurels += leaf(x, y, a) + leaf(100 - x, y, -a); });
    body = '<circle cx="50" cy="50" r="46" fill="none" stroke="' + c + '" stroke-opacity=".35" stroke-width="2" stroke-dasharray="3 5"/>' + laurels +
      '<path d="M50 14 L74 30 L74 62 L50 84 L26 62 L26 30 Z" fill="url(#' + id + 'g)" stroke="' + deep + '" stroke-width="2.5"/>' +
      '<path d="M50 14 L50 84 M26 30 L74 62 M74 30 L26 62" stroke="#fff" stroke-opacity=".28" stroke-width="1.2"/>' +
      '<path d="M50 30 L62 40 L62 56 L50 66 L38 56 L38 40 Z" fill="url(#' + id + 'r)" stroke="' + deep + '" stroke-width="1.5"/>' +
      '<path d="' + CROWN + '" fill="' + hi + '" stroke="' + deep + '" stroke-width="1.2" transform="translate(50 4) scale(.55) translate(-50 0)"/>';
  }
  let pips = '';
  if (div) for (let i = 0; i < 4 - div; i++) { const x = 50 + (i - (3 - div) / 2) * 10; pips += '<path d="M' + x + ' 93 l4 4 -4 4 -4 -4z" fill="' + hi + '" stroke="' + deep + '" stroke-width=".8"/>'; }
  return '<svg class="emblem ' + (index === 11 ? 'glow ' : '') + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 100 104" role="img" aria-label="' + (title || r.id) + '">' + defs + body + pips + '</svg>';
}
