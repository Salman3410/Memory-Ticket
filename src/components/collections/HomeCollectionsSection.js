import React, { memo, useCallback } from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CollectionPreviewCard from "./CollectionPreviewCard";

function HomeCollectionsSection({
  collections,
  onViewAll,
  onCreate,
  onCollectionPress,
}) {
  const renderItem = useCallback(
    ({ item }) => {
      return (
        <View style={styles.item}>
          <CollectionPreviewCard
            collection={item}
            onPress={() => onCollectionPress(item)}
          />
        </View>
      );
    },
    [onCollectionPress],
  );

  const keyExtractor = useCallback(
    (item, index) =>
      String(item?._id || item?.id || index),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Your Collections
        </Text>

        <TouchableOpacity
          onPress={onViewAll}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAll}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {collections.length === 0 ? (
        <TouchableOpacity
          style={styles.emptyCard}
          onPress={onCreate}
          activeOpacity={0.85}
        >
          <Text style={styles.plus}>
            +
          </Text>

          <View style={styles.emptyTextContainer}>
            <Text style={styles.emptyTitle}>
              Create a collection
            </Text>

            <Text style={styles.emptyText}>
              Organize your memories into groups.
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <FlatList
          horizontal
          data={collections}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      {collections.length > 0 ? (
        <TouchableOpacity
          style={styles.createButton}
          onPress={onCreate}
          activeOpacity={0.85}
        >
          <Text style={styles.createButtonText}>
            + Create Collection
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default memo(HomeCollectionsSection);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#242424",
  },

  viewAll: {
    fontSize: 13,
    fontWeight: "600",
    color: "#34345C",
  },

  listContent: {
    paddingRight: 20,
  },

  item: {
    width: 220,
    marginRight: 12,
  },

  emptyCard: {
    minHeight: 100,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  plus: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    textAlignVertical: "center",
    backgroundColor: "#34345C",
    color: "#FFFFFF",
    fontSize: 28,
    overflow: "hidden",
  },

  emptyTextContainer: {
    flex: 1,
    marginLeft: 14,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#242424",
  },

  emptyText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: "#666666",
  },

  createButton: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  createButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#34345C",
  },
});
