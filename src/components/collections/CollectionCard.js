import React, { memo } from "react";

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function CollectionCard({ collection, onPress }) {
  const coverImage =
    collection?.coverMemoryId?.images?.[0] ||
    collection?.coverMemoryId?.image ||
    null;

  const memoryCount = collection?.memoryCount || 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <View style={styles.coverContainer}>
        {coverImage ? (
          <Image
            source={{ uri: coverImage }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <View style={styles.placeholderMark}>
              <Text style={styles.placeholderMarkText}>M</Text>
            </View>

            <Text style={styles.placeholderText}>Memento</Text>
          </View>
        )}

        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{memoryCount}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {collection?.name || "Untitled Collection"}
        </Text>

        {collection?.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {collection.description}
          </Text>
        ) : (
          <Text style={styles.noDescription} numberOfLines={1}>
            No description
          </Text>
        )}

        <Text style={styles.memoryText}>
          {memoryCount} {memoryCount === 1 ? "memory" : "memories"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default memo(CollectionCard);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  coverContainer: {
    height: 145,
    position: "relative",
    overflow: "hidden",
  },

  coverImage: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9E8F1",
  },

  placeholderMark: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  placeholderMarkText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  placeholderText: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "600",
    color: "#34345C",
  },

  countBadge: {
    position: "absolute",
    right: 10,
    bottom: 10,
    minWidth: 30,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(36, 36, 36, 0.72)",
  },

  countBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  content: {
    padding: 13,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#242424",
  },

  description: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 17,
    color: "#666666",
  },

  noDescription: {
    marginTop: 5,
    fontSize: 12,
    color: "#A0A0A0",
  },

  memoryText: {
    marginTop: 9,
    fontSize: 12,
    fontWeight: "600",
    color: "#34345C",
  },
});
