import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../../context/ThemeContext";
import styles from "../settingsStyles";

function AppearanceSection() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { colors } = theme;

  return (
    <>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
        APPEARANCE
      </Text>

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
          onPress={toggleTheme}
          accessibilityRole="switch"
          accessibilityLabel="Memento dark mode"
          accessibilityState={{ checked: isDark }}
          style={({ pressed }) => [styles.row, pressed && { opacity: 0.8 }]}
        >
          <View
            style={[
              styles.iconBox,
              { backgroundColor: colors.surfaceSecondary },
            ]}
          >
            <Ionicons
              name={isDark ? "moon-outline" : "color-palette-outline"}
              size={20}
              color={colors.icon}
            />
          </View>

          <View style={styles.rowContent}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              Memento Theme
            </Text>

            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              Minimal, nostalgic and personal.
            </Text>
          </View>

          <View style={styles.themeControl}>
            <Text style={[styles.themeText, { color: colors.accent }]}>
              {isDark ? "DARK" : "LIGHT"}
            </Text>

            <View
              style={[
                styles.themeSwitch,
                {
                  backgroundColor: isDark ? colors.accent : colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.themeSwitchThumb,
                  {
                    transform: [
                      {
                        translateX: isDark ? 18 : 0,
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>
        </Pressable>
      </View>
    </>
  );
}

export default AppearanceSection;
