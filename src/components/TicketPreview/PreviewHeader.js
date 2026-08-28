import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./previewHeaderStyles";

function PreviewHeader({ onBack }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={21} color="#242424" />
      </TouchableOpacity>

      <View style={styles.headerTextContainer}>
        <Text style={styles.headerEyebrow}>YOUR MEMORY</Text>
        <Text style={styles.headerTitle}>Ticket Preview</Text>
      </View>

      <View style={styles.headerSpacer} />
    </View>
  );
}

export default PreviewHeader;
  