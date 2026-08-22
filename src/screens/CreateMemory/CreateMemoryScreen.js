import React, { useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { Ionicons } from "@expo/vector-icons";

import styles from "./createMemoryStyles";

const MAX_IMAGES = 5;

function CreateMemoryScreen({ navigation }) {
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // --------------------------------------------------
  // NORMALIZE IMAGE
  // --------------------------------------------------

  const getImageUri = (item) => {
    if (!item) {
      return null;
    }

    if (typeof item === "string") {
      return item;
    }

    if (typeof item === "object" && item.uri) {
      return item.uri;
    }

    return null;
  };

  // --------------------------------------------------
  // ADD IMAGES FROM GALLERY
  // --------------------------------------------------

  const pickImages = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow photo library access to select photos.",
        );
        return;
      }

      const remainingSlots = MAX_IMAGES - images.length;

      if (remainingSlots <= 0) {
        Alert.alert("Maximum Photos", "You can add up to 5 photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        quality: 1,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const newImages = result.assets
        .map((asset) => asset?.uri)
        .filter(Boolean);

      if (!newImages.length) {
        return;
      }

      // Remember where the new images start
      const oldLength = images.length;

      setImages((currentImages) => {
        const combined = [...currentImages, ...newImages];

        return combined.slice(0, MAX_IMAGES);
      });

      setActiveImage(oldLength);
    } catch (error) {
      console.log("Gallery error:", error);

      Alert.alert("Error", "Unable to select photos.");
    }
  };

  // --------------------------------------------------
  // CAMERA
  // --------------------------------------------------

  const takePhoto = async () => {
    try {
      if (images.length >= MAX_IMAGES) {
        Alert.alert("Maximum Photos", "You can add up to 5 photos.");
        return;
      }

      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow camera access to take a photo.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 1,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const uri = result.assets[0]?.uri;

      if (!uri) {
        return;
      }

      const newIndex = images.length;

      setImages((currentImages) => {
        if (currentImages.length >= MAX_IMAGES) {
          return currentImages;
        }

        return [...currentImages, uri];
      });

      setActiveImage(newIndex);
    } catch (error) {
      console.log("Camera error:", error);

      Alert.alert("Error", "Unable to take photo.");
    }
  };

  // --------------------------------------------------
  // REMOVE IMAGE
  // --------------------------------------------------

  const removeImage = (index) => {
    setImages((currentImages) => {
      const updated = currentImages.filter(
        (_, imageIndex) => imageIndex !== index,
      );

      return updated;
    });

    setActiveImage((currentIndex) => {
      if (images.length <= 1) {
        return 0;
      }

      if (index < currentIndex) {
        return currentIndex - 1;
      }

      if (currentIndex >= images.length - 1) {
        return Math.max(0, images.length - 2);
      }

      return currentIndex;
    });
  };

  // --------------------------------------------------
  // IMAGE PAGE
  // --------------------------------------------------

  const renderImage = ({ item, index }) => {
    const uri = getImageUri(item);

    if (!uri) {
      return (
        <View style={styles.imagePage}>
          <View style={styles.imageError}>
            <Ionicons name="image-outline" size={40} color="#9A99A5" />

            <Text style={styles.imageErrorText}>Image unavailable</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.imagePage}>
        <Image
          source={{ uri }}
          style={styles.selectedImage}
          resizeMode="cover"
        />

        {/* REMOVE */}

        <TouchableOpacity
          style={styles.removeImageButton}
          onPress={() => removeImage(index)}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* IMAGE NUMBER */}

        <View style={styles.imageNumber}>
          <Text style={styles.imageNumberText}>
            {index + 1}/{images.length}
          </Text>
        </View>
      </View>
    );
  };

  // --------------------------------------------------
  // IMAGE SCROLL
  // --------------------------------------------------

  const handleImageScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    const pageWidth = event.nativeEvent.layoutMeasurement.width;

    if (!pageWidth) {
      return;
    }

    const index = Math.round(offsetX / pageWidth);

    setActiveImage(index);
  };

  // --------------------------------------------------
  // RESET FORM
  // --------------------------------------------------

  const resetForm = () => {
    setImages([]);
    setActiveImage(0);
    setTitle("");
    setLocation("");
    setDescription("");
  };

  // --------------------------------------------------
  // GO TO TICKET PREVIEW
  // --------------------------------------------------

  const handleCreateMemory = () => {
    if (!images.length) {
      Alert.alert("Add Photos", "Please add at least one photo.");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Memory Title", "Please give this memory a title.");
      return;
    }

    // ------------------------------------------
    // CREATE TEMPORARY DRAFT
    // ------------------------------------------

    const draftMemory = {
      title: title.trim(),
      location: location.trim(),
      description: description.trim(),

      image: images[0] || null,

      images: [...images],

      date: new Date().toISOString(),
    };

    // ------------------------------------------
    // CLEAR CREATE MEMORY FORM
    // ------------------------------------------

    resetForm();

    // ------------------------------------------
    // SEND DRAFT TO TICKET PREVIEW
    // ------------------------------------------

    navigation.replace("TicketPreview", {
      memory: draftMemory,
    });
  };

  // --------------------------------------------------
  // SCREEN
  // --------------------------------------------------

  return (
    <View style={styles.container}>
      <FlatList
        data={[{ key: "form" }]}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        renderItem={() => (
          <>
            {/* HEADER */}

            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={22} color="#242424" />
              </TouchableOpacity>

              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerEyebrow}>CREATE MEMORY</Text>

                <Text style={styles.headerTitle}>New Memory</Text>
              </View>

              <View style={styles.headerSpacer} />
            </View>

            {/* PHOTOS */}

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Photos</Text>

                <Text style={styles.stepText}>
                  {images.length}/{MAX_IMAGES}
                </Text>
              </View>

              {images.length > 0 ? (
                <>
                  {/* PHOTO PREVIEW */}

                  <View style={styles.imageContainer}>
                    <FlatList
                      data={images}
                      keyExtractor={(item, index) => `${item}-${index}`}
                      renderItem={renderImage}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      bounces={false}
                      decelerationRate="fast"
                      disableIntervalMomentum={true}
                      onScroll={handleImageScroll}
                      scrollEventThrottle={16}
                      nestedScrollEnabled
                    />
                  </View>

                  {/* ADD MORE */}

                  {images.length < MAX_IMAGES && (
                    <View style={styles.addMoreRow}>
                      <TouchableOpacity
                        style={styles.addMoreButton}
                        onPress={pickImages}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="images-outline"
                          size={18}
                          color="#34345C"
                        />

                        <Text style={styles.addMoreText}>ADD MORE</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.addCameraButton}
                        onPress={takePhoto}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="camera-outline"
                          size={18}
                          color="#FFFFFF"
                        />

                        <Text style={styles.addCameraText}>CAMERA</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* SWIPE HINT */}

                  {images.length > 1 && (
                    <View style={styles.swipeHint}>
                      <Ionicons
                        name="swap-horizontal-outline"
                        size={15}
                        color="#707080"
                      />

                      <Text style={styles.swipeHintText}>
                        Swipe to view photos
                      </Text>

                      <Text style={styles.swipeCountText}>
                        {activeImage + 1}/{images.length}
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                /* EMPTY PHOTO PLACEHOLDER */

                <View style={styles.photoPlaceholder}>
                  <View style={styles.photoIcon}>
                    <Ionicons name="images-outline" size={30} color="#34345C" />
                  </View>

                  <Text style={styles.photoTitle}>Add your photos</Text>

                  <Text style={styles.photoDescription}>
                    Capture this moment with up to 5 photos.
                  </Text>

                  <View style={styles.photoButtons}>
                    <TouchableOpacity
                      style={styles.galleryButton}
                      onPress={pickImages}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name="images-outline"
                        size={19}
                        color="#34345C"
                      />

                      <Text style={styles.galleryButtonText}>ADD PHOTOS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cameraButton}
                      onPress={takePhoto}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name="camera-outline"
                        size={19}
                        color="#FFFFFF"
                      />

                      <Text style={styles.cameraButtonText}>CAMERA</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

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
                  placeholder="Where did it happen?"
                  placeholderTextColor="#A6A5AE"
                />
              </View>
            </View>

            {/* DESCRIPTION */}

            <View style={styles.inputGroup}>
              <View style={styles.descriptionHeader}>
                <Text style={styles.label}>DESCRIPTION</Text>

                <Text style={styles.characterCount}>
                  {description.length}/500
                </Text>
              </View>

              <TextInput
                style={styles.descriptionInput}
                value={description}
                onChangeText={(text) => {
                  if (text.length <= 500) {
                    setDescription(text);
                  }
                }}
                placeholder="Tell the story behind this moment..."
                placeholderTextColor="#A6A5AE"
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* PREVIEW */}

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleCreateMemory}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>PREVIEW TICKET</Text>

              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.footerText}>
              KEEP THE MOMENT. KEEP THE STORY.
            </Text>
          </>
        )}
      />
    </View>
  );
}

export default CreateMemoryScreen;
