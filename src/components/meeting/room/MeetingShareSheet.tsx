import { useState } from "react";
import { View, Text, Modal, Pressable, StyleSheet, Share } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { env } from "../../../config/env";

type Props = {
  visible: boolean;
  joinUrl: string;
  roomId: string;
  onClose: () => void;
};

async function copyText(text: string): Promise<boolean> {
  try {
    await Clipboard.setStringAsync(text);
    return true;
  } catch {
    try {
      await Share.share({ message: text, title: "Copy meeting link" });
    } catch {
      // cancelled
    }
    return false;
  }
}

export function MeetingShareSheet({ visible, joinUrl, roomId, onClose }: Props) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const meetingCode = roomId.slice(0, 8).toUpperCase();

  const onCopyLink = async () => {
    const ok = await copyText(joinUrl);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const onCopyCode = async () => {
    const ok = await copyText(meetingCode);
    if (ok) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Join my Blumen Meet on web or mobile:\n${joinUrl}`,
        url: joinUrl,
        title: "Meeting invite",
      });
    } catch {
      // cancelled
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <LinearGradient colors={["#27272a", "#18181b"]} style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.title}>Invite to meeting</Text>
            <Text style={styles.sub}>Share this link — others can join from a PC browser or phone</Text>

            <View style={styles.linkBox}>
              <Text style={styles.linkText} selectable>
                {joinUrl}
              </Text>
              <Pressable style={styles.copyBtn} onPress={onCopyLink} accessibilityLabel="Copy meeting link">
                <Ionicons name={copiedLink ? "checkmark" : "copy-outline"} size={18} color="#c4b5fd" />
              </Pressable>
            </View>
            {copiedLink ? <Text style={styles.hint}>Link copied</Text> : null}

            {env.webUrlNeedsLanConfig ? (
              <Text style={styles.lanHint}>
                For other computers on your Wi‑Fi, set EXPO_PUBLIC_WEB_URL to your Mac's LAN IP (e.g.
                http://192.168.1.100:3000).
              </Text>
            ) : null}

            <View style={styles.codeRow}>
              <View>
                <Text style={styles.codeLabel}>Meeting code</Text>
                <Text style={styles.code}>{meetingCode}</Text>
              </View>
              <Pressable style={styles.copyBtn} onPress={onCopyCode} accessibilityLabel="Copy meeting code">
                <Ionicons name={copiedCode ? "checkmark" : "copy-outline"} size={18} color="#c4b5fd" />
              </Pressable>
            </View>

            <Pressable style={styles.shareBtn} onPress={onShare}>
              <LinearGradient colors={["#4f46e5", "#6366f1"]} style={styles.shareGrad}>
                <Ionicons name="share-outline" size={20} color="#fff" />
                <Text style={styles.shareText}>Share invite</Text>
              </LinearGradient>
            </Pressable>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#fff" },
  sub: { fontSize: 14, color: "#71717a", marginTop: 4, marginBottom: 16 },
  linkBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingLeft: 14,
    paddingRight: 6,
    marginBottom: 8,
  },
  linkText: { flex: 1, color: "#e4e4e7", fontSize: 13, paddingVertical: 12 },
  copyBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(99,102,241,0.2)",
  },
  hint: { fontSize: 12, color: "#86efac", marginBottom: 12, textAlign: "center" },
  lanHint: {
    fontSize: 12,
    color: "#a1a1aa",
    marginBottom: 12,
    lineHeight: 17,
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 10,
    borderRadius: 10,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  codeLabel: { fontSize: 11, fontWeight: "600", color: "#71717a", textTransform: "uppercase", letterSpacing: 0.6 },
  code: { fontSize: 22, fontWeight: "700", color: "#c4b5fd", marginTop: 4, letterSpacing: 2 },
  shareBtn: { borderRadius: 16, overflow: "hidden" },
  shareGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  shareText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
