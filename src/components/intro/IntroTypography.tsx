import { StyleSheet, Text } from "react-native";
import Animated, { useAnimatedStyle, type SharedValue } from "react-native-reanimated";

type Props = {
  brandOpacity: SharedValue<number>;
  brandTranslate: SharedValue<number>;
  taglineOpacity: SharedValue<number>;
  taglineTranslate: SharedValue<number>;
};

export function IntroTypography({
  brandOpacity,
  brandTranslate,
  taglineOpacity,
  taglineTranslate,
}: Props) {
  const brand = useAnimatedStyle(() => ({
    opacity: brandOpacity.value,
    transform: [{ translateY: brandTranslate.value }],
  }));

  const tagline = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslate.value }],
  }));

  return (
    <>
      <Animated.Text style={[styles.brand, brand]}>Blumen Meet</Animated.Text>
      <Animated.Text style={[styles.tagline, tagline]}>Meet smarter.</Animated.Text>
      <Animated.Text style={[styles.sub, tagline]}>Modern communication, redefined.</Animated.Text>
    </>
  );
}

const styles = StyleSheet.create({
  brand: {
    marginTop: 32,
    fontSize: 34,
    fontWeight: "700",
    color: "#fafafa",
    letterSpacing: -1,
    textAlign: "center",
  },
  tagline: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: "500",
    color: "#c4b5fd",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  sub: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "400",
    color: "#71717a",
    textAlign: "center",
  },
});
