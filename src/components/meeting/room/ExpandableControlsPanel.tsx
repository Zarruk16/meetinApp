import { View, Text, Pressable, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type AdvancedControl = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  danger?: boolean;
  highlight?: boolean;
  recording?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  controls: AdvancedControl[];
  onClose: () => void;
};

const SECTIONS: { title: string; ids: string[] }[] = [
  { title: "Meeting", ids: ["record", "hand", "people", "chat", "share"] },
  { title: "View & media", ids: ["layout", "flip", "screen", "captions"] },
  { title: "Tools", ids: ["settings", "noise", "ai"] },
];

const { width: SCREEN_W } = Dimensions.get("window");
const COLS = 4;
const H_PAD = 20;
const GAP = 10;
const TILE_W = (SCREEN_W - H_PAD * 2 - GAP * (COLS - 1)) / COLS;

function AdvancedControlTile({ control }: { control: AdvancedControl }) {
  const { icon, label, active, danger, highlight, recording, disabled, onPress } = control;
  const muted = active === false && !danger && !highlight;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.tile,
        disabled && styles.tileDisabled,
        pressed && !disabled && styles.tilePressed,
      ]}
      onPress={() => {
        if (disabled) return;
        onPress();
      }}
      disabled={disabled}
    >
      <View
        style={[
          styles.iconBox,
          danger && styles.iconBoxDanger,
          recording && active && styles.iconBoxRec,
          highlight && styles.iconBoxHighlight,
          muted && styles.iconBoxMuted,
          disabled && styles.iconBoxDisabled,
        ]}
      >
        {recording && active ? (
          <LinearGradient colors={["#b91c1c", "#ef4444"]} style={styles.iconGrad}>
            <Ionicons name={icon} size={21} color="#fff" />
          </LinearGradient>
        ) : (
          <Ionicons
            name={icon}
            size={21}
            color={danger ? "#fff" : disabled ? "#52525b" : muted ? "#fca5a5" : "#f4f4f5"}
          />
        )}
      </View>
      <Text
        style={[
          styles.tileLabel,
          danger && styles.tileLabelDanger,
          recording && active && styles.tileLabelRec,
          disabled && styles.tileLabelDisabled,
        ]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ControlSection({ title, items }: { title: string; items: AdvancedControl[] }) {
  if (!items.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionGrid}>
        {items.map((c) => (
          <AdvancedControlTile key={c.id} control={c} />
        ))}
      </View>
    </View>
  );
}

export function ExpandableControlsPanel({ visible, controls, onClose }: Props) {
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  const byId = Object.fromEntries(controls.map((c) => [c.id, c]));
  const used = new Set<string>();

  const sections = SECTIONS.map((sec) => {
    const items = sec.ids.map((id) => byId[id]).filter(Boolean) as AdvancedControl[];
    items.forEach((c) => used.add(c.id));
    return { title: sec.title, items };
  });

  const endControl = byId.end;
  if (endControl) used.add("end");

  const overflow = controls.filter((c) => !used.has(c.id));

  return (
    <View style={[styles.wrap, { bottom: 88 + Math.max(insets.bottom, 0) }]}>
      <LinearGradient
        colors={["rgba(28,28,31,0.98)", "rgba(9,9,11,0.99)"]}
        style={styles.panel}
      >
        <View style={styles.handle} />

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>More controls</Text>
            <Text style={styles.subtitle}>Meeting tools & settings</Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
            <Ionicons name="close" size={20} color="#d4d4d8" />
          </Pressable>
        </View>

        <View style={styles.headerRule} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {sections.map((sec) => (
            <ControlSection key={sec.title} title={sec.title} items={sec.items} />
          ))}

          {overflow.length > 0 ? (
            <ControlSection title="Other" items={overflow} />
          ) : null}

          {endControl ? (
            <View style={styles.dangerZone}>
              <AdvancedControlTile control={endControl} />
            </View>
          ) : null}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 29,
    maxHeight: "58%",
  },
  panel: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "rgba(255,255,255,0.1)",
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -6 },
    elevation: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: H_PAD,
    paddingTop: 8,
    paddingBottom: 14,
  },
  title: { fontSize: 17, fontWeight: "700", color: "#fafafa", letterSpacing: -0.2 },
  subtitle: { fontSize: 12, color: "#71717a", marginTop: 2 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  headerRule: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginHorizontal: H_PAD,
    marginBottom: 4,
  },
  scroll: { maxHeight: 340 },
  scrollContent: { paddingHorizontal: H_PAD, paddingBottom: 12 },
  section: { marginTop: 14 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#52525b",
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginBottom: 10,
    paddingLeft: 2,
  },
  sectionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
  tile: {
    width: TILE_W,
    alignItems: "center",
    paddingVertical: 4,
    gap: 8,
  },
  tileDisabled: { opacity: 0.4 },
  tilePressed: { opacity: 0.72 },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  iconGrad: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxHighlight: {
    backgroundColor: "rgba(56,189,248,0.12)",
    borderColor: "rgba(56,189,248,0.35)",
  },
  iconBoxMuted: {
    backgroundColor: "rgba(239,68,68,0.12)",
    borderColor: "rgba(239,68,68,0.3)",
  },
  iconBoxDanger: {
    backgroundColor: "rgba(239,68,68,0.85)",
    borderColor: "rgba(248,113,113,0.4)",
  },
  iconBoxRec: {
    borderColor: "rgba(248,113,113,0.5)",
  },
  iconBoxDisabled: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderColor: "rgba(255,255,255,0.05)",
  },
  tileLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#a1a1aa",
    textAlign: "center",
    lineHeight: 14,
    minHeight: 28,
  },
  tileLabelDanger: { color: "#fca5a5" },
  tileLabelRec: { color: "#fca5a5" },
  tileLabelDisabled: { color: "#52525b" },
  dangerZone: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(239,68,68,0.15)",
    alignItems: "center",
  },
});
