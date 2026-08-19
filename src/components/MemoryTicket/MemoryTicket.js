import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./memoryTicketStyles";

function MemoryTicket({ memory, onPress, compact = false }) {
  if (!memory) {
    return null;
  }

  const formatDate = (value) => {
    if (!value) {
      return "DATE NOT SET";
    }

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return "DATE NOT SET";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const title = memory.title || "UNTITLED MEMORY";
  const location = memory.location || "MEMORY TICKET";
  const date = formatDate(memory.createdAt || memory.date);
  const time = memory.time || "";
  const admission = memory.admission || "X1";
  const ticketNumber =
    memory.ticketNumber || memory.id?.toString().slice(-6) || "000000";

  const ticketContent = (
    <View style={[styles.ticket, compact && styles.ticketCompact]}>
      {/* TOP PERFORATION */}

      <View style={styles.topPerforation}>
        {Array.from({ length: 12 }).map((_, index) => (
          <View key={index} style={styles.perforationDot} />
        ))}
      </View>

      {/* MAIN TICKET */}

      <View style={styles.ticketBody}>
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.brandText}>MEMORY TICKET</Text>

          <Ionicons name="ticket-outline" size={18} color="#F0442C" />
        </View>

        {/* IMAGE */}

        {memory?.image ? (
          <Image source={{ uri: memory.image }} style={styles.ticketImage} />
        ) : (
          <View style={styles.noImage}>
            <Ionicons name="image-outline" size={40} color="#707080" />
          </View>
        )}

        {/* TITLE */}

        <View style={styles.titleContainer}>
          <Text style={styles.ticketTitle} numberOfLines={2}>
            {title}
          </Text>
        </View>

        {/* EVENT INFO */}

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>LOCATION</Text>

              <Text style={styles.infoValue} numberOfLines={1}>
                {location}
              </Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>DATE</Text>

              <Text style={styles.infoValue} numberOfLines={1}>
                {date}
              </Text>
            </View>
          </View>

          {time ? (
            <View style={styles.timeRow}>
              <Text style={styles.infoLabel}>TIME</Text>

              <Text style={styles.infoValue}>{time}</Text>
            </View>
          ) : null}
        </View>

        {/* ADMISSION */}

        <View style={styles.admissionSection}>
          <Text style={styles.admissionLabel}>ADMISSION</Text>

          <Text style={styles.admissionValue}>
            X{admission.toString().replace(/^X/, "")}
          </Text>
        </View>

        {/* PERFORATED DIVIDER */}

        <View style={styles.divider}>
          <View style={styles.dividerLine} />

          <View style={styles.dividerNotchLeft} />
          <View style={styles.dividerNotchRight} />
        </View>

        {/* FOOTER */}

        <View style={styles.ticketFooter}>
          <View style={styles.ticketNumberContainer}>
            <Text style={styles.ticketNumberLabel}>TICKET NO.</Text>

            <Text style={styles.ticketNumber}>{ticketNumber}</Text>
          </View>

          <View style={styles.barcode}>
            {Array.from({ length: 30 }).map((_, index) => (
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

      {/* BOTTOM PERFORATION */}

      <View style={styles.bottomPerforation}>
        {Array.from({ length: 12 }).map((_, index) => (
          <View key={index} style={styles.perforationDot} />
        ))}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.92} onPress={onPress}>
        {ticketContent}
      </TouchableOpacity>
    );
  }

  return ticketContent;
}

export default MemoryTicket;
