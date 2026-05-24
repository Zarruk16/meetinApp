import { useMemo } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

const { width, height } = Dimensions.get("window");
const COUNT = 28;

type Particle = { id: number; x: number; y: number; size: number; delay: number; duration: number };

function ParticleDot({ p }: { p: Particle }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      p.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: p.duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: p.duration, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
  }, [p, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.15 + progress.value * 0.55,
    transform: [
      { translateY: -progress.value * 18 },
      { scale: 0.6 + progress.value * 0.5 },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        { left: p.x, top: p.y, width: p.size, height: p.size, borderRadius: p.size / 2 },
        style,
      ]}
    />
  );
}

export function ParticleField() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: COUNT }, (_, id) => ({
      id,
      x: Math.random() * width,
      y: Math.random() * height,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 2000,
      duration: 2200 + Math.random() * 2800,
    }));
  }, []);

  return (
    <>
      {particles.map((p) => (
        <ParticleDot key={p.id} p={p} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
    backgroundColor: "rgba(199, 210, 254, 0.9)",
  },
});
