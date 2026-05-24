import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { registerGlobals } from "@livekit/react-native";
import { useAuthStore } from "../src/store/authStore";
import { setupCallKeepPlatform, teardownCallKeepListeners } from "../src/features/callkit";
import { registerForPushNotifications } from "../src/services/notifications";
import { registerVoipFromExpoToken } from "../src/features/voip";
import { fetchMe } from "../src/services/auth";

registerGlobals();

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const setSession = useAuthStore((s) => s.setSession);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    let mounted = true;

    (async () => {
      await hydrate();
      if (!mounted) return;

      await setupCallKeepPlatform({
        onEndCall: () => {
          // System end-call from lock screen — room screen handles disconnect on unmount
        },
      });
      await registerForPushNotifications();
      await registerVoipFromExpoToken();
    })();

    return () => {
      mounted = false;
      teardownCallKeepListeners();
    };
  }, [hydrate]);

  useEffect(() => {
    if (!token) return;
    fetchMe()
      .then(({ user }) => setSession(token, user))
      .catch(() => {});
  }, [token, setSession]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#09090b" },
            animation: "fade",
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
