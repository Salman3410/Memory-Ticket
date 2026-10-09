import React, { useMemo, useState } from "react";

import { View, StatusBar } from "react-native";

import * as ImagePicker from "expo-image-picker";

import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { useMemory } from "../../hooks/useMemory";
import { useAppAlert } from "../../context/AlertContext";
import { useTheme } from "../../context/ThemeContext";

import styles from "./editMemoryStyles";

import EditMemoryHeader from "../../components/EditScreen/EditMemoryHeader/EditMemoryHeader";
import EditMemoryPhotos from "../../components/EditScreen/EditMemoryPhotos/EditMemoryPhotos";
import EditMemoryDetails from "../../components/EditScreen/EditMemoryDetails/EditMemoryDetails";
import EditMemoryActions from "../../components/EditScreen/EditMemoryActions/EditMemoryActions";
import EditMemoryNotFound from "../../components/EditScreen/EditMemoryNotFound/EditMemoryNotFound";

import TagsInput from "../../components/TagsInput/TagsInput";

const MAX_IMAGES = 5;

function EditMemoryScreen({ navigation, route }) {
  const { getMemoryById, updateMemory } = useMemory();

  const { showAlert } = useAppAlert();
  const { theme, isDark } = useTheme();

  const { memoryId } = route.params;
  const memory = getMemoryById(memoryId);

  // --------------------------------------------------
  // THEME COLORS
  // Uses the same ThemeContext color structure as
  // the Profile, Settings, and Create Memory screens.
  // --------------------------------------------------

  const colors = useMemo(() => {
    const themeColors = theme?.colors || {};

    return {
      background: themeColors.background || (isDark ? "#171724" : "#F1F0F6"),

      surface:
        themeColors.surface ||
        themeColors.card ||
        (isDark ? "#232333" : "#FFFFFF"),

      text: themeColors.text || (isDark ? "#F1F0F6" : "#242424"),

      textSecondary:
        themeColors.textSecondary ||
        themeColors.textMuted ||
        (isDark ? "#A6A6B8" : "#737387"),

      border: themeColors.border || (isDark ? "#38384C" : "#D9D8E2"),

      primary: themeColors.primary || "#34345C",

      accent: themeColors.accent || "#E76F51",

      placeholder: themeColors.placeholder || (isDark ? "#88889C" : "#9A9AA3"),
    };
  }, [theme, isDark]);

  // --------------------------------------------------
  // SCREEN STYLES
  // --------------------------------------------------

  const screenStyles = useMemo(
    () => ({
      container: {
        ...styles.container,
        backgroundColor: colors.background,
      },

      scrollContent: {
        ...styles.scrollContent,
        backgroundColor: colors.background,
      },
    }),
    [colors],
  );

  // --------------------------------------------------
  // FORM STATE
  // --------------------------------------------------

  const [images, setImages] = useState(() =>
    Array.isArray(memory?.images)
      ? memory.images
      : memory?.image
        ? [memory.image]
        : [],
  );

  const [title, setTitle] = useState(memory?.title || "");

  const [location, setLocation] = useState(memory?.location || "");

  const [description, setDescription] = useState(memory?.description || "");

  const [tags, setTags] = useState(() =>
    Array.isArray(memory?.tags) ? memory.tags : [],
  );

  const [saving, setSaving] = useState(false);

  // --------------------------------------------------
  // MEMORY NOT FOUND
  // --------------------------------------------------

  if (!memory) {
    return (
      <View style={screenStyles.container}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={colors.background}
        />

        <EditMemoryNotFound
          onBack={() => navigation.goBack()}
          theme={theme}
          isDark={isDark}
        />
      </View>
    );
  }

  // --------------------------------------------------
  // CHECK WHETHER IMAGE IS LOCAL
  // --------------------------------------------------

  const isLocalImage = (uri) => {
    if (!uri) {
      return false;
    }

    return uri.startsWith("file://") || uri.startsWith("content://");
  };

  // --------------------------------------------------
  // ADD IMAGES
  // --------------------------------------------------

  const addImages = async (newImages) => {
    try {
      const availableSlots = MAX_IMAGES - images.length;

      if (availableSlots <= 0) {
        showAlert({
          type: "warning",
          icon: "images-outline",
          title: "Maximum Photos",
          message: "You can have up to 5 photos.",
          confirmText: "OK",
        });

        return;
      }

      const selectedImages = newImages
        .slice(0, availableSlots)
        .filter((item) => item?.uri);

      if (!selectedImages.length) {
        return;
      }

      const newUris = selectedImages.map((item) => item.uri);

      setImages((currentImages) => [...currentImages, ...newUris]);
    } catch (error) {
      console.error("Error adding images:", error);

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Unable to Add Photos",
        message: "Unable to add the selected photos.",
        confirmText: "OK",
      });
    }
  };

  // --------------------------------------------------
  // PICK IMAGES FROM GALLERY
  // --------------------------------------------------

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showAlert({
          type: "warning",
          icon: "images-outline",
          title: "Permission Required",
          message: "Please allow photo library access to choose photos.",
          confirmText: "OK",
        });

        return;
      }

      if (images.length >= MAX_IMAGES) {
        showAlert({
          type: "warning",
          icon: "images-outline",
          title: "Maximum Photos",
          message: "You can have up to 5 photos.",
          confirmText: "OK",
        });

        return;
      }

      const remainingSlots = MAX_IMAGES - images.length;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length) {
        await addImages(result.assets);
      }
    } catch (error) {
      console.error("Gallery error:", error);

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Unable to Select Photos",
        message: "Unable to select photos.",
        confirmText: "OK",
      });
    }
  };

  // --------------------------------------------------
  // TAKE PHOTO
  // --------------------------------------------------

  const takePhoto = async () => {
    try {
      if (images.length >= MAX_IMAGES) {
        showAlert({
          type: "warning",
          icon: "images-outline",
          title: "Maximum Photos",
          message: "You can have up to 5 photos.",
          confirmText: "OK",
        });

        return;
      }

      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        showAlert({
          type: "warning",
          icon: "camera-outline",
          title: "Permission Required",
          message: "Please allow camera access to capture a photo.",
          confirmText: "OK",
        });

        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length) {
        await addImages(result.assets);
      }
    } catch (error) {
      console.error("Camera error:", error);

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Unable to Take Photo",
        message: "Unable to take photo.",
        confirmText: "OK",
      });
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
    if (saving) {
      return;
    }

    if (!title.trim()) {
      showAlert({
        type: "warning",
        icon: "text-outline",
        title: "Title Required",
        message: "Give your memory a title.",
        confirmText: "OK",
      });

      return;
    }

    if (images.length === 0) {
      showAlert({
        type: "warning",
        icon: "image-outline",
        title: "Photo Required",
        message: "Your memory needs at least one photo.",
        confirmText: "OK",
      });

      return;
    }

    if (images.length > MAX_IMAGES) {
      showAlert({
        type: "warning",
        icon: "images-outline",
        title: "Maximum Photos",
        message: "A memory can contain up to 5 photos.",
        confirmText: "OK",
      });

      return;
    }

    setSaving(true);

    try {
      const existingImages = [];
      const existingImagePublicIds = [];
      const newImages = [];

      const originalImages = Array.isArray(memory.images)
        ? memory.images
        : memory.image
          ? [memory.image]
          : [];

      const originalPublicIds = Array.isArray(memory.imagePublicIds)
        ? memory.imagePublicIds
        : [];

      images.forEach((uri) => {
        if (isLocalImage(uri)) {
          newImages.push(uri);
          return;
        }

        const originalIndex = originalImages.indexOf(uri);

        if (originalIndex !== -1) {
          existingImages.push(uri);

          const publicId = originalPublicIds[originalIndex];

          if (publicId) {
            existingImagePublicIds.push(publicId);
          }
        }
      });

      const updatedMemory = await updateMemory(memory.id, {
        title: title.trim(),
        location: location.trim(),
        description: description.trim(),
        tags: [...tags],
        existingImages,
        existingImagePublicIds,
        newImages,
      });

      if (!updatedMemory) {
        throw new Error("Memory was not updated.");
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error updating memory:", error);

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Update Failed",
        message: error?.message || "Unable to save your changes.",
        confirmText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <View style={screenStyles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <KeyboardAwareScrollView
        bottomOffset={30}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={screenStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}

        <EditMemoryHeader
          onBack={() => navigation.goBack()}
          theme={theme}
          isDark={isDark}
        />

        {/* PHOTOS */}

        <EditMemoryPhotos
          images={images}
          onPickImages={pickImage}
          onTakePhoto={takePhoto}
          onRemoveImage={removeImage}
          theme={theme}
          isDark={isDark}
        />

        {/* DETAILS */}

        <EditMemoryDetails
          title={title}
          setTitle={setTitle}
          location={location}
          setLocation={setLocation}
          description={description}
          setDescription={setDescription}
          theme={theme}
          isDark={isDark}
        />

        {/* TAGS */}

        <TagsInput
          tags={tags}
          setTags={setTags}
          theme={theme}
          isDark={isDark}
        />

        {/* ACTIONS */}

        <EditMemoryActions
          onSave={handleSave}
          onCancel={() => navigation.goBack()}
          loading={saving}
          theme={theme}
          isDark={isDark}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}

export default EditMemoryScreen;
