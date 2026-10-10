import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  ActivityIndicator,
  StatusBar,
  Text,
  TouchableOpacity,
  View,

} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { authenticateAppLock, getAppLockEnabled } from "../../services/appLockService";
import styles from "./appLockStyles";

function AppLockScreen({ onUnlocked }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};
  const screenBackground = colors.background || (isDark ? "#171624" : "#F1F0F6");
  const surfaceColor = colors.surface || (isDark ? "#211F30" : "#FFFFFF");
  const textColor = colors.text || (isDark ? "#F7F5FC" : "#242424");
  const secondaryTextColor = colors.textSecondary || colors.textMuted || (isDark ? "#C4C0D0" : "#707080");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const unlock = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      if (!(await getAppLockEnabled())) {
        onUnlocked?.();
        return;
      }

      const result = await authenticateAppLock();

      if (result.success) {
        onUnlocked?.();
      } else {
        setError(
          result.reason === "biometric_unavailable"
            ? "Biometric authentication is unavailable on this device."
            : "Authentication failed. Try again.",
        );
      }
    } catch (authenticationError) {
      console.error("App lock authentication error:", authenticationError);
      setError("Unable to authenticate. Try again.");
    } finally {
      setLoading(false);
    }
  }, [onUnlocked]);

  useEffect(() => {
    unlock();
  }, [unlock]);

  return (
    <View style={[styles.container, { backgroundColor: screenBackground }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={screenBackground} />
      <View style={[styles.iconBox, { backgroundColor: surfaceColor, borderColor: colors.border }]}>
        <Ionicons name="lock-closed-outline" size={30} color={colors.primary || "#34345C"} />
      </View>
      <Text style={[styles.title, { color: textColor }]}>Memento is locked</Text>
      <Text style={[styles.subtitle, { color: secondaryTextColor }]}>Unlock Memento to access your memories.</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#34345C" />
      ) : (
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary || "#34345C" }]} onPress={unlock} activeOpacity={0.85}>
          <Ionicons name="finger-print-outline" size={19} color={colors.primaryText || "#FFFFFF"} />
          <Text style={[styles.buttonText, { color: colors.primaryText || "#FFFFFF" }]}>UNLOCK MEMENTO</Text>
        </TouchableOpacity>
      )}
      {error ? <Text style={[styles.error, { color: colors.danger || "#D9534F" }]}>{error}</Text> : null}
    </View>
  );
}

export default AppLockScreen;
