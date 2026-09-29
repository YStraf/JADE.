// Synchronisation automatique des séances Kovaak's : trouve le dossier « stats » (ou celui choisi une fois),
// envoie les fichiers CSV que Jade ne connaît pas encore, puis surveille les nouveaux.
const fs = require('node:fs');
const path = require('node:path');
const { libraries } = require('./games');
let watcher = null;
async function findKovaaks() {
  for (const lib of await libraries()) {
    const p = path.join(lib, 'steamapps', 'common', 'FPSAimTrainer', 'FPSAimTrainer', 'stats');
    if (fs.existsSync(p)) return p;
  }
  return null;
}
function readNew(dir, known) {
  const k = new Set(known || []); let names = [];
  try { names = fs.readdirSync(dir).filter(n => n.toLowerCase().endsWith('.csv') && !k.has(n)); } catch (e) { return []; }
  return names.slice(0, 2000).map(name => { try { return { name, text: fs.readFileSync(path.join(dir, name), 'utf8') }; } catch (e) { return null; } }).filter(Boolean);
}
function watch(dir, onFile) {
  if (watcher) watcher.close();
  const seen = new Set();
  try {
    watcher = fs.watch(dir, (ev, name) => {
      if (!name || !name.toLowerCase().endsWith('.csv') || seen.has(name)) return;
      // Kovaak's écrit le fichier en fin de partie : on attend qu'il soit complet.
      setTimeout(() => { try { const text = fs.readFileSync(path.join(dir, name), 'utf8'); if (text.length > 20) { seen.add(name); onFile({ name, text }); } } catch (e) { /* pas encore prêt */ } }, 1500);
    });
  } catch (e) { watcher = null; }
  return !!watcher;
}
module.exports = { findKovaaks, readNew, watch };
