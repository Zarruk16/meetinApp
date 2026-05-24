import { useCallback } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PremiumBackground } from "../../src/components/ui/PremiumBackground";
import { ScheduledMeetingCard, EmptyScheduledState } from "../../src/components/home/ScheduledMeetingCard";
import { useAuthStore } from "../../src/store/authStore";
import { useScheduledMeetings } from "../../src/hooks/useScheduledMeetings";
import { createMeeting } from "../../src/services/meetings";

export default function HistoryScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { meetings, loading, error, load } = useScheduledMeetings(user?.id, user?.name);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const scheduleNew = async () => {
    if (!user?.id) {
      router.push("/(auth)/login");
      return;
    }
    try {
      const { roomId } = await createMeeting({
        hostUserId: user.id,
        hostName: user.name,
        kind: "scheduled",
      });
      router.push({ pathname: "/join", params: { roomId } });
    } catch {
      // ignore
    }
  };

  return (
    <View style={styles.root}>
      <PremiumBackground />
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Meetings</Text>
        <Text style={styles.sub}>Your scheduled rooms</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!user ? (
          <Text style={styles.signIn}>Sign in to view scheduled meetings.</Text>
        ) : (
          <FlatList
            data={meetings}
            keyExtractor={(i) => i.roomId}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#38bdf8" />}
            ListEmptyComponent={
              loading ? (
                <ActivityIndicator color="#38bdf8" style={{ marginTop: 32 }} />
              ) : (
                <EmptyScheduledState onSchedule={scheduleNew} />
              )
            }
            renderItem={({ item }) => (
              <ScheduledMeetingCard
                item={item}
                onPress={() => router.push({ pathname: "/join", params: { roomId: item.roomId } })}
              />
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#09090b" },
  safe: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: "700", color: "#fff", letterSpacing: -0.5 },
  sub: { fontSize: 14, color: "#71717a", marginTop: 6, marginBottom: 16 },
  signIn: { fontSize: 14, color: "#71717a" },
  error: { color: "#f87171", fontSize: 13, marginBottom: 12 },
  list: { paddingBottom: 120 },
});
