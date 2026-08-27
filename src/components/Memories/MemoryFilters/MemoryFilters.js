import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./memoryFiltersStyles";

function MemoryFilters({
  filter,
  setFilter,
  sortOrder,
  setSortOrder,
  showSortMenu,
  setShowSortMenu,
}) {
  return (
    <>
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
              filter === "recent" ? styles.filterTextActive : styles.filterText
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
    </>
  );
}

export default MemoryFilters;
