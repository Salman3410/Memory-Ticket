import {
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCollection } from "../../hooks/useCollection";
import { useMemory } from "../../hooks/useMemory";
import { useTheme } from "../../context/ThemeContext";
import MemoryTicket from "../../components/MemoryTicket/MemoryTicket";
import MementoLogo from "../../components/common/MementoLogo";
import TactileButton from "../../components/common/TactileButton";
import { useAppAlert } from "../../context/AlertContext";
import { getMemoryDetailUrl } from "../../utils/cloudinary";

function CollectionDetailsScreen({ route, navigation }) {
  const { collectionId } = route.params || {};
  const { showAlert } = useAppAlert();
  const {
    getCollectionById,
    removeMemoryFromCollection,
    deleteCollection,
  } = useCollection();
  const { memories: allMemories = [] } = useMemory();
  const { theme, isDark } = useTheme();

  const colors = useMemo(() => {
    const themeColors = theme?.colors || {};

    return {
      background:
        themeColors.background ||
        (isDark ? "#171724" : "#F1F0F6"),
      surface:
        themeColors.surface ||
        themeColors.card ||
        (isDark ? "#232333" : "#FFFFFF"),
      text:
        themeColors.text ||
        (isDark ? "#F1F0F6" : "#242424"),
      textSecondary:
        themeColors.textSecondary ||
        themeColors.textMuted ||
        (isDark ? "#A6A6B8" : "#737387"),
      border:
        themeColors.border ||
        (isDark ? "#38384C" : "#D9D8E2"),
      primary: themeColors.primary || "#34345C",
      accent: themeColors.accent || "#E76F51",
      placeholder:
        themeColors.placeholder ||
        (isDark ? "#88889C" : "#9A9AA3"),
      mutedSurface: isDark ? "#2C2C40" : "#F6F5F9",
      countSurface: isDark ? "#303047" : "#E9E8F1",
      coverCountSurface: isDark ? "#E4E2EE" : "#FFFFFF",
      white: "#FFFFFF",
    };
  }, [theme, isDark]);

  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark],
  );

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [removingMemoryId, setRemovingMemoryId] = useState(null);

  const loadCollection = useCallback(
    async (showLoader = true) => {
      if (!collectionId) {
        setCollection(null);
        setLoading(false);
        return;
      }

      try {
        if (showLoader) {
          setLoading(true);
        }

        const data = await getCollectionById(collectionId);

        setCollection(data || null);
      } catch (error) {
  console.error("Failed to load collection details:", error);

  if (showLoader) {
    showAlert({
      type: "danger",
      icon: "cloud-offline-outline",
      title: "Unable to Load Collection",
      message:
        error?.message ||
        "Something went wrong while loading this collection. Please try again.",
      confirmText: "OK",
    });
  }
} finally {
  setLoading(false);
}
    },
    [collectionId, getCollectionById],
  );

  useFocusEffect(
    useCallback(() => {
      loadCollection();
    }, [loadCollection]),
  );

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadCollection(false);
    } finally {
      setRefreshing(false);
    }
  }, [loadCollection]);

  const handleAddMemories = useCallback(() => {
    navigation.navigate("CollectionMemorySelector", {
      collectionId,
    });
  }, [navigation, collectionId]);

  const handleEdit = useCallback(() => {
    navigation.navigate("EditCollection", {
      collectionId,
      collection,
    });
  }, [navigation, collectionId, collection]);

const handleDelete = useCallback(() => {
  showAlert({
    type: "danger",
    icon: "trash-outline",
    title: "Delete Collection?",
    message: `Delete "${collection?.name || "this collection"}"? Your memories will remain safe, but they will no longer belong to this collection. This action cannot be undone.`,
    cancelText: "Keep Collection",
    confirmText: "Delete Collection",
    showCancel: true,

    onConfirm: async () => {
      try {
        await deleteCollection(collectionId);
        navigation.goBack();
      } catch (error) {
        console.error("Failed to delete collection:", error);

        showAlert({
          type: "danger",
          icon: "close-circle-outline",
          title: "Delete Failed",
          message:
            error?.message ||
            "Unable to delete this collection. Please try again.",
          confirmText: "OK",
        });
      }
    },
  });
}, [
  showAlert,
  collection,
  collectionId,
  deleteCollection,
  navigation,
]);

const handleMore = useCallback(() => {
  showAlert({
    type: "info",
    icon: "options-outline",
    title: collection?.name || "Collection Options",
    message:
      "Choose whether to edit this collection or delete it.",
    cancelText: "Delete",
    confirmText: "Edit Collection",
    showCancel: true,

    onConfirm: handleEdit,
    onCancel: handleDelete,
  });
}, [
  showAlert,
  collection,
  handleEdit,
  handleDelete,
]);


  const memoriesList = useMemo(() => {
    const source = Array.isArray(collection?.memories)
      ? collection.memories
      : [];

    return source
      .map((item) => {
        if (item && typeof item === "object") {
          return item;
        }

        return (
          allMemories.find((memory) => {
            const id = memory?._id || memory?.id;

            return String(id) === String(item);
          }) || null
        );
      })
      .filter(Boolean);
  }, [collection?.memories, allMemories]);

  const memoryCount =
    collection?.memoryCount ?? memoriesList.length;

  const coverMemory = useMemo(() => {
    const cover = collection?.coverMemoryId;

    if (cover && typeof cover === "object") {
      return cover;
    }

    if (!cover) {
      return null;
    }

    return (
      allMemories.find((memory) => {
        const id = memory?._id || memory?.id;

        return String(id) === String(cover);
      }) || null
    );
  }, [collection?.coverMemoryId, allMemories]);

  const coverImage =
    coverMemory?.images?.[0] ||
    coverMemory?.image ||
    null;

  const coverImageUrl = useMemo(
    () => (coverImage ? getMemoryDetailUrl(coverImage) : null),
    [coverImage],
  );

  const handleMemoryPress = useCallback(
    (memory) => {
      const memoryId = memory?._id || memory?.id;

      if (!memoryId) {
        return;
      }

      navigation.navigate("MemoryDetails", {
        memoryId,
      });
    },
    [navigation],
  );

const handleRemoveMemory = useCallback(
  (memoryId, memoryTitle) => {
    if (!memoryId || removingMemoryId) {
      return;
    }

    showAlert({
      type: "danger",
      icon: "remove-circle-outline",
      title: "Remove Memory?",
      message: `Remove "${memoryTitle || "this memory"}" from this collection? The memory itself will not be deleted.`,
      cancelText: "Keep Memory",
      confirmText: "Remove",
      showCancel: true,

      onConfirm: async () => {
        try {
          setRemovingMemoryId(memoryId);

          await removeMemoryFromCollection(
            collectionId,
            memoryId,
          );

          setCollection((previous) => {
            if (!previous) {
              return previous;
            }

            const currentMemories = Array.isArray(
              previous.memories,
            )
              ? previous.memories
              : [];

            const updatedMemories = currentMemories.filter(
              (memory) => {
                const id =
                  memory?._id || memory?.id || memory;

                return String(id) !== String(memoryId);
              },
            );

            return {
              ...previous,
              memories: updatedMemories,
              memoryCount: updatedMemories.length,
            };
          });
        } catch (error) {
          console.error(
            "Failed to remove memory from collection:",
            error,
          );

          showAlert({
            type: "danger",
            icon: "close-circle-outline",
            title: "Remove Failed",
            message:
              error?.message ||
              "Unable to remove this memory. Please try again.",
            confirmText: "OK",
          });
        } finally {
          setRemovingMemoryId(null);
        }
      },
    });
  },
  [
    showAlert,
    collectionId,
    removeMemoryFromCollection,
    removingMemoryId,
  ],
);

  const renderMemory = useCallback(
    ({ item }) => {
      const memoryId = item?._id || item?.id;

      return (
        <View style={styles.memoryContainer}>
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => handleMemoryPress(item)}
          >
            <MemoryTicket memory={item} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.removeButton,
              removingMemoryId === memoryId &&
                styles.removeButtonDisabled,
            ]}
            onPress={() =>
              handleRemoveMemory(memoryId, item?.title)
            }
            disabled={
              !memoryId ||
              removingMemoryId === memoryId
            }
            activeOpacity={0.8}
          >
            <Text style={styles.removeButtonText}>
              {removingMemoryId === memoryId
                ? "Removing..."
                : "Remove from collection"}
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [
      styles,
      handleMemoryPress,
      handleRemoveMemory,
      removingMemoryId,
    ],
  );

  const keyExtractor = useCallback(
    (item, index) =>
      String(item?._id || item?.id || index),
    [],
  );

  const renderHeader = useCallback(
    () => (
      <View>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.moreButton}
            onPress={handleMore}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Collection options"
          >
            <Text style={styles.moreText}>•••</Text>
          </TouchableOpacity>
        </View>

        {/* COLLECTION TICKET */}

        <View style={styles.collectionTicket}>
          <View style={styles.cover}>
            {coverImageUrl ? (
              <Image
                source={{ uri: coverImageUrl }}
                style={styles.coverImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.coverPlaceholder}>
                <MementoLogo
                  size={42}
                  borderRadius={21}
                />

                <Text style={styles.placeholderLabel}>
                  MEMENTO
                </Text>
              </View>
            )}

            <View style={styles.coverOverlay} />

            <View style={styles.coverTop}>
              <Text style={styles.collectionLabel}>
                COLLECTION
              </Text>

              <View style={styles.coverCount}>
                <Text style={styles.coverCountText}>
                  {memoryCount}
                </Text>
              </View>
            </View>

            <Text style={styles.coverCaption}>
              YOUR MOMENTS, TOGETHER
            </Text>
          </View>

          {/* TICKET PERFORATION */}

          <View style={styles.divider}>
            <View style={styles.notchLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.notchRight} />
          </View>

          {/* COLLECTION DETAILS */}

          <View style={styles.ticketBody}>
            <Text style={styles.ticketEyebrow}>
              MEMENTO COLLECTION
            </Text>

            <Text
              style={styles.collectionName}
              numberOfLines={3}
            >
              {collection?.name || "Untitled Collection"}
            </Text>

            <Text style={styles.memoryCount}>
              {memoryCount === 1
                ? "1 MEMORY"
                : `${memoryCount} MEMORIES`}
            </Text>

            {collection?.description ? (
              <Text style={styles.description}>
                {collection.description}
              </Text>
            ) : (
              <Text style={styles.emptyDescription}>
                A place for moments that belong together.
              </Text>
            )}

            {/* ACTIONS */}

            <View style={styles.ticketActions}>
              <TactileButton
                label="ADD MEMORIES"
                onPress={handleAddMemories}
                icon="add"
                color={colors.primary}
                textColor={colors.white}
                height={44}
                borderRadius={11}
                depth={3}
                style={styles.addActionWrapper}
                contentStyle={styles.addActionContent}
                textStyle={styles.addActionText}
              />

              <TouchableOpacity
                style={styles.editAction}
                onPress={handleEdit}
                activeOpacity={0.85}
              >
                <Text style={styles.editActionText}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

            {/* TICKET FOOTER */}

            <View style={styles.ticketFooter}>
              <Text style={styles.ticketBrand}>
                MEMENTO
              </Text>

              <View style={styles.barcode}>
                {[4, 2, 5, 3, 6, 2, 4, 3].map(
                  (width, index) => (
                    <View
                      key={index}
                      style={[
                        styles.bar,
                        { width },
                      ]}
                    />
                  ),
                )}
              </View>
            </View>
          </View>
        </View>

        {/* MEMORIES SECTION */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionLabel}>
              COLLECTION MEMORIES
            </Text>

            <Text style={styles.sectionTitle}>
              {memoryCount === 0
                ? "Nothing here yet"
                : "The moments inside"}
            </Text>
          </View>

          {memoryCount > 0 ? (
            <View style={styles.sectionCount}>
              <Text style={styles.sectionCountText}>
                {memoryCount}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    ),
    [
      styles,
      colors,
      collection,
      coverImageUrl,
      memoryCount,
      navigation,
      handleMore,
      handleAddMemories,
      handleEdit,
    ],
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyState}>
        <View style={styles.emptyMark}>
          <Text style={styles.emptyMarkText}>+</Text>
        </View>

        <Text style={styles.emptyTitle}>
          Start this collection
        </Text>

        <Text style={styles.emptyText}>
          Choose memories from your library and add them here.
        </Text>

        <TactileButton
          label="ADD MEMORIES"
          onPress={handleAddMemories}
          icon="add"
          color={colors.primary}
          textColor={colors.white}
          height={46}
          borderRadius={11}
          depth={3}
          style={styles.emptyButtonWrapper}
          contentStyle={styles.emptyButtonContent}
        />
      </View>
    ),
    [styles, colors, handleAddMemories],
  );

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={colors.background}
        />

        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Loading collection...
        </Text>
      </View>
    );
  }

  if (!collection) {
    return (
      <View style={styles.errorScreen}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={colors.background}
        />

        <Text style={styles.errorTitle}>
          Collection not found
        </Text>

        <TactileButton
          label="GO BACK"
          onPress={() => navigation.goBack()}
          icon="arrow-back"
          color={colors.primary}
          textColor={colors.white}
          height={44}
          borderRadius={11}
          depth={3}
          style={styles.backButtonWrapper}
          contentStyle={styles.backButtonContent}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <FlatList
        data={memoriesList}
        renderItem={renderMemory}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
}

export default CollectionDetailsScreen;

function createStyles(colors, isDark) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 35,
    },

    topBar: {
      paddingTop: 30,
      paddingBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    backText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.primary,
    },

    moreButton: {
      width: 38,
      height: 34,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },

    moreText: {
      marginTop: -7,
      fontSize: 16,
      fontWeight: "800",
      letterSpacing: 2,
      color: colors.primary,
    },

    collectionTicket: {
      overflow: "hidden",
      borderRadius: 22,
      backgroundColor: colors.surface,
      borderWidth: isDark ? 1 : 0,
      borderColor: colors.border,
    },

    cover: {
      height: 250,
      position: "relative",
      overflow: "hidden",
      backgroundColor: colors.primary,
    },

    coverImage: {
      width: "100%",
      height: "100%",
    },

    coverPlaceholder: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
    },

    placeholderLabel: {
      marginTop: 10,
      fontSize: 9,
      fontWeight: "800",
      letterSpacing: 1.8,
      color: "#D9D8E2",
    },

    coverOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(24, 24, 36, 0.30)",
    },

    coverTop: {
      position: "absolute",
      top: 16,
      left: 16,
      right: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    collectionLabel: {
      fontSize: 9,
      fontWeight: "800",
      letterSpacing: 1.7,
      color: colors.white,
    },

    coverCount: {
      minWidth: 35,
      height: 30,
      paddingHorizontal: 9,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.coverCountSurface,
    },

    coverCountText: {
      fontSize: 12,
      fontWeight: "800",
      color: colors.primary,
    },

    coverCaption: {
      position: "absolute",
      left: 16,
      bottom: 16,
      fontSize: 8,
      fontWeight: "700",
      letterSpacing: 1.4,
      color: colors.white,
    },

    divider: {
      height: 20,
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
    },

    dashedLine: {
      width: "90%",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      borderStyle: "dashed",
    },

    notchLeft: {
      position: "absolute",
      left: -10,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.background,
    },

    notchRight: {
      position: "absolute",
      right: -10,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.background,
    },

    ticketBody: {
      paddingHorizontal: 17,
      paddingBottom: 16,
      backgroundColor: colors.surface,
    },

    ticketEyebrow: {
      fontSize: 8,
      fontWeight: "800",
      letterSpacing: 1.5,
      color: colors.accent,
    },

    collectionName: {
      marginTop: 5,
      fontSize: 26,
      lineHeight: 31,
      fontWeight: "800",
      color: colors.text,
    },

    memoryCount: {
      marginTop: 5,
      fontSize: 9,
      fontWeight: "800",
      letterSpacing: 1.1,
      color: colors.primary,
    },

    description: {
      marginTop: 11,
      fontSize: 13,
      lineHeight: 20,
      color: colors.textSecondary,
    },

    emptyDescription: {
      marginTop: 11,
      fontSize: 13,
      lineHeight: 20,
      color: colors.placeholder,
    },

    ticketActions: {
      marginTop: 17,
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
    },

    addActionWrapper: {
      flex: 1,
      width: "auto",
      marginBottom: 0,
    },

    addActionContent: {
      height: 44,
      borderRadius: 11,
      paddingHorizontal: 8,
    },

    addActionText: {
      fontSize: 11,
      letterSpacing: 0.7,
    },

    editAction: {
      height: 44,
      paddingHorizontal: 17,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.mutedSurface,
      borderWidth: 1,
      borderColor: colors.border,
    },

    editActionText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.primary,
    },

    ticketFooter: {
      marginTop: 15,
      paddingTop: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    ticketBrand: {
      fontSize: 8,
      fontWeight: "800",
      letterSpacing: 1.5,
      color: colors.placeholder,
    },

    barcode: {
      height: 18,
      flexDirection: "row",
      alignItems: "stretch",
      gap: 2,
    },

    bar: {
      height: "100%",
      backgroundColor: colors.primary,
    },

    sectionHeader: {
      marginTop: 28,
      marginBottom: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    sectionLabel: {
      fontSize: 8,
      fontWeight: "800",
      letterSpacing: 1.5,
      color: colors.accent,
    },

    sectionTitle: {
      marginTop: 4,
      fontSize: 20,
      fontWeight: "800",
      color: colors.text,
    },

    sectionCount: {
      minWidth: 34,
      height: 30,
      paddingHorizontal: 9,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.countSurface,
    },

    sectionCountText: {
      fontSize: 12,
      fontWeight: "800",
      color: colors.text,
    },

    memoryContainer: {
      marginBottom: 22,
    },

    removeButton: {
      marginTop: 8,
      height: 38,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },

    removeButtonDisabled: {
      opacity: 0.5,
    },

    removeButtonText: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.accent,
    },

    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 45,
      paddingHorizontal: 25,
    },

    emptyMark: {
      width: 58,
      height: 58,
      borderRadius: 29,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
    },

    emptyMarkText: {
      marginTop: -2,
      fontSize: 30,
      fontWeight: "300",
      color: colors.white,
    },

    emptyTitle: {
      marginTop: 16,
      fontSize: 19,
      fontWeight: "800",
      color: colors.text,
      textAlign: "center",
    },

    emptyText: {
      marginTop: 7,
      fontSize: 13,
      lineHeight: 20,
      color: colors.textSecondary,
      textAlign: "center",
    },

    emptyButtonWrapper: {
      width: 220,
      alignSelf: "center",
      marginTop: 18,
      marginBottom: 0,
    },

    emptyButtonContent: {
      height: 46,
      borderRadius: 11,
    },

    loadingScreen: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },

    loadingText: {
      marginTop: 9,
      fontSize: 13,
      color: colors.textSecondary,
    },

    errorScreen: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 25,
      backgroundColor: colors.background,
    },

    errorTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
    },

    backButtonWrapper: {
      width: 180,
      alignSelf: "center",
      marginTop: 16,
      marginBottom: 0,
    },

    backButtonContent: {
      height: 44,
      borderRadius: 11,
    },
  });
}