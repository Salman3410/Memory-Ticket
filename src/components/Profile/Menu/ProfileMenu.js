import React from "react";

import { View, Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";

import styles from "./profileMenuStyles";

function ProfileMenu({ title, items }) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
        {title}
      </Text>

      <View
        style={[
          styles.menuContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {items.map((item, index) => (
          <React.Fragment key={item.title}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.menuIcon,
                  {
                    backgroundColor: colors.surfaceSecondary,
                  },
                ]}
              >
                <Ionicons name={item.icon} size={19} color={colors.icon} />
              </View>

              <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, { color: colors.text }]}>
                  {item.title}
                </Text>

                <Text
                  style={[styles.menuSubtitle, { color: colors.textSecondary }]}
                >
                  {item.subtitle}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.iconMuted}
              />
            </TouchableOpacity>

            {index < items.length - 1 && (
              <View
                style={[
                  styles.menuDivider,
                  { backgroundColor: colors.divider },
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </>
  );
}

export default ProfileMenu;
