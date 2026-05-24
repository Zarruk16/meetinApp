import { Text, View, StyleSheet } from "react-native";

/** Lightweight brand marks — no extra icon font dependency. */
export function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <View style={[styles.badge, { width: size + 8, height: size + 8 }]}>
      <Text style={[styles.googleG, { fontSize: size * 0.75 }]}>G</Text>
    </View>
  );
}

export function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <View style={[styles.badge, { width: size + 8, height: size + 8 }]}>
      <Text style={[styles.github, { fontSize: size * 0.7 }]}>GH</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  googleG: {
    fontWeight: "700",
    color: "#fff",
  },
  github: {
    fontWeight: "600",
    color: "#fff",
  },
});
