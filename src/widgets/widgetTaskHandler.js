import {
  getMemoryWidgetSnapshot,
} from "../services/memoryWidgetService";

import {
  MementoMemoryWidget,
} from "./MementoMemoryWidget";

export async function widgetTaskHandler(props) {
  const {
    widgetAction,
    widgetInfo,
    renderWidget,
  } = props;

  if (widgetInfo?.widgetName !== "Memento") {
    return;
  }

  switch (widgetAction) {
    case "WIDGET_ADDED":
    case "WIDGET_UPDATE":
    case "WIDGET_RESIZED": {
      const memory =
        await getMemoryWidgetSnapshot();

      renderWidget(
        <MementoMemoryWidget memory={memory} />,
      );

      break;
    }

    case "WIDGET_DELETED":
    case "WIDGET_CLICK":
    default:
      break;
  }
}
