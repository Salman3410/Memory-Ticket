import React, { useCallback, useEffect } from "react";

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useCollection } from "../../hooks/useCollection";

import CollectionCard from "../../components/collections/CollectionCard";

function CollectionsScreen({ navigation }) {
  const { collections, loading, refreshCollections } = useCollection();

  useEffect(() => {
    refreshCollections();
  }, [refreshCollections]);

  const handleCreateCollection = useCallback(() => {
    navigation.navigate("CreateCollection");
  }, [navigation]);

  const handleCollectionPress = useCallback(
    (collection) => {
      const collectionId = collection?._id || collection?.id;

      if (!collectionId) {
        return;
      }

      navigation.navigate("CollectionDetails", {
        collectionId,
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <View style={styles.cardWrapper}>
          <CollectionCard
            collection={item}
            onPress={() => handleCollectionPress(item)}
          />
        </View>
      );
    },
    [handleCollectionPress],
  );

  const keyExtractor = useCallback(
    (item, index) => String(item?._id || item?.id || index),
    [],
  );

  const renderEmpty = useCallback(() => {
    if (loading) {
      return null;
    }

    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>+</Text>
        </View>

        <Text style={styles.emptyTitle}>Your story needs a place</Text>

        <Text style={styles.emptyText}>
          Create a collection to bring related memories together.
        </Text>

        <TouchableOpacity
          style={styles.emptyButton}
          onPress={handleCreateCollection}
          activeOpacity={0.85}
        >
          <Text style={styles.emptyButtonText}>Create Collection</Text>
        </TouchableOpacity>
      </View>
    );
  }, [loading, handleCreateCollection]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Collections</Text>

          <Text style={styles.subtitle}>Keep your memories together</Text>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateCollection}
          activeOpacity={0.85}
        >
          <Text style={styles.createIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {!loading && collections.length > 0 ? (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            {collections.length}{" "}
            {collections.length === 1 ? "collection" : "collections"}
          </Text>

          <Text style={styles.summaryHint}>Swipe down to refresh</Text>
        </View>
      ) : null}

      {loading && collections.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34345C" />

          <Text style={styles.loadingText}>Loading collections...</Text>
        </View>
      ) : (
        <FlatList
          data={collections}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={
            collections.length > 1 ? styles.columnWrapper : undefined
          }
          contentContainerStyle={
            collections.length === 0 ? styles.emptyList : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading && collections.length > 0}
              onRefresh={refreshCollections}
              tintColor="#34345C"
            />
          }
          ListEmptyComponent={renderEmpty}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={5}
        />
      )}
    </View>
  );
}

export default CollectionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerLeft: {
    flex: 1,
    paddingRight: 15,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#242424",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: "#6B6B6B",
  },

  createButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  createIcon: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "300",
    lineHeight: 29,
  },

  summaryRow: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  summaryText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#34345C",
  },

  summaryHint: {
    fontSize: 11,
    color: "#999999",
  },

  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 30,
  },

  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },

  cardWrapper: {
    flex: 1,
    minWidth: 0,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#777777",
  },

  emptyList: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  emptyIconText: {
    color: "#FFFFFF",
    fontSize: 35,
    fontWeight: "300",
  },

  emptyTitle: {
    marginTop: 20,
    fontSize: 21,
    fontWeight: "700",
    color: "#242424",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#6B6B6B",
    textAlign: "center",
  },

  emptyButton: {
    marginTop: 22,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#34345C",
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
