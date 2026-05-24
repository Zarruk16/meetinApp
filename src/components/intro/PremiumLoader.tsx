import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

const BAR_COUNT = 5;

function WaveBar({ index, active }: { index: number; active: SharedValue<number> }) {
  const h = useSharedValue(0.35);

  useEffect(() => {
    h.value = withDelay(
      index * 90,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 380, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.3, { duration: 380, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
  }, [h, index]);

  const style = useAnimatedStyle(() => ({
    height: 8 + h.value * 20,
    opacity: 0.35 + active.value * 0.65,
  }));

  return <Animated.View style={[styles.bar, style]} />;
}

type Props = { opacity: SharedValue<number> };

export function PremiumLoader({ opacity }: Props) {
  const active = useSharedValue(0);

  useEffect(() => {
    active.value = withDelay(200, withTiming(1, { duration: 500 }));
  }, [active]);

  const wrap = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.wrap, wrap]}>
      <View style={styles.waveRow}>
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <WaveBar key={i} index={i} active={active} />
        ))}
      </View>
      <View style={styles.glowLine}>
        <View style={styles.glowLineInner} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: 16,
    marginTop: 40,
  },
  waveRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: 32,
  },
  bar: {
    width: 4,
    borderRadius: 4,
    backgroundColor: "#a78bfa",
  },
  glowLine: {
    width: 120,
    height: 2,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  glowLineInner: {
    flex: 1,
    backgroundColor: "#8b5cf6",
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
});
