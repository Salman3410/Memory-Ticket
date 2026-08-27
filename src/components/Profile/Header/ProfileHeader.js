import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./profileHeaderStyles";

function ProfileHeader({ onSettingsPress }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerEyebrow}>YOUR SPACE</Text>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={onSettingsPress}
        activeOpacity={0.7}
      >
        <Ionicons name="settings-outline" size={21} color="#34345C" />
      </TouchableOpacity>
    </View>
  );
}

export default ProfileHeader;
