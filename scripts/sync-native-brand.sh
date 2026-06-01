#!/usr/bin/env bash
# Regenerate PNG assets + sync Android/iOS native splash & launcher icons.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ Generating brand PNGs (mobile + web)…"
npm run generate:brand

echo "→ Syncing Android native project…"
npx expo prebuild --platform android --no-install

if [[ -d android ]]; then
  echo "→ Refreshing Android splash drawables…"
  node scripts/generate-android-splash.mjs
fi

echo "→ Syncing iOS native project (AppIcon + splash)…"
npx expo prebuild --platform ios --no-install

echo ""
echo "Done. Reinstall so launcher + splash update:"
echo "  npm run android"
echo "  npm run ios"
