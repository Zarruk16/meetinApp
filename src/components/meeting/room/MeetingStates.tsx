import { View, Text, ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { PremiumBackground } from "../../ui/PremiumBackground";

export function MeetingConnectingState({ message = "Connecting to meeting…" }: { message?: string }) {
  return (
    <View style={styles.root}>
      <PremiumBackground />
      <ActivityIndicator size="large" color="#8b5cf6" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

export function MeetingErrorState({ error, onBack }: { error: string; onBack: () => void }) {
  return (
    <View style={styles.root}>
      <PremiumBackground />
      <LinearGradient colors={["rgba(239,68,68,0.15)", "transparent"]} style={styles.errorGlow} />
      <Text style={styles.errorTitle}>Connection failed</Text>
      <Text style={styles.errorText}>{error}</Text>
      <Pressable onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backBtnText}>Go back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#09090b", alignItems: "center", justifyContent: "center", padding: 24 },
  text: { color: "#a1a1aa", marginTop: 16, fontSize: 15 },
  errorGlow: { ...StyleSheet.absoluteFill },
  errorTitle: { fontSize: 20, fontWeight: "700", color: "#fca5a5" },
  errorText: { color: "#a1a1aa", textAlign: "center", marginTop: 8, lineHeight: 22 },
  backBtn: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  backBtnText: { color: "#c4b5fd", fontWeight: "600" },
});
