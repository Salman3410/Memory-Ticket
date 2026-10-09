import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./previewActionsStyles";

function PreviewActions({
  onSave,
  onEdit,
  theme,
  isDark,
}) {
  const colors = theme?.colors || {};

  const primaryColor =
    colors.primary || "#34345C";

  const surfaceColor =
    colors.surface ||
    colors.card ||
    (isDark ? "#232333" : "#FFFFFF");

  const textColor =
    colors.text ||
    (isDark ? "#F1F0F6" : "#242424");

  const borderColor =
    colors.border ||
    (isDark ? "#38384C" : "#D9D8E2");

  return (
    <View style={styles.container}>
      {/* SAVE MEMORY */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          {
            backgroundColor: primaryColor,
          },
        ]}
        onPress={onSave}
        activeOpacity={0.85}
      >
        <Ionicons
          name="bookmark-outline"
          size={20}
          color="#FFFFFF"
        />

        <Text style={styles.saveButtonText}>
          SAVE MEMORY
        </Text>
      </TouchableOpacity>

      {/* EDIT */}
      <TouchableOpacity
        style={[
          styles.editButton,
          {
            backgroundColor: surfaceColor,
            borderColor,
          },
        ]}
        onPress={onEdit}
        activeOpacity={0.8}
      >
        <Ionicons
          name="create-outline"
          size={19}
          color={primaryColor}
        />

        <Text
          style={[
            styles.editButtonText,
            {
              color: primaryColor || textColor,
            },
          ]}
        >
          EDIT
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default PreviewActions;
