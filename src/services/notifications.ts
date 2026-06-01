import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const ONGOING_CALL_ID = "ongoing-call";
const CALL_CHANNEL_ID = "blumen_meet_ongoing_call";

function isOngoingCallNotification(
  request: Notifications.NotificationRequest
): boolean {
  const id = request.identifier;
  const type = request.content.data?.type;
  return id === ONGOING_CALL_ID || type === "ongoing-call" || type === "ongoing-call-update";
}

Notifications.setNotificationHandler({
  handleNotification: async (request) => {
    const ongoing = isOngoingCallNotification(request);
    return {
      /** Ongoing call = sticky shade only — no heads-up popups or sounds on every tick. */
      shouldShowBanner: !ongoing,
      shouldShowList: true,
      shouldPlaySound: !ongoing,
      shouldSetBadge: false,
    };
  },
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
      importance: Notifications.AndroidImportance.LOW,
      vibrationPattern: [0],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: false,
      enableVibrate: false,
      showBadge: false,
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
      priority: Notifications.AndroidNotificationPriority.LOW,
      categoryIdentifier: "call",
      channelId: CALL_CHANNEL_ID,
      autoDismiss: false,
      data: { type: "ongoing-call" },
    },
    trigger: null,
    identifier: ONGOING_CALL_ID,
  });
}

export async function updateOngoingCallNotification(title: string, subtitle?: string) {
  if (Platform.OS !== "android") return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Blumen Meet — in meeting",
      body: subtitle || title,
      sticky: true,
      priority: Notifications.AndroidNotificationPriority.LOW,
      categoryIdentifier: "call",
      channelId: CALL_CHANNEL_ID,
      autoDismiss: false,
      data: { type: "ongoing-call-update" },
    },
    trigger: null,
    identifier: ONGOING_CALL_ID,
  });
}

export async function dismissOngoingCallNotification() {
  await Notifications.dismissNotificationAsync(ONGOING_CALL_ID).catch(() => {});
}
