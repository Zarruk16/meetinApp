import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { premiumEasing, introTiming } from "../../animations/easing";
import { IntroBackground } from "../../components/intro/IntroBackground";
import { GlassLogoCard } from "../../components/intro/GlassLogoCard";
import { IntroTypography } from "../../components/intro/IntroTypography";
import { PremiumLoader } from "../../components/intro/PremiumLoader";

type Props = {
  /** Master opacity for cinematic exit (0 = hidden). */
  screenOpacity?: SharedValue<number>;
  screenScale?: SharedValue<number>;
  onSequenceComplete?: () => void;
};

export function IntroScreen({ screenOpacity, screenScale, onSequenceComplete }: Props) {
  const bgOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.72);
  const logoOpacity = useSharedValue(0);
  const logoGlow = useSharedValue(0);
  const brandOpacity = useSharedValue(0);
  const brandY = useSharedValue(24);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(16);
  const loaderOpacity = useSharedValue(0);

  const fallbackOpacity = useSharedValue(1);
  const fallbackScale = useSharedValue(1);
  const localOpacity = screenOpacity ?? fallbackOpacity;
  const localScale = screenScale ?? fallbackScale;

  useEffect(() => {
    const ease = premiumEasing.cinematic;

    bgOpacity.value = withTiming(1, { duration: introTiming.bgFade, easing: ease });

    logoOpacity.value = withDelay(
      280,
      withTiming(1, { duration: introTiming.logoReveal, easing: ease })
    );
    logoScale.value = withDelay(
      280,
      withSequence(
        withTiming(1.06, { duration: introTiming.logoReveal, easing: ease }),
        withTiming(1, { duration: 420, easing: ease })
      )
    );

    logoGlow.value = withDelay(
      900,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1400, easing: ease }),
          withTiming(0, { duration: 1400, easing: ease })
        ),
        -1,
        true
      )
    );

    brandOpacity.value = withDelay(
      720,
      withTiming(1, { duration: introTiming.nameReveal, easing: ease })
    );
    brandY.value = withDelay(720, withTiming(0, { duration: introTiming.nameReveal, easing: ease }));

    taglineOpacity.value = withDelay(
      1100,
      withTiming(1, { duration: introTiming.taglineReveal, easing: ease })
    );
    taglineY.value = withDelay(
      1100,
      withTiming(0, { duration: introTiming.taglineReveal, easing: ease })
    );

    loaderOpacity.value = withDelay(
      1400,
      withTiming(1, { duration: introTiming.loaderStart, easing: ease })
    );

    const done = setTimeout(() => onSequenceComplete?.(), introTiming.minHold);
    return () => clearTimeout(done);
  }, [
    bgOpacity,
    logoScale,
    logoOpacity,
    logoGlow,
    brandOpacity,
    brandY,
    taglineOpacity,
    taglineY,
    loaderOpacity,
    onSequenceComplete,
  ]);

  const screen = useAnimatedStyle(() => ({
    opacity: localOpacity.value,
    transform: [{ scale: localScale.value }],
  }));

  return (
    <Animated.View style={[styles.root, screen]}>
      <IntroBackground bgOpacity={bgOpacity} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <GlassLogoCard scale={logoScale} opacity={logoOpacity} glow={logoGlow} />
          <IntroTypography
            brandOpacity={brandOpacity}
            brandTranslate={brandY}
            taglineOpacity={taglineOpacity}
            taglineTranslate={taglineY}
          />
          <PremiumLoader opacity={loaderOpacity} />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  safe: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
});
