import React from "react";

import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "./editMemoryActionsStyles";

function EditMemoryActions({
  onSave,
  onCancel,
  loading = false,
  theme,
  isDark,
}) {
  const colors = theme?.colors || {};

  const primaryColor = colors.primary || "#34345C";

  const surfaceColor =
    colors.surface || colors.card || (isDark ? "#232333" : "#FFFFFF");

  const textColor = colors.text || (isDark ? "#F1F0F6" : "#242424");

  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#737387");

  const borderColor = colors.border || (isDark ? "#38384C" : "#D9D8E2");

  return (
    <View style={styles.container}>
      {/* SAVE CHANGES */}

      <TouchableOpacity
        style={[
          styles.saveButton,
          {
            backgroundColor: primaryColor,
            opacity: 1,
          },
        ]}
        onPress={onSave}
        disabled={loading}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel="Save changes"
        accessibilityState={{ disabled: loading, busy: loading }}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons name="checkmark" size={21} color="#FFFFFF" />
        )}

        <Text style={styles.saveButtonText}>
          {loading ? "SAVING..." : "SAVE CHANGES"}
        </Text>
      </TouchableOpacity>

      {/* CANCEL */}

      <TouchableOpacity
        style={[
          styles.cancelButton,
          {
            backgroundColor: surfaceColor,
            borderColor,
          },
        ]}
        onPress={onCancel}
        disabled={loading}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Cancel editing"
      >
        <Text
          style={[
            styles.cancelButtonText,
            {
              color: textColor,
            },
          ]}
        >
          CANCEL
        </Text>
      </TouchableOpacity>

      {/* FOOTER */}

      <Text
        style={[
          styles.footerText,
          {
            color: mutedTextColor,
          },
        ]}
      >
        KEEP THE MOMENT. KEEP THE STORY.
      </Text>
    </View>
  );
}

export default EditMemoryActions;
