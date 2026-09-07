import {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import CreateMemoryHeader from "./components/CreateMemoryHeader";
import PhotoSection from "./components/PhotoSection";
import MemoryForm from "./components/MemoryForm";
import DescriptionInput from "./components/DescriptionInput";
import PreviewButton from "./components/PreviewButton";
import styles from "./createMemoryStyles";

const MAX_IMAGES = 5;

function CreateMemoryScreen({
  navigation,
  route,
}) {
  const [images, setImages] =
    useState([]);

  const [activeImage, setActiveImage] =
    useState(0);

  const [title, setTitle] =
    useState("");

  // MANUALLY ENTERED LOCATION
  const [location, setLocation] =
    useState("");

  // DEVICE GPS LOCATION DATA
  const [locationData, setLocationData] =
    useState(null);

  const [description, setDescription] =
    useState("");

  /*
   * Prevents requesting/capturing the
   * device location multiple times for
   * the same memory.
   */
  const [locationCaptured, setLocationCaptured] =
    useState(false);

  useEffect(() => {
    const editMemory =
      route?.params?.editMemory;

    if (!editMemory) {
      return;
    }

    const existingImages =
      Array.isArray(editMemory.images)
        ? editMemory.images
        : editMemory.image
          ? [editMemory.image]
          : [];

    setImages(
      existingImages.slice(
        0,
        MAX_IMAGES,
      ),
    );

    setActiveImage(0);

    setTitle(
      editMemory.title || "",
    );

    // Keep the user's original manual location
    setLocation(
      editMemory.location || "",
    );

    // Keep the existing GPS data
    setLocationData(
      editMemory.locationData ||
        null,
    );

    // If editing and locationData already exists,
    // don't immediately capture a new location.
    setLocationCaptured(
      !!editMemory.locationData,
    );

    setDescription(
      editMemory.description || "",
    );

    navigation.setParams({
      editMemory: undefined,
    });
  }, [
    route?.params?.editMemory,
    navigation,
  ]);

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

      const remainingSlots =
        MAX_IMAGES -
        images.length;

      if (remainingSlots <= 0) {
        Alert.alert(
          "Maximum Photos",
          "You can add up to 5 photos.",
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsMultipleSelection:
            true,
          selectionLimit:
            remainingSlots,
          quality: 0.8,
        });

      if (
        result.canceled ||
        !result.assets?.length
      ) {
        return;
      }

      const newImages =
        result.assets
          .filter(
            (asset) =>
              asset?.uri,
          )
          .map(
            (asset) =>
              asset.uri,
          );

      if (!newImages.length) {
        return;
      }

      setImages(
        (currentImages) => [
          ...currentImages,
          ...newImages,
        ].slice(
          0,
          MAX_IMAGES,
        ),
      );

      setActiveImage(
        images.length,
      );
    } catch (error) {
      console.error(
        "Gallery error:",
        error,
      );

      Alert.alert(
        "Error",
        "Unable to select photos.",
      );
    }
  };

  const takePhoto = async () => {
    try {
      if (
        images.length >=
        MAX_IMAGES
      ) {
        Alert.alert(
          "Maximum Photos",
          "You can add up to 5 photos.",
        );
        return;
      }

      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow camera access to take a photo.",
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
        result.canceled ||
        !result.assets?.length
      ) {
        return;
      }

      const uri =
        result.assets[0]?.uri;

      if (!uri) {
        return;
      }

      const newIndex =
        images.length;

      setImages(
        (currentImages) => [
          ...currentImages,
          uri,
        ],
      );

      setActiveImage(
        newIndex,
      );
    } catch (error) {
      console.error(
        "Camera error:",
        error,
      );

      Alert.alert(
        "Error",
        "Unable to take a photo.",
      );
    }
  };

  /*
   * IMPORTANT:
   *
   * This function ONLY captures the
   * device's GPS information.
   *
   * It does NOT modify `location`.
   *
   * The user still manually types
   * the location into the Location field.
   */
  const handleLocationPress = async () => {
    try {
      // Already captured for this memory.
      if (locationCaptured) {
        return;
      }

      /*
       * Mark as captured/requested before
       * the async work starts so repeated
       * focus events don't create multiple
       * permission requests.
       */
      setLocationCaptured(true);

      // Ask for foreground location permission
      const {
        status,
      } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        /*
         * The user can still manually
         * enter a location.
         *
         * locationData stays null.
         */
        setLocationCaptured(false);

        Alert.alert(
          "Location Permission",
          "Location permission was not granted. You can still enter your location manually.",
        );

        return;
      }

      // Get current device GPS location
      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy:
            Location.Accuracy.Balanced,
        });

      const {
        latitude,
        longitude,
      } = currentLocation.coords;

      /*
       * Try to get readable address
       * information from the coordinates.
       */
      let addressData = null;

      try {
        const addresses =
          await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });

        addressData =
          addresses?.[0] ||
          null;
      } catch (geocodeError) {
        console.warn(
          "Reverse geocoding failed:",
          geocodeError,
        );
      }

      /*
       * IMPORTANT:
       *
       * Do NOT call setLocation() here.
       *
       * `location` is the text manually
       * entered by the user.
       */
      setLocationData({
        latitude,
        longitude,

        address:
          addressData?.formattedAddress ||
          null,

        name:
          addressData?.name ||
          null,

        district:
          addressData?.district ||
          null,

        city:
          addressData?.city ||
          null,

        region:
          addressData?.region ||
          null,

        country:
          addressData?.country ||
          null,

        postalCode:
          addressData?.postalCode ||
          null,

        isoCountryCode:
          addressData?.isoCountryCode ||
          null,
      });

      console.log(
        "Location data captured:",
        {
          latitude,
          longitude,
          addressData,
        },
      );
    } catch (error) {
      console.error(
        "Location error:",
        error,
      );

      // Allow another attempt after an error
      setLocationCaptured(false);

      Alert.alert(
        "Location Error",
        "Unable to capture your current location. You can still enter your location manually.",
      );
    }
  };

  const removeImage = (
    index,
  ) => {
    setImages(
      (currentImages) =>
        currentImages.filter(
          (_, imageIndex) =>
            imageIndex !== index,
        ),
    );

    setActiveImage(
      (currentIndex) => {
        const newLength =
          images.length - 1;

        if (newLength <= 0) {
          return 0;
        }

        if (
          index < currentIndex
        ) {
          return Math.max(
            0,
            currentIndex - 1,
          );
        }

        return Math.min(
          currentIndex,
          newLength - 1,
        );
      },
    );
  };

  const handleImageScroll = (
    event,
  ) => {
    const offsetX =
      event.nativeEvent
        .contentOffset.x;

    const pageWidth =
      event.nativeEvent
        .layoutMeasurement
        .width;

    if (!pageWidth) {
      return;
    }

    const index =
      Math.round(
        offsetX / pageWidth,
      );

    setActiveImage(
      Math.max(
        0,
        Math.min(
          index,
          images.length - 1,
        ),
      ),
    );
  };

  const resetForm = () => {
    setImages([]);
    setActiveImage(0);
    setTitle("");
    setLocation("");
    setLocationData(null);
    setDescription("");
    setLocationCaptured(false);
  };

  const handleCreateMemory = () => {
    if (!images.length) {
      Alert.alert(
        "Add Photos",
        "Please add at least one photo.",
      );
      return;
    }

    if (!title.trim()) {
      Alert.alert(
        "Memory Title",
        "Please give this memory a title.",
      );
      return;
    }

    if (
      images.length >
      MAX_IMAGES
    ) {
      Alert.alert(
        "Maximum Photos",
        "You can add up to 5 photos.",
      );
      return;
    }

    /*
     * BOTH values are preserved:
     *
     * location:
     *   User manually entered text
     *
     * locationData:
     *   GPS information captured
     *   from the device
     */
    const draftMemory = {
      title:
        title.trim(),

      location:
        location.trim(),

      locationData,

      description:
        description.trim(),

      image:
        images[0] || null,

      images: [
        ...images,
      ],

      date:
        new Date().toISOString(),
    };

    resetForm();

    navigation.navigate(
      "TicketPreview",
      {
        memory:
          draftMemory,
      },
    );
  };

  return (
    <View
      style={styles.container}
    >
      <FlatList
        data={[
          {
            key: "form",
          },
        ]}
        keyExtractor={(item) =>
          item.key
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
        renderItem={() => (
          <>
            <CreateMemoryHeader
              navigation={
                navigation
              }
            />

            <PhotoSection
              images={
                images
              }
              activeImage={
                activeImage
              }
              pickImages={
                pickImages
              }
              takePhoto={
                takePhoto
              }
              removeImage={
                removeImage
              }
              handleImageScroll={
                handleImageScroll
              }
            />

            <MemoryForm
              title={
                title
              }
              setTitle={
                setTitle
              }
              location={
                location
              }
              setLocation={
                setLocation
              }
              onLocationPress={
                handleLocationPress
              }
            />

            <DescriptionInput
              description={
                description
              }
              setDescription={
                setDescription
              }
            />

            <PreviewButton
              onPress={
                handleCreateMemory
              }
            />

            <Text
              style={
                styles.footerText
              }
            >
              KEEP THE MOMENT.
              KEEP THE STORY.
            </Text>
          </>
        )}
      />
    </View>
  );
}

export default CreateMemoryScreen;

