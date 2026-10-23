
import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTheme } from "../../context/ThemeContext";
import { useAppAlert } from "../../context/AlertContext";
import CreateMemoryHeader from "./components/CreateMemoryHeader";
import PhotoSection from "./components/PhotoSection";
import MemoryForm from "./components/MemoryForm";
import DescriptionInput from "./components/DescriptionInput";
import PreviewButton from "./components/PreviewButton";
import MemoryDatePicker from "./components/MemoryDatePicker";
import TagsInput from "../../components/TagsInput/TagsInput";
import styles from "./createMemoryStyles";
import { getNetworkInfo } from "../../services/networkService";
import { normalizeTicketCustomization } from "../../utils/ticketCustomization";


const MAX_IMAGES = 5;

function normalizeMemoryDate(value) {
  let date;

  if (value instanceof Date) {
    date = value;
  } else if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    const [year, month, day] = value.split("-").map(Number);

    date = new Date(year, month - 1, day, 12, 0, 0, 0);
  } else {
    date = value ? new Date(value) : new Date();
  }

  if (Number.isNaN(date.getTime())) {
    date = new Date();
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
    0,
    0,
    0,
  );
}

function CreateMemoryScreen({ navigation, route }) {
  const { showAlert } = useAppAlert();
  const { theme, isDark } = useTheme();

  const editMemory = route?.params?.editMemory;

  const screenStyles = useMemo(() => {
    const colors = theme?.colors || {};

    const backgroundColor =
      colors.background || (isDark ? "#171724" : "#F1F0F6");

    const footerTextColor =
      colors.textSecondary ||
      colors.textMuted ||
      (isDark ? "#A6A6B8" : "#737387");

    return {
      container: {
        ...styles.container,
        backgroundColor,
      },

      scrollContent: {
        ...styles.scrollContent,
        backgroundColor,
      },

      footerText: {
        ...styles.footerText,
        color: footerTextColor,
      },

      backgroundColor,
    };
  }, [theme, isDark]);

  // Photos
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(0);

  // Memory details
  const [title, setTitle] = useState("");

  const [memoryDate, setMemoryDate] = useState(() =>
    normalizeMemoryDate(
      editMemory?.date || editMemory?.createdAt,
    ),
  );

  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);

  // Network and location
  const [network, setNetwork] = useState(null);

  const [location, setLocation] = useState("");
  const [locationData, setLocationData] = useState(null);
  const [locationCaptured, setLocationCaptured] = useState(false);

  // Ticket customization
  const [ticketCustomization, setTicketCustomization] = useState(
    () => normalizeTicketCustomization(),
  );

  /**
   * Restore an existing memory when editing.
   */
  useEffect(() => {
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

    setMemoryDate(
      normalizeMemoryDate(
        editMemory.date || editMemory.createdAt,
      ),
    );

    setLocation(editMemory.location || "");

    setLocationData(editMemory.locationData || null);
    setLocationCaptured(!!editMemory.locationData);

    setNetwork(
      editMemory.network ||
        editMemory.environment?.network ||
        null,
    );

    setDescription(editMemory.description || "");

    setTags(
      Array.isArray(editMemory.tags)
        ? editMemory.tags
        : [],
    );

    setTicketCustomization(
      normalizeTicketCustomization(editMemory),
    );

    // Consume the edit parameter after restoring the form.
    navigation.setParams({
      editMemory: undefined,
    });
  }, [editMemory, navigation]);

  /**
   * Capture network and location information.
   */
  useEffect(() => {
    let cancelled = false;

    const captureMemoryEnvironment = async () => {
      try {
        const networkInfo = await getNetworkInfo();

        if (!cancelled) {
          setNetwork(networkInfo);
        }
      } catch (error) {
        console.warn("Network info capture failed:", error);
      }

      // Preserve an existing location while editing.
      if (editMemory?.locationData) {
        return;
      }

      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted" || cancelled) {
          return;
        }

        const currentLocation =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

        if (cancelled) {
          return;
        }

        const { latitude, longitude } = currentLocation.coords;

        let addressData = null;

        try {
          const addresses = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });

          addressData = addresses?.[0] || null;
        } catch (geocodeError) {
          console.warn(
            "Reverse geocoding failed:",
            geocodeError,
          );
        }

        if (cancelled) {
          return;
        }

        setLocationData({
          latitude,
          longitude,
          address: addressData?.formattedAddress || null,
          name: addressData?.name || null,
          district: addressData?.district || null,
          city: addressData?.city || null,
          region: addressData?.region || null,
          country: addressData?.country || null,
          postalCode: addressData?.postalCode || null,
          isoCountryCode: addressData?.isoCountryCode || null,
        });

        setLocationCaptured(true);

        console.log("Automatic location data captured:", {
          latitude,
          longitude,
          addressData,
        });
      } catch (error) {
        console.warn(
          "Automatic location capture failed:",
          error,
        );
      }
    };

    captureMemoryEnvironment();

    return () => {
      cancelled = true;
    };
  }, [editMemory]);

  /**
   * Select photos from the gallery.
   */
  const pickImages = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showAlert({
          type: "warning",
          icon: "images-outline",
          title: "Permission Required",
          message:
            "Please allow photo library access to select photos.",
          confirmText: "OK",
        });

        return;
      }

      const remainingSlots = MAX_IMAGES - images.length;

      if (remainingSlots <= 0) {
        showAlert({
          type: "warning",
          icon: "images-outline",
          title: "Maximum Photos",
          message: "You can add up to 5 photos.",
          confirmText: "OK",
        });

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsMultipleSelection: true,
          selectionLimit: remainingSlots,
          quality: 0.8,
        });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const newImages = result.assets
        .filter((asset) => asset?.uri)
        .map((asset) => asset.uri);

      if (!newImages.length) {
        return;
      }

      setImages((currentImages) =>
        [...currentImages, ...newImages].slice(0, MAX_IMAGES),
      );

      setActiveImage(images.length);
    } catch (error) {
      console.error("Gallery error:", error);

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Gallery Error",
        message: "Unable to select photos.",
        confirmText: "OK",
      });
    }
  };

  /**
   * Take a photo using the camera.
   */
  const takePhoto = async () => {
    try {
      if (images.length >= MAX_IMAGES) {
        showAlert({
          type: "warning",
          icon: "camera-outline",
          title: "Maximum Photos",
          message: "You can add up to 5 photos.",
          confirmText: "OK",
        });

        return;
      }

      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        showAlert({
          type: "warning",
          icon: "camera-outline",
          title: "Permission Required",
          message:
            "Please allow camera access to take a photo.",
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

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const uri = result.assets[0]?.uri;

      if (!uri) {
        return;
      }

      const newIndex = images.length;

      setImages((currentImages) => [...currentImages, uri]);
      setActiveImage(newIndex);
    } catch (error) {
      console.error("Camera error:", error);

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Camera Error",
        message: "Unable to take a photo.",
        confirmText: "OK",
      });
    }
  };

  /**
   * Capture the current location manually.
   */
  const handleLocationPress = async () => {
    try {
      if (locationCaptured) {
        return;
      }

      setLocationCaptured(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationCaptured(false);

        showAlert({
          type: "warning",
          icon: "location-outline",
          title: "Location Permission",
          message:
            "Location permission was not granted. You can still enter your location manually.",
          confirmText: "OK",
        });

        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

      const { latitude, longitude } = currentLocation.coords;

      let addressData = null;

      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        addressData = addresses?.[0] || null;
      } catch (geocodeError) {
        console.warn(
          "Reverse geocoding failed:",
          geocodeError,
        );
      }

      setLocationData({
        latitude,
        longitude,
        address: addressData?.formattedAddress || null,
        name: addressData?.name || null,
        district: addressData?.district || null,
        city: addressData?.city || null,
        region: addressData?.region || null,
        country: addressData?.country || null,
        postalCode: addressData?.postalCode || null,
        isoCountryCode: addressData?.isoCountryCode || null,
      });

      console.log("Location data captured:", {
        latitude,
        longitude,
        addressData,
      });
    } catch (error) {
      console.error("Location error:", error);

      setLocationCaptured(false);

      showAlert({
        type: "danger",
        icon: "location-outline",
        title: "Location Error",
        message:
          "Unable to capture your current location. You can still enter your location manually.",
        confirmText: "OK",
      });
    }
  };

  /**
   * Remove an image.
   */
  const removeImage = (index) => {
    setImages((currentImages) =>
      currentImages.filter(
        (_, imageIndex) => imageIndex !== index,
      ),
    );

    setActiveImage((currentIndex) => {
      const newLength = images.length - 1;

      if (newLength <= 0) {
        return 0;
      }

      if (index < currentIndex) {
        return Math.max(0, currentIndex - 1);
      }

      return Math.min(currentIndex, newLength - 1);
    });
  };

  /**
   * Update the active image when scrolling.
   */
  const handleImageScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    const pageWidth =
      event.nativeEvent.layoutMeasurement.width;

    if (!pageWidth) {
      return;
    }

    const index = Math.round(offsetX / pageWidth);

    setActiveImage(
      Math.max(0, Math.min(index, images.length - 1)),
    );
  };

  /**
   * Reset the form after navigating to the ticket preview.
   */
  const resetForm = () => {
    setImages([]);
    setActiveImage(0);

    setTitle("");
    setMemoryDate(normalizeMemoryDate());

    setNetwork(null);

    setLocation("");
    setLocationData(null);
    setLocationCaptured(false);

    setDescription("");
    setTags([]);

    setTicketCustomization(
      normalizeTicketCustomization(),
    );
  };

  /**
   * Validate the form and open the ticket preview.
   */
  const handleCreateMemory = () => {
    if (!images.length) {
      showAlert({
        type: "warning",
        icon: "images-outline",
        title: "Add Photos",
        message: "Please add at least one photo.",
        confirmText: "OK",
      });

      return;
    }

    if (!title.trim()) {
      showAlert({
        type: "warning",
        icon: "text-outline",
        title: "Memory Title",
        message: "Please give this memory a title.",
        confirmText: "OK",
      });

      return;
    }

    if (images.length > MAX_IMAGES) {
      showAlert({
        type: "warning",
        icon: "images-outline",
        title: "Maximum Photos",
        message: "You can add up to 5 photos.",
        confirmText: "OK",
      });

      return;
    }

    // Preserve the selected calendar date.
    const normalizedDate = normalizeMemoryDate(memoryDate);

    const draftMemory = {
      title: title.trim(),
      location: location.trim(),
      locationData,
      network,
      description: description.trim(),
      tags: [...tags],

      image: images[0] || null,
      images: [...images],

      date: normalizedDate.toISOString(),

      // Ticket customization
      ticketStyle: ticketCustomization.ticketStyle,
      ticketAccent: ticketCustomization.ticketAccent,
      ticketOptions: {
        ...ticketCustomization.ticketOptions,
      },
    };

    resetForm();

    navigation.navigate("TicketPreview", {
      memory: draftMemory,
    });
  };

  return (
    <View style={screenStyles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={screenStyles.backgroundColor}
      />

      <KeyboardAwareScrollView
        bottomOffset={30}
        contentContainerStyle={screenStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CreateMemoryHeader
          navigation={navigation}
          theme={theme}
          isDark={isDark}
        />

        <PhotoSection
          images={images}
          activeImage={activeImage}
          pickImages={pickImages}
          takePhoto={takePhoto}
          removeImage={removeImage}
          handleImageScroll={handleImageScroll}
          theme={theme}
          isDark={isDark}
        />

        <MemoryForm
          title={title}
          setTitle={setTitle}
          location={location}
          setLocation={setLocation}
          onLocationPress={handleLocationPress}
          theme={theme}
          isDark={isDark}
        />

        {/* Opens the date-picker bottom sheet */}
        <MemoryDatePicker
          value={memoryDate}
          onChange={(selectedDate) => {
            setMemoryDate(normalizeMemoryDate(selectedDate));
          }}
          theme={theme}
          isDark={isDark}
        />

        <TagsInput
          tags={tags}
          setTags={setTags}
          theme={theme}
          isDark={isDark}
        />

        <DescriptionInput
          description={description}
          setDescription={setDescription}
          theme={theme}
          isDark={isDark}
        />

        <PreviewButton
          onPress={handleCreateMemory}
          theme={theme}
          isDark={isDark}
        />

        <Text style={screenStyles.footerText}>
          KEEP THE MOMENT.
          {"\n"}
          KEEP THE STORY.
        </Text>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default CreateMemoryScreen;
