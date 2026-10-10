import React from "react";

import { View, Text, TextInput } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "../createMemoryStyles";

function MemoryForm({
  title,
  setTitle,
  location,
  setLocation,
  onLocationPress,
  theme,
  isDark,
}) {
  const colors = theme?.colors || {};

  const textColor = colors.text || (isDark ? "#F1F0F6" : "#242424");

  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#7E7E88");

  const placeholderColor =
    colors.placeholder || (isDark ? "#88889C" : "#9A9AA3");

  const surfaceColor =
    colors.surface || colors.card || (isDark ? "#232333" : "#FFFFFF");

  const borderColor = colors.border || (isDark ? "#38384C" : "#D9D8E2");

  const accentColor = colors.primary || colors.accent || "#E76F51";

  return (
    <>
      {/* MEMORY TITLE */}

      <View style={styles.inputGroup}>
        <Text
          style={[
            styles.label,
            {
              color: textColor,
            },
          ]}
        >
          MEMORY TITLE
        </Text>

        <View
          style={[
            styles.inputWithIcon,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          <Ionicons name="text-outline" size={17} color={mutedTextColor} />

          <TextInput
            style={[
              styles.iconInput,
              {
                backgroundColor: "transparent",
                color: textColor,
              },
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder="Give this moment a name"
            placeholderTextColor={placeholderColor}
            autoCapitalize="sentences"
            autoCorrect={false}
            selectionColor={accentColor}
          />
        </View>
      </View>

      {/* LOCATION */}

      <View style={styles.inputGroup}>
        <Text
          style={[
            styles.label,
            {
              color: textColor,
            },
          ]}
        >
          LOCATION
        </Text>

        <View
          style={[
            styles.inputWithIcon,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          <Ionicons name="location-outline" size={17} color={mutedTextColor} />

          <TextInput
            style={[
              styles.iconInput,
              {
                backgroundColor: "transparent",
                color: textColor,
              },
            ]}
            value={location}
            onChangeText={setLocation}
            onFocus={onLocationPress}
            placeholder="Where did it happen?"
            placeholderTextColor={placeholderColor}
            autoCapitalize="sentences"
            autoCorrect={false}
            selectionColor={accentColor}
          />
        </View>
      </View>
    </>
  );
}

export default MemoryForm;
