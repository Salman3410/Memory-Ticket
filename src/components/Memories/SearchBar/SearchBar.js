import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./searchBarStyles";

function SearchBar({
  value = "",
  onChangeText,
  placeholder = "Search memories...",
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
    </View>
  );
}

export default SearchBar;
