import Constants from "expo-constants";
import { Platform } from "react-native";

const extra = Constants.expoConfig?.extra as
  | { apiUrl?: string; oauthApiUrl?: string; webUrl?: string }
  | undefined;

function stripTrailingSlash(url: string) {
  return url.replace(/\/$/, "");
}

const PRODUCTION_API = "https://blumen-meet.vercel.app";

function isEmulatorOnlyHost(url: string) {
  return /10\.0\.2\.2|localhost|127\.0\.0\.1/.test(url);
}

function resolveApiUrl(): string {
  const raw = stripTrailingSlash(
    process.env.EXPO_PUBLIC_API_URL || extra?.apiUrl || "http://localhost:3000"
  );

  // iOS Simulator shares the Mac network — 10.0.2.2 (Android emulator) → localhost.
  if (Platform.OS === "ios" && !Constants.isDevice && raw.includes("10.0.2.2")) {
    return raw.replace("10.0.2.2", "localhost");
  }

  // Physical phone cannot reach Mac localhost or Android emulator host.
  if (Constants.isDevice && isEmulatorOnlyHost(raw)) {
    const fallback =
      process.env.EXPO_PUBLIC_OAUTH_API_URL ||
      extra?.oauthApiUrl ||
      (raw.includes("vercel.app") ? raw : PRODUCTION_API);
    return stripTrailingSlash(fallback);
  }

  return raw;
}

const apiUrl = resolveApiUrl();

/**
 * OAuth opens an in-app browser → NextAuth → Google → back to the app.
 *
 * Android emulator cannot open http://localhost:3000 (that is the emulator itself).
 * Options:
 * - EXPO_PUBLIC_OAUTH_API_URL=https://blumen-meet.vercel.app (easiest; API can stay local)
 * - EXPO_PUBLIC_OAUTH_API_URL=http://YOUR_LAN_IP:3000 + same URL in Google Console
 * - Default with 10.0.2.2 API: http://localhost:3000 + run `npm run adb:reverse`
 */
function resolveOAuthApiUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_OAUTH_API_URL || extra?.oauthApiUrl;
  if (explicit) return stripTrailingSlash(explicit);

  if (Platform.OS === "android" && apiUrl.includes("10.0.2.2")) {
    return "http://localhost:3000";
  }

  return apiUrl;
}

/**
 * Public URL for meeting invite links — must open in a desktop browser.
 * apiUrl may be 10.0.2.2 (emulator-only); invite links need localhost, LAN IP, or production domain.
 */
function resolvePublicWebUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_WEB_URL || extra?.webUrl;
  if (explicit) return stripTrailingSlash(explicit);

  const oauth = process.env.EXPO_PUBLIC_OAUTH_API_URL || extra?.oauthApiUrl;
  if (oauth) return stripTrailingSlash(oauth);

  if (Platform.OS === "ios" && apiUrl.includes("localhost")) {
    return apiUrl;
  }
  if (apiUrl.includes("10.0.2.2")) {
    return "http://localhost:3000";
  }

  return apiUrl;
}

export const env = {
  apiUrl,
  /** Base URL for OAuth browser flow only — must be Google/GitHub-allowed (localhost or LAN IP). */
  oauthApiUrl: resolveOAuthApiUrl(),
  /** Public web base for /join/… invite links (same format as the Next.js app). */
  webUrl: resolvePublicWebUrl(),
  livekitUrl: process.env.EXPO_PUBLIC_LIVEKIT_URL || "",
  /** True when OAuth uses localhost on Android (needs adb reverse). */
  oauthNeedsAdbReverse:
    Platform.OS === "android" &&
    apiUrl.includes("10.0.2.2") &&
    !process.env.EXPO_PUBLIC_OAUTH_API_URL,
  /** OAuth goes to production while API may still be local. */
  oauthUsesProduction: (process.env.EXPO_PUBLIC_OAUTH_API_URL || "").includes("vercel.app"),
  /** True when invite links default to localhost — other PCs on the LAN need EXPO_PUBLIC_WEB_URL. */
  webUrlNeedsLanConfig:
    apiUrl.includes("10.0.2.2") &&
    !process.env.EXPO_PUBLIC_WEB_URL &&
    !process.env.EXPO_PUBLIC_OAUTH_API_URL,
};
