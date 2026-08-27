import { useMemo } from "react";
import { View, ScrollView, Text } from "react-native";
import { useMemory } from "../../hooks/useMemory";
import HomeHeader from "./components/HomeHeader";
import CreateMemoryHero from "./components/CreateMemoryHero";
import MemoryStats from "./components/MemoryStats";
import LatestMemorySection from "./components/LatestMemorySection";
import RecentMemoriesSection from "./components/RecentMemoriesSection";
import FavoriteBanner from "./components/FavoriteBanner";
import styles from "./homeStyles";

function HomeScreen({ navigation }) {
  const { memories, loading } = useMemory();

  // RECENT MEMORIES
  const recentMemories = useMemo(() => {
    return [...memories]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date).getTime();
        const dateB = new Date(b.createdAt || b.date).getTime();

        return dateB - dateA;
      })
      .slice(0, 3);
  }, [memories]);

  // FAVORITE MEMORIES
  const favoriteMemories = useMemo(() => {
    return memories.filter((memory) => memory.favorite === true);
  }, [memories]);

  // LATEST MEMORY
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
