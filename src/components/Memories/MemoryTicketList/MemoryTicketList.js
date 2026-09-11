import React, { useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MemoryTicket from "../../MemoryTicket/MemoryTicket";
import styles from "./memoryTicketListStyles";

function MemoryTicketList({ memory, onMemoryPress, onToggleFavorite }) {
  const handlePress = useCallback(() => {
    onMemoryPress(memory.id || memory.clientMemoryId);
  }, [memory.id, memory.clientMemoryId, onMemoryPress]);

  const handleFavorite = useCallback(() => {
    onToggleFavorite(memory);
  }, [memory, onToggleFavorite]);

  return (
    <View style={styles.memoryTicketWrapper}>
      <MemoryTicket memory={memory} compact={true} onPress={handlePress} />

      <TouchableOpacity
        style={styles.ticketFavoriteButton}
        onPress={handleFavorite}
        activeOpacity={0.8}
      >
        <Ionicons
          name={memory.favorite ? "heart" : "heart-outline"}
          size={20}
          color={memory.favorite ? "#E76F51" : "#34345C"}
        />
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(MemoryTicketList);
