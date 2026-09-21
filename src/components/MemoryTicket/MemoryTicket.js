import React, { useMemo, useState } from "react";

import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { getMemoryThumbnailUrl } from "../../utils/cloudinary";

import { normalizeTicketCustomization } from "../../utils/ticketCustomization";

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

  // --------------------------------------------------
  // CUSTOMIZATION
  // --------------------------------------------------

  const customization = useMemo(
    () => normalizeTicketCustomization(memory || {}),
    [memory],
  );

  const ticketStyle =
    customization.ticketStyle === "minimal" ||
    customization.ticketStyle === "vintage"
      ? customization.ticketStyle
      : "classic";

  const ticketAccent = customization.ticketAccent;

  const {
    showLocation,
    showDate,
    showDescription,
    showAdmission,
    showTicketNumber,
  } = customization.ticketOptions;

  if (!memory) {
    return null;
  }

  // --------------------------------------------------
  // STYLE MODE
  // --------------------------------------------------

  const isClassic = ticketStyle === "classic";

  const isMinimal = ticketStyle === "minimal";

  const isVintage = ticketStyle === "vintage";

  // --------------------------------------------------
  // ACCENT COLORS
  // --------------------------------------------------

  const accentColors = {
    coral: {
      main: "#E76F51",
      text: "#E76F51",
    },

    navy: {
      main: "#34345C",
      text: "#34345C",
    },

    yellow: {
      main: "#F5C842",
      text: "#8A6900",
    },

    green: {
      main: "#6C8B74",
      text: "#4F6756",
    },
  };

  const selectedAccent = accentColors[ticketAccent] || accentColors.coral;

  const accentColor = selectedAccent.main;

  // --------------------------------------------------
  // TICKET COLORS
  // --------------------------------------------------

  let ticketBackground = "#F7B900";
  let ticketTextColor = "#F0442C";
  let imageBackground = "#EAAE00";
  let borderColor = "transparent";

  if (isMinimal) {
    ticketBackground = "#FFFFFF";

    ticketTextColor =
      ticketAccent === "yellow" ? "#725900" : selectedAccent.text;

    imageBackground = "#F1F0F6";

    borderColor = "#D9D8E2";
  }

  if (isVintage) {
    ticketBackground = "#F3E7CF";

    ticketTextColor =
      ticketAccent === "yellow" ? "#745D20" : selectedAccent.text;

    imageBackground = "#E4D2AD";

    borderColor = "#C5A978";
  }

  // --------------------------------------------------
  // MEMORY DATA
  // --------------------------------------------------

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

  const title = memory.title || "UNTITLED MEMORY";

  const location = memory.location?.trim() || "UNKNOWN";

  const date = formatDate(memory.createdAt || memory.date);

  const time = memory.time || "";

  const description = memory.description?.trim() || "";

  const admission = memory.admission || "X1";

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

  // --------------------------------------------------
  // TAGS
  // --------------------------------------------------

  const tags = Array.isArray(memory.tags)
    ? [
        ...new Set(
          memory.tags
            .filter((tag) => typeof tag === "string")
            .map((tag) => tag.trim().replace(/^#+/, "").toLowerCase())
            .filter(Boolean),
        ),
      ]
    : [];

  // --------------------------------------------------
  // IMAGES
  // --------------------------------------------------

  const isSingleImageMode = Boolean(image);

  const displayImages = isSingleImageMode ? [image] : images;

  const displayImageSources = useMemo(
    () => displayImages.map((imageUri) => getMemoryThumbnailUrl(imageUri)),
    [displayImages],
  );

  const handleImagePress = () => {
    if (onPress) {
      onPress();
    }
  };

  // --------------------------------------------------
  // EDGE CUTOUT
  // --------------------------------------------------

  const renderEdgeCutouts = () => {
    if (!isClassic) {
      return null;
    }

    return (
      <View pointerEvents="none" style={styles.cutoutLayer}>
        {/* TOP */}

        <View style={[styles.edgeCutout, styles.topCutout1]} />

        <View style={[styles.edgeCutout, styles.topCutout2]} />

        <View style={[styles.edgeCutout, styles.topCutout3]} />

        <View style={[styles.edgeCutout, styles.topCutout4]} />

        <View style={[styles.edgeCutout, styles.topCutout5]} />

        {/* BOTTOM */}

        <View style={[styles.edgeCutout, styles.bottomCutout1]} />

        <View style={[styles.edgeCutout, styles.bottomCutout2]} />

        <View style={[styles.edgeCutout, styles.bottomCutout3]} />

        <View style={[styles.edgeCutout, styles.bottomCutout4]} />

        <View style={[styles.edgeCutout, styles.bottomCutout5]} />

        {/* LEFT */}

        <View style={[styles.edgeCutout, styles.leftCutout1]} />

        <View style={[styles.edgeCutout, styles.leftCutout2]} />

        {/* RIGHT */}

        <View style={[styles.edgeCutout, styles.rightCutout1]} />

        <View style={[styles.edgeCutout, styles.rightCutout2]} />
      </View>
    );
  };

  // --------------------------------------------------
  // TICKET CONTENT
  // --------------------------------------------------

  const ticketContent = (
    <View style={styles.ticketFrame}>
      <View
        key={ticketStyle}
        style={[
          styles.ticket,

          compact && styles.ticketCompact,

          isMinimal && styles.ticketMinimal,

          isVintage && styles.ticketVintage,

          {
            backgroundColor: ticketBackground,

            borderColor: borderColor,
          },
        ]}
      >
        {/* ------------------------------------------ */}
        {/* BODY */}
        {/* ------------------------------------------ */}

        <View
          style={[
            styles.ticketBody,
            {
              backgroundColor: ticketBackground,
            },
          ]}
        >
          {/* -------------------------------------- */}
          {/* HEADER */}
          {/* -------------------------------------- */}

          <View style={styles.header}>
            <Text
              style={[
                styles.brandText,
                {
                  color: accentColor,
                },
              ]}
            >
              MEMENTO
            </Text>

            <Ionicons name="ticket-outline" size={18} color={accentColor} />
          </View>

          {/* -------------------------------------- */}
          {/* IMAGE */}
          {/* -------------------------------------- */}

          <View
            style={[
              styles.ticketImageContainer,
              {
                backgroundColor: imageBackground,
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
                <Ionicons name="image-outline" size={40} color={accentColor} />

                <Text
                  style={[
                    styles.imagePlaceholderText,
                    {
                      color: accentColor,
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

          {/* -------------------------------------- */}
          {/* TITLE */}
          {/* -------------------------------------- */}

          <View style={styles.titleContainer}>
            <Text
              style={[
                styles.ticketTitle,

                isMinimal && styles.minimalTitle,

                isVintage && styles.vintageTitle,

                {
                  color: ticketTextColor,
                },
              ]}
              numberOfLines={2}
            >
              {title}
            </Text>
          </View>

          {/* -------------------------------------- */}
          {/* TAGS */}
          {/* -------------------------------------- */}

          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag) => (
                <View
                  key={tag}
                  style={[
                    styles.tagChip,
                    {
                      borderBottomColor: accentColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      {
                        color: accentColor,
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

          {/* -------------------------------------- */}
          {/* DESCRIPTION */}
          {/* -------------------------------------- */}

          {showDescription && description ? (
            <View style={styles.descriptionContainer}>
              <Text
                style={[
                  styles.descriptionLabel,
                  {
                    color: accentColor,
                  },
                ]}
              >
                THE STORY
              </Text>

              <Text
                style={[
                  styles.descriptionText,
                  {
                    color: ticketTextColor,
                  },
                ]}
                numberOfLines={4}
              >
                {description}
              </Text>
            </View>
          ) : null}

          {/* -------------------------------------- */}
          {/* INFO */}
          {/* -------------------------------------- */}

          {(showLocation || showDate) && (
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                {showLocation && (
                  <View style={styles.infoBlock}>
                    <Text
                      style={[
                        styles.infoLabel,
                        {
                          color: accentColor,
                        },
                      ]}
                    >
                      LOCATION
                    </Text>

                    <Text
                      style={[
                        styles.infoValue,
                        {
                          color: ticketTextColor,
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
                          color: accentColor,
                        },
                      ]}
                    >
                      DATE
                    </Text>

                    <Text
                      style={[
                        styles.infoValue,
                        {
                          color: ticketTextColor,
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
                        color: accentColor,
                      },
                    ]}
                  >
                    TIME
                  </Text>

                  <Text
                    style={[
                      styles.infoValue,
                      {
                        color: ticketTextColor,
                      },
                    ]}
                  >
                    {time}
                  </Text>
                </View>
              ) : null}
            </View>
          )}

          {/* -------------------------------------- */}
          {/* ADMISSION */}
          {/* -------------------------------------- */}

          {showAdmission && (
            <View style={styles.admissionSection}>
              <Text
                style={[
                  styles.admissionLabel,
                  {
                    color: accentColor,
                  },
                ]}
              >
                ADMISSION
              </Text>

              <Text
                style={[
                  styles.admissionValue,
                  {
                    color: ticketTextColor,
                  },
                ]}
              >
                X{admission.toString().replace(/^X/, "")}
              </Text>
            </View>
          )}

          {/* -------------------------------------- */}
          {/* DIVIDER */}
          {/* -------------------------------------- */}

          <View style={styles.divider}>
            <View
              style={[
                styles.dividerLine,
                {
                  borderColor: accentColor,
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

          {/* -------------------------------------- */}
          {/* FOOTER */}
          {/* -------------------------------------- */}

          <View style={styles.ticketFooter}>
            {showTicketNumber && (
              <View style={styles.ticketNumberContainer}>
                <Text
                  style={[
                    styles.ticketNumberLabel,
                    {
                      color: accentColor,
                    },
                  ]}
                >
                  TICKET NO.
                </Text>

                <Text
                  style={[
                    styles.ticketNumber,
                    {
                      color: ticketTextColor,
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
              {Array.from({
                length: 30,
              }).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.bar,

                    {
                      backgroundColor: accentColor,
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
      </View>

      {/* ACTUAL EDGE CUTOUTS */}

      {renderEdgeCutouts()}
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
