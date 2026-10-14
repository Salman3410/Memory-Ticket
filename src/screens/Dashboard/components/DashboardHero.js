import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { styles } from "../dashboardStyles";

function DashboardHero({ stats }) {
  const { theme, isDark } = useTheme();
  const { colors } = theme;

  const heroBackground = isDark
    ? colors.surfaceSecondary
    : "#34345C";

  return (
    <View
      style={[
        styles.heroCard,
        {
          backgroundColor: heroBackground,
        },
      ]}
    >
      {/* Ticket side cut-outs */}
      <View
        style={[
          styles.ticketNotchLeft,
          { backgroundColor: colors.background },
        ]}
      />

      <View
        style={[
          styles.ticketNotchRight,
          { backgroundColor: colors.background },
        ]}
      />

      {/* Ticket header */}
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

      {/* Ticket statistics */}
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
