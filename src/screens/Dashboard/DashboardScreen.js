
import React, { useCallback, useMemo } from "react";

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
} from "react-native";

import { useAuth } from "../../hooks/useAuth";
import useDashboard from "../../hooks/useDashboard";
import useRefresh from "../../hooks/useRefresh";
import { useMemory } from "../../hooks/useMemory";
import { useCollection } from "../../hooks/useCollection";
import { useTheme } from "../../context/ThemeContext";

import DashboardHeader from "./components/DashboardHeader";
import DashboardHero from "./components/DashboardHero";
import MemoryPulseCard from "./components/MemoryPulseCard";
import OnThisDayCard from "./components/OnThisDayCard";
import DashboardSpotlightCard from "./components/DashboardSpotlightCard";
import DashboardMemoryCard from "./components/DashboardMemoryCard";
import DashboardSectionHeader from "./components/DashboardSectionHeader";

import HomeCollectionsSection from "../../components/collections/HomeCollectionsSection";
import { styles as dashboardStyles } from "./dashboardStyles";

function DashboardScreen({ navigation }) {
  const { user } = useAuth();

  const { refreshMemories } = useMemory();
  const { refreshCollections } = useCollection();

  const { theme, isDark } = useTheme();
  const { colors } = theme;

  // Preserve existing layouts while applying the active theme.
  const styles = useMemo(
    () => ({
      ...dashboardStyles,

      container: [
        dashboardStyles.container,
        {
          backgroundColor: colors.background,
        },
      ],

      loadingContainer: [
        dashboardStyles.loadingContainer,
        {
          backgroundColor: colors.background,
        },
      ],

      content: [
        dashboardStyles.content,
        {
          backgroundColor: colors.background,
        },
      ],
    }),
    [colors.background]
  );

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

  // Refresh dashboard data.
  const refreshDashboard = useCallback(async () => {
    await Promise.all([
      refreshMemories(),
      refreshCollections(),
    ]);
  }, [refreshMemories, refreshCollections]);

  const { refreshing, onRefresh } = useRefresh(refreshDashboard);

  // Open memory details.
  const openMemory = useCallback(
    (memory) => {
      if (!memory?.id) {
        return;
      }

      navigation.navigate("MemoryDetails", {
        memoryId: memory.id,
      });
    },
    [navigation]
  );

  // Collections navigation.
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
    [navigation]
  );

  // On This Day navigation.
  const openOnThisDay = useCallback(() => {
    navigation.navigate("OnThisDay");
  }, [navigation]);

  // Loading screen.
  if (loading && !stats.totalMemories) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={colors.background}
        />

        <ActivityIndicator
          size="small"
          color={colors.accent}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
            progressBackgroundColor={colors.surface}
          />
        }
      >
        {/* Header */}
        <DashboardHeader
          name={user?.name}
          colors={colors}
          isDark={isDark}
        />

        {/* Dashboard Hero */}
        <DashboardHero
          stats={stats}
          colors={colors}
          isDark={isDark}
        />

        {/* Memory Activity */}
        <MemoryPulseCard
          activity={monthlyActivity}
          thisMonthCount={thisMonthCount}
          mostActiveMonth={mostActiveMonth}
          colors={colors}
          isDark={isDark}
        />

        {/* On This Day */}
        <View style={styles.section}>
          <OnThisDayCard
            memories={onThisDay}
            onPress={openOnThisDay}
            colors={colors}
            isDark={isDark}
          />
        </View>

        {/* Memory Spotlight */}
        {featuredMemory && (
          <View style={styles.section}>
            <DashboardSectionHeader
              title="Memory Spotlight"
              actionLabel="Open"
              onPress={() => openMemory(featuredMemory)}
              colors={colors}
              isDark={isDark}
            />

            <DashboardSpotlightCard
              memory={featuredMemory}
              onPress={() => openMemory(featuredMemory)}
              colors={colors}
              isDark={isDark}
            />
          </View>
        )}

        {/* Favorites */}
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
              colors={colors}
              isDark={isDark}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalContent}
            >
              {favoriteMemories.map((memory) => (
                <DashboardMemoryCard
                  key={
                    memory?.id ||
                    memory?._id ||
                    memory?.clientMemoryId
                  }
                  memory={memory}
                  onPress={() => openMemory(memory)}
                  colors={colors}
                  isDark={isDark}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Collections */}
        <HomeCollectionsSection
          collections={
            Array.isArray(recentCollections)
              ? recentCollections.slice(0, 3)
              : []
          }
          onViewAll={handleViewCollections}
          onCreate={handleCreateCollection}
          onCollectionPress={handleCollectionPress}
          colors={colors}
          isDark={isDark}
        />
      </ScrollView>
    </View>
  );
}

export default React.memo(DashboardScreen);
