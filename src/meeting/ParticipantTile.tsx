import { View, Text, StyleSheet } from "react-native";
import { VideoTrack, isTrackReference, useParticipantTracks } from "@livekit/react-native";
import { Track, type Participant, ConnectionQuality } from "livekit-client";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  getParticipantDisplayName,
  getParticipantRole,
  getRoleLabel,
  type ParticipantRole,
} from "./participantUtils";

export function ParticipantTile({
  participant,
  large = false,
  handRaised = false,
  hostIdentity,
  localIsHost = false,
}: {
  participant: Participant;
  large?: boolean;
  handRaised?: boolean;
  hostIdentity?: string;
  localIsHost?: boolean;
}) {
  const tracks = useParticipantTracks([Track.Source.Camera], participant.identity);
  const videoTrack = tracks.find(isTrackReference);
  const hasVideo = !!videoTrack && participant.isCameraEnabled;
  const isSpeaking = participant.isSpeaking;
  const micOff = !participant.isMicrophoneEnabled;
  const camOff = !participant.isCameraEnabled;

  const role = getParticipantRole(participant, { hostIdentity, localIsHost });
  const name = getParticipantDisplayName(participant);
  const initial = name.charAt(0).toUpperCase();

  const qualityIcon =
    participant.connectionQuality === ConnectionQuality.Excellent ||
    participant.connectionQuality === ConnectionQuality.Good
      ? "cellular"
      : participant.connectionQuality === ConnectionQuality.Lost
        ? "cellular-outline"
        : "cellular-outline";

  const qualityColor =
    participant.connectionQuality === ConnectionQuality.Excellent ||
    participant.connectionQuality === ConnectionQuality.Good
      ? "#86efac"
      : participant.connectionQuality === ConnectionQuality.Poor
        ? "#fbbf24"
        : "#f87171";

  return (
    <View style={[styles.outer, isSpeaking && styles.outerSpeaking]}>
      <View style={[styles.wrap, large ? styles.large : styles.small]}>
        {hasVideo ? (
          <VideoTrack trackRef={videoTrack!} style={StyleSheet.absoluteFill} />
        ) : (
          <View style={styles.noVideo}>
            <View style={[styles.avatar, large && styles.avatarLg]}>
              <Text style={[styles.initial, large && styles.initialLg]}>{initial}</Text>
            </View>
          </View>
        )}

        <View style={styles.topBadges}>
          <RolePill role={role} />
          {handRaised ? (
            <View style={styles.handBadge}>
              <Text style={styles.handEmoji}>✋</Text>
            </View>
          ) : null}
        </View>

        <LinearGradient colors={["transparent", "rgba(0,0,0,0.88)"]} style={styles.footerGrad} />

        <View style={styles.footer}>
          <View style={styles.nameCol}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            {isSpeaking ? <Text style={styles.speakingLabel}>Speaking</Text> : null}
          </View>
          <View style={styles.badges}>
            <Ionicons name={camOff ? "videocam-off" : "videocam"} size={12} color={camOff ? "#f87171" : "#a1a1aa"} />
            <Ionicons name={micOff ? "mic-off" : "mic"} size={12} color={micOff ? "#f87171" : "#86efac"} />
            <Ionicons name={qualityIcon} size={12} color={qualityColor} />
          </View>
        </View>
      </View>
    </View>
  );
}

function RolePill({ role }: { role: ParticipantRole }) {
  return (
    <View style={[styles.rolePill, role === "host" && styles.roleHost, role === "you" && styles.roleYou]}>
      <Text style={styles.roleText}>{getRoleLabel(role)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "transparent",
    flex: 1,
  },
  outerSpeaking: {
    borderColor: "rgba(56,189,248,0.85)",
    shadowColor: "#38bdf8",
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  wrap: {
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#18181b",
    flex: 1,
  },
  large: { flex: 1, minHeight: 200 },
  small: { width: "100%", height: "100%", minHeight: 120 },
  noVideo: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#18181b",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#52525b",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
  },
  avatarLg: { width: 80, height: 80, borderRadius: 40 },
  initial: { color: "#fff", fontSize: 22, fontWeight: "600" },
  initialLg: { fontSize: 32 },
  topBadges: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    zIndex: 2,
  },
  rolePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  roleHost: {
    backgroundColor: "rgba(251,191,36,0.2)",
    borderColor: "rgba(251,191,36,0.35)",
  },
  roleYou: {
    backgroundColor: "rgba(56,189,248,0.15)",
    borderColor: "rgba(56,189,248,0.3)",
  },
  roleText: { fontSize: 9, fontWeight: "700", color: "#fafafa", textTransform: "uppercase", letterSpacing: 0.5 },
  handBadge: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  handEmoji: { fontSize: 14 },
  footerGrad: { position: "absolute", left: 0, right: 0, bottom: 0, height: 64 },
  footer: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  nameCol: { flex: 1, marginRight: 8 },
  name: { fontSize: 13, fontWeight: "600", color: "#fff" },
  speakingLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#7dd3fc",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  badges: { flexDirection: "row", gap: 6, alignItems: "center" },
});
