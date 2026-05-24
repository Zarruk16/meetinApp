import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

function FloatingAvatar({ label, color, delay, x, y }: { label: string; color: string; delay: number; x: number; y: number }) {
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
  }, [float, delay]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value * -8 }],
    opacity: 0.85 + float.value * 0.15,
  }));

  return (
    <Animated.View style={[styles.avatar, { left: x, top: y, backgroundColor: color }, style]}>
      <Text style={styles.avatarText}>{label}</Text>
    </Animated.View>
  );
}

export function MeetingHero() {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [pulse]);

  const liveGlow = useAnimatedStyle(() => ({
    opacity: 0.4 + pulse.value * 0.5,
  }));

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={["rgba(99,102,241,0.25)", "rgba(37,99,235,0.12)", "rgba(9,9,11,0.4)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.badges}>
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={12} color="#c4b5fd" />
            <Text style={styles.aiText}>AI-powered meetings</Text>
          </View>
          <Animated.View style={[styles.liveBadge, liveGlow]}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live ready</Text>
          </Animated.View>
        </View>

        <Text style={styles.title}>Your meeting hub</Text>
        <Text style={styles.subtitle}>
          HD video, cloud recording, and smart summaries — all in one place.
        </Text>

        <View style={styles.stage}>
          <View style={styles.preview}>
            <LinearGradient
              colors={["#1e1b4b", "#312e81", "#1e3a8a"]}
              style={StyleSheet.absoluteFill}
            />
            <Ionicons name="videocam" size={28} color="rgba(255,255,255,0.7)" />
            <View style={styles.recBadge}>
              <View style={styles.recDot} />
              <Text style={styles.recText}>REC</Text>
            </View>
          </View>
          <FloatingAvatar label="A" color="#6366f1" delay={0} x={8} y={12} />
          <FloatingAvatar label="S" color="#2563eb" delay={400} x={120} y={8} />
          <FloatingAvatar label="M" color="#7c3aed" delay={800} x={64} y={56} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 24 },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 20,
    overflow: "hidden",
  },
  badges: { flexDirection: "row", gap: 8, marginBottom: 14 },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(139,92,246,0.2)",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.35)",
  },
  aiText: { fontSize: 11, fontWeight: "600", color: "#ddd6fe" },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(34,197,94,0.15)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.3)",
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#22c55e" },
  liveText: { fontSize: 11, fontWeight: "600", color: "#86efac" },
  title: { fontSize: 22, fontWeight: "700", color: "#fff", letterSpacing: -0.4 },
  subtitle: { fontSize: 14, color: "#a1a1aa", marginTop: 6, lineHeight: 20, maxWidth: "92%" },
  stage: { marginTop: 18, height: 100, position: "relative" },
  preview: {
    height: 88,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  recBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  recDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#ef4444" },
  recText: { fontSize: 10, fontWeight: "700", color: "#fca5a5" },
  avatar: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 13 },
});
