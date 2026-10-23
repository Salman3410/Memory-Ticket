
import { View, Text, TouchableOpacity } from "react-native";

import TactileButton from "../../../components/common/TactileButton";

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
    colors.surface ||
    colors.card ||
    (isDark ? "#232333" : "#FFFFFF");

  const textColor =
    colors.text ||
    (isDark ? "#F1F0F6" : "#242424");

  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#737387");

  const borderColor =
    colors.border ||
    (isDark ? "#38384C" : "#D9D8E2");

  return (
    <View style={styles.container}>
      {/* TACTILE SAVE CHANGES */}

      <TactileButton
        label="SAVE CHANGES"
        icon="checkmark"
        onPress={onSave}
        loading={loading}
        loadingText="SAVING..."
        disabled={loading}
        color={primaryColor}
        textColor="#FFFFFF"
        iconColor="#FFFFFF"
        height={56}
        borderRadius={14}
        depth={4}
        accessibilityLabel="Save changes"
        style={styles.saveButton}
        textStyle={styles.saveButtonText}
      />

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
  activeOpacity={0.7}
  accessibilityRole="button"
  accessibilityLabel="Cancel editing"
  accessibilityState={{ disabled: loading }}
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
