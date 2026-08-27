import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./memoriesHeaderStyles";

function MemoriesHeader({ onAddPress }) {
return ( 
    <View style={styles.header}> 
        <View> 
            <Text style={styles.headerEyebrow}>YOUR COLLECTION</Text> 
            <Text style={styles.headerTitle}>Memories</Text> </View>

  <TouchableOpacity
    style={styles.addButton}
    onPress={onAddPress}
    activeOpacity={0.8}
  >
    <Ionicons name="add" size={24} color="#FFFFFF" />
  </TouchableOpacity>
</View>


);
}

export default MemoriesHeader;
