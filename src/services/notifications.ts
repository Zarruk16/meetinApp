import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const ONGOING_CALL_ID = "ongoing-call";
const CALL_CHANNEL_ID = "blumen_meet_ongoing_call";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let final = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    final = status;
  }
  if (final !== "granted") return null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CALL_CHANNEL_ID, {
      name: "Ongoing meetings",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: false,
      enableVibrate: false,
    });
  }

  return Notifications.getExpoPushTokenAsync().catch(() => null);
}

/** Android lock-screen / shade indicator while in a meeting (CallKeep not used on Android). */
export async function showOngoingCallNotification(title: string, subtitle?: string) {
  if (Platform.OS !== "android") return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Blumen Meet — in meeting",
      body: subtitle || title,
      sticky: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
      categoryIdentifier: "call",
      channelId: CALL_CHANNEL_ID,
      autoDismiss: false,
    },
    trigger: null,
    identifier: ONGOING_CALL_ID,
  });
}

export async function updateOngoingCallNotification(title: string, subtitle?: string) {
  if (Platform.OS !== "android") return;
  await showOngoingCallNotification(title, subtitle);
}

export async function dismissOngoingCallNotification() {
  await Notifications.dismissNotificationAsync(ONGOING_CALL_ID).catch(() => {});
}
