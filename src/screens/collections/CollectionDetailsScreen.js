import {
  useCallback,
  useEffect,
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
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCollection } from "../../hooks/useCollection";
import { getMemoryDetailUrl } from "../../utils/cloudinary";
import MemoryTicketHorizontal from "../../components/MemoryTicket/MemoryTicketHorizontal";

function CollectionDetailsScreen({ navigation, route }) {
  const {
    getCollectionById,
    removeMemoryFromCollection,
    deleteCollection,
  } = useCollection();

  const collectionId =
    route?.params?.collectionId ||
    route?.params?.id;

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

        const result =
          await getCollectionById(collectionId);

        setCollection(result);
      } catch (error) {
        console.error(
          "Failed to load collection details:",
          error,
        );

        Alert.alert(
          "Unable to load collection",
          error?.message ||
            "Something went wrong while loading this collection.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [collectionId, getCollectionById],
  );

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    loadCollection();
  }, [loadCollection]);

  // --------------------------------------------------
  // REFRESH
  // --------------------------------------------------

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadCollection(false);
  }, [loadCollection]);

  // --------------------------------------------------
  // ADD MEMORIES
  // --------------------------------------------------

  const handleAddMemories = useCallback(() => {
    if (!collectionId) {
      return;
    }

    navigation.navigate(
      "CollectionMemorySelector",
      {
        collectionId,
      },
    );
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
  }, [
    navigation,
    collection,
    collectionId,
  ]);

  // --------------------------------------------------
  // DELETE COLLECTION
  // --------------------------------------------------

  const handleDelete = useCallback(() => {
    if (!collectionId || deleting) {
      return;
    }

    Alert.alert(
      "Delete Collection",
      `Are you sure you want to delete "${
        collection?.name || "this collection"
      }"? Memories will not be deleted.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);

              await deleteCollection(
                collectionId,
              );

              navigation.goBack();
            } catch (error) {
              console.error(
                "Failed to delete collection:",
                error,
              );

              Alert.alert(
                "Delete failed",
                error?.message ||
                  "Unable to delete this collection.",
              );
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  }, [
    collectionId,
    collection,
    deleting,
    deleteCollection,
    navigation,
  ]);

  // --------------------------------------------------
  // MORE MENU
  // --------------------------------------------------

  const handleMore = useCallback(() => {
    if (!collection) {
      return;
    }

    Alert.alert(
      collection.name || "Collection",
      "Choose an action",
      [
        {
          text: "Edit Collection",
          onPress: handleEdit,
        },
        {
          text: "Delete Collection",
          style: "destructive",
          onPress: handleDelete,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
    );
  }, [
    collection,
    handleEdit,
    handleDelete,
  ]);

  // --------------------------------------------------
  // REMOVE MEMORY
  // --------------------------------------------------

  const handleRemoveMemory = useCallback(
    (memory) => {
      const memoryId =
        memory?._id ||
        memory?.id;

      if (!memoryId || !collectionId) {
        return;
      }

      Alert.alert(
        "Remove Memory",
        "Remove this memory from the collection?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Remove",
            style: "destructive",
            onPress: async () => {
              try {
                await removeMemoryFromCollection(
                  collectionId,
                  memoryId,
                );

                setCollection((prev) => {
                  if (!prev) {
                    return prev;
                  }

                  const currentMemories =
                    Array.isArray(
                      prev.memories,
                    )
                      ? prev.memories
                      : [];

                  const nextMemories =
                    currentMemories.filter(
                      (item) => {
                        const id =
                          item?._id ||
                          item?.id;

                        return (
                          String(id) !==
                          String(memoryId)
                        );
                      },
                    );

                  return {
                    ...prev,
                    memories: nextMemories,
                    memoryCount:
                      nextMemories.length,
                  };
                });
              } catch (error) {
                console.error(
                  "Failed to remove memory:",
                  error,
                );

                Alert.alert(
                  "Unable to remove",
                  error?.message ||
                    "Something went wrong while removing the memory.",
                );
              }
            },
          },
        ],
      );
    },
    [
      collectionId,
      removeMemoryFromCollection,
    ],
  );

  // --------------------------------------------------
  // MEMORY DATA
  // --------------------------------------------------

  const memories = useMemo(() => {
    if (!Array.isArray(collection?.memories)) {
      return [];
    }

    return collection.memories;
  }, [collection]);

  const memoryCount =
    collection?.memoryCount ??
    memories.length;

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
  // MEMORY RENDER
  // --------------------------------------------------

  const renderMemory = useCallback(
    ({ item }) => {
      const memoryId =
        item?._id ||
        item?.id;

      return (
        <View style={styles.memoryItem}>
          <MemoryTicketHorizontal
            memory={item}
            onPress={() => {
              if (!memoryId) {
                return;
              }

              navigation.navigate(
                "MemoryDetails",
                {
                  memoryId,
                },
              );
            }}
          />

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() =>
              handleRemoveMemory(item)
            }
            activeOpacity={0.8}
          >
            <Ionicons
              name="remove-circle-outline"
              size={15}
              color="#E76F51"
            />

            <Text
              style={
                styles.removeButtonText
              }
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
    ],
  );

  const memoryKeyExtractor = useCallback(
    (item, index) =>
      String(
        item?._id ||
          item?.id ||
          `memory-${index}`,
      ),
    [],
  );

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading && !collection) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator
          size="large"
          color="#34345C"
        />

        <Text style={styles.loadingText}>
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
      <View style={styles.errorScreen}>
        <View style={styles.errorMark}>
          <Text style={styles.errorMarkText}>
            M
          </Text>
        </View>

        <Text style={styles.errorTitle}>
          Collection not found
        </Text>

        <Text style={styles.errorText}>
          This collection could not be loaded.
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
          activeOpacity={0.85}
        >
          <Ionicons
            name="arrow-back"
            size={17}
            color="#FFFFFF"
          />

          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={memories}
        renderItem={renderMemory}
        keyExtractor={memoryKeyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          memories.length === 0
            ? styles.emptyMemoryList
            : styles.memoryList
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#34345C"
          />
        }
        ListHeaderComponent={
          <View>
            {/* TOP BAR */}
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.topBarButton}
                onPress={() =>
                  navigation.goBack()
                }
                activeOpacity={0.8}
              >
                <Ionicons
                  name="arrow-back"
                  size={21}
                  color="#34345C"
                />
              </TouchableOpacity>

              <Text
                style={styles.topBarTitle}
              >
                COLLECTION
              </Text>

              <TouchableOpacity
                style={styles.topBarButton}
                onPress={handleMore}
                activeOpacity={0.8}
                disabled={deleting}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={21}
                  color="#34345C"
                />
              </TouchableOpacity>
            </View>

            {/* COLLECTION TICKET */}
            <View
              style={
                styles.collectionTicket
              }
            >
              {/* COVER */}
              <View
                style={styles.ticketCover}
              >
                {coverImageUrl ? (
                  <Image
                    source={{
                      uri: coverImageUrl,
                    }}
                    style={
                      styles.ticketCoverImage
                    }
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={
                      styles.ticketCoverPlaceholder
                    }
                  >
                    <View
                      style={styles.logoCircle}
                    >
                      <Text
                        style={styles.logoText}
                      >
                        M
                      </Text>
                    </View>

                    <Text
                      style={
                        styles.placeholderText
                      }
                    >
                      MEMENTO
                    </Text>
                  </View>
                )}

                <View
                  style={
                    styles.ticketCoverOverlay
                  }
                />

                <View
                  style={styles.ticketTopRow}
                >
                  <Text
                    style={
                      styles.collectionLabel
                    }
                  >
                    MEMENTO COLLECTION
                  </Text>

                  <View
                    style={styles.countBadge}
                  >
                    <Text
                      style={
                        styles.countBadgeText
                      }
                    >
                      {memoryCount}
                    </Text>
                  </View>
                </View>

                <View
                  style={
                    styles.coverBottom
                  }
                >
                  <Text
                    style={
                      styles.coverBottomLabel
                    }
                  >
                    A PLACE FOR YOUR MOMENTS
                  </Text>
                </View>
              </View>

              {/* PERFORATION */}
              <View
                style={styles.perforation}
              >
                <View
                  style={styles.leftNotch}
                />

                <View
                  style={styles.dashedLine}
                />

                <View
                  style={styles.rightNotch}
                />
              </View>

              {/* TICKET CONTENT */}
              <View
                style={
                  styles.ticketContent
                }
              >
                <View
                  style={
                    styles.ticketHeading
                  }
                >
                  <View
                    style={styles.logoCircleSmall}
                  >
                    <Text
                      style={
                        styles.logoTextSmall
                      }
                    >
                      M
                    </Text>
                  </View>

                  <View
                    style={styles.headingText}
                  >
                    <Text
                      style={
                        styles.ticketEyebrow
                      }
                    >
                      COLLECTION
                    </Text>

                    <Text
                      style={
                        styles.collectionName
                      }
                      numberOfLines={2}
                    >
                      {collection.name ||
                        "Untitled Collection"}
                    </Text>
                  </View>
                </View>

                {collection.description ? (
                  <Text
                    style={styles.description}
                    numberOfLines={4}
                  >
                    {collection.description}
                  </Text>
                ) : null}

                <View
                  style={
                    styles.ticketInfoRow
                  }
                >
                  <View>
                    <Text
                      style={styles.infoLabel}
                    >
                      MEMORIES
                    </Text>

                    <Text
                      style={styles.infoValue}
                    >
                      {memoryCount}
                    </Text>
                  </View>

                  <View
                    style={styles.barcode}
                  >
                    {[
                      4,
                      2,
                      5,
                      3,
                      6,
                      2,
                      4,
                      3,
                      5,
                    ].map(
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

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={
                    handleAddMemories
                  }
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="add"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.addButtonText
                    }
                  >
                    Add Memories
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* MEMORY HEADER */}
            <View
              style={styles.sectionHeader}
            >
              <View>
                <Text
                  style={
                    styles.sectionEyebrow
                  }
                >
                  YOUR STORIES
                </Text>

                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Memories
                </Text>
              </View>

              <View
                style={styles.sectionCount}
              >
                <Text
                  style={
                    styles.sectionCountText
                  }
                >
                  {memoryCount}
                </Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyMemories}>
            <Ionicons
              name="images-outline"
              size={38}
              color="#34345C"
            />

            <Text
              style={styles.emptyTitle}
            >
              No memories yet
            </Text>

            <Text
              style={styles.emptyText}
            >
              Add memories to start building
              this collection.
            </Text>

            <TouchableOpacity
              style={
                styles.emptyAddButton
              }
              onPress={
                handleAddMemories
              }
              activeOpacity={0.85}
            >
              <Text
                style={
                  styles.emptyAddButtonText
                }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F0F6",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#707070",
  },

  errorScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "#F1F0F6",
  },

  errorMark: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  errorMarkText: {
    fontSize: 21,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  errorTitle: {
    marginTop: 18,
    fontSize: 21,
    fontWeight: "800",
    color: "#242424",
  },

  errorText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: "#707070",
    textAlign: "center",
  },

  backButton: {
    marginTop: 20,
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  backButtonText: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  topBar: {
    paddingHorizontal: 18,
    paddingTop: 42,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  topBarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  topBarTitle: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.7,
    color: "#34345C",
  },

  collectionTicket: {
    marginHorizontal: 16,
    overflow: "hidden",
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
  },

  ticketCover: {
    height: 220,
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

  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E76F51",
  },

  logoText: {
    fontSize: 25,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  logoCircleSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  logoTextSmall: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  placeholderText: {
    marginTop: 10,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.8,
    color: "#D9D8E2",
  },

  ticketCoverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      "rgba(28, 28, 42, 0.34)",
  },

  ticketTopRow: {
    position: "absolute",
    top: 15,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  collectionLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.6,
    color: "#FFFFFF",
  },

  countBadge: {
    minWidth: 38,
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      "rgba(255,255,255,0.94)",
  },

  countBadgeText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#34345C",
  },

  coverBottom: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 15,
  },

  coverBottomLabel: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.35,
    color:
      "rgba(255,255,255,0.82)",
  },

  perforation: {
    height: 20,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  dashedLine: {
    width: "88%",
    borderTopWidth: 1,
    borderTopColor: "#CFCED8",
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

  ticketContent: {
    paddingHorizontal: 17,
    paddingTop: 15,
    paddingBottom: 17,
  },

  ticketHeading: {
    flexDirection: "row",
    alignItems: "center",
  },

  headingText: {
    flex: 1,
    marginLeft: 11,
  },

  ticketEyebrow: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#9A99A2",
  },

  collectionName: {
    marginTop: 3,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "800",
    color: "#242424",
  },

  description: {
    marginTop: 13,
    fontSize: 13,
    lineHeight: 20,
    color: "#707070",
  },

  ticketInfoRow: {
    marginTop: 17,
    paddingTop: 11,
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
    color: "#9A99A2",
  },

  infoValue: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "800",
    color: "#34345C",
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
    marginTop: 16,
    minHeight: 46,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  addButtonText: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  sectionHeader: {
    marginTop: 26,
    paddingHorizontal: 20,
    paddingBottom: 13,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  sectionEyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#34345C",
  },

  sectionTitle: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: "800",
    color: "#242424",
  },

  sectionCount: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: 9,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  sectionCountText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#34345C",
  },

  memoryList: {
    paddingHorizontal: 14,
    paddingBottom: 35,
  },

  emptyMemoryList: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  memoryItem: {
    marginBottom: 16,
  },

  removeButton: {
    alignSelf: "flex-end",
    marginTop: 7,
    marginRight: 3,
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },

  removeButtonText: {
    marginLeft: 5,
    fontSize: 11,
    fontWeight: "700",
    color: "#E76F51",
  },

  emptyMemories: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingTop: 35,
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "800",
    color: "#242424",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 19,
    color: "#707070",
    textAlign: "center",
  },

  emptyAddButton: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 11,
    backgroundColor: "#34345C",
  },

  emptyAddButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});

