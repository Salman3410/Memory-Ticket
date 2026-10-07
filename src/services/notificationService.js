import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const NOTIFICATIONS_ENABLED_KEY = "notificationsEnabled";
const NOTIFICATION_CHANNEL_ID = "memento-default";

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
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
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
  await configureNotifications();

  const current = await Notifications.getPermissionsAsync();

  if (current.granted || current.status === "granted") {
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

export async function isNotificationsEnabled() {
  const value = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);

  return value === "true";
}

export async function cancelAllMemoryNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

async function scheduleDailyMemoryReminder(hour = 20, minute = 0) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Memento",
      body: "Take a moment to save today's memory.",
      data: {
        type: "DAILY_MEMORY_REMINDER",
      },
      sound: undefined,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: NOTIFICATION_CHANNEL_ID,
    },
  });
}

function getMemoryDate(memory) {
  return memory?.date || memory?.createdAt || null;
}

function getMemoryTitle(memory) {
  return (
    memory?.title ||
    memory?.name ||
    memory?.caption ||
    "A memory from your past"
  );
}

function getNextAnniversary(memoryDate) {
  const source = new Date(memoryDate);

  if (Number.isNaN(source.getTime())) {
    return null;
  }

  const now = new Date();

  let year = now.getFullYear();

  let target = new Date(
    year,
    source.getMonth(),
    source.getDate(),
    10,
    0,
    0,
    0,
  );

  if (target.getTime() <= now.getTime()) {
    year += 1;

    target = new Date(
      year,
      source.getMonth(),
      source.getDate(),
      10,
      0,
      0,
      0,
    );
  }

  return target;
}

async function scheduleOnThisDayNotifications(memories = []) {
  const now = new Date();
  const currentYear = now.getFullYear();

  const candidates = (Array.isArray(memories) ? memories : [])
    .map((memory) => ({
      memory,
      date: getMemoryDate(memory),
    }))
    .filter(({ date }) => {
      if (!date) return false;

      const parsed = new Date(date);

      return (
        !Number.isNaN(parsed.getTime()) &&
        parsed.getFullYear() < currentYear
      );
    })
    .sort((a, b) => {
      const aTarget = getNextAnniversary(a.date);
      const bTarget = getNextAnniversary(b.date);

      return (aTarget?.getTime() || 0) - (bTarget?.getTime() || 0);
    });

  const seenDays = new Set();
  let scheduled = 0;

  for (const { memory, date } of candidates) {
    if (scheduled >= 10) break;

    const source = new Date(date);
    const dayKey = `${source.getMonth()}-${source.getDate()}`;

    if (seenDays.has(dayKey)) continue;

    const target = getNextAnniversary(date);

    if (!target) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "On This Day",
        body: getMemoryTitle(memory),
        data: {
          type: "ON_THIS_DAY",
          memoryId: memory?.id || memory?._id || memory?.clientMemoryId || null,
        },
        sound: undefined,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: target,
        channelId: NOTIFICATION_CHANNEL_ID,
      },
    });

    seenDays.add(dayKey);
    scheduled += 1;
  }

  return scheduled;
}

export async function scheduleDailyMemoryReminderAndOnThisDay(memories = []) {
  const dailyId = await scheduleDailyMemoryReminder();
  const onThisDayCount = await scheduleOnThisDayNotifications(memories);

  return {
    dailyId,
    onThisDayCount,
  };
}

export async function setNotificationsEnabled(enabled, memories = []) {
  await AsyncStorage.setItem(
    NOTIFICATIONS_ENABLED_KEY,
    enabled ? "true" : "false",
  );

  if (!enabled) {
    await cancelAllMemoryNotifications();

    return {
      enabled: false,
      permissionDenied: false,
    };
  }

  const permission = await requestNotificationPermission();

  if (!permission.granted && permission.status !== "granted") {
    await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, "false");

    await cancelAllMemoryNotifications();

    return {
      enabled: false,
      permissionDenied: true,
    };
  }

  await cancelAllMemoryNotifications();
  await configureNotifications();

  const scheduled = await scheduleDailyMemoryReminderAndOnThisDay(memories);

  return {
    enabled: true,
    permissionDenied: false,
    ...scheduled,
  };
}

export async function syncMemoryNotifications(memories = []) {
  const enabled = await isNotificationsEnabled();

  if (!enabled) {
    return {
      enabled: false,
    };
  }

  const permission = await Notifications.getPermissionsAsync();

  if (!permission.granted && permission.status !== "granted") {
    return {
      enabled: false,
      permissionDenied: true,
    };
  }

  await cancelAllMemoryNotifications();
  await configureNotifications();

  const scheduled = await scheduleDailyMemoryReminderAndOnThisDay(memories);

  return {
    enabled: true,
    permissionDenied: false,
    ...scheduled,
  };
}
