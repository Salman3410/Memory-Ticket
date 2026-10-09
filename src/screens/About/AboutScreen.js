import React from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";

import styles from "./aboutStyles";

function AboutScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const { colors } = theme;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={21} color={colors.icon} />
          </TouchableOpacity>

          <View>
            <Text style={[styles.eyebrow, { color: colors.accent }]}>
              THE IDEA
            </Text>

            <Text style={[styles.title, { color: colors.text }]}>
              About Memento
            </Text>
          </View>
        </View>

        {/* BRAND CARD */}

        <View
          style={[
            styles.logoCard,
            {
              backgroundColor: isDark
                ? colors.surfaceSecondary
                : colors.primary,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.logoIcon,
              {
                backgroundColor: colors.accent,
              },
            ]}
          >
            <Ionicons name="ticket" size={30} color="#FFFFFF" />
          </View>

          <Text
            style={[
              styles.logoTitle,
              {
                color:
                  colors.text === "#242424" || !isDark
                    ? "#FFFFFF"
                    : colors.text,
              },
            ]}
          >
            Memento
          </Text>

          <Text
            style={[
              styles.logoSubtitle,
              {
                color: isDark ? colors.textSecondary : "#D9D8E2",
              },
            ]}
          >
            Keep the moment. Keep the story.
          </Text>
        </View>

        {/* ABOUT DESCRIPTION */}

        <View
          style={[
            styles.contentCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.heading, { color: colors.text }]}>
            Why Memento?
          </Text>

          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Some moments deserve more than a photo sitting silently in your
            gallery.
          </Text>

          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Memento turns those moments into personal digital ticket stubs,
            giving each memory its own story, place and time.
          </Text>

          <Text
            style={[
              styles.paragraph,
              {
                color: colors.text,
                fontWeight: "600",
              },
            ]}
          >
            Capture it. Write about it. Keep it.
          </Text>
        </View>

        {/* FEATURES */}

        <View
          style={[
            styles.featureCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {/* CAPTURE */}

          <View style={styles.feature}>
            <Ionicons name="camera-outline" size={22} color={colors.accent} />

            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Capture
              </Text>

              <Text
                style={[styles.featureText, { color: colors.textSecondary }]}
              >
                Save the moment with a photo.
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          {/* REMEMBER */}

          <View style={styles.feature}>
            <Ionicons name="create-outline" size={22} color={colors.accent} />

            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Remember
              </Text>

              <Text
                style={[styles.featureText, { color: colors.textSecondary }]}
              >
                Add the story behind it.
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          {/* KEEP */}

          <View style={styles.feature}>
            <Ionicons name="ticket-outline" size={22} color={colors.accent} />

            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Keep
              </Text>

              <Text
                style={[styles.featureText, { color: colors.textSecondary }]}
              >
                Turn it into your own ticket.
              </Text>
            </View>
          </View>
        </View>

        {/* VERSION */}

        <Text style={[styles.version, { color: colors.textMuted }]}>
          MEMENTO • VERSION 2.5.0
        </Text>
      </ScrollView>
    </View>
  );
}

export default AboutScreen;
