import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { ScheduledMeeting } from "../../services/meetings";

type Props = {
  item: ScheduledMeeting;
  onPress: () => void;
};

function formatWhen(item: ScheduledMeeting) {
  const date = item.startAt ? new Date(item.startAt) : item.createdAt ? new Date(item.createdAt) : null;
  if (!date || Number.isNaN(date.getTime())) return "Time TBD";
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusStyle(status?: string) {
  if (status === "active") return styles.statusActive;
  if (status === "ended") return styles.statusEnded;
  return styles.statusScheduled;
}

export function ScheduledMeetingCard({ item, onPress }: Props) {
  const shortId = item.roomId.slice(0, 8).toUpperCase();
  const status = item.status || "scheduled";

  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <LinearGradient colors={["rgba(255,255,255,0.07)", "rgba(255,255,255,0.02)"]} style={styles.card}>
        <View style={styles.top}>
          <View style={styles.iconWrap}>
            <Ionicons name="calendar-outline" size={18} color="#7dd3fc" />
          </View>
          <View style={[styles.statusPill, statusStyle(status)]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>

        <Text style={styles.title}>Scheduled · {shortId}</Text>
        <Text style={styles.meta}>{formatWhen(item)}</Text>
        {item.recurrence && item.recurrence !== "none" ? (
          <Text style={styles.recurrence}>Repeats {item.recurrence}</Text>
        ) : null}

        <View style={styles.footer}>
          <Text style={styles.code}>{shortId}</Text>
          <View style={styles.joinBtn}>
            <Text style={styles.joinText}>Open</Text>
            <Ionicons name="arrow-forward" size={14} color="#7dd3fc" />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export function EmptyScheduledState({ onSchedule }: { onSchedule?: () => void }) {
  return (
    <View style={styles.empty}>
      <Ionicons name="calendar-outline" size={40} color="#38bdf8" />
      <Text style={styles.emptyTitle}>No scheduled meetings</Text>
      <Text style={styles.emptySub}>Schedule a meeting and it will appear here with its start time.</Text>
      {onSchedule ? (
        <Pressable onPress={onSchedule} style={styles.emptyBtn}>
          <Text style={styles.emptyBtnText}>Schedule meeting</Text>
        </Pressable>
      ) : null}
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
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(56,189,248,0.12)",
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.2)",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusScheduled: {
    backgroundColor: "rgba(56,189,248,0.12)",
    borderColor: "rgba(56,189,248,0.25)",
  },
  statusActive: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderColor: "rgba(34,197,94,0.25)",
  },
  statusEnded: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  statusText: { fontSize: 10, color: "#e4e4e7", fontWeight: "700", textTransform: "capitalize" },
  title: { fontSize: 16, fontWeight: "600", color: "#fafafa", marginTop: 12 },
  meta: { fontSize: 13, color: "#a1a1aa", marginTop: 4 },
  recurrence: { fontSize: 11, color: "#71717a", marginTop: 2, textTransform: "capitalize" },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
  code: { fontSize: 12, fontWeight: "700", color: "#71717a", letterSpacing: 1 },
  joinBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  joinText: { fontSize: 13, fontWeight: "600", color: "#7dd3fc" },
  empty: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#fff", marginTop: 12 },
  emptySub: { fontSize: 13, color: "#71717a", textAlign: "center", marginTop: 6, lineHeight: 19 },
  emptyBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#0ea5e9",
  },
  emptyBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
