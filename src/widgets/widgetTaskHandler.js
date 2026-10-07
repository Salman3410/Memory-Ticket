import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { MementoWidget } from "./MementoWidget";
import { MEMENTO_WIDGET_DATA_KEY } from "../services/widgetService";

export async function widgetTaskHandler(props) {
  const readWidgetData = async () => {
    try {
      const raw = await AsyncStorage.getItem(MEMENTO_WIDGET_DATA_KEY);
      const parsed = raw ? JSON.parse(raw) : null;

      return {
        memories: Number(parsed?.memories) || 0,
        latestTitle: parsed?.latestTitle || "No memories yet",
        latestDate: parsed?.latestDate || "",
      };
    } catch {
      return {
        memories: 0,
        latestTitle: "Open Memento to save a memory",
        latestDate: "",
      };
    }
  };

  switch (props.widgetAction) {
    case "WIDGET_UPDATE":
    case "WIDGET_ADDED":
    case "WIDGET_RESIZED": {
      const data = await readWidgetData();

      props.renderWidget(<MementoWidget {...data} />);
      break;
    }

    case "WIDGET_CLICK":
      // The widget body uses OPEN_APP actions, so no app-side click state is required.
      break;

    case "WIDGET_DELETED":
      break;

    default:
      break;
  }
}
