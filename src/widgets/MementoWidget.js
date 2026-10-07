import { FlexWidget, TextWidget } from "react-native-android-widget";

export function MementoWidget({ memories = 0, latestTitle = "Your memories" }) {
  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        justifyContent: "space-between",
      }}
      accessibilityLabel="Memento memory widget"
    >
      <TextWidget
        text="MEMENTO"
        style={{
          fontSize: 11,
          fontWeight: "bold",
          color: "#34345C",
        }}
      />

      <TextWidget
        text={latestTitle || "Your memories"}
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#242424",
        }}
        maxLines={2}
      />

      <TextWidget
        text={`${memories} memories saved`}
        style={{
          fontSize: 11,
          color: "#888793",
        }}
      />
    </FlexWidget>
  );
}
