import { View, Text, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "../settingsStyles";

function PreferenceRow({
  notifications,
  loading,
  onNotificationsChange,
}) {
  return (
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
            onValueChange={onNotificationsChange}
            trackColor={{
              false: "#D9D8E2",
              true: "#E7A18F",
            }}
            thumbColor={notifications ? "#E76F51" : "#FFFFFF"}
          />
        )}
      </View>
    </View>
  );
}

export default PreferenceRow;

