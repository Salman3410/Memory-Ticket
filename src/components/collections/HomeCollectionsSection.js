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
    (item, index) => String(item?._id || item?.id || index),
    [],
  );

  return (
    <View style={styles.container}>
      {/* SECTION HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>YOUR STORIES</Text>

          <Text style={styles.title}>Collections</Text>
        </View>

        <View style={styles.headerActions}>
          {collections.length > 0 ? (
            <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.addButton}
            onPress={onCreate}
            activeOpacity={0.85}
          >
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* EMPTY STATE */}
      {collections.length === 0 ? (
        <TouchableOpacity
          style={styles.emptyTicket}
          onPress={onCreate}
          activeOpacity={0.9}
        >
          <View style={styles.emptyTop}>
            <View style={styles.emptyMark}>
              <Text style={styles.emptyPlus}>+</Text>
            </View>

            <View style={styles.emptyTopText}>
              <Text style={styles.emptyLabel}>NEW COLLECTION</Text>

              <Text style={styles.emptyTitle}>Give your memories a place</Text>

              <Text style={styles.emptyDescription}>
                Bring related moments together.
              </Text>
            </View>
          </View>

          <View style={styles.emptyDivider}>
            <View style={styles.emptyDash} />
          </View>

          <View style={styles.emptyFooter}>
            <Text style={styles.emptyBrand}>MEMENTO</Text>

            <View style={styles.emptyBarcode}>
              {[5, 2, 4, 3, 6, 2].map((width, index) => (
                <View key={index} style={[styles.emptyBar, { width }]} />
              ))}
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        /* COLLECTION PREVIEWS */
        <FlatList
          horizontal
          data={collections}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

export default memo(HomeCollectionsSection);

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
  },

  header: {
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  eyebrow: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#E76F51",
  },

  title: {
    marginTop: 3,
    fontSize: 20,
    fontWeight: "800",
    color: "#242424",
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  viewAll: {
    fontSize: 12,
    fontWeight: "700",
    color: "#34345C",
  },

  addButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  addText: {
    marginTop: -2,
    fontSize: 23,
    fontWeight: "300",
    color: "#FFFFFF",
  },

  listContent: {
    paddingRight: 20,
  },

  item: {
    width: 180,
    marginRight: 12,
  },

  /* EMPTY TICKET */

  emptyTicket: {
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },

  emptyTop: {
    minHeight: 105,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  emptyMark: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  emptyPlus: {
    marginTop: -2,
    fontSize: 28,
    fontWeight: "300",
    color: "#FFFFFF",
  },

  emptyTopText: {
    flex: 1,
    marginLeft: 13,
  },

  emptyLabel: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#E76F51",
  },

  emptyTitle: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "800",
    color: "#242424",
  },

  emptyDescription: {
    marginTop: 3,
    fontSize: 11,
    color: "#737373",
  },

  emptyDivider: {
    height: 14,
    paddingHorizontal: 16,
    justifyContent: "center",
  },

  emptyDash: {
    borderTopWidth: 1,
    borderTopColor: "#CFCED8",
    borderStyle: "dashed",
  },

  emptyFooter: {
    paddingHorizontal: 15,
    paddingBottom: 12,
    paddingTop: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  emptyBrand: {
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: "#9A99A2",
  },

  emptyBarcode: {
    height: 16,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 2,
  },

  emptyBar: {
    height: "100%",
    backgroundColor: "#34345C",
  },
});
