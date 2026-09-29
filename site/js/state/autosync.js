// App : import automatique des séances Kovaak's. Le dossier est trouvé tout seul (bibliothèques Steam)
// ou choisi une seule fois ; ensuite chaque nouvelle partie arrive dans Ma progression sans rien faire.
import { N } from '../core/native.js';
import { us } from '../core/store.js';
import { toast } from '../core/toast.js';
import { t } from '../core/i18n.js';
import { emit } from '../core/bus.js';
import { runs, importFiles } from './progress.js';
let started = false, dir = null;
const asFile = f => ({ name: f.name, text: async () => f.text });
export const syncDir = () => dir;
async function pull() {
  const known = runs().map(r => r.file);
  const files = await N.statsRead(known);
  if (files && files.length) { const r = await importFiles(files.map(asFile)); if (r && r.added) { toast(t('sync.imported', { n: r.added })); emit('runs'); } }
}
export async function startSync(force) {
  if (!N || (started && !force)) return dir;
  dir = await N.statsDir(); us.set('syncDir', dir || '');
  if (!dir) return null;
  started = true; await pull(); await N.statsWatch();
  N.onStats(async f => { const r = await importFiles([asFile(f)]); if (r && r.added) { toast(t('sync.newRun', { s: f.name.split(' - ')[0] })); emit('runs'); } });
  return dir;
}
export async function pickDir() { if (!N) return null; const d = await N.statsPick(); if (d) { started = false; await startSync(true); } return d; }
