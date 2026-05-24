import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PremiumBackground } from "../../src/components/ui/PremiumBackground";
import { JoinSetupHeader } from "../../src/components/meeting/setup/JoinSetupHeader";
import { CameraPreviewPanel } from "../../src/components/meeting/setup/CameraPreviewPanel";
import { PreMeetingControls } from "../../src/components/meeting/setup/PreMeetingControls";
import { JoinMeetingCTA } from "../../src/components/meeting/setup/JoinMeetingCTA";
import { parseMeetingIdentifier } from "../../src/lib/parseMeetingInput";
import {
  authorizeJoin,
  getMeeting,
  getStoredHostKey,
  getGuestName,
  saveGuestName,
  addMeetingHistory,
  resolveRoomId,
} from "../../src/services/meetings";
import { useAuthStore } from "../../src/store/authStore";

export default function JoinScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ roomId?: string }>();
  const user = useAuthStore((s) => s.user);

  const initialCode = params.roomId ? parseMeetingIdentifier(String(params.roomId)) : "";

  const [roomId, setRoomId] = useState(initialCode);
  const [name, setName] = useState(user?.name || "");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [facing, setFacing] = useState<"front" | "back">("front");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [metaLoading, setMetaLoading] = useState(false);
  const [hostName, setHostName] = useState<string>();
  const [waitingHost, setWaitingHost] = useState(false);

  useEffect(() => {
    if (!initialCode) return;
    setRoomId(initialCode);
  }, [initialCode]);

  useEffect(() => {
    if (!initialCode) return;
    setMetaLoading(true);
    resolveRoomId(initialCode)
      .then((id) => {
        setRoomId(id);
        return Promise.all([getGuestName(id), getMeeting(id)]);
      })
      .then(([guest, m]) => {
        if (guest) setName(guest);
        setHostName(m.hostName);
      })
      .catch(() => {})
      .finally(() => setMetaLoading(false));
  }, [initialCode]);

  const onMeetingInputChange = (text: string) => {
    setError("");
    setRoomId(parseMeetingIdentifier(text));
  };

  const onJoin = async () => {
    const displayName = name.trim();
    if (!roomId.trim() || !displayName) {
      setError("Enter meeting link or code and your name");
      return;
    }
    setLoading(true);
    setError("");
    setWaitingHost(false);
    try {
      const id = await resolveRoomId(roomId);
      setRoomId(id);

      const meta = await getMeeting(id);
      if (meta.cancelled || meta.status === "ended") {
        setError("This meeting has ended");
        setLoading(false);
        return;
      }
      setHostName(meta.hostName);
      const hostKey = await getStoredHostKey(id);
      const auth = await authorizeJoin(id, {
        hostKey,
        hostUserId: user?.id || "",
      });
      if (!auth.allowed) {
        if (auth.reason === "waiting_for_host") {
          setWaitingHost(true);
          setError("Waiting for host to start");
        } else if (auth.reason === "ended") setError("Meeting ended");
        else setError("Unable to join");
        setLoading(false);
        return;
      }
      await saveGuestName(id, displayName);
      await addMeetingHistory({ roomId: id, joinedAt: Date.now(), title: meta.hostName });
      router.replace({
        pathname: "/meeting/[roomId]",
        params: {
          roomId: id,
          name: displayName,
          isHost: auth.isHost ? "1" : "0",
          mic: micOn ? "1" : "0",
          cam: camOn ? "1" : "0",
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Join failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <PremiumBackground />
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Pressable onPress={() => router.back()} style={styles.back}>
              <Ionicons name="chevron-back" size={22} color="#a1a1aa" />
              <Text style={styles.backText}>Back</Text>
            </Pressable>

            <JoinSetupHeader
              roomId={roomId || initialCode}
              hostName={hostName}
              status={waitingHost ? "waiting" : "ready"}
            />

            <CameraPreviewPanel camOn={camOn} name={name} facing={facing} />

            <View style={styles.form}>
              <Text style={styles.fieldLabel}>Meeting link or code</Text>
              <TextInput
                value={roomId}
                onChangeText={onMeetingInputChange}
                placeholder="Paste web link or enter code (e.g. FE9AED53)"
                placeholderTextColor="#52525b"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
              <Text style={styles.hint}>Works with full web URLs like …/join/your-room-id</Text>
              <Text style={styles.fieldLabel}>Display name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor="#52525b"
                style={styles.input}
              />
            </View>

            <PreMeetingControls
              controls={[
                {
                  id: "mic",
                  icon: micOn ? "mic" : "mic-off",
                  label: "Mic",
                  active: micOn,
                  onPress: () => setMicOn((v) => !v),
                },
                {
                  id: "cam",
                  icon: camOn ? "videocam" : "videocam-off",
                  label: "Camera",
                  active: camOn,
                  onPress: () => setCamOn((v) => !v),
                },
                {
                  id: "speaker",
                  icon: speakerOn ? "volume-high" : "volume-mute",
                  label: "Speaker",
                  active: speakerOn,
                  onPress: () => setSpeakerOn((v) => !v),
                },
                {
                  id: "flip",
                  icon: "camera-reverse",
                  label: "Flip",
                  onPress: () => setFacing((f) => (f === "front" ? "back" : "front")),
                },
              ]}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <JoinMeetingCTA
              label={loading ? "Joining…" : "Join Meeting"}
              loading={loading || metaLoading}
              onPress={onJoin}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#09090b" },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
  back: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 8 },
  backText: { color: "#a1a1aa", fontSize: 15 },
  form: { marginBottom: 16, gap: 8 },
  fieldLabel: { fontSize: 12, fontWeight: "600", color: "#71717a", marginTop: 4 },
  hint: { fontSize: 11, color: "#52525b", marginTop: -4, marginBottom: 4 },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 15,
  },
  error: { color: "#f87171", fontSize: 13, marginTop: 12, textAlign: "center" },
});
