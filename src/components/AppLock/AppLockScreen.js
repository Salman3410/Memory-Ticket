import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { authenticateAppLock, getAppLockEnabled } from "../../services/appLockService";
import styles from "./appLockStyles";

function AppLockScreen({ onUnlocked }) {
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
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Ionicons name="lock-closed-outline" size={30} color="#34345C" />
      </View>
      <Text style={styles.title}>Memento is locked</Text>
      <Text style={styles.subtitle}>Unlock Memento to access your memories.</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#34345C" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={unlock} activeOpacity={0.85}>
          <Ionicons name="finger-print-outline" size={19} color="#FFFFFF" />
          <Text style={styles.buttonText}>UNLOCK MEMENTO</Text>
        </TouchableOpacity>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export default AppLockScreen;
