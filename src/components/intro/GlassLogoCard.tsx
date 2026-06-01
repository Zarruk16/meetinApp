import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, type SharedValue } from "react-native-reanimated";
import { BrandMark } from "../brand/BrandMark";

type Props = {
  scale: SharedValue<number>;
  opacity: SharedValue<number>;
  glow: SharedValue<number>;
};

export function GlassLogoCard({ scale, opacity, glow }: Props) {
  const card = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const halo = useAnimatedStyle(() => ({
    opacity: 0.25 + glow.value * 0.45,
    transform: [{ scale: 1 + glow.value * 0.12 }],
  }));

  return (
    <Animated.View style={[styles.wrap, card]}>
      <Animated.View style={[styles.halo, halo]} />
      <View style={styles.glass}>
        <View style={styles.innerGlow} />
        <BrandMark size={76} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  halo: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#8b5cf6",
  },
  glass: {
    width: 120,
    height: 120,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    overflow: "hidden",
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(139, 92, 246, 0.12)",
  },
});
