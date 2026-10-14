import React, { useMemo } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";
import { createDashboardStyles } from "../dashboardStyles";

function OnThisDayCard({ memories = [], onPress }) {
  const { theme, isDark } = useTheme();

  const styles = useMemo(
    () => createDashboardStyles(theme, isDark),
    [theme, isDark]
  );

  const hasMemories = memories.length > 0;
  const primaryColor = theme.colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.onThisDayCard}
    >
      <View style={styles.onThisDayLeft}>
        <View style={styles.onThisDayIcon}>
          <Ionicons
            name="time-outline"
            size={18}
            color={primaryColor}
          />
        </View>

        <View style={styles.onThisDayTextWrapper}>
          <Text style={styles.onThisDayEyebrow}>
            ON THIS DAY
          </Text>

          <Text style={styles.onThisDayTitle}>
            {hasMemories
              ? `${memories.length} ${
                  memories.length === 1
                    ? "memory"
                    : "memories"
                } from 1 year ago`
              : "Nothing from 1 year ago"}
          </Text>

          <Text style={styles.onThisDaySubtitle}>
            {hasMemories
              ? "Rediscover a piece of your past."
              : "Maybe today will become a memory worth keeping."}
          </Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color={primaryColor}
      />
    </TouchableOpacity>
  );
}

export default React.memo(OnThisDayCard);
