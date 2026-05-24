import { v4 as uuidv4 } from "uuid";
import { apiFetch } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isFullRoomId, parseMeetingIdentifier } from "../lib/parseMeetingInput";

export type MeetingMeta = {
  roomId: string;
  kind?: string;
  status?: string;
  startAt?: string | null;
  hostName?: string;
  hostUserId?: string;
  ownerUserId?: string;
  cancelled?: boolean;
  endedAt?: string | null;
};

export type AuthorizeResult = {
  allowed: boolean;
  reason?: string;
  isHost?: boolean;
  isOwner?: boolean;
  startAt?: string;
};

const hostKeyKey = (roomId: string) => `hostKey:${roomId}`;
const guestNameKey = (roomId: string) => `guestName:${roomId}`;

export async function getMeeting(roomId: string) {
  return apiFetch<MeetingMeta>(`/api/meetings/${encodeURIComponent(roomId)}`, { auth: false });
}

/** Normalize pasted link / short code → full roomId */
export async function resolveRoomId(input: string): Promise<string> {
  const parsed = parseMeetingIdentifier(input);
  if (!parsed) {
    throw new Error("Enter a meeting link or code");
  }

  if (isFullRoomId(parsed)) {
    return parsed;
  }

  try {
    await getMeeting(parsed);
    return parsed;
  } catch {
    // not an exact id — resolve short / partial code
  }

  const data = await apiFetch<{ roomId: string }>(
    `/api/meetings/resolve?code=${encodeURIComponent(parsed)}`,
    { auth: false }
  );
  if (!data?.roomId) {
    throw new Error("Meeting not found — check the link or code");
  }
  return data.roomId;
}

export async function authorizeJoin(
  roomId: string,
  opts: { hostKey?: string; hostUserId?: string }
) {
  return apiFetch<AuthorizeResult>(`/api/meetings/${encodeURIComponent(roomId)}/authorize`, {
    method: "POST",
    body: JSON.stringify(opts),
    auth: false,
  });
}

export async function createMeeting(opts: {
  hostUserId: string;
  hostName: string;
  kind?: "instant" | "scheduled";
}) {
  const roomId = uuidv4();
  const hostKey = uuidv4();
  await apiFetch("/api/meetings", {
    method: "POST",
    body: JSON.stringify({
      roomId,
      hostKey,
      hostUserId: opts.hostUserId,
      hostName: opts.hostName,
      kind: opts.kind || "instant",
      recurrence: "none",
    }),
    auth: false,
  });
  await AsyncStorage.setItem(hostKeyKey(roomId), hostKey);
  return { roomId, hostKey };
}

export async function getStoredHostKey(roomId: string) {
  return (await AsyncStorage.getItem(hostKeyKey(roomId))) || "";
}

export async function saveGuestName(roomId: string, name: string) {
  await AsyncStorage.setItem(guestNameKey(roomId), name);
}

export async function getGuestName(roomId: string) {
  return (await AsyncStorage.getItem(guestNameKey(roomId))) || "";
}

export async function presence(
  roomId: string,
  action: "join" | "leave",
  participant: { participantId: string; userId?: string; name: string }
) {
  return apiFetch(`/api/meetings/${roomId}/presence`, {
    method: "POST",
    body: JSON.stringify({ action, ...participant }),
    auth: false,
  });
}

export async function endMeeting(roomId: string, hostKey: string, hostUserId: string) {
  return apiFetch(`/api/meetings/${roomId}/end`, {
    method: "POST",
    body: JSON.stringify({ hostKey, hostUserId }),
    auth: false,
  });
}

export type HistoryItem = {
  roomId: string;
  joinedAt: number;
  title?: string;
};

export type ScheduledMeeting = {
  roomId: string;
  startAt?: string | null;
  createdAt?: string;
  recurrence?: string;
  status?: "scheduled" | "active" | "ended";
  hostKey?: string;
};

const HISTORY_KEY = "meeting_history";

export async function addMeetingHistory(item: HistoryItem) {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  const list: HistoryItem[] = raw ? JSON.parse(raw) : [];
  const next = [item, ...list.filter((h) => h.roomId !== item.roomId)].slice(0, 30);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export async function getMeetingHistory(): Promise<HistoryItem[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function getScheduledMeetings(hostUserId: string, hostName: string) {
  if (!hostUserId && !hostName) return [] as ScheduledMeeting[];
  const params = new URLSearchParams();
  if (hostUserId) params.set("hostUserId", hostUserId);
  if (hostName) params.set("hostName", hostName);
  const data = await apiFetch<{ meetings: ScheduledMeeting[] }>(`/api/meetings?${params.toString()}`, {
    auth: false,
  });
  const meetings = data.meetings || [];
  return meetings.sort((a, b) => {
    const aTime = a.startAt ? new Date(a.startAt).getTime() : a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.startAt ? new Date(b.startAt).getTime() : b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return aTime - bTime;
  });
}

export async function cacheHostKey(roomId: string, hostKey: string) {
  if (hostKey) await AsyncStorage.setItem(hostKeyKey(roomId), hostKey);
}
