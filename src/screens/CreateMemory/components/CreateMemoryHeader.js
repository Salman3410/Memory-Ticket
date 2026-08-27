import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../createMemoryStyles";

function CreateMemoryHeader({ navigation }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={22} color="#242424" />
      </TouchableOpacity>

      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerEyebrow}>CREATE MEMORY</Text>

        <Text style={styles.headerTitle}>New Memory</Text>
      </View>

      <View style={styles.headerSpacer} />
    </View>
  );
}

export default CreateMemoryHeader;
