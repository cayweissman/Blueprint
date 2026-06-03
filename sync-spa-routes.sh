#!/usr/bin/env bash
# Copies index.html into route folders so python3 -m http.server can serve /research/ etc.
# For full SPA support (refresh on /portfolio/TSLA), use: python3 serve.py

set -euo pipefail
cd "$(dirname "$0")"

routes=(portfolio principles about admin research letters performance)

for route in "${routes[@]}"; do
  mkdir -p "$route"
  cp index.html "$route/index.html"
done

echo "Synced index.html to: ${routes[*]}"
