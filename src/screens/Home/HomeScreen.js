import React, { useCallback, useMemo } from "react";

import { View, ScrollView, Text } from "react-native";

import { useMemory } from "../../hooks/useMemory";
import { useCollection } from "../../hooks/useCollection";

import HomeHeader from "./components/HomeHeader";
import CreateMemoryHero from "./components/CreateMemoryHero";
import MemoryStats from "./components/MemoryStats";
import LatestMemorySection from "./components/LatestMemorySection";
import RecentMemoriesSection from "./components/RecentMemoriesSection";
import FavoriteBanner from "./components/FavoriteBanner";

import HomeCollectionsSection from "../../components/collections/HomeCollectionsSection";

import styles from "./homeStyles";

function HomeScreen({ navigation }) {
  const { memories, loading } = useMemory();

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
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HomeHeader navigation={navigation} />

        <CreateMemoryHero navigation={navigation} />

        <MemoryStats
          memoriesCount={memories.length}
          favoritesCount={favoriteMemories.length}
        />

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

        <RecentMemoriesSection
          recentMemories={recentMemories}
          loading={loading}
          navigation={navigation}
        />

        <FavoriteBanner
          favoritesCount={favoriteMemories.length}
          navigation={navigation}
        />

        <Text style={styles.footerText}>KEEP THE MOMENT. KEEP THE STORY.</Text>
      </ScrollView>
    </View>
  );
}

export default HomeScreen;
