import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import TactileButton from "../../common/TactileButton";

function LogoutButton({ onPress }) {
  const { theme } = useTheme();
  const { colors } = theme;

  const dangerColor = colors.danger || "#D9534F";

  return (
    <TactileButton
      label="LOG OUT"
      icon="log-out-outline"
      onPress={onPress}
      color={dangerColor}
      textColor="#FFFFFF"
      iconColor="#FFFFFF"
      height={52}
      borderRadius={14}
      depth={4}
      accessibilityLabel="Log out"
      style={{
        marginTop: 24,
      }}
      textStyle={{
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 1.2,
      }}
    />
  );
}

export default React.memo(LogoutButton);
