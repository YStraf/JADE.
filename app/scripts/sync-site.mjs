// Copie le site (../site) dans renderer/ : l'application affiche le même code, avec la couche « app » activée.
import { cpSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const src = root + '../site', dst = root + 'renderer';
if (existsSync(dst)) rmSync(dst, { recursive: true, force: true });
cpSync(src, dst, { recursive: true, filter: p => !p.endsWith('sw.js') });
console.log('site copié dans renderer/');
