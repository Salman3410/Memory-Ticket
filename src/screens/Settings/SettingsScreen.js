import {
  useEffect,
  useState,
} from "react";
import {
  View,
  Text,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { File } from "expo-file-system";
import { useMemory } from "../../hooks/useMemory";
import { useAuth } from "../../hooks/useAuth";
import { useAppAlert } from "../../context/AlertContext";
import { useSubscription } from "../../context/SubscriptionContext";
import {
  isNotificationsEnabled,
  setNotificationsEnabled,
  getNotificationPermissionStatus,
} from "../../services/notificationService";
import {
  getAppLockEnabled,
  setAppLockEnabled,
  getBiometricSupport,
} from "../../services/appLockService";
import { syncMementoWidget } from "../../services/widgetService";
import SettingsHeader from "./components/SettingsHeader";
import PreferenceRow from "./components/PreferenceRow";
import StorageSection from "./components/StorageSection";
import AppearanceSection from "./components/AppearanceSection";
import AccountSection from "./components/AccountSection";
import styles from "./settingsStyles";

function SettingsScreen({ navigation }) {
  const { memories, clearMemories } = useMemory();
  const { deleteAccount } = useAuth();
  useSubscription();
  const { showAlert } = useAppAlert();

  const [notifications, setNotifications] = useState(false);
  const [appLock, setAppLock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [storageSize, setStorageSize] = useState(0);
  const [storageLoading, setStorageLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    calculateStorage();
    syncMementoWidget(memories).catch((error) => {
      console.warn("Widget sync failed:", error);
    });
  }, [memories]);

  const calculateStorage = async () => {
    try {
      setStorageLoading(true);
      const localImageUris = [];

      for (const memory of memories) {
        if (Array.isArray(memory.localImages) && memory.localImages.length) {
          localImageUris.push(...memory.localImages.filter(Boolean));
          continue;
        }

        const memoryImages = Array.isArray(memory.images)
          ? memory.images
          : memory.image
            ? [memory.image]
            : [];

        localImageUris.push(
          ...memoryImages.filter(
            (uri) => typeof uri === "string" && uri.startsWith("file://"),
          ),
        );
      }

      const uniqueImageUris = [...new Set(localImageUris)];
      const sizes = await Promise.all(
        uniqueImageUris.map(async (imageUri) => {
          try {
            if (
              typeof imageUri !== "string" ||
              !imageUri.startsWith("file://")
            ) {
              return 0;
            }

            const file = new File(imageUri);
            const info = file.info();

            return info.exists && typeof info.size === "number"
              ? info.size
              : 0;
          } catch {
            return 0;
          }
        }),
      );

      setStorageSize(sizes.reduce((total, size) => total + size, 0));
    } catch (error) {
      console.error("Storage calculation error:", error);
      setStorageSize(0);
    } finally {
      setStorageLoading(false);
    }
  };

  const formatStorageSize = (bytes) => {
    if (!bytes || bytes <= 0) return "0 KB";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const loadSettings = async () => {
    try {
      const [savedNotifications, savedAppLock] = await Promise.all([
        isNotificationsEnabled(),
        getAppLockEnabled(),
      ]);

      setNotifications(savedNotifications);
      setAppLock(savedAppLock);
    } catch (error) {
      console.log("Load settings error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotifications = async (value) => {
    try {
      const result = await setNotificationsEnabled(value, memories);

      setNotifications(result.enabled);

      if (result.permissionDenied) {
        showAlert({
          type: "warning",
          icon: "notifications-off-outline",
          title: "Notifications Permission Required",
          message:
            "Memento cannot schedule reminders until notification permission is granted.",
          confirmText: "OK",
        });
      }
    } catch (error) {
      console.error("Notification setting error:", error);
      setNotifications(false);
      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Notifications Failed",
        message: "Unable to update notification settings. Please try again.",
        confirmText: "OK",
      });
    }
  };

  const handleAppLock = async (value) => {
    if (!value) {
      await setAppLockEnabled(false);
      setAppLock(false);
      return;
    }

    try {
      const support = await getBiometricSupport();

      if (!support.supported) {
        showAlert({
          type: "warning",
          icon: "finger-print-outline",
          title: "Biometrics Unavailable",
          message:
            "Set up a fingerprint, face unlock, or another supported biometric method on this device before enabling Memento App Lock.",
          confirmText: "OK",
        });
        return;
      }

      const { authenticateAppLock } = await import("../../services/appLockService");
      const result = await authenticateAppLock();

      if (!result.success) {
        showAlert({
          type: "warning",
          icon: "lock-closed-outline",
          title: "Authentication Required",
          message: "Authenticate successfully to enable Memento App Lock.",
          confirmText: "OK",
        });
        return;
      }

      await setAppLockEnabled(true);
      setAppLock(true);
    } catch (error) {
      console.error("App lock setting error:", error);
      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "App Lock Failed",
        message: "Unable to update App Lock. Please try again.",
        confirmText: "OK",
      });
    }
  };

  const handleClearStorage = () => {
    if (memories.length === 0) {
      showAlert({
        type: "info",
        icon: "information-circle-outline",
        title: "Memory Storage",
        message: "There are no memories to clear.",
        confirmText: "OK",
      });
      return;
    }

    showAlert({
      type: "danger",
      icon: "trash-outline",
      title: "Clear Memory Storage?",
      message: `This will permanently delete all ${memories.length} memory ${memories.length === 1 ? "ticket" : "tickets"} from your account.\n\nThis action cannot be undone.`,
      cancelText: "Cancel",
      confirmText: "Clear Storage",
      showCancel: true,
      onConfirm: async () => {
        try {
          const result = await clearMemories();

          if (result && result.success === false) {
            throw new Error(result.message || "Unable to clear memory storage.");
          }

          setStorageSize(0);
          await syncMementoWidget([]);
          showAlert({
            type: "success",
            icon: "checkmark-circle-outline",
            title: "Storage Cleared",
            message: "All memories and their associated images have been deleted.",
            confirmText: "Done",
          });
        } catch (error) {
          console.error("Clear storage error:", error);
          showAlert({
            type: "danger",
            icon: "close-circle-outline",
            title: "Unable to Clear Storage",
            message:
              error?.message ||
              "Unable to completely clear memory storage. Please try again.",
            confirmText: "OK",
          });
        }
      },
    });
  };

  const handleDeleteAccount = () => {
    showAlert({
      type: "danger",
      icon: "person-remove-outline",
      title: "Delete Account?",
      message:
        "This will permanently delete your account, memories, and associated images. This action cannot be undone.",
      cancelText: "Cancel",
      confirmText: "Delete Account",
      showCancel: true,
      onConfirm: async () => {
        try {
          const result = await deleteAccount();

          if (!result.success) {
            showAlert({
              type: "danger",
              icon: "close-circle-outline",
              title: "Delete Account Failed",
              message:
                result.message || "Unable to delete your account.",
              confirmText: "OK",
            });
            return;
          }

          showAlert({
            type: "success",
            icon: "checkmark-circle-outline",
            title: "Account Deleted",
            message:
              "Your account and all associated data have been deleted.",
            confirmText: "Done",
          });
        } catch (error) {
          console.error("Delete account error:", error);
          showAlert({
            type: "danger",
            icon: "close-circle-outline",
            title: "Something Went Wrong",
            message:
              "Unable to delete your account. Please try again.",
            confirmText: "OK",
          });
        }
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SettingsHeader navigation={navigation} />

        <Text style={styles.sectionTitle}>PREFERENCES</Text>

        <PreferenceRow
          notifications={notifications}
          loading={loading}
          onNotificationsChange={handleNotifications}
          title="Notifications"
          subtitle="Get daily reminders and On This Day alerts"
          icon="notifications-outline"
        />

        <PreferenceRow
          notifications={appLock}
          loading={loading}
          onNotificationsChange={handleAppLock}
          title="App Lock"
          subtitle="Protect Memento with device biometrics"
          icon="lock-closed-outline"
        />

        <StorageSection
          memories={memories}
          storageSize={storageSize}
          storageLoading={storageLoading}
          formatStorageSize={formatStorageSize}
          onClearStorage={handleClearStorage}
        />

        <AppearanceSection />

        <AccountSection
          navigation={navigation}
          onDeleteAccount={handleDeleteAccount}
        />

        <Text style={styles.footerText}>MEMENTO • VERSION 2.5.0</Text>
      </ScrollView>
    </View>
  );
}

export default SettingsScreen;
