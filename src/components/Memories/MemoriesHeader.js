import { View, Text } from "react-native";
import styles from "./memoriesHeaderStyles";

function MemoriesHeader() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerEyebrow}>YOUR COLLECTION</Text>
        <Text style={styles.headerTitle}>Memories</Text>
      </View>
    </View>
  );
}

export default MemoriesHeader;
