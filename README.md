# Blumen Meet — Mobile

Native iOS & Android **real-time communication platform** built with **Expo Development Build**, **React Native**, **LiveKit**, **CallKit**, and **NativeWind**. Connects to [blumen_meet](../blumen_meet).

> **Expo Go is not supported.** Use a development build (`npm run ios` / `npm run android`).

## Platform capabilities

| Feature | iOS | Android |
|---------|-----|---------|
| LiveKit A/V | ✅ | ✅ |
| CallKit / lock screen | ✅ | ✅ (ConnectionService) |
| Background audio | ✅ | ✅ |
| Foreground service | — | ✅ |
| In-call audio routing | ✅ | ✅ |
| Network reconnect UX | ✅ | ✅ |
| VoIP device registration | ✅ | ✅ |
| AI summaries (API) | ✅ | ✅ |

See **[docs/PLATFORM.md](./docs/PLATFORM.md)** for full architecture, EAS builds, PushKit/FCM next steps, and troubleshooting.

## Quick start

### 1. Backend

```bash
cd ../blumen_meet && npm run dev
```

### 2. Mobile

```bash
cd mobile-app
cp .env.example .env
# Set EXPO_PUBLIC_API_URL + EXPO_PUBLIC_WEB_URL
npm install --legacy-peer-deps
npx expo prebuild
npm run ios    # or npm run android
npm start
```

## Project structure

```
app/                      Expo Router
src/
  features/
    callkit/              CallKit + ConnectionService
    audio/                InCallManager
    meetings/             LiveKit options + session
    voip/                 Push registration
    ai/                   Summary / transcript client
  hooks/                  Reconnect, native session
  meeting/                Room UI (unchanged design)
  services/               API, auth, LiveKit
```

## Native rebuild

After adding native modules (`react-native-incall-manager`, etc.):

```bash
npx expo prebuild --clean
npm run ios
```
