import React, { useEffect, useMemo } from "react";

import { Text, View } from "react-native";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { styles } from "../dashboardStyles";

function AnimatedBar({ height, delay }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [delay, progress]);

  const animatedBarStyle = useAnimatedStyle(() => ({
    height: height * progress.value,
  }));

  return <Animated.View style={[styles.bar, animatedBarStyle]} />;
}

function MemoryPulseCard({ activity, thisMonthCount, mostActiveMonth }) {
  const maxCount = useMemo(() => {
    return Math.max(...activity.map((item) => item.count), 1);
  }, [activity]);

  const cardOpacity = useSharedValue(0);
  const cardY = useSharedValue(10);

  useEffect(() => {
    cardOpacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });

    cardY.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  }, [cardOpacity, cardY]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [
      {
        translateY: cardY.value,
      },
    ],
  }));

  return (
    <Animated.View style={[styles.pulseCard, cardAnimatedStyle]}>
      <View style={styles.pulseHeader}>
        <View>
          <Text style={styles.pulseTitle}>Memory Pulse</Text>
          <Text style={styles.pulseSubtitle}>Your last 6 months</Text>
        </View>

        <View style={styles.pulseBadge}>
          <Text style={styles.pulseBadgeText}>{thisMonthCount} this month</Text>
        </View>
      </View>

      <View style={styles.chart}>
        {activity.map((item, index) => {
          const height =
            item.count === 0 ? 5 : Math.max(12, (item.count / maxCount) * 110);

          return (
            <View key={`${item.year}-${item.month}`} style={styles.barColumn}>
              <Text style={styles.barValue}>{item.count || ""}</Text>

              <View style={styles.barTrack}>
                <AnimatedBar height={height} delay={index * 70} />
              </View>

              <Text style={styles.barLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>

      {mostActiveMonth.count > 0 && (
        <Text style={styles.pulseInsight}>
          Your busiest month was{" "}
          <Text style={styles.pulseInsightStrong}>{mostActiveMonth.label}</Text>{" "}
          with{" "}
          <Text style={styles.pulseInsightStrong}>{mostActiveMonth.count}</Text>{" "}
          {mostActiveMonth.count === 1 ? "memory" : "memories"}.
        </Text>
      )}
    </Animated.View>
  );
}

export default React.memo(MemoryPulseCard);
