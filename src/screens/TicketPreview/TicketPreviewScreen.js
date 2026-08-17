import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMemory } from "../../context/MemoryContext";

import styles from "./ticketPreviewStyles";

function TicketPreviewScreen({ route, navigation }) {
  const { addMemory } = useMemory();
  const { memory } = route.params || {};

  const formatDate = (date) => {
    if (!date) {
      return "DATE UNKNOWN";
    }

    const parsedDate = new Date(date);

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSave = async () => {
    try {
      await addMemory(memory);

      navigation.navigate("MainTabs", {
        screen: "Memories",
      });
    } catch (error) {
      console.log("Error saving memory:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#242424" />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerEyebrow}>YOUR MEMORY</Text>

            <Text style={styles.headerTitle}>Ticket Preview</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* Preview Label */}
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>Looks good?</Text>

          <Text style={styles.previewSubtitle}>
            This moment is ready to become a ticket.
          </Text>
        </View>

        {/* Ticket */}
        <View style={styles.ticketContainer}>
          {/* Ticket Top */}
          <View style={styles.ticketTop}>
            <View style={styles.ticketBrand}>
              <Ionicons name="ticket-outline" size={18} color="#FFFFFF" />

              <Text style={styles.ticketBrandText}>MEMORY TICKET</Text>
            </View>

            <Text style={styles.ticketNumber}>#00001</Text>
          </View>

          {/* Photo */}
          <View style={styles.ticketImageContainer}>
            {memory?.image ? (
              <Image
                source={{ uri: memory.image }}
                style={styles.ticketImage}
              />
            ) : (
              <View style={styles.noImage}>
                <Ionicons name="image-outline" size={40} color="#707080" />
              </View>
            )}
          </View>

          {/* Ticket Information */}
          <View style={styles.ticketInfo}>
            <Text style={styles.ticketEventLabel}>MEMORY</Text>

            <Text style={styles.ticketTitle}>
              {memory?.title || "Untitled Memory"}
            </Text>

            <View style={styles.ticketDivider} />

            {/* Date */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>DATE</Text>

                <Text style={styles.infoValue}>{formatDate(memory?.date)}</Text>
              </View>

              {/* Location */}
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>LOCATION</Text>

                <Text style={styles.infoValue} numberOfLines={1}>
                  {memory?.location || "Unknown"}
                </Text>
              </View>
            </View>

            {/* Description */}
            {memory?.description ? (
              <View style={styles.quoteContainer}>
                <Text style={styles.quoteMark}>“</Text>

                <Text style={styles.description}>{memory.description}</Text>
              </View>
            ) : null}
          </View>

          {/* Perforated Divider */}
          <View style={styles.perforationContainer}>
            <View style={styles.perforationCircleLeft} />

            <View style={styles.dashedLine} />

            <View style={styles.perforationCircleRight} />
          </View>

          {/* Ticket Bottom */}
          <View style={styles.ticketBottom}>
            <Text style={styles.admitText}>ADMIT ONE MEMORY</Text>

            <Text style={styles.ticketSerial}>MT • 00001</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Ionicons name="bookmark-outline" size={20} color="#FFFFFF" />

            <Text style={styles.saveButtonText}>SAVE MEMORY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={19} color="#34345C" />

            <Text style={styles.editButtonText}>EDIT</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Every moment deserves a ticket.</Text>
      </ScrollView>
    </View>
  );
}

export default TicketPreviewScreen;
