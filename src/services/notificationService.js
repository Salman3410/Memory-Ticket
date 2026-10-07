import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function configureNotifications() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("memento-default", {
      name: "Memento",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 200, 100, 200],
      lightColor: "#34345C",
    });
  }
}

export async function getNotificationPermissionStatus() {
  const permissions = await Notifications.getPermissionsAsync();
  return permissions.status;
}

export async function requestNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();

  if (current.status === "granted") {
    return current;
  }

  return Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: false,
    },
  });
}

export async function cancelAllMemoryNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleDailyMemoryReminder(hour = 20, minute = 0) {
  await cancelAllMemoryNotifications();

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Memento",
      body: "Take a moment to save today's memory.",
      sound: undefined,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: "memento-default",
    },
  });
}

export async function scheduleOnThisDayNotification(date, title) {
  if (!date) return null;

  const target = new Date(date);
  target.setHours(10, 0, 0, 0);

  if (target.getTime() <= Date.now()) {
    return null;
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: title || "On this day",
      body: "A memory from your past is waiting for you.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: target,
      channelId: "memento-default",
    },
  });
}
