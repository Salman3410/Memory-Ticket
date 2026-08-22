import React, { useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  useWindowDimensions,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useMemory } from "../../hooks/useMemory";

import styles from "./memoryDetailsStyles";

function MemoryDetailsScreen({ navigation, route }) {
  const { getMemoryById, deleteMemory, updateMemory } = useMemory();

  const { width: screenWidth } = useWindowDimensions();

  const memoryId = route?.params?.memoryId;

  const [activeImage, setActiveImage] = useState(0);

  // --------------------------------------------------
  // CAROUSEL SETTINGS
  // --------------------------------------------------

  const SCREEN_PADDING = 22;
  const TICKET_WIDTH = screenWidth - SCREEN_PADDING * 2;
  const TICKET_GAP = 8;
  const SNAP_SIZE = TICKET_WIDTH + TICKET_GAP;

  // --------------------------------------------------
  // NO MEMORY ID
  // --------------------------------------------------

  if (!memoryId) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons name="sad-outline" size={45} color="#34345C" />

        <Text style={styles.notFoundTitle}>Memory not found</Text>

        <TouchableOpacity
          style={styles.backToMemoriesButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backToMemoriesText}>GO BACK</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --------------------------------------------------
  // GET MEMORY
  // --------------------------------------------------

  const memory = getMemoryById(memoryId);

  if (!memory) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons name="sad-outline" size={45} color="#34345C" />

        <Text style={styles.notFoundTitle}>Memory not found</Text>

        <TouchableOpacity
          style={styles.backToMemoriesButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backToMemoriesText}>GO BACK</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --------------------------------------------------
  // GET ALL IMAGES
  // --------------------------------------------------

  const images = Array.isArray(memory?.images)
    ? memory.images
    : memory?.image
      ? [memory.image]
      : [];

  // --------------------------------------------------
  // DATE
  // --------------------------------------------------

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

  // --------------------------------------------------
  // TICKET NUMBER
  // --------------------------------------------------

  const getTicketNumber = () => {
    if (memory?.id) {
      return memory.id.slice(-5).toUpperCase();
    }

    return "00001";
  };

  // --------------------------------------------------
  // FAVORITE
  // --------------------------------------------------

  const handleFavorite = async () => {
    try {
      await updateMemory(memory.id, {
        favorite: !memory.favorite,
      });
    } catch (error) {
      console.log("Favorite update error:", error);
    }
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = () => {
    Alert.alert(
      "Delete Memory?",
      "This memory will be permanently removed from your collection.",
      [
        {
          text: "CANCEL",
          style: "cancel",
        },

        {
          text: "DELETE",
          style: "destructive",

          onPress: async () => {
            try {
              await deleteMemory(memory.id);

              navigation.navigate("MainTabs", {
                screen: "Memories",
              });
            } catch (error) {
              console.log("Delete error:", error);
            }
          },
        },
      ],
    );
  };

  // --------------------------------------------------
  // RENDER COMPLETE TICKET
  // --------------------------------------------------

  const renderTicket = (image, index) => {
    return (
      <View
        key={`${image}-${index}`}
        style={[
          styles.ticketSlide,
          {
            width: TICKET_WIDTH,
            marginRight: index === images.length - 1 ? 0 : TICKET_GAP,
          },
        ]}
      >
        <View style={styles.ticketShadow}>
          <View style={styles.ticket}>
            {/* TOP PERFORATION */}

            <View style={styles.topPerforation}>
              {Array.from({ length: 15 }).map((_, holeIndex) => (
                <View key={holeIndex} style={styles.perforationHole} />
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

            {/* IMAGE */}

            <View style={styles.ticketImageContainer}>
              {image ? (
                <>
                  <Image
                    source={{ uri: image }}
                    style={styles.ticketImage}
                    resizeMode="cover"
                  />

                  <View style={styles.imageOverlay} />
                </>
              ) : (
                <View style={styles.noImage}>
                  <Ionicons name="image-outline" size={42} color="#D94D28" />

                  <Text style={styles.noImageText}>NO IMAGE</Text>
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
                {Array.from({ length: 28 }).map((_, barIndex) => (
                  <View
                    key={barIndex}
                    style={[
                      styles.bar,
                      barIndex % 5 === 0
                        ? styles.barWide
                        : barIndex % 3 === 0
                          ? styles.barMedium
                          : styles.barSmall,
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* SERIAL */}

            <View style={styles.serialContainer}>
              <Text style={styles.serialText}>MT • {getTicketNumber()}</Text>
            </View>

            {/* BOTTOM PERFORATION */}

            <View style={styles.bottomPerforation}>
              {Array.from({ length: 15 }).map((_, holeIndex) => (
                <View key={holeIndex} style={styles.perforationHole} />
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  };

  // --------------------------------------------------
  // SCREEN
  // --------------------------------------------------

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#242424" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Memory</Text>

          <TouchableOpacity
            style={[
              styles.favoriteButton,
              memory.favorite && styles.favoriteButtonActive,
            ]}
            onPress={handleFavorite}
            activeOpacity={0.8}
          >
            <Ionicons
              name={memory.favorite ? "heart" : "heart-outline"}
              size={21}
              color={memory.favorite ? "#E76F51" : "#34345C"}
            />
          </TouchableOpacity>
        </View>

        {/* ==================================================
            HORIZONTAL TICKET CAROUSEL
        ================================================== */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          /*
           * IMPORTANT:
           * We intentionally do NOT use pagingEnabled here.
           *
           * Because we have an 8px gap, normal paging
           * does not know about that gap.
           */

          decelerationRate="fast"
          /*
           * One ticket = one snap position.
           * Ticket width + 8px gap.
           */

          snapToInterval={SNAP_SIZE}
          snapToAlignment="start"
          /*
           * THIS IS THE IMPORTANT PART.
           *
           * Prevents a fast swipe from jumping:
           * 1 -> 3
           * 1 -> 4
           *
           * Instead:
           * 1 -> 2
           * 2 -> 3
           * 3 -> 4
           */

          disableIntervalMomentum
          onMomentumScrollEnd={(event) => {
            const offsetX = event.nativeEvent.contentOffset.x;

            const index = Math.round(offsetX / SNAP_SIZE);

            const safeIndex = Math.max(0, Math.min(index, images.length - 1));

            setActiveImage(safeIndex);
          }}
        >
          {images.length > 0
            ? images.map((image, index) => renderTicket(image, index))
            : renderTicket(null, 0)}
        </ScrollView>

        {/* SWIPE INDICATOR */}

        {images.length > 1 && (
          <View style={styles.swipeHint}>
            <Ionicons
              name="swap-horizontal-outline"
              size={15}
              color="#707080"
            />

            <Text style={styles.swipeHintText}>Swipe to view photos</Text>

            <Text style={styles.swipeCountText}>
              {activeImage + 1}/{images.length}
            </Text>
          </View>
        )}

        {/* EDIT */}

        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("EditMemory", {
              memoryId: memory.id,
            })
          }
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={18} color="#34345C" />

          <Text style={styles.editText}>EDIT MEMORY</Text>
        </TouchableOpacity>

        {/* DELETE */}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={18} color="#D9534F" />

          <Text style={styles.deleteText}>DELETE MEMORY</Text>
        </TouchableOpacity>

        {/* FOOTER */}

        <Text style={styles.footerText}>KEEP THE MOMENT. KEEP THE STORY.</Text>
      </ScrollView>
    </View>
  );
}

export default MemoryDetailsScreen;
