import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./editMemoryHeaderStyles";

function EditMemoryHeader({ onBack }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={22} color="#242424" />
      </TouchableOpacity>

      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerEyebrow}>EDIT MEMORY</Text>

        <Text style={styles.headerTitle}>Update Ticket</Text>
      </View>

      <View style={styles.headerSpacer} />
    </View>
  );
}

export default EditMemoryHeader;
