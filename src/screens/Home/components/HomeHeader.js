import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";
import styles from "../homeStyles";

function HomeHeader({ navigation }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};

  const backgroundColor =
    colors.background || (isDark ? "#171624" : "#F1F0F6");

  const surfaceColor =
    colors.surface || (isDark ? "#211F30" : "#FFFFFF");

  const textColor =
    colors.text || (isDark ? "#F7F5FC" : "#242424");

  const primaryColor = colors.primary || "#34345C";
  const accentColor = colors.accent || "#E76F51";
  const borderColor =
    colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const handleOpenAssistant = () => {
    const parentNavigation = navigation?.getParent?.();

    if (parentNavigation) {
      parentNavigation.navigate("Assistant");
    } else {
      navigation?.navigate?.("Assistant");
    }
  };

  return (
    <View
      style={[
        styles.header,
        { backgroundColor },
      ]}
    >
      <View style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
        <Text
          style={[
            styles.eyebrow,
            { color: accentColor },
          ]}
          numberOfLines={1}
        >
          YOUR MEMORY JOURNAL
        </Text>

        <Text
          style={[
            styles.title,
            { color: textColor },
          ]}
          numberOfLines={2}
        >
          Keep the moment.
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: primaryColor },
          ]}
          numberOfLines={1}
        >
          Keep the story.
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <TouchableOpacity
          style={{
            height: 42,
            paddingHorizontal: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            borderRadius: 14,
            borderWidth: 1,
            borderColor,
            backgroundColor: surfaceColor,
          }}
          onPress={handleOpenAssistant}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Open Ask Memento AI assistant"
        >
          <Ionicons
            name="sparkles"
            size={17}
            color={accentColor}
          />

          <Text
            style={{
              color: primaryColor,
              fontSize: 12,
              fontWeight: "800",
            }}
          >
            Ask AI
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.profileButton,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
          onPress={() => navigation.navigate("Profile")}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
        >
          <Ionicons
            name="person-outline"
            size={21}
            color={primaryColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HomeHeader;
