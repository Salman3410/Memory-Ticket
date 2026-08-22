import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./memoryTicketHorizontalStyles";

function MemoryTicketHorizontal({ memory, onPress }) {
  if (!memory) {
    return null;
  }

  const title = memory.title || "UNTITLED MEMORY";
  const location = memory.location || "MEMORY TICKET";

  const dateValue = memory.createdAt || memory.date;

  let date = "DATE NOT SET";

  if (dateValue) {
    const parsedDate = new Date(dateValue);

    if (!Number.isNaN(parsedDate.getTime())) {
      date = parsedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }

  const ticketNumber =
    memory.ticketNumber ||
    memory.id?.toString().slice(-6).toUpperCase() ||
    "000000";

  const ticketContent = (
    <View style={styles.ticket}>
      {/* LEFT IMAGE */}

      <View style={styles.imageSection}>
        {memory.image ? (
          <Image
            source={{ uri: memory.image }}
            style={styles.ticketImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImage}>
            <Ionicons name="image-outline" size={28} color="#F0442C" />
          </View>
        )}

        <View style={styles.imageBadge}>
          <Ionicons name="ticket-outline" size={11} color="#FFFFFF" />
        </View>
      </View>

      {/* RIGHT CONTENT */}

      <View style={styles.ticketContent}>
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.brandText}>MEMORY TICKET</Text>

          <Ionicons name="arrow-forward" size={16} color="#F0442C" />
        </View>

        {/* TITLE */}

        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {/* LOCATION */}

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={12} color="#F0442C" />

          <Text style={styles.infoText} numberOfLines={1}>
            {location}
          </Text>
        </View>

        {/* DATE */}

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={12} color="#F0442C" />

          <Text style={styles.infoText} numberOfLines={1}>
            {date}
          </Text>
        </View>

        {/* FOOTER */}

        <View style={styles.footer}>
          <View>
            <Text style={styles.ticketNumberLabel}>TICKET NO.</Text>

            <Text style={styles.ticketNumber}>{ticketNumber}</Text>
          </View>

          {/* MINI BARCODE */}

          <View style={styles.barcode}>
            {Array.from({ length: 15 }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.bar,
                  index % 4 === 0
                    ? styles.barWide
                    : index % 3 === 0
                      ? styles.barMedium
                      : styles.barSmall,
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* PERFORATION */}

      <View style={styles.topNotch} />
      <View style={styles.bottomNotch} />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        {ticketContent}
      </TouchableOpacity>
    );
  }

  return ticketContent;
}

export default MemoryTicketHorizontal;
