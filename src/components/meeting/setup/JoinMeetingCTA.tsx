import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  label: string;
  loading?: boolean;
  onPress: () => void;
};

export function JoinMeetingCTA({ label, loading, onPress }: Props) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      style={[styles.wrap, anim]}
      onPress={onPress}
      disabled={loading}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 14 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14 });
      }}
    >
      <LinearGradient colors={["#4f46e5", "#6366f1", "#7c3aed"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btn}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.text}>{label}</Text>
        )}
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#6366f1",
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  btn: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  text: { color: "#fff", fontSize: 17, fontWeight: "700", letterSpacing: 0.2 },
});
