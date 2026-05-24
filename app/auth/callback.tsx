import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthStore } from "../../src/store/authStore";
import { apiFetch } from "../../src/services/api";
import type { UserProfile } from "../../src/store/authStore";
import { IntroScreen } from "../../src/screens/IntroScreen";

/** Deep link handler: blumenmeet://auth/callback?token=… */
export default function AuthCallbackScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!token || Array.isArray(token)) {
      setFailed(true);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const { user } = await apiFetch<{ user: UserProfile }>("/api/mobile/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
          auth: false,
        });
        if (cancelled) return;
        await setSession(token, user);
        router.replace("/(tabs)");
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, setSession, router]);

  useEffect(() => {
    if (failed) router.replace("/(auth)/login");
  }, [failed, router]);

  return <IntroScreen />;
}
