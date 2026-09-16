import React, { useCallback, useEffect, useState } from "react";

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

import { useCollection } from "../../hooks/useCollection";

import MemoryTicket from "../../components/MemoryTicket/MemoryTicket";

function CollectionDetailsScreen({ route, navigation }) {
  const { collectionId } = route.params || {};

  const { getCollectionById, removeMemoryFromCollection, deleteCollection } =
    useCollection();

  const [collection, setCollection] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [removingMemoryId, setRemovingMemoryId] = useState(null);

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

        const data = await getCollectionById(collectionId);

        setCollection(data);
      } catch (error) {
        console.error("Failed to load collection details:", error);
      } finally {
        setLoading(false);
      }
    },
    [collectionId, getCollectionById],
  );

  useEffect(() => {
    loadCollection();
  }, [loadCollection]);

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
    Alert.alert(
      "Delete Collection",
      `Delete "${collection?.name || "this collection"}"? Your memories will stay safe, but they will no longer belong to this collection.`,
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
              await deleteCollection(collectionId);

              navigation.goBack();
            } catch (error) {
              console.error("Failed to delete collection:", error);
            }
          },
        },
      ],
    );
  }, [collection, collectionId, deleteCollection, navigation]);

  const handleRemoveMemory = useCallback(
    (memoryId, memoryTitle) => {
      if (!memoryId || removingMemoryId) {
        return;
      }

      Alert.alert(
        "Remove Memory",
        `Remove "${memoryTitle || "this memory"}" from the collection? The memory itself will not be deleted.`,
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
                setRemovingMemoryId(memoryId);

                await removeMemoryFromCollection(collectionId, memoryId);

                setCollection((prev) => {
                  if (!prev) {
                    return prev;
                  }

                  const currentMemories = Array.isArray(prev.memories)
                    ? prev.memories
                    : [];

                  const updatedMemories = currentMemories.filter(
                    (memory) =>
                      String(memory?._id || memory?.id) !== String(memoryId),
                  );

                  return {
                    ...prev,
                    memories: updatedMemories,
                    memoryCount: updatedMemories.length,
                  };
                });
              } catch (error) {
                console.error(
                  "Failed to remove memory from collection:",
                  error,
                );
              } finally {
                setRemovingMemoryId(null);
              }
            },
          },
        ],
      );
    },
    [collectionId, removeMemoryFromCollection, removingMemoryId],
  );

  const renderMemory = useCallback(
    ({ item }) => {
      const memoryId = item?._id || item?.id;

      return (
        <View style={styles.memoryContainer}>
          <MemoryTicket memory={item} />

          <TouchableOpacity
            style={[
              styles.removeButton,
              removingMemoryId === memoryId && styles.removeButtonDisabled,
            ]}
            onPress={() => handleRemoveMemory(memoryId, item?.title)}
            disabled={!memoryId || removingMemoryId === memoryId}
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
    [handleRemoveMemory, removingMemoryId],
  );

  const keyExtractor = useCallback(
    (item, index) => String(item?._id || item?.id || index),
    [],
  );

  const renderHeader = useCallback(() => {
    const coverImage =
      collection?.coverMemoryId?.images?.[0] ||
      collection?.coverMemoryId?.image ||
      null;

    const memoryCount = collection?.memoryCount || 0;

    return (
      <View>
        <View style={styles.hero}>
          {coverImage ? (
            <Image
              source={{
                uri: coverImage,
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Text style={styles.heroPlaceholderMark}>M</Text>
            </View>
          )}

          <View style={styles.heroOverlay} />

          <View style={styles.heroBottom}>
            <Text style={styles.heroTitle} numberOfLines={2}>
              {collection?.name || "Collection"}
            </Text>

            <Text style={styles.heroCount}>
              {memoryCount} {memoryCount === 1 ? "memory" : "memories"}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          {collection?.description ? (
            <Text style={styles.description}>{collection.description}</Text>
          ) : (
            <Text style={styles.noDescription}>
              A place for the memories that belong together.
            </Text>
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.primaryAction}
              onPress={handleAddMemories}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryActionText}>+ Add Memories</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={handleEdit}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryActionText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteAction}
              onPress={handleDelete}
              activeOpacity={0.85}
            >
              <Text style={styles.deleteActionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Memories</Text>

            <Text style={styles.sectionSubtitle}>
              {memoryCount === 0
                ? "Nothing here yet"
                : "Moments inside this collection"}
            </Text>
          </View>

          {memoryCount > 0 ? (
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{memoryCount}</Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  }, [collection, handleAddMemories, handleEdit, handleDelete]);

  const renderEmpty = useCallback(() => {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>+</Text>
        </View>

        <Text style={styles.emptyTitle}>Start this collection</Text>

        <Text style={styles.emptyText}>
          Choose memories from your library and add them here.
        </Text>

        <TouchableOpacity
          style={styles.emptyButton}
          onPress={handleAddMemories}
          activeOpacity={0.85}
        >
          <Text style={styles.emptyButtonText}>Add Memories</Text>
        </TouchableOpacity>
      </View>
    );
  }, [handleAddMemories]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34345C" />

        <Text style={styles.loadingText}>Loading collection...</Text>
      </View>
    );
  }

  if (!collection) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorTitle}>Collection not found</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const memories = Array.isArray(collection.memories)
    ? collection.memories
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={memories}
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
            tintColor="#34345C"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  topBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },

  backText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#34345C",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  hero: {
    height: 230,
    overflow: "hidden",
    borderRadius: 24,
    position: "relative",
    backgroundColor: "#34345C",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  heroPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  heroPlaceholderMark: {
    fontSize: 52,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(36, 36, 36, 0.28)",
  },

  heroBottom: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 18,
  },

  heroTitle: {
    fontSize: 28,
    lineHeight: 33,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  heroCount: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  infoCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#555555",
  },

  noDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: "#888888",
  },

  actionRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  primaryAction: {
    flex: 1,
    minHeight: 44,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  secondaryAction: {
    minHeight: 44,
    paddingHorizontal: 15,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F5F9",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  secondaryActionText: {
    color: "#34345C",
    fontSize: 13,
    fontWeight: "600",
  },

  deleteAction: {
    minHeight: 44,
    paddingHorizontal: 13,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF7F4",
    borderWidth: 1,
    borderColor: "#F0D5CC",
  },

  deleteActionText: {
    color: "#E76F51",
    fontSize: 13,
    fontWeight: "600",
  },

  sectionHeader: {
    marginTop: 26,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#242424",
  },

  sectionSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#888888",
  },

  countPill: {
    minWidth: 34,
    height: 30,
    paddingHorizontal: 9,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9E8F1",
  },

  countPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#34345C",
  },

  memoryContainer: {
    marginBottom: 22,
  },

  removeButton: {
    marginTop: 8,
    minHeight: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  removeButtonDisabled: {
    opacity: 0.5,
  },

  removeButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E76F51",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 45,
    paddingHorizontal: 25,
  },

  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  emptyIconText: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "300",
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 19,
    fontWeight: "700",
    color: "#242424",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 20,
    color: "#777777",
    textAlign: "center",
  },

  emptyButton: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 11,
    backgroundColor: "#34345C",
  },

  emptyButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F0F6",
  },

  loadingText: {
    marginTop: 9,
    fontSize: 13,
    color: "#777777",
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#242424",
  },

  backButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#34345C",
  },

  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
