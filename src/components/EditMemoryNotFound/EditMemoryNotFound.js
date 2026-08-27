import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./editMemoryNotFoundStyles";

function EditMemoryNotFound({ onBack }) {
  return (
    <View style={styles.notFoundContainer}>
      <Ionicons name="sad-outline" size={45} color="#34345C" />

      <Text style={styles.notFoundTitle}>Memory not found</Text>

      <TouchableOpacity style={styles.backButtonLarge} onPress={onBack}>
        <Text style={styles.backButtonText}>GO BACK</Text>
      </TouchableOpacity>
    </View>
  );
}

export default EditMemoryNotFound;
