import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { File } from "expo-file-system";
import { useMemory } from "../../hooks/useMemory";
import { useAuth } from "../../hooks/useAuth";
import SettingsHeader from "./components/SettingsHeader";
import PreferenceRow from "./components/PreferenceRow";
import StorageSection from "./components/StorageSection";
import AppearanceSection from "./components/AppearanceSection";
import AccountSection from "./components/AccountSection";

import styles from "./settingsStyles";

function SettingsScreen({ navigation }) {
  const { memories, clearMemories } = useMemory();
  const { logout } = useAuth();

  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [storageSize, setStorageSize] = useState(0);
  const [storageLoading, setStorageLoading] = useState(true);

  // --------------------------------------------------
  // LOAD SETTINGS
  // --------------------------------------------------

  useEffect(() => {
    loadSettings();
  }, []);

  // --------------------------------------------------
  // CALCULATE MEMORY STORAGE
  // --------------------------------------------------

  useEffect(() => {
    calculateStorage();
  }, [memories]);

  const calculateStorage = async () => {
    try {
      setStorageLoading(true);

      let totalBytes = 0;

      for (const memory of memories) {
        const memoryImages = Array.isArray(memory.images)
          ? memory.images
          : memory.image
            ? [memory.image]
            : [];

        for (const imageUri of memoryImages) {
          if (!imageUri) {
            continue;
          }

          try {
            const file = new File(imageUri);
            const info = file.info();

            if (info.exists && info.size) {
              totalBytes += info.size;
            }
          } catch (error) {
            console.log(
              "Unable to calculate image size:",
              error
            );
          }
        }
      }

      setStorageSize(totalBytes);
    } catch (error) {
      console.log("Storage calculation error:", error);
    } finally {
      setStorageLoading(false);
    }
  };

  // --------------------------------------------------
  // FORMAT STORAGE SIZE
  // --------------------------------------------------

  const formatStorageSize = (bytes) => {
    if (!bytes || bytes <= 0) {
      return "0 KB";
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // --------------------------------------------------
  // LOAD SETTINGS
  // --------------------------------------------------

  const loadSettings = async () => {
    try {
      const savedNotifications =
        await AsyncStorage.getItem("notificationsEnabled");

      if (savedNotifications !== null) {
        setNotifications(savedNotifications === "true");
      }
    } catch (error) {
      console.log("Load settings error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // TOGGLE NOTIFICATIONS
  // --------------------------------------------------

  const handleNotifications = async (value) => {
    try {
      setNotifications(value);

      await AsyncStorage.setItem(
        "notificationsEnabled",
        value.toString()
      );
    } catch (error) {
      console.log(
        "Save notification setting error:",
        error
      );
    }
  };

  // --------------------------------------------------
  // DELETE MEMORY IMAGE FILES
  // --------------------------------------------------

  const deleteMemoryImages = async () => {
    for (const memory of memories) {
      const memoryImages = Array.isArray(memory.images)
        ? memory.images
        : memory.image
          ? [memory.image]
          : [];

      for (const imageUri of memoryImages) {
        if (!imageUri) {
          continue;
        }

        try {
          const file = new File(imageUri);
          const info = file.info();

          if (info.exists) {
            file.delete();
          }
        } catch (error) {
          console.log(
            "Unable to delete memory image:",
            error
          );
        }
      }
    }
  };

  // --------------------------------------------------
  // CLEAR MEMORY STORAGE
  // --------------------------------------------------

  const handleClearStorage = () => {
    if (memories.length === 0) {
      Alert.alert(
        "Memory Storage",
        "There are no memories to clear."
      );

      return;
    }

    Alert.alert(
      "Clear Memory Storage",
      `This will permanently delete all ${memories.length} memory ${
        memories.length === 1 ? "ticket" : "tickets"
      } and their photos from this device.\n\nThis action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear Storage",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete image files first
              await deleteMemoryImages();

              // Delete memory records
              await clearMemories();

              // Reset displayed storage
              setStorageSize(0);

              Alert.alert(
                "Storage Cleared",
                "All memory tickets and their photos have been removed."
              );
            } catch (error) {
              console.log(
                "Clear storage error:",
                error
              );

              Alert.alert(
                "Error",
                "Unable to completely clear memory storage."
              );
            }
          },
        },
      ]
    );
  };

  // --------------------------------------------------
  // DELETE ACCOUNT
  // --------------------------------------------------

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all saved memories. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete memory images
              await deleteMemoryImages();

              // Clear memory records
              await clearMemories();

              // Delete user
              await AsyncStorage.removeItem("user");

              logout();
            } catch (error) {
              console.log(
                "Delete account error:",
                error
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SettingsHeader navigation={navigation} />

        <Text style={styles.sectionTitle}>
          PREFERENCES
        </Text>

        <PreferenceRow
          notifications={notifications}
          loading={loading}
          onNotificationsChange={handleNotifications}
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

        <Text style={styles.footerText}>
          MEMORY TICKET • VERSION 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

export default SettingsScreen;

