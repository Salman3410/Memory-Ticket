import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";


import { useMemory } from "../../hooks/useMemory";

import MemoryTicket from "../../components/MemoryTicket/MemoryTicket";
import MemoryTicketHorizontal from "../../components/MemoryTicket/MemoryTicketHorizontal";

import styles from "./homeStyles";

function HomeScreen({ navigation }) {
  const { memories, loading } = useMemory();

  // RECENT MEMORIES
  const recentMemories = useMemo(() => {
    return [...memories]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date).getTime();
        const dateB = new Date(b.createdAt || b.date).getTime();

        return dateB - dateA;
      })
      .slice(0, 3);
  }, [memories]);

  // FAVORITE MEMORIES
  const favoriteMemories = useMemo(() => {
    return memories.filter((memory) => memory.favorite === true);
  }, [memories]);

  // LATEST MEMORY
  const latestMemory = recentMemories[0];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>YOUR MEMORY JOURNAL</Text>

            <Text style={styles.title}>Keep the moment.</Text>

            <Text style={styles.subtitle}>Keep the story.</Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("Profile")}
            activeOpacity={0.8}
          >
            <Ionicons name="person-outline" size={21} color="#34345C" />
          </TouchableOpacity>
        </View>

        {/* ==================================================
            MAIN CTA
        ================================================== */}

        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.heroIcon}>
              <Ionicons name="camera-outline" size={25} color="#FFFFFF" />
            </View>

            <Text style={styles.heroTitle}>Capture a new memory</Text>

            <Text style={styles.heroDescription}>
              Turn a moment from your life into a ticket you'll want to keep.
            </Text>

            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => navigation.navigate("Create")}
              activeOpacity={0.85}
            >
              <Text style={styles.heroButtonText}>CREATE MEMORY</Text>

              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.heroDecoration}>
            <View style={styles.heroCircleLarge} />
            <View style={styles.heroCircleSmall} />
          </View>
        </View>

        {/* ==================================================
            STATS
        ================================================== */}

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View>
              <Text style={styles.statNumber}>{memories.length}</Text>

              <Text style={styles.statLabel}>MEMORIES</Text>
            </View>

            <View style={styles.statIcon}>
              <Ionicons name="ticket-outline" size={19} color="#34345C" />
            </View>
          </View>

          <View style={styles.statCard}>
            <View>
              <Text style={styles.statNumber}>{favoriteMemories.length}</Text>

              <Text style={styles.statLabel}>FAVORITES</Text>
            </View>

            <View style={styles.favoriteStatIcon}>
              <Ionicons name="heart-outline" size={19} color="#E76F51" />
            </View>
          </View>
        </View>

        {/* ==================================================
            LATEST MEMORY
        ================================================== */}

        {latestMemory && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>JUST CAPTURED</Text>

                <Text style={styles.sectionTitle}>Your latest memory</Text>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate("Memories")}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>VIEW ALL</Text>
              </TouchableOpacity>
            </View>

            {/* VERTICAL MEMORY TICKET */}

            <MemoryTicket
              memory={latestMemory}
              onPress={() =>
                navigation.navigate("MemoryDetails", {
                  memoryId: latestMemory.id,
                })
              }
            />
          </View>
        )}

        {/* ==================================================
            RECENT MEMORIES
        ================================================== */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>YOUR COLLECTION</Text>

              <Text style={styles.sectionTitle}>Recent memories</Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("Memories")}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllText}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>

          {/* LOADING */}

          {loading ? (
            <View style={styles.loadingCard}>
              <Text style={styles.loadingText}>Loading memories...</Text>
            </View>
          ) : recentMemories.length === 0 ? (
            /* EMPTY STATE */

            <View style={styles.emptyCard}>
              <View style={styles.emptyIcon}>
                <Ionicons name="images-outline" size={25} color="#34345C" />
              </View>

              <Text style={styles.emptyTitle}>Nothing here yet</Text>

              <Text style={styles.emptyDescription}>
                Your captured memories will appear here.
              </Text>

              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate("Create")}
                activeOpacity={0.85}
              >
                <Text style={styles.emptyButtonText}>CREATE ONE</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* HORIZONTAL MEMORY TICKETS */

            <View style={styles.recentList}>
              {recentMemories.map((memory) => (
                <MemoryTicketHorizontal
                  key={memory.id}
                  memory={memory}
                  onPress={() =>
                    navigation.navigate("MemoryDetails", {
                      memoryId: memory.id,
                    })
                  }
                />
              ))}
            </View>
          )}
        </View>

        {/* ==================================================
            FAVORITE SHORTCUT
        ================================================== */}

        {favoriteMemories.length > 0 && (
          <TouchableOpacity
            style={styles.favoriteBanner}
            onPress={() => navigation.navigate("Memories")}
            activeOpacity={0.85}
          >
            <View style={styles.favoriteBannerIcon}>
              <Ionicons name="heart" size={20} color="#E76F51" />
            </View>

            <View style={styles.favoriteBannerContent}>
              <Text style={styles.favoriteBannerTitle}>
                Your favorite moments
              </Text>

              <Text style={styles.favoriteBannerDescription}>
                {favoriteMemories.length}{" "}
                {favoriteMemories.length === 1 ? "memory" : "memories"} you've
                chosen to keep close.
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={18} color="#34345C" />
          </TouchableOpacity>
        )}

        {/* ==================================================
            FOOTER
        ================================================== */}

        <Text style={styles.footerText}>KEEP THE MOMENT. KEEP THE STORY.</Text>
      </ScrollView>
    </View>
  );
}

export default HomeScreen;
