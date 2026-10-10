import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./emptyMemoryStateStyles";

function EmptyMemoryState({
  filter,
  searchQuery = "",
  onCreateMemory,
  theme,
  isDark,
}) {
  const colors = theme?.colors || {};
  const backgroundColor = colors.background || (isDark ? "#171724" : "#F1F0F6");
  const textColor = colors.text || (isDark ? "#F1F0F6" : "#242424");
  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#737387");
  const primaryColor = colors.primary || "#34345C";
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
    <View
      style={[
        styles.emptyState,
        {
          backgroundColor,
        },
      ]}
    >
      {/* DECORATIVE EMPTY TICKET */}

      <View style={styles.emptyTicket}>
        <View style={styles.emptyTicketTop}>
          <Ionicons
            name={filter === "favorites" ? "heart-outline" : "ticket-outline"}
            size={28}
            color={primaryColor}
          />
        </View>

        <View style={styles.emptyTicketLine} />

        <View style={styles.emptyTicketBody}>
          <View style={styles.emptyTicketTextLine} />
          <View style={styles.emptyTicketTextLineShort} />
        </View>
      </View>

      {/* EMPTY TITLE */}

      <Text
        style={[
          styles.emptyTitle,
          {
            color: textColor,
          },
        ]}
      >
        {getEmptyTitle()}
      </Text>

      {/* EMPTY DESCRIPTION */}

      <Text
        style={[
          styles.emptyDescription,
          {
            color: mutedTextColor,
          },
        ]}
      >
        {getEmptyDescription()}
      </Text>

      {/* CREATE FIRST MEMORY */}

      {filter === "all" && !trimmedSearchQuery && (
        <TouchableOpacity
          style={[
            styles.createButton,
            {
              backgroundColor: primaryColor,
            },
          ]}
          onPress={onCreateMemory}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Create your first memory"
        >
          <Ionicons name="camera-outline" size={19} color="#FFFFFF" />

          <Text style={styles.createButtonText}>CREATE FIRST MEMORY</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default EmptyMemoryState;
