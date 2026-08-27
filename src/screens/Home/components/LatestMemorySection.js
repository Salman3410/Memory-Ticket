import { View, Text, TouchableOpacity } from "react-native";
import MemoryTicket from "../../../components/MemoryTicket/MemoryTicket";
import styles from "../homeStyles";

function LatestMemorySection({ latestMemory, navigation }) {
  if (!latestMemory) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionEyebrow}>JUST CAPTURED</Text>

          <Text style={styles.sectionTitle}>Your latest memory</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Memories")}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>

      <MemoryTicket
        memory={latestMemory}
        onPress={() =>
          navigation.navigate("MemoryDetails", {
            memoryId: latestMemory.id,
          })
        }
      />
    </View>
  );
}

export default LatestMemorySection;
