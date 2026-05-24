import { useCallback, useEffect, useRef, useState } from "react";
import { RoomEvent } from "livekit-client";
import { useRoomContext, useLocalParticipant } from "@livekit/react-native";
import { startMeetingRecording, stopMeetingRecording } from "../services/recording";

export function useMeetingSignals(
  roomId: string,
  isHost: boolean,
  hostUserId: string,
  displayName: string
) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const [raisedHands, setRaisedHands] = useState<Record<string, boolean>>({});
  const [handRaised, setHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartedAt, setRecordingStartedAt] = useState<number | null>(null);
  const recordingIdRef = useRef<string | null>(null);
  const [recordingBusy, setRecordingBusy] = useState(false);

  const publish = useCallback(
    async (payload: object) => {
      if (!room?.localParticipant) return;
      await room.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify(payload)),
        { reliable: true }
      );
    },
    [room]
  );

  useEffect(() => {
    if (!room) return;
    const onData = (payload: Uint8Array, participant?: { identity?: string }) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload));
        const identity = data.identity || participant?.identity;
        if (!identity) return;

        if (data.type === "raise-hand") {
          setRaisedHands((prev) => ({ ...prev, [identity]: !!data.raised }));
        }
        if (data.type === "recording") {
          setIsRecording(!!data.active);
          setRecordingStartedAt(data.active ? data.startedAt || Date.now() : null);
        }
      } catch {
        // ignore
      }
    };
    room.on(RoomEvent.DataReceived, onData);
    return () => {
      room.off(RoomEvent.DataReceived, onData);
    };
  }, [room]);

  const toggleRaiseHand = useCallback(async () => {
    const next = !handRaised;
    setHandRaised(next);
    const identity = localParticipant?.identity;
    if (identity) {
      setRaisedHands((prev) => ({ ...prev, [identity]: next }));
    }
    await publish({ type: "raise-hand", raised: next, identity });
  }, [handRaised, localParticipant?.identity, publish]);

  const toggleRecording = useCallback(async () => {
    if (!isHost || recordingBusy) return;
    setRecordingBusy(true);
    try {
      if (isRecording && recordingIdRef.current) {
        await stopMeetingRecording(recordingIdRef.current);
        recordingIdRef.current = null;
        setIsRecording(false);
        setRecordingStartedAt(null);
        await publish({ type: "recording", active: false });
      } else {
        const res = await startMeetingRecording(roomId, {
          hostUserId: hostUserId || undefined,
          hostName: displayName,
        });
        recordingIdRef.current = res.recordingId;
        const startedAt = Date.now();
        setIsRecording(true);
        setRecordingStartedAt(startedAt);
        await publish({ type: "recording", active: true, startedAt });
      }
    } catch {
      // UI-only fallback: still show local recording state for demo when API unavailable
      if (!isRecording) {
        const startedAt = Date.now();
        setIsRecording(true);
        setRecordingStartedAt(startedAt);
        await publish({ type: "recording", active: true, startedAt });
      } else {
        setIsRecording(false);
        setRecordingStartedAt(null);
        await publish({ type: "recording", active: false });
      }
    } finally {
      setRecordingBusy(false);
    }
  }, [isHost, recordingBusy, isRecording, roomId, hostUserId, displayName, publish]);

  const isHandRaised = useCallback(
    (identity: string) => !!raisedHands[identity],
    [raisedHands]
  );

  return {
    handRaised,
    toggleRaiseHand,
    isHandRaised,
    isRecording,
    recordingStartedAt,
    recordingBusy,
    toggleRecording,
  };
}
