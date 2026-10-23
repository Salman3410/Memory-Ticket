
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

  // Shorter format for the compact 2x1 widget.
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

export function MementoMemoryWidget({ memory = null }) {
  const rawId = memory?._id ?? memory?.id;

  const memoryId =
    rawId != null ? String(rawId) : null;

  const title =
    typeof memory?.title === "string" &&
    memory.title.trim()
      ? memory.title.trim()
      : "Your next memory";

  const date = formatWidgetDate(
    memory?.date || memory?.createdAt
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
        deepLink ? { uri: deepLink } : undefined
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
        justifyContent: "flex-start",
        backgroundColor: "#34345C",
        borderRadius: 18,
        padding: 8,
        overflow: "hidden",
      }}
    >
      {/* LEFT: Memory thumbnail */}
      {remoteImage ? (
        <ImageWidget
          image={remoteImage}
          imageWidth={40}
          imageHeight={40}
          resizeMode="cover"
          radius={10}
          style={{
            marginRight: 8,
          }}
        />
      ) : (
        <FlexWidget
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: "#E76F51",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 8,
          }}
        >
          <TextWidget
            text="✦"
            style={{
              color: "#FFFFFF",
              fontSize: 23,
              fontWeight: "700",
            }}
          />
        </FlexWidget>
      )}

      {/* RIGHT: Flexible content column */}
      <FlexWidget
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "center",
          minWidth: 0,
        }}
      >
        {/* Compact brand header */}
        <FlexWidget
          style={{
            width: "match_parent",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <TextWidget
            text="MEMENTO"
            maxLines={1}
            truncate="END"
            style={{
              color: "#F3B39F",
              fontSize: 8,
              fontWeight: "800",
              letterSpacing: 0.5,
            }}
          />

          <TextWidget
            text="↗"
            style={{
              color: "#E76F51",
              fontSize: 12,
              fontWeight: "800",
            }}
          />
        </FlexWidget>

        {/* Memory title: never push outside the widget */}
        <TextWidget
          text={title}
          maxLines={1}
          truncate="END"
          style={{
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: "800",
            lineHeight: 15,
            flexShrink: 1,
          }}
        />

        {/* Short date keeps the row compact */}
        <TextWidget
          text={date}
          maxLines={1}
          truncate="END"
          style={{
            color: "#D8D5E8",
            fontSize: 9,
            lineHeight: 11,
            marginTop: 2,
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
