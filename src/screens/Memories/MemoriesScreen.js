import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useMemory } from "../../hooks/useMemory";
import MemoryTicket from "../../components/MemoryTicket/MemoryTicket";

import styles from "./memoriesStyles";

function MemoriesScreen({ navigation, route }) {
  const { memories, loading, updateMemory } = useMemory();

  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);

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
  }, [memories, filter, sortOrder]);

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

        {/* COLLECTION STATS */}

        <View style={styles.collectionCard}>
          <View style={styles.collectionIcon}>
            <Ionicons name="ticket-outline" size={25} color="#FFFFFF" />
          </View>

          <View style={styles.collectionInfo}>
            <Text style={styles.collectionNumber}>{memories.length}</Text>

            <Text style={styles.collectionLabel}>MEMORY TICKETS</Text>
          </View>

          <View style={styles.favoriteStat}>
            <Ionicons name="heart" size={16} color="#E76F51" />

            <Text style={styles.favoriteStatNumber}>{favoriteCount}</Text>
          </View>

          <View style={styles.collectionDecor}>
            <View style={styles.decorCircleOne} />

            <View style={styles.decorCircleTwo} />
          </View>
        </View>

        {/* FILTERS */}

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={
              filter === "all" ? styles.filterButtonActive : styles.filterButton
            }
            onPress={() => setFilter("all")}
            activeOpacity={0.8}
          >
            <Text
              style={
                filter === "all" ? styles.filterTextActive : styles.filterText
              }
            >
              ALL
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              filter === "favorites"
                ? styles.filterButtonActive
                : styles.filterButton
            }
            onPress={() => setFilter("favorites")}
            activeOpacity={0.8}
          >
            <Text
              style={
                filter === "favorites"
                  ? styles.filterTextActive
                  : styles.filterText
              }
            >
              FAVORITES
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              filter === "recent"
                ? styles.filterButtonActive
                : styles.filterButton
            }
            onPress={() => setFilter("recent")}
            activeOpacity={0.8}
          >
            <Text
              style={
                filter === "recent"
                  ? styles.filterTextActive
                  : styles.filterText
              }
            >
              RECENT
            </Text>
          </TouchableOpacity>

          {/* SORT */}

          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setShowSortMenu((previous) => !previous)}
            activeOpacity={0.8}
          >
            <Ionicons name="swap-vertical" size={16} color="#707080" />

            <Text style={styles.sortText}>SORT</Text>
          </TouchableOpacity>
        </View>

        {/* SORT MENU */}

        {showSortMenu && (
          <View style={styles.sortMenu}>
            <Text style={styles.sortMenuTitle}>SORT BY</Text>

            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => {
                setSortOrder("newest");
                setShowSortMenu(false);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-down" size={16} color="#34345C" />

              <Text style={styles.sortOptionText}>NEWEST FIRST</Text>

              {sortOrder === "newest" && (
                <Ionicons name="checkmark" size={18} color="#E76F51" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => {
                setSortOrder("oldest");
                setShowSortMenu(false);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-up" size={16} color="#34345C" />

              <Text style={styles.sortOptionText}>OLDEST FIRST</Text>

              {sortOrder === "oldest" && (
                <Ionicons name="checkmark" size={18} color="#E76F51" />
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* CURRENT VIEW */}

        <View style={styles.viewHeader}>
          <Text style={styles.viewTitle}>{getFilterLabel()}</Text>

          <Text style={styles.viewCount}>
            {displayedMemories.length}{" "}
            {displayedMemories.length === 1 ? "TICKET" : "TICKETS"}
          </Text>
        </View>

        {/* LOADING */}

        {loading ? (
          <View style={styles.emptyState}>
            <Ionicons name="hourglass-outline" size={30} color="#34345C" />

            <Text style={styles.emptyTitle}>Loading memories...</Text>
          </View>
        ) : displayedMemories.length === 0 ? (
          /* EMPTY STATE */

          <View style={styles.emptyState}>
            <View style={styles.emptyTicket}>
              <View style={styles.emptyTicketTop}>
                <Ionicons
                  name={
                    filter === "favorites" ? "heart-outline" : "ticket-outline"
                  }
                  size={28}
                  color="#34345C"
                />
              </View>

              <View style={styles.emptyTicketLine} />

              <View style={styles.emptyTicketBody}>
                <View style={styles.emptyTicketTextLine} />

                <View style={styles.emptyTicketTextLineShort} />
              </View>
            </View>

            <Text style={styles.emptyTitle}>
              {filter === "favorites"
                ? "No favorite memories"
                : filter === "recent"
                  ? "No recent memories"
                  : "Your collection is empty"}
            </Text>

            <Text style={styles.emptyDescription}>
              {filter === "favorites"
                ? "Tap the heart on a memory to add it to your favorites."
                : filter === "recent"
                  ? "Memories created within the last 30 days will appear here."
                  : "Every great collection starts with one memory. Capture yours and turn it into a ticket."}
            </Text>

            {filter === "all" && (
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate("Create")}
                activeOpacity={0.85}
              >
                <Ionicons name="camera-outline" size={19} color="#FFFFFF" />

                <Text style={styles.createButtonText}>CREATE FIRST MEMORY</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          /* MEMORY TICKETS */

          <View style={styles.memoriesList}>
            {displayedMemories.map((memory) => (
              <View key={memory.id} style={styles.memoryTicketWrapper}>
                <MemoryTicket
                  memory={memory}
                  compact={true}
                  onPress={() =>
                    navigation.navigate("MemoryDetails", {
                      memoryId: memory.id,
                    })
                  }
                />

                {/* FAVORITE BUTTON */}

                <TouchableOpacity
                  style={styles.ticketFavoriteButton}
                  onPress={() => toggleFavorite(memory)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={memory.favorite ? "heart" : "heart-outline"}
                    size={20}
                    color={memory.favorite ? "#E76F51" : "#34345C"}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* FOOTER */}

        <Text style={styles.footerText}>KEEP THE MOMENT. KEEP THE STORY.</Text>
      </ScrollView>
    </View>
  );
}

export default MemoriesScreen;
