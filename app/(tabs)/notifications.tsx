import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { PremiumBackground } from "../../src/components/ui/PremiumBackground";

export default function NotificationsScreen() {
  return (
    <View style={styles.root}>
      <PremiumBackground />
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.sub}>Meeting invites and reminders</Text>

        <View style={styles.card}>
          <LinearGradient colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]} style={styles.cardInner}>
            <Ionicons name="notifications-off-outline" size={36} color="#6366f1" />
            <Text style={styles.cardTitle}>All caught up</Text>
            <Text style={styles.cardSub}>
              Push alerts for meeting invites will appear here once your device token is registered with the backend.
            </Text>
          </LinearGradient>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#09090b" },
  safe: { flex: 1, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120 },
  title: { fontSize: 28, fontWeight: "700", color: "#fff", letterSpacing: -0.5 },
  sub: { fontSize: 14, color: "#71717a", marginTop: 6, marginBottom: 24 },
  card: { flex: 1, maxHeight: 280 },
  cardInner: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#fff", marginTop: 16 },
  cardSub: { fontSize: 13, color: "#71717a", textAlign: "center", marginTop: 8, lineHeight: 20 },
});
