import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export function MeetingAIBanner({ topOffset = 72 }: { topOffset?: number }) {
  return (
    <View style={[styles.wrap, { top: topOffset }]}>
      <LinearGradient colors={["rgba(99,102,241,0.2)", "rgba(99,102,241,0.05)"]} style={styles.card}>
        <Ionicons name="sparkles" size={14} color="#c4b5fd" />
        <Text style={styles.text}>AI Summary · Live Transcript · Smart Notes</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 12, right: 12, zIndex: 15 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.25)",
  },
  text: { fontSize: 11, fontWeight: "600", color: "#c4b5fd", flex: 1 },
});
