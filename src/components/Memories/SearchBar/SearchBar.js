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
}) {
  const searchValue = value || "";

  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color="#707080" />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9999A8"
        value={searchValue}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />

      {searchValue.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onChangeText("")}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle" size={20} color="#707080" />
        </TouchableOpacity>
      )}

      {onAdvancedPress && (
        <TouchableOpacity
          style={searchBarExtraStyles.advancedButton}
          onPress={onAdvancedPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={advancedFilterCount > 0 ? "options" : "options-outline"}
            size={20}
            color="#34345C"
          />

          {advancedFilterCount > 0 && (
            <View style={searchBarExtraStyles.badge}>
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
    width: 34,
    height: 34,
    marginLeft: 4,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: 0,
    right: 0,
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
    fontSize: 9,
    fontWeight: "700",
  },
});

export default SearchBar;
