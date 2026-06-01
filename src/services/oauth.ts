import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { env } from "../config/env";
import { apiFetch } from "./api";
import type { UserProfile } from "../store/authStore";
import { ApiError } from "./api";

WebBrowser.maybeCompleteAuthSession();

/** Android deep link — must match Info.plist / Android intent filter. */
export const APP_OAUTH_REDIRECT_URI = "blumenmeet://auth/callback";

export type OAuthProvider = "google" | "github";

/**
 * iOS ASWebAuthenticationSession completes on HTTPS callback URLs.
 * Android uses the custom scheme deep link.
 */
function getOAuthReturnUri() {
  if (Platform.OS === "ios") {
    return `${env.oauthApiUrl}/api/mobile/auth/oauth-complete`;
  }
  return APP_OAUTH_REDIRECT_URI;
}

function parseTokenFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("token");
  } catch {
    const match = url.match(/[?&]token=([^&]+)/);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  }
}

function buildOAuthStartUrl(provider: OAuthProvider) {
  const base = env.oauthApiUrl;
  return `${base}/api/mobile/auth/oauth-start?${new URLSearchParams({
    provider,
    redirect: APP_OAUTH_REDIRECT_URI,
  })}`;
}

export async function signInWithOAuth(
  provider: OAuthProvider
): Promise<{ token: string; user: UserProfile }> {
  const returnUri = getOAuthReturnUri();
  const authUrl = buildOAuthStartUrl(provider);

  const result = await WebBrowser.openAuthSessionAsync(authUrl, returnUri, {
    // Private browser session — no shared cookies; goes straight to Google/GitHub.
    preferEphemeralSession: true,
    showInRecents: Platform.OS === "android",
    ...(Platform.OS === "ios"
      ? {
          dismissButtonStyle: "close" as const,
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        }
      : {}),
  });

  if (result.type === "cancel" || result.type === "dismiss") {
    throw new ApiError("Sign in cancelled", 0);
  }

  if (result.type !== "success" || !("url" in result) || !result.url) {
    throw new ApiError("Sign in failed", 0);
  }

  const token = parseTokenFromUrl(result.url);
  if (!token) {
    throw new ApiError("No token received from sign in", 0);
  }

  const { user } = await apiFetch<{ user: UserProfile }>("/api/mobile/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
    auth: false,
  });

  return { token, user };
}

/** User-facing hint when the emulator cannot reach the Mac dev server for OAuth. */
export function getOAuthSetupHint(): string | null {
  if (env.oauthUsesProduction) return null;
  if (!env.oauthNeedsAdbReverse) return null;
  return (
    "Google sign-in needs your Mac’s server from the emulator.\n\n" +
    "Option A (one-time per emulator boot):\n" +
    "  npm run adb:reverse\n\n" +
    "Option B (no adb): in mobile-app/.env set\n" +
    "  EXPO_PUBLIC_OAUTH_API_URL=https://blumen-meet.vercel.app\n" +
    "then restart Metro (npm start)."
  );
}
