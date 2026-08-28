import { useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useMemory } from "../../hooks/useMemory";
import styles from "./editMemoryStyles";

import EditMemoryHeader from "../../components/EditScreen/EditMemoryHeader/EditMemoryHeader";
import EditMemoryPhotos from "../../components/EditScreen/EditMemoryPhotos/EditMemoryPhotos";
import EditMemoryDetails from "../../components/EditScreen/EditMemoryDetails/EditMemoryDetails";
import EditMemoryActions from "../../components/EditScreen/EditMemoryActions/EditMemoryActions";
import EditMemoryNotFound from "../../components/EditScreen/EditMemoryNotFound/EditMemoryNotFound";

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
    return <EditMemoryNotFound onBack={() => navigation.goBack()} />;
  }

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
  // ADD IMAGES
  // --------------------------------------------------

  const addImages = async (newImages) => {
    try {
      const availableSlots = 5 - images.length;

      const selectedImages = newImages
        .slice(0, availableSlots)
        .filter((item) => item?.uri);

      const permanentImages = [];

      for (const item of selectedImages) {
        const permanentUri = await saveImagePermanently(item.uri);

        permanentImages.push(permanentUri);
      }

      if (permanentImages.length > 0) {
        setImages((currentImages) => [...currentImages, ...permanentImages]);
      }
    } catch (error) {
      console.log("Error saving images permanently:", error);

      Alert.alert("Error", "Unable to add the selected photos.");
    }
  };

  // --------------------------------------------------
  // PICK IMAGE
  // --------------------------------------------------

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

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
        await addImages(result.assets);
      }
    } catch (error) {
      console.log("Gallery error:", error);

      Alert.alert("Error", "Unable to select photos.");
    }
  };

  // --------------------------------------------------
  // TAKE PHOTO
  // --------------------------------------------------

  const takePhoto = async () => {
    try {
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
        await addImages(result.assets);
      }
    } catch (error) {
      console.log("Camera error:", error);

      Alert.alert("Error", "Unable to take photo.");
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
  // SAVE CHANGES
  // --------------------------------------------------

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

  // --------------------------------------------------
  // SCREEN
  // --------------------------------------------------

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}

        <EditMemoryHeader onBack={() => navigation.goBack()} />

        {/* PHOTOS */}

        <EditMemoryPhotos
          images={images}
          onPickImages={pickImage}
          onTakePhoto={takePhoto}
          onRemoveImage={removeImage}
        />

        {/* DETAILS */}

        <EditMemoryDetails
          title={title}
          setTitle={setTitle}
          location={location}
          setLocation={setLocation}
          description={description}
          setDescription={setDescription}
        />

        {/* ACTIONS */}

        <EditMemoryActions
          onSave={handleSave}
          onCancel={() => navigation.goBack()}
        />
      </ScrollView>
    </View>
  );
}

export default EditMemoryScreen;
