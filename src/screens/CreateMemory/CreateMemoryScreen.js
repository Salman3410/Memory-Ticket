import { useEffect, useState } from "react";

import { View, Text, Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";

import * as Location from "expo-location";

import CreateMemoryHeader from "./components/CreateMemoryHeader";

import PhotoSection from "./components/PhotoSection";

import MemoryForm from "./components/MemoryForm";

import DescriptionInput from "./components/DescriptionInput";

import PreviewButton from "./components/PreviewButton";

import TagsInput from "../../components/TagsInput/TagsInput";

import styles from "./createMemoryStyles";

import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { getNetworkInfo } from "../../services/networkService";

import { normalizeTicketCustomization } from "../../utils/ticketCustomization";

const MAX_IMAGES = 5;

function CreateMemoryScreen({ navigation, route }) {
  const [images, setImages] = useState([]);

  const [activeImage, setActiveImage] = useState(0);

  const [title, setTitle] = useState("");

  const [network, setNetwork] = useState(null);

  const [location, setLocation] = useState("");

  const [locationData, setLocationData] = useState(null);

  const [locationCaptured, setLocationCaptured] = useState(false);

  const [description, setDescription] = useState("");

  const [tags, setTags] = useState([]);

  // --------------------------------------------------
  // TICKET CUSTOMIZATION
  // --------------------------------------------------

  const [ticketCustomization, setTicketCustomization] = useState(() =>
    normalizeTicketCustomization(),
  );

  const editMemory = route?.params?.editMemory;

  // --------------------------------------------------
  // LOAD EDIT MEMORY
  // --------------------------------------------------

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

    // Keep the existing manual location.
    setLocation(editMemory.location || "");

    // Keep existing GPS data.
    setLocationData(editMemory.locationData || null);

    setLocationCaptured(!!editMemory.locationData);

    // Keep existing network information.
    setNetwork(editMemory.network || editMemory.environment?.network || null);

    setDescription(editMemory.description || "");

    setTags(Array.isArray(editMemory.tags) ? editMemory.tags : []);

    // Keep existing ticket customization.
    setTicketCustomization(normalizeTicketCustomization(editMemory));

    navigation.setParams({
      editMemory: undefined,
    });
  }, [editMemory, navigation]);

  // --------------------------------------------------
  // AUTOMATIC NETWORK + LOCATION
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const captureMemoryEnvironment = async () => {
      // ------------------------------------------
      // NETWORK
      // ------------------------------------------

      try {
        const networkInfo = await getNetworkInfo();

        if (!cancelled) {
          setNetwork(networkInfo);
        }
      } catch (error) {
        console.warn("Network info capture failed:", error);
      }

      // ------------------------------------------
      // EXISTING LOCATION
      // ------------------------------------------

      if (editMemory?.locationData) {
        return;
      }

      // ------------------------------------------
      // LOCATION PERMISSION
      // ------------------------------------------

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted" || cancelled) {
          return;
        }

        // ----------------------------------------
        // CURRENT GPS LOCATION
        // ----------------------------------------

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (cancelled) {
          return;
        }

        const { latitude, longitude } = currentLocation.coords;

        let addressData = null;

        // ----------------------------------------
        // REVERSE GEOCODING
        // ----------------------------------------

        try {
          const addresses = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });

          addressData = addresses?.[0] || null;
        } catch (geocodeError) {
          console.warn("Reverse geocoding failed:", geocodeError);
        }

        if (cancelled) {
          return;
        }

        // ----------------------------------------
        // SAVE LOCATION DATA
        // ----------------------------------------

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
        console.warn("Automatic location capture failed:", error);
      }
    };

    captureMemoryEnvironment();

    return () => {
      cancelled = true;
    };
  }, [editMemory]);

  // --------------------------------------------------
  // PICK IMAGES
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

      Alert.alert("Error", "Unable to select photos.");
    }
  };

  // --------------------------------------------------
  // TAKE PHOTO
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

      Alert.alert("Error", "Unable to take a photo.");
    }
  };

  // --------------------------------------------------
  // MANUAL LOCATION
  // --------------------------------------------------

  const handleLocationPress = async () => {
    try {
      // Already captured.
      if (locationCaptured) {
        return;
      }

      setLocationCaptured(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationCaptured(false);

        Alert.alert(
          "Location Permission",
          "Location permission was not granted. You can still enter your location manually.",
        );

        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
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
        console.warn("Reverse geocoding failed:", geocodeError);
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

      Alert.alert(
        "Location Error",
        "Unable to capture your current location. You can still enter your location manually.",
      );
    }
  };

  // --------------------------------------------------
  // REMOVE IMAGE
  // --------------------------------------------------

  const removeImage = (index) => {
    setImages((currentImages) =>
      currentImages.filter((_, imageIndex) => imageIndex !== index),
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

    setActiveImage(Math.max(0, Math.min(index, images.length - 1)));
  };

  // --------------------------------------------------
  // RESET FORM
  // --------------------------------------------------

  const resetForm = () => {
    setImages([]);

    setActiveImage(0);

    setTitle("");

    setNetwork(null);

    setLocation("");

    setLocationData(null);

    setDescription("");

    setTags([]);

    setLocationCaptured(false);

    setTicketCustomization(normalizeTicketCustomization());
  };

  // --------------------------------------------------
  // CREATE / PREVIEW MEMORY
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

    if (images.length > MAX_IMAGES) {
      Alert.alert("Maximum Photos", "You can add up to 5 photos.");

      return;
    }

    const draftMemory = {
      title: title.trim(),

      location: location.trim(),

      locationData,

      network,

      description: description.trim(),

      tags: [...tags],

      image: images[0] || null,

      images: [...images],

      date: new Date().toISOString(),

      // ------------------------------------------------
      // TICKET CUSTOMIZATION
      // ------------------------------------------------

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
    <View style={styles.container}>
      <KeyboardAwareScrollView
        bottomOffset={30}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CreateMemoryHeader navigation={navigation} />

        <PhotoSection
          images={images}
          activeImage={activeImage}
          pickImages={pickImages}
          takePhoto={takePhoto}
          removeImage={removeImage}
          handleImageScroll={handleImageScroll}
        />

        <MemoryForm
          title={title}
          setTitle={setTitle}
          location={location}
          setLocation={setLocation}
          onLocationPress={handleLocationPress}
        />

        <TagsInput tags={tags} setTags={setTags} />

        <DescriptionInput
          description={description}
          setDescription={setDescription}
        />

        <PreviewButton onPress={handleCreateMemory} />

        <Text style={styles.footerText}>
          KEEP THE MOMENT.
          {"\n"}
          KEEP THE STORY.
        </Text>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default CreateMemoryScreen;
