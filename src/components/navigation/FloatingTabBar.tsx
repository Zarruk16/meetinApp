import { View, Pressable, StyleSheet, Platform, Text } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_META: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap; iconFocused: keyof typeof Ionicons.glyphMap }> = {
  index: { label: "Home", icon: "home-outline", iconFocused: "home" },
  history: { label: "Meetings", icon: "calendar-outline", iconFocused: "calendar" },
  recordings: { label: "Recordings", icon: "film-outline", iconFocused: "film" },
  notifications: { label: "Alerts", icon: "notifications-outline", iconFocused: "notifications" },
  profile: { label: "Profile", icon: "person-outline", iconFocused: "person" },
};

function TabItem({
  label,
  icon,
  iconFocused,
  focused,
  onPress,
  onLongPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const scale = useSharedValue(1);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        scale.value = withSpring(0.9, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      style={styles.tab}
    >
      <Animated.View style={[styles.tabInner, focused ? styles.tabInnerFocused : styles.tabInnerInactive, anim]}>
        {focused ? (
          <LinearGradient
            colors={["rgba(99,102,241,0.45)", "rgba(139,92,246,0.25)"]}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        <Ionicons
          name={focused ? iconFocused : icon}
          size={23}
          color={focused ? "#f5f3ff" : "#d4d4d8"}
        />
      </Animated.View>
      <Text style={[styles.tabLabel, focused ? styles.tabLabelFocused : styles.tabLabelInactive]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.outer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <LinearGradient
        colors={["rgba(24,24,27,0.92)", "rgba(9,9,11,0.95)"]}
        style={styles.dock}
      >
        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const meta = TAB_META[route.name] ?? {
              label: route.name,
              icon: "ellipse-outline" as const,
              iconFocused: "ellipse" as const,
            };

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TabItem
                key={route.key}
                label={meta.label}
                icon={meta.icon}
                iconFocused={meta.iconFocused}
                focused={focused}
                onPress={onPress}
                onLongPress={() => navigation.emit({ type: "tabLongPress", target: route.key })}
              />
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
  },
  dock: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingVertical: 10,
    paddingHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#6366f1",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
      },
      android: { elevation: 12 },
    }),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tab: {
    alignItems: "center",
    flex: 1,
    gap: 4,
  },
  tabInner: {
    width: 44,
    height: 36,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  tabInnerInactive: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  tabInnerFocused: {
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.5)",
  },
  tabLabel: {
    fontSize: 10,
    maxWidth: 64,
    textAlign: "center",
  },
  tabLabelInactive: {
    color: "#a1a1aa",
    fontWeight: "600",
  },
  tabLabelFocused: {
    color: "#e9d5ff",
    fontWeight: "700",
  },
});
