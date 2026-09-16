import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useMemory } from "../../hooks/useMemory";
import { useCollection } from "../../hooks/useCollection";

function CollectionMemorySelector({
  route,
  navigation,
}) {
  const { collectionId } =
    route.params || {};

  const { memories } = useMemory();

  const {
    getCollectionById,
    addMemoryToCollection,
  } = useCollection();

  const [collection, setCollection] =
    useState(null);

  const [selectedIds, setSelectedIds] =
    useState([]);

  const [loadingCollection, setLoadingCollection] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // --------------------------------------------------
  // LOAD COLLECTION DETAILS
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadCollection = async () => {
      if (!collectionId) {
        setLoadingCollection(false);
        return;
      }

      try {
        setLoadingCollection(true);

        const result =
          await getCollectionById(
            collectionId
          );

        if (mounted) {
          setCollection(result);
        }
      } catch (error) {
        console.error(
          "Failed to load collection:",
          error
        );
      } finally {
        if (mounted) {
          setLoadingCollection(false);
        }
      }
    };

    loadCollection();

    return () => {
      mounted = false;
    };
  }, [
    collectionId,
    getCollectionById,
  ]);

  // --------------------------------------------------
  // EXISTING MEMORY IDS
  // --------------------------------------------------

  const existingMemoryIds = useMemo(() => {
    const existingMemories =
      Array.isArray(
        collection?.memories
      )
        ? collection.memories
        : [];

    return new Set(
      existingMemories.map(
        (memory) =>
          String(
            memory?._id ||
              memory?.id ||
              memory
          )
      )
    );
  }, [collection]);

  // --------------------------------------------------
  // AVAILABLE MEMORIES
  // --------------------------------------------------

  const selectableMemories = useMemo(() => {
    if (!Array.isArray(memories)) {
      return [];
    }

    return memories.filter((memory) => {
      const memoryId =
        memory?._id ||
        memory?.id;

      return Boolean(memoryId);
    });
  }, [memories]);

  // --------------------------------------------------
  // TOGGLE MEMORY
  // --------------------------------------------------

  const toggleMemory = useCallback(
    (memoryId) => {
      if (!memoryId) {
        return;
      }

      if (
        existingMemoryIds.has(
          String(memoryId)
        )
      ) {
        return;
      }

      const id = String(memoryId);

      setSelectedIds((prev) => {
        if (prev.includes(id)) {
          return prev.filter(
            (item) => item !== id
          );
        }

        return [...prev, id];
      });
    },
    [existingMemoryIds]
  );

  // --------------------------------------------------
  // ADD SELECTED MEMORIES
  // --------------------------------------------------

  const handleAdd = useCallback(
    async () => {
      if (
        !collectionId ||
        selectedIds.length === 0 ||
        saving
      ) {
        return;
      }

      try {
        setSaving(true);

        await addMemoryToCollection(
          collectionId,
          selectedIds
        );

        navigation.goBack();
      } catch (error) {
        console.error(
          "Failed to add memories to collection:",
          error
        );
      } finally {
        setSaving(false);
      }
    },
    [
      collectionId,
      selectedIds,
      saving,
      addMemoryToCollection,
      navigation,
    ]
  );

  // --------------------------------------------------
  // RENDER MEMORY
  // --------------------------------------------------

  const renderItem = useCallback(
    ({ item }) => {
      const memoryId =
        item?._id ||
        item?.id;

      if (!memoryId) {
        return null;
      }

      const id = String(memoryId);

      const alreadyAdded =
        existingMemoryIds.has(id);

      const selected =
        selectedIds.includes(id);

      const image =
        item?.images?.[0] ||
        item?.image ||
        null;

      return (
        <TouchableOpacity
          style={[
            styles.memoryRow,
            selected &&
              styles.memoryRowSelected,
            alreadyAdded &&
              styles.memoryRowDisabled,
          ]}
          onPress={() =>
            toggleMemory(id)
          }
          disabled={
            alreadyAdded || saving
          }
          activeOpacity={0.85}
        >
          <View style={styles.imageContainer}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.memoryImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={styles.emptyImage}
              >
                <Text
                  style={
                    styles.emptyImageText
                  }
                >
                  M
                </Text>
              </View>
            )}
          </View>

          <View style={styles.memoryInfo}>
            <Text
              style={[
                styles.memoryTitle,
                alreadyAdded &&
                  styles.disabledText,
              ]}
              numberOfLines={1}
            >
              {item.title ||
                "Untitled Memory"}
            </Text>

            {item.description ? (
              <Text
                style={[
                  styles.memoryDescription,
                  alreadyAdded &&
                    styles.disabledText,
                ]}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            ) : null}

            <Text
              style={[
                styles.memoryDate,
                alreadyAdded &&
                  styles.disabledText,
              ]}
            >
              {item.date
                ? new Date(
                    item.date
                  ).toLocaleDateString()
                : "No date"}
            </Text>
          </View>

          <View
            style={[
              styles.checkbox,
              selected &&
                styles.checkboxSelected,
              alreadyAdded &&
                styles.checkboxDisabled,
            ]}
          >
            {selected ? (
              <Text
                style={
                  styles.checkmark
                }
              >
                ✓
              </Text>
            ) : alreadyAdded ? (
              <Text
                style={
                  styles.checkmarkDisabled
                }
              >
                ✓
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      );
    },
    [
      existingMemoryIds,
      selectedIds,
      toggleMemory,
      saving,
    ]
  );

  const keyExtractor = useCallback(
    (item, index) =>
      String(
        item?._id ||
          item?.id ||
          index
      ),
    []
  );

  // --------------------------------------------------
  // EMPTY STATE
  // --------------------------------------------------

  const renderEmpty =
    useCallback(() => {
      return (
        <View
          style={
            styles.emptyContainer
          }
        >
          <Text
            style={
              styles.emptyTitle
            }
          >
            No memories available
          </Text>

          <Text
            style={
              styles.emptyText
            }
          >
            Create some memories first,
            then you can add them to this
            collection.
          </Text>
        </View>
      );
    }, []);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loadingCollection) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color="#34345C"
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Loading memories...
        </Text>
      </View>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <View
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          disabled={saving}
          activeOpacity={0.7}
        >
          <Text
            style={
              styles.cancelText
            }
          >
            Cancel
          </Text>
        </TouchableOpacity>

        <View
          style={
            styles.headerCenter
          }
        >
          <Text
            style={
              styles.headerTitle
            }
          >
            Add Memories
          </Text>

          <Text
            style={
              styles.selectedCount
            }
          >
            {selectedIds.length}{" "}
            selected
          </Text>
        </View>

        <View
          style={
            styles.headerSpacer
          }
        />
      </View>

      {collection ? (
        <View
          style={
            styles.collectionInfo
          }
        >
          <Text
            style={
              styles.collectionName
            }
            numberOfLines={1}
          >
            {collection.name}
          </Text>

          <Text
            style={
              styles.collectionHint
            }
          >
            Select memories to add
            to this collection.
          </Text>
        </View>
      ) : null}

      <FlatList
        data={selectableMemories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          renderEmpty
        }
        contentContainerStyle={
          selectableMemories.length ===
          0
            ? styles.emptyListContent
            : styles.listContent
        }
        showsVerticalScrollIndicator={
          false
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      <View
        style={styles.footer}
      >
        <TouchableOpacity
          style={[
            styles.addButton,
            (selectedIds.length ===
              0 ||
              saving) &&
              styles.addButtonDisabled,
          ]}
          onPress={handleAdd}
          disabled={
            selectedIds.length ===
              0 || saving
          }
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Text
              style={
                styles.addButtonText
              }
            >
              Add{" "}
              {selectedIds.length ||
                ""}{" "}
              {selectedIds.length ===
              1
                ? "Memory"
                : "Memories"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CollectionMemorySelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F0F6",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666666",
  },

  header: {
    height: 68,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#D9D8E2",
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#34345C",
  },

  headerCenter: {
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#242424",
  },

  selectedCount: {
    marginTop: 2,
    fontSize: 12,
    color: "#666666",
  },

  headerSpacer: {
    width: 52,
  },

  collectionInfo: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },

  collectionName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#242424",
  },

  collectionHint: {
    marginTop: 4,
    fontSize: 13,
    color: "#666666",
  },

  listContent: {
    padding: 20,
    paddingBottom: 110,
  },

  emptyListContent: {
    flexGrow: 1,
    padding: 20,
  },

  memoryRow: {
    minHeight: 82,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  memoryRowSelected: {
    borderColor: "#34345C",
    borderWidth: 2,
  },

  memoryRowDisabled: {
    opacity: 0.5,
  },

  imageContainer: {
    width: 58,
    height: 58,
    borderRadius: 10,
    overflow: "hidden",
  },

  memoryImage: {
    width: "100%",
    height: "100%",
  },

  emptyImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F0F6",
  },

  emptyImageText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#34345C",
  },

  memoryInfo: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 10,
  },

  memoryTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#242424",
  },

  memoryDescription: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: "#777777",
  },

  memoryDate: {
    marginTop: 4,
    fontSize: 12,
    color: "#777777",
  },

  disabledText: {
    color: "#999999",
  },

  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#D9D8E2",
    backgroundColor: "#FFFFFF",
  },

  checkboxSelected: {
    borderColor: "#34345C",
    backgroundColor: "#34345C",
  },

  checkboxDisabled: {
    backgroundColor: "#F1F0F6",
    borderColor: "#D9D8E2",
  },

  checkmark: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  checkmarkDisabled: {
    fontSize: 15,
    fontWeight: "700",
    color: "#999999",
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#D9D8E2",
    backgroundColor: "#F1F0F6",
  },

  addButton: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#34345C",
  },

  addButtonDisabled: {
    opacity: 0.5,
  },

  addButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#242424",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#666666",
    textAlign: "center",
  },
});

