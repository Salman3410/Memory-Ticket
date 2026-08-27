import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../homeStyles";

function EmptyMemories({ navigation }) {
  return (
    <View style={styles.emptyCard}>
      <View style={styles.emptyIcon}>
        <Ionicons name="images-outline" size={25} color="#34345C" />
      </View>

      <Text style={styles.emptyTitle}>Nothing here yet</Text>

      <Text style={styles.emptyDescription}>
        Your captured memories will appear here.
      </Text>

      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate("Create")}
        activeOpacity={0.85}
      >
        <Text style={styles.emptyButtonText}>CREATE ONE</Text>
      </TouchableOpacity>
    </View>
  );
}

export default EmptyMemories;
