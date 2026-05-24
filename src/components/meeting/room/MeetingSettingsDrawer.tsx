import { View, Text, Modal, Pressable, StyleSheet, Switch, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { LAYOUT_OPTIONS, type MeetingLayout } from "../../../meeting/layout";

export type MeetingSettings = {
  layout: MeetingLayout;
  noiseSuppression: boolean;
  highQualityVideo: boolean;
  darkTheme: boolean;
};

type Props = {
  visible: boolean;
  settings: MeetingSettings;
  onChange: (patch: Partial<MeetingSettings>) => void;
  onClose: () => void;
};

const DEVICES = ["Default", "Built-in microphone", "Built-in camera", "Speaker"];

export function MeetingSettingsDrawer({ visible, settings, onChange, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <LinearGradient colors={["#18181b", "#09090b"]} style={styles.sheet}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <Text style={styles.title}>Meeting settings</Text>
              <Pressable onPress={onClose} hitSlop={12}>
                <Ionicons name="close" size={22} color="#a1a1aa" />
              </Pressable>
            </View>
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              <Text style={styles.section}>Video layout</Text>
              <View style={styles.layoutRow}>
                {LAYOUT_OPTIONS.map((opt) => {
                  const selected = settings.layout === opt.id;
                  return (
                    <Pressable
                      key={opt.id}
                      style={[styles.layoutCard, selected && styles.layoutCardActive]}
                      onPress={() => onChange({ layout: opt.id })}
                    >
                      <Ionicons name={opt.icon} size={24} color={selected ? "#7dd3fc" : "#71717a"} />
                      <Text style={[styles.layoutLabel, selected && styles.layoutLabelActive]}>{opt.label}</Text>
                      <Text style={styles.layoutDesc}>{opt.description}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.section}>Audio & video</Text>
              <DeviceRow label="Microphone" value={DEVICES[0]} onCycle={() => {}} />
              <DeviceRow label="Camera" value={DEVICES[1]} onCycle={() => {}} />
              <DeviceRow label="Speaker" value={DEVICES[2]} onCycle={() => {}} />

              <Text style={styles.section}>Enhancements</Text>
              <ToggleRow
                label="Noise suppression"
                sub="Reduce background noise"
                value={settings.noiseSuppression}
                onValueChange={(v) => onChange({ noiseSuppression: v })}
              />
              <ToggleRow
                label="HD video"
                sub="Higher quality when network allows"
                value={settings.highQualityVideo}
                onValueChange={(v) => onChange({ highQualityVideo: v })}
              />
              <ToggleRow
                label="Dark theme"
                sub="Cinematic meeting appearance"
                value={settings.darkTheme}
                onValueChange={(v) => onChange({ darkTheme: v })}
              />
            </ScrollView>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function DeviceRow({ label, value, onCycle }: { label: string; value: string; onCycle: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onCycle}>
      <View>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#71717a" />
    </Pressable>
  );
}

function ToggleRow({
  label,
  sub,
  value,
  onValueChange,
}: {
  label: string;
  sub: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowFlex}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowSub}>{sub}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#3f3f46", true: "#6366f1" }}
        thumbColor="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    maxHeight: "78%",
    paddingBottom: 32,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  title: { fontSize: 17, fontWeight: "700", color: "#fff" },
  body: { paddingHorizontal: 16 },
  section: {
    fontSize: 11,
    fontWeight: "700",
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  layoutRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
  layoutCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.04)",
    gap: 6,
  },
  layoutCardActive: {
    borderColor: "rgba(56,189,248,0.55)",
    backgroundColor: "rgba(56,189,248,0.1)",
  },
  layoutLabel: { fontSize: 14, fontWeight: "600", color: "#a1a1aa" },
  layoutLabelActive: { color: "#fafafa" },
  layoutDesc: { fontSize: 10, color: "#71717a", textAlign: "center", lineHeight: 14 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  rowFlex: { flex: 1, marginRight: 12 },
  rowLabel: { fontSize: 15, fontWeight: "600", color: "#fafafa" },
  rowValue: { fontSize: 13, color: "#71717a", marginTop: 2 },
  rowSub: { fontSize: 12, color: "#71717a", marginTop: 2 },
});
