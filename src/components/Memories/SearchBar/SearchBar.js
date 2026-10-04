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
      <Ionicons name="search-outline" size={17} color="#7E7E88" />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9A9AA3"
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
          hitSlop={6}
        >
          <Ionicons name="close-circle-outline" size={17} color="#7E7E88" />
        </TouchableOpacity>
      )}

      {onAdvancedPress && (
        <TouchableOpacity
          style={searchBarExtraStyles.advancedButton}
          onPress={onAdvancedPress}
          activeOpacity={0.7}
          hitSlop={4}
        >
          <Ionicons
            name={advancedFilterCount > 0 ? "options" : "options-outline"}
            size={17}
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
