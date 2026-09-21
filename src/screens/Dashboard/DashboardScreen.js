import React from "react";
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
import CollectionsPreview from "./components/CollectionsPreview";
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

  const openMemory = (memory) => {
    if (!memory?.id) {
      return;
    }

    navigation.navigate("MemoryDetails", {
      memoryId: memory.id,
    });
  };

  const openCollection = (collection) => {
    const collectionId =
      collection?.id || collection?._id;

    if (!collectionId) {
      navigation.navigate("Collections");
      return;
    }

    navigation.navigate("CollectionDetails", {
      collectionId,
    });
  };

  const openOnThisDay = () => {
    navigation.navigate("OnThisDay");
  };

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

        <View style={styles.section}>
          <OnThisDayCard
            memories={onThisDay}
            onPress={openOnThisDay}
          />
        </View>

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

        {recentCollections.length > 0 && (
          <View style={styles.section}>
            <DashboardSectionHeader
              title="Your Collections"
              actionLabel="See all"
              onPress={() =>
                navigation.navigate("Collections")
              }
            />

            <CollectionsPreview
              collections={recentCollections}
              onPress={openCollection}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default React.memo(DashboardScreen);
