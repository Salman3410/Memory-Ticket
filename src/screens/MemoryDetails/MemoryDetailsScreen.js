import { useRef, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  useWindowDimensions,
  Alert,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system/legacy";

import { useMemory } from "../../hooks/useMemory";
import styles from "./memoryDetailsStyles";

function MemoryDetailsScreen({ navigation, route }) {
  const { getMemoryById, deleteMemory, updateMemory } = useMemory();

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const memoryId = route?.params?.memoryId;

  const [activeImage, setActiveImage] = useState(0);

  // FULL IMAGE VIEWER
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [viewerImage, setViewerImage] = useState(0);

  const [shareVisible, setShareVisible] = useState(false);
  const [sharing, setSharing] = useState(false);

  const [shareTicketNumber, setShareTicketNumber] = useState("");
  const [shareBarcode, setShareBarcode] = useState([]);

  const [generatingPdf, setGeneratingPdf] = useState(false);

  const shareTicketRef = useRef(null);

  const ticketRefs = useRef([]);

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

  const images = Array.isArray(memory?.images)
    ? memory.images
    : memory?.image
      ? [memory.image]
      : [];

  // ==========================================================
  // FULL IMAGE VIEWER
  // ==========================================================

  const openImageViewer = (index) => {
    if (!images[index]) {
      return;
    }

    setViewerImage(index);
    setImageViewerVisible(true);
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
  };

  const handleViewerScroll = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / screenWidth,
    );

    setViewerImage(index);
    setActiveImage(index);
  };

  const getTicketNumber = () => {
    if (memory?.id) {
      return memory.id.slice(-5).toUpperCase();
    }

    return "00001";
  };

  const handleFavorite = async () => {
    try {
      await updateMemory(memory.id, {
        favorite: !memory.favorite,
      });
    } catch (error) {
      console.log("Favorite update error:", error);
    }
  };

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

  const generateShareTicketNumber = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let result = "";

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);

      result += characters[randomIndex];
    }

    return result;
  };

  const generateRandomBarcode = () => {
    const bars = [];

    for (let i = 0; i < 42; i++) {
      const random = Math.random();

      let width;

      if (random < 0.55) {
        width = 2;
      } else if (random < 0.85) {
        width = 3;
      } else {
        width = 4;
      }

      bars.push({
        width,
      });
    }

    return bars;
  };

  const openSharePreview = () => {
    const ticketNumber = generateShareTicketNumber();

    const barcode = generateRandomBarcode();

    setShareTicketNumber(ticketNumber);
    setShareBarcode(barcode);

    setShareVisible(true);
  };

  const closeSharePreview = () => {
    if (sharing) {
      return;
    }

    setShareVisible(false);
  };

  const handleShareTicket = async () => {
    try {
      if (!shareTicketRef.current) {
        return;
      }

      setSharing(true);

      const isAvailable = await Sharing.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert(
          "Sharing unavailable",
          "Sharing is not available on this device.",
        );

        return;
      }

      const imageUri = await captureRef(shareTicketRef.current, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });

      await Sharing.shareAsync(imageUri, {
        mimeType: "image/png",
        dialogTitle: "Share Memory Ticket",
        UTI: "public.png",
      });
    } catch (error) {
      console.log("Share ticket error:", error);

      Alert.alert(
        "Share Failed",
        "Something went wrong while creating your Memory Ticket.",
      );
    } finally {
      setSharing(false);
    }
  };

  const imageToBase64 = async (uri) => {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return `data:image/png;base64,${base64}`;
  };

  const escapeHtml = (text) => {
    if (!text) {
      return "";
    }

    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const handleExportPdf = async () => {
    try {
      if (generatingPdf) {
        return;
      }

      setGeneratingPdf(true);

      if (!images.length) {
        Alert.alert(
          "No Images",
          "This memory does not contain any images to export.",
        );

        return;
      }

      const validRefs = images
        .map((_, index) => ticketRefs.current[index])
        .filter(Boolean);

      if (validRefs.length !== images.length) {
        Alert.alert(
          "PDF Export Failed",
          "The ticket is still rendering. Please wait a moment and try again.",
        );

        return;
      }

      const capturedTickets = [];

      for (let index = 0; index < images.length; index++) {
        const ticketRef = ticketRefs.current[index];

        if (!ticketRef) {
          throw new Error(`Ticket reference ${index} is unavailable.`);
        }

        const ticketUri = await captureRef(ticketRef, {
          format: "png",
          quality: 1,
          result: "tmpfile",
        });

        const base64Image = await imageToBase64(ticketUri);

        capturedTickets.push(base64Image);
      }

      const pages = capturedTickets
        .map(
          (ticketImage, index) => `
            <section class="page">

              <img
                class="ticket"
                src="${ticketImage}"
                alt="Memory Ticket ${index + 1}"
              />

            </section>
          `,
        )
        .join("");

      const html = `
        <!DOCTYPE html>

        <html>

        <head>

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <style>

            @page {
              size: A4 portrait;
              margin: 0;
            }

            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;

              width: 210mm;
              height: 297mm;

              background: #FFFFFF;
            }

            body {
              font-family: Arial, Helvetica, sans-serif;
            }

            .page {
              width: 210mm;
              height: 297mm;

              display: flex;

              align-items: center;
              justify-content: center;

              page-break-after: always;

              overflow: hidden;

              background: #FFFFFF;
            }

            .page:last-child {
              page-break-after: auto;
            }

            /*
             * THIS IS THE ONLY SCALING HAPPENING.
             *
             * The ticket itself is the exact PNG captured
             * from MemoryDetailsScreen.
             *
             * Width is intentionally limited so the ticket
             * remains thin/long and sits cleanly in the
             * middle of the A4 page.
             */

            .ticket {
              display: block;

              width: 115mm;
              height: auto;

              max-width: 115mm;
              max-height: 270mm;

              object-fit: contain;

              margin: 0;
              padding: 0;

              border: 0;
            }

          </style>

        </head>

        <body>

          ${pages}

        </body>

        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Export Memory Ticket",
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert(
          "PDF Created",
          "Your Memory Ticket PDF was created successfully.",
        );
      }
    } catch (error) {
      console.log("PDF export error:", error);

      Alert.alert(
        "PDF Export Failed",
        error?.message ||
          "Something went wrong while creating your Memory Ticket PDF.",
      );
    } finally {
      setGeneratingPdf(false);
    }
  };

  const renderTicket = (image, index) => {
    return (
      <View
        key={`${image}-${index}`}
        style={[
          styles.ticketSlide,
          {
            width: screenWidth - 44,
            marginRight: 12,
          },
        ]}
      >
        <View
          ref={(ref) => {
            ticketRefs.current[index] = ref;
          }}
          collapsable={false}
          style={styles.ticketShadow}
        >
          <View style={styles.ticket}>
            {/* TOP PERFORATION */}

            <View style={styles.topPerforation}>
              {Array.from({
                length: 15,
              }).map((_, holeIndex) => (
                <View key={holeIndex} style={styles.perforationHole} />
              ))}
            </View>

            {/* HEADER */}

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
                <TouchableOpacity
                  activeOpacity={0.95}
                  onPress={() => openImageViewer(index)}
                  style={{ flex: 1 }}
                >
                  <Image
                    source={{
                      uri: image,
                    }}
                    style={styles.ticketImage}
                    resizeMode="cover"
                  />

                  <View style={styles.imageOverlay} />
                </TouchableOpacity>
              ) : (
                <View style={styles.noImage}>
                  <Ionicons name="image-outline" size={42} color="#D94D28" />

                  <Text style={styles.noImageText}>NO IMAGE</Text>
                </View>
              )}

              {/* DOTS */}

              {images.length > 1 && (
                <View style={styles.imageDots}>
                  {images.map((_, dotIndex) => (
                    <View
                      key={dotIndex}
                      style={[
                        styles.imageDot,
                        dotIndex === activeImage && styles.imageDotActive,
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>

            {/* INFORMATION */}

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
                    {memory?.date
                      ? new Date(memory.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })
                      : "DATE UNKNOWN"}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoValue} numberOfLines={2}>
                    {memory?.location || "UNKNOWN"}
                  </Text>

                  <Text style={styles.infoLabel}>LOCATION</Text>
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
                {Array.from({
                  length: 28,
                }).map((_, barIndex) => (
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
              {Array.from({
                length: 15,
              }).map((_, holeIndex) => (
                <View key={holeIndex} style={styles.perforationHole} />
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderShareTicket = () => {
    const image = images[activeImage] || images[0] || null;

    return (
      <View
        ref={shareTicketRef}
        collapsable={false}
        style={shareStyles.captureContainer}
      >
        <View style={shareStyles.ticket}>
          {/* HEADER */}

          <View style={shareStyles.header}>
            <View>
              <Text style={shareStyles.brand}>MEMORY TICKET</Text>

              <Text style={shareStyles.tagline}>KEEP THE MOMENT</Text>
            </View>

            <View style={shareStyles.numberContainer}>
              <Text style={shareStyles.numberLabel}>NO.</Text>

              <Text style={shareStyles.number}>{shareTicketNumber}</Text>
            </View>
          </View>

          {/* MEMORY PHOTO */}

          <View style={shareStyles.imageContainer}>
            {image ? (
              <Image
                source={{
                  uri: image,
                }}
                style={shareStyles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={shareStyles.noImage}>
                <Ionicons name="image-outline" size={48} color="#1D2528" />

                <Text style={shareStyles.noImageText}>NO IMAGE</Text>
              </View>
            )}
          </View>

          {/* MEMORY + BARCODE */}

          <View style={shareStyles.bottomSection}>
            <View style={shareStyles.memorySection}>
              <Text style={shareStyles.memoryLabel}>MEMORY</Text>

              <Text style={shareStyles.memoryName} numberOfLines={3}>
                {memory?.title || "UNTITLED MEMORY"}
              </Text>
            </View>

            <View style={shareStyles.barcodeSection}>
              <View style={shareStyles.barcode}>
                {shareBarcode.map((bar, index) => (
                  <View
                    key={index}
                    style={[
                      shareStyles.bar,
                      {
                        width: bar.width,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
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

        {/* TICKET CAROUSEL */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          decelerationRate="fast"
          snapToInterval={screenWidth - 44 + 12}
          snapToAlignment="start"
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / (screenWidth - 44 + 12),
            );

            setActiveImage(index);
          }}
        >
          {images.length > 0
            ? images.map((image, index) => renderTicket(image, index))
            : renderTicket(null, 0)}
        </ScrollView>

        

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

        {/* ACTION BUTTONS */}

        <View style={shareStyles.actionButtons}>
          {/* SHARE MEMORY */}

          <TouchableOpacity
            style={shareStyles.shareButton}
            onPress={openSharePreview}
            activeOpacity={0.85}
          >
            <Ionicons name="share-social-outline" size={19} color="#FFFFFF" />

            <Text style={shareStyles.shareButtonText}>SHARE MEMORY</Text>
          </TouchableOpacity>

          {/* EXPORT PDF */}

          <TouchableOpacity
            style={[
              shareStyles.pdfButton,
              generatingPdf && shareStyles.pdfButtonDisabled,
            ]}
            onPress={handleExportPdf}
            disabled={generatingPdf}
            activeOpacity={0.85}
          >
            {generatingPdf ? (
              <ActivityIndicator size="small" color="#34345C" />
            ) : (
              <Ionicons
                name="document-text-outline"
                size={19}
                color="#34345C"
              />
            )}

            <Text style={shareStyles.pdfButtonText}>
              {generatingPdf ? "CREATING PDF..." : "EXPORT PDF"}
            </Text>
          </TouchableOpacity>
        </View>

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

      {/* ====================================================== */}
      {/* FULL IMAGE VIEWER */}
      {/* ====================================================== */}

      <Modal
        visible={imageViewerVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={closeImageViewer}
      >
        <View style={imageViewerStyles.container}>
          {/* TOP BAR */}

          <View style={imageViewerStyles.topBar}>
            <TouchableOpacity
              style={imageViewerStyles.closeButton}
              onPress={closeImageViewer}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={25} color="#FFFFFF" />
            </TouchableOpacity>

            {images.length > 0 && (
              <View style={imageViewerStyles.counterWrapper}>
                <Text style={imageViewerStyles.counter}>
                  {viewerImage + 1}/{images.length}
                </Text>
              </View>
            )}
          </View>

          {/* FULL SCREEN IMAGE CAROUSEL */}

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            onMomentumScrollEnd={handleViewerScroll}
            contentOffset={{
              x: viewerImage * screenWidth,
              y: 0,
            }}
          >
            {images.map((image, index) => (
              <View
                key={`${image}-viewer-${index}`}
                style={[
                  imageViewerStyles.imagePage,
                  {
                    width: screenWidth,
                    height: screenHeight,
                  },
                ]}
              >
                <Image
                  source={{
                    uri: image,
                  }}
                  style={[
                    imageViewerStyles.fullImage,
                    {
                      width: screenWidth,
                      height: screenHeight,
                    },
                  ]}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>

          {/* BOTTOM HINT */}

          {images.length > 1 && (
            <View style={imageViewerStyles.bottomHint}>
              <Ionicons
                name="swap-horizontal-outline"
                size={16}
                color="#BDBDBD"
              />

              <Text style={imageViewerStyles.bottomHintText}>
                Swipe to view photos
              </Text>
            </View>
          )}
        </View>
      </Modal>

      {/* SHARE MODAL */}

      <Modal
        visible={shareVisible}
        transparent
        animationType="fade"
        onRequestClose={closeSharePreview}
      >
        <View style={shareStyles.modalOverlay}>
          <View style={shareStyles.modal}>
            {/* MODAL HEADER */}

            <View style={shareStyles.modalHeader}>
              <View>
                <Text style={shareStyles.modalEyebrow}>SHARE MEMORY</Text>

                <Text style={shareStyles.modalTitle}>Your Memory Ticket</Text>
              </View>

              <TouchableOpacity
                style={shareStyles.closeButton}
                onPress={closeSharePreview}
                disabled={sharing}
              >
                <Ionicons name="close" size={22} color="#242424" />
              </TouchableOpacity>
            </View>

            {/* SHAREABLE TICKET */}

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={shareStyles.previewContainer}
            >
              {renderShareTicket()}
            </ScrollView>

            {/* SHARE BUTTON */}

            <TouchableOpacity
              style={[
                shareStyles.confirmButton,
                sharing && shareStyles.confirmButtonDisabled,
              ]}
              onPress={handleShareTicket}
              disabled={sharing}
              activeOpacity={0.85}
            >
              {sharing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="share-social" size={20} color="#FFFFFF" />
              )}

              <Text style={shareStyles.confirmButtonText}>
                {sharing ? "CREATING TICKET..." : "SHARE TICKET"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const shareStyles = StyleSheet.create({
  actionButtons: {
    marginHorizontal: 22,
    marginTop: 20,
    gap: 10,
  },

  shareButton: {
    height: 50,
    borderRadius: 14,

    backgroundColor: "#34345C",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 9,
  },

  shareButtonText: {
    color: "#FFFFFF",

    fontSize: 11,
    fontWeight: "900",

    letterSpacing: 1,
  },

  pdfButton: {
    height: 50,
    borderRadius: 14,

    backgroundColor: "#F4F1E8",

    borderWidth: 1.5,
    borderColor: "#34345C",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 9,
  },

  pdfButtonDisabled: {
    opacity: 0.65,
  },

  pdfButtonText: {
    color: "#34345C",

    fontSize: 11,
    fontWeight: "900",

    letterSpacing: 1,
  },

  // ==========================================================
  // MODAL
  // ==========================================================

  modalOverlay: {
    flex: 1,

    backgroundColor: "rgba(20, 20, 20, 0.72)",

    justifyContent: "center",

    paddingHorizontal: 18,
    paddingVertical: 28,
  },

  modal: {
    width: "100%",

    maxHeight: "94%",

    backgroundColor: "#F4F1E8",

    borderRadius: 24,

    overflow: "hidden",
  },

  modalHeader: {
    minHeight: 76,

    paddingHorizontal: 20,
    paddingVertical: 14,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  modalEyebrow: {
    fontSize: 9,

    fontWeight: "900",

    letterSpacing: 1.5,

    color: "#6A6A6A",
  },

  modalTitle: {
    marginTop: 4,

    fontSize: 19,

    fontWeight: "900",

    color: "#242424",
  },

  closeButton: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: "#E8E4D8",

    alignItems: "center",
    justifyContent: "center",
  },

  previewContainer: {
    paddingHorizontal: 18,
    paddingBottom: 18,

    alignItems: "center",
  },

  // ==========================================================
  // CAPTURE CONTAINER
  // ==========================================================

  captureContainer: {
    width: "100%",

    alignItems: "center",
  },

  // ==========================================================
  // YELLOW TICKET
  // ==========================================================

  ticket: {
    width: "100%",

    backgroundColor: "#F5C842",

    borderRadius: 6,

    padding: 18,

    overflow: "hidden",
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "flex-start",

    marginBottom: 16,
  },

  brand: {
    fontSize: 22,

    fontWeight: "900",

    letterSpacing: 1,

    color: "#1D2528",
  },

  tagline: {
    marginTop: 3,

    fontSize: 9,

    fontWeight: "800",

    letterSpacing: 1.5,

    color: "#1D2528",
  },

  numberContainer: {
    alignItems: "flex-end",
  },

  numberLabel: {
    fontSize: 8,

    fontWeight: "900",

    letterSpacing: 1,

    color: "#1D2528",
  },

  number: {
    marginTop: 2,

    fontSize: 14,

    fontWeight: "900",

    letterSpacing: 1,

    color: "#1D2528",
  },

  // ==========================================================
  // IMAGE
  // ==========================================================

  imageContainer: {
    width: "100%",

    height: 250,

    backgroundColor: "#D8B438",

    borderRadius: 4,

    overflow: "hidden",

    borderWidth: 2,

    borderColor: "#1D2528",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  noImage: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",
  },

  noImageText: {
    marginTop: 8,

    fontSize: 10,

    fontWeight: "900",

    letterSpacing: 1,

    color: "#1D2528",
  },

  // ==========================================================
  // BOTTOM SECTION
  // ==========================================================

  bottomSection: {
    marginTop: 18,

    paddingTop: 16,

    borderTopWidth: 2,

    borderTopColor: "#1D2528",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    minHeight: 82,
  },

  memorySection: {
    flex: 1,

    paddingRight: 18,
  },

  memoryLabel: {
    fontSize: 9,

    fontWeight: "900",

    letterSpacing: 1.8,

    color: "#1D2528",
  },

  memoryName: {
    marginTop: 5,

    fontSize: 19,

    lineHeight: 23,

    fontWeight: "900",

    color: "#1D2528",
  },

  // ==========================================================
  // BARCODE
  // ==========================================================

  barcodeSection: {
    width: 118,

    height: 58,

    justifyContent: "center",

    alignItems: "flex-end",
  },

  barcode: {
    height: 50,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "flex-end",

    overflow: "hidden",
  },

  bar: {
    height: 48,

    marginRight: 2,

    backgroundColor: "#1D2528",
  },

  // ==========================================================
  // CONFIRM SHARE BUTTON
  // ==========================================================

  confirmButton: {
    marginHorizontal: 18,

    marginBottom: 18,

    height: 52,

    borderRadius: 14,

    backgroundColor: "#34345C",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 9,
  },

  confirmButtonDisabled: {
    opacity: 0.7,
  },

  confirmButtonText: {
    color: "#FFFFFF",

    fontSize: 11,

    fontWeight: "900",

    letterSpacing: 1,
  },
});

const imageViewerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0D",
  },

  // ==========================================================
  // TOP BAR
  // ==========================================================

  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    height: 92,
    paddingTop: 48,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  closeButton: {
    position: "absolute",
    left: 18,
    top: 48,
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  counterWrapper: {
    flex: 1,
    alignItems: "center",
  },

  counter: {
    minWidth: 54,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
  },

  counter: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
  },
  topBarSpacer: {
    width: 42,
    height: 42,
  },

  // ==========================================================
  // IMAGE CAROUSEL
  // ==========================================================

  imagePage: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#0B0B0D",
  },

  fullImage: {
    alignSelf: "center",

    backgroundColor: "transparent",
  },

  // ==========================================================
  // BOTTOM HINT
  // ==========================================================

  bottomHint: {
    position: "absolute",

    left: 18,
    right: 18,
    bottom: 28,

    minHeight: 42,

    paddingHorizontal: 15,

    borderRadius: 21,

    backgroundColor: "rgba(255, 255, 255, 0.10)",

    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 7,
  },

  bottomHintText: {
    color: "#C9C9CE",

    fontSize: 10,
    fontWeight: "800",

    letterSpacing: 0.8,
  },
});

export default MemoryDetailsScreen;