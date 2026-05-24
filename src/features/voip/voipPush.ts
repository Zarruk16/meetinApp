import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { apiFetch } from "../../services/api";
import { getAuthToken } from "../../store/authStore";
import { displayIncomingMeetingCall } from "../callkit";
import { v4 as uuidv4 } from "uuid";

export type VoipDeviceRegistration = {
  expoPushToken?: string;
  platform: "ios" | "android";
  voipToken?: string;
};

/**
 * Register device for meeting invites / VoIP pushes.
 * iOS VoIP (PushKit) requires native module + Apple VoIP certificate — wire token in dev build.
 */
export async function registerVoipDevice(reg: VoipDeviceRegistration) {
  try {
    await apiFetch("/api/mobile/voip/register", {
      method: "POST",
      body: JSON.stringify(reg),
      auth: Boolean(getAuthToken()),
    });
  } catch (e) {
    console.warn("[VoIP] device registration failed", e);
  }
}

export async function registerVoipFromExpoToken() {
  const token = await Notifications.getExpoPushTokenAsync().catch(() => null);
  if (!token?.data) return;
  await registerVoipDevice({
    expoPushToken: token.data,
    platform: Platform.OS === "ios" ? "ios" : "android",
  });
}

/** Handle push payload → native incoming call UI (until PushKit token wired). */
export async function handleIncomingMeetingPush(data: {
  roomId?: string;
  hostName?: string;
  hasVideo?: boolean;
}) {
  if (!data.roomId) return;
  const callUUID = uuidv4();
  await displayIncomingMeetingCall({
    callUUID,
    handle: data.hostName || "Meeting invite",
    roomName: data.roomId,
    hasVideo: data.hasVideo !== false,
  });
  return { callUUID, roomId: data.roomId };
}
