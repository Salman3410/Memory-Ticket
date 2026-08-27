import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./logoutButtonStyles";

function LogoutButton({ onPress }) {
  return (
    <TouchableOpacity
      style={styles.logoutButton}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Ionicons name="log-out-outline" size={19} color="#D9534F" />

      <Text style={styles.logoutText}>LOG OUT</Text>
    </TouchableOpacity>
  );
}

export default LogoutButton;
