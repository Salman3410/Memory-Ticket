import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  InteractionManager,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCollection } from "../../hooks/useCollection";

function CollectionsScreen({ navigation }) {
  const { collections, loading, refreshCollections } = useCollection();

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        refreshCollections(false);
      });

      return () => {
        task.cancel();
      };
    }, [refreshCollections]),
  );

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
    ({ item }) => (
      <CollectionCard
        collection={item}
        onPress={() => handleCollectionPress(item)}
      />
    ),
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.eyebrow}>YOUR STORIES</Text>

          <Text style={styles.title}>Collections</Text>

          <Text style={styles.subtitle}>
            Keep moments that belong together.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateCollection}
          activeOpacity={0.85}
        >
          <Text style={styles.createButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {!loading && collections.length > 0 ? (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            {collections.length}{" "}
            {collections.length === 1 ? "collection" : "collections"}
          </Text>

          <Text style={styles.summaryHint}>Your memories, together</Text>
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
              onRefresh={() => refreshCollections(true)}
              tintColor="#34345C"
            />
          }
          ListEmptyComponent={renderEmpty}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={5}
          removeClippedSubviews
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

  headerContent: {
    flex: 1,
    paddingRight: 18,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#34345C",
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
