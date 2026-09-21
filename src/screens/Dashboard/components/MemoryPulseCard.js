import React, { useMemo } from "react";

import { Text, View } from "react-native";

import { styles } from "../dashboardStyles";

function MemoryPulseCard({ activity, thisMonthCount, mostActiveMonth }) {
  const maxCount = useMemo(() => {
    return Math.max(...activity.map((item) => item.count), 1);
  }, [activity]);

  return (
    <View style={styles.pulseCard}>
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
        {activity.map((item) => {
          const height =
            item.count === 0 ? 5 : Math.max(12, (item.count / maxCount) * 110);

          return (
            <View key={`${item.year}-${item.month}`} style={styles.barColumn}>
              <Text style={styles.barValue}>{item.count || ""}</Text>

              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height,
                    },
                  ]}
                />
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
    </View>
  );
}

export default React.memo(MemoryPulseCard);
