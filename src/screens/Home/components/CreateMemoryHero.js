import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "../homeStyles";

function CreateMemoryHero({ navigation }) {
  return (
    <View style={styles.heroCard}>
      <View style={styles.heroContent}>
        <View style={styles.heroIcon}>
          <Ionicons name="camera-outline" size={25} color="#FFFFFF" />
        </View>

        <Text style={styles.heroTitle}>Capture a new memory</Text>

        <Text style={styles.heroDescription}>
          Turn a moment from your life into a ticket you'll want to keep.
        </Text>

        <TouchableOpacity
          style={styles.heroButton}
          onPress={() => navigation.navigate("Create")}
          activeOpacity={0.85}
        >
          <Text style={styles.heroButtonText}>CREATE MEMORY</Text>

          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.heroDecoration}>
        <View style={styles.heroCircleLarge} />
        <View style={styles.heroCircleSmall} />
      </View>
    </View>
  );
}

export default CreateMemoryHero;
