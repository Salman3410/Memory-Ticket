import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useMemory } from "../../hooks/useMemory";

import SearchBar from "../../components/Memories/SearchBar/SearchBar";

import CollectionStats from "../../components/Memories/CollectionStats/CollectionStats";

import MemoryFilters from "../../components/Memories/MemoryFilters/MemoryFilters";

import EmptyMemoryState from "../../components/Memories/EmptyMemoryState/EmptyMemoryState";

import MemoryTicketList from "../../components/Memories/MemoryTicketList/MemoryTicketList";

import styles from "./memoriesStyles";

const tagStyles = StyleSheet.create({
  tagSection: {
    marginTop: 14,
    marginBottom: 4,
  },

  tagSectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#707080",
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  tagScrollContent: {
    paddingRight: 16,
  },

  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },

  tagChipActive: {
    backgroundColor: "#34345C",
    borderColor: "#34345C",
  },

  tagChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#707080",
  },

  tagChipTextActive: {
    color: "#FFFFFF",
  },

  tagCount: {
    marginLeft: 5,
    fontSize: 11,
    color: "#A6A5AE",
    fontWeight: "600",
  },

  tagCountActive: {
    color: "#FFFFFF",
  },
});

const MemoriesHeader = React.memo(function MemoriesHeader({
  navigation,
  searchQuery,
  setSearchQuery,
  memoriesCount,
  favoriteCount,
  filter,
  setFilter,
  sortOrder,
  setSortOrder,
  showSortMenu,
  setShowSortMenu,
  displayedCount,
  tags,
  selectedTag,
  setSelectedTag,
}) {
  const getFilterLabel = () => {
    switch (filter) {
      case "favorites":
        return "FAVORITES";

      case "recent":
        return "RECENT";

      default:
        return "ALL";
    }
  };

  return (
    <>
      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>YOUR COLLECTION</Text>

          <Text style={styles.headerTitle}>Memories</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("Create")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* SEARCH */}

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search memories..."
      />

      {/* COLLECTION STATS */}

      <CollectionStats
        memoryCount={memoriesCount}
        favoriteCount={favoriteCount}
      />

      {/* FILTERS */}

      <MemoryFilters
        filter={filter}
        setFilter={setFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        showSortMenu={showSortMenu}
        setShowSortMenu={setShowSortMenu}
      />

      {/* TAG FILTERS */}

      {tags.length > 0 && (
        <View style={tagStyles.tagSection}>
          <Text style={tagStyles.tagSectionLabel}>TAGS</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tagStyles.tagScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={[
                tagStyles.tagChip,
                !selectedTag && tagStyles.tagChipActive,
              ]}
              onPress={() => setSelectedTag(null)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  tagStyles.tagChipText,
                  !selectedTag && tagStyles.tagChipTextActive,
                ]}
              >
                ALL TAGS
              </Text>
            </TouchableOpacity>

            {tags.map(({ name, count }) => {
              const isActive = selectedTag === name;

              return (
                <TouchableOpacity
                  key={name}
                  style={[
                    tagStyles.tagChip,
                    isActive && tagStyles.tagChipActive,
                  ]}
                  onPress={() => setSelectedTag(isActive ? null : name)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      tagStyles.tagChipText,
                      isActive && tagStyles.tagChipTextActive,
                    ]}
                  >
                    #{name}
                  </Text>

                  <Text
                    style={[
                      tagStyles.tagCount,
                      isActive && tagStyles.tagCountActive,
                    ]}
                  >
                    {count}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* CURRENT VIEW */}

      <View style={styles.viewHeader}>
        <Text style={styles.viewTitle}>
          {selectedTag ? `#${selectedTag}` : getFilterLabel()}
        </Text>

        <Text style={styles.viewCount}>
          {displayedCount} {displayedCount === 1 ? "TICKET" : "TICKETS"}
        </Text>
      </View>
    </>
  );
});

function MemoriesScreen({ navigation, route }) {
  const { memories, loading, toggleFavorite } = useMemory();

  const [filter, setFilter] = useState("all");

  const [sortOrder, setSortOrder] = useState("newest");

  const [showSortMenu, setShowSortMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    if (route?.params?.filter) {
      setFilter(route.params.filter);
    }
  }, [route?.params?.filter]);

  // --------------------------------------------------
  // ROUTE TAG
  // --------------------------------------------------

  useEffect(() => {
    const routeTag = route?.params?.tag;

    if (typeof routeTag === "string" && routeTag.trim()) {
      const normalizedTag = routeTag.trim().replace(/^#+/, "").toLowerCase();

      setSelectedTag(normalizedTag);
    }
  }, [route?.params?.tag]);

  // --------------------------------------------------
  // MEMORY TIME
  // --------------------------------------------------

  const getMemoryTime = useCallback((memory) => {
    const dateValue = memory.createdAt || memory.date;

    if (!dateValue) {
      return 0;
    }

    const time = new Date(dateValue).getTime();

    return Number.isNaN(time) ? 0 : time;
  }, []);

  // --------------------------------------------------
  // AVAILABLE TAGS
  // --------------------------------------------------

  const availableTags = useMemo(() => {
    const tagCounts = new Map();

    for (const memory of memories) {
      if (!Array.isArray(memory.tags)) {
        continue;
      }

      const uniqueMemoryTags = new Set();

      for (const tag of memory.tags) {
        if (typeof tag !== "string") {
          continue;
        }

        const normalizedTag = tag.trim().replace(/^#+/, "").toLowerCase();

        if (!normalizedTag || uniqueMemoryTags.has(normalizedTag)) {
          continue;
        }

        uniqueMemoryTags.add(normalizedTag);

        tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1);
      }
    }

    return Array.from(tagCounts.entries())
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [memories]);

  // --------------------------------------------------
  // CLEAR INVALID TAG
  // --------------------------------------------------

  useEffect(() => {
    if (!selectedTag) {
      return;
    }

    const exists = availableTags.some((tag) => tag.name === selectedTag);

    if (!exists) {
      setSelectedTag(null);
    }
  }, [selectedTag, availableTags]);

  // --------------------------------------------------
  // DISPLAYED MEMORIES
  // --------------------------------------------------

  const displayedMemories = useMemo(() => {
    let filtered = memories;

    const query = searchQuery.trim().toLowerCase();

    // SEARCH

    if (query) {
      filtered = filtered.filter((memory) => {
        const memoryTags = Array.isArray(memory.tags) ? memory.tags : [];

        const searchableText = [
          memory.title,
          memory.description,
          memory.location,
          memory.category,
          memory.date,
          ...memoryTags,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    // TAG FILTER

    if (selectedTag) {
      filtered = filtered.filter((memory) => {
        const memoryTags = Array.isArray(memory.tags) ? memory.tags : [];

        return memoryTags.some(
          (tag) =>
            typeof tag === "string" &&
            tag.trim().replace(/^#+/, "").toLowerCase() === selectedTag,
        );
      });
    }

    // FAVORITES

    if (filter === "favorites") {
      filtered = filtered.filter((memory) => memory.favorite === true);
    }

    // RECENT

    if (filter === "recent") {
      const now = Date.now();

      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

      filtered = filtered.filter((memory) => {
        const memoryTime = getMemoryTime(memory);

        return memoryTime >= thirtyDaysAgo && memoryTime <= now;
      });
    }

    // SORT

    const sorted = [...filtered];

    sorted.sort((a, b) => {
      const dateA = getMemoryTime(a);

      const dateB = getMemoryTime(b);

      if (sortOrder === "newest") {
        return dateB - dateA;
      }

      return dateA - dateB;
    });

    return sorted;
  }, [memories, filter, sortOrder, searchQuery, selectedTag, getMemoryTime]);

  // --------------------------------------------------
  // FAVORITE COUNT
  // --------------------------------------------------

  const favoriteCount = useMemo(
    () => memories.filter((memory) => memory.favorite === true).length,
    [memories],
  );

  // --------------------------------------------------
  // MEMORY PRESS
  // --------------------------------------------------

  const handleMemoryPress = useCallback(
    (memoryId) => {
      navigation.navigate("MemoryDetails", {
        memoryId,
      });
    },
    [navigation],
  );

  // --------------------------------------------------
  // CREATE MEMORY
  // --------------------------------------------------

  const handleCreateMemory = useCallback(() => {
    navigation.navigate("Create");
  }, [navigation]);

  // --------------------------------------------------
  // TOGGLE FAVORITE
  // --------------------------------------------------

  const handleToggleFavorite = useCallback(
    async (memory) => {
      try {
        const memoryId = memory?.id || memory?.clientMemoryId;

        if (!memoryId) {
          Alert.alert(
            "Favorite Failed",
            "This memory could not be identified.",
          );

          return;
        }

        await toggleFavorite(memoryId);
      } catch (error) {
        console.error("Favorite error:", error);

        Alert.alert(
          "Favorite Failed",
          error?.message || "Unable to update favorite status.",
        );
      }
    },
    [toggleFavorite],
  );

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  const headerComponent = useMemo(
    () => (
      <MemoriesHeader
        navigation={navigation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        memoriesCount={memories.length}
        favoriteCount={favoriteCount}
        filter={filter}
        setFilter={setFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        showSortMenu={showSortMenu}
        setShowSortMenu={setShowSortMenu}
        displayedCount={displayedMemories.length}
        tags={availableTags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
      />
    ),
    [
      navigation,
      searchQuery,
      memories.length,
      favoriteCount,
      filter,
      sortOrder,
      showSortMenu,
      displayedMemories.length,
      availableTags,
      selectedTag,
    ],
  );

  // --------------------------------------------------
  // RENDER ITEM
  // --------------------------------------------------

  const renderItem = useCallback(
    ({ item }) => (
      <MemoryTicketList
        memory={item}
        onMemoryPress={handleMemoryPress}
        onToggleFavorite={handleToggleFavorite}
      />
    ),
    [handleMemoryPress, handleToggleFavorite],
  );

  // --------------------------------------------------
  // KEY EXTRACTOR
  // --------------------------------------------------

  const keyExtractor = useCallback(
    (item, index) =>
      String(item.id || item.clientMemoryId || `memory-${index}`),
    [],
  );

  // --------------------------------------------------
  // FOOTER
  // --------------------------------------------------

  const renderFooter = useCallback(
    () => (
      <Text style={styles.footerText}>
        KEEP THE MOMENT.
        {"\n"}
        KEEP THE STORY.
      </Text>
    ),
    [],
  );

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingState}>
          <Ionicons name="hourglass-outline" size={30} color="#34345C" />

          <Text style={styles.loadingTitle}>Loading memories...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={displayedMemories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={headerComponent}
        ListEmptyComponent={
          <EmptyMemoryState
            filter={filter}
            searchQuery={searchQuery}
            onCreateMemory={handleCreateMemory}
          />
        }
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
      />
    </View>
  );
}

export default React.memo(MemoriesScreen);
