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

import { useMemory } from "../../hooks/useMemory";
import styles from "./memoryDetailsStyles";

// ============================================================
// MEMORY DETAILS SCREEN
// ============================================================

function MemoryDetailsScreen({ navigation, route }) {
  const { getMemoryById, deleteMemory, updateMemory } = useMemory();

  const { width: screenWidth } = useWindowDimensions();

  const memoryId = route?.params?.memoryId;

  const [activeImage, setActiveImage] = useState(0);

  // ==========================================================
  // SHARE STATES
  // ==========================================================

  const [shareVisible, setShareVisible] = useState(false);
  const [sharing, setSharing] = useState(false);

  const [shareTicketNumber, setShareTicketNumber] = useState("");
  const [shareBarcode, setShareBarcode] = useState([]);

  // ==========================================================
  // PDF STATE
  // ==========================================================

  const [generatingPdf, setGeneratingPdf] = useState(false);

  // ==========================================================
  // SHARE TICKET REF
  // ==========================================================

  const shareTicketRef = useRef(null);

  // ==========================================================
  // NO MEMORY ID
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

  // ==========================================================
  // GET MEMORY
  // ==========================================================

  const memory = getMemoryById(memoryId);

  // ==========================================================
  // MEMORY NOT FOUND
  // ==========================================================

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
  // GET ALL IMAGES
  // ==========================================================

  const images = Array.isArray(memory?.images)
    ? memory.images
    : memory?.image
      ? [memory.image]
      : [];

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
  // GENERATE RANDOM SHARE TICKET NUMBER
  // ==========================================================

  const generateShareTicketNumber = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let result = "";

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);

      result += characters[randomIndex];
    }

    return result;
  };

  // ==========================================================
  // GENERATE RANDOM BARCODE
  // ==========================================================

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

  // ==========================================================
  // OPEN SHARE PREVIEW
  // ==========================================================

  const openSharePreview = () => {
    const ticketNumber = generateShareTicketNumber();

    const barcode = generateRandomBarcode();

    setShareTicketNumber(ticketNumber);
    setShareBarcode(barcode);

    setShareVisible(true);
  };

  // ==========================================================
  // CLOSE SHARE PREVIEW
  // ==========================================================

  const closeSharePreview = () => {
    if (sharing) {
      return;
    }

    setShareVisible(false);
  };

  // ==========================================================
  // SHARE YELLOW MEMORY TICKET
  // ==========================================================

  const handleShareTicket = async () => {
    try {
      if (!shareTicketRef.current) {
        return;
      }

      setSharing(true);

      // ------------------------------------------------------
      // CHECK NATIVE SHARING
      // ------------------------------------------------------

      const isAvailable = await Sharing.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert(
          "Sharing unavailable",
          "Sharing is not available on this device.",
        );

        return;
      }

      // ------------------------------------------------------
      // CAPTURE YELLOW TICKET
      // ------------------------------------------------------

      const imageUri = await captureRef(shareTicketRef.current, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });

      // ------------------------------------------------------
      // OPEN NATIVE SHARE SHEET
      // ------------------------------------------------------

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

  // ==========================================================
  // PDF HELPERS
  // ==========================================================

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
  // GENERATE PDF
  //
  // One memory image = one PDF page
  // Three memory images = three PDF pages
  // ==========================================================

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

      // ------------------------------------------------------
      // CREATE ONE HTML PAGE FOR EACH IMAGE
      // ------------------------------------------------------

      const pages = images
        .map((image, index) => {
          const safeTitle = escapeHtml(memory?.title || "UNTITLED MEMORY");

          const safeLocation = escapeHtml(memory?.location || "UNKNOWN");

          const safeDescription = escapeHtml(memory?.description || "");

          const dateText = memory?.date
            ? new Date(memory.date).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })
            : "DATE UNKNOWN";

          return `
            <section class="page">

              <div class="ticket">

                <div class="top-line"></div>

                <div class="header">

                  <div>
                    <div class="brand">
                      MEMORY TICKET
                    </div>

                    <div class="tagline">
                      THE POWER OF THE MOMENT
                    </div>
                  </div>

                  <div class="ticket-number">
                    #${escapeHtml(getTicketNumber())}
                  </div>

                </div>


                <div class="photo-container">

                  <img
                    src="${image}"
                    class="photo"
                  />

                </div>


                <div class="content">

                  <div class="label">
                    MEMORY
                  </div>

                  <div class="title">
                    ${safeTitle}
                  </div>

                  <div class="divider"></div>


                  <div class="info-row">

                    <div class="info-item">

                      <div class="info-label">
                        DATE
                      </div>

                      <div class="info-value">
                        ${dateText}
                      </div>

                    </div>


                    <div class="info-item">

                      <div class="info-label">
                        LOCATION
                      </div>

                      <div class="info-value">
                        ${safeLocation}
                      </div>

                    </div>

                  </div>


                  ${
                    safeDescription
                      ? `
                        <div class="description">
                          ${safeDescription}
                        </div>
                      `
                      : ""
                  }

                </div>


                <div class="perforation">

                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>

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
                      .map((_, barIndex) => {
                        let width = 2;

                        if (barIndex % 5 === 0) {
                          width = 5;
                        } else if (barIndex % 3 === 0) {
                          width = 3;
                        }

                        return `
                          <span
                            style="
                              width:${width}px;
                            "
                          ></span>
                        `;
                      })
                      .join("")}

                  </div>

                </div>


                <div class="serial">
                  MT • ${escapeHtml(getTicketNumber())}
                </div>


                <div class="bottom-line"></div>

              </div>

            </section>
          `;
        })
        .join("");

      // ------------------------------------------------------
      // COMPLETE PDF HTML
      // ------------------------------------------------------

      const html = `
        <!DOCTYPE html>

        <html>

        <head>

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <style>

            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              background: #f4f1e8;
              font-family: Arial, Helvetica, sans-serif;
            }

            .page {
              width: 100%;
              min-height: 100vh;

              display: flex;
              align-items: center;
              justify-content: center;

              padding: 24px;

              page-break-after: always;
            }

            .page:last-child {
              page-break-after: auto;
            }

            .ticket {
              width: 100%;
              max-width: 700px;

              background: #f8f5ed;

              border: 2px solid #34345c;

              border-radius: 8px;

              overflow: hidden;

              position: relative;

              padding: 22px;
            }

            .top-line,
            .bottom-line {
              height: 8px;

              border-top: 2px dashed #34345c;
              border-bottom: 2px dashed #34345c;

              margin-bottom: 20px;
            }

            .bottom-line {
              margin-top: 20px;
              margin-bottom: 0;
            }

            .header {
              display: flex;

              justify-content: space-between;
              align-items: flex-start;

              margin-bottom: 18px;
            }

            .brand {
              font-size: 28px;

              font-weight: 900;

              letter-spacing: 2px;

              color: #242424;
            }

            .tagline {
              margin-top: 5px;

              font-size: 11px;

              font-weight: 700;

              letter-spacing: 2px;

              color: #6a6a6a;
            }

            .ticket-number {
              font-size: 14px;

              font-weight: 900;

              color: #34345c;
            }

            .photo-container {
              width: 100%;

              height: 430px;

              overflow: hidden;

              border-radius: 6px;

              border: 2px solid #34345c;

              background: #dedbd1;
            }

            .photo {
              width: 100%;
              height: 100%;

              object-fit: cover;
            }

            .content {
              padding-top: 20px;
            }

            .label {
              font-size: 10px;

              font-weight: 900;

              letter-spacing: 2px;

              color: #777;
            }

            .title {
              margin-top: 6px;

              font-size: 25px;

              line-height: 31px;

              font-weight: 900;

              color: #242424;
            }

            .divider {
              margin-top: 18px;
              margin-bottom: 18px;

              border-top: 2px solid #34345c;
            }

            .info-row {
              display: flex;

              justify-content: space-between;
              gap: 30px;
            }

            .info-item {
              flex: 1;
            }

            .info-label {
              font-size: 9px;

              font-weight: 900;

              letter-spacing: 1.5px;

              color: #777;
            }

            .info-value {
              margin-top: 5px;

              font-size: 14px;

              font-weight: 800;

              color: #242424;
            }

            .description {
              margin-top: 18px;

              font-size: 12px;

              line-height: 18px;

              color: #444;
            }

            .perforation {
              margin-top: 22px;

              display: flex;

              justify-content: space-between;

              align-items: center;

              border-top: 2px dashed #34345c;

              padding-top: 10px;
            }

            .perforation span {
              width: 8px;
              height: 8px;

              background: #34345c;

              border-radius: 50%;
            }

            .footer {
              margin-top: 20px;

              display: flex;

              justify-content: space-between;

              align-items: center;
            }

            .admit {
              font-size: 12px;

              font-weight: 900;

              letter-spacing: 1px;

              color: #242424;
            }

            .footer-small {
              margin-top: 4px;

              font-size: 9px;

              font-weight: 700;

              letter-spacing: 1.5px;

              color: #777;
            }

            .barcode {
              height: 50px;

              display: flex;

              align-items: center;

              overflow: hidden;
            }

            .barcode span {
              height: 46px;

              display: block;

              background: #242424;

              margin-right: 2px;
            }

            .serial {
              margin-top: 15px;

              font-size: 9px;

              font-weight: 900;

              letter-spacing: 2px;

              color: #34345c;
            }

            @media print {

              .page {
                min-height: auto;

                height: 100vh;

                padding: 25px;
              }

              .ticket {
                max-width: none;
              }

            }

          </style>

        </head>

        <body>

          ${pages}

        </body>

        </html>
      `;

      // ------------------------------------------------------
      // CREATE PDF
      // ------------------------------------------------------

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      // ------------------------------------------------------
      // SHARE / SAVE PDF
      // ------------------------------------------------------

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
        "Something went wrong while creating your Memory Ticket PDF.",
      );
    } finally {
      setGeneratingPdf(false);
    }
  };

  // ==========================================================
  // NORMAL MEMORY DETAILS TICKET
  // ==========================================================

  const renderTicket = (image, index) => {
    return (
      <View
        key={`${image}-${index}`}
        style={[
          styles.ticketSlide,
          {
            width: screenWidth - 44,
          },
        ]}
      >
        <View style={styles.ticketShadow}>
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
                <>
                  <Image
                    source={{
                      uri: image,
                    }}
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

  // ==========================================================
  // SHAREABLE YELLOW TICKET
  // ==========================================================

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
            {/* MEMORY */}

            <View style={shareStyles.memorySection}>
              <Text style={shareStyles.memoryLabel}>MEMORY</Text>

              <Text style={shareStyles.memoryName} numberOfLines={3}>
                {memory?.title || "UNTITLED MEMORY"}
              </Text>
            </View>

            {/* BARCODE */}

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

  // ==========================================================
  // SCREEN
  // ==========================================================

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
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          decelerationRate="fast"
          snapToInterval={screenWidth - 44}
          snapToAlignment="start"
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / (screenWidth - 44),
            );

            setActiveImage(index);
          }}
        >
          {images.length > 0
            ? images.map((image, index) => renderTicket(image, index))
            : renderTicket(null, 0)}
        </ScrollView>

        {/* SWIPE HINT */}

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
            ACTION BUTTONS
        ================================================== */}

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

      {/* ======================================================
          SHARE MODAL
      ====================================================== */}

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

// ============================================================
// SHARE TICKET STYLES
// ============================================================

const shareStyles = StyleSheet.create({
  // ==========================================================
  // ACTION BUTTONS
  // ==========================================================

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

  // ==========================================================
  // MEMORY
  // ==========================================================

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

export default MemoryDetailsScreen;
