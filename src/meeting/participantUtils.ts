import type { Participant } from "livekit-client";

export type ParticipantRole = "host" | "you" | "guest";

export function getHostIdentity(hostUserId?: string) {
  return hostUserId ? `user-${hostUserId}` : undefined;
}

export function getParticipantRole(
  participant: Participant,
  opts: { hostIdentity?: string; localIsHost?: boolean }
): ParticipantRole {
  if (participant.isLocal && opts.localIsHost) return "host";
  if (opts.hostIdentity && participant.identity === opts.hostIdentity) return "host";
  if (participant.isLocal) return "you";
  return "guest";
}

export function getParticipantDisplayName(participant: Participant) {
  const raw = participant.name || participant.identity || "Guest";
  return raw.replace(/^user-/, "").slice(0, 48);
}

export function getRoleLabel(role: ParticipantRole) {
  if (role === "host") return "Host";
  if (role === "you") return "You";
  return "Guest";
}
