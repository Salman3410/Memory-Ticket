import React from "react";

import { View, Text, TextInput } from "react-native";

import styles from "../createMemoryStyles";

function DescriptionInput({ description, setDescription, theme, isDark }) {
  const colors = theme?.colors || {};

  const textColor = colors.text || (isDark ? "#F1F0F6" : "#242424");

  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#737387");

  const placeholderColor =
    colors.placeholder || (isDark ? "#88889C" : "#9A9AA3");

  const surfaceColor =
    colors.surface || colors.card || (isDark ? "#232333" : "#FFFFFF");

  const borderColor = colors.border || (isDark ? "#38384C" : "#D9D8E2");

  const accentColor = colors.primary || colors.accent || "#E76F51";

  const handleChange = (text) => {
    if (text.length <= 100) {
      setDescription(text);
    }
  };

  return (
    <View style={styles.inputGroup}>
      <View style={styles.descriptionHeader}>
        <Text
          style={[
            styles.label,
            {
              color: textColor,
            },
          ]}
        >
          DESCRIPTION
        </Text>

        <Text
          style={[
            styles.characterCount,
            {
              color: mutedTextColor,
            },
          ]}
        >
          {description.length}/100
        </Text>
      </View>

      <TextInput
        style={[
          styles.descriptionInput,
          {
            backgroundColor: surfaceColor,
            color: textColor,
            borderColor,
          },
        ]}
        value={description}
        onChangeText={handleChange}
        placeholder="Tell the story behind this moment..."
        placeholderTextColor={placeholderColor}
        multiline
        textAlignVertical="top"
        selectionColor={accentColor}
      />
    </View>
  );
}

export default DescriptionInput;
