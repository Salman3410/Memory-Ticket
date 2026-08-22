import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  FlatList,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { Ionicons } from "@expo/vector-icons";

import { useMemory } from "../../hooks/useMemory";

import styles from "./editMemoryStyles";

function EditMemoryScreen({ navigation, route }) {
  const { getMemoryById, updateMemory } = useMemory();

  const { memoryId } = route.params;

  const memory = getMemoryById(memoryId);

  const [images, setImages] = useState(
    Array.isArray(memory?.images)
      ? memory.images
      : memory?.image
        ? [memory.image]
        : [],
  );

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

  // ------------------------------------------
  // ADD IMAGES
  // ------------------------------------------

  const addImages = (newImages) => {
    setImages((currentImages) => {
      const availableSlots = 5 - currentImages.length;

      const imagesToAdd = newImages
        .slice(0, availableSlots)
        .map((item) => item.uri);

      return [...currentImages, ...imagesToAdd];
    });
  };

  // ------------------------------------------
  // PICK IMAGES
  // ------------------------------------------

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow photo library access to choose photos.",
      );

      return;
    }

    if (images.length >= 5) {
      Alert.alert("Maximum Photos", "You can have up to 5 photos.");

      return;
    }

    const remainingSlots = 5 - images.length;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      quality: 0.6,
    });

    if (!result.canceled && result.assets?.length > 0) {
      addImages(result.assets);
    }
  };

  // ------------------------------------------
  // CAMERA
  // ------------------------------------------

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow camera access to capture a photo.",
      );

      return;
    }

    if (images.length >= 5) {
      Alert.alert("Maximum Photos", "You can have up to 5 photos.");

      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });

    if (!result.canceled && result.assets?.length > 0) {
      addImages(result.assets);
    }
  };

  // ------------------------------------------
  // REMOVE IMAGE
  // ------------------------------------------

  const removeImage = (indexToRemove) => {
    setImages((currentImages) =>
      currentImages.filter((_, index) => index !== indexToRemove),
    );
  };

  // ------------------------------------------
  // SAVE
  // ------------------------------------------

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Title Required", "Give your memory a title.");

      return;
    }

    if (images.length === 0) {
      Alert.alert("Photo Required", "Your memory needs at least one photo.");

      return;
    }

    try {
      await updateMemory(memory.id, {
        images,
        image: images[0],

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
        {/* HEADER */}
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

        {/* PHOTO SECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Your photos</Text>

              <Text style={styles.photoCountText}>
                {images.length}/5 photos
              </Text>
            </View>

            <Text style={styles.stepText}>PHOTOS</Text>
          </View>

          {/* IMAGE CAROUSEL */}
          {images.length > 0 ? (
            <FlatList
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item, index }) => (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item }}
                    style={styles.selectedImage}
                    resizeMode="cover"
                  />

                  {/* REMOVE */}
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="close" size={18} color="#FFFFFF" />
                  </TouchableOpacity>

                  {/* NUMBER */}
                  <View style={styles.imageNumber}>
                    <Text style={styles.imageNumberText}>
                      {index + 1}/{images.length}
                    </Text>
                  </View>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyImageContainer}>
              <Ionicons name="images-outline" size={35} color="#34345C" />

              <Text style={styles.emptyImageText}>No photos</Text>
            </View>
          )}

          {/* ADD MORE */}
          {images.length < 5 && (
            <View style={styles.addMoreRow}>
              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={pickImage}
                activeOpacity={0.8}
              >
                <Ionicons name="images-outline" size={17} color="#34345C" />

                <Text style={styles.addMoreText}>ADD PHOTOS</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addCameraButton}
                onPress={takePhoto}
                activeOpacity={0.8}
              >
                <Ionicons name="camera-outline" size={17} color="#FFFFFF" />

                <Text style={styles.addCameraText}>CAMERA</Text>
              </TouchableOpacity>
            </View>
          )}

          {images.length > 1 && (
            <View style={styles.swipeHint}>
              <Ionicons
                name="swap-horizontal-outline"
                size={15}
                color="#707080"
              />

              <Text style={styles.swipeHintText}>Swipe to view photos</Text>
            </View>
          )}
        </View>

        {/* DETAILS */}
        <View style={styles.section}>
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

        {/* SAVE */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark" size={21} color="#FFFFFF" />

          <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
        </TouchableOpacity>

        {/* CANCEL */}
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
