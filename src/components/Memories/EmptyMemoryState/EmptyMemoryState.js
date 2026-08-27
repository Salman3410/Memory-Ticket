import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./emptyMemoryStateStyles";

function EmptyMemoryState({ filter, searchQuery, onCreateMemory }) {
  const trimmedSearchQuery = searchQuery.trim();

  const getEmptyTitle = () => {
    if (trimmedSearchQuery) {
      return "No memories found";
    }

    if (filter === "favorites") {
      return "No favorite memories";
    }

    if (filter === "recent") {
      return "No recent memories";
    }

    return "Your collection is empty";
  };

  const getEmptyDescription = () => {
    if (trimmedSearchQuery) {
      return `No memories match "${trimmedSearchQuery}".`;
    }

    if (filter === "favorites") {
      return "Tap the heart on a memory to add it to your favorites.";
    }

    if (filter === "recent") {
      return "Memories created within the last 30 days will appear here.";
    }

    return "Every great collection starts with one memory. Capture yours and turn it into a ticket.";
  };

  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyTicket}>
        <View style={styles.emptyTicketTop}>
          <Ionicons
            name={filter === "favorites" ? "heart-outline" : "ticket-outline"}
            size={28}
            color="#34345C"
          />
        </View>

        <View style={styles.emptyTicketLine} />

        <View style={styles.emptyTicketBody}>
          <View style={styles.emptyTicketTextLine} />
          <View style={styles.emptyTicketTextLineShort} />
        </View>
      </View>

      <Text style={styles.emptyTitle}>{getEmptyTitle()}</Text>

      <Text style={styles.emptyDescription}>{getEmptyDescription()}</Text>

      {filter === "all" && !trimmedSearchQuery && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={onCreateMemory}
          activeOpacity={0.85}
        >
          <Ionicons name="camera-outline" size={19} color="#FFFFFF" />

          <Text style={styles.createButtonText}>CREATE FIRST MEMORY</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default EmptyMemoryState;
