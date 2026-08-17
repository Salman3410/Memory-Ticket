import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMemory } from "../../context/MemoryContext";

import styles from "./homeStyles";

function HomeScreen({ navigation }) {
  const { memories } = useMemory();

  const recentMemories = memories.slice(0, 3);
  const memoryCount = memories.length;
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>WELCOME BACK</Text>

            <Text style={styles.userName}>Your memories await.</Text>
          </View>

          <TouchableOpacity
            style={styles.settingsButton}
            activeOpacity={0.7}
            onPress={() => console.log("Settings")}
          >
            <Ionicons name="settings-outline" size={21} color="#34345C" />
          </TouchableOpacity>
        </View>

        {/* Hero / Capture Memory */}
        <View style={styles.heroCard}>
          <View style={styles.heroDecorationOne} />
          <View style={styles.heroDecorationTwo} />

          <View style={styles.heroIcon}>
            <Ionicons name="camera-outline" size={30} color="#FFFFFF" />
          </View>

          <Text style={styles.heroTitle}>Capture a Moment</Text>

          <Text style={styles.heroDescription}>
            Turn your favorite moments into something worth keeping.
          </Text>

          <TouchableOpacity
            style={styles.captureButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Create")}
          >
            <Ionicons name="add" size={21} color="#34345C" />

            <Text style={styles.captureButtonText}>CREATE MEMORY</Text>
          </TouchableOpacity>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Recent Memories</Text>

            <Text style={styles.sectionSubtitle}>Your latest moments</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Memories")}
          >
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Empty State */}
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="images-outline" size={32} color="#707080" />
          </View>

          <Text style={styles.emptyTitle}>No memories yet</Text>

          <Text style={styles.emptyDescription}>
            Your first memory is waiting to become a ticket.
          </Text>

          <TouchableOpacity
            style={styles.emptyButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Create")}
          >
            <Text style={styles.emptyButtonText}>CREATE YOUR FIRST MEMORY</Text>
          </TouchableOpacity>
        </View>

        {/* Memory Statistics */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{memories.length}</Text>

            <Text style={styles.statLabel}>MEMORIES</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{memories.length}</Text>

            <Text style={styles.statLabel}>TICKETS</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>

            <Text style={styles.statLabel}>THIS MONTH</Text>
          </View>
        </View>

        {/* Bottom Space */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Floating Create Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("Create")}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

export default HomeScreen;
