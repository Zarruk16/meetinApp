import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useSharedValue, withTiming, runOnJS } from "react-native-reanimated";
import { useAuthStore } from "../src/store/authStore";
import { IntroScreen } from "../src/screens/IntroScreen";
import { premiumEasing, introTiming } from "../src/animations/easing";

type Phase = "intro" | "exit" | "navigated";

export default function AppEntryScreen() {
  const router = useRouter();
  const { token, hydrated } = useAuthStore();
  const [phase, setPhase] = useState<Phase>("intro");
  const [introDone, setIntroDone] = useState(false);

  const screenOpacity = useSharedValue(1);
  const screenScale = useSharedValue(1);

  const navigateNext = useCallback(() => {
    if (token) router.replace("/(tabs)");
    else router.replace("/(auth)/login");
    setPhase("navigated");
  }, [router, token]);

  const beginExit = useCallback(() => {
    setPhase("exit");
    screenScale.value = withTiming(1.04, {
      duration: introTiming.exitFade,
      easing: premiumEasing.cinematic,
    });
    screenOpacity.value = withTiming(
      0,
      { duration: introTiming.exitFade, easing: premiumEasing.cinematic },
      (finished) => {
        if (finished) runOnJS(navigateNext)();
      }
    );
  }, [navigateNext, screenOpacity, screenScale]);

  const onIntroComplete = useCallback(() => {
    setIntroDone(true);
  }, []);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    if (!introDone || !hydrated || phase !== "intro") return;
    beginExit();
  }, [introDone, hydrated, phase, beginExit]);

  if (phase === "navigated") {
    return <View style={styles.placeholder} />;
  }

  return (
    <View style={styles.root}>
      <IntroScreen
        screenOpacity={screenOpacity}
        screenScale={screenScale}
        onSequenceComplete={onIntroComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#09090b" },
  placeholder: { flex: 1, backgroundColor: "#09090b" },
});
