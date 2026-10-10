import React, { useCallback, useRef } from "react";
import { Animated, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MemoryTicket from "../../MemoryTicket/MemoryTicket";
import styles from "./memoryTicketListStyles";

function MemoryTicketList({
  memory,
  onMemoryPress,
  onToggleFavorite,
  theme,
  isDark,
}) {
  const colors = theme?.colors || {};
  const primaryColor = colors.primary || "#34345C";
  const accentColor = colors.accent || "#E76F51";
  const surfaceColor =
    colors.surface || colors.card || (isDark ? "#232333" : "#FFFFFF");
  const borderColor = colors.border || (isDark ? "#38384C" : "#D9D8E2");
  const favoriteScale = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    onMemoryPress(memory.id || memory.clientMemoryId);
  }, [memory.id, memory.clientMemoryId, onMemoryPress]);

  const handleFavorite = useCallback(() => {
    // Reset in case the user taps quickly.
    favoriteScale.stopAnimation();
    favoriteScale.setValue(1);

    // Heart pop animation.
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

    // Preserve existing favorite logic.
    onToggleFavorite(memory);
  }, [favoriteScale, memory, onToggleFavorite]);

  return (
    <View style={styles.memoryTicketWrapper}>
      {/* TICKET ARTWORK */}

      <MemoryTicket memory={memory} compact={true} onPress={handlePress} />

      {/* FAVORITE BUTTON */}

      <TouchableOpacity
        style={[
          styles.ticketFavoriteButton,

          // Preserve the current light-mode design.
          isDark && {
            backgroundColor: surfaceColor,
            borderColor,
          },
        ]}
        onPress={handleFavorite}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={
          memory.favorite ? "Remove from favorites" : "Add to favorites"
        }
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
            color={memory.favorite ? accentColor : primaryColor}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(MemoryTicketList);
