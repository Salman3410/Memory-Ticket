import {
  useEffect,
  useState,
} from "react";

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
  const {
    memories,
    clearMemories,
  } = useMemory();

  const {
    deleteAccount,
  } = useAuth();

  const [
    notifications,
    setNotifications,
  ] = useState(true);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    storageSize,
    setStorageSize,
  ] = useState(0);

  const [
    storageLoading,
    setStorageLoading,
  ] = useState(true);

  // --------------------------------------------------
  // LOAD SETTINGS
  // --------------------------------------------------

  useEffect(() => {
    loadSettings();
  }, []);

  // --------------------------------------------------
  // CALCULATE STORAGE WHEN MEMORIES CHANGE
  // --------------------------------------------------

  useEffect(() => {
    calculateStorage();
  }, [memories]);

  // --------------------------------------------------
  // CALCULATE LOCAL IMAGE STORAGE
  // --------------------------------------------------

const calculateStorage = async () => {
  try {
    setStorageLoading(true);

    const localImageUris = [];

    for (const memory of memories) {
      // Prefer persistent local images.
      // These are the files actually consuming
      // device storage.
      if (
        Array.isArray(memory.localImages) &&
        memory.localImages.length
      ) {
        localImageUris.push(
          ...memory.localImages.filter(Boolean),
        );

        continue;
      }

      // Fallback for older/local memories.
      const memoryImages = Array.isArray(
        memory.images,
      )
        ? memory.images
        : memory.image
          ? [memory.image]
          : [];

      localImageUris.push(
        ...memoryImages.filter(
          (uri) =>
            typeof uri === "string" &&
            uri.startsWith("file://"),
        ),
      );
    }

    // Remove duplicate file URIs.
    const uniqueImageUris = [
      ...new Set(localImageUris),
    ];

    // Calculate file sizes in parallel.
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

          if (
            info.exists &&
            typeof info.size === "number"
          ) {
            return info.size;
          }

          return 0;
        } catch (error) {
          console.log(
            "Unable to calculate image size:",
            error,
          );

          return 0;
        }
      }),
    );

    const totalBytes = sizes.reduce(
      (total, size) => total + size,
      0,
    );

    setStorageSize(totalBytes);
  } catch (error) {
    console.error(
      "Storage calculation error:",
      error,
    );

    setStorageSize(0);
  } finally {
    setStorageLoading(false);
  }
};



  // --------------------------------------------------
  // FORMAT STORAGE SIZE
  // --------------------------------------------------

  const formatStorageSize = (
    bytes,
  ) => {
    if (!bytes || bytes <= 0) {
      return "0 KB";
    }

    if (
      bytes <
      1024 * 1024
    ) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  // --------------------------------------------------
  // LOAD SETTINGS
  // --------------------------------------------------

  const loadSettings = async () => {
    try {
      const savedNotifications =
        await AsyncStorage.getItem(
          "notificationsEnabled",
        );

      if (
        savedNotifications !== null
      ) {
        setNotifications(
          savedNotifications ===
            "true",
        );
      }
    } catch (error) {
      console.log(
        "Load settings error:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // SAVE NOTIFICATION SETTING
  // --------------------------------------------------

  const handleNotifications =
    async (value) => {
      try {
        setNotifications(value);

        await AsyncStorage.setItem(
          "notificationsEnabled",
          value.toString(),
        );
      } catch (error) {
        console.log(
          "Save notification setting error:",
          error,
        );
      }
    };

  // --------------------------------------------------
  // CLEAR MEMORY STORAGE
  // --------------------------------------------------

  const handleClearStorage = () => {
    if (memories.length === 0) {
      Alert.alert(
        "Memory Storage",
        "There are no memories to clear.",
      );

      return;
    }

    Alert.alert(
      "Clear Memory Storage",
      `This will permanently delete all ${
        memories.length
      } memory ${
        memories.length === 1
          ? "ticket"
          : "tickets"
      } from your account.\n\nThis action cannot be undone.`,
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
              const result =
                await clearMemories();

              if (
                result &&
                result.success === false
              ) {
                throw new Error(
                  result.message ||
                    "Unable to clear memory storage.",
                );
              }

              setStorageSize(0);

              Alert.alert(
                "Storage Cleared",
                "All memories and their associated images have been deleted.",
              );
            } catch (error) {
              console.error(
                "Clear storage error:",
                error,
              );

              Alert.alert(
                "Unable to Clear Storage",
                error?.message ||
                  "Unable to completely clear memory storage. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  // --------------------------------------------------
  // DELETE ACCOUNT
  // --------------------------------------------------

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account, memories, and associated images. This action cannot be undone.",
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
              const result =
                await deleteAccount();

              if (!result.success) {
                Alert.alert(
                  "Delete Account Failed",
                  result.message ||
                    "Unable to delete your account.",
                );

                return;
              }

              Alert.alert(
                "Account Deleted",
                "Your account and all associated data have been deleted.",
              );
            } catch (error) {
              console.error(
                "Delete account error:",
                error,
              );

              Alert.alert(
                "Error",
                "Unable to delete your account. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  // --------------------------------------------------
  // SCREEN
  // --------------------------------------------------

  return (
    <View
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* Header */}

        <SettingsHeader
          navigation={navigation}
        />

        {/* Preferences */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          PREFERENCES
        </Text>

        <PreferenceRow
          notifications={
            notifications
          }
          loading={loading}
          onNotificationsChange={
            handleNotifications
          }
        />

        {/* Storage */}

        <StorageSection
          memories={memories}
          storageSize={storageSize}
          storageLoading={
            storageLoading
          }
          formatStorageSize={
            formatStorageSize
          }
          onClearStorage={
            handleClearStorage
          }
        />

        {/* Appearance */}

        <AppearanceSection />

        {/* Account */}

        <AccountSection
          navigation={navigation}
          onDeleteAccount={
            handleDeleteAccount
          }
        />

        {/* Footer */}

        <Text
          style={styles.footerText}
        >
          MEMORY TICKET • VERSION 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

export default SettingsScreen;
