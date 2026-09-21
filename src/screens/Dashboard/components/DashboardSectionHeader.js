import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../dashboardStyles";

function DashboardSectionHeader({ title, onPress, actionLabel = "See all" }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {onPress && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPress}
          style={styles.sectionAction}
        >
          <Text style={styles.sectionActionText}>{actionLabel}</Text>

          <Ionicons name="chevron-forward" size={15} color="#34345C" />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default React.memo(DashboardSectionHeader);
