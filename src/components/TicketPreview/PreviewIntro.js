import { View, Text } from "react-native";
import styles from "./previewIntroStyles";

function PreviewIntro({ theme, isDark }) {
  const colors = theme?.colors || {};

  const textColor = colors.text || (isDark ? "#F1F0F6" : "#242424");

  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#737387");

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          {
            color: textColor,
          },
        ]}
      >
        Looks good?
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color: mutedTextColor,
          },
        ]}
      >
        This moment is ready to become a ticket.
      </Text>
    </View>
  );
}

export default PreviewIntro;
