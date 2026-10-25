import {
  useCallback,
  useRef,
  useState,
} from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  useWindowDimensions,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system/legacy";
import { useMemory } from "../../hooks/useMemory";
import { useAppAlert } from "../../context/AlertContext";
import MemoryImageViewer from "../../components/MemoryImageViewer/MemoryImageViewer";
import MemoryTicket from "../../components/MemoryTicket/MemoryTicket";
import ShareExportSheet from "../../components/ShareExportSheet/ShareExportSheet";
import TactileButton from "../../components/common/TactileButton";
import MementoRefresh from "../../components/common/MementoRefresh";
import { normalizeTicketCustomization } from "../../utils/ticketCustomization";
import { useMementoNotifications } from "../../hooks/useMementoNotifications";
import {
  getMemoryDetailUrl,
  getMemoryViewerUrl,
} from "../../utils/cloudinary";
import styles from "./memoryDetailsStyles";
import { useTheme } from "../../context/ThemeContext";

function MemoryDetailsScreen({ navigation, route }) {
  const { notify, notifyError } = useMementoNotifications();
  const { theme, isDark } = useTheme();

  const colors = theme?.colors || {};

  const screenBackground =
    colors.background ||
    (isDark ? "#171624" : "#F1F0F6");

  const surfaceColor =
    colors.surface ||
    colors.card ||
    (isDark ? "#211F30" : "#FFFFFF");

  const textColor =
    colors.text ||
    (isDark ? "#F7F5FC" : "#242424");

  const secondaryTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#C4C0D0" : "#707080");

  const borderColor =
    colors.border ||
    (isDark ? "#39364D" : "#D9D8E2");

  const primaryColor =
    colors.primary ||
    (isDark ? "#C8C2FF" : "#34345C");

  const {
    getMemoryById,
    toggleFavorite,
    deleteMemory,
    updateMemory,
    refreshMemories,
  } = useMemory();

  const { showAlert } = useAppAlert();
  const { width: screenWidth } = useWindowDimensions();

  const memoryId = route?.params?.memoryId;

  const refreshMemoryDetails = useCallback(async () => {
    await refreshMemories();
  }, [refreshMemories]);

  const [activeImage, setActiveImage] = useState(0);
  const [imageViewerVisible, setImageViewerVisible] =
    useState(false);
  const [viewerImage, setViewerImage] = useState(0);

  const shareSheetRef = useRef(null);

  const [sharing, setSharing] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [sharingPhoto, setSharingPhoto] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);

  const ticketRefs = useRef([]);

  const [customizationVisible, setCustomizationVisible] =
    useState(false);
  const [customizationSaving, setCustomizationSaving] =
    useState(false);
  const [draftCustomization, setDraftCustomization] =
    useState(null);

  const favoriteScale = useRef(
    new Animated.Value(1),
  ).current;

  const memory = getMemoryById(memoryId);

  if (!memory) {
    return (
      <View
        style={[
          styles.notFoundContainer,
          {
            backgroundColor: screenBackground,
          },
        ]}
      >
        <StatusBar
          barStyle={
            isDark ? "light-content" : "dark-content"
          }
          backgroundColor={screenBackground}
        />

        <Ionicons
          name="sad-outline"
          size={45}
          color={primaryColor}
        />

        <Text
          style={[
            styles.notFoundTitle,
            {
              color: textColor,
            },
          ]}
        >
          Memory not found
        </Text>

        <TouchableOpacity
          style={[
            styles.backToMemoriesButton,
            {
              backgroundColor: primaryColor,
            },
          ]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text
            style={[
              styles.backToMemoriesText,
              {
                color: "#FFFFFF",
              },
            ]}
          >
            GO BACK
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = Array.isArray(memory?.images)
    ? memory.images
    : memory?.image
      ? [memory.image]
      : [];

  const tags = Array.isArray(memory?.tags)
    ? [
        ...new Set(
          memory.tags
            .filter((tag) => typeof tag === "string")
            .map((tag) =>
              tag
                .trim()
                .replace(/^#+/, "")
                .toLowerCase(),
            )
            .filter(Boolean),
        ),
      ]
    : [];

  const detailImages = images.map((image) =>
    getMemoryDetailUrl(image),
  );

  const viewerImages = images.map((image) =>
    getMemoryViewerUrl(image),
  );

  const ticketPreviewMemory = draftCustomization
    ? {
        ...memory,
        ...draftCustomization,
      }
    : memory;

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

  const getTicketNumber = () => {
    if (memory?.id) {
      return String(memory.id).slice(-5).toUpperCase();
    }

    return "00001";
  };


  const handleFavorite = async () => {
    const currentMemoryId =
      memory?.id ||
      memory?._id ||
      memory?.clientMemoryId;

    if (!currentMemoryId) {
      notifyError(
        "Favorite Update Failed",
        "This memory could not be identified.",
      );

      return;
    }

    const wasFavorite = memory.favorite === true;

    try {
      favoriteScale.stopAnimation();
      favoriteScale.setValue(1);

      Animated.sequence([
        Animated.spring(favoriteScale, {
          toValue: 1.3,
          friction: 4,
          tension: 180,
          useNativeDriver: true,
        }),

        Animated.spring(favoriteScale, {
          toValue: 0.92,
          friction: 5,
          tension: 180,
          useNativeDriver: true,
        }),

        Animated.spring(favoriteScale, {
          toValue: 1,
          friction: 5,
          tension: 160,
          useNativeDriver: true,
        }),
      ]).start();

      const result = await toggleFavorite(
        currentMemoryId,
      );

      if (
        result === false ||
        result?.success === false
      ) {
        throw new Error(
          result?.message ||
            "Unable to update favorite status.",
        );
      }

      if (wasFavorite) {
        notify("favoriteRemoved", {
          message:
            `"${memory.title || "Your memory"}" has been removed from favorites.`,
        });
      } else {
        notify("favoriteAdded", {
          message:
            `"${memory.title || "Your memory"}" has been added to favorites.`,
        });
      }
    } catch (error) {
      console.error(
        "Favorite update error:",
        error,
      );

      notifyError(
        "Favorite Update Failed",
        error?.message ||
          "Unable to update favorite status. Please try again.",
      );
    }
  };

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
            memory.id ||
              memory._id ||
              memory.clientMemoryId,
          );

          navigation.navigate("MainTabs", {
            screen: "Memories",
          });

          notify("memoryDeleted");
        } catch (error) {
          console.error("Delete error:", error);

          notifyError(
            "Delete Failed",
            error?.message ||
              "Unable to delete this memory. Please try again.",
          );
        }
      },
    });
  };

  const openShareSheet = () => {
    shareSheetRef.current?.present();
  };

  const openCustomization = () => {
    setDraftCustomization(
      normalizeTicketCustomization(memory),
    );

    setCustomizationVisible(true);
  };

  const closeCustomization = () => {
    if (customizationSaving) {
      return;
    }

    setCustomizationVisible(false);
    setDraftCustomization(null);
  };

  const handleSaveCustomization = async () => {
    if (
      customizationSaving ||
      !draftCustomization
    ) {
      return;
    }

    try {
      setCustomizationSaving(true);

      await updateMemory(
        memory.id ||
          memory._id ||
          memory.clientMemoryId,
        {
          ticketStyle: draftCustomization.ticketStyle,

          ticketAccent: draftCustomization.ticketAccent,

          ticketOptions: {
            ...draftCustomization.ticketOptions,
          },
        },
      );

      setCustomizationVisible(false);
      setDraftCustomization(null);

      showAlert({
        type: "success",
        icon: "checkmark-circle-outline",
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
        icon: "close-circle-outline",
        title: "Update Failed",
        message:
          error?.message ||
          "Unable to save ticket customization.",
        confirmText: "OK",
      });
    } finally {
      setCustomizationSaving(false);
    }
  };

  const captureCurrentTicket = async () => {
    const safeIndex =
      activeImage >= 0 && activeImage < images.length
        ? activeImage
        : 0;

    const ticketRef = ticketRefs.current[safeIndex];

    if (!ticketRef) {
      throw new Error(
        "Memory Ticket is still rendering.",
      );
    }

    return captureRef(ticketRef, {
      format: "png",
      quality: 1,
      result: "tmpfile",
    });
  };

  const downloadViewerImage = async (index) => {
    const remoteUri = viewerImages[index];

    if (!remoteUri) {
      throw new Error("Photo is unavailable.");
    }

    const cleanUri = remoteUri.split("?")[0];

    const extensionMatch = cleanUri.match(
      /\.(jpg|jpeg|png|webp)$/i,
    );

    const extension =
      extensionMatch?.[1] || "jpg";

    const currentMemoryId = String(
      memory.id ||
        memory._id ||
        memory.clientMemoryId ||
        "memory",
    );

    const fileName =
      `memento-photo-${currentMemoryId}-` +
      `${index + 1}-${Date.now()}.${extension}`;

    const cacheDirectory =
      FileSystem.cacheDirectory ||
      FileSystem.documentDirectory;

    if (!cacheDirectory) {
      throw new Error(
        "No writable directory is available.",
      );
    }

    const localUri = `${cacheDirectory}${fileName}`;

    const result = await FileSystem.downloadAsync(
      remoteUri,
      localUri,
    );

    return {
      uri: result.uri,
      extension,
    };
  };

  const handleSharePhoto = async (index) => {
    try {
      if (sharingPhoto) {
        return;
      }

      setSharingPhoto(true);

      const available =
        await Sharing.isAvailableAsync();

      if (!available) {
        showAlert({
          type: "warning",
          icon: "share-social-outline",
          title: "Sharing Unavailable",
          message:
            "Sharing is not available on this device.",
          confirmText: "OK",
        });

        return;
      }

      const { uri, extension } =
        await downloadViewerImage(index);

      const mimeType =
        extension === "png"
          ? "image/png"
          : extension === "webp"
            ? "image/webp"
            : "image/jpeg";

      await Sharing.shareAsync(uri, {
        mimeType,
        dialogTitle: "Share Photo",
        UTI:
          extension === "png"
            ? "public.png"
            : "public.jpeg",
      });
    } catch (error) {
      console.error("Photo share error:", error);

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Share Failed",
        message: "Unable to share this photo.",
        confirmText: "OK",
      });
    } finally {
      setSharingPhoto(false);
    }
  };

  const handleSavePhoto = async (index) => {
    try {
      if (savingPhoto) {
        return;
      }

      setSavingPhoto(true);

      const permission =
        await MediaLibrary.requestPermissionsAsync();

      if (!permission.granted) {
        showAlert({
          type: "warning",
          icon: "images-outline",
          title: "Permission Required",
          message:
            "Allow photo access so Memento can save the photo to your gallery.",
          confirmText: "OK",
        });

        return;
      }

      const { uri } =
        await downloadViewerImage(index);

      await MediaLibrary.saveToLibraryAsync(uri);

      showAlert({
        type: "success",
        icon: "checkmark-circle-outline",
        title: "Saved",
        message: "Photo saved to your gallery.",
        confirmText: "Done",
      });
    } catch (error) {
      console.error("Photo save error:", error);

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Save Failed",
        message: "Unable to save this photo.",
        confirmText: "OK",
      });
    } finally {
      setSavingPhoto(false);
    }
  };

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
          icon: "share-social-outline",
          title: "Sharing Unavailable",
          message:
            "Sharing is not available on this device.",
          confirmText: "OK",
        });

        return;
      }

      const imageUri =
        await captureCurrentTicket();

      await Sharing.shareAsync(imageUri, {
        mimeType: "image/png",
        dialogTitle: "Share Memory Ticket",
        UTI: "public.png",
      });
    } catch (error) {
      console.error("Share error:", error);

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Share Failed",
        message:
          "Unable to share the Memory Ticket.",
        confirmText: "OK",
      });
    } finally {
      setSharing(false);
    }
  };

  const handleSaveImage = async () => {
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
          icon: "images-outline",
          title: "Permission Required",
          message:
            "Allow photo access so Memory Ticket can save the image to your device.",
          confirmText: "OK",
        });

        return;
      }

      const imageUri =
        await captureCurrentTicket();

      await MediaLibrary.saveToLibraryAsync(imageUri);

      shareSheetRef.current?.close();

      showAlert({
        type: "success",
        icon: "checkmark-circle-outline",
        title: "Saved",
        message:
          "Your Memory Ticket has been saved to your gallery.",
        confirmText: "Done",
      });
    } catch (error) {
      console.error("Save image error:", error);

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Save Failed",
        message:
          "Something went wrong while saving your Memory Ticket.",
        confirmText: "OK",
      });
    } finally {
      setSavingImage(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const frontTicketUri =
        await captureCurrentTicket();

      shareSheetRef.current?.close();

      setTimeout(() => {
        navigation.navigate("ExportPdf", {
          memoryId:
            memory.id ||
            memory._id ||
            memory.clientMemoryId,
          frontTicketUri,
        });
      }, 250);
    } catch (error) {
      console.error(
        "Prepare PDF export error:",
        error,
      );

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Export Failed",
        message:
          "Unable to prepare your Memory Ticket for export.",
        confirmText: "OK",
      });
    }
  };

  const renderTicket = ({ item: image, index }) => {
    return (
      <View
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
            key={
              `${memory.id || memory._id}-` +
              `${ticketPreviewMemory.ticketStyle}-` +
              `${ticketPreviewMemory.ticketAccent}`
            }
            memory={ticketPreviewMemory}
            image={detailImages[index] || image}
            ticketNumber={getTicketNumber()}
            onPress={() => openImageViewer(index)}
          />
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: screenBackground,
        },
      ]}
    >
      <StatusBar
        barStyle={
          isDark ? "light-content" : "dark-content"
        }
        backgroundColor={screenBackground}
      />

      {/* THEME-AWARE PULL-TO-REFRESH */}

      <MementoRefresh
        onRefresh={refreshMemoryDetails}
        label="Refreshing memory..."
      >
        <ScrollView
          style={[
            detailStyles.scrollView,
            {
              backgroundColor: screenBackground,
            },
          ]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}

          <View
            style={[
              styles.header,
              {
                backgroundColor: screenBackground,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.backButton,
                {
                  backgroundColor: surfaceColor,
                  borderColor,
                },
              ]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={textColor}
              />
            </TouchableOpacity>

            <Text
              style={[
                styles.headerTitle,
                {
                  color: textColor,
                },
              ]}
            >
              Memory
            </Text>

            <TouchableOpacity
              style={[
                styles.favoriteButton,
                memory.favorite &&
                  styles.favoriteButtonActive,
              ]}
              onPress={handleFavorite}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={
                memory.favorite
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: favoriteScale,
                    },
                  ],
                }}
              >
                <Ionicons
                  name={
                    memory.favorite
                      ? "heart"
                      : "heart-outline"
                  }
                  size={21}
                  color={
                    memory.favorite
                      ? "#E76F51"
                      : primaryColor
                  }
                />
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* TICKET CAROUSEL */}

          <FlatList
            horizontal
            data={images.length > 0 ? images : [null]}
            renderItem={renderTicket}
            keyExtractor={(item, index) =>
              `${item || "empty"}-${index}`
            }
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            directionalLockEnabled
            decelerationRate="fast"
            snapToInterval={screenWidth - 44 + 12}
            snapToAlignment="start"
            initialNumToRender={1}
            maxToRenderPerBatch={2}
            windowSize={3}
            removeClippedSubviews
            getItemLayout={(_, index) => ({
              length: screenWidth - 44 + 12,
              offset:
                (screenWidth - 44 + 12) * index,
              index,
            })}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x /
                  (screenWidth - 44 + 12),
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
                color={secondaryTextColor}
              />

              <Text
                style={[
                  styles.swipeHintText,
                  {
                    color: secondaryTextColor,
                  },
                ]}
              >
                Swipe to view photos
              </Text>

              <Text
                style={[
                  styles.swipeCountText,
                  {
                    color: secondaryTextColor,
                  },
                ]}
              >
                {activeImage + 1}/{images.length}
              </Text>
            </View>
          )}

          {/* TAGS */}

          {tags.length > 0 && (
            <View
              style={[
                detailStyles.tagsSection,
                {
                  backgroundColor: surfaceColor,
                  borderColor,
                },
              ]}
            >
              <Text
                style={[
                  detailStyles.tagsLabel,
                  {
                    color: secondaryTextColor,
                  },
                ]}
              >
                TAGS
              </Text>

              <View style={detailStyles.tagsContainer}>
                {tags.map((tag) => (
                  <View
                    key={tag}
                    style={[
                      detailStyles.tagChip,
                      {
                        backgroundColor:
                          colors.surfaceSecondary ||
                          (isDark
                            ? "#292740"
                            : "#F1F0F6"),
                        borderColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        detailStyles.tagText,
                        {
                          color: primaryColor,
                        },
                      ]}
                    >
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* SHARE MEMORY */}

          <View
            style={{
              marginHorizontal: 22,
              marginTop: 12,
            }}
          >
            <TactileButton
              label="SHARE MEMORY"
              icon="share-social-outline"
              onPress={openShareSheet}
              color={primaryColor}
              textColor="#FFFFFF"
              iconColor="#FFFFFF"
              height={50}
              borderRadius={14}
              depth={4}
              accessibilityLabel="Share memory"
              textStyle={detailStyles.shareButtonText}
            />
          </View>

          {/* EDIT MEMORY */}

          <View
            style={{
              marginHorizontal: 22,
              marginTop: 12,
            }}
          >
            <TactileButton
              label="EDIT MEMORY"
              icon="create-outline"
              onPress={() =>
                navigation.navigate("EditMemory", {
                  memoryId:
                    memory.id ||
                    memory._id ||
                    memory.clientMemoryId,
                })
              }
              color={surfaceColor}
              baseColor={
                isDark ? "#14131F" : "#D3D2DE"
              }
              textColor={primaryColor}
              iconColor={primaryColor}
              height={50}
              borderRadius={14}
              depth={3}
              accessibilityLabel="Edit memory"
              contentStyle={{
                borderWidth: 1,
                borderColor,
              }}
              textStyle={[
                styles.editText,
                {
                  color: primaryColor,
                },
              ]}
            />
          </View>

          {/* DELETE MEMORY */}

          <View
            style={{
              marginHorizontal: 22,
              marginTop: 12,
            }}
          >
            <TactileButton
              label="DELETE MEMORY"
              icon="trash-outline"
              onPress={handleDelete}
              color={colors.danger || "#D9534F"}
              baseColor="#8F2929"
              textColor="#FFFFFF"
              iconColor="#FFFFFF"
              height={50}
              borderRadius={14}
              depth={3}
              accessibilityLabel="Delete memory"
              accessibilityHint="Opens a confirmation before deleting this memory"
              textStyle={[
                styles.deleteText,
                {
                  color: "#FFFFFF",
                },
              ]}
            />
          </View>

          {/* FOOTER */}

          <Text
            style={[
              styles.footerText,
              {
                color: secondaryTextColor,
              },
            ]}
          >
            KEEP THE MOMENT. KEEP THE STORY.
          </Text>
        </ScrollView>
      </MementoRefresh>

      {/* SHARE / EXPORT SHEET */}

      <ShareExportSheet
        ref={shareSheetRef}
        onSaveImage={handleSaveImage}
        onExportPDF={handleExportPDF}
        onMore={handleMore}
        savingImage={savingImage}
        generatingPdf={false}
        sharing={sharing}
      />

      {/* TICKET CUSTOMIZATION — CURRENTLY DISABLED */}

      {/*
      <TicketCustomizationSheet
        visible={customizationVisible}
        value={
          draftCustomization ||
          normalizeTicketCustomization(memory)
        }
        onChange={setDraftCustomization}
        onClose={closeCustomization}
        onSave={handleSaveCustomization}
        saving={customizationSaving}
      />
      */}

      {/* FULLSCREEN IMAGE VIEWER */}

      <MemoryImageViewer
        visible={imageViewerVisible}
        images={viewerImages}
        initialIndex={viewerImage}
        onClose={closeImageViewer}
        onIndexChange={(index) => {
          setViewerImage(index);
          setActiveImage(index);
        }}
        onShare={handleSharePhoto}
        onSave={handleSavePhoto}
        sharing={sharingPhoto}
        saving={savingPhoto}
      />
    </View>
  );
}

const detailStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  tagsSection: {
    marginHorizontal: 22,
    marginTop: 16,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },

  tagsLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 10,
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 8,
  },

  tagText: {
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

export default MemoryDetailsScreen;