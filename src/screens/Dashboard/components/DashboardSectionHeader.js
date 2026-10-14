import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";
import { createDashboardStyles } from "../dashboardStyles";

function DashboardSectionHeader({
  title,
  onPress,
  actionLabel = "See all",
}) {
  const { theme, isDark } = useTheme();

  const styles = useMemo(
    () => createDashboardStyles(theme, isDark),
    [theme, isDark]
  );

  const actionColor = theme.colors.primary;

  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {onPress && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPress}
          style={styles.sectionAction}
        >
          <Text style={styles.sectionActionText}>
            {actionLabel}
          </Text>

          <Ionicons
            name="chevron-forward"
            size={15}
            color={actionColor}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default React.memo(DashboardSectionHeader);