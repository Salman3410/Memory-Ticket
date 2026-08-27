import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "../settingsStyles";

function SettingsHeader({ navigation }) {
  return (
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
  );
}

export default SettingsHeader;
