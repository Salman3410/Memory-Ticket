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

export function MementoMemoryWidget({ memory = null }) {
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
        flexDirection: "column",
        backgroundColor: "#34345C",
        borderRadius: 22,
        padding: 11,
        overflow: "hidden",
      }}
    >
      {/* Rabbit-inspired header */}
      <FlexWidget
        style={{
          width: "match_parent",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 9,
        }}
      >
        <FlexWidget
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextWidget
            text="🐇"
            style={{
              fontSize: 19,
              marginRight: 5,
            }}
          />

          <TextWidget
            text="MEMENTO"
            style={{
              color: "#FFFFFF",
              fontSize: 10,
              fontWeight: "800",
              letterSpacing: 1,
            }}
          />
        </FlexWidget>

        <FlexWidget
          style={{
            width: 25,
            height: 25,
            borderRadius: 9,
            backgroundColor: "#E76F51",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextWidget
            text="♥"
            style={{
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: "700",
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* Memory thumbnail and information */}
      <FlexWidget
        style={{
          width: "match_parent",
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {remoteImage ? (
          <ImageWidget
            image={remoteImage}
            imageWidth={42}
            imageHeight={48}
            resizeMode="cover"
            radius={9}
            style={{
              marginRight: 8,
            }}
          />
        ) : (
          <FlexWidget
            style={{
              width: 42,
              height: 48,
              borderRadius: 9,
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
                fontSize: 25,
                fontWeight: "700",
              }}
            />
          </FlexWidget>
        )}

        <FlexWidget
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <TextWidget
            text="YOUR MEMORY"
            maxLines={1}
            truncate="END"
            style={{
              color: "#F3B39F",
              fontSize: 8,
              fontWeight: "800",
              letterSpacing: 0.7,
              marginBottom: 4,
            }}
          />

          <TextWidget
            text={title}
            maxLines={2}
            truncate="END"
            style={{
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: "700",
              lineHeight: 15,
            }}
          />

          <TextWidget
            text={date}
            maxLines={1}
            truncate="END"
            style={{
              color: "#D8D5E8",
              fontSize: 9,
              marginTop: 5,
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* Small bottom prompt */}
      <TextWidget
        text={memoryId ? "TAP TO RELIVE ↗" : "OPEN MEMENTO ↗"}
        maxLines={1}
        style={{
          color: "#F3B39F",
          fontSize: 9,
          fontWeight: "800",
          letterSpacing: 0.7,
          marginTop: 7,
        }}
      />
    </FlexWidget>
  );
}
