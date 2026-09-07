import { View, Text, TextInput } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import styles from "../createMemoryStyles";

function MemoryForm({
  title,
  setTitle,
  location,
  setLocation,
  onLocationPress,
}) {
  return (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>MEMORY TITLE</Text>

        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Give this moment a name"
          placeholderTextColor="#A6A5AE"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>LOCATION</Text>

        <View style={styles.inputWithIcon}>
          <Ionicons name="location-outline" size={22} color="#707080" />

          <TextInput
            style={styles.iconInput}
            value={location}
            onChangeText={setLocation}
            onFocus={onLocationPress}
            placeholder="Where did it happen?"
            placeholderTextColor="#A6A5AE"
            autoCapitalize="sentences"
            autoCorrect={false}
          />
        </View>
      </View>
    </>
  );
}

export default MemoryForm;
