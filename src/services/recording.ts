import { env } from "../config/env";
import { apiFetch } from "./api";

export async function startMeetingRecording(roomName: string, opts?: { hostUserId?: string; hostName?: string }) {
  const backend = process.env.EXPO_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  if (backend) {
    const res = await fetch(`${backend}/start-recording`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName, ...opts }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "Failed to start recording");
    return data as { recordingId: string };
  }
  return apiFetch<{ recordingId: string }>("/api/recordings/start", {
    method: "POST",
    body: JSON.stringify({ roomName, ...opts }),
  });
}

export async function stopMeetingRecording(recordingId: string) {
  const backend = process.env.EXPO_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  if (backend) {
    const res = await fetch(`${backend}/stop-recording`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordingId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "Failed to stop recording");
    return data;
  }
  return apiFetch("/api/recordings/stop", {
    method: "POST",
    body: JSON.stringify({ recordingId }),
  });
}

export function getMeetingJoinUrl(roomId: string) {
  return `${env.webUrl}/join/${roomId}`;
}
