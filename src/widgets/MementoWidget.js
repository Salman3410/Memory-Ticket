'use no memo';
import React from "react";
import { FlexWidget, TextWidget } from "react-native-android-widget";

export function MementoWidget({
  memories = 0,
  latestTitle = "Your memories",
  latestDate = "",
}) {
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
      <FlexWidget
        style={{
          height: "wrap_content",
          width: "wrap_content",
        }}
        clickAction="OPEN_APP"
      >
        <TextWidget
          text="MEMENTO"
          style={{
            fontSize: 11,
            fontWeight: "bold",
            color: "#34345C",
          }}
        />
      </FlexWidget>

      <FlexWidget
        style={{
          height: "wrap_content",
          width: "match_parent",
        }}
        clickAction="OPEN_APP"
      >
        <TextWidget
          text={latestTitle || "No memories yet"}
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#242424",
          }}
          maxLines={2}
        />

        {latestDate ? (
          <TextWidget
            text={latestDate}
            style={{
              fontSize: 10,
              color: "#888793",
            }}
          />
        ) : null}
      </FlexWidget>

      <FlexWidget
        style={{
          height: "wrap_content",
          width: "wrap_content",
        }}
        clickAction="OPEN_APP"
      >
        <TextWidget
          text={`${memories} memories saved`}
          style={{
            fontSize: 11,
            color: "#888793",
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
