
import TactileButton from "../../../components/common/TactileButton";

import styles from "../createMemoryStyles";

function PreviewButton({ onPress, theme, isDark }) {
  const colors = theme?.colors || {};

  const primaryColor = colors.primary || "#34345C";

  return (
    <TactileButton
      label="PREVIEW TICKET"
      icon="arrow-forward"
      onPress={onPress}
      color={primaryColor}
      textColor="#FFFFFF"
      iconColor="#FFFFFF"
      height={56}
      borderRadius={14}
      depth={4}
      textStyle={styles.continueButtonText}
      accessibilityLabel="Preview ticket"
    />
  );
}

export default PreviewButton;
