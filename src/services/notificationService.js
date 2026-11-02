
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const NOTIFICATIONS_ENABLED_KEY = "notificationsEnabled";

const NOTIFICATION_CHANNEL_ID = "memento-default";
const LEGACY_MEMORY_REMINDERS_KEY = "mementoMemoryReminders";
const MEMORY_REMINDERS_KEY_PREFIX = "mementoMemoryReminders:";

const NOTIFICATION_TYPES = {
  DAILY: "DAILY_MEMORY_REMINDER",
  ON_THIS_DAY: "ON_THIS_DAY",
  MEMORY_REMINDER: "MEMORY_REMINDER",
};

const ALL_MEMENTO_NOTIFICATION_TYPES = Object.values(
  NOTIFICATION_TYPES,
);

const NOTIFICATION_TYPE_SET = new Set(
  ALL_MEMENTO_NOTIFICATION_TYPES,
);

const requireAccountId = (accountId) => {
  if (
    accountId === null ||
    accountId === undefined ||
    String(accountId).trim() === ""
  ) {
    throw new Error(
      "A valid account ID is required for memory notifications.",
    );
  }

  return String(accountId).trim();
};

const getReminderStorageKey = (accountId) =>
  `${MEMORY_REMINDERS_KEY_PREFIX}${encodeURIComponent(
    requireAccountId(accountId),
  )}`;

const getNotificationOwner = (notification) => {
  const owner =
    notification?.content?.data?.ownerAccountId;

  return owner === undefined || owner === null
    ? null
    : String(owner);
};

const isMementoNotification = (notification) =>
  NOTIFICATION_TYPE_SET.has(
    notification?.content?.data?.type,
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
  const permissions =
    await Notifications.getPermissionsAsync();

  return permissions.status;
}

export async function requestNotificationPermission() {
  await configureNotifications();

  const current =
    await Notifications.getPermissionsAsync();

  if (
    current.granted ||
    current.status === "granted"
  ) {
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
  const permission =
    await Notifications.getPermissionsAsync();

  return Boolean(
    permission.granted ||
      permission.status === "granted",
  );
}

async function getReminderStore(accountId) {
  const storageKey =
    getReminderStorageKey(accountId);

  try {
    const value =
      await AsyncStorage.getItem(storageKey);

    if (!value) {
      return {};
    }

    const parsed = JSON.parse(value);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return {};
    }

    const reminders = {};

    for (const [memoryId, reminder] of Object.entries(
      parsed,
    )) {
      if (
        !reminder ||
        typeof reminder !== "object"
      ) {
        continue;
      }

      if (
        reminder.ownerAccountId &&
        String(reminder.ownerAccountId) !==
          requireAccountId(accountId)
      ) {
        continue;
      }

      reminders[memoryId] = {
        ...reminder,
        ownerAccountId: requireAccountId(accountId),
      };
    }

    return reminders;
  } catch (error) {
    console.error(
      "Unable to read account memory reminders:",
      error,
    );

    return {};
  }
}

async function saveReminderStore(
  accountId,
  reminders,
) {
  const normalizedAccountId =
    requireAccountId(accountId);

  const safeReminders = {};

  for (const [memoryId, reminder] of Object.entries(
    reminders || {},
  )) {
    if (
      !reminder ||
      typeof reminder !== "object"
    ) {
      continue;
    }

    if (
      reminder.ownerAccountId &&
      String(reminder.ownerAccountId) !==
        normalizedAccountId
    ) {
      throw new Error(
        "Cannot save a reminder belonging to another account.",
      );
    }

    safeReminders[memoryId] = {
      ...reminder,
      ownerAccountId: normalizedAccountId,
    };
  }

  await AsyncStorage.setItem(
    getReminderStorageKey(normalizedAccountId),
    JSON.stringify(safeReminders),
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

async function cancelNotificationsWhere(predicate) {
  const scheduled =
    await getMementoScheduledNotifications();

  const matching = scheduled.filter(predicate);

  await Promise.all(
    matching.map((notification) =>
      Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      ),
    ),
  );

  return matching.length;
}

async function cancelScheduledNotificationTypes(
  types,
  accountId,
) {
  const normalizedAccountId =
    requireAccountId(accountId);

  const typeSet = new Set(types);

  return cancelNotificationsWhere(
    (notification) =>
      typeSet.has(
        notification.content?.data?.type,
      ) &&
      getNotificationOwner(notification) ===
        normalizedAccountId,
  );
}

async function cancelNotificationsOwnedByAccount(
  accountId,
) {
  const normalizedAccountId =
    requireAccountId(accountId);

  return cancelNotificationsWhere(
    (notification) =>
      isMementoNotification(notification) &&
      getNotificationOwner(notification) ===
        normalizedAccountId,
  );
}

async function cancelNotificationsNotOwnedByAccount(
  accountId,
) {
  const normalizedAccountId =
    requireAccountId(accountId);

  return cancelNotificationsWhere(
    (notification) =>
      isMementoNotification(notification) &&
      getNotificationOwner(notification) !==
        normalizedAccountId,
  );
}

export async function cancelAllScheduledMemoryNotifications() {
  return cancelNotificationsWhere(
    isMementoNotification,
  );
}

export async function cancelAllMemoryNotifications(
  accountId = null,
) {
  if (
    accountId === null ||
    accountId === undefined
  ) {
    return cancelAllScheduledMemoryNotifications();
  }

  return cancelAccountMemoryNotifications(accountId);
}

export async function cancelAccountMemoryNotifications(
  accountId,
) {
  const normalizedAccountId =
    requireAccountId(accountId);

  return cancelNotificationsWhere(
    (notification) => {
      if (!isMementoNotification(notification)) {
        return false;
      }

      const owner =
        getNotificationOwner(notification);

      return (
        owner === normalizedAccountId ||
        owner === null
      );
    },
  );
}

export async function clearAccountMemoryNotifications(
  accountId,
) {
  const normalizedAccountId =
    requireAccountId(accountId);

  await cancelAccountMemoryNotifications(
    normalizedAccountId,
  );

  await AsyncStorage.removeItem(
    getReminderStorageKey(normalizedAccountId),
  );

  return {
    success: true,
    accountId: normalizedAccountId,
  };
}

async function scheduleDailyMemoryReminder(
  accountId,
  hour = 20,
  minute = 0,
) {
  const normalizedAccountId =
    requireAccountId(accountId);

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Memento",
      body: "Take a moment to save today's memory.",
      data: {
        type: NOTIFICATION_TYPES.DAILY,
        ownerAccountId: normalizedAccountId,
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

async function scheduleOnThisDayNotifications(
  accountId,
  memories = [],
) {
  const normalizedAccountId =
    requireAccountId(accountId);

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

  for (const {
    memory,
    date,
    memoryId,
    target,
  } of candidates) {
    if (scheduled >= 10) {
      break;
    }

    const source = new Date(date);

    const dayKey =
      `${source.getMonth()}-${source.getDate()}`;

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
          ownerAccountId: normalizedAccountId,
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

async function scheduleDailyAndOnThisDay(
  accountId,
  memories = [],
) {
  const dailyId =
    await scheduleDailyMemoryReminder(accountId);

  const onThisDayCount =
    await scheduleOnThisDayNotifications(
      accountId,
      memories,
    );

  return {
    dailyId,
    onThisDayCount,
  };
}

export async function scheduleDailyMemoryReminderAndOnThisDay(
  accountId,
  memories = [],
) {
  return activateAccountMemoryNotifications(
    accountId,
    memories,
  );
}

export async function scheduleMemoryReminder(
  accountId,
  memory,
  reminderDate,
) {
  const normalizedAccountId =
    requireAccountId(accountId);

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

  const permitted =
    await hasNotificationPermission();

  if (!permitted) {
    return {
      scheduled: false,
      permissionDenied: true,
    };
  }

  await configureNotifications();

  const reminders =
    await getReminderStore(normalizedAccountId);

  const existing = reminders[memoryId];

  const scheduled =
    await getMementoScheduledNotifications();

  const existingNotifications = scheduled.filter(
    (notification) =>
      notification.content?.data?.type ===
        NOTIFICATION_TYPES.MEMORY_REMINDER &&
      String(
        notification.content?.data?.memoryId,
      ) === memoryId &&
      getNotificationOwner(notification) ===
        normalizedAccountId,
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
          ownerAccountId: normalizedAccountId,
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
    ownerAccountId: normalizedAccountId,
  };

  try {
    await saveReminderStore(
      normalizedAccountId,
      reminders,
    );
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

export async function cancelMemoryReminder(
  accountId,
  memoryId,
) {
  const normalizedAccountId =
    requireAccountId(accountId);

  if (!memoryId) {
    return false;
  }

  const normalizedId = String(memoryId);

  const reminders =
    await getReminderStore(normalizedAccountId);

  const scheduled =
    await getMementoScheduledNotifications();

  const matching = scheduled.filter(
    (notification) =>
      notification.content?.data?.type ===
        NOTIFICATION_TYPES.MEMORY_REMINDER &&
      String(
        notification.content?.data?.memoryId,
      ) === normalizedId &&
      getNotificationOwner(notification) ===
        normalizedAccountId,
  );

  await Promise.all(
    matching.map((notification) =>
      Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      ),
    ),
  );

  delete reminders[normalizedId];

  await saveReminderStore(
    normalizedAccountId,
    reminders,
  );

  return true;
}

export async function getMemoryReminder(
  accountId,
  memoryId,
) {
  const normalizedAccountId =
    requireAccountId(accountId);

  if (!memoryId) {
    return null;
  }

  const reminders =
    await getReminderStore(normalizedAccountId);

  return reminders[String(memoryId)] || null;
}

export async function getScheduledMemoryReminders(
  accountId,
) {
  const normalizedAccountId =
    requireAccountId(accountId);

  const reminders =
    await getReminderStore(normalizedAccountId);

  return Object.values(reminders).sort(
    (a, b) =>
      new Date(a.scheduledAt).getTime() -
      new Date(b.scheduledAt).getTime(),
  );
}

async function rescheduleSavedMemoryReminders(
  accountId,
) {
  const normalizedAccountId =
    requireAccountId(accountId);

  const reminders =
    await getReminderStore(normalizedAccountId);

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

    const owner =
      getNotificationOwner(notification);

    if (owner === null) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      );

      continue;
    }

    if (owner !== normalizedAccountId) {
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

    pendingByMemoryId.set(
      memoryId,
      existing,
    );
  }

  for (const [memoryId, reminder] of Object.entries(
    reminders,
  )) {
    if (
      reminder.ownerAccountId &&
      String(reminder.ownerAccountId) !==
        normalizedAccountId
    ) {
      continue;
    }

    const date = new Date(reminder.scheduledAt);

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

    if (pending.length > 0) {
      const [keep, ...duplicates] = pending;

      await Promise.all(
        duplicates.map((notification) =>
          Notifications.cancelScheduledNotificationAsync(
            notification.identifier,
          ),
        ),
      );

      if (
        reminder.notificationId !== keep.identifier
      ) {
        reminders[memoryId] = {
          ...reminder,
          notificationId: keep.identifier,
          ownerAccountId: normalizedAccountId,
        };

        changed = true;
      }

      continue;
    }

    const notificationId =
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Memory Reminder",
          body: `Revisit your memory: ${reminder.title}`,
          data: {
            type: NOTIFICATION_TYPES.MEMORY_REMINDER,
            memoryId,
            ownerAccountId: normalizedAccountId,
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
      ownerAccountId: normalizedAccountId,
    };

    changed = true;
  }

  if (changed) {
    await saveReminderStore(
      normalizedAccountId,
      reminders,
    );
  }

  return Object.keys(reminders).length;
}

export async function activateAccountMemoryNotifications(
  accountId,
  memories = [],
) {
  const normalizedAccountId =
    requireAccountId(accountId);

  await cancelNotificationsNotOwnedByAccount(
    normalizedAccountId,
  );

  const enabled = await isNotificationsEnabled();

  if (!enabled) {
    await cancelNotificationsOwnedByAccount(
      normalizedAccountId,
    );

    return {
      enabled: false,
      notificationsDisabled: true,
    };
  }

  const permitted =
    await hasNotificationPermission();

  if (!permitted) {
    await cancelNotificationsOwnedByAccount(
      normalizedAccountId,
    );

    return {
      enabled: false,
      permissionDenied: true,
    };
  }

  await configureNotifications();

  await cancelScheduledNotificationTypes(
    [
      NOTIFICATION_TYPES.DAILY,
      NOTIFICATION_TYPES.ON_THIS_DAY,
    ],
    normalizedAccountId,
  );

  const scheduled =
    await scheduleDailyAndOnThisDay(
      normalizedAccountId,
      memories,
    );

  const reminderCount =
    await rescheduleSavedMemoryReminders(
      normalizedAccountId,
    );

  return {
    enabled: true,
    permissionDenied: false,
    reminderCount,
    ...scheduled,
  };
}

export async function setNotificationsEnabled(
  enabled,
  memories = [],
  accountId = null,
) {
  if (!enabled) {
    await AsyncStorage.setItem(
      NOTIFICATIONS_ENABLED_KEY,
      "false",
    );

    await cancelAllScheduledMemoryNotifications();

    return {
      enabled: false,
      permissionDenied: false,
    };
  }

  if (!accountId) {
    return {
      enabled: false,
      invalidAccount: true,
    };
  }

  const permission =
    await requestNotificationPermission();

  if (
    !permission.granted &&
    permission.status !== "granted"
  ) {
    await AsyncStorage.setItem(
      NOTIFICATIONS_ENABLED_KEY,
      "false",
    );

    await cancelAllScheduledMemoryNotifications();

    return {
      enabled: false,
      permissionDenied: true,
    };
  }

  await AsyncStorage.setItem(
    NOTIFICATIONS_ENABLED_KEY,
    "true",
  );

  return activateAccountMemoryNotifications(
    accountId,
    memories,
  );
}

export async function syncMemoryNotifications(
  accountId,
  memories = [],
) {
  return activateAccountMemoryNotifications(
    accountId,
    memories,
  );
}

export const LEGACY_NOTIFICATION_STORAGE_KEYS =
  Object.freeze({
    memoryReminders: LEGACY_MEMORY_REMINDERS_KEY,
  });
