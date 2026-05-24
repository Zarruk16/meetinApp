import { type ReactNode, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { premiumEasing } from "../../animations/easing";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthScreenShell({ title, subtitle, children, footer }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(28);
  const scale = useSharedValue(0.96);

  useEffect(() => {
    opacity.value = withDelay(80, withTiming(1, { duration: 650, easing: premiumEasing.cinematic }));
    translateY.value = withDelay(80, withTiming(0, { duration: 650, easing: premiumEasing.cinematic }));
    scale.value = withDelay(80, withTiming(1, { duration: 650, easing: premiumEasing.cinematic }));
  }, [opacity, translateY, scale]);

  const enter = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#09090b", "#0f0f14", "#12101f", "#09090b"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={enter}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>✦ Secure sign-in</Text>
              </View>

              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>

              <View style={styles.card}>{children}</View>

              {footer ? <View style={styles.footer}>{footer}</View> : null}
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#09090b" },
  flex: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  glowTop: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(124, 58, 237, 0.25)",
  },
  glowBottom: {
    position: "absolute",
    bottom: 40,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(37, 99, 235, 0.2)",
  },
  badge: {
    alignSelf: "flex-start",
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.35)",
    backgroundColor: "rgba(139, 92, 246, 0.12)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#c4b5fd",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#a1a1aa",
    maxWidth: 320,
  },
  card: {
    marginTop: 28,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
});
