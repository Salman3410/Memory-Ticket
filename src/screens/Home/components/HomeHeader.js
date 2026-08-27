import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "../homeStyles";

function HomeHeader({ navigation }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.eyebrow}>YOUR MEMORY JOURNAL</Text>

        <Text style={styles.title}>Keep the moment.</Text>

        <Text style={styles.subtitle}>Keep the story.</Text>
      </View>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate("Profile")}
        activeOpacity={0.8}
      >
        <Ionicons name="person-outline" size={21} color="#34345C" />
      </TouchableOpacity>
    </View>
  );
}

export default HomeHeader;
