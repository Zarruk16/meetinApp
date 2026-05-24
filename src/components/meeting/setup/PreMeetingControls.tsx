import { View, Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type Control = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  danger?: boolean;
  onPress: () => void;
};

export function PreMeetingControls({ controls }: { controls: Control[] }) {
  return (
    <LinearGradient colors={["rgba(24,24,27,0.95)", "rgba(9,9,11,0.98)"]} style={styles.dock}>
      <View style={styles.row}>
        {controls.map((c) => (
          <ControlButton key={c.id} {...c} />
        ))}
      </View>
    </LinearGradient>
  );
}

function ControlButton({ icon, label, active = true, danger, onPress }: Control) {
  const inactive = !active;
  const bg = danger && inactive ? "rgba(239,68,68,0.25)" : inactive ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.1)";

  return (
    <Pressable style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]} onPress={onPress}>
      <View style={[styles.iconWrap, { backgroundColor: bg }, active && !danger && styles.iconActive]}>
        <Ionicons name={icon} size={22} color={inactive && !danger ? "#f87171" : "#fff"} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dock: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  row: { flexDirection: "row", justifyContent: "space-around", alignItems: "center" },
  btn: { alignItems: "center", gap: 6, minWidth: 56 },
  btnPressed: { opacity: 0.75 },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  iconActive: {
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  label: { fontSize: 10, fontWeight: "600", color: "#a1a1aa" },
});
