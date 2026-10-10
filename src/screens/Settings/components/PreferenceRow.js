import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";
import styles from "../settingsStyles";

function PreferenceRow({
  notifications,
  loading,
  onNotificationsChange,
  title = "Notifications",
  subtitle = "Get reminders about your memories",
  icon = "notifications-outline",
}) {
  const { theme } = useTheme();
  const { colors } = theme;

  const handleToggle = () => {
    if (loading) return;

    onNotificationsChange(!notifications);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Pressable
        onPress={handleToggle}
        disabled={loading}
        accessibilityRole="switch"
        accessibilityLabel={title}
        accessibilityState={{
          checked: notifications,
          disabled: loading,
        }}
        style={({ pressed }) => [
          styles.row,
          pressed && !loading && { opacity: 0.8 },
        ]}
      >
        {/* ICON */}

        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: colors.surfaceSecondary,
            },
          ]}
        >
          <Ionicons name={icon} size={20} color={colors.icon} />
        </View>

        {/* TEXT */}

        <View style={styles.rowContent}>
          <Text style={[styles.rowTitle, { color: colors.text }]}>{title}</Text>

          <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        </View>

        {/* STATUS & CUSTOM SWITCH */}

        <View style={styles.themeControl}>
          <Text
            style={[
              styles.themeText,
              {
                color: notifications ? colors.accent : colors.textMuted,
              },
            ]}
          >
            {loading ? "..." : notifications ? "ON" : "OFF"}
          </Text>

          <View
            style={[
              styles.themeSwitch,
              {
                backgroundColor: notifications ? colors.accent : colors.border,
                opacity: loading ? 0.55 : 1,
              },
            ]}
          >
            <View
              style={[
                styles.themeSwitchThumb,
                {
                  transform: [
                    {
                      translateX: notifications ? 18 : 0,
                    },
                  ],
                },
              ]}
            />
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export default PreferenceRow;
