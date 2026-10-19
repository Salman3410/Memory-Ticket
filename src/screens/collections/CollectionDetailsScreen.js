import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useCollection } from "../../hooks/useCollection";
import useRefresh from "../../hooks/useRefresh";
import { getMemoryDetailUrl } from "../../utils/cloudinary";
import MemoryTicketHorizontal from "../../components/MemoryTicket/MemoryTicketHorizontal";
import { useAppAlert } from "../../context/AlertContext";
import { useTheme } from "../../context/ThemeContext";

function CollectionDetailsScreen({ navigation, route }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};

  // Theme colors
  const screenBackground =
    colors.background || (isDark ? "#171624" : "#F1F0F6");

  const surfaceColor =
    colors.surface || (isDark ? "#211F30" : "#FFFFFF");

  const textColor =
    colors.text || (isDark ? "#F7F5FC" : "#242424");

  const secondaryTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#C4C0D0" : "#707080");

  const mutedTextColor =
    colors.textMuted || (isDark ? "#89849C" : "#9A99A5");

  const borderColor =
    colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const primaryColor =
    colors.primary || (isDark ? "#C8C2FF" : "#34345C");

  const primaryTextColor =
    colors.primaryText ||
    (isDark && primaryColor.toLowerCase() !== "#34345c"
      ? "#25223D"
      : "#FFFFFF");

  const inputBackground =
    colors.input || (isDark ? "#292638" : "#F8F8FA");

  const accentColor = colors.accent || "#E76F51";

  const { getCollectionById, removeMemoryFromCollection, deleteCollection } =
    useCollection();

  const { showAlert } = useAppAlert();

  const collectionId =
    route?.params?.collectionId || route?.params?.id;

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // --------------------------------------------------
  // LOAD COLLECTION
  // --------------------------------------------------

  const loadCollection = useCallback(
    async (showLoader = true) => {
      if (!collectionId) {
        setLoading(false);
        return;
      }

      try {
        if (showLoader) {
          setLoading(true);
        }

        const result = await getCollectionById(collectionId);
        setCollection(result);
      } catch (error) {
        console.error("Failed to load collection details:", error);

        showAlert({
          type: "danger",
          icon: "close-circle-outline",
          title: "Unable to Load Collection",
          message:
            error?.message ||
            "Something went wrong while loading this collection.",
          confirmText: "OK",
        });
      } finally {
        setLoading(false);
      }
    },
    [collectionId, getCollectionById, showAlert],
  );

  useEffect(() => {
    loadCollection();
  }, [loadCollection]);

  // --------------------------------------------------
  // REFRESH
  // --------------------------------------------------

  const refreshCollectionDetails = useCallback(async () => {
    await loadCollection(false);
  }, [loadCollection]);

  const { refreshing, onRefresh } = useRefresh(
    refreshCollectionDetails,
  );

  // --------------------------------------------------
  // ADD MEMORIES
  // --------------------------------------------------

  const handleAddMemories = useCallback(() => {
    if (!collectionId) {
      return;
    }

    navigation.navigate("CollectionMemorySelector", {
      collectionId,
    });
  }, [navigation, collectionId]);

  // --------------------------------------------------
  // EDIT COLLECTION
  // --------------------------------------------------

  const handleEdit = useCallback(() => {
    if (!collection || !collectionId) {
      return;
    }

    navigation.navigate("EditCollection", {
      collection,
      collectionId,
    });
  }, [navigation, collection, collectionId]);

  // --------------------------------------------------
  // DELETE COLLECTION
  // --------------------------------------------------

  const handleDelete = useCallback(() => {
    if (!collectionId || deleting) {
      return;
    }

    showAlert({
      type: "danger",
      icon: "trash-outline",
      title: "Delete Collection",
      message: `Are you sure you want to delete "${
        collection?.name || "this collection"
      }"? Memories will not be deleted.`,
      cancelText: "Cancel",
      confirmText: "Delete",
      showCancel: true,
      onConfirm: async () => {
        try {
          setDeleting(true);

          await deleteCollection(collectionId);
          navigation.goBack();
        } catch (error) {
          console.error("Failed to delete collection:", error);

          showAlert({
            type: "danger",
            icon: "close-circle-outline",
            title: "Delete Failed",
            message:
              error?.message || "Unable to delete this collection.",
            confirmText: "OK",
          });
        } finally {
          setDeleting(false);
        }
      },
    });
  }, [
    collectionId,
    collection,
    deleting,
    deleteCollection,
    navigation,
    showAlert,
  ]);

  // --------------------------------------------------
  // MORE MENU
  // --------------------------------------------------

  const handleMore = useCallback(() => {
    if (!collection || deleting) {
      return;
    }

    showAlert({
      type: "info",
      icon: "ellipsis-horizontal-circle-outline",
      title: collection.name || "Collection",
      message: "Choose an action for this collection.",
      cancelText: "Delete Collection",
      confirmText: "Edit Collection",
      showCancel: true,
      onConfirm: handleEdit,
      onCancel: handleDelete,
    });
  }, [collection, deleting, handleEdit, handleDelete, showAlert]);

  // --------------------------------------------------
  // REMOVE MEMORY
  // --------------------------------------------------

  const handleRemoveMemory = useCallback(
    (memory) => {
      const memoryId = memory?._id || memory?.id;

      if (!memoryId || !collectionId) {
        return;
      }

      showAlert({
        type: "warning",
        icon: "remove-circle-outline",
        title: "Remove Memory",
        message: "Remove this memory from the collection?",
        cancelText: "Cancel",
        confirmText: "Remove",
        showCancel: true,
        onConfirm: async () => {
          try {
            await removeMemoryFromCollection(collectionId, memoryId);

            setCollection((prev) => {
              if (!prev) {
                return prev;
              }

              const currentMemories = Array.isArray(prev.memories)
                ? prev.memories
                : [];

              const nextMemories = currentMemories.filter((item) => {
                const id = item?._id || item?.id;
                return String(id) !== String(memoryId);
              });

              return {
                ...prev,
                memories: nextMemories,
                memoryCount: nextMemories.length,
              };
            });
          } catch (error) {
            console.error("Failed to remove memory:", error);

            showAlert({
              type: "danger",
              icon: "close-circle-outline",
              title: "Unable to Remove",
              message:
                error?.message ||
                "Something went wrong while removing the memory.",
              confirmText: "OK",
            });
          }
        },
      });
    },
    [collectionId, removeMemoryFromCollection, showAlert],
  );

  // --------------------------------------------------
  // MEMORY DATA
  // --------------------------------------------------

  const memories = useMemo(() => {
    return Array.isArray(collection?.memories)
      ? collection.memories
      : [];
  }, [collection?.memories]);

  const memoryCount = collection?.memoryCount ?? memories.length;

  // --------------------------------------------------
  // COVER IMAGE
  // --------------------------------------------------

  const coverImage =
    collection?.coverMemoryId?.images?.[0] ||
    collection?.coverMemoryId?.image ||
    null;

  const coverImageUrl = useMemo(() => {
    if (!coverImage) {
      return null;
    }

    return getMemoryDetailUrl(coverImage);
  }, [coverImage]);

  // --------------------------------------------------
  // RENDER MEMORY
  // --------------------------------------------------

  const renderMemory = useCallback(
    ({ item }) => {
      const memoryId = item?._id || item?.id;

      return (
        <View
          style={[
            styles.memoryItem,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          <MemoryTicketHorizontal
            memory={item}
            onPress={() => {
              if (!memoryId) {
                return;
              }

              navigation.navigate("MemoryDetails", {
                memoryId,
              });
            }}
          />

          <TouchableOpacity
            style={[
              styles.removeButton,
              {
                backgroundColor: surfaceColor,
                borderColor,
              },
            ]}
            onPress={() => handleRemoveMemory(item)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="remove-circle-outline"
              size={16}
              color={accentColor}
            />

            <Text
              style={[
                styles.removeButtonText,
                { color: accentColor },
              ]}
            >
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [
      navigation,
      handleRemoveMemory,
      surfaceColor,
      borderColor,
      accentColor,
    ],
  );

  const memoryKeyExtractor = useCallback(
    (item, index) =>
      String(item?._id || item?.id || `memory-${index}`),
    [],
  );

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading && !collection) {
    return (
      <View
        style={[
          styles.loadingScreen,
          { backgroundColor: screenBackground },
        ]}
      >
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={screenBackground}
        />

        <ActivityIndicator size="large" color={primaryColor} />

        <Text
          style={[
            styles.loadingText,
            { color: secondaryTextColor },
          ]}
        >
          Loading collection...
        </Text>
      </View>
    );
  }

  // --------------------------------------------------
  // INVALID COLLECTION
  // --------------------------------------------------

  if (!collection) {
    return (
      <View
        style={[
          styles.errorScreen,
          { backgroundColor: screenBackground },
        ]}
      >
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={screenBackground}
        />

        <View
          style={[
            styles.errorMark,
            { backgroundColor: primaryColor },
          ]}
        >
          <Text
            style={[
              styles.errorMarkText,
              { color: primaryTextColor },
            ]}
          >
            M
          </Text>
        </View>

        <Text
          style={[
            styles.errorTitle,
            { color: textColor },
          ]}
        >
          Collection not found
        </Text>

        <Text
          style={[
            styles.errorText,
            { color: secondaryTextColor },
          ]}
        >
          This collection could not be loaded.
        </Text>

        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: primaryColor },
          ]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Ionicons
            name="arrow-back"
            size={17}
            color={primaryTextColor}
          />

          <Text
            style={[
              styles.backButtonText,
              { color: primaryTextColor },
            ]}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --------------------------------------------------
  // MAIN SCREEN
  // --------------------------------------------------

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: screenBackground },
      ]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={screenBackground}
      />

      <FlatList
        data={memories}
        renderItem={renderMemory}
        keyExtractor={memoryKeyExtractor}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: screenBackground }}
        contentContainerStyle={[
          memories.length === 0
            ? styles.emptyMemoryList
            : styles.memoryList,
          { backgroundColor: screenBackground },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={primaryColor}
            colors={[primaryColor]}
            progressBackgroundColor={surfaceColor}
          />
        }
        // ------------------------------------------------
        // HEADER
        // ------------------------------------------------
        ListHeaderComponent={
          <View>
            {/* TOP BAR */}
            <View style={styles.topBar}>
              <TouchableOpacity
                style={[
                  styles.topBarButton,
                  {
                    backgroundColor: surfaceColor,
                    borderColor,
                  },
                ]}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="arrow-back"
                  size={21}
                  color={textColor}
                />
              </TouchableOpacity>

              <Text
                style={[
                  styles.topBarTitle,
                  { color: secondaryTextColor },
                ]}
              >
                COLLECTION
              </Text>

              <TouchableOpacity
                style={[
                  styles.topBarButton,
                  {
                    backgroundColor: surfaceColor,
                    borderColor,
                  },
                ]}
                onPress={handleMore}
                activeOpacity={0.8}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator
                    size="small"
                    color={textColor}
                  />
                ) : (
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={21}
                    color={textColor}
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* COLLECTION TICKET */}
            <View
              style={[
                styles.collectionTicket,
                {
                  backgroundColor: surfaceColor,
                  borderColor,
                },
              ]}
            >
              {/* COVER */}
              <View style={styles.ticketCover}>
                {coverImageUrl ? (
                  <Image
                    source={{ uri: coverImageUrl }}
                    style={styles.ticketCoverImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.ticketCoverPlaceholder,
                      { backgroundColor: primaryColor },
                    ]}
                  >
                    <View
                      style={[
                        styles.logoCircle,
                        { backgroundColor: accentColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.logoText,
                          { color: "#FFFFFF" },
                        ]}
                      >
                        M
                      </Text>
                    </View>

                    <Text style={styles.placeholderText}>
                      MEMENTO
                    </Text>
                  </View>
                )}

                <View style={styles.ticketCoverOverlay} />

                <View style={styles.ticketTopRow}>
                  <Text style={styles.collectionLabel}>
                    MEMENTO COLLECTION
                  </Text>

                  <View
                    style={[
                      styles.countBadge,
                      {
                        backgroundColor: surfaceColor,
                        borderColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.countBadgeText,
                        { color: textColor },
                      ]}
                    >
                      {memoryCount}
                    </Text>
                  </View>
                </View>

                <View style={styles.coverBottom}>
                  <Text style={styles.coverBottomLabel}>
                    A PLACE FOR YOUR MOMENTS
                  </Text>
                </View>
              </View>

              {/* PERFORATION */}
              <View
                style={[
                  styles.perforation,
                  { backgroundColor: surfaceColor },
                ]}
              >
                <View
                  style={[
                    styles.leftNotch,
                    { backgroundColor: screenBackground },
                  ]}
                />

                <View
                  style={[
                    styles.dashedLine,
                    { borderTopColor: borderColor },
                  ]}
                />

                <View
                  style={[
                    styles.rightNotch,
                    { backgroundColor: screenBackground },
                  ]}
                />
              </View>

              {/* TICKET CONTENT */}
              <View
                style={[
                  styles.ticketContent,
                  { backgroundColor: surfaceColor },
                ]}
              >
                <View style={styles.ticketHeading}>
                  <View
                    style={[
                      styles.logoCircleSmall,
                      { backgroundColor: primaryColor },
                    ]}
                  >
                    <Text
                      style={[
                        styles.logoTextSmall,
                        { color: primaryTextColor },
                      ]}
                    >
                      M
                    </Text>
                  </View>

                  <View style={styles.headingText}>
                    <Text
                      style={[
                        styles.ticketEyebrow,
                        { color: secondaryTextColor },
                      ]}
                    >
                      COLLECTION
                    </Text>

                    <Text
                      style={[
                        styles.collectionName,
                        { color: textColor },
                      ]}
                      numberOfLines={2}
                    >
                      {collection.name || "Untitled Collection"}
                    </Text>
                  </View>
                </View>

                {collection.description ? (
                  <Text
                    style={[
                      styles.description,
                      { color: secondaryTextColor },
                    ]}
                    numberOfLines={4}
                  >
                    {collection.description}
                  </Text>
                ) : null}

                <View
                  style={[
                    styles.ticketInfoRow,
                    { borderTopColor: borderColor },
                  ]}
                >
                  <View>
                    <Text
                      style={[
                        styles.infoLabel,
                        { color: secondaryTextColor },
                      ]}
                    >
                      MEMORIES
                    </Text>

                    <Text
                      style={[
                        styles.infoValue,
                        { color: textColor },
                      ]}
                    >
                      {memoryCount}
                    </Text>
                  </View>

                  <View style={styles.barcode}>
                    {[4, 2, 5, 3, 6, 2, 4, 3, 5].map(
                      (width, index) => (
                        <View
                          key={index}
                          style={[
                            styles.bar,
                            {
                              width,
                              backgroundColor: primaryColor,
                            },
                          ]}
                        />
                      ),
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.addButton,
                    { backgroundColor: primaryColor },
                  ]}
                  onPress={handleAddMemories}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="add"
                    size={18}
                    color={primaryTextColor}
                  />

                  <Text
                    style={[
                      styles.addButtonText,
                      { color: primaryTextColor },
                    ]}
                  >
                    Add Memories
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* MEMORIES SECTION HEADER */}
            <View style={styles.sectionHeader}>
              <View>
                <Text
                  style={[
                    styles.sectionEyebrow,
                    { color: secondaryTextColor },
                  ]}
                >
                  YOUR STORIES
                </Text>

                <Text
                  style={[
                    styles.sectionTitle,
                    { color: textColor },
                  ]}
                >
                  Memories
                </Text>
              </View>

              <View
                style={[
                  styles.sectionCount,
                  {
                    backgroundColor: surfaceColor,
                    borderColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.sectionCountText,
                    { color: textColor },
                  ]}
                >
                  {memoryCount}
                </Text>
              </View>
            </View>
          </View>
        }
        // ------------------------------------------------
        // EMPTY STATE
        // ------------------------------------------------
        ListEmptyComponent={
          <View
            style={[
              styles.emptyMemories,
              { backgroundColor: screenBackground },
            ]}
          >
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor: surfaceColor,
                  borderColor,
                },
              ]}
            >
              <Ionicons
                name="images-outline"
                size={34}
                color={primaryColor}
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                { color: textColor },
              ]}
            >
              No memories yet
            </Text>

            <Text
              style={[
                styles.emptyText,
                { color: secondaryTextColor },
              ]}
            >
              Add memories to start building this collection.
            </Text>

            <TouchableOpacity
              style={[
                styles.emptyAddButton,
                { backgroundColor: primaryColor },
              ]}
              onPress={handleAddMemories}
              activeOpacity={0.85}
            >
              <Ionicons
                name="add"
                size={17}
                color={primaryTextColor}
              />

              <Text
                style={[
                  styles.emptyAddButtonText,
                  { color: primaryTextColor },
                ]}
              >
                Add Memories
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

export default CollectionDetailsScreen;

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  // Loading
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F0F6",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: "#707070",
  },

  // Error
  errorScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "#F1F0F6",
  },

  errorMark: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  errorMarkText: {
    fontSize: 23,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  errorTitle: {
    marginTop: 18,
    fontSize: 21,
    fontWeight: "800",
    textAlign: "center",
    color: "#242424",
  },

  errorText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    color: "#707070",
  },

  backButton: {
    marginTop: 22,
    minHeight: 45,
    paddingHorizontal: 18,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
    gap: 8,
  },

  backButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Top bar
  topBar: {
    paddingHorizontal: 18,
    paddingTop: 35,
    paddingBottom: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  topBarButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  topBarTitle: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.8,
    color: "#707080",
  },

  // Main collection ticket
  collectionTicket: {
    marginHorizontal: 16,
    overflow: "hidden",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    backgroundColor: "#FFFFFF",
  },

  // Cover
  ticketCover: {
    height: 210,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#34345C",
  },

  ticketCoverImage: {
    width: "100%",
    height: "100%",
  },

  ticketCoverPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  ticketCoverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20, 20, 32, 0.34)",
  },

  logoCircle: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E76F51",
  },

  logoText: {
    fontSize: 25,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  placeholderText: {
    marginTop: 11,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#FFFFFF",
  },

  ticketTopRow: {
    position: "absolute",
    top: 15,
    left: 15,
    right: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  collectionLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: "#FFFFFF",
  },

  countBadge: {
    minWidth: 38,
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  countBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#242424",
  },

  coverBottom: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 15,
  },

  coverBottomLabel: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.35,
    color: "#FFFFFF",
  },

  // Perforated ticket edge
  perforation: {
    height: 19,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  dashedLine: {
    width: "88%",
    borderTopWidth: 1,
    borderTopColor: "#D9D8E2",
    borderStyle: "dashed",
  },

  leftNotch: {
    position: "absolute",
    left: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F1F0F6",
  },

  rightNotch: {
    position: "absolute",
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F1F0F6",
  },

  // Ticket content
  ticketContent: {
    paddingHorizontal: 17,
    paddingTop: 16,
    paddingBottom: 18,
    backgroundColor: "#FFFFFF",
  },

  ticketHeading: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoCircleSmall: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  logoTextSmall: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  headingText: {
    flex: 1,
    minWidth: 0,
    marginLeft: 11,
  },

  ticketEyebrow: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#898895",
  },

  collectionName: {
    marginTop: 4,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: "800",
    color: "#242424",
  },

  description: {
    marginTop: 13,
    fontSize: 13,
    lineHeight: 20,
    color: "#707080",
  },

  ticketInfoRow: {
    marginTop: 17,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#ECEBF0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  infoLabel: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.3,
    color: "#898895",
  },

  infoValue: {
    marginTop: 3,
    fontSize: 16,
    fontWeight: "800",
    color: "#242424",
  },

  barcode: {
    height: 25,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 2,
  },

  bar: {
    height: "100%",
    backgroundColor: "#34345C",
  },

  addButton: {
    marginTop: 17,
    minHeight: 48,
    borderRadius: 13,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#34345C",
  },

  addButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  // Memories section
  sectionHeader: {
    marginTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  sectionEyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#707080",
  },

  sectionTitle: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: "800",
    color: "#242424",
  },

  sectionCount: {
    minWidth: 34,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  sectionCountText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#242424",
  },

  // Memory list
  memoryList: {
    paddingHorizontal: 14,
    paddingBottom: 35,
  },

  emptyMemoryList: {
    paddingHorizontal: 14,
    paddingBottom: 35,
  },

  memoryItem: {
    marginBottom: 15,
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    backgroundColor: "#FFFFFF",
  },

  removeButton: {
    alignSelf: "flex-end",
    minHeight: 32,
    marginTop: 8,
    marginRight: 2,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#FFFFFF",
  },

  removeButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#E76F51",
  },

  // Empty memories state
  emptyMemories: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingTop: 32,
    paddingBottom: 26,
    backgroundColor: "#F1F0F6",
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "800",
    color: "#242424",
    textAlign: "center",
  },

  emptyText: {
    maxWidth: 280,
    marginTop: 7,
    fontSize: 13,
    lineHeight: 20,
    color: "#707080",
    textAlign: "center",
  },

  emptyAddButton: {
    minHeight: 44,
    marginTop: 18,
    paddingHorizontal: 18,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "#34345C",
  },

  emptyAddButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});