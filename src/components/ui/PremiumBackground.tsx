import { StyleSheet, View, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

const { width, height } = Dimensions.get("window");

export function PremiumBackground() {
  const drift = useSharedValue(0);

  useEffect(() => {
    drift.value = withRepeat(
      withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [drift]);

  const orb1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: drift.value * 20 },
      { translateY: drift.value * -14 },
    ],
  }));

  const orb2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: drift.value * -16 },
      { translateY: drift.value * 18 },
    ],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={["#030712", "#09090b", "#0c0a18", "#09090b"]}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.orb, styles.orbViolet, orb1]} />
      <Animated.View style={[styles.orb, styles.orbBlue, orb2]} />
      <LinearGradient
        colors={["transparent", "rgba(9,9,11,0.85)"]}
        style={styles.vignette}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: "absolute",
    borderRadius: 9999,
    opacity: 0.35,
  },
  orbViolet: {
    width: width * 0.75,
    height: width * 0.75,
    top: -width * 0.2,
    right: -width * 0.2,
    backgroundColor: "#6366f1",
  },
  orbBlue: {
    width: width * 0.55,
    height: width * 0.55,
    bottom: height * 0.15,
    left: -width * 0.15,
    backgroundColor: "#2563eb",
  },
  vignette: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.4,
  },
});
