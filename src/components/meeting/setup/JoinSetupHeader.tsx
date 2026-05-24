import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  roomId: string;
  hostName?: string;
  status?: "ready" | "waiting" | "ended";
};

export function JoinSetupHeader({ roomId, hostName, status = "ready" }: Props) {
  const short = roomId ? roomId.slice(0, 8).toUpperCase() : "—";

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.flex}>
          <Text style={styles.label}>Meeting room</Text>
          <Text style={styles.room}>{hostName ? `${hostName}'s meeting` : `Room ${short}`}</Text>
        </View>
        <View style={styles.secure}>
          <Ionicons name="shield-checkmark" size={14} color="#86efac" />
          <Text style={styles.secureText}>Secure</Text>
        </View>
      </View>
      {status === "waiting" ? (
        <Text style={styles.waiting}>Waiting for host to start…</Text>
      ) : null}
    </View>
  );
}

export function JoinAvatarFallback({ name, size = 120 }: { name: string; size?: number }) {
  const initial = (name.trim().charAt(0) || "?").toUpperCase();

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  row: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  flex: { flex: 1 },
  label: { fontSize: 12, color: "#71717a", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 },
  room: { fontSize: 20, fontWeight: "700", color: "#fafafa", marginTop: 4, letterSpacing: -0.3 },
  secure: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(34,197,94,0.12)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.25)",
  },
  secureText: { fontSize: 11, fontWeight: "600", color: "#86efac" },
  waiting: { fontSize: 13, color: "#fbbf24", marginTop: 8 },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#52525b",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
  },
  initials: { color: "#fff", fontWeight: "700" },
});
