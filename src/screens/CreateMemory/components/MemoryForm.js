import { View, Text, TextInput, ActivityIndicator } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { getCurrentLocation } from "../../../services/locationService";

import styles from "../createMemoryStyles";

function MemoryForm({ title, setTitle, location, setLocation }) {
  const handleLocationFocus = async () => {
    try {
      const currentLocation = await getCurrentLocation();

      if (currentLocation?.readableLocation) {
        setLocation(currentLocation.readableLocation);
      }
    } catch (error) {
      console.log("Location error:", error);
    }
  };

  return (
    <>
      {/* TITLE */}

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

      {/* LOCATION */}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>LOCATION</Text>

        <View style={styles.inputWithIcon}>
          <Ionicons name="location-outline" size={22} color="#707080" />

          <TextInput
            style={styles.iconInput}
            value={location}
            onChangeText={setLocation}
            onFocus={handleLocationFocus}
            placeholder="Where did it happen?"
            placeholderTextColor="#A6A5AE"
          />
        </View>
      </View>
    </>
  );
}

export default MemoryForm;
