# Install Blumen Meet on Android (standalone APK)

Production API: **[https://blumen-meet.vercel.app](https://blumen-meet.vercel.app)**

The release APK talks to Vercel over HTTPS — works on **any Android phone** with internet (no Metro, no LAN IP).

---

## 1. Deploy latest backend to Vercel (required for app login)

Mobile login uses `/api/mobile/auth/*`. If those routes are not on Vercel yet, push and redeploy `blumen_meet`:

```bash
cd blumen_meet
git add src/app/api/mobile
git commit -m "Add mobile auth and VoIP API routes"
git push
# Vercel redeploys automatically
```

Verify:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://blumen-meet.vercel.app/api/mobile/auth/login \
  -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"x"}'
```

Expect `401` (bad credentials), not `404`.

Guest **join by link** works with existing `/api/meetings` and `/api/livekit/get-token` on Vercel.

---

## 2. Build the APK (on your Mac)

```bash
cd mobile-app
cp .env.production.example .env.production   # already points at Vercel
npm run build:apk
```

Output:

```text
dist/BlumenMeet-YYYYMMDD-release.apk
```

Takes ~15–25 minutes the first time.

---

## 3. Install on any Android device

1. Copy `dist/BlumenMeet-*-release.apk` to the phone (Drive, WhatsApp, USB).
2. Open the file → allow **Install unknown apps** if prompted.
3. Open **Blumen Meet** — sign in or join with a web meeting link.

Or with USB debugging:

```bash
adb install -r dist/BlumenMeet-*-release.apk
```

---

## Cloud build (optional)

```bash
npm i -g eas-cli
eas login
cd mobile-app
eas build --profile preview --platform android
```

`preview` in `eas.json` already sets Vercel URLs.

## Open meeting links in the app (Zoom-style)

After deploying the latest **web** (`blumen_meet`) and installing a **new** EAS build, shared links like `https://blumen-meet.vercel.app/join/{roomId}` open the app when it is installed on Android.

See `blumen_meet/docs/APP_LINKS.md` for verification and iOS setup.

## App icon & splash (native)

JS reload does **not** update the launcher icon or cold-start splash. After changing `assets/` or `app.config.ts`:

```bash
npm run sync:brand
npm run android
```

On the emulator/phone, **uninstall** the old app first if the launcher icon still looks like the default Expo grid — Android caches launcher icons.

```bash
adb uninstall com.blumenmeet.app
npm run android
```

---

## iOS

```bash
eas build --profile preview --platform ios
```

Requires an Apple Developer account for real devices.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Login fails | Deploy `/api/mobile/auth/*` to Vercel (see step 1) |
| Join fails | Use full link from web or full room UUID |
| “Unable to connect” | Phone needs internet; check Vercel is up |
| Old APK still uses LAN IP | Rebuild after updating `.env.production` |
