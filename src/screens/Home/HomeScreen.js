import { useCallback, useMemo } from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useMemory } from "../../hooks/useMemory";
import { useCollection } from "../../hooks/useCollection";
import HomeHeader from "./components/HomeHeader";
import CreateMemoryHero from "./components/CreateMemoryHero";
import LatestMemorySection from "./components/LatestMemorySection";
import FavoriteBanner from "./components/FavoriteBanner";
import HomeCollectionsSection from "../../components/collections/HomeCollectionsSection";
import styles from "./homeStyles";

function HomeScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};

  const screenBackground =
    colors.background || (isDark ? "#171624" : "#F1F0F6");

  const { memories = [] } = useMemory();
  const { collections } = useCollection();

  const recentMemories = useMemo(() => {
    return [...memories]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date).getTime();
        const dateB = new Date(b.createdAt || b.date).getTime();

        return dateB - dateA;
      })
      .slice(0, 2);
  }, [memories]);

  const favoriteMemories = useMemo(() => {
    return memories.filter((memory) => memory.favorite === true);
  }, [memories]);

  const homeCollections = useMemo(() => {
    return Array.isArray(collections) ? collections.slice(0, 3) : [];
  }, [collections]);

  const handleViewCollections = useCallback(() => {
    navigation.navigate("Collections");
  }, [navigation]);

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

  const latestMemory = recentMemories[0];

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: screenBackground },
        ]}
      >
        <HomeHeader navigation={navigation} />

        <CreateMemoryHero navigation={navigation} />

        <LatestMemorySection
          latestMemory={latestMemory}
          navigation={navigation}
        />

        <HomeCollectionsSection
          collections={homeCollections}
          onViewAll={handleViewCollections}
          onCreate={handleCreateCollection}
          onCollectionPress={handleCollectionPress}
        />

        <FavoriteBanner
          favoritesCount={favoriteMemories.length}
          navigation={navigation}
        />

        <Text
          style={[
            styles.footerText,
            {
              color:
                colors.textSecondary ||
                colors.textMuted ||
                (isDark ? "#A6A6B8" : "#737387"),
            },
          ]}
        >
          KEEP THE MOMENT. KEEP THE STORY.
        </Text>
      </ScrollView>
    </View>
  );
}

export default HomeScreen;