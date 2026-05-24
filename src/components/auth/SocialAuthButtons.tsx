import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { GoogleIcon, GithubIcon } from "./OAuthIcons";
import type { OAuthProvider } from "../../services/oauth";

type Props = {
  loading: OAuthProvider | null;
  onGoogle: () => void;
  onGithub: () => void;
};

export function SocialAuthButtons({ loading, onGoogle, onGithub }: Props) {
  const busy = loading !== null;

  return (
    <View style={styles.wrap}>
      <Pressable
        style={[styles.btn, styles.btnOutline, busy && styles.disabled]}
        onPress={onGoogle}
        disabled={busy}
      >
        {loading === "google" ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <GoogleIcon />
            <Text style={styles.btnText}>Continue with Google</Text>
          </>
        )}
      </Pressable>

      <Pressable
        style={[styles.btn, styles.btnGradient, busy && styles.disabled]}
        onPress={onGithub}
        disabled={busy}
      >
        {loading === "github" ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <GithubIcon />
            <Text style={styles.btnText}>Continue with GitHub</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 16,
    minHeight: 52,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  btnGradient: {
    backgroundColor: "#4f46e5",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.5)",
  },
  btnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  disabled: { opacity: 0.55 },
});
