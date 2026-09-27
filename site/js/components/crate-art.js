// Illustrations SVG des caisses (isométriques), animées pour la caisse Animée.
let n = 0;
const THEMES = {
  static: { a: '#2EE88A', b: '#0E7A45', c: '#11241a', e: '#b9c2c7', mark: 'frame' },
  animated: { a: '#b48cff', b: '#5b2fb8', c: '#1d1233', e: '#5ac8ff', mark: 'spark' },
  mixed: { a: '#5ac8ff', b: '#1f6fb0', c: '#10202f', e: '#ffc46b', mark: 'gift' },
};
export function crateArt(key, { size = 180, open = false } = {}) {
  const th = THEMES[key] || THEMES.static; const id = 'cr' + (++n);
  const mark = th.mark === 'frame' ? '<circle cx="80" cy="84" r="11" fill="none" stroke="' + th.e + '" stroke-width="3"/><circle cx="80" cy="84" r="5" fill="' + th.a + '"/>'
    : th.mark === 'spark' ? '<path d="M80 70 l3.5 9 9 3.5 -9 3.5 -3.5 9 -3.5 -9 -9 -3.5 9 -3.5z" fill="' + th.e + '"/>'
    : '<path d="M71 84 h18 M80 75 v18" stroke="' + th.e + '" stroke-width="4" stroke-linecap="round"/>';
  const sparkles = key === 'animated' ? '<g class="cr-sp"><circle cx="30" cy="30" r="2" fill="#fff"/><circle cx="132" cy="24" r="1.6" fill="' + th.e + '"/><circle cx="140" cy="60" r="2.2" fill="#fff"/><circle cx="20" cy="70" r="1.4" fill="' + th.a + '"/></g>' : '';
  const ribbon = key === 'mixed' ? '<path d="M80 52 V118" stroke="' + th.e + '" stroke-width="7"/><path d="M42 72 L80 90 L118 72" fill="none" stroke="' + th.e + '" stroke-width="6" opacity=".9"/><path d="M80 34 c-12-14 -26-6 -14 2 z M80 34 c12-14 26-6 14 2 z" fill="' + th.e + '"/>' : '';
  const lidY = open ? -16 : 0;
  return '<svg class="crate-svg ' + key + '" width="' + size + '" height="' + Math.round(size * .8) + '" viewBox="0 0 160 128" aria-hidden="true"><defs>' +
    '<linearGradient id="' + id + 'l" x1="0" x2="1"><stop offset="0" stop-color="' + th.b + '"/><stop offset="1" stop-color="' + th.c + '"/></linearGradient>' +
    '<linearGradient id="' + id + 'r" x1="0" x2="1"><stop offset="0" stop-color="' + th.c + '"/><stop offset="1" stop-color="' + th.b + '"/></linearGradient>' +
    '<linearGradient id="' + id + 't" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + th.a + '"/><stop offset="1" stop-color="' + th.b + '"/></linearGradient>' +
    '<radialGradient id="' + id + 'h" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="' + th.a + '" stop-opacity=".55"/><stop offset="1" stop-color="' + th.a + '" stop-opacity="0"/></radialGradient></defs>' +
    '<ellipse cx="80" cy="70" rx="76" ry="56" fill="url(#' + id + 'h)" class="cr-halo"/>' + sparkles +
    '<ellipse cx="80" cy="120" rx="52" ry="6" fill="#000" opacity=".35"/>' +
    '<path d="M28 58 L80 82 L80 120 L28 96 Z" fill="url(#' + id + 'l)" stroke="' + th.a + '" stroke-opacity=".5"/>' +
    '<path d="M132 58 L80 82 L80 120 L132 96 Z" fill="url(#' + id + 'r)" stroke="' + th.a + '" stroke-opacity=".5"/>' +
    '<path d="M28 58 L28 96 M132 58 L132 96" stroke="' + th.e + '" stroke-width="3" stroke-opacity=".7"/>' +
    '<path d="M44 66 L44 104 M116 66 L116 104" stroke="' + th.e + '" stroke-width="1.5" stroke-opacity=".4"/>' +
    mark +
    '<g class="cr-lid" transform="translate(0 ' + lidY + ')"><path d="M28 50 L80 26 L132 50 L80 74 Z" fill="url(#' + id + 't)" stroke="' + th.e + '" stroke-width="1.5" stroke-opacity=".7"/>' +
    '<path d="M28 50 L28 58 L80 82 L132 58 L132 50 L80 74 Z" fill="' + th.b + '"/>' + ribbon + '</g></svg>';
}
