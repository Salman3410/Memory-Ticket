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

        <View style={styles.inputWithIcon}>
          <Ionicons name="text-outline" size={17} color="#7E7E88" />

          <TextInput
            style={styles.iconInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Give this moment a name"
            placeholderTextColor="#9A9AA3"
            autoCapitalize="sentences"
            autoCorrect={false}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>LOCATION</Text>

        <View style={styles.inputWithIcon}>
          <Ionicons name="location-outline" size={17} color="#7E7E88" />

          <TextInput
            style={styles.iconInput}
            value={location}
            onChangeText={setLocation}
            onFocus={onLocationPress}
            placeholder="Where did it happen?"
            placeholderTextColor="#9A9AA3"
            autoCapitalize="sentences"
            autoCorrect={false}
          />
        </View>
      </View>
    </>
  );
}

export default MemoryForm;
