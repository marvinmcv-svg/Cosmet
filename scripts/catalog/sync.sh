#!/usr/bin/env bash
# Re-scrapes the full cosmet.com.bo catalog (products, prices, variants, descriptions) into src/data.
# Usage: bash scripts/catalog/sync.sh   (then review `git diff --stat src/data`, commit and push)
set -euo pipefail
cd "$(dirname "$0")/../.."
RAW="${RAW_DIR:-$(mktemp -d)}"
python3 scripts/catalog/fetch_pages.py "$RAW"
python3 scripts/catalog/listings.py "$RAW/listings2.json"
python3 scripts/catalog/details.py "$RAW/listings2.json" "$RAW/details.json"
python3 scripts/catalog/build_data.py "$RAW" src/data
# Safety net: refuse a catalog that shrank dramatically (site down / markup change)
python3 - <<'PY'
import json, subprocess
new = len(json.load(open("src/data/products.json")))
old = subprocess.run(["git", "show", "HEAD:src/data/products.json"], capture_output=True, text=True).stdout
old = len(json.loads(old)) if old else 0
print(f"products: {old} -> {new}")
if old and new < old * 0.9:
    raise SystemExit("Catalog shrank by more than 10% — review before publishing")
PY
