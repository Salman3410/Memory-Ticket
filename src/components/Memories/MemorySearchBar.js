import { View, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./memorySearchBarStyles";

function MemorySearchBar({ value, onChangeText, onClear }) {
return ( <View style={styles.searchContainer}> <Ionicons
     name="search-outline"
     size={20}
     color="#707080"
   />


  <TextInput
    style={styles.searchInput}
    placeholder="Search memories..."
    placeholderTextColor="#9999A8"
    value={value}
    onChangeText={onChangeText}
    autoCapitalize="none"
    autoCorrect={false}
    returnKeyType="search"
  />

  {value.length > 0 && (
    <TouchableOpacity
      style={styles.clearSearchButton}
      onPress={onClear}
      activeOpacity={0.7}
    >
      <Ionicons
        name="close-circle"
        size={20}
        color="#707080"
      />
    </TouchableOpacity>
  )}
</View>


);
}

export default MemorySearchBar;
