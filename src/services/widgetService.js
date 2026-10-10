import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export const MEMENTO_WIDGET_DATA_KEY = "@memento_widget_data";

function getMemoryDate(memory) {
  return memory?.date || memory?.createdAt || memory?.updatedAt || null;
}

function getTimestamp(memory) {
  const value = getMemoryDate(memory);

  if (!value) return 0;

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getMemoryTitle(memory) {
  return (
    memory?.title ||
    memory?.name ||
    memory?.caption ||
    memory?.description ||
    "Your latest memory"
  );
}

function formatMemoryDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function syncMementoWidget(memories = []) {
  if (Platform.OS !== "android") {
    return;
  }

  const list = Array.isArray(memories) ? memories : [];

  const latest = [...list].sort((a, b) => {
    return getTimestamp(b) - getTimestamp(a);
  })[0];

  const data = {
    memories: list.length,
    latestTitle: latest ? getMemoryTitle(latest) : "No memories yet",
    latestDate: latest ? formatMemoryDate(getMemoryDate(latest)) : "",
  };

  await AsyncStorage.setItem(MEMENTO_WIDGET_DATA_KEY, JSON.stringify(data));

  try {
    const { requestWidgetUpdate } = require("react-native-android-widget");
    const { MementoWidget } = require("../widgets/MementoWidget");

    await requestWidgetUpdate({
      widgetName: "Memento",
      renderWidget: () => <MementoWidget {...data} />,
    });
  } catch (error) {
    console.warn("Memento widget update failed:", error);
  }
}
