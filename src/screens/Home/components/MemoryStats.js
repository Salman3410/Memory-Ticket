import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";

import styles from "../homeStyles";

function MemoryStats({ memoriesCount, favoritesCount }) {
  return (
    <View style={styles.statsRow}>
      <View style={[styles.statCard, { backgroundColor: colors.surface || (isDark ? "#211F30" : "#FFFFFF"), borderColor: colors.border || (isDark ? "#39364D" : "#D9D8E2") }]}>
        <View>
          <Text style={[styles.statNumber, { color: colors.text || (isDark ? "#F7F5FC" : "#242424") }]}>{memoriesCount}</Text>

          <Text style={[styles.statLabel, { color: colors.textSecondary || (isDark ? "#C4C0D0" : "#707080") }]}>MEMORIES</Text>
        </View>

        <View style={[styles.statIcon, { backgroundColor: colors.background || (isDark ? "#171624" : "#F1F0F6") }]}>
          <Ionicons name="ticket-outline" size={19} color={colors.primary || "#34345C"} />
        </View>
      </View>

      <View style={styles.statCard}>
        <View>
          <Text style={styles.statNumber}>{favoritesCount}</Text>

          <Text style={styles.statLabel}>FAVORITES</Text>
        </View>

        <View style={[styles.favoriteStatIcon, { backgroundColor: colors.background || (isDark ? "#171624" : "#F1F0F6") }]}>
          <Ionicons name="heart-outline" size={19} color={colors.accent || "#E76F51"} />
        </View>
      </View>
    </View>
  );
}

export default MemoryStats;
