import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { PremiumBackground } from "../../src/components/ui/PremiumBackground";
import { useAuthStore } from "../../src/store/authStore";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, clearSession } = useAuthStore();

  const signOut = async () => {
    await clearSession();
    router.replace("/(auth)/login");
  };

  const initials = (user?.name || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.root}>
      <PremiumBackground />
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Profile</Text>

        <LinearGradient colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.03)"]} style={styles.card}>
          <LinearGradient colors={["#6366f1", "#8b5cf6"]} style={styles.avatar}>
            <Text style={styles.initials}>{initials}</Text>
          </LinearGradient>
          <Text style={styles.name}>{user?.name || "Guest"}</Text>
          <Text style={styles.email}>{user?.email || "Not signed in"}</Text>
          <View style={styles.rolePill}>
            <Text style={styles.role}>{user?.role?.replace("_", " ") || "—"}</Text>
          </View>
        </LinearGradient>

        <Pressable onPress={signOut} style={styles.signOut}>
          <Ionicons name="log-out-outline" size={18} color="#fca5a5" />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#09090b" },
  safe: { flex: 1, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120 },
  title: { fontSize: 28, fontWeight: "700", color: "#fff", letterSpacing: -0.5, marginBottom: 20 },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 24,
    alignItems: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: { color: "#fff", fontSize: 24, fontWeight: "700" },
  name: { fontSize: 22, fontWeight: "700", color: "#fff", marginTop: 16 },
  email: { fontSize: 14, color: "#a1a1aa", marginTop: 4 },
  rolePill: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(139,92,246,0.15)",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.3)",
  },
  role: { fontSize: 11, fontWeight: "600", color: "#c4b5fd", textTransform: "capitalize" },
  signOut: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(239,68,68,0.12)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.25)",
  },
  signOutText: { color: "#fca5a5", fontWeight: "600", fontSize: 15 },
});
