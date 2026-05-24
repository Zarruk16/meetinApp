import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const AI_FEATURES = [
  { icon: "document-text-outline" as const, title: "AI Summary", desc: "Auto-generated meeting recap" },
  { icon: "chatbox-ellipses-outline" as const, title: "Live Transcript", desc: "Real-time speech-to-text" },
  { icon: "create-outline" as const, title: "Smart Notes", desc: "Key points and action items" },
];

export function MeetingAIPanel({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <LinearGradient colors={["#1e1b4b", "#09090b"]} style={styles.sheet}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Ionicons name="sparkles" size={18} color="#c4b5fd" />
                <Text style={styles.title}>AI Assistant</Text>
              </View>
              <Pressable onPress={onClose} hitSlop={12}>
                <Ionicons name="close" size={22} color="#a1a1aa" />
              </Pressable>
            </View>
            <Text style={styles.sub}>Coming soon — preview features</Text>
            {AI_FEATURES.map((f) => (
              <View key={f.title} style={styles.card}>
                <LinearGradient colors={["rgba(99,102,241,0.25)", "rgba(99,102,241,0.08)"]} style={styles.cardGrad}>
                  <View style={styles.iconWrap}>
                    <Ionicons name={f.icon} size={22} color="#c4b5fd" />
                  </View>
                  <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>{f.title}</Text>
                    <Text style={styles.cardDesc}>{f.desc}</Text>
                  </View>
                  <View style={styles.soon}>
                    <Text style={styles.soonText}>Soon</Text>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.25)",
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 12,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 18, fontWeight: "700", color: "#fff" },
  sub: { fontSize: 13, color: "#71717a", marginBottom: 16 },
  card: { marginBottom: 10, borderRadius: 18, overflow: "hidden" },
  cardGrad: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.2)",
    borderRadius: 18,
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(99,102,241,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#fafafa" },
  cardDesc: { fontSize: 12, color: "#a1a1aa", marginTop: 2 },
  soon: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  soonText: { fontSize: 10, fontWeight: "700", color: "#71717a" },
});
