import React from "react";

import { View, Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "./editMemoryNotFoundStyles";

function EditMemoryNotFound({ onBack, theme, isDark }) {
  const colors = theme?.colors || {};

  const backgroundColor = colors.background || (isDark ? "#171724" : "#F1F0F6");

  const textColor = colors.text || (isDark ? "#F1F0F6" : "#242424");

  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#737387");

  const primaryColor = colors.primary || "#34345C";

  return (
    <View
      style={[
        styles.notFoundContainer,
        {
          backgroundColor,
        },
      ]}
    >
      <Ionicons name="sad-outline" size={45} color={primaryColor} />

      <Text
        style={[
          styles.notFoundTitle,
          {
            color: textColor,
          },
        ]}
      >
        Memory not found
      </Text>

      <Text
        style={{
          color: mutedTextColor,
          fontSize: 12,
          textAlign: "center",
          marginTop: 6,
          marginBottom: 18,
        }}
      >
        This memory may have been deleted or is no longer available.
      </Text>

      <TouchableOpacity
        style={[
          styles.backButtonLarge,
          {
            backgroundColor: primaryColor,
          },
        ]}
        onPress={onBack}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text
          style={[
            styles.backButtonText,
            {
              color: "#FFFFFF",
            },
          ]}
        >
          GO BACK
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default EditMemoryNotFound;
