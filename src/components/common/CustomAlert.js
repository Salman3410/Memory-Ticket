import {
  useEffect,
  useRef,
} from "react";

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
  showClose = true,
  onConfirm,
  onCancel,
  onClose,
}) {
  const fadeAnim =
    useRef(
      new Animated.Value(0),
    ).current;

  const scaleAnim =
    useRef(
      new Animated.Value(0.92),
    ).current;

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.92);

      Animated.parallel([
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          },
        ),

        Animated.spring(
          scaleAnim,
          {
            toValue: 1,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          },
        ),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.92);
    }
  }, [
    visible,
    fadeAnim,
    scaleAnim,
  ]);

  // ==================================================
  // ALERT ICON
  // ==================================================

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

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={
        onClose || (() => {})
      }
    >
      <View
        style={styles.overlay}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity:
                fadeAnim,

              transform: [
                {
                  scale:
                    scaleAnim,
                },
              ],
            },
          ]}
        >
          {/* ==================================================
              CLOSE BUTTON
          ================================================== */}

          {showClose && (
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,

                pressed &&
                  styles.closeButtonPressed,
              ]}
              onPress={
                onClose
              }
              hitSlop={8}
            >
              <Ionicons
                name="close"
                size={19}
                color="#34345C"
              />
            </Pressable>
          )}

          {/* ==================================================
              ICON
          ================================================== */}

          <View
            style={
              styles.iconContainer
            }
          >
            <Ionicons
              name={getAlertIcon()}
              size={30}
              color="#34345C"
            />
          </View>

          {/* ==================================================
              TITLE
          ================================================== */}

          <Text
            style={styles.title}
          >
            {title}
          </Text>

          {/* ==================================================
              MESSAGE
          ================================================== */}

          {message ? (
            <Text
              style={
                styles.message
              }
            >
              {message}
            </Text>
          ) : null}

          {/* ==================================================
              BUTTONS
          ================================================== */}

          <View
            style={[
              styles.buttonRow,

              !showCancel &&
                styles.singleButtonRow,
            ]}
          >
            {showCancel && (
              <Pressable
                style={({
                  pressed,
                }) => [
                  styles.cancelButton,

                  pressed &&
                    styles.buttonPressed,
                ]}
                onPress={
                  onCancel
                }
              >
                <Text
                  style={
                    styles.cancelText
                  }
                >
                  {cancelText}
                </Text>
              </Pressable>
            )}

            <Pressable
              style={({
                pressed,
              }) => [
                styles.confirmButton,

                pressed &&
                  styles.buttonPressed,
              ]}
              onPress={
                onConfirm
              }
            >
              <Text
                style={
                  styles.confirmText
                }
              >
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default CustomAlert;

const styles =
  StyleSheet.create({
    // ==================================================
    // OVERLAY
    // ==================================================

    overlay: {
      flex: 1,

      justifyContent:
        "center",

      alignItems:
        "center",

      backgroundColor:
        "transparent",

      paddingHorizontal: 24,
    },

    // ==================================================
    // MODAL
    // ==================================================

    modalContainer: {
      width: "100%",

      maxWidth: 360,

      backgroundColor:
        "#FFFFFF",

      borderRadius: 22,

      paddingHorizontal: 22,

      paddingTop: 24,

      paddingBottom: 20,

      alignItems: "center",

      shadowColor:
        "#000000",

      shadowOffset: {
        width: 0,
        height: 10,
      },

      shadowOpacity: 0.18,

      shadowRadius: 20,

      elevation: 12,

      position: "relative",
    },

    // ==================================================
    // CLOSE BUTTON
    // ==================================================

    closeButton: {
      position: "absolute",

      top: 12,
      right: 12,

      width: 36,
      height: 36,

      borderRadius: 12,

      backgroundColor:
        "#F1F0F6",

      borderWidth: 1,

      borderColor:
        "#D9D8E2",

      alignItems:
        "center",

      justifyContent:
        "center",

      zIndex: 10,
    },

    closeButtonPressed: {
      opacity: 0.6,
      transform: [
        {
          scale: 0.94,
        },
      ],
    },

    // ==================================================
    // ICON
    // ==================================================

    iconContainer: {
      width: 58,
      height: 58,

      borderRadius: 29,

      backgroundColor:
        "#F1F0F6",

      justifyContent:
        "center",

      alignItems:
        "center",

      marginBottom: 15,

      borderWidth: 1,

      borderColor:
        "#D9D8E2",
    },

    // ==================================================
    // TITLE
    // ==================================================

    title: {
      fontSize: 20,

      fontWeight: "900",

      color: "#34345C",

      textAlign: "center",

      marginBottom: 8,

      paddingHorizontal: 28,
    },

    // ==================================================
    // MESSAGE
    // ==================================================

    message: {
      fontSize: 13,

      lineHeight: 20,

      fontWeight: "500",

      color: "#242424",

      textAlign: "center",

      paddingHorizontal: 8,

      marginBottom: 22,
    },

    // ==================================================
    // BUTTON ROW
    // ==================================================

    buttonRow: {
      width: "100%",

      flexDirection:
        "row",

      gap: 10,
    },

    singleButtonRow: {
      flexDirection:
        "column",
    },

    // ==================================================
    // CANCEL
    // ==================================================

    cancelButton: {
      flex: 1,

      height: 48,

      borderRadius: 14,

      borderWidth: 1.5,

      borderColor:
        "#34345C",

      justifyContent:
        "center",

      alignItems:
        "center",

      backgroundColor:
        "#FFFFFF",
    },

    // ==================================================
    // CONFIRM
    // ==================================================

    confirmButton: {
      flex: 1,

      height: 48,

      borderRadius: 14,

      justifyContent:
        "center",

      alignItems:
        "center",

      paddingHorizontal: 18,

      backgroundColor:
        "#34345C",
    },

    // ==================================================
    // TEXT
    // ==================================================

    cancelText: {
      fontSize: 13,

      fontWeight: "900",

      letterSpacing: 0.4,

      color: "#34345C",
    },

    confirmText: {
      fontSize: 13,

      fontWeight: "900",

      letterSpacing: 0.4,

      color: "#FFFFFF",
    },

    // ==================================================
    // BUTTON PRESS
    // ==================================================

    buttonPressed: {
      opacity: 0.7,
    },
  });
