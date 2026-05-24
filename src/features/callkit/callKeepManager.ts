import { Platform } from "react-native";
import type { NativeEventSubscription } from "react-native";

export type CallKeepHandlers = {
  onAnswerCall?: (callUUID: string) => void;
  onEndCall?: (callUUID: string) => void;
  onMuteToggle?: (muted: boolean, callUUID: string) => void;
};

let ready = false;
let RNCallKeep: typeof import("react-native-callkeep").default | null = null;
const subs: NativeEventSubscription[] = [];

const isIos = Platform.OS === "ios";

async function loadCallKeep() {
  if (!isIos) return null;
  if (RNCallKeep) return RNCallKeep;
  const mod = await import("react-native-callkeep");
  RNCallKeep = mod.default;
  return RNCallKeep;
}

/** CallKit on iOS only. Android uses sticky notifications (see notifications.ts). */
export async function setupCallKeepPlatform(handlers: CallKeepHandlers = {}) {
  if (!isIos) {
    ready = false;
    return;
  }

  try {
    const CK = await loadCallKeep();
    if (!CK) return;

    await CK.setup({
      ios: {
        appName: "Blumen Meet",
        supportsVideo: true,
        includesCallsInRecents: true,
      },
    });

    subs.forEach((s) => s.remove());
    subs.length = 0;

    subs.push(
      CK.addEventListener("answerCall", ({ callUUID }) => handlers.onAnswerCall?.(callUUID)),
      CK.addEventListener("endCall", ({ callUUID }) => handlers.onEndCall?.(callUUID)),
      CK.addEventListener("didPerformSetMutedCallAction", ({ muted, callUUID }) =>
        handlers.onMuteToggle?.(muted, callUUID)
      )
    );

    ready = true;
  } catch (e) {
    console.warn("[CallKeep] iOS setup failed", e);
    ready = false;
  }
}

export function isCallKeepReady() {
  return ready && isIos;
}

export async function startNativeCallUI(opts: {
  callUUID: string;
  handle: string;
  roomName: string;
  hasVideo?: boolean;
}) {
  if (!isCallKeepReady() || !RNCallKeep) return;
  const { callUUID, handle, roomName, hasVideo = true } = opts;
  RNCallKeep.startCall(callUUID, handle, roomName, "generic", hasVideo);
  RNCallKeep.setCurrentCallActive(callUUID);
}

export async function reportConnectedCall(callUUID: string) {
  if (!isCallKeepReady() || !RNCallKeep) return;
  RNCallKeep.setCurrentCallActive(callUUID);
}

export async function updateCallDisplay(callUUID: string, displayName: string, duration?: number) {
  if (!isCallKeepReady() || !RNCallKeep) return;
  RNCallKeep.updateDisplay(callUUID, displayName, "generic", duration);
}

export async function endNativeCallUI(callUUID: string) {
  if (!isCallKeepReady() || !RNCallKeep) return;
  RNCallKeep.endCall(callUUID);
}

export async function displayIncomingMeetingCall(opts: {
  callUUID: string;
  handle: string;
  roomName: string;
  hasVideo?: boolean;
}) {
  if (!isCallKeepReady() || !RNCallKeep) return;
  const { callUUID, handle, roomName, hasVideo = true } = opts;
  RNCallKeep.displayIncomingCall(callUUID, handle, roomName, "generic", hasVideo);
}

export async function teardownCallKeepListeners() {
  subs.forEach((s) => s.remove());
  subs.length = 0;
}
