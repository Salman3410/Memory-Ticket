import { View, Text } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import styles from "./memoriesHeaderStyles";

function MemoriesHeader() {
  const { theme, isDark } = useTheme();

  const colors = theme?.colors || {};
  const textColor = colors.text || (isDark ? "#F1F0F6" : "#242424");

  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#737387");

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor:
            colors.background || (isDark ? "#171724" : "#F1F0F6"),
        },
      ]}
    >
      <View>
        <Text
          style={[
            styles.headerEyebrow,
            {
              color: colors.accent || "#E76F51",
            },
          ]}
        >
          YOUR COLLECTION
        </Text>

        <Text
          style={[
            styles.headerTitle,
            {
              color: textColor,
            },
          ]}
        >
          Memories
        </Text>
      </View>
    </View>
  );
}

export default MemoriesHeader;
