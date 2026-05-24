import { useEffect, useRef, useState } from "react";
import { MeetingConnectingState, MeetingErrorState } from "../../src/components/meeting/room/MeetingStates";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LiveKitRoom, AudioSession } from "@livekit/react-native";
import { MeetingRoomContent } from "../../src/meeting/MeetingRoomContent";
import { fetchLiveKitToken } from "../../src/services/livekit";
import { getStoredHostKey } from "../../src/services/meetings";
import { useAuthStore } from "../../src/store/authStore";
import { MOBILE_LIVEKIT_ROOM_OPTIONS } from "../../src/features/meetings";
import { useNativeMeetingSession } from "../../src/hooks/useNativeMeetingSession";
import { v4 as uuidv4 } from "uuid";

export default function MeetingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    roomId: string;
    name?: string;
    isHost?: string;
    mic?: string;
    cam?: string;
  }>();
  const user = useAuthStore((s) => s.user);
  const roomId = params.roomId;
  const displayName = params.name || "Guest";
  const isHost = params.isHost === "1";
  const micOn = params.mic !== "0";
  const camOn = params.cam !== "0";

  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [hostKey, setHostKey] = useState("");
  const callUuid = useRef(uuidv4()).current;

  const connected = Boolean(token && serverUrl);

  useNativeMeetingSession({
    callUUID: callUuid,
    roomId,
    displayName,
    hasVideo: camOn,
    active: connected,
  });

  useEffect(() => {
    AudioSession.startAudioSession();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  useEffect(() => {
    getStoredHostKey(roomId).then(setHostKey);
  }, [roomId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchLiveKitToken({
          roomName: roomId,
          userName: displayName,
          identity: user?.id ? `user-${user.id}` : undefined,
          isHost,
        });
        if (cancelled) return;
        setToken(result.token);
        setServerUrl(result.serverUrl);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to connect");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [roomId, displayName, isHost, user?.id]);

  if (error) {
    return <MeetingErrorState error={error} onBack={() => router.back()} />;
  }

  if (!token || !serverUrl) {
    return <MeetingConnectingState />;
  }

  return (
    <LiveKitRoom
      serverUrl={serverUrl}
      token={token}
      connect
      audio={micOn}
      video={camOn}
      options={MOBILE_LIVEKIT_ROOM_OPTIONS}
    >
      <MeetingRoomContent
        roomId={roomId}
        displayName={displayName}
        isHost={isHost}
        hostKey={hostKey}
        hostUserId={user?.id || ""}
        callUUID={callUuid}
        onLeave={() => {}}
      />
    </LiveKitRoom>
  );
}
