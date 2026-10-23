import { Pressable, StyleSheet, Text, View } from "react-native";
import TactileButton from "../common/TactileButton";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

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
  const { theme, isDark } = useTheme();
  const { colors } = theme;

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

  const getAlertColor = () => {
    switch (type) {
      case "success":
        return "#2EAA78";

      case "warning":
        return "#E6A23C";

      case "info":
        return colors.primary;

      case "danger":
      default:
        return colors.danger;
    }
  };

  const alertColor = getAlertColor();

  if (!visible) {
    return null;
  }

  return (
    <View
      style={[
        styles.alertOverlay,
        {
          backgroundColor: isDark
            ? "rgba(0, 0, 0, 0.64)"
            : "rgba(30, 28, 48, 0.28)",
        },
      ]}
    >
      <View
        style={[
          styles.modalContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {/* CLOSE BUTTON */}

        {showClose && (
          <Pressable
            style={({ pressed }) => [
              styles.closeButton,
              {
                backgroundColor: colors.surfaceSecondary,
                borderColor: colors.border,
              },
              pressed && styles.closeButtonPressed,
            ]}
            onPress={onClose}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Close alert"
          >
            <Ionicons name="close" size={19} color={colors.icon} />
          </Pressable>
        )}

        {/* ALERT ICON */}

        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isDark ? `${alertColor}20` : `${alertColor}14`,
              borderColor: isDark ? `${alertColor}55` : `${alertColor}35`,
            },
          ]}
        >
          <Ionicons name={getAlertIcon()} size={30} color={alertColor} />
        </View>

        {/* TITLE */}

        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

        {/* MESSAGE */}

        {message ? (
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {message}
          </Text>
        ) : null}

        {/* ACTION BUTTONS */}

<View
  style={[
    styles.buttonRow,
    !showCancel && styles.singleButtonRow,
  ]}
>
  {showCancel && (
    <TactileButton
      label={cancelText}
      onPress={onCancel}
      color={colors.surface}
      textColor={colors.text}
      height={48}
      borderRadius={14}
      depth={2}
      style={{
        flex: 1,
        width: "auto",
        marginBottom: 0,
      }}
      contentStyle={[
        styles.cancelButton,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      textStyle={[
        styles.cancelText,
        { color: colors.text },
      ]}
    />
  )}

  <TactileButton
    label={confirmText}
    onPress={onConfirm}
    color={type === "danger" ? colors.danger : colors.primary}
    textColor={
      type === "danger" ? "#FFFFFF" : colors.primaryText
    }
    height={48}
    borderRadius={14}
    depth={2}
    style={
      showCancel
        ? {
            flex: 1,
            width: "auto",
            marginBottom: 0,
          }
        : {
            width: "100%",
            marginBottom: 0,
          }
    }
    contentStyle={[
      styles.confirmButton,
      {
        backgroundColor:
          type === "danger" ? colors.danger : colors.primary,
      },
    ]}
    textStyle={[
      styles.confirmText,
      {
        color:
          type === "danger" ? "#FFFFFF" : colors.primaryText,
      },
    ]}
  />
</View>
      </View>
    </View>
  );
}

export default CustomAlert;

const styles = StyleSheet.create({
  alertOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    zIndex: 9999,
    elevation: 9999,
  },

  modalContainer: {
    width: "100%",
    maxWidth: 360,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,

    position: "relative",
  },

  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  closeButtonPressed: {
    opacity: 0.6,
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: 28,
  },

  message: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 8,
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
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },

  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  cancelText: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  confirmText: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  buttonPressed: {
    opacity: 0.7,
  },
});
