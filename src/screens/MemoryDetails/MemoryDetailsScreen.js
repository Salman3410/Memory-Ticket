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
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { File } from "expo-file-system";
import { captureRef } from "react-native-view-shot";

import { useMemory } from "../../hooks/useMemory";

import styles from "./memoryDetailsStyles";

function MemoryDetailsScreen({ navigation, route }) {
  const { getMemoryById, deleteMemory, updateMemory } = useMemory();

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const memoryId = route?.params?.memoryId;

  const [activeImage, setActiveImage] = useState(0);

  // --------------------------------------------------
  // FULL-SCREEN IMAGE VIEWER
  // --------------------------------------------------

  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerImage, setViewerImage] = useState(0);

  const openImageViewer = (index) => {
    setViewerImage(index);
    setViewerVisible(true);
  };

  const closeImageViewer = () => {
    setViewerVisible(false);
  };

  // --------------------------------------------------
  // PDF EXPORT
  // --------------------------------------------------

  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // --------------------------------------------------
  // SHARE MEMORY
  // --------------------------------------------------

  const [isSharingMemory, setIsSharingMemory] = useState(false);

  // Holds references to the rendered ticket views.
  // One ref for each image/ticket in the carousel.
  const ticketRefs = useRef({});

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
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate("MainTabs", {
                screen: "Memories",
              });
            }
          }}
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
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate("MainTabs", {
                screen: "Memories",
              });
            }
          }}
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
  // ESCAPE HTML
  // --------------------------------------------------

  const escapeHtml = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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
  // GET IMAGE BASE64
  // --------------------------------------------------

  const getImageAsBase64 = async (imageUri) => {
    if (!imageUri) {
      return null;
    }

    try {
      if (imageUri.startsWith("data:image/")) {
        return imageUri;
      }

      const file = new File(imageUri);

      const base64 = file.base64Sync();

      if (!base64) {
        return null;
      }

      const lowerUri = imageUri.toLowerCase();

      let mimeType = "image/jpeg";

      if (lowerUri.includes(".png")) {
        mimeType = "image/png";
      } else if (lowerUri.includes(".webp")) {
        mimeType = "image/webp";
      } else if (lowerUri.includes(".heic") || lowerUri.includes(".heif")) {
        mimeType = "image/jpeg";
      }

      return `data:${mimeType};base64,${base64}`;
    } catch (error) {
      console.log("Image Base64 conversion error:", error);

      return null;
    }
  };

  // --------------------------------------------------
  // BUILD PDF TICKET
  // --------------------------------------------------

  const buildPDFTicket = (imageData) => {
    const title = escapeHtml(memory?.title || "UNTITLED MEMORY");

    const date = escapeHtml(formatDate(memory?.date));

    const location = escapeHtml(memory?.location || "UNKNOWN");

    const description = escapeHtml(memory?.description || "");

    const ticketNumber = escapeHtml(getTicketNumber());

    return `
      <!DOCTYPE html>

      <html>

        <head>

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <style>

            @page {
              size: 420px 650px;
              margin: 0;
            }

            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              width: 420px;
              height: 650px;
              background: #ffffff;
            }

            body {
              font-family: Arial, Helvetica, sans-serif;
            }

            .page {
              width: 420px;
              height: 650px;
              padding: 0;
              margin: 0;
              background: #ffffff;
              page-break-after: always;
            }

            .ticket {
              width: 420px;
              height: 650px;
              background: #F9B900;
              overflow: hidden;
              position: relative;
            }

            .top-perforation {
              width: 100%;
              height: 17px;
              display: flex;
              justify-content: space-around;
              align-items: flex-start;
              overflow: hidden;
            }

            .hole {
              width: 17px;
              height: 17px;
              border-radius: 50%;
              background: #ffffff;
              margin-top: -8px;
            }

            .header {
              height: 67px;
              padding: 18px 20px 14px 20px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }

            .brand {
              font-size: 25px;
              line-height: 27px;
              font-weight: 900;
              letter-spacing: -1px;
              color: #D92F16;
            }

            .sub-brand {
              font-size: 10px;
              line-height: 12px;
              font-weight: 900;
              letter-spacing: 0.2px;
              color: #D92F16;
            }

            .number {
              font-size: 10px;
              font-weight: 900;
              letter-spacing: 1px;
              color: #D92F16;
              margin-top: 3px;
            }

            .image-container {
              width: 420px;
              height: 240px;
              overflow: hidden;
              background: #ffffff;
              position: relative;
            }

            .ticket-image {
              width: 420px;
              height: 240px;
              display: block;
              object-fit: cover;
              object-position: center center;
            }

            .image-overlay {
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
            }

            .no-image {
              width: 420px;
              height: 240px;
              background: #E88925;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              color: #D94D28;
            }

            .no-image-text {
              margin-top: 7px;
              font-size: 9px;
              font-weight: 900;
              letter-spacing: 1px;
            }

            .info {
              padding: 19px 20px 10px 20px;
            }

            .memory-label {
              font-size: 9px;
              line-height: 11px;
              font-weight: 900;
              letter-spacing: 1.8px;
              color: #D92F16;
              margin-bottom: 6px;
            }

            .title {
              font-size: 27px;
              line-height: 29px;
              font-weight: 900;
              letter-spacing: -0.8px;
              color: #D92F16;
              text-transform: uppercase;
              max-height: 58px;
              overflow: hidden;
            }

            .divider {
              width: 100%;
              height: 1px;
              background: rgba(217, 47, 22, 0.35);
              margin-top: 17px;
              margin-bottom: 17px;
            }

            .info-row {
              width: 100%;
              display: flex;
              flex-direction: row;
            }

            .info-item {
              width: 50%;
              padding-right: 10px;
            }

            .info-label {
              font-size: 8px;
              line-height: 10px;
              font-weight: 900;
              letter-spacing: 1.2px;
              color: #D92F16;
              margin-bottom: 4px;
            }

            .info-value {
              font-size: 12px;
              line-height: 16px;
              font-weight: 800;
              color: #D92F16;
              text-transform: uppercase;
            }

            .description-container {
              margin-top: 14px;
              padding-top: 10px;
              border-top: 1px solid rgba(217, 47, 22, 0.25);
            }

            .description {
              font-size: 11px;
              line-height: 15px;
              font-weight: 700;
              font-style: italic;
              color: #D92F16;
              max-height: 30px;
              overflow: hidden;
            }

            .middle-perforation {
              width: 100%;
              height: 18px;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .dashed-line {
              width: 82%;
              border-top: 1px dashed #D92F16;
              opacity: 0.7;
            }

            .cutout-left {
              position: absolute;
              left: -11px;
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: #ffffff;
            }

            .cutout-right {
              position: absolute;
              right: -11px;
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: #ffffff;
            }

            .footer {
              height: 70px;
              padding: 12px 20px 10px 20px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }

            .admit {
              font-size: 10px;
              font-weight: 900;
              letter-spacing: 1px;
              color: #D92F16;
            }

            .footer-small {
              font-size: 7px;
              font-weight: 900;
              letter-spacing: 1px;
              color: #D92F16;
              margin-top: 4px;
            }

            .barcode {
              width: 125px;
              height: 42px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              overflow: hidden;
            }

            .bar {
              height: 34px;
              background: #D92F16;
            }

            .bar-small {
              width: 2px;
            }

            .bar-medium {
              width: 3px;
            }

            .bar-wide {
              width: 5px;
            }

            .serial {
              height: 22px;
              padding-right: 20px;
              display: flex;
              align-items: flex-start;
              justify-content: flex-end;
            }

            .serial-text {
              font-size: 8px;
              font-weight: 900;
              letter-spacing: 1.3px;
              color: #D92F16;
            }

            .bottom-perforation {
              width: 100%;
              height: 17px;
              display: flex;
              justify-content: space-around;
              align-items: flex-end;
              overflow: hidden;
            }

          </style>

        </head>

        <body>

          <div class="page">

            <div class="ticket">

              <div class="top-perforation">
                ${Array.from(
                  { length: 15 },
                  () => `<div class="hole"></div>`,
                ).join("")}
              </div>

              <div class="header">

                <div>

                  <div class="brand">
                    MEMORY TICKET
                  </div>

                  <div class="sub-brand">
                    THE POWER OF THE MOMENT
                  </div>

                </div>

                <div class="number">
                  #${ticketNumber}
                </div>

              </div>

              <div class="image-container">

                ${
                  imageData
                    ? `
                      <img
                        class="ticket-image"
                        src="${imageData}"
                      />

                      <div class="image-overlay"></div>
                    `
                    : `
                      <div class="no-image">

                        <div class="no-image-text">
                          NO IMAGE
                        </div>

                      </div>
                    `
                }

              </div>

              <div class="info">

                <div class="memory-label">
                  MEMORY
                </div>

                <div class="title">
                  ${title}
                </div>

                <div class="divider"></div>

                <div class="info-row">

                  <div class="info-item">

                    <div class="info-label">
                      DATE
                    </div>

                    <div class="info-value">
                      ${date}
                    </div>

                  </div>

                  <div class="info-item">

                    <div class="info-label">
                      LOCATION
                    </div>

                    <div class="info-value">
                      ${location}
                    </div>

                  </div>

                </div>

                ${
                  description
                    ? `
                      <div class="description-container">

                        <div class="description">
                          ${description}
                        </div>

                      </div>
                    `
                    : ""
                }

              </div>

              <div class="middle-perforation">

                <div class="cutout-left"></div>

                <div class="dashed-line"></div>

                <div class="cutout-right"></div>

              </div>

              <div class="footer">

                <div>

                  <div class="admit">
                    ADMISSION X1
                  </div>

                  <div class="footer-small">
                    MEMORY ARCHIVE
                  </div>

                </div>

                <div class="barcode">

                  ${Array.from({ length: 28 })
                    .map((_, index) => {
                      let className = "bar-small";

                      if (index % 5 === 0) {
                        className = "bar-wide";
                      } else if (index % 3 === 0) {
                        className = "bar-medium";
                      }

                      return `
                        <div
                          class="bar ${className}"
                        ></div>
                      `;
                    })
                    .join("")}

                </div>

              </div>

              <div class="serial">

                <div class="serial-text">
                  MT • ${ticketNumber}
                </div>

              </div>

              <div class="bottom-perforation">

                ${Array.from(
                  { length: 15 },
                  () => `<div class="hole"></div>`,
                ).join("")}

              </div>

            </div>

          </div>

        </body>

      </html>
    `;
  };

  // --------------------------------------------------
  // EXPORT PDF
  // --------------------------------------------------

  const handleExportPDF = async () => {
    if (isExportingPDF) {
      return;
    }

    try {
      setIsExportingPDF(true);

      const pdfImages = images.length > 0 ? images : [null];

      const pageHtml = [];

      for (let index = 0; index < pdfImages.length; index++) {
        const image = pdfImages[index];

        let imageData = null;

        if (image) {
          imageData = await getImageAsBase64(image);
        }

        const singlePage = buildPDFTicket(imageData);

        const bodyStart = singlePage.indexOf("<body>");

        const bodyEnd = singlePage.indexOf("</body>");

        if (bodyStart !== -1 && bodyEnd !== -1) {
          pageHtml.push(singlePage.substring(bodyStart + 6, bodyEnd));
        }
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
                size: 420px 650px;
                margin: 0;
              }

              html,
              body {
                margin: 0;
                padding: 0;
                width: 420px;
                background: #ffffff;
              }

              * {
                box-sizing: border-box;
              }

              body {
                font-family: Arial, Helvetica, sans-serif;
              }

              .page {
                width: 420px;
                height: 650px;
                margin: 0;
                padding: 0;
                page-break-after: always;
              }

              .page:last-child {
                page-break-after: auto;
              }

            </style>

          </head>

          <body>

            ${pageHtml.join("")}

          </body>

        </html>
      `;

      const { uri, numberOfPages } = await Print.printToFileAsync({
        html,

        width: 420,
        height: 650,

        margins: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },

        base64: false,
      });

      console.log("PDF created:", uri);
      console.log("PDF pages:", numberOfPages);

      const canShare = await Sharing.isAvailableAsync();

      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Export Memory Ticket",
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert(
          "PDF Created",
          `Your Memory Ticket PDF was created successfully with ${
            numberOfPages || pdfImages.length
          } page(s).`,
        );
      }
    } catch (error) {
      console.log("PDF export error:", error);

      Alert.alert(
        "PDF Export Failed",
        "Something went wrong while creating the PDF. Please try again.",
      );
    } finally {
      setIsExportingPDF(false);
    }
  };

  // --------------------------------------------------
  // SHARE MEMORY AS IMAGE
  // --------------------------------------------------

  const handleShareMemory = async () => {
    if (isSharingMemory) {
      return;
    }

    try {
      setIsSharingMemory(true);

      /*
       * Get the currently visible ticket.
       *
       * activeImage tells us which ticket the user
       * is currently looking at.
       */

      const ticketRef = ticketRefs.current[activeImage];

      if (!ticketRef) {
        throw new Error("Ticket reference not available.");
      }

      /*
       * Give React Native a moment to finish rendering.
       *
       * This is especially useful immediately after
       * swiping between tickets.
       */

      await new Promise((resolve) => setTimeout(resolve, 150));

      /*
       * Capture the actual rendered React Native ticket.
       *
       * This means the shared image uses the same
       * ticket design the user sees in the app.
       */

      const imageUri = await captureRef(ticketRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });

      console.log("Memory Ticket image created:", imageUri);

      /*
       * Check whether native sharing is available.
       */

      const canShare = await Sharing.isAvailableAsync();

      if (!canShare) {
        Alert.alert(
          "Sharing Unavailable",
          "Sharing is not available on this device.",
        );

        return;
      }

      /*
       * Open the native Android/iOS share sheet.
       */

      await Sharing.shareAsync(imageUri, {
        mimeType: "image/png",
        dialogTitle: "Share Memory Ticket",
        UTI: "public.png",
      });
    } catch (error) {
      console.log("Share memory error:", error);

      Alert.alert(
        "Share Failed",
        "Something went wrong while preparing your Memory Ticket for sharing. Please try again.",
      );
    } finally {
      setIsSharingMemory(false);
    }
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
        {/*
         * IMPORTANT:
         *
         * This View is what gets captured when
         * the user presses SHARE MEMORY.
         */}
        <View
          ref={(ref) => {
            if (ref) {
              ticketRefs.current[index] = ref;
            }
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

            <TouchableOpacity
              style={styles.ticketImageContainer}
              onPress={() => image && openImageViewer(index)}
              activeOpacity={0.95}
            >
              {image ? (
                <>
                  <Image
                    source={{
                      uri: image,
                    }}
                    style={styles.ticketImage}
                    resizeMode="cover"
                  />

                  <View style={styles.imageOverlay} />

                  {/* FULL SCREEN ICON */}

                  <View
                    style={{
                      position: "absolute",
                      right: 12,
                      bottom: 12,
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: "rgba(0,0,0,0.55)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="expand-outline" size={19} color="#FFFFFF" />
                  </View>
                </>
              ) : (
                <View style={styles.noImage}>
                  <Ionicons name="image-outline" size={42} color="#D94D28" />

                  <Text style={styles.noImageText}>NO IMAGE</Text>
                </View>
              )}
            </TouchableOpacity>

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
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate("MainTabs", {
                  screen: "Memories",
                });
              }
            }}
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
          decelerationRate="fast"
          snapToInterval={SNAP_SIZE}
          snapToAlignment="start"
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

        {/* ==================================================
            SHARE MEMORY
        ================================================== */}

        <TouchableOpacity
          style={[
            styles.editButton,
            {
              marginTop: images.length > 1 ? 18 : 22,
              opacity: isSharingMemory ? 0.65 : 1,
            },
          ]}
          onPress={handleShareMemory}
          activeOpacity={0.8}
          disabled={isSharingMemory}
        >
          {isSharingMemory ? (
            <ActivityIndicator size="small" color="#34345C" />
          ) : (
            <Ionicons name="share-outline" size={18} color="#34345C" />
          )}

          <Text style={styles.editText}>
            {isSharingMemory ? "PREPARING SHARE..." : "SHARE MEMORY"}
          </Text>
        </TouchableOpacity>

        {/* ==================================================
            PDF EXPORT
        ================================================== */}

        <TouchableOpacity
          style={[
            styles.editButton,
            {
              marginTop: 8,
              opacity: isExportingPDF ? 0.65 : 1,
            },
          ]}
          onPress={handleExportPDF}
          activeOpacity={0.8}
          disabled={isExportingPDF}
        >
          {isExportingPDF ? (
            <ActivityIndicator size="small" color="#34345C" />
          ) : (
            <Ionicons name="document-text-outline" size={18} color="#34345C" />
          )}

          <Text style={styles.editText}>
            {isExportingPDF ? "CREATING PDF..." : "EXPORT PDF"}
          </Text>
        </TouchableOpacity>

        {/* EDIT */}

        <TouchableOpacity
          style={[
            styles.editButton,
            {
              marginTop: 8,
            },
          ]}
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
          style={[
            styles.deleteButton,
            {
              marginTop: 8,
            },
          ]}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={18} color="#D9534F" />

          <Text style={styles.deleteText}>DELETE MEMORY</Text>
        </TouchableOpacity>

        {/* FOOTER */}

        <Text style={styles.footerText}>KEEP THE MOMENT. KEEP THE STORY.</Text>
      </ScrollView>

      {/* ==================================================
          FULL-SCREEN IMAGE VIEWER
      ================================================== */}

      <Modal
        visible={viewerVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={closeImageViewer}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000",
          }}
        >
          {/* CLOSE BUTTON */}

          <TouchableOpacity
            onPress={closeImageViewer}
            activeOpacity={0.8}
            style={{
              position: "absolute",
              top: 50,
              right: 20,
              zIndex: 10,
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: "rgba(255,255,255,0.15)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="close" size={27} color="#FFFFFF" />
          </TouchableOpacity>

          {/* IMAGE COUNTER */}

          {images.length > 1 && (
            <View
              style={{
                position: "absolute",
                top: 57,
                left: 20,
                zIndex: 10,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 15,
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                {viewerImage + 1}/{images.length}
              </Text>
            </View>
          )}

          {/* IMAGE CAROUSEL */}

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{
              x: viewerImage * screenWidth,
              y: 0,
            }}
            onMomentumScrollEnd={(event) => {
              const offsetX = event.nativeEvent.contentOffset.x;

              const index = Math.round(offsetX / screenWidth);

              const safeIndex = Math.max(0, Math.min(index, images.length - 1));

              setViewerImage(safeIndex);
            }}
            style={{
              flex: 1,
            }}
          >
            {images.map((image, index) => (
              <View
                key={`${image}-viewer-${index}`}
                style={{
                  width: screenWidth,
                  height: screenHeight,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{
                    uri: image,
                  }}
                  style={{
                    width: screenWidth,
                    height: screenHeight,
                  }}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>

          {/* SWIPE HINT */}

          {images.length > 1 && (
            <View
              style={{
                position: "absolute",
                bottom: 35,
                alignSelf: "center",
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 18,
                backgroundColor: "rgba(255,255,255,0.12)",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 11,
                  fontWeight: "600",
                  letterSpacing: 0.5,
                }}
              >
                SWIPE TO VIEW PHOTOS
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

export default MemoryDetailsScreen;
