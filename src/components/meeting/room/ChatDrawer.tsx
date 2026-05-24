import { View, Text, Modal, TextInput, Pressable, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { ChatMessage } from "../../../hooks/useMeetingChat";

type Props = {
  visible: boolean;
  messages: ChatMessage[];
  input: string;
  onChangeInput: (v: string) => void;
  onSend: () => void;
  onClose: () => void;
};

export function ChatDrawer({ visible, messages, input, onChangeInput, onSend, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.sheetWrap}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <LinearGradient colors={["#18181b", "#09090b"]} style={styles.sheet}>
              <View style={styles.handle} />
              <View style={styles.header}>
                <Text style={styles.title}>Meeting chat</Text>
                <Pressable onPress={onClose} hitSlop={12}>
                  <Ionicons name="close" size={22} color="#a1a1aa" />
                </Pressable>
              </View>
              <FlatList
                data={messages}
                keyExtractor={(m) => m.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.empty}>No messages yet</Text>}
                renderItem={({ item }) => (
                  <View style={[styles.bubbleWrap, item.isLocal && styles.bubbleWrapLocal]}>
                    {!item.isLocal ? <Text style={styles.sender}>{item.sender}</Text> : null}
                    <View style={[styles.bubble, item.isLocal && styles.bubbleLocal]}>
                      <Text style={styles.bubbleText}>{item.text}</Text>
                    </View>
                  </View>
                )}
              />
              <View style={styles.inputRow}>
                <TextInput
                  value={input}
                  onChangeText={onChangeInput}
                  placeholder="Send a message…"
                  placeholderTextColor="#52525b"
                  style={styles.input}
                />
                <Pressable style={styles.send} onPress={onSend}>
                  <Ionicons name="send" size={18} color="#fff" />
                </Pressable>
              </View>
            </LinearGradient>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  sheetWrap: { maxHeight: "75%" },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingBottom: 24,
    minHeight: 320,
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
  list: { maxHeight: 260 },
  listContent: { padding: 16 },
  empty: { textAlign: "center", color: "#71717a", marginTop: 24 },
  bubbleWrap: { marginBottom: 12, alignItems: "flex-start" },
  bubbleWrapLocal: { alignItems: "flex-end" },
  sender: { fontSize: 11, color: "#71717a", marginBottom: 4, marginLeft: 4 },
  bubble: {
    maxWidth: "85%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  bubbleLocal: {
    backgroundColor: "rgba(99,102,241,0.35)",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
    borderColor: "rgba(139,92,246,0.35)",
  },
  bubbleText: { color: "#fafafa", fontSize: 14, lineHeight: 20 },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
  },
});
