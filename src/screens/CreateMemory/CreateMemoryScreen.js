import { useState } from "react";

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

import styles from "./createMemoryStyles";

function CreateMemoryScreen({ navigation }) {
  const [images, setImages] = useState([]);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // --------------------------------------------------
  // ADD IMAGES
  // --------------------------------------------------

  const addImages = (newImages) => {
    setImages((currentImages) => {
      const availableSlots = 5 - currentImages.length;

      const imagesToAdd = newImages
        .slice(0, availableSlots)
        .map((item) => item.uri);

      return [...currentImages, ...imagesToAdd];
    });
  };

  // --------------------------------------------------
  // GALLERY
  // --------------------------------------------------

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow photo library access to choose a memory.",
      );

      return;
    }

    if (images.length >= 5) {
      Alert.alert(
        "Maximum Photos",
        "You can add up to 5 photos to one memory.",
      );

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

  // --------------------------------------------------
  // CAMERA
  // --------------------------------------------------

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow camera access to capture a memory.",
      );

      return;
    }

    if (images.length >= 5) {
      Alert.alert(
        "Maximum Photos",
        "You can add up to 5 photos to one memory.",
      );

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

  // --------------------------------------------------
  // REMOVE IMAGE
  // --------------------------------------------------

  const removeImage = (indexToRemove) => {
    setImages((currentImages) =>
      currentImages.filter((_, index) => index !== indexToRemove),
    );
  };

  // --------------------------------------------------
  // CONTINUE
  // --------------------------------------------------

  const handleContinue = () => {
    if (images.length === 0) {
      Alert.alert(
        "Photo Required",
        "Choose or capture at least one photo for your memory.",
      );

      return;
    }

    if (!title.trim()) {
      Alert.alert("Title Required", "Give your memory a title.");

      return;
    }

    navigation.navigate("TicketPreview", {
      memory: {
        // First image remains available for existing components
        image: images[0],

        // New multi-image field
        images,

        title: title.trim(),
        location: location.trim(),
        description: description.trim(),

        date: new Date().toISOString(),
      },
    });
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

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

        {/* PHOTO SECTION */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Capture the moment</Text>

              <Text style={styles.photoCountText}>
                {images.length}/5 photos
              </Text>
            </View>

            <Text style={styles.stepText}>01 / 02</Text>
          </View>

          {/* NO IMAGES */}

          {images.length === 0 ? (
            <View style={styles.photoPlaceholder}>
              <View style={styles.photoIcon}>
                <Ionicons name="images-outline" size={30} color="#34345C" />
              </View>

              <Text style={styles.photoTitle}>Add photos</Text>

              <Text style={styles.photoDescription}>
                Choose up to 5 photos from your gallery or capture one right
                now.
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
            <View>
              {/* HORIZONTAL PHOTO PREVIEW */}

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

                    {/* IMAGE NUMBER */}

                    <View style={styles.imageNumber}>
                      <Text style={styles.imageNumberText}>
                        {index + 1}/{images.length}
                      </Text>
                    </View>
                  </View>
                )}
              />

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

              {/* HORIZONTAL SWIPE HINT */}

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
          )}
        </View>

        {/* DETAILS */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tell the story</Text>

            <Text style={styles.stepText}>02 / 02</Text>
          </View>

          {/* TITLE */}

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

        {/* CONTINUE */}

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
