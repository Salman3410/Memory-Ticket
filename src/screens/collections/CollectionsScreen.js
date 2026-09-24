import React, { useCallback } from "react";

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useCollection } from "../../hooks/useCollection";
import useRefresh from "../../hooks/useRefresh";

import CollectionCardComponent from "../../components/collections/CollectionCard";

function CollectionsScreen({ navigation }) {
  const { collections, loading, refreshCollections } = useCollection();

  // --------------------------------------------------
  // REFRESH
  // --------------------------------------------------

  const refreshCollectionsScreen = useCallback(async () => {
    await refreshCollections();
  }, [refreshCollections]);

  const { refreshing, onRefresh } = useRefresh(refreshCollectionsScreen);

  // --------------------------------------------------
  // GO BACK
  // --------------------------------------------------

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // --------------------------------------------------
  // CREATE COLLECTION
  // --------------------------------------------------

  const handleCreateCollection = useCallback(() => {
    navigation.navigate("CreateCollection");
  }, [navigation]);

  // --------------------------------------------------
  // COLLECTION PRESS
  // --------------------------------------------------

  const handleCollectionPress = useCallback(
    (collection) => {
      const collectionId = collection?._id || collection?.id;

      if (!collectionId) {
        console.warn("Collection ID missing:", collection);

        return;
      }

      navigation.navigate("CollectionDetails", {
        collectionId,
      });
    },
    [navigation],
  );

  // --------------------------------------------------
  // RENDER ITEM
  // --------------------------------------------------

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <CollectionCardComponent
          collection={item}
          onPress={() => handleCollectionPress(item)}
        />
      );
    },
    [handleCollectionPress],
  );

  // --------------------------------------------------
  // KEY EXTRACTOR
  // --------------------------------------------------

  const keyExtractor = useCallback(
    (item, index) => String(item?._id || item?.id || index),
    [],
  );

  // --------------------------------------------------
  // EMPTY STATE
  // --------------------------------------------------

  const renderEmpty = useCallback(() => {
    if (loading) {
      return null;
    }

    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyMark}>
          <Text style={styles.emptyMarkText}>+</Text>
        </View>

        <Text style={styles.emptyTitle}>Give your memories a place</Text>

        <Text style={styles.emptyText}>
          Create a collection for trips, people, events, or anything you want to
          remember together.
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

  // --------------------------------------------------
  // SCREEN
  // --------------------------------------------------

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color="#34345C" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.eyebrow}>YOUR STORIES</Text>

            <Text style={styles.title}>Collections</Text>

            <Text style={styles.subtitle}>
              Keep moments that belong together.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateCollection}
          activeOpacity={0.85}
        >
          <Text style={styles.createButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* SUMMARY */}

      {!loading && collections.length > 0 ? (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            {collections.length}{" "}
            {collections.length === 1 ? "collection" : "collections"}
          </Text>

          <Text style={styles.summaryHint}>Your memories, together</Text>
        </View>
      ) : null}

      {/* INITIAL LOADING */}

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
          // ------------------------------
          // PULL TO REFRESH
          // ------------------------------

          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#34345C"
              colors={["#34345C"]}
              progressBackgroundColor="#FFFFFF"
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
    paddingTop: 40,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 38,
    height: 38,
    marginRight: 12,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  headerContent: {
    flex: 1,
    paddingRight: 14,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#E76F51",
  },

  title: {
    marginTop: 5,
    fontSize: 30,
    fontWeight: "700",
    color: "#242424",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: "#737373",
  },

  createButton: {
    width: 46,
    height: 46,
    marginLeft: 10,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  createButtonText: {
    marginTop: -2,
    fontSize: 27,
    fontWeight: "300",
    color: "#FFFFFF",
  },

  summaryRow: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  summaryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#34345C",
  },

  summaryHint: {
    fontSize: 11,
    color: "#9A9A9A",
  },

  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 32,
  },

  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 9,
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
    paddingHorizontal: 28,
  },

  emptyMark: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  emptyMarkText: {
    fontSize: 31,
    fontWeight: "300",
    color: "#FFFFFF",
  },

  emptyTitle: {
    marginTop: 18,
    fontSize: 20,
    fontWeight: "700",
    color: "#242424",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: "#707070",
    textAlign: "center",
  },

  emptyButton: {
    marginTop: 20,
    paddingHorizontal: 21,
    paddingVertical: 12,
    borderRadius: 11,
    backgroundColor: "#34345C",
  },

  emptyButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
