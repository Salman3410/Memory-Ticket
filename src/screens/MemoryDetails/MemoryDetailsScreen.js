import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useMemory } from "../../context/MemoryContext";

import styles from "./memoryDetailsStyles";

function MemoryDetailsScreen({ navigation, route }) {
  const { getMemoryById, deleteMemory, updateMemory } = useMemory();

  const { memoryId } = route.params;

  const memory = getMemoryById(memoryId);

  if (!memory) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons name="sad-outline" size={45} color="#34345C" />

        <Text style={styles.notFoundTitle}>Memory not found</Text>

        <TouchableOpacity
          style={styles.backToMemoriesButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backToMemoriesText}>GO BACK</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleFavorite = async () => {
    try {
      await updateMemory(memory.id, {
        favorite: !memory.favorite,
      });
    } catch (error) {
      console.log("Favorite update error:", error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Memory?",
      "This memory will be permanently removed from your collection.",
      [
        {
          text: "CANCEL",
          style: "cancel",
        },
        {
          text: "DELETE",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMemory(memory.id);

              navigation.navigate("MainTabs", {
                screen: "Memories",
              });
            } catch (error) {
              console.log("Delete error:", error);
            }
          },
        },
      ],
    );
  };

  const formattedDate = new Date(memory.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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

          <Text style={styles.headerTitle}>Memory</Text>

          <TouchableOpacity
            style={[
              styles.favoriteButton,
              memory.favorite && styles.favoriteButtonActive,
            ]}
            onPress={handleFavorite}
            activeOpacity={0.8}
          >
            <Ionicons
              name={memory.favorite ? "heart" : "heart-outline"}
              size={21}
              color={memory.favorite ? "#E76F51" : "#34345C"}
            />
          </TouchableOpacity>
        </View>

        {/* Photo */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: memory.image }}
            style={styles.memoryImage}
            resizeMode="cover"
          />

          <View style={styles.photoBadge}>
            <Ionicons name="ticket-outline" size={14} color="#FFFFFF" />

            <Text style={styles.photoBadgeText}>MEMORY TICKET</Text>
          </View>
        </View>

        {/* Ticket Information */}
        <View style={styles.ticketCard}>
          <Text style={styles.eyebrow}>YOUR MEMORY</Text>

          <Text style={styles.title}>{memory.title}</Text>

          <View style={styles.ticketDivider}>
            <View style={styles.cutoutLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.cutoutRight} />
          </View>

          {/* Date */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="calendar-outline" size={18} color="#34345C" />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>DATE</Text>

              <Text style={styles.infoValue}>{formattedDate}</Text>
            </View>
          </View>

          {/* Location */}
          {memory.location ? (
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="location-outline" size={18} color="#34345C" />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>LOCATION</Text>

                <Text style={styles.infoValue}>{memory.location}</Text>
              </View>
            </View>
          ) : null}

          {/* Description */}
          {memory.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.infoLabel}>THE STORY</Text>

              <Text style={styles.description}>{memory.description}</Text>
            </View>
          ) : null}

          <View style={styles.ticketFooter}>
            <Text style={styles.ticketNumber}>
              #{memory.id.slice(-6).toUpperCase()}
            </Text>

            <Ionicons name="heart" size={14} color="#E76F51" />
          </View>
        </View>

        {/* Delete */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={18} color="#D9534F" />

          <Text style={styles.deleteText}>DELETE MEMORY</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>KEEP THE MOMENT. KEEP THE STORY.</Text>
      </ScrollView>
    </View>
  );
}

export default MemoryDetailsScreen;
