import React, { memo } from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function CollectionPreviewCard({
  collection,
  onPress,
}) {
  const memoryCount =
    collection?.memoryCount || 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>
          ✦
        </Text>
      </View>

      <Text
        style={styles.name}
        numberOfLines={1}
      >
        {collection?.name ||
          "Untitled Collection"}
      </Text>

      <Text style={styles.count}>
        {memoryCount}{" "}
        {memoryCount === 1
          ? "memory"
          : "memories"}
      </Text>
    </TouchableOpacity>
  );
}

export default memo(CollectionPreviewCard);

const styles = StyleSheet.create({
  card: {
    width: 155,
    minHeight: 135,
    padding: 14,
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F0F6",
  },

  icon: {
    fontSize: 18,
    color: "#34345C",
  },

  name: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "700",
    color: "#242424",
  },

  count: {
    marginTop: 5,
    fontSize: 12,
    color: "#666666",
  },
});
