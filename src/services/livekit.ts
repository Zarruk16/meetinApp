import { env } from "../config/env";
import { apiFetch } from "./api";

export async function fetchLiveKitToken(opts: {
  roomName: string;
  userName: string;
  identity?: string;
  isHost?: boolean;
}) {
  const backend = process.env.EXPO_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  const endpoint = backend ? `${backend}/get-token` : `${env.apiUrl}/api/livekit/get-token`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      roomName: opts.roomName,
      userName: opts.userName,
      identity: opts.identity,
      isHost: opts.isHost ?? false,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Token request failed (${res.status})`);
  }
  if (!data?.token || !data?.serverUrl) {
    throw new Error("Invalid token response");
  }
  return {
    token: data.token as string,
    serverUrl: data.serverUrl as string,
    identity: data.identity as string,
  };
}

export async function fetchRecordings() {
  return apiFetch<{ recordings: Array<Record<string, unknown>> }>("/api/recordings");
}
