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

import styles from "./createMemoryStyles";

function CreateMemoryScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow photo library access to choose a memory.",
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

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow camera access to capture a memory.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleContinue = () => {
    if (!image) {
      Alert.alert(
        "Photo Required",
        "Choose or capture a photo for your memory.",
      );
      return;
    }

    if (!title.trim()) {
      Alert.alert("Title Required", "Give your memory a title.");
      return;
    }

    navigation.navigate("TicketPreview", {
      memory: {
        image,
        title,
        location,
        description,
        date: new Date().toISOString(),
      },
    });
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
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#242424" />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerEyebrow}>NEW MEMORY</Text>

            <Text style={styles.headerTitle}>Create Ticket</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* Photo Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Capture the moment</Text>

            <Text style={styles.stepText}>01 / 02</Text>
          </View>

          {!image ? (
            <View style={styles.photoPlaceholder}>
              <View style={styles.photoIcon}>
                <Ionicons name="image-outline" size={30} color="#34345C" />
              </View>

              <Text style={styles.photoTitle}>Add a photo</Text>

              <Text style={styles.photoDescription}>
                Choose a photo from your gallery or capture one right now.
              </Text>

              <View style={styles.photoButtons}>
                <TouchableOpacity
                  style={styles.galleryButton}
                  onPress={pickImage}
                  activeOpacity={0.8}
                >
                  <Ionicons name="images-outline" size={19} color="#34345C" />

                  <Text style={styles.galleryButtonText}>GALLERY</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={takePhoto}
                  activeOpacity={0.8}
                >
                  <Ionicons name="camera-outline" size={19} color="#FFFFFF" />

                  <Text style={styles.cameraButtonText}>CAMERA</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
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
                <Ionicons name="pencil" size={15} color="#FFFFFF" />

                <Text style={styles.changeImageText}>CHANGE</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tell the story</Text>

            <Text style={styles.stepText}>02 / 02</Text>
          </View>

          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>MEMORY TITLE</Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. Sunset at the beach"
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

        {/* Continue */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>PREVIEW TICKET</Text>

          <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Your moment. Your story. Your ticket.
        </Text>
      </ScrollView>
    </View>
  );
}

export default CreateMemoryScreen;
