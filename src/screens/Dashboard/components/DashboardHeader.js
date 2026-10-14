import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { createDashboardStyles } from "../dashboardStyles";

function DashboardHeader({ name }) {
  const { theme, isDark } = useTheme();

  const styles = useMemo(
    () => createDashboardStyles(theme, isDark),
    [theme, isDark]
  );

  const firstName = name?.trim()?.split(" ")[0] || "there";

  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>YOUR MEMENTO</Text>

      <Text style={styles.greeting}>
        Welcome back, {firstName}
      </Text>

      <Text style={styles.subtitle}>
        A little overview of your memories.
      </Text>
    </View>
  );
}

export default React.memo(DashboardHeader);