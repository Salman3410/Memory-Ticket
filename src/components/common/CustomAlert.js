import React, { useEffect, useRef } from "react";

import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

function CustomAlert({
  visible,
  type = "danger",
  icon,
  title = "Are you sure?",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  showCancel = true,
  onConfirm,
  onCancel,
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),

        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 70,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible, fadeAnim, scaleAnim]);

  const getAlertIcon = () => {
    if (icon) {
      return icon;
    }

    switch (type) {
      case "success":
        return "checkmark-circle";

      case "warning":
        return "warning";

      case "info":
        return "information-circle";

      case "danger":
      default:
        return "trash-outline";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "#4CAF50";

      case "warning":
        return "#F4A261";

      case "info":
        return "#4D7CFE";

      case "danger":
      default:
        return "#E76F51";
    }
  };

  if (!visible) {
    return null;
  }

  const iconColor = getIconColor();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: `${iconColor}18`,
              },
            ]}
          >
            <Ionicons name={getAlertIcon()} size={30} color={iconColor} />
          </View>

          <Text style={styles.title}>{title}</Text>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View
            style={[styles.buttonRow, !showCancel && styles.singleButtonRow]}
          >
            {showCancel && (
              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={onCancel}
              >
                <Text style={styles.cancelText}>{cancelText}</Text>
              </Pressable>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.confirmButton,
                {
                  backgroundColor: iconColor,
                },
                pressed && styles.buttonPressed,
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default CustomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(20, 20, 30, 0.55)",
    paddingHorizontal: 24,
  },

  modalContainer: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#F1F0F6",
    borderRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: "center",
  },

  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 21,
    fontWeight: "700",
    color: "#34345C",
    textAlign: "center",
    marginBottom: 8,
  },

  message: {
    fontSize: 14,
    lineHeight: 21,
    color: "#666675",
    textAlign: "center",
    paddingHorizontal: 10,
    marginBottom: 22,
  },

  buttonRow: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
  },

  singleButtonRow: {
    flexDirection: "column",
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  confirmButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#34345C",
  },

  confirmText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
