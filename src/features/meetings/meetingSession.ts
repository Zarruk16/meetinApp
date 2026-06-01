import { Platform } from "react-native";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import {
  startNativeCallUI,
  endNativeCallUI,
  reportConnectedCall,
  updateCallDisplay,
} from "../callkit";
import { startInCallAudio, stopInCallAudio, setMicrophoneMute } from "../audio";
import {
  showOngoingCallNotification,
  updateOngoingCallNotification,
  dismissOngoingCallNotification,
} from "../../services/notifications";

const KEEP_AWAKE_TAG = "blumen-meet-call";

export type MeetingSessionConfig = {
  callUUID: string;
  roomId: string;
  displayName: string;
  hasVideo: boolean;
};

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * Orchestrates native call UI (iOS CallKit), Android ongoing notification,
 * in-call audio, and screen wake for an active LiveKit meeting.
 */
export class MeetingSession {
  private timer: ReturnType<typeof setInterval> | null = null;
  private startedAt = 0;

  constructor(private config: MeetingSessionConfig) {}

  async start() {
    const { callUUID, roomId, displayName, hasVideo } = this.config;
    this.startedAt = Date.now();

    await activateKeepAwakeAsync(KEEP_AWAKE_TAG);
    await startInCallAudio({ video: hasVideo });

    if (Platform.OS === "android") {
      await showOngoingCallNotification(
        `Meeting ${roomId.slice(0, 8)}`,
        `${displayName} — tap to return`
      );
    } else {
      await startNativeCallUI({
        callUUID,
        handle: displayName,
        roomName: roomId,
        hasVideo,
      });
      await reportConnectedCall(callUUID);
    }

    this.timer = setInterval(() => {
      const secs = Math.floor((Date.now() - this.startedAt) / 1000);
      if (Platform.OS === "android") {
        // Update shade text only every 30s — avoids notification churn.
        if (secs % 30 !== 0 && secs > 0) return;
        void updateOngoingCallNotification(
          `Meeting ${roomId.slice(0, 8)} · ${formatDuration(secs)}`,
          `${displayName} — tap to return`
        );
      } else {
        updateCallDisplay(callUUID, displayName, secs);
      }
    }, 5000);
  }

  async setMuted(muted: boolean) {
    await setMicrophoneMute(muted);
  }

  async stop() {
    const { callUUID } = this.config;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    deactivateKeepAwake(KEEP_AWAKE_TAG);
    await stopInCallAudio();
    await dismissOngoingCallNotification();
    if (Platform.OS === "ios") {
      await endNativeCallUI(callUUID);
    }
  }
}
