# iOS development (Simulator + Xcode)

## Prerequisites

- Xcode installed (open once to accept license)
- CocoaPods: `sudo gem install cocoapods` (if `pod` is missing)
- Backend running: `cd blumen_meet && npm run dev`

## Quick start (Simulator)

**Terminal 1 — backend**

```bash
cd blumen_meet
npm run dev
```

**Terminal 2 — Metro**

```bash
cd mobile-app
npm start
```

**Terminal 3 — build & run iOS**

```bash
cd mobile-app
npm run ios
```

First run installs pods and compiles native code (~5–15 min). Later runs are faster.

Pick a simulator when prompted, or:

```bash
npx expo run:ios --device "iPhone 16"
```

## Environment (local dev)

Your `.env` can keep Android emulator URLs — on **iOS Simulator** the app auto-maps `10.0.2.2` → `localhost`.

Recommended for iOS-only testing:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_WEB_URL=http://localhost:3000
EXPO_PUBLIC_OAUTH_API_URL=https://blumen-meet.vercel.app
```

Google sign-in: Vercel OAuth (as on Android) or local `http://localhost:3000` with Google Console redirect URI configured.

## Open in Xcode

```bash
open ios/BlumenMeet.xcworkspace
```

Select a simulator or your plugged-in iPhone → **Run** (▶). Metro must be running (`npm start`).

## Dev build vs “real app” on your phone

What you install from Xcode with **Debug** is an **Expo dev client**, not the App Store build.

| What you see | Meaning |
|--------------|---------|
| Wireframe grid icon / splash + **Tools** button | Dev client waiting for **Metro** (JS bundle on your Mac) |
| Blumen Meet intro + login UI | Connected to Metro — normal app |

**To use the dev build on a physical iPhone:**

1. Mac and iPhone on the **same Wi‑Fi**
2. Terminal: `cd mobile-app && npx expo start --dev-client --lan`
3. Open the app on the phone — it should load the bundle (or tap the project in the dev menu)

**Standalone app (no Metro, real icon, like Android APK):**

```bash
npm run ios:release
```

Or after paid Apple Developer enrollment: `npm run build:ios:eas`

Refresh launcher icon after asset changes: `npm run sync:brand` then rebuild in Xcode.

---

## Physical iPhone

1. Plug in iPhone, trust the Mac.
2. Xcode → **Signing & Capabilities** → Team: your Apple ID (free Personal Team works).
3. **Personal Team:** Free teams cannot use Push Notifications or Associated Domains. This repo strips those entitlements via `plugins/withIosNoPushEntitlement.js` so signing works. Universal links + remote push need the paid Apple Developer Program ($99/yr).
4. On iPhone: **Settings → General → VPN & Device Management** → trust developer.
5. Run:

```bash
npm run ios -- --device
```

Phone and Mac must be on the same Wi‑Fi if using a LAN IP for the API.

## Cloud build (TestFlight / install without Xcode)

Requires [Apple Developer Program](https://developer.apple.com/programs/) ($99/year):

```bash
eas build --profile preview --platform ios
```

Simulator-only build (no Apple Developer account):

```bash
eas build --profile preview-simulator --platform ios
```

Download the `.tar.gz`, extract, drag the `.app` onto the Simulator.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `pod: command not found` | `sudo gem install cocoapods` then `cd ios && pod install` |
| Build fails after dependency change | `cd ios && pod install && cd .. && npm run ios` |
| Cannot connect to API | Ensure `npm run dev` in `blumen_meet`; use `localhost:3000` on Simulator |
| Camera/mic in Simulator | Use a real device for full AV testing |
