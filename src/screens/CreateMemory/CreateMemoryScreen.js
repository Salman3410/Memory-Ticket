import { useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import CreateMemoryHeader from "./components/CreateMemoryHeader";
import PhotoSection from "./components/PhotoSection";
import MemoryForm from "./components/MemoryForm";
import DescriptionInput from "./components/DescriptionInput";
import PreviewButton from "./components/PreviewButton";
import styles from "./createMemoryStyles";

const MAX_IMAGES = 5;

function CreateMemoryScreen({ navigation }) {
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(0);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

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
