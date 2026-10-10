import React from "react";

import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "./searchBarStyles";

function SearchBar({
  value = "",
  onChangeText,
  placeholder = "Search memories...",
  onAdvancedPress,
  advancedFilterCount = 0,
  theme,
  isDark,
}) {
  const searchValue = value || "";
  const colors = theme?.colors || {};

  const surfaceColor =
    colors.surface || colors.card || (isDark ? "#232333" : "#FFFFFF");

  const textColor = colors.text || (isDark ? "#F1F0F6" : "#242424");

  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#7E7E88");

  const placeholderColor =
    colors.placeholder || (isDark ? "#88889C" : "#9A9AA3");

  const borderColor = colors.border || (isDark ? "#38384C" : "#D9D8E2");

  const primaryColor = colors.primary || "#34345C";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: surfaceColor,
          borderColor,
        },
      ]}
    >
      <Ionicons name="search-outline" size={17} color={mutedTextColor} />

      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            backgroundColor: "transparent",
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={searchValue}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        selectionColor={primaryColor}
      />

      {/* CLEAR SEARCH */}

      {searchValue.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onChangeText("")}
          activeOpacity={0.7}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Ionicons
            name="close-circle-outline"
            size={17}
            color={mutedTextColor}
          />
        </TouchableOpacity>
      )}

      {/* ADVANCED SEARCH */}

      {onAdvancedPress && (
        <TouchableOpacity
          style={searchBarExtraStyles.advancedButton}
          onPress={onAdvancedPress}
          activeOpacity={0.7}
          hitSlop={4}
          accessibilityRole="button"
          accessibilityLabel="Advanced search filters"
        >
          <Ionicons
            name={advancedFilterCount > 0 ? "options" : "options-outline"}
            size={17}
            color={primaryColor}
          />

          {advancedFilterCount > 0 && (
            <View
              style={[
                searchBarExtraStyles.badge,
                {
                  backgroundColor: primaryColor,
                },
              ]}
            >
              <Text style={searchBarExtraStyles.badgeText}>
                {advancedFilterCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const searchBarExtraStyles = StyleSheet.create({
  advancedButton: {
    width: 28,
    height: 28,
    marginLeft: 3,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: -2,
    right: -3,
    minWidth: 15,
    height: 15,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: "#34345C",
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "800",
  },
});

export default SearchBar;
