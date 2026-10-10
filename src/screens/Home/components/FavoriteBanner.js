import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../homeStyles";
import { useTheme } from "../../../context/ThemeContext";

function FavoriteBanner({ favoritesCount, navigation }) {
  if (favoritesCount <= 0) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.favoriteBanner, { backgroundColor: colors.surface || (isDark ? "#211F30" : "#FFFFFF"), borderColor: colors.border || (isDark ? "#39364D" : "#D9D8E2") }]}
      onPress={() => navigation.navigate("Memories")}
      activeOpacity={0.85}
    >
      <View style={[styles.favoriteBannerIcon, { backgroundColor: colors.background || (isDark ? "#171624" : "#F1F0F6") }]}>
        <Ionicons name="heart" size={20} color={colors.accent || "#E76F51"} />
      </View>

      <View style={styles.favoriteBannerContent}>
        <Text style={[styles.favoriteBannerTitle, { color: colors.text || (isDark ? "#F7F5FC" : "#242424") }]}>Your favorite moments</Text>

        <Text style={[styles.favoriteBannerDescription, { color: colors.textSecondary || (isDark ? "#C4C0D0" : "#707080") }]}>
          {favoritesCount} {favoritesCount === 1 ? "memory" : "memories"} you've
          chosen to keep close.
        </Text>
      </View>

      <Ionicons name="arrow-forward" size={18} color={colors.primary || "#34345C"} />
    </TouchableOpacity>
  );
}

export default FavoriteBanner;
