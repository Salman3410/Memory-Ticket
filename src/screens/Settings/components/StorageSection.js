import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "../settingsStyles";

function StorageSection({
  memories,
  storageSize,
  storageLoading,
  formatStorageSize,
  onClearStorage,
}) {
  return (
    <>
      <Text style={styles.sectionTitle}>STORAGE</Text>

      <View style={styles.card}>
        <View style={styles.storageContainer}>
          {/* HEADER */}
          <View style={styles.storageHeader}>
            <View style={styles.iconBox}>
              <Ionicons
                name="images-outline"
                size={20}
                color="#34345C"
              />
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
            <Ionicons
              name="ticket-outline"
              size={15}
              color="#E76F51"
            />

            <Text style={styles.storageCount}>
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
              color="#E76F51"
            />

            <Text style={styles.storageCount}>
              {storageLoading
                ? "Calculating..."
                : `${formatStorageSize(storageSize)} used`}
            </Text>
          </View>

          {/* STORAGE DETAILS */}
          <View style={styles.storageDetails}>
            <View style={styles.storageUsageRow}>
              <Text style={styles.storageUsageLabel}>
                LOCAL STORAGE
              </Text>

              <Text style={styles.storageUsageValue}>
                {storageLoading
                  ? "..."
                  : formatStorageSize(storageSize)}
              </Text>
            </View>

            <View style={styles.storageBreakdown}>
              <View style={styles.storageBreakdownRow}>
                <Text style={styles.storageBreakdownLabel}>
                  Memory photos
                </Text>

                <Text style={styles.storageBreakdownValue}>
                  {storageLoading
                    ? "..."
                    : formatStorageSize(storageSize)}
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
            onPress={onClearStorage}
            activeOpacity={0.8}
          >
            <Ionicons
              name="trash-outline"
              size={16}
              color="#D9534F"
            />

            <Text style={styles.clearStorageText}>
              CLEAR MEMORY STORAGE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

export default StorageSection;

