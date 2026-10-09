
import React, { useCallback } from "react";

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

import { styles } from "./dashboardStyles";

function DashboardScreen({ navigation }) {
  const { user } = useAuth();

  const { refreshMemories } = useMemory();
  const { refreshCollections } = useCollection();

  const { theme, isDark } = useTheme();
  const { colors } = theme;

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

  // --------------------------------------------------
  // REFRESH
  // --------------------------------------------------

  const refreshDashboard = useCallback(async () => {
    await Promise.all([
      refreshMemories(),
      refreshCollections(),
    ]);
  }, [refreshMemories, refreshCollections]);

  const { refreshing, onRefresh } = useRefresh(refreshDashboard);

  // --------------------------------------------------
  // MEMORY NAVIGATION
  // --------------------------------------------------

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

  // --------------------------------------------------
  // COLLECTION NAVIGATION
  // --------------------------------------------------

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

  // --------------------------------------------------
  // ON THIS DAY
  // --------------------------------------------------

  const openOnThisDay = useCallback(() => {
    navigation.navigate("OnThisDay");
  }, [navigation]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading && !stats.totalMemories) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
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

  // --------------------------------------------------
  // DASHBOARD
  // --------------------------------------------------

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
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
        {/* HEADER */}

        <DashboardHeader
          name={user?.name}
          colors={colors}
          isDark={isDark}
        />

        {/* DASHBOARD HERO */}

        <DashboardHero
          stats={stats}
          colors={colors}
          isDark={isDark}
        />

        {/* MEMORY ACTIVITY */}

        <MemoryPulseCard
          activity={monthlyActivity}
          thisMonthCount={thisMonthCount}
          mostActiveMonth={mostActiveMonth}
          colors={colors}
          isDark={isDark}
        />

        {/* ON THIS DAY */}

        <View style={styles.section}>
          <OnThisDayCard
            memories={onThisDay}
            onPress={openOnThisDay}
            colors={colors}
            isDark={isDark}
          />
        </View>

        {/* MEMORY SPOTLIGHT */}

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

        {/* COLLECTIONS */}

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