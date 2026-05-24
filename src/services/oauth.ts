import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { env } from "../config/env";
import { apiFetch } from "./api";
import type { UserProfile } from "../store/authStore";
import { ApiError } from "./api";

WebBrowser.maybeCompleteAuthSession();

export type OAuthProvider = "google" | "github";

function getRedirectUri() {
  return AuthSession.makeRedirectUri({
    scheme: "blumenmeet",
    path: "auth/callback",
  });
}

function parseTokenFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("token");
  } catch {
    return null;
  }
}

export async function signInWithOAuth(
  provider: OAuthProvider
): Promise<{ token: string; user: UserProfile }> {
  const base = env.oauthApiUrl;
  const redirectUri = getRedirectUri();
  const donePath = `/mobile-oauth-done?app_redirect=${encodeURIComponent(redirectUri)}`;
  const callbackUrl = `${base}${donePath}`;
  const authUrl = `${base}/api/auth/signin/${provider}?${new URLSearchParams({
    callbackUrl,
  })}`;

  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (result.type === "cancel" || result.type === "dismiss") {
    throw new ApiError("Sign in cancelled", 0);
  }

  if (result.type !== "success") {
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

/** User-facing hint when Google blocks emulator loopback IPs. */
export function getOAuthSetupHint(): string | null {
  if (!env.oauthNeedsAdbReverse) return null;
  return (
    "Android OAuth uses localhost. Run: adb reverse tcp:3000 tcp:3000\n" +
    "Set NEXTAUTH_URL=http://localhost:3000 in blumen_meet/.env.local and add " +
    "http://localhost:3000/api/auth/callback/google in Google Cloud Console."
  );
}
