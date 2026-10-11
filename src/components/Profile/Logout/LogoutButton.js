import React from "react";

import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../../context/ThemeContext";
import styles from "./logoutButtonStyles";

function LogoutButton({ onPress }) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <TouchableOpacity
      style={[
        styles.logoutButton,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Ionicons name="log-out-outline" size={19} color={colors.danger} />

      <Text style={[styles.logoutText, { color: colors.danger }]}>LOG OUT</Text>
    </TouchableOpacity>
  );
}

export default LogoutButton;
