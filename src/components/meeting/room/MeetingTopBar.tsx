import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { ConnectionQuality } from "livekit-client";

type Props = {
  roomLabel: string;
  timer: string;
  participantCount: number;
  connected: boolean;
  reconnecting: boolean;
  connectionQuality?: ConnectionQuality;
  recording?: boolean;
  recordingDuration?: string;
  onShare?: () => void;
  onSettings?: () => void;
};

function RecBadge({ duration }: { duration?: string }) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 700, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [pulse]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <View style={styles.rec}>
      <Animated.View style={[styles.recDot, dotStyle]} />
      <Text style={styles.recText}>REC</Text>
      {duration ? <Text style={styles.recTime}>{duration}</Text> : null}
    </View>
  );
}

function qualityLabel(q?: ConnectionQuality) {
  if (q === ConnectionQuality.Excellent) return "Excellent";
  if (q === ConnectionQuality.Good) return "Good";
  if (q === ConnectionQuality.Poor) return "Poor";
  if (q === ConnectionQuality.Lost) return "Lost";
  return "Connecting";
}

function qualityColor(q?: ConnectionQuality) {
  if (q === ConnectionQuality.Excellent || q === ConnectionQuality.Good) return "#22c55e";
  if (q === ConnectionQuality.Poor) return "#fbbf24";
  return "#f87171";
}

export function MeetingTopBar({
  roomLabel,
  timer,
  participantCount,
  connected,
  reconnecting,
  connectionQuality,
  recording,
  recordingDuration,
  onShare,
  onSettings,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 6 }]}>
      <LinearGradient colors={["rgba(0,0,0,0.62)", "rgba(0,0,0,0.28)"]} style={styles.bar}>
        <View style={styles.left}>
          <Text style={styles.room} numberOfLines={1}>
            {roomLabel}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.timer}>{timer}</Text>
            {recording ? <RecBadge duration={recordingDuration} /> : null}
          </View>
        </View>
        <View style={styles.right}>
          {reconnecting ? <Text style={styles.reconnect}>Reconnecting…</Text> : null}
          <View style={styles.pill}>
            <View style={[styles.dot, { backgroundColor: connected ? qualityColor(connectionQuality) : "#fbbf24" }]} />
            <Ionicons name="cellular" size={11} color="#a1a1aa" />
            <Text style={styles.quality}>{qualityLabel(connectionQuality)}</Text>
          </View>
          <View style={styles.pill}>
            <Ionicons name="people" size={12} color="#d4d4d8" />
            <Text style={styles.count}>{participantCount}</Text>
          </View>
          {onShare ? (
            <Pressable style={styles.iconBtn} onPress={onShare} hitSlop={8}>
              <Ionicons name="link-outline" size={18} color="#e4e4e7" />
            </Pressable>
          ) : null}
          {onSettings ? (
            <Pressable style={styles.iconBtn} onPress={onSettings} hitSlop={8}>
              <Ionicons name="settings-outline" size={18} color="#e4e4e7" />
            </Pressable>
          ) : null}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, paddingHorizontal: 14 },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  left: { flex: 1, marginRight: 10 },
  room: { fontSize: 14, fontWeight: "700", color: "#fafafa", letterSpacing: -0.2 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 3 },
  timer: { fontSize: 12, color: "#a1a1aa", fontVariant: ["tabular-nums"] },
  rec: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "rgba(239,68,68,0.22)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.35)",
  },
  recDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#ef4444" },
  recText: { fontSize: 9, fontWeight: "800", color: "#fca5a5", letterSpacing: 0.5 },
  recTime: { fontSize: 9, fontWeight: "600", color: "#fca5a5", fontVariant: ["tabular-nums"] },
  right: { flexDirection: "row", alignItems: "center", gap: 6 },
  reconnect: { fontSize: 10, color: "#fbbf24", fontWeight: "600" },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  quality: { fontSize: 10, fontWeight: "600", color: "#a1a1aa" },
  count: { fontSize: 11, fontWeight: "600", color: "#d4d4d8" },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
});
