import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { useMemory } from "../../hooks/useMemory";

import styles from "./editMemoryStyles";

function EditMemoryScreen({ navigation, route }) {
  const { getMemoryById, updateMemory } = useMemory();

  const { memoryId } = route.params;

  const memory = getMemoryById(memoryId);

  const [image, setImage] = useState(memory?.image || null);

  const [title, setTitle] = useState(memory?.title || "");

  const [location, setLocation] = useState(memory?.location || "");

  const [description, setDescription] = useState(memory?.description || "");

  if (!memory) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons name="sad-outline" size={45} color="#34345C" />

        <Text style={styles.notFoundTitle}>Memory not found</Text>

        <TouchableOpacity
          style={styles.backButtonLarge}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>GO BACK</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow photo library access to choose a photo.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Title Required", "Give your memory a title.");
      return;
    }

    if (!image) {
      Alert.alert("Photo Required", "Your memory needs a photo.");
      return;
    }

    try {
      await updateMemory(memory.id, {
        image,
        title: title.trim(),
        location: location.trim(),
        description: description.trim(),
      });

      navigation.goBack();
    } catch (error) {
      console.log("Error updating memory:", error);

      Alert.alert("Error", "Unable to save your changes.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#242424" />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerEyebrow}>EDIT MEMORY</Text>

            <Text style={styles.headerTitle}>Update Ticket</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* Photo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your photo</Text>

            <Text style={styles.stepText}>PHOTO</Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={{ uri: image }}
              style={styles.selectedImage}
              resizeMode="cover"
            />

            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={pickImage}
              activeOpacity={0.8}
            >
              <Ionicons name="images-outline" size={16} color="#FFFFFF" />

              <Text style={styles.changeImageText}>CHANGE PHOTO</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Edit the story</Text>

            <Text style={styles.stepText}>DETAILS</Text>
          </View>

          {/* Title */}
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

          {/* Location */}
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

          {/* Description */}
          <View style={styles.inputGroup}>
            <View style={styles.descriptionHeader}>
              <Text style={styles.label}>DESCRIPTION</Text>

              <Text style={styles.characterCount}>
                {description.length}/200
              </Text>
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

        {/* Save */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark" size={21} color="#FFFFFF" />

          <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Text style={styles.cancelButtonText}>CANCEL</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>KEEP THE MOMENT. KEEP THE STORY.</Text>
      </ScrollView>
    </View>
  );
}

export default EditMemoryScreen;
