import { useState } from "react";

import {
  View,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { useMemory } from "../../hooks/useMemory";

import styles from "./editMemoryStyles";

import EditMemoryHeader from "../../components/EditScreen/EditMemoryHeader/EditMemoryHeader";
import EditMemoryPhotos from "../../components/EditScreen/EditMemoryPhotos/EditMemoryPhotos";
import EditMemoryDetails from "../../components/EditScreen/EditMemoryDetails/EditMemoryDetails";
import EditMemoryActions from "../../components/EditScreen/EditMemoryActions/EditMemoryActions";
import EditMemoryNotFound from "../../components/EditScreen/EditMemoryNotFound/EditMemoryNotFound";

import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const MAX_IMAGES = 5;

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

  const [title, setTitle] = useState(
    memory?.title || ""
  );

  const [location, setLocation] = useState(
    memory?.location || ""
  );

  const [description, setDescription] = useState(
    memory?.description || ""
  );

  const [saving, setSaving] = useState(false);

  if (!memory) {
    return (
      <EditMemoryNotFound
        onBack={() => navigation.goBack()}
      />
    );
  }

  const isLocalImage = (uri) => {
    if (!uri) {
      return false;
    }

    return (
      uri.startsWith("file://") ||
      uri.startsWith("content://")
    );
  };

  const addImages = async (newImages) => {
    try {
      const availableSlots =
        MAX_IMAGES - images.length;

      if (availableSlots <= 0) {
        Alert.alert(
          "Maximum Photos",
          "You can have up to 5 photos."
        );
        return;
      }

      const selectedImages = newImages
        .slice(0, availableSlots)
        .filter((item) => item?.uri);

      if (!selectedImages.length) {
        return;
      }

      const newUris = selectedImages.map(
        (item) => item.uri
      );

      setImages((currentImages) => [
        ...currentImages,
        ...newUris,
      ]);
    } catch (error) {
      console.error(
        "Error adding images:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to add the selected photos."
      );
    }
  };

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow photo library access to choose photos."
        );
        return;
      }

      if (images.length >= MAX_IMAGES) {
        Alert.alert(
          "Maximum Photos",
          "You can have up to 5 photos."
        );
        return;
      }

      const remainingSlots =
        MAX_IMAGES - images.length;

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsMultipleSelection: true,
          selectionLimit: remainingSlots,
          quality: 0.8,
        });

      if (
        !result.canceled &&
        result.assets?.length
      ) {
        await addImages(result.assets);
      }
    } catch (error) {
      console.error(
        "Gallery error:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to select photos."
      );
    }
  };

  const takePhoto = async () => {
    try {
      if (images.length >= MAX_IMAGES) {
        Alert.alert(
          "Maximum Photos",
          "You can have up to 5 photos."
        );
        return;
      }

      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow camera access to capture a photo."
        );
        return;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

      if (
        !result.canceled &&
        result.assets?.length
      ) {
        await addImages(result.assets);
      }
    } catch (error) {
      console.error(
        "Camera error:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to take photo."
      );
    }
  };

  const removeImage = (indexToRemove) => {
    setImages((currentImages) =>
      currentImages.filter(
        (_, index) =>
          index !== indexToRemove
      )
    );
  };

  const handleSave = async () => {
    if (saving) {
      return;
    }

    if (!title.trim()) {
      Alert.alert(
        "Title Required",
        "Give your memory a title."
      );
      return;
    }

    if (images.length === 0) {
      Alert.alert(
        "Photo Required",
        "Your memory needs at least one photo."
      );
      return;
    }

    if (images.length > MAX_IMAGES) {
      Alert.alert(
        "Maximum Photos",
        "A memory can contain up to 5 photos."
      );
      return;
    }

    setSaving(true);

    try {
      const existingImages = [];
      const existingImagePublicIds = [];
      const newImages = [];

      const originalImages =
        Array.isArray(memory.images)
          ? memory.images
          : memory.image
            ? [memory.image]
            : [];

      const originalPublicIds =
        Array.isArray(memory.imagePublicIds)
          ? memory.imagePublicIds
          : [];

      images.forEach((uri) => {
        if (isLocalImage(uri)) {
          newImages.push(uri);
          return;
        }

        const originalIndex =
          originalImages.indexOf(uri);

        if (originalIndex !== -1) {
          existingImages.push(uri);

          const publicId =
            originalPublicIds[
              originalIndex
            ];

          if (publicId) {
            existingImagePublicIds.push(
              publicId
            );
          }
        }
      });

      const updatedMemory =
        await updateMemory(memory.id, {
          title: title.trim(),
          location: location.trim(),
          description: description.trim(),
          existingImages,
          existingImagePublicIds,
          newImages,
        });

      if (!updatedMemory) {
        throw new Error(
          "Memory was not updated."
        );
      }

      navigation.goBack();
    } catch (error) {
      console.error(
        "Error updating memory:",
        error
      );

      Alert.alert(
        "Update Failed",
        error?.message ||
          "Unable to save your changes."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        bottomOffset={30}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <EditMemoryHeader
          onBack={() => navigation.goBack()}
        />

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
          loading={saving}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}

export default EditMemoryScreen;

