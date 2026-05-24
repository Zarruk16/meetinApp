import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import { Input } from "../../src/components/ui/Input";
import { Button } from "../../src/components/ui/Button";
import { register } from "../../src/services/auth";
import { signInWithOAuth, type OAuthProvider } from "../../src/services/oauth";
import { useAuthStore } from "../../src/store/authStore";
import { AuthScreenShell } from "../../src/components/auth/AuthScreenShell";
import { SocialAuthButtons } from "../../src/components/auth/SocialAuthButtons";
import { ApiError } from "../../src/services/api";

export default function RegisterScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [name, setName] = useState("");
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
      setError(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setOauthLoading(null);
    }
  };

  const onSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await register(name.trim(), email.trim(), password);
      await setSession(res.token, res.user);
      router.replace("/(tabs)");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenShell
      title="Create account"
      subtitle="Use Google or GitHub for instant access, or register with email."
      footer={
        <Link href="/(auth)/login" asChild>
          <Pressable>
            <Text style={styles.link}>Already have an account? Sign in</Text>
          </Pressable>
        </Link>
      }
    >
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
        <Pressable onPress={() => setShowEmail(true)}>
          <Text style={styles.emailToggle}>Register with email instead</Text>
        </Pressable>
      ) : (
        <View style={styles.form}>
          <Input value={name} onChangeText={setName} placeholder="Full name" />
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input value={password} onChangeText={setPassword} placeholder="Password (min 8)" secureTextEntry />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button label={loading ? "Creating…" : "Create account"} onPress={onSubmit} disabled={loading || !!oauthLoading} />
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
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.08)" },
  dividerText: { fontSize: 12, color: "#71717a" },
  emailToggle: { textAlign: "center", color: "#a78bfa", fontSize: 14, fontWeight: "500", paddingVertical: 8 },
  form: { gap: 12 },
  error: { color: "#f87171", fontSize: 13 },
  link: { color: "#a78bfa", fontSize: 14, textAlign: "center" },
});
