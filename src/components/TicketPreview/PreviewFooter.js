import { Text } from "react-native";
import styles from "./previewFooterStyles";

function PreviewFooter({ theme, isDark }) {
  const colors = theme?.colors || {};

  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#737387");

  return (
    <Text
      style={[
        styles.footerText,
        {
          color: mutedTextColor,
        },
      ]}
    >
      Every moment deserves a ticket.
    </Text>
  );
}

export default PreviewFooter;
