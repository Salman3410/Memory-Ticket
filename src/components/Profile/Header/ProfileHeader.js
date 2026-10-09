import React from "react";

import { View, Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";

import styles from "./profileHeaderStyles";

function ProfileHeader({ onSettingsPress }) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <Text style={[styles.headerEyebrow, { color: colors.accent }]}>
          YOUR SPACE
        </Text>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Profile
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.settingsButton,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={onSettingsPress}
        activeOpacity={0.7}
      >
        <Ionicons name="settings-outline" size={21} color={colors.icon} />
      </TouchableOpacity>
    </View>
  );
}

export default ProfileHeader;
