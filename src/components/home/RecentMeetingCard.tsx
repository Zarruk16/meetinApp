import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { HistoryItem } from "../../services/meetings";

type Props = {
  item: HistoryItem;
  onPress: () => void;
};

export function RecentMeetingCard({ item, onPress }: Props) {
  const shortId = item.roomId.slice(0, 8).toUpperCase();
  const when = new Date(item.joinedAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <LinearGradient
        colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
        style={styles.card}
      >
        <View style={styles.top}>
          <View style={styles.avatarRow}>
            {["#6366f1", "#2563eb", "#7c3aed"].map((c, i) => (
              <View key={i} style={[styles.miniAvatar, { backgroundColor: c, marginLeft: i ? -8 : 0 }]}>
                <Text style={styles.miniText}>{String.fromCharCode(65 + i)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>Recent</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {item.title || `Meeting ${shortId}`}
        </Text>
        <Text style={styles.meta}>{when}</Text>

        <View style={styles.footer}>
          <View style={styles.badgeRow}>
            <View style={styles.aiChip}>
              <Ionicons name="sparkles-outline" size={10} color="#c4b5fd" />
              <Text style={styles.aiChipText}>AI</Text>
            </View>
          </View>
          <View style={styles.joinBtn}>
            <Text style={styles.joinText}>Rejoin</Text>
            <Ionicons name="arrow-forward" size={14} color="#c4b5fd" />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export function EmptyMeetingsState({ onStart }: { onStart: () => void }) {
  return (
    <View style={styles.empty}>
      <LinearGradient colors={["rgba(99,102,241,0.2)", "rgba(9,9,11,0)"]} style={styles.emptyGlow} />
      <Ionicons name="planet-outline" size={40} color="#6366f1" />
      <Text style={styles.emptyTitle}>No meetings yet</Text>
      <Text style={styles.emptySub}>Start your first call and it will appear here instantly.</Text>
      <Pressable onPress={onStart} style={styles.emptyBtn}>
        <Text style={styles.emptyBtnText}>Start a meeting</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  avatarRow: { flexDirection: "row" },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#18181b",
  },
  miniText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  statusText: { fontSize: 10, color: "#a1a1aa", fontWeight: "600" },
  title: { fontSize: 16, fontWeight: "600", color: "#fafafa", marginTop: 12 },
  meta: { fontSize: 12, color: "#71717a", marginTop: 4 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
  badgeRow: { flexDirection: "row", gap: 6 },
  aiChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "rgba(139,92,246,0.15)",
  },
  aiChipText: { fontSize: 10, color: "#c4b5fd", fontWeight: "600" },
  joinBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  joinText: { fontSize: 13, fontWeight: "600", color: "#c4b5fd" },
  empty: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    overflow: "hidden",
  },
  emptyGlow: {
    ...StyleSheet.absoluteFillObject,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#fff", marginTop: 12 },
  emptySub: { fontSize: 13, color: "#71717a", textAlign: "center", marginTop: 6, lineHeight: 19 },
  emptyBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#6366f1",
  },
  emptyBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
