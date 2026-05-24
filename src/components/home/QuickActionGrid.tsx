import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export type QuickAction = {
  id: string;
  label: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: [string, string];
  onPress: () => void;
  loading?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ActionCard({ action }: { action: QuickAction }) {
  const scale = useSharedValue(1);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[styles.cardWrap, anim]}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      onPress={action.onPress}
      disabled={action.loading}
    >
      <LinearGradient colors={action.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name={action.icon} size={22} color="#fff" />
        </View>
        <Text style={styles.label}>{action.loading ? "Please wait…" : action.label}</Text>
        <Text style={styles.subtitle}>{action.subtitle}</Text>
      </LinearGradient>
    </AnimatedPressable>
  );
}

export function QuickActionGrid({ actions }: { actions: QuickAction[] }) {
  return (
    <View style={styles.grid}>
      {actions.map((a) => (
        <ActionCard key={a.id} action={a} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 28,
  },
  cardWrap: {
    width: "48%",
    flexGrow: 1,
    minWidth: "46%",
  },
  card: {
    borderRadius: 22,
    padding: 16,
    minHeight: 118,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    justifyContent: "space-between",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  label: { fontSize: 15, fontWeight: "700", color: "#fff", letterSpacing: -0.2 },
  subtitle: { fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 4 },
});
