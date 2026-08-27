import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMemory } from "../../hooks/useMemory";

import SearchBar from "../../components/Memories/SearchBar/SearchBar";
import CollectionStats from "../../components/Memories/CollectionStats/CollectionStats";
import MemoryFilters from "../../components/Memories/MemoryFilters/MemoryFilters";
import EmptyMemoryState from "../../components/Memories/EmptyMemoryState/EmptyMemoryState";
import MemoryTicketList from "../../components/Memories/MemoryTicketList/MemoryTicketList";

import styles from "./memoriesStyles";

function MemoriesScreen({ navigation, route }) {
  const { memories, loading, updateMemory } = useMemory();

  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --------------------------------------------------
  // HANDLE NAVIGATION FILTER
  // --------------------------------------------------

  useEffect(() => {
    if (route?.params?.filter) {
      setFilter(route.params.filter);
    }
  }, [route?.params?.filter]);

  // --------------------------------------------------
  // GET MEMORY DATE
  // --------------------------------------------------

  const getMemoryTime = (memory) => {
    const dateValue = memory.createdAt || memory.date;

    if (!dateValue) {
      return 0;
    }

    const time = new Date(dateValue).getTime();

    return Number.isNaN(time) ? 0 : time;
  };

  // --------------------------------------------------
  // DISPLAYED MEMORIES
  // --------------------------------------------------

  const displayedMemories = useMemo(() => {
    let filtered = [...memories];

    // SEARCH

    const query = searchQuery.trim().toLowerCase();

    if (query) {
      filtered = filtered.filter((memory) => {
        const searchableText = [
          memory.title,
          memory.description,
          memory.location,
          memory.category,
          memory.date,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    // FILTER

    if (filter === "favorites") {
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

    // SORT

    filtered.sort((a, b) => {
      const dateA = getMemoryTime(a);
      const dateB = getMemoryTime(b);

      if (sortOrder === "newest") {
        return dateB - dateA;
      }

      return dateA - dateB;
    });

    return filtered;
  }, [memories, filter, sortOrder, searchQuery]);

  // --------------------------------------------------
  // FAVORITE COUNT
  // --------------------------------------------------

  const favoriteCount = useMemo(() => {
    return memories.filter((memory) => memory.favorite === true).length;
  }, [memories]);

  // --------------------------------------------------
  // TOGGLE FAVORITE
  // --------------------------------------------------

  const toggleFavorite = async (memory) => {
    try {
      await updateMemory(memory.id, {
        favorite: !memory.favorite,
      });
    } catch (error) {
      console.log("Favorite error:", error);
    }
  };

  // --------------------------------------------------
  // FILTER LABEL
  // --------------------------------------------------

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

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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

        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* COLLECTION STATS */}

        <CollectionStats
          memoryCount={memories.length}
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
          <Text style={styles.viewTitle}>{getFilterLabel()}</Text>

          <Text style={styles.viewCount}>
            {displayedMemories.length}{" "}
            {displayedMemories.length === 1 ? "TICKET" : "TICKETS"}
          </Text>
        </View>

        {/* CONTENT */}

        {loading ? (
          <View style={styles.loadingState}>
            <Ionicons name="hourglass-outline" size={30} color="#34345C" />

            <Text style={styles.loadingTitle}>Loading memories...</Text>
          </View>
        ) : displayedMemories.length === 0 ? (
          <EmptyMemoryState
            filter={filter}
            searchQuery={searchQuery}
            onCreateMemory={() => navigation.navigate("Create")}
          />
        ) : (
          <MemoryTicketList
            memories={displayedMemories}
            onMemoryPress={(memoryId) =>
              navigation.navigate("MemoryDetails", {
                memoryId,
              })
            }
            onToggleFavorite={toggleFavorite}
          />
        )}

        {/* FOOTER */}

        <Text style={styles.footerText}>KEEP THE MOMENT. KEEP THE STORY.</Text>
      </ScrollView>
    </View>
  );
}

export default MemoriesScreen;
