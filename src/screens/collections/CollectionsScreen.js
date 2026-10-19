import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCollection } from "../../hooks/useCollection";
import useRefresh from "../../hooks/useRefresh";
import CollectionCardComponent from "../../components/collections/CollectionCard";
import { useTheme } from "../../context/ThemeContext";

function CollectionsScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};

  // Theme colors
  const screenBackground =
    colors.background || (isDark ? "#171624" : "#F1F0F6");

  const surfaceColor =
    colors.surface || (isDark ? "#211F30" : "#FFFFFF");

  const textColor =
    colors.text || (isDark ? "#F7F5FC" : "#242424");

  const secondaryTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#C4C0D0" : "#707080");

  const borderColor =
    colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const primaryColor =
    colors.primary || (isDark ? "#C8C2FF" : "#34345C");

  const primaryTextColor =
    colors.primaryText || (isDark ? "#25223D" : "#FFFFFF");

  const {
    collections,
    loading,
    refreshCollections,
  } = useCollection();

  const collectionList = Array.isArray(collections)
    ? collections
    : [];

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const refreshOnFocus = async () => {
        try {
          await refreshCollections();
        } catch (error) {
          if (active) {
            console.error(
              "Failed to refresh collections on focus:",
              error,
            );
          }
        }
      };

      refreshOnFocus();

      return () => {
        active = false;
      };
    }, [refreshCollections]),
  );

  const refreshCollectionsScreen = useCallback(async () => {
    await refreshCollections();
  }, [refreshCollections]);

  const { refreshing, onRefresh } = useRefresh(
    refreshCollectionsScreen,
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleCreateCollection = useCallback(() => {
    navigation.navigate("CreateCollection");
  }, [navigation]);

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

  const renderItem = useCallback(
    ({ item }) => (
      <CollectionCardComponent
        collection={item}
        onPress={() => handleCollectionPress(item)}
      />
    ),
    [handleCollectionPress],
  );

  const keyExtractor = useCallback(
    (item, index) =>
      String(item?._id || item?.id || index),
    [],
  );

  const renderEmpty = useCallback(() => {
    if (loading) {
      return null;
    }

    return (
      <View
        style={[
          styles.emptyState,
          { backgroundColor: screenBackground },
        ]}
      >
        <View
          style={[
            styles.emptyMark,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          <Ionicons
            name="albums-outline"
            size={30}
            color={primaryColor}
          />
        </View>

        <Text
          style={[
            styles.emptyTitle,
            { color: textColor },
          ]}
        >
          Give your memories a place
        </Text>

        <Text
          style={[
            styles.emptyText,
            { color: secondaryTextColor },
          ]}
        >
          Create a collection for trips, people, events, or anything you want
          to remember together.
        </Text>

        <TouchableOpacity
          style={[
            styles.emptyButton,
            { backgroundColor: primaryColor },
          ]}
          onPress={handleCreateCollection}
          activeOpacity={0.85}
        >
          <Ionicons
            name="add"
            size={18}
            color={primaryTextColor}
          />

          <Text
            style={[
              styles.emptyButtonText,
              { color: primaryTextColor },
            ]}
          >
            Create Collection
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [
    loading,
    screenBackground,
    surfaceColor,
    borderColor,
    primaryColor,
    primaryTextColor,
    textColor,
    secondaryTextColor,
    handleCreateCollection,
  ]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: screenBackground },
      ]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={screenBackground}
      />

      {/* HEADER */}
      <View
        style={[
          styles.header,
          { backgroundColor: screenBackground },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[
              styles.backButton,
              {
                backgroundColor: surfaceColor,
                borderColor,
              },
            ]}
            onPress={handleGoBack}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={textColor}
            />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text
              style={[
                styles.eyebrow,
                { color: secondaryTextColor },
              ]}
            >
              YOUR STORIES
            </Text>

            <Text
              style={[
                styles.title,
                { color: textColor },
              ]}
            >
              Collections
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: secondaryTextColor },
              ]}
            >
              Keep moments that belong together.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.createButton,
            { backgroundColor: primaryColor },
          ]}
          onPress={handleCreateCollection}
          activeOpacity={0.85}
        >
          <Ionicons
            name="add"
            size={25}
            color={primaryTextColor}
          />
        </TouchableOpacity>
      </View>

      {/* COLLECTION SUMMARY */}
      {!loading && collectionList.length > 0 ? (
        <View
          style={[
            styles.summaryRow,
            {
              backgroundColor: screenBackground,
              borderBottomColor: borderColor,
            },
          ]}
        >
          <View style={styles.summaryLeft}>
            <Ionicons
              name="albums-outline"
              size={16}
              color={secondaryTextColor}
            />

            <Text
              style={[
                styles.summaryText,
                { color: textColor },
              ]}
            >
              {collectionList.length}{" "}
              {collectionList.length === 1
                ? "collection"
                : "collections"}
            </Text>
          </View>

          <Text
            style={[
              styles.summaryHint,
              { color: secondaryTextColor },
            ]}
          >
            Your memories, together
          </Text>
        </View>
      ) : null}

      {/* INITIAL LOADING */}
      {loading && collectionList.length === 0 ? (
        <View
          style={[
            styles.loadingContainer,
            { backgroundColor: screenBackground },
          ]}
        >
          <ActivityIndicator
            size="large"
            color={primaryColor}
          />

          <Text
            style={[
              styles.loadingText,
              { color: secondaryTextColor },
            ]}
          >
            Loading collections...
          </Text>
        </View>
      ) : (
        <FlatList
          data={collectionList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={
            collectionList.length > 1
              ? styles.columnWrapper
              : undefined
          }
          contentContainerStyle={[
            collectionList.length === 0
              ? styles.emptyList
              : styles.listContent,
            { backgroundColor: screenBackground },
          ]}
          style={{ backgroundColor: screenBackground }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={primaryColor}
              colors={[primaryColor]}
              progressBackgroundColor={surfaceColor}
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

  // HEADER
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    alignItems: "center",
    justifyContent: "center",
  },

  headerContent: {
    flex: 1,
    minWidth: 0,
    paddingRight: 5,
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  title: {
    marginTop: 4,
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
  },

  createButton: {
    width: 44,
    height: 44,
    marginLeft: 10,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  // SUMMARY
  summaryRow: {
    minHeight: 45,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  summaryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  summaryText: {
    fontSize: 12,
    fontWeight: "700",
  },

  summaryHint: {
    fontSize: 10,
  },

  // COLLECTION GRID
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 32,
  },

  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },

  // LOADING
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
  },

  // EMPTY STATE
  emptyList: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 40,
  },

  emptyMark: {
    width: 66,
    height: 66,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    marginTop: 18,
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyText: {
    maxWidth: 300,
    marginTop: 9,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },

  emptyButton: {
    minHeight: 46,
    marginTop: 22,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  emptyButtonText: {
    fontSize: 12,
    fontWeight: "800",
  },
});