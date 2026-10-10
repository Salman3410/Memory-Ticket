import React from "react";

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
  theme,
  isDark,
}) {
  const colors = theme?.colors || {};

  const backgroundColor = colors.background || (isDark ? "#171724" : "#F1F0F6");

  const surfaceColor =
    colors.surface || colors.card || (isDark ? "#232333" : "#FFFFFF");

  const textColor = colors.text || (isDark ? "#F1F0F6" : "#242424");

  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#707080");

  const borderColor = colors.border || (isDark ? "#38384C" : "#D9D8E2");

  const primaryColor = colors.primary || "#34345C";

  const accentColor = colors.accent || "#E76F51";

  const getFilterButtonStyle = (isActive) => [
    isActive ? styles.filterButtonActive : styles.filterButton,
    {
      backgroundColor: isActive ? primaryColor : surfaceColor,
      borderColor: isActive ? primaryColor : borderColor,
    },
  ];

  const getFilterTextStyle = (isActive) => [
    isActive ? styles.filterTextActive : styles.filterText,
    {
      color: isActive ? "#FFFFFF" : textColor,
    },
  ];

  return (
    <>
      {/* FILTERS */}

      <View
        style={[
          styles.filterRow,
          {
            backgroundColor,
          },
        ]}
      >
        {/* ALL */}

        <TouchableOpacity
          style={getFilterButtonStyle(filter === "all")}
          onPress={() => setFilter("all")}
          activeOpacity={0.8}
        >
          <Text style={getFilterTextStyle(filter === "all")}>ALL</Text>
        </TouchableOpacity>

        {/* FAVORITES */}

        <TouchableOpacity
          style={getFilterButtonStyle(filter === "favorites")}
          onPress={() => setFilter("favorites")}
          activeOpacity={0.8}
        >
          <Text style={getFilterTextStyle(filter === "favorites")}>
            FAVORITES
          </Text>
        </TouchableOpacity>

        {/* RECENT */}

        <TouchableOpacity
          style={getFilterButtonStyle(filter === "recent")}
          onPress={() => setFilter("recent")}
          activeOpacity={0.8}
        >
          <Text style={getFilterTextStyle(filter === "recent")}>RECENT</Text>
        </TouchableOpacity>

        {/* SORT */}

        <TouchableOpacity
          style={[
            styles.sortButton,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
          onPress={() => setShowSortMenu((previous) => !previous)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Sort memories"
        >
          <Ionicons name="swap-vertical" size={16} color={primaryColor} />

          <Text
            style={[
              styles.sortText,
              {
                color: textColor,
              },
            ]}
          >
            SORT
          </Text>
        </TouchableOpacity>
      </View>

      {/* SORT MENU */}

      {showSortMenu && (
        <View
          style={[
            styles.sortMenu,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          <Text
            style={[
              styles.sortMenuTitle,
              {
                color: mutedTextColor,
              },
            ]}
          >
            SORT BY
          </Text>

          {/* NEWEST FIRST */}

          <TouchableOpacity
            style={[
              styles.sortOption,
              {
                backgroundColor: surfaceColor,
              },
            ]}
            onPress={() => {
              setSortOrder("newest");
              setShowSortMenu(false);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-down" size={16} color={primaryColor} />

            <Text
              style={[
                styles.sortOptionText,
                {
                  color: textColor,
                },
              ]}
            >
              NEWEST FIRST
            </Text>

            {sortOrder === "newest" && (
              <Ionicons name="checkmark" size={18} color={accentColor} />
            )}
          </TouchableOpacity>

          {/* OLDEST FIRST */}

          <TouchableOpacity
            style={[
              styles.sortOption,
              {
                backgroundColor: surfaceColor,
              },
            ]}
            onPress={() => {
              setSortOrder("oldest");
              setShowSortMenu(false);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-up" size={16} color={primaryColor} />

            <Text
              style={[
                styles.sortOptionText,
                {
                  color: textColor,
                },
              ]}
            >
              OLDEST FIRST
            </Text>

            {sortOrder === "oldest" && (
              <Ionicons name="checkmark" size={18} color={accentColor} />
            )}
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

export default MemoryFilters;
