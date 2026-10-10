import { View, Text, TouchableOpacity } from "react-native";
import MemoryTicketHorizontal from "../../../components/MemoryTicket/MemoryTicketHorizontal";
import styles from "../homeStyles";
import { useTheme } from "../../../context/ThemeContext";

function RecentMemoriesSection({ recentMemories, loading, navigation }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};
  const screenBackground = colors.background || (isDark ? "#171624" : "#F1F0F6");
  const surfaceColor = colors.surface || (isDark ? "#211F30" : "#FFFFFF");
  const textColor = colors.text || (isDark ? "#F7F5FC" : "#242424");
  const secondaryTextColor = colors.textSecondary || colors.textMuted || (isDark ? "#C4C0D0" : "#707080");
  const borderColor = colors.border || (isDark ? "#39364D" : "#D9D8E2");

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionEyebrow, { color: secondaryTextColor }]}>YOUR COLLECTION</Text>

          <Text style={[styles.sectionTitle, { color: textColor }]}>Recent memories</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Memories")}
          activeOpacity={0.7}
        >
          <Text style={[styles.viewAllText, { color: secondaryTextColor }]}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={[styles.loadingCard, { backgroundColor: surfaceColor, borderColor }]}>
          <Text style={[styles.loadingText, { color: secondaryTextColor }]}>Loading memories...</Text>
        </View>
      ) : recentMemories.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: surfaceColor, borderColor }]}>
          <View style={[styles.emptyIcon, { backgroundColor: surfaceColor, borderColor }]}>
            {/* Empty state will be extracted next */}
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
      ) : (
        <View style={styles.recentList}>
          {recentMemories.map((memory) => (
            <MemoryTicketHorizontal
              key={memory.id}
              memory={memory}
              onPress={() =>
                navigation.navigate("MemoryDetails", {
                  memoryId: memory.id,
                })
              }
            />
          ))}
        </View>
      )}
    </View>
  );
}

export default RecentMemoriesSection;
