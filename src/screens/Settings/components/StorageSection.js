import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../../context/ThemeContext";
import { useAppAlert } from "../../../context/AlertContext";
import { useMementoNotifications } from "../../../hooks/useMementoNotifications";

import TactileButton from "../../../components/common/TactileButton";

import styles from "../settingsStyles";

function StorageSection({
  memories,
  storageSize,
  storageLoading,
  formatStorageSize,
  onClearStorage,
}) {
  const { theme } = useTheme();
  const { colors } = theme;

  const { showAlert } = useAppAlert();
  const { notify, notifyError } = useMementoNotifications();

  const dangerColor = colors.danger || "#D9534F";

  const handleClearStorage = () => {
    showAlert({
      type: "danger",
      icon: "trash-outline",
      title: "Clear Memory Storage?",
      message:
        "This will remove your locally stored memory tickets and photos from this device. This action cannot be undone.",
      confirmText: "Clear Storage",
      cancelText: "Cancel",
      showCancel: true,
      onConfirm: async () => {
        try {
          const result = await onClearStorage();

          if (result === false || result?.success === false) {
            notifyError(
              "Storage Clear Failed",
              result?.message ||
                "Unable to clear memory storage. Please try again."
            );
            return;
          }

          notify("memoryStorageCleared");
        } catch (error) {
          console.error("Clear memory storage error:", error);

          notifyError(
            "Storage Clear Failed",
            error?.message ||
              "Unable to clear memory storage. Please try again."
          );
        }
      },
    });
  };

  return (
    <>
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.textMuted },
        ]}
      >
        STORAGE
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.storageContainer}>
          {/* HEADER */}

          <View style={styles.storageHeader}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: colors.surfaceSecondary,
                },
              ]}
            >
              <Ionicons
                name="images-outline"
                size={20}
                color={colors.icon}
              />
            </View>

            <View style={styles.rowContent}>
              <Text
                style={[
                  styles.rowTitle,
                  { color: colors.text },
                ]}
              >
                Memory Storage
              </Text>

              <Text
                style={[
                  styles.rowSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                Your memories and photos are stored locally on this device.
              </Text>
            </View>
          </View>

          {/* MEMORY COUNT */}

          <View style={styles.storageInfo}>
            <Ionicons
              name="ticket-outline"
              size={15}
              color={colors.accent}
            />

            <Text
              style={[
                styles.storageCount,
                { color: colors.accent },
              ]}
            >
              {memories.length}{" "}
              {memories.length === 1
                ? "memory ticket"
                : "memory tickets"}
            </Text>
          </View>

          {/* STORAGE SIZE */}

          <View style={styles.storageInfo}>
            <Ionicons
              name="folder-outline"
              size={15}
              color={colors.accent}
            />

            <Text
              style={[
                styles.storageCount,
                { color: colors.accent },
              ]}
            >
              {storageLoading
                ? "Calculating..."
                : `${formatStorageSize(storageSize)} used`}
            </Text>
          </View>

          {/* STORAGE DETAILS */}

          <View
            style={[
              styles.storageDetails,
              {
                borderTopColor: colors.divider,
              },
            ]}
          >
            <View style={styles.storageUsageRow}>
              <Text
                style={[
                  styles.storageUsageLabel,
                  { color: colors.textMuted },
                ]}
              >
                LOCAL STORAGE
              </Text>

              <Text
                style={[
                  styles.storageUsageValue,
                  { color: colors.text },
                ]}
              >
                {storageLoading
                  ? "..."
                  : formatStorageSize(storageSize)}
              </Text>
            </View>

            <View style={styles.storageBreakdown}>
              <View style={styles.storageBreakdownRow}>
                <Text
                  style={[
                    styles.storageBreakdownLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Memory photos
                </Text>

                <Text
                  style={[
                    styles.storageBreakdownValue,
                    { color: colors.text },
                  ]}
                >
                  {storageLoading
                    ? "..."
                    : formatStorageSize(storageSize)}
                </Text>
              </View>

              <View style={styles.storageBreakdownRow}>
                <Text
                  style={[
                    styles.storageBreakdownLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Memory records
                </Text>

                <Text
                  style={[
                    styles.storageBreakdownValue,
                    { color: colors.text },
                  ]}
                >
                  {memories.length}{" "}
                  {memories.length === 1 ? "ticket" : "tickets"}
                </Text>
              </View>
            </View>
          </View>

          {/* CLEAR STORAGE BUTTON */}

          <TactileButton
            label="CLEAR MEMORY STORAGE"
            icon="trash-outline"
            onPress={handleClearStorage}
            color={dangerColor}
            baseColor="#8F2929"
            textColor="#FFFFFF"
            iconColor="#FFFFFF"
            height={48}
            borderRadius={12}
            depth={3}
            accessibilityLabel="Clear memory storage"
            accessibilityHint="Opens a confirmation before clearing local memory storage"
            style={{
              marginTop: 14,
            }}
            textStyle={{
              fontSize: 10,
              fontWeight: "900",
              letterSpacing: 1,
              color: "#FFFFFF",
            }}
          />
        </View>
      </View>
    </>
  );
}

export default StorageSection;