import React, { useState } from "react";

import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useMemory } from "../../hooks/useMemory";

import styles from "./ticketPreviewStyles";

function TicketPreviewScreen({ route, navigation }) {
  const { addMemory } = useMemory();

  const { memory } = route.params || {};

  const [imageWidth, setImageWidth] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  // ------------------------------------------
  // GET ALL IMAGES
  // ------------------------------------------

  const images = Array.isArray(memory?.images)
    ? memory.images
    : memory?.image
      ? [memory.image]
      : [];

  const formatDate = (date) => {
    if (!date) {
      return "DATE UNKNOWN";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "DATE UNKNOWN";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getTicketNumber = () => {
    if (memory?.id) {
      return memory.id.slice(-5).toUpperCase();
    }

    return "00001";
  };

  const handleSave = async () => {
    try {
      await addMemory(memory);

      navigation.navigate("MainTabs", {
        screen: "Memories",
      });
    } catch (error) {
      console.log("Error saving memory:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={21} color="#242424" />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerEyebrow}>YOUR MEMORY</Text>

            <Text style={styles.headerTitle}>Ticket Preview</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* INTRO */}
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>Looks good?</Text>

          <Text style={styles.previewSubtitle}>
            This moment is ready to become a ticket.
          </Text>
        </View>

        {/* TICKET */}
        <View style={styles.ticketShadow}>
          <View style={styles.ticket}>
            {/* TOP PERFORATION */}
            <View style={styles.topPerforation}>
              {Array.from({ length: 15 }).map((_, index) => (
                <View key={index} style={styles.perforationHole} />
              ))}
            </View>

            {/* TICKET HEADER */}
            <View style={styles.ticketHeader}>
              <View>
                <Text style={styles.ticketBrand}>MEMORY TICKET</Text>

                <Text style={styles.ticketSubBrand}>
                  THE POWER OF THE MOMENT
                </Text>
              </View>

              <Text style={styles.ticketNumber}>#{getTicketNumber()}</Text>
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

                      <View style={styles.imageOverlay} />
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.noImage}>
                  <Ionicons name="image-outline" size={42} color="#D94D28" />

                  <Text style={styles.noImageText}>NO IMAGE</Text>
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

              {/* DOTS */}
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

            {/* TICKET INFORMATION */}
            <View style={styles.ticketInfo}>
              <Text style={styles.memoryLabel}>MEMORY</Text>

              <Text style={styles.ticketTitle} numberOfLines={2}>
                {memory?.title || "UNTITLED MEMORY"}
              </Text>

              <View style={styles.ticketDivider} />

              {/* DATE + LOCATION */}
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>DATE</Text>

                  <Text style={styles.infoValue}>
                    {formatDate(memory?.date)}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>LOCATION</Text>

                  <Text style={styles.infoValue} numberOfLines={2}>
                    {memory?.location || "UNKNOWN"}
                  </Text>
                </View>
              </View>

              {/* DESCRIPTION */}
              {memory?.description ? (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.description}>{memory.description}</Text>
                </View>
              ) : null}
            </View>

            {/* MIDDLE PERFORATION */}
            <View style={styles.middlePerforation}>
              <View style={styles.sideCutoutLeft} />

              <View style={styles.middleDashedLine} />

              <View style={styles.sideCutoutRight} />
            </View>

            {/* FOOTER */}
            <View style={styles.ticketFooter}>
              <View>
                <Text style={styles.admitText}>ADMISSION X1</Text>

                <Text style={styles.footerSmallText}>MEMORY ARCHIVE</Text>
              </View>

              {/* BARCODE */}
              <View style={styles.barcode}>
                {Array.from({ length: 28 }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.bar,
                      index % 5 === 0
                        ? styles.barWide
                        : index % 3 === 0
                          ? styles.barMedium
                          : styles.barSmall,
                    ]}
                  />
                ))}
              </View>
            </View>

            <View style={styles.serialContainer}>
              <Text style={styles.serialText}>MT • {getTicketNumber()}</Text>
            </View>

            {/* BOTTOM PERFORATION */}
            <View style={styles.bottomPerforation}>
              {Array.from({ length: 15 }).map((_, index) => (
                <View key={index} style={styles.perforationHole} />
              ))}
            </View>
          </View>
        </View>

        {/* ACTIONS */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Ionicons name="bookmark-outline" size={20} color="#FFFFFF" />

            <Text style={styles.saveButtonText}>SAVE MEMORY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={19} color="#34345C" />

            <Text style={styles.editButtonText}>EDIT</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Every moment deserves a ticket.</Text>
      </ScrollView>
    </View>
  );
}

export default TicketPreviewScreen;
