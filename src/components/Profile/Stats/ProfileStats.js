import React from "react";
import { View, Text } from "react-native";

import styles from "./profileStatsStyles";

function ProfileStats({ stats }) {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.stat}>
        <Text style={styles.statNumber}>{stats.memories}</Text>
        <Text style={styles.statLabel}>MEMORIES</Text>
      </View>

      <View style={styles.statDivider} />

      <View style={styles.stat}>
        <Text style={styles.statNumber}>{stats.tickets}</Text>
        <Text style={styles.statLabel}>TICKETS</Text>
      </View>

      <View style={styles.statDivider} />

      <View style={styles.stat}>
        <Text style={styles.statNumber}>{stats.favorites}</Text>
        <Text style={styles.statLabel}>FAVORITES</Text>
      </View>
    </View>
  );
}

export default ProfileStats;
