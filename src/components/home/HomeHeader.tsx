import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { UserProfile } from "../../store/authStore";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDayTime() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

type Props = {
  user: UserProfile | null;
  onNotifications?: () => void;
  onSettings?: () => void;
};

export function HomeHeader({ user, onNotifications, onSettings }: Props) {
  const firstName = user?.name?.split(" ")[0] || "there";
  const initials = (user?.name || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.03)"]}
        style={styles.glass}
      >
        <View style={styles.row}>
          <View style={styles.avatarWrap}>
            {user?.image ? (
              <Image source={{ uri: user.image }} style={styles.avatarImg} />
            ) : (
              <LinearGradient colors={["#6366f1", "#8b5cf6"]} style={styles.avatarFallback}>
                <Text style={styles.initials}>{initials}</Text>
              </LinearGradient>
            )}
            <View style={styles.onlineDot} />
          </View>

          <View style={styles.textCol}>
            <Text style={styles.day}>{formatDayTime()}</Text>
            <Text style={styles.greeting}>
              {getGreeting()}, {firstName}
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.iconBtn} onPress={onNotifications}>
              <Ionicons name="notifications-outline" size={20} color="#e4e4e7" />
            </Pressable>
            <Pressable style={styles.iconBtn} onPress={onSettings}>
              <Ionicons name="settings-outline" size={20} color="#e4e4e7" />
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  glass: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 16,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatarWrap: { position: "relative" },
  avatarImg: { width: 48, height: 48, borderRadius: 16 },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: { color: "#fff", fontWeight: "700", fontSize: 16 },
  onlineDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22c55e",
    borderWidth: 2,
    borderColor: "#18181b",
  },
  textCol: { flex: 1 },
  day: { fontSize: 12, color: "#71717a", fontWeight: "500" },
  greeting: { fontSize: 20, fontWeight: "700", color: "#fafafa", marginTop: 2, letterSpacing: -0.3 },
  actions: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
});
