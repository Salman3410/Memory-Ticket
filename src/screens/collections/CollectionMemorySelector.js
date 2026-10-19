import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useMemory } from "../../hooks/useMemory";
import { useCollection } from "../../hooks/useCollection";
import MementoLogo from "../../components/common/MementoLogo";
import MemoryTicketHorizontal from "../../components/MemoryTicket/MemoryTicketHorizontal";
import { useTheme } from "../../context/ThemeContext";

function CollectionMemorySelector({ route, navigation }) {
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
    (isDark ? "#25223D" : "#FFFFFF");

  const disabledBackground =
    isDark ? "#383548" : "#E3E2EA";

  const { collectionId } = route.params || {};

  const { memories } = useMemory();

  const {
    getCollectionById,
    addMemoryToCollection,
  } = useCollection();

  const [collection, setCollection] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [saving, setSaving] = useState(false);

  // --------------------------------------------------
  // LOAD COLLECTION
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

  // --------------------------------------------------
  // EXISTING MEMORY IDS
  // --------------------------------------------------

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

  // --------------------------------------------------
  // SELECTABLE MEMORIES
  // --------------------------------------------------

  const selectableMemories = useMemo(() => {
    if (!Array.isArray(memories)) {
      return [];
    }

    return memories.filter((memory) =>
      Boolean(memory?._id || memory?.id),
    );
  }, [memories]);

  // --------------------------------------------------
  // TOGGLE MEMORY SELECTION
  // --------------------------------------------------

  const toggleMemory = useCallback(
    (memoryId) => {
      if (!memoryId || saving) {
        return;
      }

      const id = String(memoryId);

      if (existingMemoryIds.has(id)) {
        return;
      }

      setSelectedIds((previous) => {
        if (previous.includes(id)) {
          return previous.filter((item) => item !== id);
        }

        return [...previous, id];
      });
    },
    [existingMemoryIds, saving],
  );

  // --------------------------------------------------
  // ADD SELECTED MEMORIES
  // --------------------------------------------------

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
  }, [
    collectionId,
    selectedIds,
    saving,
    addMemoryToCollection,
    navigation,
  ]);

  // --------------------------------------------------
  // RENDER MEMORY
  // --------------------------------------------------

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
        <View
          style={[
            styles.memoryItem,
            {
              backgroundColor: surfaceColor,
              borderColor: selected ? primaryColor : borderColor,
            },
            selected && styles.memoryItemSelected,
          ]}
        >
          <MemoryTicketHorizontal
            memory={item}
            selected={selected}
            alreadyAdded={alreadyAdded}
            onPress={() => toggleMemory(id)}
          />
        </View>
      );
    },
    [
      existingMemoryIds,
      selectedIds,
      toggleMemory,
      surfaceColor,
      borderColor,
      primaryColor,
      primaryTextColor,
      secondaryTextColor,
      mutedTextColor,
      isDark,
      colors,
    ],
  );

  const keyExtractor = useCallback(
    (item, index) =>
      String(item?._id || item?.id || `memory-${index}`),
    [],
  );

  const renderEmpty = useCallback(
    () => (
      <View
        style={[
          styles.emptyState,
          {
            backgroundColor: surfaceColor,
            borderColor,
          },
        ]}
      >
        <View
          style={[
            styles.emptyIconContainer,
            {
              backgroundColor: screenBackground,
              borderColor,
            },
          ]}
        >
          <MementoLogo size={46} borderRadius={15} />
        </View>

        <Text
          style={[
            styles.emptyTitle,
            { color: textColor },
          ]}
        >
          No memories available
        </Text>

        <Text
          style={[
            styles.emptyText,
            { color: secondaryTextColor },
          ]}
        >
          Create some memories first, then you can add their tickets to this
          collection.
        </Text>
      </View>
    ),
    [
      surfaceColor,
      borderColor,
      screenBackground,
      textColor,
      secondaryTextColor,
    ],
  );

  if (loadingCollection) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: screenBackground },
        ]}
      >
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={screenBackground}
        />

        <ActivityIndicator
          size="large"
          color={primaryColor}
        />

        <Text
          style={[
            styles.loadingText,
            { color: secondaryTextColor },
          ]}
        >
          Loading memories...
        </Text>
      </View>
    );
  }

  const hasSelection = selectedIds.length > 0;
  const isAddDisabled = !hasSelection || saving;

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

      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: screenBackground,
            borderBottomColor: borderColor,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() => navigation.goBack()}
          disabled={saving}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.cancelText,
              { color: primaryColor },
            ]}
          >
            Cancel
          </Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text
            style={[
              styles.headerEyebrow,
              { color: secondaryTextColor },
            ]}
          >
            COLLECTION
          </Text>

          <Text
            style={[
              styles.headerTitle,
              { color: textColor },
            ]}
          >
            Add Memories
          </Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* COLLECTION INFO */}
      {collection ? (
        <View
          style={[
            styles.collectionHeader,
            { backgroundColor: screenBackground },
          ]}
        >
          <Text
            style={[
              styles.collectionName,
              { color: textColor },
            ]}
            numberOfLines={1}
          >
            {collection.name}
          </Text>

          <Text
            style={[
              styles.collectionHint,
              { color: secondaryTextColor },
            ]}
          >
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
        style={{ backgroundColor: screenBackground }}
        contentContainerStyle={[
          selectableMemories.length === 0
            ? styles.emptyListContent
            : styles.listContent,
          { backgroundColor: screenBackground },
        ]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        keyboardShouldPersistTaps="handled"
      />

      {/* FOOTER */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: screenBackground,
            borderTopColor: borderColor,
          },
        ]}
      >
        <View
          style={[
            styles.selectedSummary,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          <View
            style={[
              styles.selectedDot,
              {
                backgroundColor: hasSelection
                  ? primaryColor
                  : mutedTextColor,
              },
            ]}
          />

          <Text
            style={[
              styles.selectedText,
              { color: hasSelection ? textColor : secondaryTextColor },
            ]}
          >
            {saving
              ? "Adding memories..."
              : selectedIds.length === 0
                ? "Select memory tickets"
                : `${selectedIds.length} ${
                    selectedIds.length === 1 ? "memory" : "memories"
                  } selected`}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addButton,
            {
              backgroundColor: isAddDisabled
                ? disabledBackground
                : primaryColor,
            },
          ]}
          onPress={handleAdd}
          disabled={isAddDisabled}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator
              size="small"
              color={
                isAddDisabled
                  ? mutedTextColor
                  : primaryTextColor
              }
            />
          ) : (
            <>
              <Text
                style={[
                  styles.addButtonText,
                  {
                    color: isAddDisabled
                      ? mutedTextColor
                      : primaryTextColor,
                  },
                ]}
              >
                Add to Collection
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color={
                  isAddDisabled
                    ? mutedTextColor
                    : primaryTextColor
                }
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Small helper to keep the already-added badge consistent with the theme.
function inputBackgroundForStatus(isDark, colors) {
  return colors.input || (isDark ? "#292638" : "#F8F8FA");
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
    marginTop: 12,
    fontSize: 13,
    color: "#707080",
  },

  // HEADER
  header: {
    minHeight: 84,
    marginTop:20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D9D8E2",
  },

  headerAction: {
    width: 64,
    minHeight: 40,
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#34345C",
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },

  headerEyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: "#707080",
  },

  headerTitle: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: "800",
    color: "#242424",
  },

  headerSpacer: {
    width: 64,
    minHeight: 40,
  },

  // COLLECTION INFO
  collectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 17,
    paddingBottom: 13,
  },

  collectionName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#242424",
  },

  collectionHint: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
    color: "#707080",
  },

  // LIST
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 5,
    paddingBottom: 22,
  },

  emptyListContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },

  memoryItem: {
    position: "relative",
    marginBottom: 13,
    padding: 8,
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    backgroundColor: "#FFFFFF",
  },

  memoryItemSelected: {
    borderWidth: 1.5,
  },

  selectionIndicator: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  memoryStatus: {
    alignSelf: "flex-start",
    marginTop: 8,
    marginLeft: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  memoryStatusText: {
    fontSize: 10,
    fontWeight: "600",
  },

  // FOOTER
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: "#F1F0F6",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#D9D8E2",
  },

  selectedSummary: {
    minHeight: 40,
    marginBottom: 10,
    paddingHorizontal: 12,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  selectedDot: {
    width: 7,
    height: 7,
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: "#34345C",
  },

  selectedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#707080",
  },

  addButton: {
    minHeight: 50,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: "#34345C",
  },

  addButtonDisabled: {
    opacity: 0.45,
  },

  addButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  // EMPTY STATE
  emptyState: {
    flex: 1,
    minHeight: 250,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 28,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    backgroundColor: "#FFFFFF",
  },

  emptyIconContainer: {
    width: 66,
    height: 66,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F0F6",
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800",
    color: "#242424",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: "#707080",
    textAlign: "center",
  },
});