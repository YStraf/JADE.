#!/bin/bash
# Démarrage de session Claude Code (web) : vérifie l'outillage et lance le serveur local du site.
# Le site est statique (site/, sans build ni dépendances npm) ; les tests utilisent Playwright,
# déjà présent dans l'environnement cloud.
set -euo pipefail
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then exit 0; fi
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"

for bin in node python3 curl; do command -v "$bin" >/dev/null || echo "[jade] outil manquant : $bin" >&2; done
if ! node -e "require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright')" 2>/dev/null; then
  npm install -g playwright@1 >/dev/null 2>&1 || echo "[jade] Playwright indisponible : tests navigateur désactivés" >&2
fi

# Serveur local sur http://127.0.0.1:8765/ (utilisé par tools/e2e/run.sh)
if ! curl -s -o /dev/null --max-time 2 http://127.0.0.1:8765/; then
  setsid -f python3 -m http.server 8765 --directory site </dev/null >/dev/null 2>&1 || true
fi
echo "[jade] prêt : serveur local http://127.0.0.1:8765/ — tests : tools/e2e/run.sh smoke fr — traductions : node tools/check-i18n.mjs"
