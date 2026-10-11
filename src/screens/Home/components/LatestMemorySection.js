import { View, Text, TouchableOpacity } from "react-native";
import MemoryTicket from "../../../components/MemoryTicket/MemoryTicket";
import styles from "../homeStyles";
import { useTheme } from "../../../context/ThemeContext";

function LatestMemorySection({ latestMemory, navigation }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};
  const screenBackground = colors.background || (isDark ? "#171624" : "#F1F0F6");
  const surfaceColor = colors.surface || (isDark ? "#211F30" : "#FFFFFF");
  const textColor = colors.text || (isDark ? "#F7F5FC" : "#242424");
  const secondaryTextColor = colors.textSecondary || colors.textMuted || (isDark ? "#C4C0D0" : "#707080");
  const borderColor = colors.border || (isDark ? "#39364D" : "#D9D8E2");

  if (!latestMemory) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionEyebrow, { color: secondaryTextColor }]}>JUST CAPTURED</Text>

          <Text style={[styles.sectionTitle, { color: textColor }]}>Your latest memory</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Memories")}
          activeOpacity={0.7}
        >
          <Text style={[styles.viewAllText, { color: secondaryTextColor }]}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>

      <MemoryTicket
        memory={latestMemory}
        onPress={() =>
          navigation.navigate("MemoryDetails", {
            memoryId: latestMemory.id,
          })
        }
      />
    </View>
  );
}

export default LatestMemorySection;
