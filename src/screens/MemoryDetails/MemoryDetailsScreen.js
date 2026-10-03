import {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  useWindowDimensions,
  Modal,
  StyleSheet,
  RefreshControl,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

import { useMemory } from "../../hooks/useMemory";
import useRefresh from "../../hooks/useRefresh";
import { useAppAlert } from "../../context/AlertContext";

import MemoryTicket from "../../components/MemoryTicket/MemoryTicket";
import ShareExportSheet from "../../components/ShareExportSheet/ShareExportSheet";
import TicketCustomizationSheet from "../../components/TicketCustomization/TicketCustomizationSheet";

import { normalizeTicketCustomization } from "../../utils/ticketCustomization";

import {
  getMemoryDetailUrl,
  getMemoryViewerUrl,
} from "../../utils/cloudinary";

import styles from "./memoryDetailsStyles";

function MemoryDetailsScreen({
  navigation,
  route,
}) {
  const {
    getMemoryById,
    toggleFavorite,
    deleteMemory,
    updateMemory,
    refreshMemories,
  } = useMemory();

  const { showAlert } =
    useAppAlert();

  const refreshMemoryDetails =
    useCallback(
      async () => {
        await refreshMemories();
      },
      [refreshMemories],
    );

  const {
    refreshing,
    onRefresh,
  } = useRefresh(
    refreshMemoryDetails,
  );

  const {
    width: screenWidth,
    height: screenHeight,
  } = useWindowDimensions();

  const memoryId =
    route?.params?.memoryId;

  const [activeImage, setActiveImage] =
    useState(0);

  const [
    imageViewerVisible,
    setImageViewerVisible,
  ] = useState(false);

  const [viewerImage, setViewerImage] =
    useState(0);

  const shareSheetRef =
    useRef(null);

  const [sharing, setSharing] =
    useState(false);

  const [savingImage, setSavingImage] =
    useState(false);

  const ticketRefs =
    useRef([]);

  const [
    customizationVisible,
    setCustomizationVisible,
  ] = useState(false);

  const [
    customizationSaving,
    setCustomizationSaving,
  ] = useState(false);

  const [
    draftCustomization,
    setDraftCustomization,
  ] = useState(null);

  const memory =
    getMemoryById(memoryId);

  if (!memory) {
    return (
      <View
        style={
          styles.notFoundContainer
        }
      >
        <Ionicons
          name="sad-outline"
          size={45}
          color="#34345C"
        />

        <Text
          style={
            styles.notFoundTitle
          }
        >
          Memory not found
        </Text>

        <TouchableOpacity
          style={
            styles.backToMemoriesButton
          }
          onPress={() =>
            navigation.goBack()
          }
          activeOpacity={0.8}
        >
          <Text
            style={
              styles.backToMemoriesText
            }
          >
            GO BACK
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images =
    Array.isArray(memory?.images)
      ? memory.images
      : memory?.image
        ? [memory.image]
        : [];

  const tags =
    Array.isArray(memory?.tags)
      ? [
          ...new Set(
            memory.tags
              .filter(
                (tag) =>
                  typeof tag ===
                  "string",
              )
              .map((tag) =>
                tag
                  .trim()
                  .replace(
                    /^#+/,
                    "",
                  )
                  .toLowerCase(),
              )
              .filter(Boolean),
          ),
        ]
      : [];

  const detailImages =
    images.map((image) =>
      getMemoryDetailUrl(image),
    );

  const viewerImages =
    images.map((image) =>
      getMemoryViewerUrl(image),
    );

  const ticketPreviewMemory =
    draftCustomization
      ? {
          ...memory,
          ...draftCustomization,
        }
      : memory;

  const openImageViewer = (
    index,
  ) => {
    if (!images[index]) {
      return;
    }

    setViewerImage(index);
    setImageViewerVisible(
      true,
    );
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
  };

  const handleViewerScroll = (
    event,
  ) => {
    const index = Math.round(
      event.nativeEvent.contentOffset
        .x / screenWidth,
    );

    setViewerImage(index);
    setActiveImage(index);
  };

  const getTicketNumber = () => {
    if (memory?.id) {
      return memory.id
        .slice(-5)
        .toUpperCase();
    }

    return "00001";
  };

  const handleFavorite =
    async () => {
      try {
        await toggleFavorite(
          memory.id,
        );
      } catch (error) {
        console.log(
          "Favorite update error:",
          error,
        );
      }
    };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = () => {
    showAlert({
      type: "danger",
      icon: "trash-outline",
      title: "Delete Memory?",
      message:
        "This memory will be permanently removed from your collection. This action cannot be undone.",
      cancelText: "Cancel",
      confirmText: "Delete",
      showCancel: true,

      onConfirm: async () => {
        try {
          await deleteMemory(
            memory.id,
          );

          navigation.navigate(
            "MainTabs",
            {
              screen: "Memories",
            },
          );
        } catch (error) {
          console.log(
            "Delete error:",
            error,
          );
        }
      },
    });
  };

  // --------------------------------------------------
  // SHARE SHEET
  // --------------------------------------------------

  const openShareSheet = () => {
    shareSheetRef.current?.present();
  };

  // --------------------------------------------------
  // TICKET CUSTOMIZATION
  // --------------------------------------------------

  const openCustomization = () => {
    setDraftCustomization(
      normalizeTicketCustomization(
        memory,
      ),
    );

    setCustomizationVisible(
      true,
    );
  };

  const closeCustomization = () => {
    if (customizationSaving) {
      return;
    }

    setCustomizationVisible(
      false,
    );

    setDraftCustomization(null);
  };

  const handleSaveCustomization =
    async () => {
      if (
        customizationSaving ||
        !draftCustomization
      ) {
        return;
      }

      try {
        setCustomizationSaving(
          true,
        );

        await updateMemory(
          memory.id,
          {
            ticketStyle:
              draftCustomization.ticketStyle,

            ticketAccent:
              draftCustomization.ticketAccent,

            ticketOptions: {
              ...draftCustomization.ticketOptions,
            },
          },
        );

        setCustomizationVisible(
          false,
        );

        setDraftCustomization(
          null,
        );

        showAlert({
          type: "success",
          icon:
            "checkmark-circle-outline",
          title: "Ticket Updated",
          message:
            "Your ticket customization has been saved.",
          confirmText: "Done",
        });
      } catch (error) {
        console.error(
          "Ticket customization update error:",
          error,
        );

        showAlert({
          type: "danger",
          icon:
            "close-circle-outline",
          title: "Update Failed",
          message:
            error?.message ||
            "Unable to save ticket customization.",
          confirmText: "OK",
        });
      } finally {
        setCustomizationSaving(
          false,
        );
      }
    };

  // --------------------------------------------------
  // CAPTURE CURRENT TICKET
  // Used by Share + Save Image
  // --------------------------------------------------

  const captureCurrentTicket =
    async () => {
      const safeIndex =
        activeImage >= 0 &&
        activeImage < images.length
          ? activeImage
          : 0;

      const ticketRef =
        ticketRefs.current[
          safeIndex
        ];

      if (!ticketRef) {
        throw new Error(
          "Memory Ticket is still rendering.",
        );
      }

      return await captureRef(
        ticketRef,
        {
          format: "png",
          quality: 1,
          result: "tmpfile",
        },
      );
    };

  // --------------------------------------------------
  // MORE / SHARE IMAGE
  // --------------------------------------------------

  const handleMore = async () => {
    try {
      if (sharing) {
        return;
      }

      setSharing(true);

      const available =
        await Sharing.isAvailableAsync();

      if (!available) {
        showAlert({
          type: "warning",
          icon:
            "share-social-outline",
          title:
            "Sharing Unavailable",
          message:
            "Sharing is not available on this device.",
          confirmText: "OK",
        });

        return;
      }

      const imageUri =
        await captureCurrentTicket();

      await Sharing.shareAsync(
        imageUri,
        {
          mimeType:
            "image/png",

          dialogTitle:
            "Share Memory Ticket",

          UTI: "public.png",
        },
      );
    } catch (error) {
      console.log(
        "Share error:",
        error,
      );

      showAlert({
        type: "danger",
        icon:
          "close-circle-outline",
        title: "Share Failed",
        message:
          "Unable to share the Memory Ticket.",
        confirmText: "OK",
      });
    } finally {
      setSharing(false);
    }
  };

  // --------------------------------------------------
  // SAVE IMAGE
  // --------------------------------------------------

  const handleSaveImage =
    async () => {
      try {
        if (savingImage) {
          return;
        }

        setSavingImage(true);

        const permission =
          await MediaLibrary.requestPermissionsAsync();

        if (!permission.granted) {
          showAlert({
            type: "warning",
            icon:
              "images-outline",
            title:
              "Permission Required",
            message:
              "Allow photo access so Memory Ticket can save the image to your device.",
            confirmText: "OK",
          });

          return;
        }

        const imageUri =
          await captureCurrentTicket();

        await MediaLibrary.saveToLibraryAsync(
          imageUri,
        );

        shareSheetRef.current?.close();

        showAlert({
          type: "success",
          icon:
            "checkmark-circle-outline",
          title: "Saved",
          message:
            "Your Memory Ticket has been saved to your gallery.",
          confirmText: "Done",
        });
      } catch (error) {
        console.log(
          "Save image error:",
          error,
        );

        showAlert({
          type: "danger",
          icon:
            "close-circle-outline",
          title: "Save Failed",
          message:
            "Something went wrong while saving your Memory Ticket.",
          confirmText: "OK",
        });
      } finally {
        setSavingImage(false);
      }
    };

  // --------------------------------------------------
  // TICKET CAROUSEL ITEM
  // --------------------------------------------------

  const renderTicket = ({
    item: image,
    index,
  }) => {
    return (
      <View
        style={[
          styles.ticketSlide,
          {
            width:
              screenWidth - 44,
            marginRight: 12,
          },
        ]}
      >
        <View
          ref={(ref) => {
            ticketRefs.current[
              index
            ] = ref;
          }}
          collapsable={false}
          style={
            styles.ticketShadow
          }
        >
          <MemoryTicket
            key={`${memory.id}-${ticketPreviewMemory.ticketStyle}-${ticketPreviewMemory.ticketAccent}`}
            memory={
              ticketPreviewMemory
            }
            image={
              detailImages[index] ||
              image
            }
            ticketNumber={
              getTicketNumber()
            }
            onPress={() =>
              openImageViewer(
                index,
              )
            }
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={detailStyles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#34345C"
            colors={["#34345C"]}
            progressBackgroundColor="#FFFFFF"
          />
        }
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

        <FlatList
          horizontal
          data={images.length > 0 ? images : [null]}
          renderItem={renderTicket}
          keyExtractor={(item, index) => `${item || "empty"}-${index}`}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          directionalLockEnabled
          decelerationRate="fast"
          snapToInterval={screenWidth - 44 + 12}
          snapToAlignment="start"
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          windowSize={3}
          removeClippedSubviews={true}
          getItemLayout={(_, index) => ({
            length: screenWidth - 44 + 12,

            offset: (screenWidth - 44 + 12) * index,

            index,
          })}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / (screenWidth - 44 + 12),
            );

            if (index >= 0 && index < images.length) {
              setActiveImage(index);
            }
          }}
        />

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

        {/* TAGS */}

        {tags.length > 0 && (
          <View style={detailStyles.tagsSection}>
            <Text style={detailStyles.tagsLabel}>TAGS</Text>

            <View style={detailStyles.tagsContainer}>
              {tags.map((tag) => (
                <View key={tag} style={detailStyles.tagChip}>
                  <Text style={detailStyles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* CUSTOMIZE TICKET */}

        <TouchableOpacity
          style={detailStyles.customizeButton}
          onPress={openCustomization}
          activeOpacity={0.85}
        >
          <Ionicons name="color-palette-outline" size={19} color="#34345C" />

          <Text style={detailStyles.customizeButtonText}>CUSTOMIZE TICKET</Text>
        </TouchableOpacity>

        {/* SHARE */}

        <TouchableOpacity
          style={detailStyles.shareButton}
          onPress={openShareSheet}
          activeOpacity={0.85}
        >
          <Ionicons name="share-social-outline" size={19} color="#FFFFFF" />

          <Text style={detailStyles.shareButtonText}>SHARE MEMORY</Text>
        </TouchableOpacity>

        {/* EDIT MEMORY */}

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

        {/* DELETE MEMORY */}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={18} color="#D9534F" />

          <Text style={styles.deleteText}>DELETE MEMORY</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>KEEP THE MOMENT. KEEP THE STORY.</Text>
      </ScrollView>

      {/* SHARE / EXPORT SHEET */}

      <ShareExportSheet
        ref={shareSheetRef}
        onSaveImage={handleSaveImage}

        onExportPDF={async () => {
          try {
            const frontTicketUri = await captureCurrentTicket();
            shareSheetRef.current?.close();
            setTimeout(() => {
              navigation.navigate("ExportPdf", {
                memoryId: memory.id,
                frontTicketUri,
              });
            }, 250);
          } catch (error) {
            console.log("Prepare PDF export error:", error);
          }
        }}
        
        onMore={handleMore}
        savingImage={savingImage}
        generatingPdf={false}
        sharing={sharing}
      />

      {/* TICKET CUSTOMIZATION */}

      <TicketCustomizationSheet
        visible={customizationVisible}
        value={draftCustomization || normalizeTicketCustomization(memory)}
        onChange={setDraftCustomization}
        onClose={closeCustomization}
        onSave={handleSaveCustomization}
        saving={customizationSaving}
      />

      {/* FULLSCREEN IMAGE VIEWER */}

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

          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            initialScrollIndex={viewerImage}
            initialNumToRender={1}
            maxToRenderPerBatch={2}
            windowSize={3}
            removeClippedSubviews={true}
            getItemLayout={(_, index) => ({
              length: screenWidth,

              offset: screenWidth * index,

              index,
            })}
            keyExtractor={(item, index) => `${item}-viewer-${index}`}
            renderItem={({ item: image, index }) => (
              <View
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
                    uri: viewerImages[index] || image,
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
            )}
            onMomentumScrollEnd={handleViewerScroll}
          />

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

const detailStyles =
  StyleSheet.create({
    scrollView: {
      flex: 1,
    },

    tagsSection: {
      marginHorizontal: 22,
      marginTop: 16,
    },

    tagsLabel: {
      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 1.5,
      color: "#707080",
      marginBottom: 8,
    },

    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 7,
    },

    tagChip: {
      backgroundColor:
        "transparent",

      paddingHorizontal: 0,
      paddingVertical: 2,

      borderBottomWidth: 1,
      borderBottomColor:
        "#34345C",
    },

    tagText: {
      color: "#34345C",
      fontSize: 11,
      fontWeight: "700",
    },

    customizeButton: {
      height: 50,

      marginHorizontal: 22,
      marginTop: 20,

      borderRadius: 14,

      backgroundColor: "#FFFFFF",

      borderWidth: 1,
      borderColor: "#D9D8E2",

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      gap: 9,
    },

    customizeButtonText: {
      color: "#34345C",

      fontSize: 11,
      fontWeight: "900",

      letterSpacing: 1,
    },

    shareButton: {
      height: 50,

      marginHorizontal: 22,
      marginTop: 12,

      borderRadius: 14,

      backgroundColor:
        "#34345C",

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

const imageViewerStyles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#0B0B0D",
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

      backgroundColor:
        "rgba(255, 255, 255, 0.12)",

      borderWidth: 1,

      borderColor:
        "rgba(255, 255, 255, 0.12)",

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

      backgroundColor:
        "rgba(255, 255, 255, 0.12)",

      borderWidth: 1,

      borderColor:
        "rgba(255, 255, 255, 0.14)",

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

      backgroundColor:
        "#0B0B0D",
    },

    fullImage: {
      alignSelf: "center",
      backgroundColor:
        "transparent",
    },

    bottomHint: {
      position: "absolute",

      left: 18,
      right: 18,
      bottom: 28,

      minHeight: 42,

      paddingHorizontal: 15,

      borderRadius: 21,

      backgroundColor:
        "rgba(255, 255, 255, 0.10)",

      borderWidth: 1,

      borderColor:
        "rgba(255, 255, 255, 0.10)",

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
