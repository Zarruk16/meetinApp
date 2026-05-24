# Blumen Meet — Production Communication Platform

This document describes the **Expo Development Build** architecture for native calling (CallKit, ConnectionService), background audio, VoIP, LiveKit optimization, and AI meeting infrastructure.

## Architecture

```
mobile-app/
  app/                    Expo Router screens
  src/
    features/
      callkit/            CallKit + Android ConnectionService (react-native-callkeep)
      audio/              In-call audio routing (react-native-incall-manager)
      meetings/           LiveKit options + native session orchestration
      voip/               Push registration + incoming call handler
      ai/                 Summary / transcript API client
    hooks/
      useNativeMeetingSession.ts
      useMeetingReconnect.ts
    services/             Auth, API, LiveKit token
```

### Meeting lifecycle

1. User joins → `fetchLiveKitToken` → `LiveKitRoom` connects with `MOBILE_LIVEKIT_ROOM_OPTIONS`
2. `useNativeMeetingSession` starts:
   - **iOS CallKit** / **Android ConnectionService** ongoing call UI
   - **InCallManager** audio session (speaker, Bluetooth, proximity)
   - **Foreground notification** (Android)
   - **Keep awake** during call
3. On leave → session stops, CallKit ends, notification dismissed

---

## 1. Migrate from Expo Go → Development Build

LiveKit, CallKeep, and InCallManager **do not run in Expo Go**.

### Install & prebuild

```bash
cd mobile-app
npm install --legacy-peer-deps
npx expo prebuild --clean
```

### Run dev client

```bash
# iOS simulator / device
npm run ios

# Android emulator / device
npm run android

# Metro (after native build installed)
npm start
```

### EAS cloud builds

```bash
npm i -g eas-cli
eas login
eas build --profile development --platform ios
eas build --profile development --platform android
```

`eas.json` profiles: `development`, `preview`, `production`.

---

## 2. iOS CallKit

Configured in `app.config.ts`:

- `UIBackgroundModes`: `audio`, `voip`, `fetch`
- Bluetooth usage strings

Implementation: `src/features/callkit/callKeepManager.ts`

| Feature | Status |
|---------|--------|
| Ongoing call on lock screen | ✅ `startCall` + `setCurrentCallActive` |
| Mute from system UI | ✅ `didPerformSetMutedCallAction` |
| End call from system UI | ✅ `endCall` event |
| Incoming call UI | ✅ `displayIncomingCall` (from VoIP push handler) |
| Call duration on lock screen | ✅ `updateDisplay` every 5s |

**Rebuild required** after changing native permissions or adding PushKit.

---

## 3. Android ConnectionService

- `react-native-callkeep` with `foregroundService` channel
- Permissions: `FOREGROUND_SERVICE_PHONE_CALL`, `READ_PHONE_STATE`, etc.
- Sticky **ongoing meeting** notification via `expo-notifications`

If Telecom registration fails on a device, the app falls back to foreground notification + InCallManager only.

---

## 4. Background audio

| Layer | Module |
|-------|--------|
| WebRTC audio | `@livekit/react-native` `AudioSession` |
| Native routing | `react-native-incall-manager` |
| Screen wake | `expo-keep-awake` |

Meetings should continue with screen locked when using a **development build** on a physical device.

---

## 5. LiveKit mobile optimization

`MOBILE_LIVEKIT_ROOM_OPTIONS` (`src/features/meetings/livekitOptions.ts`):

- `adaptiveStream: true`
- `dynacast: true`
- `disconnectOnPageLeave: false`
- `DefaultReconnectPolicy`

`useMeetingReconnect` shows overlay on network loss / reconnect.

---

## 6. VoIP push notifications

### Current (implemented)

- Expo push token registration → `POST /api/mobile/voip/register`
- Payload handler → `displayIncomingMeetingCall`

### Production iOS (your next steps)

1. Enable **Push Notifications** + **Background Modes → Voice over IP** in Apple Developer
2. Create **VoIP Services Certificate**
3. Add native PushKit module (e.g. `react-native-voip-push-notification`) in dev build
4. Send VoIP push from backend with `roomId`, `hostName`
5. Pass `voipToken` to `/api/mobile/voip/register`

### Production Android

1. Firebase project → FCM server key
2. High-priority data messages with `category: call`
3. Full-screen intent notification for incoming meetings

---

## 7. AI pipeline (backend)

```
Meeting → LiveKit Egress → R2/S3 → Whisper (transcriptionService)
       → OpenAI summary (summaryService) → MeetingSummary MongoDB
       → Mobile: GET/POST /api/meetings/:roomId/summary
       → Mobile: GET /api/meetings/:roomId/transcript
```

Mobile client: `src/features/ai/meetingAi.ts`

Env on **blumen_meet**:

```env
OPENAI_API_KEY=
OPENAI_SUMMARY_MODEL=gpt-4o-mini
# Recording storage (R2/S3) — see web docs
```

---

## 8. Environment variables

### mobile-app `.env`

```env
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:3000
EXPO_PUBLIC_WEB_URL=http://YOUR_LAN_IP:3000
EXPO_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
```

### blumen_meet `.env.local`

```env
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_URL=
NEXTAUTH_SECRET=
NEXT_PUBLIC_APP_URL=
OPENAI_API_KEY=
```

---

## 9. Troubleshooting

| Issue | Fix |
|-------|-----|
| CallKit not showing | Rebuild dev client; not supported in Expo Go |
| No background audio | Physical device + dev build; check iOS Background Modes |
| Android no lock screen controls | Grant phone account permission; check log for Telecom errors |
| LiveKit disconnects on lock | Ensure `disconnectOnPageLeave: false` |
| API unreachable | Use LAN IP, not `10.0.2.2`, on real devices |

---

## 10. Security checklist

- [x] LiveKit tokens from server only (short-lived JWT)
- [x] Mobile auth Bearer tokens (`NEXTAUTH_SECRET`)
- [ ] VoIP push payload signing (when PushKit/FCM live)
- [ ] Certificate pinning (optional enterprise)
- [x] Recording access gated by host auth on API

---

## Related

- Web app: `../blumen_meet`
- Mobile README: `../README.md`
