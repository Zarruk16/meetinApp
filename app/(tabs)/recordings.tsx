import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { PremiumBackground } from "../../src/components/ui/PremiumBackground";

export default function RecordingsScreen() {
  return (
    <View style={styles.root}>
      <PremiumBackground />
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Recordings</Text>
        <Text style={styles.sub}>Cloud recordings from your meetings</Text>

        <View style={styles.empty}>
          <LinearGradient colors={["rgba(99,102,241,0.15)", "transparent"]} style={StyleSheet.absoluteFill} />
          <Ionicons name="film-outline" size={44} color="#6366f1" />
          <Text style={styles.emptyTitle}>No recordings yet</Text>
          <Text style={styles.emptySub}>
            Recordings from your Blumen Meet sessions will appear here once cloud recording is enabled for your workspace.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#09090b" },
  safe: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: "700", color: "#fff", letterSpacing: -0.5 },
  sub: { fontSize: 14, color: "#71717a", marginTop: 6, marginBottom: 24 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 120,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#fff", marginTop: 16 },
  emptySub: { fontSize: 13, color: "#71717a", textAlign: "center", marginTop: 8, lineHeight: 20 },
});
