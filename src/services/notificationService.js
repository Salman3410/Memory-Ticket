
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const NOTIFICATIONS_ENABLED_KEY = "notificationsEnabled";

const NOTIFICATION_CHANNEL_ID = "memento-default";
const MEMORY_REMINDERS_KEY = "mementoMemoryReminders";

const NOTIFICATION_TYPES = {
  DAILY: "DAILY_MEMORY_REMINDER",
  ON_THIS_DAY: "ON_THIS_DAY",
  MEMORY_REMINDER: "MEMORY_REMINDER",
};

const ALL_MEMENTO_NOTIFICATION_TYPES = Object.values(
  NOTIFICATION_TYPES,
);

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
    await Notifications.setNotificationChannelAsync(
      NOTIFICATION_CHANNEL_ID,
      {
        name: "Memento",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 200, 100, 200],
        lightColor: "#34345C",
      },
    );
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
  const value = await AsyncStorage.getItem(
    NOTIFICATIONS_ENABLED_KEY,
  );

  return value === "true";
}

async function hasNotificationPermission() {
  const permission = await Notifications.getPermissionsAsync();

  return Boolean(
    permission.granted || permission.status === "granted",
  );
}

async function getReminderStore() {
  try {
    const value = await AsyncStorage.getItem(
      MEMORY_REMINDERS_KEY,
    );

    if (!value) {
      return {};
    }

    const parsed = JSON.parse(value);

    return parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
      ? parsed
      : {};
  } catch (error) {
    console.error("Unable to read memory reminders:", error);
    return {};
  }
}

async function saveReminderStore(reminders) {
  await AsyncStorage.setItem(
    MEMORY_REMINDERS_KEY,
    JSON.stringify(reminders),
  );
}

function getMemoryId(memory) {
  const id =
    memory?.id ||
    memory?._id ||
    memory?.clientMemoryId;

  return id ? String(id) : null;
}

function getMemoryTitle(memory) {
  return (
    memory?.title ||
    memory?.name ||
    memory?.caption ||
    "A memory from your past"
  );
}

async function getMementoScheduledNotifications() {
  return Notifications.getAllScheduledNotificationsAsync();
}

async function cancelScheduledNotificationTypes(types) {
  const typeSet = new Set(types);
  const scheduled = await getMementoScheduledNotifications();

  const matching = scheduled.filter((notification) =>
    typeSet.has(notification.content?.data?.type),
  );

  await Promise.all(
    matching.map((notification) =>
      Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      ),
    ),
  );

  return matching.length;
}

export async function cancelAllMemoryNotifications() {
  return cancelScheduledNotificationTypes(
    ALL_MEMENTO_NOTIFICATION_TYPES,
  );
}

async function scheduleDailyMemoryReminder(
  hour = 20,
  minute = 0,
) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Memento",
      body: "Take a moment to save today's memory.",
      data: {
        type: NOTIFICATION_TYPES.DAILY,
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

function getNextAnniversary(memoryDate) {
  const source = new Date(memoryDate);

  if (Number.isNaN(source.getTime())) {
    return null;
  }

  const now = new Date();

  const createTarget = (year) => {
    const target = new Date(
      year,
      source.getMonth(),
      source.getDate(),
      10,
      0,
      0,
      0,
    );

    // Keep February 29 anniversaries in February
    // when the target year is not a leap year.
    if (
      source.getMonth() === 1 &&
      source.getDate() === 29 &&
      target.getMonth() !== 1
    ) {
      target.setDate(0);
    }

    return target;
  };

  let target = createTarget(now.getFullYear());

  if (target.getTime() <= now.getTime()) {
    target = createTarget(now.getFullYear() + 1);
  }

  return target;
}

async function scheduleOnThisDayNotifications(memories = []) {
  const currentYear = new Date().getFullYear();

  const candidates = (
    Array.isArray(memories) ? memories : []
  )
    .map((memory) => ({
      memory,
      date: getMemoryDate(memory),
      memoryId: getMemoryId(memory),
    }))
    .filter(({ date, memoryId }) => {
      if (!date || !memoryId) {
        return false;
      }

      const parsed = new Date(date);

      return (
        !Number.isNaN(parsed.getTime()) &&
        parsed.getFullYear() < currentYear
      );
    })
    .map((candidate) => ({
      ...candidate,
      target: getNextAnniversary(candidate.date),
    }))
    .filter((candidate) => candidate.target)
    .sort(
      (a, b) =>
        a.target.getTime() - b.target.getTime(),
    );

  const seenDays = new Set();
  let scheduled = 0;

  for (const { memory, date, memoryId, target } of candidates) {
    if (scheduled >= 10) {
      break;
    }

    const source = new Date(date);
    const dayKey = `${source.getMonth()}-${source.getDate()}`;

    if (seenDays.has(dayKey)) {
      continue;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "On This Day",
        body: getMemoryTitle(memory),
        data: {
          type: NOTIFICATION_TYPES.ON_THIS_DAY,
          memoryId,
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

async function scheduleDailyAndOnThisDay(memories = []) {
  const dailyId = await scheduleDailyMemoryReminder();
  const onThisDayCount =
    await scheduleOnThisDayNotifications(memories);

  return {
    dailyId,
    onThisDayCount,
  };
}

export async function scheduleDailyMemoryReminderAndOnThisDay(
  memories = [],
) {
  const enabled = await isNotificationsEnabled();

  if (!enabled) {
    return {
      enabled: false,
      notificationsDisabled: true,
    };
  }

  const permitted = await hasNotificationPermission();

  if (!permitted) {
    return {
      enabled: false,
      permissionDenied: true,
    };
  }

  await configureNotifications();

  await cancelScheduledNotificationTypes([
    NOTIFICATION_TYPES.DAILY,
    NOTIFICATION_TYPES.ON_THIS_DAY,
  ]);

  const scheduled = await scheduleDailyAndOnThisDay(
    memories,
  );

  return {
    enabled: true,
    permissionDenied: false,
    ...scheduled,
  };
}

export async function scheduleMemoryReminder(
  memory,
  reminderDate,
) {
  const memoryId = getMemoryId(memory);

  if (!memoryId) {
    throw new Error(
      "A valid memory ID is required to schedule a reminder.",
    );
  }

  const date = new Date(reminderDate);

  if (
    Number.isNaN(date.getTime()) ||
    date.getTime() <= Date.now()
  ) {
    throw new Error(
      "Please select a reminder date and time in the future.",
    );
  }

  const enabled = await isNotificationsEnabled();

  if (!enabled) {
    return {
      scheduled: false,
      notificationsDisabled: true,
    };
  }

  const permitted = await hasNotificationPermission();

  if (!permitted) {
    return {
      scheduled: false,
      permissionDenied: true,
    };
  }

  await configureNotifications();

  const reminders = await getReminderStore();
  const existing = reminders[memoryId];

  const scheduled = await getMementoScheduledNotifications();

  const existingNotifications = scheduled.filter(
    (notification) =>
      notification.content?.data?.type ===
        NOTIFICATION_TYPES.MEMORY_REMINDER &&
      String(notification.content?.data?.memoryId) ===
        memoryId,
  );

  const title = getMemoryTitle(memory);

  const notificationId =
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Memory Reminder",
        body: `Revisit your memory: ${title}`,
        data: {
          type: NOTIFICATION_TYPES.MEMORY_REMINDER,
          memoryId,
        },
        sound: undefined,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: NOTIFICATION_CHANNEL_ID,
      },
    });

  reminders[memoryId] = {
    memoryId,
    title,
    scheduledAt: date.toISOString(),
    notificationId,
  };

  try {
    await saveReminderStore(reminders);
  } catch (error) {
    await Notifications.cancelScheduledNotificationAsync(
      notificationId,
    );

    throw error;
  }

  const previousIds = new Set(
    existingNotifications
      .map((notification) => notification.identifier)
      .filter((id) => id !== notificationId),
  );

  if (existing?.notificationId) {
    previousIds.add(existing.notificationId);
  }

  await Promise.all(
    [...previousIds].map((id) =>
      Notifications.cancelScheduledNotificationAsync(id),
    ),
  );

  return {
    scheduled: true,
    memoryId,
    notificationId,
    scheduledAt: date.toISOString(),
  };
}

export async function cancelMemoryReminder(memoryId) {
  if (!memoryId) {
    return false;
  }

  const normalizedId = String(memoryId);
  const reminders = await getReminderStore();
  const scheduled = await getMementoScheduledNotifications();

  const matching = scheduled.filter(
    (notification) =>
      notification.content?.data?.type ===
        NOTIFICATION_TYPES.MEMORY_REMINDER &&
      String(notification.content?.data?.memoryId) ===
        normalizedId,
  );

  await Promise.all(
    matching.map((notification) =>
      Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      ),
    ),
  );

  delete reminders[normalizedId];
  await saveReminderStore(reminders);

  return true;
}

export async function getMemoryReminder(memoryId) {
  if (!memoryId) {
    return null;
  }

  const reminders = await getReminderStore();

  return reminders[String(memoryId)] || null;
}

export async function getScheduledMemoryReminders() {
  const reminders = await getReminderStore();

  return Object.values(reminders).sort(
    (a, b) =>
      new Date(a.scheduledAt).getTime() -
      new Date(b.scheduledAt).getTime(),
  );
}

async function rescheduleSavedMemoryReminders() {
  const reminders = await getReminderStore();

  const scheduled =
    await getMementoScheduledNotifications();

  const pendingByMemoryId = new Map();
  let changed = false;
  for (const notification of scheduled) {
    if (
      notification.content?.data?.type !==
      NOTIFICATION_TYPES.MEMORY_REMINDER
    ) {
      continue;
    }

    const memoryId = String(
      notification.content?.data?.memoryId || "",
    );

    const hasSavedReminder =
      Boolean(memoryId) &&
      Object.prototype.hasOwnProperty.call(
        reminders,
        memoryId,
      );

    if (!hasSavedReminder) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      );

      continue;
    }

    const existing =
      pendingByMemoryId.get(memoryId) || [];

    existing.push(notification);

    pendingByMemoryId.set(memoryId, existing);
  }

  for (const [memoryId, reminder] of Object.entries(
    reminders,
  )) {
    const date = new Date(reminder.scheduledAt);

    // Remove expired or invalid reminder records.
    if (
      Number.isNaN(date.getTime()) ||
      date.getTime() <= Date.now()
    ) {
      delete reminders[memoryId];
      changed = true;

      const expired =
        pendingByMemoryId.get(memoryId) || [];

      await Promise.all(
        expired.map((notification) =>
          Notifications.cancelScheduledNotificationAsync(
            notification.identifier,
          ),
        ),
      );

      continue;
    }

    const pending =
      pendingByMemoryId.get(memoryId) || [];

    // Keep one scheduled notification and cancel duplicates.
    if (pending.length > 0) {
      const [keep, ...duplicates] = pending;

      await Promise.all(
        duplicates.map((notification) =>
          Notifications.cancelScheduledNotificationAsync(
            notification.identifier,
          ),
        ),
      );

      if (reminder.notificationId !== keep.identifier) {
        reminders[memoryId] = {
          ...reminder,
          notificationId: keep.identifier,
        };

        changed = true;
      }

      continue;
    }

    // The reminder is saved but was not scheduled on the
    // device, so recreate it.
    const notificationId =
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Memory Reminder",
          body: `Revisit your memory: ${reminder.title}`,
          data: {
            type: NOTIFICATION_TYPES.MEMORY_REMINDER,
            memoryId,
          },
          sound: undefined,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date,
          channelId: NOTIFICATION_CHANNEL_ID,
        },
      });

    reminders[memoryId] = {
      ...reminder,
      notificationId,
    };

    changed = true;
  }

  if (changed) {
    await saveReminderStore(reminders);
  }
}

export async function setNotificationsEnabled(
  enabled,
  memories = [],
) {
  if (!enabled) {
    await AsyncStorage.setItem(
      NOTIFICATIONS_ENABLED_KEY,
      "false",
    );

    await cancelAllMemoryNotifications();

    return {
      enabled: false,
      permissionDenied: false,
    };
  }

  const permission = await requestNotificationPermission();

  if (!permission.granted && permission.status !== "granted") {
    await AsyncStorage.setItem(
      NOTIFICATIONS_ENABLED_KEY,
      "false",
    );

    await cancelAllMemoryNotifications();

    return {
      enabled: false,
      permissionDenied: true,
    };
  }

  await AsyncStorage.setItem(
    NOTIFICATIONS_ENABLED_KEY,
    "true",
  );

  await cancelScheduledNotificationTypes([
    NOTIFICATION_TYPES.DAILY,
    NOTIFICATION_TYPES.ON_THIS_DAY,
  ]);

  await configureNotifications();

  const scheduled = await scheduleDailyAndOnThisDay(memories);

  await rescheduleSavedMemoryReminders();

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

  const permitted = await hasNotificationPermission();

  if (!permitted) {
    return {
      enabled: false,
      permissionDenied: true,
    };
  }

  await configureNotifications();

  await cancelScheduledNotificationTypes([
    NOTIFICATION_TYPES.DAILY,
    NOTIFICATION_TYPES.ON_THIS_DAY,
  ]);

  const scheduled = await scheduleDailyAndOnThisDay(memories);

  await rescheduleSavedMemoryReminders();

  return {
    enabled: true,
    permissionDenied: false,
    ...scheduled,
  };
}
