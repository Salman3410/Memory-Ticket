import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { createDashboardStyles } from "../dashboardStyles";

function StatItem({ value, label, styles }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function DashboardStats({ stats }) {
  const { theme, isDark } = useTheme();

  const styles = useMemo(
    () => createDashboardStyles(theme, isDark),
    [theme, isDark]
  );

  return (
    <View style={styles.statsCard}>
      <StatItem
        value={stats.totalMemories}
        label="Memories"
        styles={styles}
      />

      <View style={styles.statDivider} />

      <StatItem
        value={stats.totalPhotos}
        label="Photos"
        styles={styles}
      />

      <View style={styles.statDivider} />

      <StatItem
        value={stats.totalPlaces}
        label="Places"
        styles={styles}
      />

      <View style={styles.statDivider} />

      <StatItem
        value={stats.totalFavorites}
        label="Favorites"
        styles={styles}
      />
    </View>
  );
}

export default React.memo(DashboardStats);