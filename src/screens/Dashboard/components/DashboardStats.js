import React from "react";
import { Text, View } from "react-native";
import { styles } from "../dashboardStyles";

function StatItem({ value, label }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function DashboardStats({ stats }) {
  return (
    <View style={styles.statsCard}>
      <StatItem value={stats.totalMemories} label="Memories" />

      <View style={styles.statDivider} />

      <StatItem value={stats.totalPhotos} label="Photos" />

      <View style={styles.statDivider} />

      <StatItem value={stats.totalPlaces} label="Places" />

      <View style={styles.statDivider} />

      <StatItem value={stats.totalFavorites} label="Favorites" />
    </View>
  );
}

export default React.memo(DashboardStats);
