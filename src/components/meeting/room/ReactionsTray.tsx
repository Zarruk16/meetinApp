import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  visible: boolean;
  reactions: string[];
  onReaction: (emoji: string) => void;
  onClose: () => void;
};

export function ReactionsTray({ visible, reactions, onReaction, onClose }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.wrap}>
      <LinearGradient colors={["rgba(24,24,27,0.95)", "rgba(9,9,11,0.98)"]} style={styles.tray}>
        <Text style={styles.title}>Send a reaction</Text>
        <View style={styles.row}>
          {reactions.map((emoji) => (
            <Pressable
              key={emoji}
              style={({ pressed }) => [styles.emojiBtn, pressed && styles.emojiBtnPressed]}
              onPress={() => {
                onReaction(emoji);
                onClose();
              }}
            >
              <Text style={styles.emoji}>{emoji}</Text>
            </Pressable>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

export function DockBackdrop({ visible, onPress }: { visible: boolean; onPress: () => void }) {
  if (!visible) return null;
  return (
    <View style={styles.backdropWrap}>
      <Pressable style={styles.backdrop} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  backdropWrap: { ...StyleSheet.absoluteFillObject, zIndex: 28 },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  wrap: { position: "absolute", left: 16, right: 16, bottom: 108, zIndex: 29 },
  tray: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  title: { fontSize: 12, fontWeight: "600", color: "#71717a", textAlign: "center", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "center", gap: 10, flexWrap: "wrap" },
  emojiBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  emojiBtnPressed: { opacity: 0.7 },
  emoji: { fontSize: 24 },
});
