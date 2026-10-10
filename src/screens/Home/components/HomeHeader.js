import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";

import styles from "../homeStyles";

function HomeHeader({ navigation }) {
  return (
    <View style={[styles.header, { backgroundColor: colors.background || (isDark ? "#171624" : "#F1F0F6") }]}>
      <View>
        <Text style={[styles.eyebrow, { color: colors.accent || "#E76F51" }]}>YOUR MEMORY JOURNAL</Text>

        <Text style={[styles.title, { color: colors.text || (isDark ? "#F7F5FC" : "#242424") }]}>Keep the moment.</Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary || (isDark ? "#C4C0D0" : "#707080") }]}>Keep the story.</Text>
      </View>

      <TouchableOpacity
        style={[styles.profileButton, { backgroundColor: colors.surface || (isDark ? "#211F30" : "#FFFFFF"), borderColor: colors.border || (isDark ? "#39364D" : "#D9D8E2") }]}
        onPress={() => navigation.navigate("Profile")}
        activeOpacity={0.8}
      >
        <Ionicons name="person-outline" size={21} color={colors.primary || "#34345C"} />
      </TouchableOpacity>
    </View>
  );
}

export default HomeHeader;
