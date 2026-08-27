import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./collectionStatsStyles";

function CollectionStats({ memoryCount, favoriteCount }) {
  return (
    <View style={styles.collectionCard}>
      <View style={styles.collectionIcon}>
        <Ionicons name="ticket-outline" size={25} color="#FFFFFF" />
      </View>

      <View style={styles.collectionInfo}>
        <Text style={styles.collectionNumber}>{memoryCount}</Text>

        <Text style={styles.collectionLabel}>MEMORY TICKETS</Text>
      </View>

      <View style={styles.favoriteStat}>
        <Ionicons name="heart" size={16} color="#E76F51" />

        <Text style={styles.favoriteStatNumber}>{favoriteCount}</Text>
      </View>

      <View style={styles.collectionDecor}>
        <View style={styles.decorCircleOne} />
        <View style={styles.decorCircleTwo} />
      </View>
    </View>
  );
}

export default CollectionStats;
