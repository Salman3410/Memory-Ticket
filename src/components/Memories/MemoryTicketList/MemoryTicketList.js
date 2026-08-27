import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import MemoryTicket from "../../MemoryTicket/MemoryTicket";
import styles from "./memoryTicketListStyles";

function MemoryTicketList({ memories, onMemoryPress, onToggleFavorite }) {
  return (
    <View style={styles.memoriesList}>
      {memories.map((memory) => (
        <View key={memory.id} style={styles.memoryTicketWrapper}>
          <MemoryTicket
            memory={memory}
            compact={true}
            onPress={() => onMemoryPress(memory.id)}
          />

          <TouchableOpacity
            style={styles.ticketFavoriteButton}
            onPress={() => onToggleFavorite(memory)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={memory.favorite ? "heart" : "heart-outline"}
              size={20}
              color={memory.favorite ? "#E76F51" : "#34345C"}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

export default MemoryTicketList;
