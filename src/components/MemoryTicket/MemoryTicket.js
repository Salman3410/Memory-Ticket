import React, { useMemo, useState } from "react";

import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { getMemoryThumbnailUrl } from "../../utils/cloudinary";

import {
  normalizeTicketCustomization,
  getTicketTheme,
} from "../../utils/ticketCustomization";

import styles from "./memoryTicketStyles";

function MemoryTicket({
  memory,
  onPress,
  compact = false,
  image = null,
  ticketNumber = null,
}) {
  const [imageWidth, setImageWidth] = useState(0);

  const [activeImage, setActiveImage] = useState(0);

  const normalizedCustomization = useMemo(
    () => normalizeTicketCustomization(memory || {}),
    [memory],
  );

  const theme = useMemo(
    () => getTicketTheme(normalizedCustomization),
    [normalizedCustomization],
  );

  const isMinimal = normalizedCustomization.ticketStyle === "minimal";

  const isVintage = normalizedCustomization.ticketStyle === "vintage";

  const {
    showLocation,
    showDate,
    showDescription,
    showAdmission,
    showTicketNumber,
  } = normalizedCustomization.ticketOptions;

  const currentMemory = memory || {};

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

  const title = currentMemory.title || "UNTITLED MEMORY";

  const location = currentMemory.location?.trim() || "UNKNOWN";

  const date = formatDate(currentMemory.createdAt || currentMemory.date);

  const time = currentMemory.time || "";

  const description = currentMemory.description?.trim() || "";

  const admission = currentMemory.admission || "X1";

  const resolvedTicketNumber =
    ticketNumber ||
    currentMemory.ticketNumber ||
    currentMemory.id?.toString().slice(-6) ||
    "000000";

  const images = Array.isArray(currentMemory.images)
    ? currentMemory.images
    : currentMemory.image
      ? [currentMemory.image]
      : [];

  const tags = Array.isArray(currentMemory.tags)
    ? [
        ...new Set(
          currentMemory.tags
            .filter((tag) => typeof tag === "string")
            .map((tag) => tag.trim().replace(/^#+/, "").toLowerCase())
            .filter(Boolean),
        ),
      ]
    : [];

  const isSingleImageMode = Boolean(image);

  const displayImages = isSingleImageMode ? [image] : images;

  const displayImageSources = useMemo(() => {
    return displayImages.map((imageUri) => getMemoryThumbnailUrl(imageUri));
  }, [displayImages]);

  if (!memory) {
    return null;
  }

  const handleImagePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const renderPerforation = (position) => {
    return (
      <View
        style={[
          position === "top" ? styles.topPerforation : styles.bottomPerforation,
          {
            backgroundColor: theme.backgroundColor,
          },
        ]}
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.perforationDot,
              {
                backgroundColor: "#F1F0F6",
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const ticketContent = (
    <View
      style={[
        styles.ticket,

        compact && styles.ticketCompact,

        isMinimal && styles.ticketMinimal,

        isVintage && styles.ticketVintage,

        {
          backgroundColor: theme.backgroundColor,

          borderColor: theme.borderColor,
        },
      ]}
    >
      {isMinimal ? (
        <View
          style={[
            styles.minimalRule,
            {
              backgroundColor: theme.accentColor,
            },
          ]}
        />
      ) : (
        renderPerforation("top")
      )}

      <View
        style={[
          styles.ticketBody,
          {
            backgroundColor: theme.backgroundColor,
          },
        ]}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Text
            style={[
              styles.brandText,
              {
                color: theme.accentColor,
              },
            ]}
          >
            MEMENTO
          </Text>

          <Ionicons name="ticket-outline" size={18} color={theme.accentColor} />
        </View>

        {/* IMAGE */}

        <View
          style={[
            styles.ticketImageContainer,
            {
              backgroundColor: theme.imagePlaceholderColor,
            },
          ]}
          onLayout={(event) => {
            const width = event.nativeEvent.layout.width;

            if (width && width !== imageWidth) {
              setImageWidth(width);
            }
          }}
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
                    event.nativeEvent.contentOffset.x / imageWidth,
                  );

                  setActiveImage(index);
                }}
              >
                {displayImageSources.map((imageUri, index) => (
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
                      onPress={handleImagePress}
                      disabled={!onPress}
                      style={styles.imageTouchable}
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
                ))}
              </ScrollView>
            )
          ) : (
            <View style={styles.noImage}>
              <Ionicons
                name="image-outline"
                size={40}
                color={theme.accentColor}
              />

              <Text
                style={[
                  styles.imagePlaceholderText,
                  {
                    color: theme.accentColor,
                  },
                ]}
              >
                NO IMAGE
              </Text>
            </View>
          )}

          {!isSingleImageMode && displayImages.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {activeImage + 1}/{displayImages.length}
              </Text>
            </View>
          )}

          {!isSingleImageMode && displayImages.length > 1 && (
            <View style={styles.imageDots}>
              {displayImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.imageDot,
                    index === activeImage && styles.imageDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* TITLE */}

        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.ticketTitle,
              isMinimal && styles.minimalTitle,
              isVintage && styles.vintageTitle,
              {
                color: theme.textColor,
              },
            ]}
            numberOfLines={2}
          >
            {title}
          </Text>
        </View>

        {/* TAGS */}

        {tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <View
                key={tag}
                style={[
                  styles.tagChip,
                  {
                    borderBottomColor: theme.accentColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    {
                      color: theme.accentColor,
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

        {showDescription && description ? (
          <View style={styles.descriptionContainer}>
            <Text
              style={[
                styles.descriptionLabel,
                {
                  color: theme.accentColor,
                },
              ]}
            >
              THE STORY
            </Text>

            <Text
              style={[
                styles.descriptionText,
                {
                  color: theme.textColor,
                },
              ]}
              numberOfLines={4}
            >
              {description}
            </Text>
          </View>
        ) : null}

        {/* EVENT INFO */}

        {(showLocation || showDate) && (
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              {showLocation && (
                <View style={styles.infoBlock}>
                  <Text
                    style={[
                      styles.infoLabel,
                      {
                        color: theme.accentColor,
                      },
                    ]}
                  >
                    LOCATION
                  </Text>

                  <Text
                    style={[
                      styles.infoValue,
                      {
                        color: theme.textColor,
                      },
                    ]}
                    numberOfLines={1}
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
                        color: theme.accentColor,
                      },
                    ]}
                  >
                    DATE
                  </Text>

                  <Text
                    style={[
                      styles.infoValue,
                      {
                        color: theme.textColor,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {date}
                  </Text>
                </View>
              )}
            </View>

            {showDate && time ? (
              <View style={styles.timeRow}>
                <Text
                  style={[
                    styles.infoLabel,
                    {
                      color: theme.accentColor,
                    },
                  ]}
                >
                  TIME
                </Text>

                <Text
                  style={[
                    styles.infoValue,
                    {
                      color: theme.textColor,
                    },
                  ]}
                >
                  {time}
                </Text>
              </View>
            ) : null}
          </View>
        )}

        {/* ADMISSION */}

        {showAdmission && (
          <View style={styles.admissionSection}>
            <Text
              style={[
                styles.admissionLabel,
                {
                  color: theme.accentColor,
                },
              ]}
            >
              ADMISSION
            </Text>

            <Text
              style={[
                styles.admissionValue,
                {
                  color: theme.textColor,
                },
              ]}
            >
              X{admission.toString().replace(/^X/, "")}
            </Text>
          </View>
        )}

        {/* DIVIDER */}

        <View style={styles.divider}>
          <View
            style={[
              styles.dividerLine,
              {
                borderColor: theme.accentColor,
              },
            ]}
          />

          {!isMinimal && (
            <>
              <View
                style={[
                  styles.dividerNotchLeft,
                  {
                    backgroundColor: "#F1F0F6",
                  },
                ]}
              />

              <View
                style={[
                  styles.dividerNotchRight,
                  {
                    backgroundColor: "#F1F0F6",
                  },
                ]}
              />
            </>
          )}
        </View>

        {/* FOOTER */}

        <View style={styles.ticketFooter}>
          {showTicketNumber && (
            <View style={styles.ticketNumberContainer}>
              <Text
                style={[
                  styles.ticketNumberLabel,
                  {
                    color: theme.accentColor,
                  },
                ]}
              >
                TICKET NO.
              </Text>

              <Text
                style={[
                  styles.ticketNumber,
                  {
                    color: theme.textColor,
                  },
                ]}
              >
                {resolvedTicketNumber}
              </Text>
            </View>
          )}

          <View
            style={[styles.barcode, !showTicketNumber && styles.barcodeFull]}
          >
            {Array.from({ length: 30 }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.bar,
                  {
                    backgroundColor: theme.accentColor,
                  },

                  index % 4 === 0
                    ? styles.barWide
                    : index % 3 === 0
                      ? styles.barMedium
                      : styles.barSmall,
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {isMinimal ? (
        <View
          style={[
            styles.minimalRule,
            {
              backgroundColor: theme.accentColor,
            },
          ]}
        />
      ) : (
        renderPerforation("bottom")
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.92} onPress={onPress}>
        {ticketContent}
      </TouchableOpacity>
    );
  }

  return ticketContent;
}

export default React.memo(MemoryTicket);
