import Constants from "expo-constants";
import { Platform } from "react-native";

const extra = Constants.expoConfig?.extra as
  | { apiUrl?: string; oauthApiUrl?: string; webUrl?: string }
  | undefined;

function stripTrailingSlash(url: string) {
  return url.replace(/\/$/, "");
}

const apiUrl = stripTrailingSlash(
  process.env.EXPO_PUBLIC_API_URL || extra?.apiUrl || "http://localhost:3000"
);

/**
 * OAuth sign-in opens a browser → Google/GitHub redirect back to NextAuth.
 * Google blocks private IPs like 10.0.2.2 in redirect URIs.
 *
 * - Emulator: use http://localhost:3000 + `adb reverse tcp:3000 tcp:3000`
 * - Or set EXPO_PUBLIC_OAUTH_API_URL to your Mac LAN IP (same as NEXTAUTH_URL)
 */
function resolveOAuthApiUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_OAUTH_API_URL || extra?.oauthApiUrl;
  if (explicit) return stripTrailingSlash(explicit);

  if (apiUrl.includes("10.0.2.2")) {
    return apiUrl.replace("10.0.2.2", "localhost");
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
  /** True when we auto-swapped 10.0.2.2 → localhost for OAuth (needs adb reverse). */
  oauthNeedsAdbReverse:
    Platform.OS === "android" &&
    apiUrl.includes("10.0.2.2") &&
    !process.env.EXPO_PUBLIC_OAUTH_API_URL,
  /** True when invite links default to localhost — other PCs on the LAN need EXPO_PUBLIC_WEB_URL. */
  webUrlNeedsLanConfig:
    apiUrl.includes("10.0.2.2") &&
    !process.env.EXPO_PUBLIC_WEB_URL &&
    !process.env.EXPO_PUBLIC_OAUTH_API_URL,
};
