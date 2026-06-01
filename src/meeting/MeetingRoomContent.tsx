import { useCallback, useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  useParticipants,
  useLocalParticipant,
  useRoomContext,
  useConnectionState,
} from "@livekit/react-native";
import { ConnectionState, RoomEvent, Track } from "livekit-client";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ParticipantStage } from "./ParticipantStage";
import { useMeetingChat } from "../hooks/useMeetingChat";
import { useMeetingReactions, REACTION_EMOJIS } from "../hooks/useMeetingReactions";
import { useMeetingTimer } from "../hooks/useMeetingTimer";
import { useMeetingSignals } from "../hooks/useMeetingSignals";
import { endMeeting, presence } from "../services/meetings";
import { getMeetingJoinUrl } from "../services/recording";
import { setMicrophoneMute } from "../features/audio";
import { endNativeCallUI } from "../features/callkit";
import { useMeetingReconnect } from "../hooks/useMeetingReconnect";
import { MeetingReconnectOverlay } from "../components/meeting/room/MeetingReconnectOverlay";
import { MeetingTopBar } from "../components/meeting/room/MeetingTopBar";
import { MeetingControlDock } from "../components/meeting/room/MeetingControlDock";
import { ChatDrawer } from "../components/meeting/room/ChatDrawer";
import { ParticipantsDrawer } from "../components/meeting/room/ParticipantsDrawer";
import { ReactionOverlay } from "../components/meeting/room/ReactionOverlay";
import { MeetingSettingsDrawer, type MeetingSettings } from "../components/meeting/room/MeetingSettingsDrawer";
import { MeetingShareSheet } from "../components/meeting/room/MeetingShareSheet";
import { MeetingAIPanel } from "../components/meeting/room/MeetingAIPanel";
import type { AdvancedControl } from "../components/meeting/room/ExpandableControlsPanel";
import { MEETING_LAYOUTS } from "./layout";
import { getHostIdentity } from "./participantUtils";
import { v4 as uuidv4 } from "uuid";

type Props = {
  roomId: string;
  displayName: string;
  isHost: boolean;
  hostKey: string;
  hostUserId: string;
  callUUID: string;
  onLeave: () => void;
};

export function MeetingRoomContent({
  roomId,
  displayName,
  isHost,
  hostKey,
  hostUserId,
  callUUID,
  onLeave,
}: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const room = useRoomContext();
  const connectionState = useConnectionState();
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  const { messages, sendMessage } = useMeetingChat();
  const { bubbles, sendReaction } = useMeetingReactions();
  const { formatted: timer } = useMeetingTimer(connectionState === ConnectionState.Connected);
  const {
    handRaised,
    toggleRaiseHand,
    isHandRaised,
    isRecording,
    recordingStartedAt,
    recordingBusy,
    toggleRecording,
  } = useMeetingSignals(roomId, isHost, hostUserId, displayName);

  const [chatOpen, setChatOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [reactionsOpen, setReactionsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [recordingDuration, setRecordingDuration] = useState("");
  const [settings, setSettings] = useState<MeetingSettings>({
    layout: MEETING_LAYOUTS.GRID,
    noiseSuppression: true,
    highQualityVideo: true,
    darkTheme: true,
  });
  const participantId = useMemo(() => uuidv4(), []);
  const joinUrl = useMemo(() => getMeetingJoinUrl(roomId), [roomId]);
  const hostIdentity = useMemo(() => getHostIdentity(hostUserId), [hostUserId]);
  const { phase: reconnectPhase, isReconnecting } = useMeetingReconnect(connectionState);

  const stageParticipants = useMemo(() => {
    const remotes = participants.filter((p) => !p.isLocal);
    return localParticipant ? [...remotes, localParticipant] : participants;
  }, [participants, localParticipant]);

  useEffect(() => {
    if (!isRecording || !recordingStartedAt) {
      setRecordingDuration("");
      return;
    }
    const tick = () => {
      const secs = Math.floor((Date.now() - recordingStartedAt) / 1000);
      const m = Math.floor(secs / 60)
        .toString()
        .padStart(2, "0");
      const s = (secs % 60).toString().padStart(2, "0");
      setRecordingDuration(`${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isRecording, recordingStartedAt]);

  useEffect(() => {
    if (!room) return;
    presence(roomId, "join", {
      participantId,
      userId: hostUserId || undefined,
      name: displayName,
    }).catch(() => {});

    const onEnded = (payload: Uint8Array) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload));
        if (data?.type === "meeting-ended") {
          room.disconnect();
          router.replace("/(tabs)");
        }
      } catch {
        // ignore
      }
    };
    room.on(RoomEvent.DataReceived, onEnded);
    return () => {
      presence(roomId, "leave", { participantId, name: displayName }).catch(() => {});
      room.off(RoomEvent.DataReceived, onEnded);
    };
  }, [room, roomId, participantId, displayName, hostUserId, router]);

  const closePanels = useCallback(() => {
    setReactionsOpen(false);
    setMoreOpen(false);
  }, []);

  const toggleReactions = useCallback(() => {
    setReactionsOpen((v) => {
      if (!v) setMoreOpen(false);
      return !v;
    });
  }, []);

  const toggleMore = useCallback(() => {
    setMoreOpen((v) => {
      if (!v) setReactionsOpen(false);
      return !v;
    });
  }, []);

  const toggleMic = async () => {
    const next = !localParticipant.isMicrophoneEnabled;
    await localParticipant.setMicrophoneEnabled(next);
    void setMicrophoneMute(!next);
  };

  const toggleCam = async () => {
    await localParticipant.setCameraEnabled(!localParticipant.isCameraEnabled);
  };

  const flipCamera = async () => {
    const pub = localParticipant.getTrackPublication(Track.Source.Camera);
    if (pub?.videoTrack) {
      // @ts-expect-error switchCamera on native track
      await pub.videoTrack.switchCamera?.();
    }
    closePanels();
  };

  const handleLeave = async () => {
    await room?.disconnect();
    await endNativeCallUI(callUUID);
    onLeave();
    router.replace("/(tabs)");
  };

  const handleEnd = async () => {
    if (isHost && hostKey) {
      await endMeeting(roomId, hostKey, hostUserId).catch(() => {});
    }
    await handleLeave();
  };

  const openChat = () => {
    closePanels();
    setChatOpen(true);
  };

  const openParticipants = () => {
    closePanels();
    setParticipantsOpen(true);
  };

  const openLayoutSettings = () => {
    closePanels();
    setSettingsOpen(true);
  };

  const openShare = () => {
    closePanels();
    setShareOpen(true);
  };

  const openAI = () => {
    closePanels();
    setAiOpen(true);
  };

  const toggleLayout = useCallback(() => {
    setSettings((s) => ({
      ...s,
      layout: s.layout === MEETING_LAYOUTS.GRID ? MEETING_LAYOUTS.SPEAKER : MEETING_LAYOUTS.GRID,
    }));
    setMoreOpen(false);
  }, []);

  const connected = connectionState === ConnectionState.Connected;
  const reconnecting = isReconnecting;

  const advancedControls: AdvancedControl[] = [
    ...(isHost
      ? [
          {
            id: "record",
            icon: isRecording ? ("stop-circle" as const) : ("radio-button-on" as const),
            label: isRecording ? "Stop" : "Record",
            active: isRecording,
            recording: true,
            disabled: recordingBusy,
            onPress: toggleRecording,
          },
        ]
      : []),
    {
      id: "hand",
      icon: "hand-left",
      label: handRaised ? "Lower" : "Raise",
      highlight: handRaised,
      active: !handRaised,
      onPress: toggleRaiseHand,
    },
    {
      id: "people",
      icon: "people",
      label: "People",
      onPress: openParticipants,
    },
    {
      id: "chat",
      icon: "chatbubble-ellipses",
      label: "Chat",
      onPress: openChat,
    },
    {
      id: "layout",
      icon: settings.layout === MEETING_LAYOUTS.SPEAKER ? "grid-outline" : "person-outline",
      label: settings.layout === MEETING_LAYOUTS.SPEAKER ? "Grid view" : "Speaker",
      highlight: settings.layout === MEETING_LAYOUTS.SPEAKER,
      onPress: toggleLayout,
    },
    {
      id: "settings",
      icon: "settings-outline",
      label: "Settings",
      onPress: openLayoutSettings,
    },
    {
      id: "share",
      icon: "link-outline",
      label: "Invite",
      onPress: openShare,
    },
    {
      id: "flip",
      icon: "camera-reverse",
      label: "Flip",
      onPress: flipCamera,
    },
    {
      id: "screen",
      icon: "desktop-outline",
      label: "Share",
      disabled: true,
      onPress: () => Alert.alert("Screen share", "Screen sharing is coming soon on mobile."),
    },
    {
      id: "noise",
      icon: settings.noiseSuppression ? "volume-high" : "volume-mute",
      label: "Noise",
      active: settings.noiseSuppression,
      onPress: () => setSettings((s) => ({ ...s, noiseSuppression: !s.noiseSuppression })),
    },
    {
      id: "ai",
      icon: "sparkles",
      label: "AI",
      onPress: openAI,
    },
    {
      id: "captions",
      icon: "text-outline",
      label: "Captions",
      disabled: true,
      onPress: () => Alert.alert("Live captions", "Captions and transcript are coming soon."),
    },
    ...(isHost
      ? [
          {
            id: "end",
            icon: "close-circle" as const,
            label: "End all",
            danger: true,
            onPress: handleEnd,
          },
        ]
      : []),
  ];

  const stageTop = insets.top + 72;
  const stageBottom = insets.bottom + 108;

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#09090b", "#0f0a1a", "#09090b"]} style={StyleSheet.absoluteFill} />
      <MeetingReconnectOverlay phase={reconnectPhase} />

      <View style={[styles.stage, { paddingTop: stageTop, paddingBottom: stageBottom }]}>
        <ParticipantStage
          key={settings.layout}
          participants={stageParticipants}
          layout={settings.layout}
          isHandRaised={isHandRaised}
          hostIdentity={hostIdentity}
          localIsHost={isHost}
        />
      </View>

      <MeetingTopBar
        roomLabel={`Meeting · ${roomId.slice(0, 8)}`}
        timer={timer}
        participantCount={participants.length}
        connected={connected}
        reconnecting={reconnecting}
        connectionQuality={localParticipant.connectionQuality}
        recording={isRecording}
        recordingDuration={recordingDuration}
        onShare={openShare}
        onSettings={openLayoutSettings}
      />

      <ReactionOverlay bubbles={bubbles} />

      <MeetingControlDock
        micOn={localParticipant.isMicrophoneEnabled}
        camOn={localParticipant.isCameraEnabled}
        reactionsOpen={reactionsOpen}
        moreOpen={moreOpen}
        onToggleMic={toggleMic}
        onToggleCam={toggleCam}
        onToggleReactions={toggleReactions}
        onToggleMore={toggleMore}
        onLeave={handleLeave}
        reactions={REACTION_EMOJIS}
        onReaction={sendReaction}
        advancedControls={advancedControls}
      />

      <ChatDrawer
        visible={chatOpen}
        messages={messages}
        input={chatInput}
        onChangeInput={setChatInput}
        onSend={() => {
          sendMessage(chatInput);
          setChatInput("");
        }}
        onClose={() => setChatOpen(false)}
      />

      <ParticipantsDrawer
        visible={participantsOpen}
        participants={participants}
        raisedHands={Object.fromEntries(
          participants.map((p) => [p.identity, isHandRaised(p.identity)])
        )}
        hostUserId={hostUserId}
        localIsHost={isHost}
        onClose={() => setParticipantsOpen(false)}
      />

      <MeetingSettingsDrawer
        visible={settingsOpen}
        settings={settings}
        onChange={(patch) => setSettings((s) => ({ ...s, ...patch }))}
        onClose={() => setSettingsOpen(false)}
      />

      <MeetingShareSheet visible={shareOpen} joinUrl={joinUrl} roomId={roomId} onClose={() => setShareOpen(false)} />

      <MeetingAIPanel visible={aiOpen} onClose={() => setAiOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#09090b" },
  stage: { flex: 1, paddingHorizontal: 12, justifyContent: "center" },
});
