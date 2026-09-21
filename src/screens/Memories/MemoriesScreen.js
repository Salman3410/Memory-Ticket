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
import { useCollection } from "../../hooks/useCollection";
import SearchBar from "../../components/Memories/SearchBar/SearchBar";
import CollectionStats from "../../components/Memories/CollectionStats/CollectionStats";
import MemoryFilters from "../../components/Memories/MemoryFilters/MemoryFilters";
import EmptyMemoryState from "../../components/Memories/EmptyMemoryState/EmptyMemoryState";
import MemoryTicketList from "../../components/Memories/MemoryTicketList/MemoryTicketList";
import TimelineBottomSheet from "../../components/Memories/TimelineBottomSheet/TimelineBottomSheet";
import AdvancedSearch from "../../components/Memories/AdvancedSearch/AdvancedSearch";
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

const DEFAULT_ADVANCED_FILTERS = {
  favoriteOnly: false,
  hasPhotos: false,
  dateRange: "all",
  tag: null,
  collectionId: null,
  searchIn: ["title", "description", "location", "tags", "category"],
};

const normalizeTag = (tag) => {
  if (typeof tag !== "string") {
    return "";
  }

  return tag.trim().replace(/^#+/, "").toLowerCase();
};

const getCollectionMemoryIds = (collection) => {
  if (!collection) {
    return new Set();
  }

  const collectionMemories = Array.isArray(collection.memories)
    ? collection.memories
    : Array.isArray(collection.memoryIds)
      ? collection.memoryIds
      : [];

  return new Set(
    collectionMemories
      .map((memory) => {
        if (typeof memory === "string") {
          return String(memory);
        }

        return String(
          memory?._id || memory?.id || memory?.clientMemoryId || "",
        );
      })
      .filter(Boolean),
  );
};

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
  onOpenAdvancedSearch,
  advancedFilterCount,
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
        onAdvancedPress={onOpenAdvancedSearch}
        advancedFilterCount={advancedFilterCount}
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
  const { collections = [] } = useCollection();

  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);

  const [advancedFilters, setAdvancedFilters] = useState(
    DEFAULT_ADVANCED_FILTERS,
  );

  const advancedSearchRef = useRef(null);

  const [timelineMonth, setTimelineMonth] = useState(null);
  const timelineSheetRef = useRef(null);

  useEffect(() => {
    if (route?.params?.filter) {
      setFilter(route.params.filter);
    }
  }, [route?.params?.filter]);

  useEffect(() => {
    const routeTag = route?.params?.tag;

    if (typeof routeTag === "string" && routeTag.trim()) {
      const normalizedTag = normalizeTag(routeTag);

      setSelectedTag(normalizedTag);
    }
  }, [route?.params?.tag]);

  const getMemoryTime = useCallback((memory) => {
    const dateValue = memory.createdAt || memory.date;

    if (!dateValue) {
      return 0;
    }

    const time = new Date(dateValue).getTime();

    return Number.isNaN(time) ? 0 : time;
  }, []);

  const getTimelineTime = useCallback((memory) => {
    const dateValue = memory.date || memory.createdAt;

    if (!dateValue) {
      return 0;
    }

    const time = new Date(dateValue).getTime();

    return Number.isNaN(time) ? 0 : time;
  }, []);

  const availableTags = useMemo(() => {
    const tagCounts = new Map();

    for (const memory of memories) {
      if (!Array.isArray(memory.tags)) {
        continue;
      }

      const uniqueMemoryTags = new Set();

      for (const tag of memory.tags) {
        const normalizedTag = normalizeTag(tag);

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

  useEffect(() => {
    if (!selectedTag) {
      return;
    }

    const exists = availableTags.some((tag) => tag.name === selectedTag);

    if (!exists) {
      setSelectedTag(null);
    }
  }, [selectedTag, availableTags]);

  const advancedFilterCount = useMemo(() => {
    let count = 0;

    if (advancedFilters.favoriteOnly) {
      count += 1;
    }

    if (advancedFilters.hasPhotos) {
      count += 1;
    }

    if (advancedFilters.dateRange !== "all") {
      count += 1;
    }

    if (advancedFilters.tag) {
      count += 1;
    }

    if (advancedFilters.collectionId) {
      count += 1;
    }

    const defaultSearchIn = DEFAULT_ADVANCED_FILTERS.searchIn;

    const currentSearchIn = advancedFilters.searchIn || [];

    const searchInChanged =
      currentSearchIn.length !== defaultSearchIn.length ||
      defaultSearchIn.some((field) => !currentSearchIn.includes(field));

    if (searchInChanged) {
      count += 1;
    }

    return count;
  }, [advancedFilters]);

  const displayedMemories = useMemo(() => {
    let filtered = memories;

    const query = searchQuery.trim().toLowerCase();

    if (query) {
      filtered = filtered.filter((memory) => {
        const memoryTags = Array.isArray(memory.tags) ? memory.tags : [];

        const normalizedTags = memoryTags
          .filter((tag) => typeof tag === "string")
          .flatMap((tag) => {
            const normalized = normalizeTag(tag);

            return normalized ? [normalized, `#${normalized}`] : [];
          });

        const searchFields =
          advancedFilters.searchIn?.length > 0
            ? advancedFilters.searchIn
            : DEFAULT_ADVANCED_FILTERS.searchIn;

        const searchableParts = [];

        if (searchFields.includes("title")) {
          searchableParts.push(memory.title);
        }

        if (searchFields.includes("description")) {
          searchableParts.push(memory.description);
        }

        if (searchFields.includes("location")) {
          searchableParts.push(memory.location);
        }

        if (searchFields.includes("tags")) {
          searchableParts.push(...normalizedTags);
        }

        if (searchFields.includes("category")) {
          searchableParts.push(memory.category);
        }

        searchableParts.push(memory.date);

        const searchableText = searchableParts
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    if (selectedTag) {
      filtered = filtered.filter((memory) => {
        const memoryTags = Array.isArray(memory.tags) ? memory.tags : [];

        return memoryTags.some((tag) => normalizeTag(tag) === selectedTag);
      });
    }

    if (advancedFilters.tag) {
      filtered = filtered.filter((memory) => {
        const memoryTags = Array.isArray(memory.tags) ? memory.tags : [];

        return memoryTags.some(
          (tag) => normalizeTag(tag) === advancedFilters.tag,
        );
      });
    }


    if (filter === "favorites" || advancedFilters.favoriteOnly) {
      filtered = filtered.filter((memory) => memory.favorite === true);
    }

    if (filter === "recent") {
      const now = Date.now();

      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

      filtered = filtered.filter((memory) => {
        const memoryTime = getMemoryTime(memory);

        return memoryTime >= thirtyDaysAgo && memoryTime <= now;
      });
    }

    if (advancedFilters.hasPhotos) {
      filtered = filtered.filter((memory) => {
        const images = Array.isArray(memory.images)
          ? memory.images
          : Array.isArray(memory.localImages)
            ? memory.localImages
            : memory.image
              ? [memory.image]
              : [];

        return images.length > 0;
      });
    }

    if (advancedFilters.dateRange !== "all") {
      const now = Date.now();

      let cutoff = null;

      switch (advancedFilters.dateRange) {
        case "7days":
          cutoff = now - 7 * 24 * 60 * 60 * 1000;
          break;

        case "30days":
          cutoff = now - 30 * 24 * 60 * 60 * 1000;
          break;

        case "90days":
          cutoff = now - 90 * 24 * 60 * 60 * 1000;
          break;

        case "year": {
          const startOfYear = new Date(new Date().getFullYear(), 0, 1);

          cutoff = startOfYear.getTime();

          break;
        }

        default:
          cutoff = null;
      }

      if (cutoff !== null) {
        filtered = filtered.filter((memory) => {
          const memoryTime = getMemoryTime(memory);

          return memoryTime >= cutoff && memoryTime <= now;
        });
      }
    }

    if (advancedFilters.collectionId) {
      const selectedCollection = collections.find((collection) => {
        const collectionId = collection?._id || collection?.id;

        return String(collectionId) === String(advancedFilters.collectionId);
      });

      const collectionMemoryIds = getCollectionMemoryIds(selectedCollection);

      filtered = filtered.filter((memory) => {
        const memoryId = memory?.id || memory?._id || memory?.clientMemoryId;

        return collectionMemoryIds.has(String(memoryId));
      });
    }

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
    advancedFilters,
    collections,
    getMemoryTime,
    getTimelineTime,
  ]);

  const favoriteCount = useMemo(
    () => memories.filter((memory) => memory.favorite === true).length,
    [memories],
  );

  const handleMemoryPress = useCallback(
    (memoryId) => {
      navigation.navigate("MemoryDetails", {
        memoryId,
      });
    },
    [navigation],
  );

  const handleCreateMemory = useCallback(() => {
    navigation.navigate("Create");
  }, [navigation]);

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

  const handleOpenAdvancedSearch = useCallback(() => {
    advancedSearchRef.current?.open();
  }, []);

  const handleCloseAdvancedSearch = useCallback(() => {
  }, []);

  const handleApplyAdvancedSearch = useCallback((nextFilters) => {
    setAdvancedFilters({
      ...DEFAULT_ADVANCED_FILTERS,
      ...nextFilters,
      searchIn: Array.isArray(nextFilters?.searchIn)
        ? [...nextFilters.searchIn]
        : [...DEFAULT_ADVANCED_FILTERS.searchIn],
    });

    advancedSearchRef.current?.close();
  }, []);

  const handleOpenTimeline = useCallback(() => {
    timelineSheetRef.current?.open();
  }, []);

  const handleApplyTimelineMonth = useCallback((month) => {
    setTimelineMonth(month);
  }, []);

  const handleClearTimeline = useCallback(() => {
    setTimelineMonth(null);
  }, []);

  const handleCloseTimeline = useCallback(() => {
  }, []);

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
        onOpenAdvancedSearch={handleOpenAdvancedSearch}
        advancedFilterCount={advancedFilterCount}
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
      handleOpenAdvancedSearch,
      advancedFilterCount,
    ],
  );

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

  const keyExtractor = useCallback(
    (item, index) =>
      String(item.id || item.clientMemoryId || `memory-${index}`),
    [],
  );

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

      <AdvancedSearch
        ref={advancedSearchRef}
        filters={advancedFilters}
        onClose={handleCloseAdvancedSearch}
        onApply={handleApplyAdvancedSearch}
        availableTags={availableTags}
        collections={collections}
      />

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
