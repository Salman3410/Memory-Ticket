
import React from "react";

import {
  FlexWidget,
  ImageWidget,
  TextWidget,
} from "react-native-android-widget";

function formatWidgetDate(value) {
  if (!value) {
    return "A moment to remember";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "A moment to remember";
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function MementoMemoryWidget({
  memory = null,
}) {
  const memoryId = memory?.id
    ? String(memory.id)
    : null;

  const title =
    memory?.title?.trim() || "Your next memory";

  const date = formatWidgetDate(
    memory?.date || memory?.createdAt,
  );

  const remoteImage =
    typeof memory?.imageUrl === "string" &&
    /^https?:\/\//i.test(memory.imageUrl)
      ? memory.imageUrl
      : null;

  const deepLink = memoryId
    ? `memento://memory/${encodeURIComponent(memoryId)}`
    : null;

  return (
    <FlexWidget
      clickAction={deepLink ? "OPEN_URI" : "OPEN_APP"}
      clickActionData={
        deepLink
          ? { uri: deepLink }
          : undefined
      }
      accessibilityLabel={
        memoryId
          ? `Open memory: ${title}`
          : "Open Memento"
      }
      style={{
        width: "match_parent",
        height: "match_parent",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#34345C",
        borderRadius: 18,
        padding: 12,
        overflow: "hidden",
      }}
    >
      {remoteImage ? (
        <ImageWidget
          image={remoteImage}
          imageWidth={76}
          imageHeight={76}
          resizeMode="cover"
          radius={12}
          style={{
            marginRight: 12,
          }}
        />
      ) : (
        <FlexWidget
          style={{
            width: 76,
            height: 76,
            backgroundColor: "#E76F51",
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <TextWidget
            text="M"
            style={{
              color: "#FFFFFF",
              fontSize: 34,
              fontWeight: "800",
              textAlign: "center",
            }}
          />

          <TextWidget
            text="TICKET"
            style={{
              color: "#FFFFFF",
              fontSize: 9,
              fontWeight: "700",
              letterSpacing: 1.5,
            }}
          />
        </FlexWidget>
      )}

      <FlexWidget
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <TextWidget
          text="MEMENTO  •  MEMORY TICKET"
          maxLines={1}
          truncate="END"
          style={{
            color: "#F3B39F",
            fontSize: 9,
            fontWeight: "800",
            letterSpacing: 1,
            marginBottom: 6,
          }}
        />

        <TextWidget
          text={title}
          maxLines={2}
          truncate="END"
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "700",
            lineHeight: 19,
          }}
        />

        <TextWidget
          text={date}
          maxLines={1}
          truncate="END"
          style={{
            color: "#D8D5E8",
            fontSize: 11,
            marginTop: 7,
          }}
        />

        <TextWidget
          text={
            memoryId
              ? "TAP TO RELIVE"
              : "OPEN MEMENTO"
          }
          maxLines={1}
          style={{
            color: "#F3B39F",
            fontSize: 9,
            fontWeight: "800",
            letterSpacing: 1,
            marginTop: 9,
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
