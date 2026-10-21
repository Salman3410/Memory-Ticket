
import { Platform } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  requestWidgetUpdate,
} from "react-native-android-widget";

import {
  MementoMemoryWidget,
} from "../widgets/MementoMemoryWidget";

const WIDGET_NAME = "Memento";

const WIDGET_MEMORY_KEY =
  "@memento/android_widget/latest_memory_v1";

function getRemoteImageUrl(memory) {
  const candidates = [
    memory?.imageUrl,
    memory?.thumbnailUrl,
    memory?.image,
    ...(Array.isArray(memory?.images)
      ? memory.images
      : []),
  ];

  return (
    candidates.find(
      (value) =>
        typeof value === "string" &&
        /^https?:\/\//i.test(value),
    ) || null
  );
}

function createWidgetSnapshot(memory) {
  if (!memory) {
    return null;
  }

  const id =
    memory.id ||
    memory._id ||
    memory.clientMemoryId;

  return {
    id: id ? String(id) : null,
    title: memory.title || "Your next memory",
    date: memory.date || memory.createdAt || null,
    imageUrl: getRemoteImageUrl(memory),
  };
}

export async function getMemoryWidgetSnapshot() {
  if (Platform.OS !== "android") {
    return null;
  }

  try {
    const stored = await AsyncStorage.getItem(
      WIDGET_MEMORY_KEY,
    );

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.warn(
      "Unable to read the Memento widget snapshot:",
      error,
    );

    return null;
  }
}

export async function refreshMementoWidget(memory) {
  if (Platform.OS !== "android") {
    return;
  }

  const snapshot = createWidgetSnapshot(memory);

  try {
    const previousValue = await AsyncStorage.getItem(
      WIDGET_MEMORY_KEY,
    );

    const nextValue = snapshot
      ? JSON.stringify(snapshot)
      : null;

    if (previousValue !== nextValue) {
      if (nextValue) {
        await AsyncStorage.setItem(
          WIDGET_MEMORY_KEY,
          nextValue,
        );
      } else {
        await AsyncStorage.removeItem(
          WIDGET_MEMORY_KEY,
        );
      }
    }

    await requestWidgetUpdate({
      widgetName: WIDGET_NAME,

      renderWidget: () => (
        <MementoMemoryWidget memory={snapshot} />
      ),

      widgetNotFound: () => {
      },
    });
  } catch (error) {
    console.warn(
      "Unable to refresh the Memento widget:",
      error,
    );
  }
}
