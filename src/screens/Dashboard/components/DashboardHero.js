import React from "react";
import {
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../dashboardStyles";

function DashboardHero({ stats }) {
  return (
    <View style={styles.heroCard}>

      {/* Ticket side cut-outs */}
      <View style={styles.ticketNotchLeft} />
      <View style={styles.ticketNotchRight} />

      <View style={styles.heroTopRow}>
        <View>
          <Text style={styles.heroEyebrow}>
            YOUR STORY SO FAR
          </Text>

          <Text style={styles.heroCount}>
            {stats.totalMemories}
          </Text>

          <Text style={styles.heroDescription}>
            {stats.totalMemories === 1
              ? "memory captured"
              : "memories captured"}
          </Text>
        </View>
      </View>

      {/* Ticket perforation */}
      <View style={styles.ticketDivider}>
        {Array.from({ length: 22 }).map((_, index) => (
          <View
            key={index}
            style={styles.ticketDot}
          />
        ))}
      </View>

      <View style={styles.heroStatsRow}>
        <View style={styles.heroStat}>
          <Text style={styles.heroStatValue}>
            {stats.totalPhotos}
          </Text>

          <Text style={styles.heroStatLabel}>
            PHOTOS
          </Text>
        </View>

        <View style={styles.heroStat}>
          <Text style={styles.heroStatValue}>
            {stats.totalPlaces}
          </Text>

          <Text style={styles.heroStatLabel}>
            PLACES
          </Text>
        </View>

        <View style={styles.heroStat}>
          <Text style={styles.heroStatValue}>
            {stats.totalFavorites}
          </Text>

          <Text style={styles.heroStatLabel}>
            FAVORITES
          </Text>
        </View>
      </View>
    </View>
  );
}

export default React.memo(DashboardHero);

