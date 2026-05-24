import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import type { ReconnectPhase } from "../../../hooks/useMeetingReconnect";

type Props = {
  phase: ReconnectPhase;
};

export function MeetingReconnectOverlay({ phase }: Props) {
  if (phase === "idle" || phase === "recovered") return null;

  const label =
    phase === "offline"
      ? "No network — reconnecting when online…"
      : "Reconnecting to meeting…";

  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={styles.card}>
        <ActivityIndicator color="#a78bfa" />
        <Text style={styles.text}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    zIndex: 50,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(24,24,27,0.95)",
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.35)",
  },
  text: { color: "#e9d5ff", fontSize: 14, fontWeight: "600" },
});
