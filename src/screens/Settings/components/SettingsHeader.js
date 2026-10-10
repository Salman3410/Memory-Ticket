import React from "react";

import { View, Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";

import styles from "../settingsStyles";

function SettingsHeader({ navigation }) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={[
          styles.backButton,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={21} color={colors.icon} />
      </TouchableOpacity>

      <View style={styles.headerText}>
        <Text style={[styles.headerEyebrow, { color: colors.accent }]}>
          APP PREFERENCES
        </Text>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Settings
        </Text>
      </View>
    </View>
  );
}

export default SettingsHeader;
