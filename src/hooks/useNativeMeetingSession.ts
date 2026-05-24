import { useEffect, useRef } from "react";
import { MeetingSession } from "../features/meetings";

type Options = {
  callUUID: string;
  roomId: string;
  displayName: string;
  hasVideo: boolean;
  /** When true, native call session starts (token + LiveKit ready). */
  active: boolean;
};

/**
 * Starts/stops native meeting session (CallKit, InCallManager, foreground notification).
 */
export function useNativeMeetingSession(opts: Options) {
  const sessionRef = useRef<MeetingSession | null>(null);

  useEffect(() => {
    if (!opts.active) return;

    const session = new MeetingSession({
      callUUID: opts.callUUID,
      roomId: opts.roomId,
      displayName: opts.displayName,
      hasVideo: opts.hasVideo,
    });
    sessionRef.current = session;
    session.start().catch((e) => console.warn("[MeetingSession] start", e));

    return () => {
      session.stop().catch(() => {});
      sessionRef.current = null;
    };
  }, [opts.active, opts.callUUID, opts.roomId, opts.displayName, opts.hasVideo]);

  return {
    setMuted: (muted: boolean) => sessionRef.current?.setMuted(muted),
  };
}
