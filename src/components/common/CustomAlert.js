import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import AlertTactileButton from "../common/AlertTactileButton";

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
  const colors = theme?.colors || {};

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
        return colors.primary || "#34345C";

      case "danger":
      default:
        return colors.danger || "#D9534F";
    }
  };

  const alertColor = getAlertColor();

  const confirmColor =
    type === "danger"
      ? colors.danger || "#D9534F"
      : colors.primary || "#34345C";

  const confirmTextColor =
    type === "danger"
      ? "#FFFFFF"
      : colors.primaryText || "#FFFFFF";

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
            backgroundColor: colors.surface || "#FFFFFF",
            borderColor: colors.border || "#D9D8E2",
          },
        ]}
      >
        {/* CLOSE BUTTON */}
        {showClose && (
          <Pressable
            style={({ pressed }) => [
              styles.closeButton,
              {
                backgroundColor:
                  colors.surfaceSecondary ||
                  colors.surface ||
                  "#FFFFFF",
                borderColor: colors.border || "#D9D8E2",
              },
              pressed && styles.closeButtonPressed,
            ]}
            onPress={onClose}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Close alert"
          >
            <Ionicons
              name="close"
              size={19}
              color={colors.icon || colors.text || "#34345C"}
            />
          </Pressable>
        )}

        {/* ALERT ICON */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isDark
                ? `${alertColor}20`
                : `${alertColor}14`,
              borderColor: isDark
                ? `${alertColor}55`
                : `${alertColor}35`,
            },
          ]}
        >
          <Ionicons
            name={getAlertIcon()}
            size={30}
            color={alertColor}
          />
        </View>

        {/* TITLE */}
        <Text
          style={[
            styles.title,
            { color: colors.text || "#242424" },
          ]}
        >
          {title}
        </Text>

        {/* MESSAGE */}
        {message ? (
          <Text
            style={[
              styles.message,
              {
                color:
                  colors.textSecondary ||
                  colors.textMuted ||
                  "#707080",
              },
            ]}
          >
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
            <AlertTactileButton
              label={cancelText}
              onPress={onCancel}
              icon="close"
              iconPosition="left"
              color={colors.surface || "#FFFFFF"}
              textColor={colors.text || "#242424"}
              iconColor={colors.text || "#242424"}
              height={48}
              borderRadius={14}
              depth={2}
              style={styles.tactileCancelWrapper}
              contentStyle={[
                styles.cancelButton,
                {
                  backgroundColor: colors.surface || "#FFFFFF",
                  borderColor: colors.border || "#D9D8E2",
                },
              ]}
              textStyle={[
                styles.cancelText,
                { color: colors.text || "#242424" },
              ]}
            />
          )}

          <AlertTactileButton
            label={confirmText}
            onPress={onConfirm}
            icon={
              type === "danger"
                ? "trash-outline"
                : "checkmark"
            }
            iconPosition="left"
            color={confirmColor}
            textColor={confirmTextColor}
            iconColor={confirmTextColor}
            height={48}
            borderRadius={14}
            depth={2}
            style={
              showCancel
                ? styles.tactileConfirmWrapper
                : styles.tactileSingleWrapper
            }
            contentStyle={[
              styles.confirmButton,
              { backgroundColor: confirmColor },
            ]}
            textStyle={[
              styles.confirmText,
              { color: confirmTextColor },
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
    alignItems: "stretch",
    gap: 10,
  },

  singleButtonRow: {
    flexDirection: "column",
  },

  // The dedicated button component has no default wrapper width.
  // Each button receives half the available row width.
  tactileCancelWrapper: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    marginBottom: 0,
  },

  tactileConfirmWrapper: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    marginBottom: 0,
  },

  tactileSingleWrapper: {
    width: "100%",
    marginBottom: 0,
  },

  // Inner button face styles
  cancelButton: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },

  confirmButton: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },

  cancelText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  confirmText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
});