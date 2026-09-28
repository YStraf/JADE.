#!/bin/bash
# Lance le serveur local du site (port 8765) si besoin, puis un script de test.
# Usage : tools/e2e/run.sh smoke fr,en   |   tools/e2e/run.sh flow   |   tools/e2e/run.sh mobile fr,de home,shop
set -euo pipefail
cd "$(dirname "$0")/../.."
if ! curl -s -o /dev/null --max-time 3 http://127.0.0.1:8765/; then
  setsid -f python3 -m http.server 8765 --directory site </dev/null >/dev/null 2>&1
  for _ in 1 2 3 4 5 6 7 8 9 10; do curl -s -o /dev/null --max-time 1 http://127.0.0.1:8765/ && break; sleep 0.3; done
fi
script="${1:-smoke}"; shift || true
exec node "tools/e2e/$script.mjs" "$@"
