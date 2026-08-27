import React from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./editMemoryDetailsStyles";

function EditMemoryDetails({
  title,
  setTitle,
  location,
  setLocation,
  description,
  setDescription,
}) {
  return (
    <View style={styles.section}>
      {/* SECTION HEADER */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Edit the story</Text>

        <Text style={styles.stepText}>DETAILS</Text>
      </View>

      {/* TITLE */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>MEMORY TITLE</Text>

        <TextInput
          style={styles.input}
          placeholder="Memory title"
          placeholderTextColor="#9A99A5"
          value={title}
          onChangeText={setTitle}
          maxLength={50}
        />
      </View>

      {/* LOCATION */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>LOCATION</Text>

        <View style={styles.inputWithIcon}>
          <Ionicons name="location-outline" size={20} color="#707080" />

          <TextInput
            style={styles.iconInput}
            placeholder="Where did it happen?"
            placeholderTextColor="#9A99A5"
            value={location}
            onChangeText={setLocation}
            maxLength={60}
          />
        </View>
      </View>

      {/* DESCRIPTION */}
      <View style={styles.inputGroup}>
        <View style={styles.descriptionHeader}>
          <Text style={styles.label}>DESCRIPTION</Text>

          <Text style={styles.characterCount}>{description.length}/200</Text>
        </View>

        <TextInput
          style={styles.descriptionInput}
          placeholder="Write something you'll want to remember..."
          placeholderTextColor="#9A99A5"
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={200}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

export default EditMemoryDetails;
