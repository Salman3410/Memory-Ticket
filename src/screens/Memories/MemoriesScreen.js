import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMemory } from "../../context/MemoryContext";

import styles from "./memoriesStyles";

function MemoriesScreen({ navigation }) {
  const { memories, loading, deleteMemory } = useMemory();
  console.log(memories);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>YOUR COLLECTION</Text>

            <Text style={styles.headerTitle}>Memories</Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("Create")}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Collection Stats */}
        <View style={styles.collectionCard}>
          <View style={styles.collectionIcon}>
            <Ionicons name="ticket-outline" size={25} color="#FFFFFF" />
          </View>

          <View style={styles.collectionInfo}>
            <Text style={styles.collectionNumber}>{memories.length}</Text>

            <Text style={styles.collectionLabel}>MEMORY TICKETS</Text>
          </View>

          <View style={styles.collectionDecor}>
            <View style={styles.decorCircleOne} />
            <View style={styles.decorCircleTwo} />
          </View>
        </View>

        {/* Filter / Sort */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterButtonActive}
            activeOpacity={0.8}
          >
            <Text style={styles.filterTextActive}>ALL</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
            <Text style={styles.filterText}>RECENT</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sortButton} activeOpacity={0.8}>
            <Ionicons name="swap-vertical" size={16} color="#707080" />

            <Text style={styles.sortText}>SORT</Text>
          </TouchableOpacity>
        </View>

        {/* Memories */}
        {memories.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyTicket}>
              <View style={styles.emptyTicketTop}>
                <Ionicons name="ticket-outline" size={28} color="#34345C" />
              </View>

              <View style={styles.emptyTicketLine} />

              <View style={styles.emptyTicketBody}>
                <View style={styles.emptyTicketTextLine} />
                <View style={styles.emptyTicketTextLineShort} />
              </View>
            </View>

            <Text style={styles.emptyTitle}>Your collection is empty</Text>

            <Text style={styles.emptyDescription}>
              Every great collection starts with one memory. Capture yours and
              turn it into a ticket.
            </Text>

            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate("Create")}
              activeOpacity={0.85}
            >
              <Ionicons name="camera-outline" size={19} color="#FFFFFF" />

              <Text style={styles.createButtonText}>CREATE FIRST MEMORY</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.memoriesList}>
            {memories.map((memory) => (
              <TouchableOpacity
                key={memory.id}
                style={styles.memoryCard}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate("MemoryDetails", {
                    memoryId: memory.id,
                  })
                }
              >
                <Image
                  source={{ uri: memory.image }}
                  style={styles.memoryImage}
                  resizeMode="cover"
                />

                <View style={styles.memoryInfo}>
                  <Text style={styles.memoryTitle}>{memory.title}</Text>

                  {memory.location ? (
                    <View style={styles.locationRow}>
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color="#707080"
                      />

                      <Text style={styles.memoryLocation}>
                        {memory.location}
                      </Text>
                    </View>
                  ) : null}

                  {memory.description ? (
                    <Text style={styles.memoryDescription} numberOfLines={2}>
                      {memory.description}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.footerText}>KEEP THE MOMENT. KEEP THE STORY.</Text>
      </ScrollView>
    </View>
  );
}

export default MemoriesScreen;
