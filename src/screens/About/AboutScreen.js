import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./aboutStyles";

function AboutScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={21} color="#34345C" />
          </TouchableOpacity>

          <View>
            <Text style={styles.eyebrow}>THE IDEA</Text>

            <Text style={styles.title}>About Memory Ticket</Text>
          </View>
        </View>

        <View style={styles.logoCard}>
          <View style={styles.logoIcon}>
            <Ionicons name="ticket" size={30} color="#FFFFFF" />
          </View>

          <Text style={styles.logoTitle}>Memory Ticket</Text>

          <Text style={styles.logoSubtitle}>
            Keep the moment. Keep the story.
          </Text>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.heading}>Why Memory Ticket?</Text>

          <Text style={styles.paragraph}>
            Some moments deserve more than a photo sitting silently in your
            gallery.
          </Text>

          <Text style={styles.paragraph}>
            Memory Ticket turns those moments into personal digital ticket stubs,
            giving each memory its own story, place and time.
          </Text>

          <Text style={styles.paragraph}>
            Capture it. Write about it. Keep it.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.feature}>
            <Ionicons name="camera-outline" size={22} color="#E76F51" />

            <View>
              <Text style={styles.featureTitle}>Capture</Text>

              <Text style={styles.featureText}>
                Save the moment with a photo.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.feature}>
            <Ionicons name="create-outline" size={22} color="#E76F51" />

            <View>
              <Text style={styles.featureTitle}>Remember</Text>

              <Text style={styles.featureText}>Add the story behind it.</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.feature}>
            <Ionicons name="ticket-outline" size={22} color="#E76F51" />

            <View>
              <Text style={styles.featureTitle}>Keep</Text>

              <Text style={styles.featureText}>
                Turn it into your own ticket.
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.version}>MEMORY TICKET • VERSION 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

export default AboutScreen;
