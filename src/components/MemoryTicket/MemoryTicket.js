import React, { useState } from "react";

import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useMemory } from "../../hooks/useMemory";

import styles from "./memoryTicketStyles";

function MemoryTicket({ memory, onPress, compact = false }) {
  const { getMemoryById } = useMemory();

  const [imageWidth, setImageWidth] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  if (!memory) {
    return null;
  }

  // If only an ID is passed, get the complete memory
  // from MemoryContext.
  const contextMemory = memory.id ? getMemoryById(memory.id) : memory;

  const currentMemory = contextMemory || memory;

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

  const location = currentMemory.location || "MEMORY TICKET";

  const date = formatDate(currentMemory.createdAt || currentMemory.date);

  const time = currentMemory.time || "";

  const description = currentMemory.description?.trim() || "";

  const admission = currentMemory.admission || "X1";

  const ticketNumber =
    currentMemory.ticketNumber ||
    currentMemory.id?.toString().slice(-6) ||
    "000000";

  // ------------------------------------------
  // GET ALL IMAGES
  // ------------------------------------------

  const images = Array.isArray(currentMemory.images)
    ? currentMemory.images
    : currentMemory.image
      ? [currentMemory.image]
      : [];

  const ticketContent = (
    <View style={[styles.ticket, compact && styles.ticketCompact]}>
      {/* TOP PERFORATION */}
      <View style={styles.topPerforation}>
        {Array.from({ length: 12 }).map((_, index) => (
          <View key={index} style={styles.perforationDot} />
        ))}
      </View>

      {/* MAIN TICKET */}
      <View style={styles.ticketBody}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.brandText}>MEMORY TICKET</Text>

          <Ionicons name="ticket-outline" size={18} color="#F0442C" />
        </View>

        {/* IMAGE CAROUSEL */}
        <View
          style={styles.ticketImageContainer}
          onLayout={(event) => {
            const width = event.nativeEvent.layout.width;

            setImageWidth(width);
          }}
        >
          {images.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              onMomentumScrollEnd={(event) => {
                if (!imageWidth) return;

                const index = Math.round(
                  event.nativeEvent.contentOffset.x / imageWidth,
                );

                setActiveImage(index);
              }}
            >
              {images.map((image, index) => (
                <View
                  key={`${image}-${index}`}
                  style={[
                    styles.ticketImageSlide,
                    imageWidth ? { width: imageWidth } : null,
                  ]}
                >
                  <Image
                    source={{ uri: image }}
                    style={styles.ticketImage}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noImage}>
              <Ionicons name="image-outline" size={40} color="#707080" />
            </View>
          )}

          {/* IMAGE COUNTER */}
          {images.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {activeImage + 1}/{images.length}
              </Text>
            </View>
          )}

          {/* DOT INDICATORS */}
          {images.length > 1 && (
            <View style={styles.imageDots}>
              {images.map((_, index) => (
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
          <Text style={styles.ticketTitle} numberOfLines={2}>
            {title}
          </Text>
        </View>

        {/* DESCRIPTION */}
        {description ? (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>THE STORY</Text>

            <Text style={styles.descriptionText} numberOfLines={4}>
              {description}
            </Text>
          </View>
        ) : null}

        {/* EVENT INFO */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>LOCATION</Text>

              <Text style={styles.infoValue} numberOfLines={1}>
                {location}
              </Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>DATE</Text>

              <Text style={styles.infoValue} numberOfLines={1}>
                {date}
              </Text>
            </View>
          </View>

          {time ? (
            <View style={styles.timeRow}>
              <Text style={styles.infoLabel}>TIME</Text>

              <Text style={styles.infoValue}>{time}</Text>
            </View>
          ) : null}
        </View>

        {/* ADMISSION */}
        <View style={styles.admissionSection}>
          <Text style={styles.admissionLabel}>ADMISSION</Text>

          <Text style={styles.admissionValue}>
            X{admission.toString().replace(/^X/, "")}
          </Text>
        </View>

        {/* DIVIDER */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerNotchLeft} />
          <View style={styles.dividerNotchRight} />
        </View>

        {/* FOOTER */}
        <View style={styles.ticketFooter}>
          <View style={styles.ticketNumberContainer}>
            <Text style={styles.ticketNumberLabel}>TICKET NO.</Text>

            <Text style={styles.ticketNumber}>{ticketNumber}</Text>
          </View>

          <View style={styles.barcode}>
            {Array.from({ length: 30 }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.bar,
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

      {/* BOTTOM PERFORATION */}
      <View style={styles.bottomPerforation}>
        {Array.from({ length: 12 }).map((_, index) => (
          <View key={index} style={styles.perforationDot} />
        ))}
      </View>
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

export default MemoryTicket;
 