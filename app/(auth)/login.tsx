import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import { Input } from "../../src/components/ui/Input";
import { Button } from "../../src/components/ui/Button";
import { login } from "../../src/services/auth";
import { signInWithOAuth, getOAuthSetupHint, type OAuthProvider } from "../../src/services/oauth";
import { useAuthStore } from "../../src/store/authStore";
import { AuthScreenShell } from "../../src/components/auth/AuthScreenShell";
import { SocialAuthButtons } from "../../src/components/auth/SocialAuthButtons";
import { OAuthDevBanner } from "../../src/components/auth/OAuthDevBanner";
import { ApiError } from "../../src/services/api";

export default function LoginScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);
  const [showEmail, setShowEmail] = useState(false);

  const onOAuth = async (provider: OAuthProvider) => {
    setError("");
    setOauthLoading(provider);
    try {
      const { token, user } = await signInWithOAuth(provider);
      await setSession(token, user);
      router.replace("/(tabs)");
    } catch (e) {
      if (e instanceof ApiError && e.status === 0) return;
      const hint = getOAuthSetupHint();
      const msg = e instanceof Error ? e.message : "Sign in failed";
      setError(hint ? `${msg}\n\n${hint}` : msg);
    } finally {
      setOauthLoading(null);
    }
  };

  const onSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const { token, user } = await login(email.trim(), password);
      await setSession(token, user);
      router.replace("/(tabs)");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenShell
      title="Welcome back"
      subtitle="Continue with Google or GitHub — the same accounts you use on the website."
      footer={
        <>
          <Pressable onPress={() => router.replace("/join")}>
            <Text style={styles.guestLink}>Join as guest without signing in →</Text>
          </Pressable>
          <Link href="/(auth)/register" asChild>
            <Pressable style={styles.registerLink}>
              <Text style={styles.registerText}>
                No account? <Text style={styles.registerBold}>Register</Text>
              </Text>
            </Pressable>
          </Link>
        </>
      }
    >
      <OAuthDevBanner />
      <SocialAuthButtons
        loading={oauthLoading}
        onGoogle={() => onOAuth("google")}
        onGithub={() => onOAuth("github")}
      />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      {!showEmail ? (
        <Pressable onPress={() => setShowEmail(true)} style={styles.emailToggle}>
          <Text style={styles.emailToggleText}>Sign in with email instead</Text>
        </Pressable>
      ) : (
        <View style={styles.emailForm}>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            label={loading ? "Signing in…" : "Sign in with email"}
            onPress={onSubmit}
            disabled={loading || !!oauthLoading}
          />
        </View>
      )}

      {!showEmail && error ? <Text style={[styles.error, { marginTop: 12 }]}>{error}</Text> : null}
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  dividerText: {
    fontSize: 12,
    color: "#71717a",
  },
  emailToggle: {
    alignItems: "center",
    paddingVertical: 8,
  },
  emailToggleText: {
    color: "#a78bfa",
    fontSize: 14,
    fontWeight: "500",
  },
  emailForm: { gap: 12 },
  error: { color: "#f87171", fontSize: 13 },
  guestLink: {
    textAlign: "center",
    color: "#71717a",
    fontSize: 14,
    marginBottom: 16,
  },
  registerLink: { paddingVertical: 4 },
  registerText: { color: "#a78bfa", fontSize: 14, textAlign: "center" },
  registerBold: { fontWeight: "700" },
});
