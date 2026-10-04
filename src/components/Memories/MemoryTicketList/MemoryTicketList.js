import React, { useCallback, useRef } from "react";
import { Animated, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MemoryTicket from "../../MemoryTicket/MemoryTicket";
import styles from "./memoryTicketListStyles";

function MemoryTicketList({ memory, onMemoryPress, onToggleFavorite }) {
  const favoriteScale = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    onMemoryPress(memory.id || memory.clientMemoryId);
  }, [memory.id, memory.clientMemoryId, onMemoryPress]);

  const handleFavorite = useCallback(() => {
    // Reset in case the user taps quickly
    favoriteScale.stopAnimation();
    favoriteScale.setValue(1);

    // Heart pop animation
    Animated.sequence([
      Animated.spring(favoriteScale, {
        toValue: 1.3,
        friction: 4,
        tension: 180,
        useNativeDriver: true,
      }),

      Animated.spring(favoriteScale, {
        toValue: 0.92,
        friction: 5,
        tension: 180,
        useNativeDriver: true,
      }),

      Animated.spring(favoriteScale, {
        toValue: 1,
        friction: 5,
        tension: 160,
        useNativeDriver: true,
      }),
    ]).start();

    // Keep existing favorite logic
    onToggleFavorite(memory);
  }, [favoriteScale, memory, onToggleFavorite]);

  return (
    <View style={styles.memoryTicketWrapper}>
      <MemoryTicket memory={memory} compact={true} onPress={handlePress} />

      <TouchableOpacity
        style={styles.ticketFavoriteButton}
        onPress={handleFavorite}
        activeOpacity={0.8}
      >
        <Animated.View
          style={{
            transform: [
              {
                scale: favoriteScale,
              },
            ],
          }}
        >
          <Ionicons
            name={memory.favorite ? "heart" : "heart-outline"}
            size={20}
            color={memory.favorite ? "#E76F51" : "#34345C"}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(MemoryTicketList);
