import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./previewActionsStyles";

function PreviewActions({ onSave, onEdit }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.saveButton}
        onPress={onSave}
        activeOpacity={0.85}
      >
        <Ionicons name="bookmark-outline" size={20} color="#FFFFFF" />

        <Text style={styles.saveButtonText}>SAVE MEMORY</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.editButton}
        onPress={onEdit}
        activeOpacity={0.8}
      >
        <Ionicons name="create-outline" size={19} color="#34345C" />

        <Text style={styles.editButtonText}>EDIT</Text>
      </TouchableOpacity>
    </View>
  );
}

export default PreviewActions;
   