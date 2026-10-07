import React from "react";
import {
  registerWidgetTaskHandler,
} from "react-native-android-widget";
import { MementoWidget } from "./MementoWidget";

export async function widgetTaskHandler(props) {
  switch (props.widgetAction) {
    case "WIDGET_UPDATE":
    case "WIDGET_ADDED":
    case "WIDGET_RESIZED":
      props.renderWidget(
        <MementoWidget
          memories={0}
          latestTitle="Open Memento to see your memories"
        />,
      );
      break;

    case "WIDGET_DELETED":
      break;

    default:
      break;
  }
}

registerWidgetTaskHandler(widgetTaskHandler);
