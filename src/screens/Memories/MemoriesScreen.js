import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { View, Text, TouchableOpacity, Alert, FlatList } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useMemory } from "../../hooks/useMemory";

import SearchBar from "../../components/Memories/SearchBar/SearchBar";
import CollectionStats from "../../components/Memories/CollectionStats/CollectionStats";
import MemoryFilters from "../../components/Memories/MemoryFilters/MemoryFilters";
import EmptyMemoryState from "../../components/Memories/EmptyMemoryState/EmptyMemoryState";
import MemoryTicketList from "../../components/Memories/MemoryTicketList/MemoryTicketList";
import TimelineBottomSheet from "../../components/Memories/TimelineBottomSheet/TimelineBottomSheet";

import styles from "./memoriesStyles";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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
  selectedTag,
  timelineMonth,
  onOpenTimeline,
}) {
  const getFilterLabel = () => {
    if (timelineMonth) {
      return `${MONTHS[timelineMonth.getMonth()]} ${timelineMonth.getFullYear()}`;
    }

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

        <View style={styles.headerActions}>
          {/* TIMELINE */}

          <TouchableOpacity
            style={[
              styles.timelineButton,
              timelineMonth && styles.timelineButtonActive,
            ]}
            onPress={onOpenTimeline}
            activeOpacity={0.8}
          >
            <Ionicons
              name="calendar-outline"
              size={19}
              color={timelineMonth ? "#FFFFFF" : "#34345C"}
            />

            <Text
              style={[
                styles.timelineButtonText,
                timelineMonth && styles.timelineButtonTextActive,
              ]}
            >
              {timelineMonth
                ? MONTHS[timelineMonth.getMonth()].slice(0, 3)
                : "Time"}
            </Text>
          </TouchableOpacity>

          {/* ADD */}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("Create")}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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

  // ------------------------------------------
  // TIMELINE
  // ------------------------------------------

  const [timelineMonth, setTimelineMonth] = useState(null);

  const timelineSheetRef = useRef(null);

  // ------------------------------------------
  // ROUTE FILTER
  // ------------------------------------------

  useEffect(() => {
    if (route?.params?.filter) {
      setFilter(route.params.filter);
    }
  }, [route?.params?.filter]);

  // ------------------------------------------
  // ROUTE TAG
  // ------------------------------------------

  useEffect(() => {
    const routeTag = route?.params?.tag;

    if (typeof routeTag === "string" && routeTag.trim()) {
      const normalizedTag = routeTag.trim().replace(/^#+/, "").toLowerCase();

      setSelectedTag(normalizedTag);
    }
  }, [route?.params?.tag]);

  // ------------------------------------------
  // MEMORY TIME
  // ------------------------------------------

  const getMemoryTime = useCallback((memory) => {
    const dateValue = memory.createdAt || memory.date;

    if (!dateValue) {
      return 0;
    }

    const time = new Date(dateValue).getTime();

    return Number.isNaN(time) ? 0 : time;
  }, []);

  // ------------------------------------------
  // TIMELINE DATE
  // ------------------------------------------

  const getTimelineTime = useCallback((memory) => {
    const dateValue = memory.date || memory.createdAt;

    if (!dateValue) {
      return 0;
    }

    const time = new Date(dateValue).getTime();

    return Number.isNaN(time) ? 0 : time;
  }, []);

  // ------------------------------------------
  // AVAILABLE TAGS
  // ------------------------------------------

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

  // ------------------------------------------
  // VERIFY SELECTED TAG
  // ------------------------------------------

  useEffect(() => {
    if (!selectedTag) {
      return;
    }

    const exists = availableTags.some((tag) => tag.name === selectedTag);

    if (!exists) {
      setSelectedTag(null);
    }
  }, [selectedTag, availableTags]);

  // ------------------------------------------
  // DISPLAYED MEMORIES
  // ------------------------------------------

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

    // TIMELINE MONTH

    if (timelineMonth) {
      const selectedYear = timelineMonth.getFullYear();

      const selectedMonth = timelineMonth.getMonth();

      filtered = filtered.filter((memory) => {
        const memoryTime = getTimelineTime(memory);

        if (!memoryTime) {
          return false;
        }

        const memoryDate = new Date(memoryTime);

        return (
          memoryDate.getFullYear() === selectedYear &&
          memoryDate.getMonth() === selectedMonth
        );
      });
    }

    // SORT

    const sorted = [...filtered];

    sorted.sort((a, b) => {
      const dateA = timelineMonth ? getTimelineTime(a) : getMemoryTime(a);

      const dateB = timelineMonth ? getTimelineTime(b) : getMemoryTime(b);

      if (sortOrder === "newest") {
        return dateB - dateA;
      }

      return dateA - dateB;
    });

    return sorted;
  }, [
    memories,
    filter,
    sortOrder,
    searchQuery,
    selectedTag,
    timelineMonth,
    getMemoryTime,
    getTimelineTime,
  ]);

  // ------------------------------------------
  // FAVORITE COUNT
  // ------------------------------------------

  const favoriteCount = useMemo(
    () => memories.filter((memory) => memory.favorite === true).length,
    [memories],
  );

  // ------------------------------------------
  // MEMORY PRESS
  // ------------------------------------------

  const handleMemoryPress = useCallback(
    (memoryId) => {
      navigation.navigate("MemoryDetails", {
        memoryId,
      });
    },
    [navigation],
  );

  // ------------------------------------------
  // CREATE MEMORY
  // ------------------------------------------

  const handleCreateMemory = useCallback(() => {
    navigation.navigate("Create");
  }, [navigation]);

  // ------------------------------------------
  // TOGGLE FAVORITE
  // ------------------------------------------

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

  // ------------------------------------------
  // OPEN TIMELINE
  // ------------------------------------------

  const handleOpenTimeline = useCallback(() => {
    timelineSheetRef.current?.open();
  }, []);

  // ------------------------------------------
  // APPLY TIMELINE
  // ------------------------------------------

  const handleApplyTimelineMonth = useCallback((month) => {
    setTimelineMonth(month);
  }, []);

  // ------------------------------------------
  // CLEAR TIMELINE
  // ------------------------------------------

  const handleClearTimeline = useCallback(() => {
    setTimelineMonth(null);
  }, []);

  // ------------------------------------------
  // CLOSE TIMELINE
  // ------------------------------------------

  const handleCloseTimeline = useCallback(() => {
    // The BottomSheetModal has already
    // been dismissed.
  }, []);

  // ------------------------------------------
  // HEADER
  // ------------------------------------------

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
        selectedTag={selectedTag}
        timelineMonth={timelineMonth}
        onOpenTimeline={handleOpenTimeline}
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
      selectedTag,
      timelineMonth,
      handleOpenTimeline,
    ],
  );

  // ------------------------------------------
  // RENDER ITEM
  // ------------------------------------------

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

  // ------------------------------------------
  // KEY EXTRACTOR
  // ------------------------------------------

  const keyExtractor = useCallback(
    (item, index) =>
      String(item.id || item.clientMemoryId || `memory-${index}`),
    [],
  );

  // ------------------------------------------
  // FOOTER
  // ------------------------------------------

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

  // ------------------------------------------
  // EMPTY STATE
  // ------------------------------------------

  const renderEmptyState = useCallback(() => {
    if (timelineMonth && !searchQuery.trim()) {
      return (
        <View style={styles.timelineEmptyState}>
          <Ionicons name="calendar-outline" size={40} color="#34345C" />

          <Text style={styles.timelineEmptyTitle}>
            No memories in {MONTHS[timelineMonth.getMonth()]}{" "}
            {timelineMonth.getFullYear()}
          </Text>

          <Text style={styles.timelineEmptyText}>
            Choose another month to see your memories.
          </Text>
        </View>
      );
    }

    return (
      <EmptyMemoryState
        filter={filter}
        searchQuery={searchQuery}
        onCreateMemory={handleCreateMemory}
      />
    );
  }, [timelineMonth, searchQuery, filter, handleCreateMemory]);

  // ------------------------------------------
  // LOADING
  // ------------------------------------------

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

  // ------------------------------------------
  // SCREEN
  // ------------------------------------------

  return (
    <View style={styles.container}>
      <FlatList
        data={displayedMemories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={headerComponent}
        ListEmptyComponent={renderEmptyState}
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

      {/* REUSABLE TIMELINE BOTTOM SHEET */}

      <TimelineBottomSheet
        ref={timelineSheetRef}
        selectedMonth={timelineMonth}
        onApply={handleApplyTimelineMonth}
        onClear={handleClearTimeline}
        onClose={handleCloseTimeline}
      />
    </View>
  );
}

export default React.memo(MemoriesScreen);
