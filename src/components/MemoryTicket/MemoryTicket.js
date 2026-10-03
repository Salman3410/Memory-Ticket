import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getMemoryThumbnailUrl } from "../../utils/cloudinary";
import { normalizeTicketCustomization } from "../../utils/ticketCustomization";
import styles from "./memoryTicketStyles";

const TICKET_DESIGNS = {
  classic: {
    background: require("../../../assets/tickets/classic.png"),

    colors: {
      primary: "#FFFFFF",
      secondary: "#0B1325",
      muted: "rgba(255,255,255,0.78)",
      border: "rgba(255,255,255,0.55)",
    },
  },
};

const formatDate = (value) => {
  if (!value) {
    return "DATE NOT SET";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "DATE NOT SET";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function MemoryTicket({
  memory,
  onPress,
  compact = false,
  image = null,
  ticketNumber = null,
  ticketTemplate = null,
}) {
  const [imageWidth, setImageWidth] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  if (!memory) {
    return null;
  }

  const customization = useMemo(
    () => normalizeTicketCustomization(memory || {}),
    [memory],
  );

  const {
    showLocation,
    showDate,
    showDescription,
    showTicketNumber,
  } = customization.ticketOptions;

  const selectedTemplate =
    ticketTemplate ||
    memory.ticketTemplate ||
    "classic";

  const ticketDesign =
    TICKET_DESIGNS[selectedTemplate] ||
    TICKET_DESIGNS.classic;

  const {
    background,
    colors,
  } = ticketDesign;

  const title = memory.title || "UNTITLED MEMORY";

  const location =
    memory.location?.trim() ||
    "UNKNOWN";

  const date = formatDate(
    memory.createdAt || memory.date,
  );

  const time = memory.time || "";

  const description =
    memory.description?.trim() || "";

  const resolvedTicketNumber =
    ticketNumber ||
    memory.ticketNumber ||
    memory.id?.toString().slice(-6) ||
    "000000";

  const images = Array.isArray(memory.images)
    ? memory.images
    : memory.image
      ? [memory.image]
      : [];

  const isSingleImageMode = Boolean(image);

  const displayImages = isSingleImageMode
    ? [image]
    : images;

  const displayImageSources = useMemo(
    () =>
      displayImages.map((imageUri) =>
        getMemoryThumbnailUrl(imageUri),
      ),
    [displayImages],
  );

  const tags = Array.isArray(memory.tags)
    ? [
        ...new Set(
          memory.tags
            .filter(
              (tag) => typeof tag === "string",
            )
            .map((tag) =>
              tag
                .trim()
                .replace(/^#+/, "")
                .toLowerCase(),
            )
            .filter(Boolean),
        ),
      ]
    : [];

  const handleImagePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const handleImageLayout = useCallback(
    (event) => {
      const width =
        event.nativeEvent.layout.width;

      if (width && width !== imageWidth) {
        setImageWidth(width);
      }
    },
    [imageWidth],
  );

  return (
    <View
      style={[
        styles.ticketFrame,
        compact && styles.ticketCompact,
      ]}
    >

      {/* BACKGROUND DESIGN */}
      <Image
        source={background}
        resizeMode="stretch"
        style={styles.ticketBackground}
      />

      {/* CONTENT */}

      <View style={styles.ticketContent}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text
              style={[
                styles.brandText,
                {
                  color: colors.secondary,
                },
              ]}
            >
              MEMENTO
            </Text>

            <Text
              style={[
                styles.brandSubText,
                {
                  color: colors.muted,
                },
              ]}
            >
              MEMORY TICKET
            </Text>
          </View>

          <Ionicons
            name="ticket-outline"
            size={22}
            color={colors.secondary}
          />
        </View>

        {/* MEMORY IMAGE */}

        <View
          style={styles.imageSection}
          onLayout={handleImageLayout}
        >
          {displayImageSources.length > 0 ? (
            isSingleImageMode ? (
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={handleImagePress}
                disabled={!onPress}
                style={styles.imageTouchable}
              >
                <Image
                  source={{
                    uri: displayImageSources[0],
                  }}
                  style={styles.ticketImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ) : (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled
                onMomentumScrollEnd={(event) => {
                  if (!imageWidth) {
                    return;
                  }

                  const index = Math.round(
                    event.nativeEvent.contentOffset.x /
                      imageWidth,
                  );

                  setActiveImage(index);
                }}
              >
                {displayImageSources.map(
                  (imageUri, index) => (
                    <View
                      key={`${imageUri}-${index}`}
                      style={[
                        styles.ticketImageSlide,
                        imageWidth
                          ? {
                              width: imageWidth,
                            }
                          : null,
                      ]}
                    >
                      <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={
                          handleImagePress
                        }
                        disabled={!onPress}
                        style={
                          styles.imageTouchable
                        }
                      >
                        <Image
                          source={{
                            uri: imageUri,
                          }}
                          style={styles.ticketImage}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    </View>
                  ),
                )}
              </ScrollView>
            )
          ) : (
            <View
              style={styles.noImage}
            >
              <Ionicons
                name="image-outline"
                size={38}
                color={colors.secondary}
              />

              <Text
                style={[
                  styles.noImageText,
                  {
                    color: colors.secondary,
                  },
                ]}
              >
                NO IMAGE
              </Text>
            </View>
          )}

          {/* IMAGE COUNTER */}

          {!isSingleImageMode &&
            displayImages.length > 1 && (
              <View
                style={styles.imageCounter}
              >
                <Text
                  style={styles.imageCounterText}
                >
                  {activeImage + 1}/
                  {displayImages.length}
                </Text>
              </View>
            )}

          {/* IMAGE DOTS */}

          {!isSingleImageMode &&
            displayImages.length > 1 && (
              <View
                style={styles.imageDots}
              >
                {displayImages.map(
                  (_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.imageDot,
                        index ===
                          activeImage &&
                          styles.imageDotActive,
                      ]}
                    />
                  ),
                )}
              </View>
            )}
        </View>

        {/* TITLE */}

        <View style={styles.titleSection}>
          <Text
            style={[
              styles.ticketTitle,
              {
                color: colors.primary,
              },
            ]}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
          >
            {title}
          </Text>
        </View>

        {/* TAGS */}

        {tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.slice(0, 4).map((tag) => (
              <View
                key={tag}
                style={[
                  styles.tagChip,
                  {
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    {
                      color:
                        colors.secondary,
                    },
                  ]}
                  numberOfLines={1}
                >
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* DESCRIPTION */}

        {showDescription &&
          description && (
            <View
              style={styles.descriptionSection}
            >
              <Text
                style={[
                  styles.descriptionLabel,
                  {
                    color:
                      colors.secondary,
                  },
                ]}
              >
                THE STORY
              </Text>

              <Text
                style={[
                  styles.descriptionText,
                  {
                    color:
                      colors.primary,
                  },
                ]}
                numberOfLines={3}
              >
                {description}
              </Text>
            </View>
          )}

        {/* INFORMATION */}

        {(showLocation || showDate) && (
          <View style={styles.infoSection}>
            {showLocation && (
              <View style={styles.infoBlock}>
                <Text
                  style={[
                    styles.infoLabel,
                    {
                      color:
                        colors.secondary,
                    },
                  ]}
                >
                  LOCATION
                </Text>

                <Text
                  style={[
                    styles.infoValue,
                    {
                      color:
                        colors.primary,
                    },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}
                >
                  {location}
                </Text>
              </View>
            )}

            {showDate && (
              <View style={styles.infoBlock}>
                <Text
                  style={[
                    styles.infoLabel,
                    {
                      color:
                        colors.secondary,
                    },
                  ]}
                >
                  DATE
                </Text>

                <Text
                  style={[
                    styles.infoValue,
                    {
                      color:
                        colors.primary,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {date}
                </Text>
              </View>
            )}

            {showDate && time ? (
              <View style={styles.infoBlock}>
                <Text
                  style={[
                    styles.infoLabel,
                    {
                      color:
                        colors.secondary,
                    },
                  ]}
                >
                  TIME
                </Text>

                <Text
                  style={[
                    styles.infoValue,
                    {
                      color:
                        colors.primary,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {time}
                </Text>
              </View>
            ) : null}
          </View>
        )}

        {/* FOOTER */}

        <View style={styles.footer}>
          {showTicketNumber && (
            <View
              style={styles.ticketNumberContainer}
            >
              <Text
                style={[
                  styles.ticketNumberLabel,
                  {
                    color:
                      colors.secondary,
                  },
                ]}
              >
                TICKET NO.
              </Text>

              <Text
                style={[
                  styles.ticketNumber,
                  {
                    color:
                      colors.primary,
                  },
                ]}
              >
                {resolvedTicketNumber}
              </Text>
            </View>
          )}

          {/* BARCODE */}

          <View
            style={[
              styles.barcode,
              !showTicketNumber &&
                styles.barcodeFull,
            ]}
          >
            {Array.from({
              length: 30,
            }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.bar,
                  {
                    backgroundColor:
                      colors.primary,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

export default React.memo(MemoryTicket);