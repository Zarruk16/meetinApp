import { View, Text, StyleSheet } from "react-native";

type Bubble = { id: string; emoji: string };

export function ReactionOverlay({ bubbles }: { bubbles: Bubble[] }) {
  if (!bubbles.length) return null;

  return (
    <View style={styles.wrap} pointerEvents="none">
      {bubbles.map((b, i) => (
        <Text key={b.id} style={[styles.emoji, { marginLeft: ((i * 17) % 5) * 12 - 24 }]}>
          {b.emoji}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 130,
    alignItems: "center",
    zIndex: 25,
    height: 120,
    justifyContent: "flex-end",
  },
  emoji: {
    fontSize: 42,
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
});
