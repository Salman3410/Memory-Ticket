import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMemory } from "../../hooks/useMemory";
import { useCollection } from "../../hooks/useCollection";
import MementoLogo from "../../components/common/MementoLogo";
import MemoryTicketHorizontal from "../../components/MemoryTicket/MemoryTicketHorizontal";

function CollectionMemorySelector({ route, navigation }) {
  const { collectionId } = route.params || {};

  const { memories } = useMemory();
  const { getCollectionById, addMemoryToCollection } = useCollection();

  const [collection, setCollection] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadCollection = async () => {
      if (!collectionId) {
        setLoadingCollection(false);
        return;
      }

      try {
        setLoadingCollection(true);

        const result = await getCollectionById(collectionId);

        if (mounted) {
          setCollection(result);
        }
      } catch (error) {
        console.error("Failed to load collection:", error);
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
  }, [collectionId, getCollectionById]);

  const existingMemoryIds = useMemo(() => {
    const existingMemories = Array.isArray(collection?.memories)
      ? collection.memories
      : [];

    return new Set(
      existingMemories.map((memory) =>
        String(memory?._id || memory?.id || memory),
      ),
    );
  }, [collection]);

  const selectableMemories = useMemo(() => {
    if (!Array.isArray(memories)) {
      return [];
    }

    return memories.filter((memory) => {
      return Boolean(memory?._id || memory?.id);
    });
  }, [memories]);

  const toggleMemory = useCallback(
    (memoryId) => {
      if (!memoryId) {
        return;
      }

      if (existingMemoryIds.has(String(memoryId))) {
        return;
      }

      const id = String(memoryId);

      setSelectedIds((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id);
        }

        return [...prev, id];
      });
    },
    [existingMemoryIds],
  );

  const handleAdd = useCallback(async () => {
    if (!collectionId || selectedIds.length === 0 || saving) {
      return;
    }

    try {
      setSaving(true);

      await addMemoryToCollection(collectionId, selectedIds);

      navigation.goBack();
    } catch (error) {
      console.error("Failed to add memories to collection:", error);
    } finally {
      setSaving(false);
    }
  }, [collectionId, selectedIds, saving, addMemoryToCollection, navigation]);

const renderItem = useCallback(
  ({ item }) => {
    const memoryId = item?._id || item?.id;

    if (!memoryId) {
      return null;
    }

    const id = String(memoryId);

    const alreadyAdded = existingMemoryIds.has(id);

    const selected = selectedIds.includes(id);

    return (
      <View style={styles.memoryItem}>
        <MemoryTicketHorizontal
          memory={item}
          selected={selected}
          alreadyAdded={alreadyAdded}
          onPress={() => toggleMemory(id)}
        />
      </View>
    );
  },
  [existingMemoryIds, selectedIds, toggleMemory],
);

  const keyExtractor = useCallback(
    (item, index) => String(item?._id || item?.id || index),
    [],
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyState}>
        <MementoLogo size={58} borderRadius={29} />

        <Text style={styles.emptyTitle}>No memories available</Text>

        <Text style={styles.emptyText}>
          Create some memories first, then you can add their tickets to this
          collection.
        </Text>
      </View>
    ),
    [],
  );

  if (loadingCollection) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34345C" />

        <Text style={styles.loadingText}>Loading memories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={saving}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerEyebrow}>COLLECTION</Text>

          <Text style={styles.headerTitle}>Add Memories</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* COLLECTION INFO */}
      {collection ? (
        <View style={styles.collectionHeader}>
          <Text style={styles.collectionName} numberOfLines={1}>
            {collection.name}
          </Text>

          <Text style={styles.collectionHint}>
            Choose the memory tickets you want to keep here.
          </Text>
        </View>
      ) : null}

      {/* MEMORY TICKETS */}
      <FlatList
        data={selectableMemories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          selectableMemories.length === 0
            ? styles.emptyListContent
            : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        // removeClippedSubviews
      />

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.selectedSummary}>
          <View
            style={[
              styles.selectedDot,
              selectedIds.length === 0 && styles.selectedDotEmpty,
            ]}
          />

          <Text style={styles.selectedText}>
            {selectedIds.length === 0
              ? "Select memory tickets"
              : `${selectedIds.length} ${
                  selectedIds.length === 1 ? "memory" : "memories"
                } selected`}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addButton,
            (selectedIds.length === 0 || saving) && styles.addButtonDisabled,
          ]}
          onPress={handleAdd}
          disabled={selectedIds.length === 0 || saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.addButtonText}>Add to Collection</Text>
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
    fontSize: 13,
    color: "#777777",
  },

  header: {
    height: 100,
    paddingTop:20,
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

  headerEyebrow: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#E76F51",
  },

  headerTitle: {
    marginTop: 3,
    fontSize: 18,
    fontWeight: "800",
    color: "#242424",
  },

  headerSpacer: {
    width: 52,
  },

  collectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 12,
  },

  collectionName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#242424",
  },

  collectionHint: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: "#777777",
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 125,
  },

  emptyListContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },

  memoryItem: {
    marginBottom: 12,
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "#F1F0F6",
    borderTopWidth: 1,
    borderTopColor: "#D9D8E2",
  },

  selectedSummary: {
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedDot: {
    width: 7,
    height: 7,
    marginRight: 6,
    borderRadius: 4,
    backgroundColor: "#34345C",
  },

  selectedDotEmpty: {
    backgroundColor: "#C8C7D1",
  },

  selectedText: {
    fontSize: 11,
    color: "#777777",
  },

  addButton: {
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  addButtonDisabled: {
    opacity: 0.45,
  },

  addButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 19,
    fontWeight: "800",
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
});
