import { useMemo } from "react";
import { View, Text, Modal, Pressable, FlatList, StyleSheet, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Participant } from "livekit-client";
import {
  getHostIdentity,
  getParticipantDisplayName,
  getParticipantRole,
  getRoleLabel,
  type ParticipantRole,
} from "../../../meeting/participantUtils";

type Props = {
  visible: boolean;
  participants: Participant[];
  raisedHands?: Record<string, boolean>;
  hostUserId?: string;
  localIsHost?: boolean;
  onClose: () => void;
};

const ROW_HEIGHT = 66;
const SHEET_HEADER_HEIGHT = 108;

function sortParticipants(
  participants: Participant[],
  hostIdentity?: string,
  localIsHost?: boolean
) {
  const roleOrder: Record<ParticipantRole, number> = { host: 0, you: 1, guest: 2 };
  return [...participants].sort((a, b) => {
    const ra = getParticipantRole(a, { hostIdentity, localIsHost });
    const rb = getParticipantRole(b, { hostIdentity, localIsHost });
    if (roleOrder[ra] !== roleOrder[rb]) return roleOrder[ra] - roleOrder[rb];
    return getParticipantDisplayName(a).localeCompare(getParticipantDisplayName(b));
  });
}

export function ParticipantsDrawer({
  visible,
  participants,
  raisedHands = {},
  hostUserId,
  localIsHost = false,
  onClose,
}: Props) {
  const hostIdentity = getHostIdentity(hostUserId);
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const sorted = useMemo(
    () => sortParticipants(participants, hostIdentity, localIsHost),
    [participants, hostIdentity, localIsHost]
  );

  const summary = useMemo(() => {
    let hosts = 0;
    let guests = 0;
    for (const p of participants) {
      const role = getParticipantRole(p, { hostIdentity, localIsHost });
      if (role === "host") hosts += 1;
      else guests += 1;
    }
    const parts: string[] = [];
    if (hosts) parts.push(`${hosts} host${hosts > 1 ? "s" : ""}`);
    if (guests) parts.push(`${guests} guest${guests > 1 ? "s" : ""}`);
    return parts.join(" · ") || `${participants.length} in call`;
  }, [participants, hostIdentity, localIsHost]);

  const sheetMaxHeight = windowHeight * 0.75;
  const listContentHeight = sorted.length * ROW_HEIGHT;
  const listMaxHeight = Math.min(
    listContentHeight,
    sheetMaxHeight - SHEET_HEADER_HEIGHT - insets.bottom
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={[styles.sheetWrap, { maxHeight: sheetMaxHeight }]}>
          <Pressable style={styles.sheetPressable} onPress={(e) => e.stopPropagation()}>
            <LinearGradient
              colors={["#18181b", "#09090b"]}
              style={[styles.sheet, { paddingBottom: 24 + insets.bottom }]}
            >
              <View style={styles.handle} />
              <View style={styles.header}>
                <View>
                  <Text style={styles.title}>In this meeting ({participants.length})</Text>
                  <Text style={styles.subtitle}>{summary}</Text>
                </View>
                <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color="#a1a1aa" />
                </Pressable>
              </View>
              <FlatList
                data={sorted}
                keyExtractor={(p) => p.identity}
                style={{ maxHeight: listMaxHeight }}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: p }) => {
                  const name = getParticipantDisplayName(p);
                  const role = getParticipantRole(p, { hostIdentity, localIsHost });
                  const micOff = !p.isMicrophoneEnabled;
                  const camOff = !p.isCameraEnabled;
                  const raised = !!raisedHands[p.identity];
                  const initial = name.charAt(0).toUpperCase();

                  return (
                    <View style={styles.row}>
                      <View style={styles.avatar}>
                        <Text style={styles.initials}>{initial}</Text>
                        {raised ? <Text style={styles.handOnAvatar}>✋</Text> : null}
                      </View>
                      <View style={styles.info}>
                        <View style={styles.nameRow}>
                          <Text style={styles.name} numberOfLines={1}>
                            {name}
                          </Text>
                          <View style={[styles.roleChip, role === "host" && styles.roleChipHost]}>
                            <Text style={styles.roleChipText}>{getRoleLabel(role)}</Text>
                          </View>
                        </View>
                        <View style={styles.statusRow}>
                          {raised ? (
                            <Text style={styles.raised}>Hand raised</Text>
                          ) : p.isSpeaking ? (
                            <View style={styles.speaking}>
                              <View style={styles.speakDot} />
                              <Text style={styles.speakingText}>Speaking</Text>
                            </View>
                          ) : (
                            <Text style={styles.idle}>{camOff ? "Camera off" : "Connected"}</Text>
                          )}
                        </View>
                      </View>
                      <View style={styles.icons}>
                        <Ionicons
                          name={camOff ? "videocam-off" : "videocam"}
                          size={16}
                          color={camOff ? "#f87171" : "#71717a"}
                        />
                        <Ionicons name={micOff ? "mic-off" : "mic"} size={16} color={micOff ? "#f87171" : "#86efac"} />
                      </View>
                    </View>
                  );
                }}
              />
            </LinearGradient>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  sheetWrap: { width: "100%" },
  sheetPressable: { width: "100%" },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingBottom: 24,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  title: { fontSize: 17, fontWeight: "700", color: "#fff" },
  subtitle: { fontSize: 12, color: "#71717a", marginTop: 4 },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    minHeight: ROW_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#52525b",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
    position: "relative",
  },
  handOnAvatar: { position: "absolute", bottom: -4, right: -6, fontSize: 12 },
  initials: { color: "#fff", fontWeight: "700", fontSize: 15 },
  info: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  name: { fontSize: 15, fontWeight: "600", color: "#fafafa", flexShrink: 1 },
  roleChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  roleChipHost: {
    backgroundColor: "rgba(251,191,36,0.15)",
  },
  roleChipText: { fontSize: 10, fontWeight: "700", color: "#d4d4d8", textTransform: "uppercase" },
  statusRow: { marginTop: 3 },
  speaking: { flexDirection: "row", alignItems: "center", gap: 4 },
  speakDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#22c55e" },
  speakingText: { fontSize: 11, color: "#86efac", fontWeight: "600" },
  raised: { fontSize: 11, color: "#fbbf24", fontWeight: "600" },
  idle: { fontSize: 11, color: "#71717a" },
  icons: { flexDirection: "row", gap: 8, alignItems: "center" },
});
