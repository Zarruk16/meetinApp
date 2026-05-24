import { Platform } from "react-native";

let InCallManager: typeof import("react-native-incall-manager").default | null = null;
let active = false;

async function loadInCall() {
  if (InCallManager) return InCallManager;
  InCallManager = (await import("react-native-incall-manager")).default;
  return InCallManager;
}

/**
 * Native audio session: routing, proximity, speaker, Bluetooth (WhatsApp/FaceTime-style).
 */
export async function startInCallAudio(opts: { video?: boolean; ringback?: boolean } = {}) {
  try {
    const ICM = await loadInCall();
    ICM.start({ media: opts.video ? "video" : "audio", ringback: opts.ringback ? "_DEFAULT_" : "" });
    ICM.setKeepScreenOn(true);
    if (Platform.OS === "android") {
      ICM.setForceSpeakerphoneOn(false);
    }
    active = true;
  } catch (e) {
    console.warn("[InCallManager] start failed", e);
  }
}

export async function stopInCallAudio() {
  if (!active) return;
  try {
    const ICM = await loadInCall();
    ICM.stop();
    ICM.setKeepScreenOn(false);
  } catch {
    // ignore
  }
  active = false;
}

export async function setSpeakerphone(on: boolean) {
  try {
    const ICM = await loadInCall();
    ICM.setForceSpeakerphoneOn(on);
  } catch {
    // ignore
  }
}

export async function setMicrophoneMute(muted: boolean) {
  try {
    const ICM = await loadInCall();
    ICM.setMicrophoneMute(muted);
  } catch {
    // ignore
  }
}

export function isInCallAudioActive() {
  return active;
}
