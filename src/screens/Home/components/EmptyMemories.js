import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../homeStyles";
import { useTheme } from "../../../context/ThemeContext";

function EmptyMemories({ navigation }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};
  const screenBackground = colors.background || (isDark ? "#171624" : "#F1F0F6");
  const surfaceColor = colors.surface || (isDark ? "#211F30" : "#FFFFFF");
  const textColor = colors.text || (isDark ? "#F7F5FC" : "#242424");
  const secondaryTextColor = colors.textSecondary || colors.textMuted || (isDark ? "#C4C0D0" : "#707080");
  const borderColor = colors.border || (isDark ? "#39364D" : "#D9D8E2");

  return (
    <View style={[styles.emptyCard, { backgroundColor: surfaceColor, borderColor }]}>
      <View style={[styles.emptyIcon, { backgroundColor: surfaceColor, borderColor }]}>
        <Ionicons name="images-outline" size={25} color={colors.primary || "#34345C"} />
      </View>

      <Text style={[styles.emptyTitle, { color: textColor }]}>Nothing here yet</Text>

      <Text style={[styles.emptyDescription, { color: secondaryTextColor }]}>
        Your captured memories will appear here.
      </Text>

      <TouchableOpacity
        style={[styles.emptyButton, { backgroundColor: colors.primary || '#34345C', borderColor }, { backgroundColor: surfaceColor, borderColor }]}
        onPress={() => navigation.navigate("Create")}
        activeOpacity={0.85}
      >
        <Text style={[styles.emptyButtonText, { color: colors.primaryText || "#FFFFFF" }]}>CREATE ONE</Text>
      </TouchableOpacity>
    </View>
  );
}

export default EmptyMemories;
