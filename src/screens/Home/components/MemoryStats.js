import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "../homeStyles";

function MemoryStats({ memoriesCount, favoritesCount }) {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <View>
          <Text style={styles.statNumber}>{memoriesCount}</Text>

          <Text style={styles.statLabel}>MEMORIES</Text>
        </View>

        <View style={styles.statIcon}>
          <Ionicons name="ticket-outline" size={19} color="#34345C" />
        </View>
      </View>

      <View style={styles.statCard}>
        <View>
          <Text style={styles.statNumber}>{favoritesCount}</Text>

          <Text style={styles.statLabel}>FAVORITES</Text>
        </View>

        <View style={styles.favoriteStatIcon}>
          <Ionicons name="heart-outline" size={19} color="#E76F51" />
        </View>
      </View>
    </View>
  );
}

export default MemoryStats;
