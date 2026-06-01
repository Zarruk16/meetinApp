import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { env } from "../../config/env";
import { getOAuthSetupHint } from "../../services/oauth";

/** Shown on login when Android emulator needs adb reverse or Vercel OAuth for Google sign-in. */
export function OAuthDevBanner() {
  if (Platform.OS !== "android" || !env.oauthNeedsAdbReverse) return null;

  const hint = getOAuthSetupHint();
  if (!hint) return null;

  return (
    <View style={styles.box}>
      <Text style={styles.title}>Google sign-in on emulator</Text>
      <Text style={styles.body}>{hint}</Text>
      <Text style={styles.cmd}>npm run adb:reverse</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.35)",
    backgroundColor: "rgba(251, 191, 36, 0.08)",
  },
  title: {
    color: "#fcd34d",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  body: {
    color: "#a1a1aa",
    fontSize: 12,
    lineHeight: 18,
  },
  cmd: {
    marginTop: 8,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 11,
    color: "#e4e4e7",
  },
});
