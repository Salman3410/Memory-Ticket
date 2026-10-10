import React from "react";

import { View, Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "../createMemoryStyles";

function CreateMemoryHeader({ navigation, theme, isDark }) {
  const colors = theme?.colors || {};

  const backgroundColor = colors.background || (isDark ? "#171724" : "#F1F0F6");

  const surfaceColor =
    colors.surface || colors.card || (isDark ? "#232333" : "#FFFFFF");

  const textColor = colors.text || (isDark ? "#F1F0F6" : "#242424");

  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#737387");

  const borderColor = colors.border || (isDark ? "#38384C" : "#D9D8E2");

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.backButton,
          {
            backgroundColor: surfaceColor,
            borderColor,
          },
        ]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={22} color={textColor} />
      </TouchableOpacity>

      <View style={styles.headerTitleContainer}>
        <Text
          style={[
            styles.headerEyebrow,
            {
              color: mutedTextColor,
            },
          ]}
        >
          CREATE MEMORY
        </Text>

        <Text
          style={[
            styles.headerTitle,
            {
              color: textColor,
            },
          ]}
        >
          New Memory
        </Text>
      </View>

      <View style={styles.headerSpacer} />
    </View>
  );
}

export default CreateMemoryHeader;
