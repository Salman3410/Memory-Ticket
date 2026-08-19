import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { File } from "expo-file-system";

import { useMemory } from "../../context/MemoryContext";
import { useAuth } from "../../hooks/useAuth";

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
        if (!memory.image) {
          continue;
        }

        try {
          const file = new File(memory.image);

          const info = file.info();

          if (info.exists && info.size) {
            totalBytes += info.size;
          }
        } catch (error) {
          // Some image URIs may no longer exist.
          // Ignore them instead of breaking the whole calculation.
          console.log("Unable to calculate image size:", error);
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
      const savedNotifications = await AsyncStorage.getItem(
        "notificationsEnabled",
      );

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

      await AsyncStorage.setItem("notificationsEnabled", value.toString());
    } catch (error) {
      console.log("Save notification setting error:", error);
    }
  };

  // --------------------------------------------------
  // DELETE MEMORY IMAGE FILES
  // --------------------------------------------------

  const deleteMemoryImages = async () => {
    for (const memory of memories) {
      if (!memory.image) {
        continue;
      }

      try {
        const file = new File(memory.image);

        const info = file.info();

        if (info.exists) {
          file.delete();
        }
      } catch (error) {
        console.log("Unable to delete memory image:", error);
      }
    }
  };

  // --------------------------------------------------
  // CLEAR MEMORY STORAGE
  // --------------------------------------------------

  const handleClearStorage = () => {
    if (memories.length === 0) {
      Alert.alert("Memory Storage", "There are no memories to clear.");

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
                "All memory tickets and their photos have been removed.",
              );
            } catch (error) {
              console.log("Clear storage error:", error);

              Alert.alert(
                "Error",
                "Unable to completely clear memory storage.",
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
              console.log("Delete account error:", error);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --------------------------------------------------
            HEADER
        -------------------------------------------------- */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={21} color="#34345C" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerEyebrow}>APP PREFERENCES</Text>

            <Text style={styles.headerTitle}>Settings</Text>
          </View>
        </View>

        {/* --------------------------------------------------
            PREFERENCES
        -------------------------------------------------- */}

        <Text style={styles.sectionTitle}>PREFERENCES</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#34345C"
              />
            </View>

            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Notifications</Text>

              <Text style={styles.rowSubtitle}>
                Get reminders about your memories
              </Text>
            </View>

            {!loading && (
              <Switch
                value={notifications}
                onValueChange={handleNotifications}
                trackColor={{
                  false: "#D9D8E2",
                  true: "#E7A18F",
                }}
                thumbColor={notifications ? "#E76F51" : "#FFFFFF"}
              />
            )}
          </View>
        </View>

        {/* --------------------------------------------------
    STORAGE
-------------------------------------------------- */}

        <Text style={styles.sectionTitle}>STORAGE</Text>

        <View style={styles.card}>
          <View style={styles.storageContainer}>
            {/* HEADER */}

            <View style={styles.storageHeader}>
              <View style={styles.iconBox}>
                <Ionicons name="images-outline" size={20} color="#34345C" />
              </View>

              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>Memory Storage</Text>

                <Text style={styles.rowSubtitle}>
                  Your memories and photos are stored locally on this device.
                </Text>
              </View>
            </View>

            {/* MEMORY COUNT */}

            <View style={styles.storageInfo}>
              <Ionicons name="ticket-outline" size={15} color="#E76F51" />

              <Text style={styles.storageCount}>
                {memories.length}{" "}
                {memories.length === 1 ? "memory ticket" : "memory tickets"}
              </Text>
            </View>

            {/* STORAGE SIZE */}

            <View style={styles.storageInfo}>
              <Ionicons name="folder-outline" size={15} color="#E76F51" />

              <Text style={styles.storageCount}>
                {storageLoading
                  ? "Calculating..."
                  : `${formatStorageSize(storageSize)} used`}
              </Text>
            </View>

            {/* STORAGE DETAILS */}

            <View style={styles.storageDetails}>
              <View style={styles.storageUsageRow}>
                <Text style={styles.storageUsageLabel}>LOCAL STORAGE</Text>

                <Text style={styles.storageUsageValue}>
                  {storageLoading ? "..." : formatStorageSize(storageSize)}
                </Text>
              </View>

              <View style={styles.storageBreakdown}>
                <View style={styles.storageBreakdownRow}>
                  <Text style={styles.storageBreakdownLabel}>
                    Memory photos
                  </Text>

                  <Text style={styles.storageBreakdownValue}>
                    {storageLoading ? "..." : formatStorageSize(storageSize)}
                  </Text>
                </View>

                <View style={styles.storageBreakdownRow}>
                  <Text style={styles.storageBreakdownLabel}>
                    Memory records
                  </Text>

                  <Text style={styles.storageBreakdownValue}>
                    {memories.length}{" "}
                    {memories.length === 1 ? "ticket" : "tickets"}
                  </Text>
                </View>
              </View>
            </View>

            {/* CLEAR STORAGE */}

            <TouchableOpacity
              style={styles.clearStorageButton}
              onPress={handleClearStorage}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={16} color="#D9534F" />

              <Text style={styles.clearStorageText}>CLEAR MEMORY STORAGE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --------------------------------------------------
            APPEARANCE
        -------------------------------------------------- */}

        <Text style={styles.sectionTitle}>APPEARANCE</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Ionicons
                name="color-palette-outline"
                size={20}
                color="#34345C"
              />
            </View>

            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Memory Ticket Theme</Text>

              <Text style={styles.rowSubtitle}>
                Minimal, nostalgic and personal.
              </Text>
            </View>

            <Text style={styles.themeText}>DEFAULT</Text>
          </View>
        </View>

        {/* --------------------------------------------------
            ACCOUNT
        -------------------------------------------------- */}

        <Text style={styles.sectionTitle}>ACCOUNT</Text>

        <View style={styles.card}>
          {/* CHANGE PASSWORD */}

          <TouchableOpacity
            style={styles.accountRow}
            onPress={() => navigation.navigate("ChangePassword")}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, styles.passwordIconBox]}>
              <Ionicons name="lock-closed-outline" size={20} color="#34345C" />
            </View>

            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Change Password</Text>

              <Text style={styles.rowSubtitle}>
                Update your account password
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#A4A3AE" />
          </TouchableOpacity>

          <View style={styles.accountDivider} />

          {/* DELETE ACCOUNT */}

          <TouchableOpacity
            style={styles.accountRow}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, styles.deleteIconBox]}>
              <Ionicons name="trash-outline" size={20} color="#D9534F" />
            </View>

            <View style={styles.rowContent}>
              <Text style={[styles.rowTitle, styles.deleteTitle]}>
                Delete Account
              </Text>

              <Text style={styles.rowSubtitle}>
                Permanently delete your account and memories
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#A4A3AE" />
          </TouchableOpacity>
        </View>

        {/* --------------------------------------------------
            FOOTER
        -------------------------------------------------- */}

        <Text style={styles.footerText}>MEMORY TICKET • VERSION 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

export default SettingsScreen;
