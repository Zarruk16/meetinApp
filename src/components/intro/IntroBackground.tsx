import { StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { premiumEasing } from "../../animations/easing";
import { ParticleField } from "./ParticleField";

const { width, height } = Dimensions.get("window");

function GlowOrb({
  style,
  duration,
  delay = 0,
}: {
  style: object;
  duration: number;
  delay?: number;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [t, duration]);

  const anim = useAnimatedStyle(() => ({
    transform: [
      { translateX: (t.value - 0.5) * 28 },
      { translateY: (t.value - 0.5) * -22 },
      { scale: 0.92 + t.value * 0.16 },
    ],
    opacity: 0.28 + t.value * 0.22,
  }));

  return <Animated.View style={[styles.orb, style, anim]} />;
}

import type { SharedValue } from "react-native-reanimated";

type Props = { bgOpacity: SharedValue<number> };

export function IntroBackground({ bgOpacity }: Props) {
  const wrap = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  useEffect(() => {
    bgOpacity.value = withTiming(1, { duration: 800, easing: premiumEasing.cinematic });
  }, [bgOpacity]);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, wrap]}>
      <LinearGradient
        colors={["#030712", "#09090b", "#0f0a1e", "#020617", "#09090b"]}
        locations={[0, 0.25, 0.55, 0.8, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={["transparent", "rgba(79,70,229,0.08)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <GlowOrb style={styles.orbViolet} duration={5200} />
      <GlowOrb style={styles.orbBlue} duration={6400} delay={200} />
      <GlowOrb style={styles.orbIndigo} duration={4800} />
      <ParticleField />
      <LinearGradient
        colors={["transparent", "rgba(9,9,11,0.6)", "#09090b"]}
        style={styles.vignetteBottom}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: "absolute",
    borderRadius: 9999,
  },
  orbViolet: {
    width: width * 0.85,
    height: width * 0.85,
    top: -width * 0.28,
    right: -width * 0.22,
    backgroundColor: "#7c3aed",
  },
  orbBlue: {
    width: width * 0.65,
    height: width * 0.65,
    bottom: height * 0.12,
    left: -width * 0.28,
    backgroundColor: "#2563eb",
  },
  orbIndigo: {
    width: width * 0.45,
    height: width * 0.45,
    top: height * 0.38,
    left: width * 0.55,
    backgroundColor: "#4f46e5",
  },
  vignetteBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.35,
  },
});
