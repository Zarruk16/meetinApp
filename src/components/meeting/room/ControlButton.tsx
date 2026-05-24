import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export type ControlButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  danger?: boolean;
  highlight?: boolean;
  recording?: boolean;
  size?: "md" | "lg";
  onPress: () => void;
};

export function ControlButton({
  icon,
  label,
  active = true,
  danger,
  highlight,
  recording,
  size = "md",
  onPress,
}: ControlButtonProps) {
  const muted = active === false;
  const dim = size === "lg" ? 54 : 50;

  return (
    <Pressable style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]} onPress={onPress}>
      {recording && active ? (
        <LinearGradient
          colors={["#b91c1c", "#ef4444"]}
          style={[styles.icon, { width: dim, height: dim, borderRadius: dim / 2 }]}
        >
          <Ionicons name={icon} size={21} color="#fff" />
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.icon,
            { width: dim, height: dim, borderRadius: dim / 2 },
            muted && styles.iconMuted,
            danger && styles.iconDanger,
            highlight && styles.iconHighlight,
            active && !danger && !muted && !highlight && styles.iconActive,
          ]}
        >
          <Ionicons name={icon} size={21} color="#fff" />
        </View>
      )}
      <Text
        style={[styles.label, danger && styles.labelDanger, recording && active && styles.labelRec]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { alignItems: "center", gap: 5, flex: 1, maxWidth: 72 },
  btnPressed: { opacity: 0.75 },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  iconActive: {
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.13)",
  },
  iconMuted: {
    backgroundColor: "rgba(239,68,68,0.22)",
    borderColor: "rgba(239,68,68,0.4)",
  },
  iconDanger: {
    backgroundColor: "rgba(220,38,38,0.92)",
    borderColor: "rgba(248,113,113,0.45)",
  },
  iconHighlight: {
    borderColor: "rgba(56,189,248,0.4)",
    backgroundColor: "rgba(56,189,248,0.12)",
  },
  label: { fontSize: 10, fontWeight: "600", color: "#71717a", textAlign: "center" },
  labelDanger: { color: "#fca5a5" },
  labelRec: { color: "#fca5a5" },
});
