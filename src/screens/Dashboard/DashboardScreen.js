import React, {
  useCallback,
  useMemo,
} from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import useDashboard from "../../hooks/useDashboard";
import { useMemory } from "../../hooks/useMemory";
import { useCollection } from "../../hooks/useCollection";
import { useTheme } from "../../context/ThemeContext";
import MementoRefresh from "../../components/common/MementoRefresh";
import DashboardHeader from "./components/DashboardHeader";
import DashboardHero from "./components/DashboardHero";
import MemoryPulseCard from "./components/MemoryPulseCard";
import OnThisDayCard from "./components/OnThisDayCard";
import { createDashboardStyles } from "./dashboardStyles";

function DashboardScreen({ navigation }) {
  const { user } = useAuth();

  const { refreshMemories } = useMemory();
  const { refreshCollections } = useCollection();

  const { theme, isDark } = useTheme();
  const { colors } = theme;

  const styles = useMemo(
    () => createDashboardStyles(theme, isDark),
    [theme, isDark],
  );

  const {
    stats,
    onThisDay,
    monthlyActivity,
    thisMonthCount,
    mostActiveMonth,
    loading,
  } = useDashboard();

  const refreshDashboard = useCallback(async () => {
    await Promise.all([
      refreshMemories(),
      refreshCollections(),
    ]);
  }, [refreshMemories, refreshCollections]);

  const openOnThisDay = useCallback(() => {
    navigation.navigate("OnThisDay");
  }, [navigation]);

  if (loading && !stats.totalMemories) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar
          barStyle={
            isDark ? "light-content" : "dark-content"
          }
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
        barStyle={
          isDark ? "light-content" : "dark-content"
        }
        backgroundColor={colors.background}
      />

      <MementoRefresh
        onRefresh={refreshDashboard}
        label="Refreshing dashboard..."
      >
        <ScrollView
          style={{
            backgroundColor: colors.background,
          }}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
        </ScrollView>
      </MementoRefresh>
    </View>
  );
}

export default React.memo(DashboardScreen);