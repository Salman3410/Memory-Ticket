import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../createMemoryStyles";

function PreviewButton({ onPress, theme, isDark }) {
  const colors = theme?.colors || {};

  const primaryColor = colors.primary || "#34345C";

  return (
    <TouchableOpacity
      style={[
        styles.continueButton,
        {
          backgroundColor: primaryColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.continueButtonText}>PREVIEW TICKET</Text>

      <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

export default PreviewButton;
