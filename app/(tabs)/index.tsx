import { useCallback, useState } from "react";
import { View, Text, ScrollView, RefreshControl, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PremiumBackground } from "../../src/components/ui/PremiumBackground";
import { TabBarScrollFade } from "../../src/components/navigation/TabBarScrollFade";
import { HomeHeader } from "../../src/components/home/HomeHeader";
import { MeetingHero } from "../../src/components/home/MeetingHero";
import { QuickActionGrid, type QuickAction } from "../../src/components/home/QuickActionGrid";
import {
  ScheduledMeetingCard,
  EmptyScheduledState,
} from "../../src/components/home/ScheduledMeetingCard";
import { useAuthStore } from "../../src/store/authStore";
import { createMeeting } from "../../src/services/meetings";
import { useScheduledMeetings } from "../../src/hooks/useScheduledMeetings";

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { meetings: scheduled, loading: scheduledLoading, load: loadScheduled } = useScheduledMeetings(
    user?.id,
    user?.name
  );

  useFocusEffect(
    useCallback(() => {
      loadScheduled();
    }, [loadScheduled])
  );

  const startMeeting = async (kind: "instant" | "scheduled" = "instant") => {
    if (!user?.id) {
      router.push("/(auth)/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { roomId } = await createMeeting({
        hostUserId: user.id,
        hostName: user.name,
        kind,
      });
      router.push({
        pathname: "/join",
        params: { roomId },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create meeting");
    } finally {
      setLoading(false);
    }
  };

  const actions: QuickAction[] = [
    {
      id: "new",
      label: "New Meeting",
      subtitle: "Start instantly",
      icon: "videocam",
      colors: ["#4f46e5", "#6366f1"],
      onPress: () => startMeeting("instant"),
      loading: loading,
    },
    {
      id: "join",
      label: "Join Meeting",
      subtitle: "Enter room code",
      icon: "enter-outline",
      colors: ["#1d4ed8", "#2563eb"],
      onPress: () => router.push("/join"),
    },
    {
      id: "schedule",
      label: "Schedule",
      subtitle: "Plan ahead",
      icon: "calendar",
      colors: ["#6d28d9", "#7c3aed"],
      onPress: () => startMeeting("scheduled"),
    },
    {
      id: "recordings",
      label: "Recordings",
      subtitle: "Cloud library",
      icon: "cloud-outline",
      colors: ["#334155", "#475569"],
      onPress: () => router.push("/(tabs)/recordings"),
    },
  ];

  return (
    <View style={styles.root}>
      <PremiumBackground />
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={scheduledLoading} onRefresh={loadScheduled} tintColor="#8b5cf6" />
          }
        >
          <HomeHeader
            user={user}
            onNotifications={() => router.push("/(tabs)/notifications")}
            onSettings={() => router.push("/(tabs)/profile")}
          />

          <MeetingHero />

          <QuickActionGrid actions={actions} />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Scheduled meetings</Text>
            <Text style={styles.sectionLink} onPress={() => router.push("/(tabs)/history")}>
              See all
            </Text>
          </View>

          {!user ? (
            <Text style={styles.signInHint}>Sign in to see your scheduled meetings.</Text>
          ) : scheduledLoading && scheduled.length === 0 ? (
            <ActivityIndicator color="#38bdf8" style={{ marginVertical: 24 }} />
          ) : scheduled.length === 0 ? (
            <EmptyScheduledState onSchedule={() => startMeeting("scheduled")} />
          ) : (
            scheduled.slice(0, 4).map((item) => (
              <ScheduledMeetingCard
                key={item.roomId}
                item={item}
                onPress={() => router.push({ pathname: "/join", params: { roomId: item.roomId } })}
              />
            ))
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
        <TabBarScrollFade />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#09090b" },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#fafafa", letterSpacing: -0.3 },
  sectionLink: { fontSize: 13, fontWeight: "600", color: "#7dd3fc" },
  signInHint: { fontSize: 14, color: "#71717a", marginBottom: 16 },
  error: { color: "#f87171", fontSize: 13, marginBottom: 12 },
});
