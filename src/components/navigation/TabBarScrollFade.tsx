import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Height of FloatingTabBar dock + labels (excluding safe area). */
const TAB_DOCK_HEIGHT = 78;

type Props = {
  /** Bottom fade target color — match screen root background. */
  color?: string;
};

/**
 * Soft gradient above the floating tab bar so scroll content fades out
 * instead of clipping sharply behind the dock.
 */
export function TabBarScrollFade({ color = "#09090b" }: Props) {
  const insets = useSafeAreaInsets();
  const height = TAB_DOCK_HEIGHT + Math.max(insets.bottom, 12) + 48;

  return (
    <View style={[styles.wrap, { height }]} pointerEvents="none">
      <LinearGradient
        colors={["rgba(9,9,11,0)", "rgba(9,9,11,0.72)", color]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
