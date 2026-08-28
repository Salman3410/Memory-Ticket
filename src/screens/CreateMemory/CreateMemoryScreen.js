import { useEffect, useState } from "react";

import { View, Text, FlatList, Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";

import * as FileSystem from "expo-file-system/legacy";

import CreateMemoryHeader from "./components/CreateMemoryHeader";

import PhotoSection from "./components/PhotoSection";

import MemoryForm from "./components/MemoryForm";

import DescriptionInput from "./components/DescriptionInput";

import PreviewButton from "./components/PreviewButton";

import styles from "./createMemoryStyles";

const MAX_IMAGES = 5;

function CreateMemoryScreen({ navigation, route }) {
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // --------------------------------------------------
  // LOAD EDIT MEMORY / DRAFT
  // --------------------------------------------------

  useEffect(() => {
    const editMemory = route?.params?.editMemory;

    if (!editMemory) {
      return;
    }

    const existingImages = Array.isArray(editMemory.images)
      ? editMemory.images
      : editMemory.image
        ? [editMemory.image]
        : [];

    setImages(existingImages.slice(0, MAX_IMAGES));
    setActiveImage(0);
    setTitle(editMemory.title || "");
    setLocation(editMemory.location || "");
    setDescription(editMemory.description || "");

    // Clear navigation params after loading the memory.
    // This prevents the old draft from being loaded again.
    navigation.setParams({
      editMemory: undefined,
    });
  }, [route?.params?.editMemory]);

  // --------------------------------------------------
  // SAVE IMAGE PERMANENTLY
  // --------------------------------------------------

  const saveImagePermanently = async (uri) => {
    const extension = uri?.split(".").pop()?.split("?")[0] || "jpg";

    const filename = `memory-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}.${extension}`;

    const permanentUri = `${FileSystem.documentDirectory}${filename}`;

    await FileSystem.copyAsync({
      from: uri,
      to: permanentUri,
    });

    return permanentUri;
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

      // ------------------------------------------
      // COPY SELECTED IMAGES TO PERMANENT STORAGE
      // ------------------------------------------

      const newImages = [];

      for (const asset of result.assets) {
        if (!asset?.uri) {
          continue;
        }

        const permanentUri = await saveImagePermanently(asset.uri);

        newImages.push(permanentUri);
      }

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

      // ------------------------------------------
      // COPY CAMERA IMAGE TO PERMANENT STORAGE
      // ------------------------------------------

      const permanentUri = await saveImagePermanently(uri);

      const newIndex = images.length;

      setImages((currentImages) => {
        if (currentImages.length >= MAX_IMAGES) {
          return currentImages;
        }

        return [...currentImages, permanentUri];
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

    navigation.navigate("TicketPreview", {
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

            <CreateMemoryHeader navigation={navigation} />

            {/* PHOTOS */}

            <PhotoSection
              images={images}
              activeImage={activeImage}
              pickImages={pickImages}
              takePhoto={takePhoto}
              removeImage={removeImage}
              handleImageScroll={handleImageScroll}
            />

            {/* TITLE + LOCATION */}

            <MemoryForm
              title={title}
              setTitle={setTitle}
              location={location}
              setLocation={setLocation}
            />

            {/* DESCRIPTION */}

            <DescriptionInput
              description={description}
              setDescription={setDescription}
            />

            {/* PREVIEW */}

            <PreviewButton onPress={handleCreateMemory} />

            {/* FOOTER */}

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
