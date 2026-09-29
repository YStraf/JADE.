// Génère build/icon.png (512 px) : pastille Jade, sans dépendance (PNG écrit à la main).
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
const S = 512, px = Buffer.alloc(S * (S * 4 + 1));
for (let y = 0; y < S; y++) {
  px[y * (S * 4 + 1)] = 0;
  for (let x = 0; x < S; x++) {
    const dx = x - S / 2 + .5, dy = y - S / 2 + .5, d = Math.hypot(dx, dy), o = y * (S * 4 + 1) + 1 + x * 4;
    const R = S * .46, ring = d > R - 46 && d < R, dot = d < 58, cross = (Math.abs(dx) < 10 && Math.abs(dy) > 90 && Math.abs(dy) < 170) || (Math.abs(dy) < 10 && Math.abs(dx) > 90 && Math.abs(dx) < 170);
    let c = [0, 0, 0, 0];
    if (d < R) c = [11, 15, 13, 255];
    if (ring || cross) c = [46, 232, 138, 255];
    if (dot) c = [184, 255, 221, 255];
    if (d >= R - 1 && d < R + 1) c[3] = Math.round(c[3] * (R + 1 - d) / 2);
    px.set(c, o);
  }
}
const crc = b => { let c, n, t = []; for (n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } c = 0xffffffff; for (const v of b) c = t[(c ^ v) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => { const l = Buffer.alloc(4); l.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(S, 0); ihdr.writeUInt32BE(S, 4); ihdr[8] = 8; ihdr[9] = 6;
mkdirSync(new URL('../build/', import.meta.url), { recursive: true });
writeFileSync(new URL('../build/icon.png', import.meta.url), Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(px)), chunk('IEND', Buffer.alloc(0))]));
console.log('build/icon.png créé');
