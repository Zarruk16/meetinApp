#!/usr/bin/env bash
# Build a standalone release APK (install on any Android device — no Metro required).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f .env.production ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.production
  set +a
  echo "Using .env.production"
elif [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
  echo "Warning: using .env — for production use .env.production with https://blumen-meet.vercel.app"
fi

if [[ -z "${EXPO_PUBLIC_API_URL:-}" ]]; then
  echo "ERROR: Set EXPO_PUBLIC_API_URL in .env.production (e.g. https://blumen-meet.vercel.app)"
  exit 1
fi

if [[ "$EXPO_PUBLIC_API_URL" == *"10.0.2.2"* ]]; then
  echo "ERROR: 10.0.2.2 only works in the emulator. Use https://blumen-meet.vercel.app in .env.production"
  exit 1
fi

export NODE_ENV=production
export JAVA_HOME="${JAVA_HOME:-/Applications/Android Studio.app/Contents/jbr/Contents/Home}"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"

echo "API URL: $EXPO_PUBLIC_API_URL"
echo "Web URL: ${EXPO_PUBLIC_WEB_URL:-$EXPO_PUBLIC_API_URL}"

npx expo prebuild --platform android --clean

echo "sdk.dir=$ANDROID_HOME" > android/local.properties

# Expo CLI handles autolinking + JS bundle + Gradle (more reliable than raw assembleRelease)
npx expo run:android --variant release --no-bundler

APK_SRC="android/app/build/outputs/apk/release/app-release.apk"
DIST="$ROOT/dist"
mkdir -p "$DIST"

if [[ ! -f "$APK_SRC" ]]; then
  echo "ERROR: APK not found at $APK_SRC"
  exit 1
fi

OUT="$DIST/BlumenMeet-$(date +%Y%m%d)-release.apk"
cp "$APK_SRC" "$OUT"

echo ""
echo "APK ready:"
echo "  $OUT"
echo ""
echo "Install: adb install -r \"$OUT\""
