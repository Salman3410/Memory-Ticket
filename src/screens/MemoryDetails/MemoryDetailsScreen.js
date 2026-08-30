import React, { useRef, useState } from "react";

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
import * as MediaLibrary from "expo-media-library";

import { useMemory } from "../../hooks/useMemory";

import MemoryTicket from "../../components/MemoryTicket/MemoryTicket";

import ShareExportSheet from "../../components/ShareExportSheet/ShareExportSheet";

import styles from "./memoryDetailsStyles";

function MemoryDetailsScreen({ navigation, route }) {
  const { getMemoryById, deleteMemory, updateMemory } = useMemory();

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const memoryId = route?.params?.memoryId;

  // ==========================================================
  // GENERAL
  // ==========================================================

  const [activeImage, setActiveImage] = useState(0);

  // ==========================================================
  // IMAGE VIEWER
  // ==========================================================

  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const [viewerImage, setViewerImage] = useState(0);

  // ==========================================================
  // SHARE / EXPORT
  // ==========================================================

  const shareSheetRef = useRef(null);

  const [sharing, setSharing] = useState(false);

  const [savingImage, setSavingImage] = useState(false);

  // ==========================================================
  // PDF
  // ==========================================================

  const [generatingPdf, setGeneratingPdf] = useState(false);

  const [pdfOptionsVisible, setPdfOptionsVisible] = useState(false);

  // ==========================================================
  // TICKET REFS
  // ==========================================================

  const ticketRefs = useRef([]);

  // ==========================================================
  // MEMORY CHECK
  // ==========================================================

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

  // ==========================================================
  // IMAGES
  // ==========================================================

  const images = Array.isArray(memory?.images)
    ? memory.images
    : memory?.image
      ? [memory.image]
      : [];

  // ==========================================================
  // IMAGE VIEWER
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
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);

    setViewerImage(index);
    setActiveImage(index);
  };

  // ==========================================================
  // TICKET NUMBER
  // ==========================================================

  const getTicketNumber = () => {
    if (memory?.id) {
      return memory.id.slice(-5).toUpperCase();
    }

    return "00001";
  };

  // ==========================================================
  // FAVORITE
  // ==========================================================

  const handleFavorite = async () => {
    try {
      await updateMemory(memory.id, {
        favorite: !memory.favorite,
      });
    } catch (error) {
      console.log("Favorite update error:", error);
    }
  };

  // ==========================================================
  // DELETE
  // ==========================================================

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

  // ==========================================================
  // OPEN SHARE BOTTOM SHEET
  // ==========================================================

  const openShareSheet = () => {
    shareSheetRef.current?.present();
  };

  // ==========================================================
  // CAPTURE CURRENT MEMORY TICKET
  // ==========================================================

  const captureCurrentTicket = async () => {
    const safeIndex =
      activeImage >= 0 && activeImage < images.length ? activeImage : 0;

    const ticketRef = ticketRefs.current[safeIndex];

    if (!ticketRef) {
      throw new Error("Memory Ticket is still rendering.");
    }

    return await captureRef(ticketRef, {
      format: "png",
      quality: 1,
      result: "tmpfile",
    });
  };

  // ==========================================================
  // MORE
  //
  // THIS OPENS THE NATIVE OS SHARE SHEET.
  //
  // NO CUSTOM SOCIAL POPUP.
  // ==========================================================

  const handleMore = async () => {
    try {
      if (sharing) {
        return;
      }

      setSharing(true);

      const available = await Sharing.isAvailableAsync();

      if (!available) {
        Alert.alert(
          "Sharing unavailable",
          "Sharing is not available on this device.",
        );

        return;
      }

      const imageUri = await captureCurrentTicket();

      /*
       * This is the important part.
       *
       * We give the native share system
       * the ACTUAL Memory Ticket image.
       *
       * The OS decides which compatible apps
       * are displayed:
       *
       * WhatsApp
       * Instagram
       * Facebook
       * Messages
       * Drive
       * etc.
       */

      await Sharing.shareAsync(imageUri, {
        mimeType: "image/png",

        dialogTitle: "Share Memory Ticket",

        UTI: "public.png",
      });
    } catch (error) {
      console.log("Share error:", error);

      Alert.alert("Share Failed", "Unable to share the Memory Ticket.");
    } finally {
      setSharing(false);
    }
  };

  // ==========================================================
  // SAVE IMAGE
  // ==========================================================

  const handleSaveImage = async () => {
    try {
      if (savingImage) {
        return;
      }

      setSavingImage(true);

      const permission = await MediaLibrary.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Allow photo access so Memory Ticket can save the image to your device.",
        );

        return;
      }

      const imageUri = await captureCurrentTicket();

      await MediaLibrary.saveToLibraryAsync(imageUri);

      shareSheetRef.current?.close();

      Alert.alert(
        "Saved",
        "Your Memory Ticket has been saved to your gallery.",
      );
    } catch (error) {
      console.log("Save image error:", error);

      Alert.alert(
        "Save Failed",
        "Something went wrong while saving your Memory Ticket.",
      );
    } finally {
      setSavingImage(false);
    }
  };

  // ==========================================================
  // PDF HELPERS
  // ==========================================================

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

  // ==========================================================
  // STANDARD PDF BACK
  // ==========================================================

  const createStandardBackPage = () => {
    return `
        <section class="page back-page">

          <div class="back-ticket">

            <div class="back-top-line"></div>

            <div class="back-content">

              <div class="back-brand">
                MEMORY TICKET
              </div>

              <div class="back-tagline">
                KEEP THE MOMENT. KEEP THE STORY.
              </div>

              <div class="back-divider"></div>

              <div class="back-title">
                MEMORY ARCHIVE
              </div>

              <div class="back-description">
                A small reminder that this moment
                happened and is worth remembering.
              </div>

              <div class="back-divider"></div>

              <div class="back-info">

                <div>
                  <div class="back-label">
                    TICKET
                  </div>

                  <div class="back-value">
                    #${escapeHtml(getTicketNumber())}
                  </div>
                </div>

                <div>
                  <div class="back-label">
                    MEMORY
                  </div>

                  <div class="back-value">
                    ${escapeHtml(memory?.title || "UNTITLED MEMORY")}
                  </div>
                </div>

              </div>

              <div class="back-spacer"></div>

              <div class="back-footer">

                <div class="back-small">
                  MEMORY TICKET
                </div>

                <div class="back-small">
                  THE POWER OF THE MOMENT
                </div>

              </div>

            </div>

            <div class="back-bottom-line"></div>

          </div>

        </section>
      `;
  };

  // ==========================================================
  // PDF EXPORT
  // ==========================================================

  const handleExportPdf = async (backType) => {
    try {
      if (generatingPdf) {
        return;
      }

      setPdfOptionsVisible(false);

      setGeneratingPdf(true);

      if (!images.length) {
        Alert.alert(
          "No Images",
          "This memory does not contain any images to export.",
        );

        return;
      }

      const selectedImageIndex =
        activeImage >= 0 && activeImage < images.length ? activeImage : 0;

      const ticketRef = ticketRefs.current[selectedImageIndex];

      if (!ticketRef) {
        Alert.alert(
          "PDF Export Failed",
          "The ticket is still rendering. Please wait a moment and try again.",
        );

        return;
      }

      const ticketUri = await captureRef(ticketRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });

      const ticketImage = await imageToBase64(ticketUri);

      const frontPage = `
          <section class="page">

            <img
              class="ticket"
              src="${ticketImage}"
              alt="Memory Ticket Front"
            />

          </section>
        `;

      let backPage = "";

      if (backType === "blank") {
        backPage = `
            <section class="page blank-back-page">

              <div class="blank-yellow"></div>

            </section>
          `;
      }

      if (backType === "standard") {
        backPage = createStandardBackPage();
      }

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
                background: #FFFFFF;
              }

              body {
                font-family:
                  Arial,
                  Helvetica,
                  sans-serif;
              }

              .page {
                position: relative;

                width: 210mm;
                height: 297mm;

                display: flex;

                align-items: center;
                justify-content: center;

                page-break-after:
                  always;

                overflow: hidden;

                margin: 0;
                padding: 0;
              }

              .page:last-child {
                page-break-after:
                  auto;
              }

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

              .blank-back-page {
                background: #F5C842;
              }

              .blank-yellow {
                position: absolute;

                top: 0;
                left: 0;

                width: 210mm;
                height: 297mm;

                background: #F5C842;
              }

              .back-page {
                background: #F5C842;
              }

              .back-ticket {
                position: relative;

                width: 115mm;
                height: 270mm;

                background: #F5C842;

                border-radius: 6px;

                overflow: hidden;

                display: flex;
                flex-direction: column;

                padding: 18mm 14mm;
              }

              .back-top-line {
                width: 100%;
                height: 2px;

                background: #1D2528;

                margin-bottom: 12mm;
              }

              .back-content {
                flex: 1;

                display: flex;
                flex-direction: column;
              }

              .back-brand {
                font-size: 22px;
                font-weight: 900;

                letter-spacing: 1px;

                color: #1D2528;
              }

              .back-tagline {
                margin-top: 4px;

                font-size: 9px;
                font-weight: 800;

                letter-spacing: 1.5px;

                color: #1D2528;
              }

              .back-divider {
                width: 100%;
                height: 2px;

                background: #1D2528;

                margin-top: 18mm;
                margin-bottom: 18mm;
              }

              .back-title {
                font-size: 18px;

                font-weight: 900;

                letter-spacing: 1.5px;

                color: #1D2528;

                text-align: center;
              }

              .back-description {
                margin-top: 10mm;

                padding: 0 8mm;

                font-size: 11px;

                line-height: 17px;

                font-weight: 700;

                color: #1D2528;

                text-align: center;
              }

              .back-info {
                display: flex;

                flex-direction: column;

                gap: 12mm;
              }

              .back-label {
                font-size: 8px;

                font-weight: 900;

                letter-spacing: 1.5px;

                color: #1D2528;

                margin-bottom: 3px;
              }

              .back-value {
                font-size: 13px;

                font-weight: 900;

                color: #1D2528;

                word-wrap: break-word;
              }

              .back-spacer {
                flex: 1;
              }

              .back-footer {
                border-top:
                  2px solid
                  #1D2528;

                padding-top: 8mm;

                display: flex;

                justify-content:
                  space-between;

                gap: 10mm;
              }

              .back-small {
                font-size: 7px;

                font-weight: 900;

                letter-spacing: 1px;

                color: #1D2528;
              }

              .back-bottom-line {
                width: 100%;
                height: 2px;

                background: #1D2528;

                margin-top: 12mm;
              }

            </style>

          </head>

          <body>

            ${frontPage}

            ${backPage}

          </body>

          </html>
        `;

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      const available = await Sharing.isAvailableAsync();

      if (available) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",

          dialogTitle: "Export Memory Ticket",

          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert(
          "PDF Created",
          "Your 2-page Memory Ticket PDF was created successfully.",
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

  // ==========================================================
  // TICKET
  // ==========================================================

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
          <MemoryTicket
            memory={memory}
            image={image}
            ticketNumber={getTicketNumber()}
            imageIndex={index}
            activeImage={activeImage}
            images={images}
            onImagePress={() => openImageViewer(index)}
          />
        </View>
      </View>
    );
  };

  // ==========================================================
  // SCREEN
  // ==========================================================

  return (
    <View style={styles.container}>
      <ScrollView
        style={detailStyles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
      >
        {/* ====================================================
            HEADER
        ==================================================== */}

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

        {/* ====================================================
            TICKET CAROUSEL
        ==================================================== */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          directionalLockEnabled
          decelerationRate="fast"
          snapToInterval={screenWidth - 44 + 12}
          snapToAlignment="start"
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / (screenWidth - 44 + 12),
            );

            if (index >= 0 && index < images.length) {
              setActiveImage(index);
            }
          }}
        >
          {images.length > 0
            ? images.map((image, index) => renderTicket(image, index))
            : renderTicket(null, 0)}
        </ScrollView>

        {/* ====================================================
            SWIPE HINT
        ==================================================== */}

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

        {/* ====================================================
            SHARE MEMORY
        ==================================================== */}

        <TouchableOpacity
          style={detailStyles.shareButton}
          onPress={openShareSheet}
          activeOpacity={0.85}
        >
          <Ionicons name="share-social-outline" size={19} color="#FFFFFF" />

          <Text style={detailStyles.shareButtonText}>SHARE MEMORY</Text>
        </TouchableOpacity>

        {/* ====================================================
            EDIT
        ==================================================== */}

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

        {/* ====================================================
            DELETE
        ==================================================== */}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={18} color="#D9534F" />

          <Text style={styles.deleteText}>DELETE MEMORY</Text>
        </TouchableOpacity>

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <Text style={styles.footerText}>KEEP THE MOMENT. KEEP THE STORY.</Text>
      </ScrollView>

      {/* ======================================================
          GORHOM SHARE / EXPORT SHEET

          Save Image
          Export PDF
          More -> NATIVE SHARE POPUP
      ====================================================== */}

      <ShareExportSheet
        ref={shareSheetRef}
        onSaveImage={handleSaveImage}
        onExportPDF={() => {
          shareSheetRef.current?.close();

          setTimeout(() => {
            setPdfOptionsVisible(true);
          }, 250);
        }}
        onMore={handleMore}
        savingImage={savingImage}
        generatingPdf={generatingPdf}
        sharing={sharing}
      />

      {/* ======================================================
          PDF OPTIONS
      ====================================================== */}

      <Modal
        visible={pdfOptionsVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          generatingPdf ? null : setPdfOptionsVisible(false)
        }
      >
        <View style={pdfStyles.overlay}>
          <View style={pdfStyles.modal}>
            <View style={pdfStyles.header}>
              <View>
                <Text style={pdfStyles.eyebrow}>EXPORT PDF</Text>

                <Text style={pdfStyles.title}>Choose Ticket Back</Text>
              </View>

              <TouchableOpacity
                style={pdfStyles.closeButton}
                onPress={() => setPdfOptionsVisible(false)}
                disabled={generatingPdf}
              >
                <Ionicons name="close" size={22} color="#242424" />
              </TouchableOpacity>
            </View>

            <Text style={pdfStyles.description}>
              Your PDF will contain exactly 2 pages. Page 1 is the selected
              ticket front. Page 2 will be the back you choose.
            </Text>

            {/* =================================================
                BLANK BACK
            ================================================= */}

            <TouchableOpacity
              style={pdfStyles.option}
              onPress={() => handleExportPdf("blank")}
              activeOpacity={0.85}
            >
              <View style={pdfStyles.optionPreview}>
                <View
                  style={[
                    pdfStyles.miniPage,
                    {
                      backgroundColor: "#F5C842",
                    },
                  ]}
                />
              </View>

              <View style={pdfStyles.optionContent}>
                <Text style={pdfStyles.optionTitle}>Yellow Blank Back</Text>

                <Text style={pdfStyles.optionText}>
                  Page 1 → Ticket Front{"\n"}
                  Page 2 → Same yellow background
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#34345C" />
            </TouchableOpacity>

            {/* =================================================
                STANDARD BACK
            ================================================= */}

            <TouchableOpacity
              style={pdfStyles.option}
              onPress={() => handleExportPdf("standard")}
              activeOpacity={0.85}
            >
              <View style={pdfStyles.optionPreview}>
                <View
                  style={[
                    pdfStyles.miniPage,
                    {
                      backgroundColor: "#F5C842",

                      padding: 5,
                    },
                  ]}
                >
                  <View style={pdfStyles.miniLine} />

                  <View
                    style={[
                      pdfStyles.miniLine,
                      {
                        marginTop: 8,
                      },
                    ]}
                  />

                  <View
                    style={[
                      pdfStyles.miniLine,
                      {
                        marginTop: 8,

                        width: "60%",
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={pdfStyles.optionContent}>
                <Text style={pdfStyles.optionTitle}>Standard Ticket Back</Text>

                <Text style={pdfStyles.optionText}>
                  Page 1 → Ticket Front{"\n"}
                  Page 2 → Memory Ticket Back
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#34345C" />
            </TouchableOpacity>

            {/* CANCEL */}

            <TouchableOpacity
              style={pdfStyles.cancelButton}
              onPress={() => setPdfOptionsVisible(false)}
              disabled={generatingPdf}
            >
              <Text style={pdfStyles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ======================================================
          FULL IMAGE VIEWER
      ====================================================== */}

      <Modal
        visible={imageViewerVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={closeImageViewer}
      >
        <View style={imageViewerStyles.container}>
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
    </View>
  );
}

// ==========================================================
// DETAIL STYLES
// ==========================================================

const detailStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  shareButton: {
    height: 50,

    marginHorizontal: 22,

    marginTop: 20,

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
});

// ==========================================================
// PDF STYLES
// ==========================================================

const pdfStyles = StyleSheet.create({
  overlay: {
    flex: 1,

    backgroundColor: "rgba(20, 20, 20, 0.72)",

    justifyContent: "center",

    paddingHorizontal: 18,
  },

  modal: {
    width: "100%",

    backgroundColor: "#F4F1E8",

    borderRadius: 24,

    paddingBottom: 18,

    overflow: "hidden",
  },

  header: {
    minHeight: 76,

    paddingHorizontal: 20,

    paddingVertical: 14,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  eyebrow: {
    fontSize: 9,

    fontWeight: "900",

    letterSpacing: 1.5,

    color: "#6A6A6A",
  },

  title: {
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

  description: {
    paddingHorizontal: 20,

    marginBottom: 16,

    fontSize: 11,

    lineHeight: 17,

    color: "#6A6A6A",
  },

  option: {
    marginHorizontal: 18,

    marginBottom: 10,

    padding: 13,

    minHeight: 94,

    borderRadius: 16,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#E2DED3",

    flexDirection: "row",

    alignItems: "center",
  },

  optionPreview: {
    width: 54,

    height: 68,

    borderRadius: 6,

    overflow: "hidden",

    backgroundColor: "#F5C842",

    alignItems: "center",

    justifyContent: "center",
  },

  miniPage: {
    width: 42,

    height: 60,

    borderRadius: 3,

    borderWidth: 1,

    borderColor: "#1D2528",

    alignItems: "center",

    justifyContent: "flex-start",
  },

  miniLine: {
    width: "75%",

    height: 2,

    marginTop: 10,

    backgroundColor: "#1D2528",
  },

  optionContent: {
    flex: 1,

    paddingHorizontal: 13,
  },

  optionTitle: {
    fontSize: 13,

    fontWeight: "900",

    color: "#242424",
  },

  optionText: {
    marginTop: 5,

    fontSize: 9,

    lineHeight: 14,

    color: "#777777",
  },

  cancelButton: {
    height: 46,

    marginHorizontal: 18,

    marginTop: 4,

    borderRadius: 13,

    alignItems: "center",

    justifyContent: "center",
  },

  cancelText: {
    fontSize: 10,

    fontWeight: "900",

    letterSpacing: 1.2,

    color: "#6A6A6A",
  },
});

// ==========================================================
// IMAGE VIEWER STYLES
// ==========================================================

const imageViewerStyles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#0B0B0D",
  },

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

    color: "#FFFFFF",

    fontSize: 11,

    fontWeight: "900",

    letterSpacing: 1,

    textAlign: "center",
  },

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
