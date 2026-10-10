import React, { useEffect, useRef } from "react";

import { Animated, View, Text } from "react-native";

import { useTheme } from "../../../context/ThemeContext";
import styles from "./profileStatsStyles";

function ProfileStats({ stats }) {
  const { theme } = useTheme();
  const { colors } = theme;

  const statOneOpacity = useRef(new Animated.Value(0)).current;
  const statTwoOpacity = useRef(new Animated.Value(0)).current;
  const statThreeOpacity = useRef(new Animated.Value(0)).current;

  const statOneTranslateY = useRef(new Animated.Value(10)).current;
  const statTwoTranslateY = useRef(new Animated.Value(10)).current;
  const statThreeTranslateY = useRef(new Animated.Value(10)).current;

  const dividerOneOpacity = useRef(new Animated.Value(0)).current;
  const dividerTwoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(statOneOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(statOneTranslateY, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(dividerOneOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(statTwoOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(statTwoTranslateY, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(dividerTwoOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(statThreeOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(statThreeTranslateY, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start();

    return () => animation.stop();
  }, [
    statOneOpacity,
    statTwoOpacity,
    statThreeOpacity,
    statOneTranslateY,
    statTwoTranslateY,
    statThreeTranslateY,
    dividerOneOpacity,
    dividerTwoOpacity,
  ]);

  return (
    <View
      style={[
        styles.statsContainer,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.stat,
          {
            opacity: statOneOpacity,
            transform: [{ translateY: statOneTranslateY }],
          },
        ]}
      >
        <Text style={[styles.statNumber, { color: colors.text }]}>
          {stats.memories}
        </Text>

        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          MEMORIES
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.statDivider,
          {
            opacity: dividerOneOpacity,
            backgroundColor: colors.divider,
          },
        ]}
      />

      <Animated.View
        style={[
          styles.stat,
          {
            opacity: statTwoOpacity,
            transform: [{ translateY: statTwoTranslateY }],
          },
        ]}
      >
        <Text style={[styles.statNumber, { color: colors.text }]}>
          {stats.tickets}
        </Text>

        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          TICKETS
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.statDivider,
          {
            opacity: dividerTwoOpacity,
            backgroundColor: colors.divider,
          },
        ]}
      />

      <Animated.View
        style={[
          styles.stat,
          {
            opacity: statThreeOpacity,
            transform: [{ translateY: statThreeTranslateY }],
          },
        ]}
      >
        <Text style={[styles.statNumber, { color: colors.text }]}>
          {stats.favorites}
        </Text>

        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          FAVORITES
        </Text>
      </Animated.View>
    </View>
  );
}

export default ProfileStats;
