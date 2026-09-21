import React, { useCallback } from "react";
import {
  ActivityIndicator,
  ScrollView,
  View,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import useDashboard from "../../hooks/useDashboard";
import DashboardHeader from "./components/DashboardHeader";
import DashboardHero from "./components/DashboardHero";
import MemoryPulseCard from "./components/MemoryPulseCard";
import OnThisDayCard from "./components/OnThisDayCard";
import DashboardSpotlightCard from "./components/DashboardSpotlightCard";
import DashboardMemoryCard from "./components/DashboardMemoryCard";
import DashboardSectionHeader from "./components/DashboardSectionHeader";
import HomeCollectionsSection from "../../components/collections/HomeCollectionsSection";
import { styles } from "./dashboardStyles";

function DashboardScreen({ navigation }) {
  const { user } = useAuth();

  const {
    stats,
    recentMemories,
    favoriteMemories,
    recentCollections,
    onThisDay,
    monthlyActivity,
    thisMonthCount,
    mostActiveMonth,
    featuredMemory,
    loading,
  } = useDashboard();

  const openMemory = useCallback(
    (memory) => {
      if (!memory?.id) {
        return;
      }

      navigation.navigate("MemoryDetails", {
        memoryId: memory.id,
      });
    },
    [navigation],
  );

  const handleViewCollections = useCallback(() => {
    navigation.navigate("Collections");
  }, [navigation]);

  const handleCreateCollection = useCallback(() => {
    navigation.navigate("CreateCollection");
  }, [navigation]);

  const handleCollectionPress = useCallback(
    (collection) => {
      const collectionId =
        collection?._id || collection?.id;

      if (!collectionId) {
        return;
      }

      navigation.navigate("CollectionDetails", {
        collectionId,
      });
    },
    [navigation],
  );

  const openOnThisDay = useCallback(() => {
    navigation.navigate("OnThisDay");
  }, [navigation]);

  if (loading && !stats.totalMemories) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="small"
          color="#34345C"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <DashboardHeader name={user?.name} />

        <DashboardHero stats={stats} />

        <MemoryPulseCard
          activity={monthlyActivity}
          thisMonthCount={thisMonthCount}
          mostActiveMonth={mostActiveMonth}
        />

        {/* ON THIS DAY */}

        <View style={styles.section}>
          <OnThisDayCard
            memories={onThisDay}
            onPress={openOnThisDay}
          />
        </View>

        {/* MEMORY SPOTLIGHT */}

        {featuredMemory && (
          <View style={styles.section}>
            <DashboardSectionHeader
              title="Memory Spotlight"
              actionLabel="Open"
              onPress={() =>
                openMemory(featuredMemory)
              }
            />

            <DashboardSpotlightCard
              memory={featuredMemory}
              onPress={() =>
                openMemory(featuredMemory)
              }
            />
          </View>
        )}

        {/* FAVORITES */}

        {favoriteMemories.length > 0 && (
          <View style={styles.section}>
            <DashboardSectionHeader
              title="Little Favorites"
              actionLabel="See all"
              onPress={() =>
                navigation.navigate("Memories", {
                  filter: "favorites",
                })
              }
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={
                styles.horizontalContent
              }
            >
              {favoriteMemories.map((memory) => (
                <DashboardMemoryCard
                  key={
                    memory?.id ||
                    memory?._id ||
                    memory?.clientMemoryId
                  }
                  memory={memory}
                  onPress={() =>
                    openMemory(memory)
                  }
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* COLLECTIONS */}

        <HomeCollectionsSection
          collections={
            Array.isArray(recentCollections)
              ? recentCollections.slice(0, 3)
              : []
          }
          onViewAll={handleViewCollections}
          onCreate={handleCreateCollection}
          onCollectionPress={
            handleCollectionPress
          }
        />
      </ScrollView>
    </View>
  );
}

export default React.memo(DashboardScreen);

