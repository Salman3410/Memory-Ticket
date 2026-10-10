import React from "react";

import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "./editMemoryPhotosStyles";

const MAX_IMAGES = 5;

function EditMemoryPhotos({
  images,
  onPickImages,
  onTakePhoto,
  onRemoveImage,
  theme,
  isDark,
}) {
  const colors = theme?.colors || {};

  const backgroundColor = colors.background || (isDark ? "#171724" : "#F1F0F6");

  const surfaceColor =
    colors.surface || colors.card || (isDark ? "#232333" : "#FFFFFF");

  const textColor = colors.text || (isDark ? "#F1F0F6" : "#242424");

  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#737387");

  const borderColor = colors.border || (isDark ? "#38384C" : "#D9D8E2");

  const primaryColor = colors.primary || "#34345C";
  const accentColor = colors.accent || "#E76F51";

  const renderImage = ({ item, index }) => {
    return (
      <View
        style={[
          styles.imageContainer,
          {
            backgroundColor: surfaceColor,
          },
        ]}
      >
        <Image
          source={{ uri: item }}
          style={styles.selectedImage}
          resizeMode="cover"
        />

        {/* REMOVE IMAGE */}

        <TouchableOpacity
          style={[
            styles.removeImageButton,
            {
              backgroundColor: accentColor,
            },
          ]}
          onPress={() => onRemoveImage(index)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Remove photo ${index + 1}`}
        >
          <Ionicons name="close" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        {/* IMAGE NUMBER */}

        <View
          style={[
            styles.imageNumber,
            {
              backgroundColor: isDark
                ? "rgba(23, 23, 36, 0.88)"
                : "rgba(36, 36, 36, 0.75)",
            },
          ]}
        >
          <Text
            style={[
              styles.imageNumberText,
              {
                color: "#FFFFFF",
              },
            ]}
          >
            {index + 1}/{images.length}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor,
        },
      ]}
    >
      {/* SECTION HEADER */}

      <View style={styles.sectionHeader}>
        <View>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: textColor,
              },
            ]}
          >
            Your photos
          </Text>

          <Text
            style={[
              styles.photoCountText,
              {
                color: mutedTextColor,
              },
            ]}
          >
            {images.length}/{MAX_IMAGES} photos
          </Text>
        </View>

        <Text
          style={[
            styles.stepText,
            {
              color: accentColor,
            },
          ]}
        >
          PHOTOS
        </Text>
      </View>

      {/* IMAGE CAROUSEL */}

      {images.length > 0 ? (
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={renderImage}
          nestedScrollEnabled
        />
      ) : (
        /* EMPTY IMAGE STATE */

        <View
          style={[
            styles.emptyImageContainer,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          <Ionicons name="images-outline" size={35} color={primaryColor} />

          <Text
            style={[
              styles.emptyImageText,
              {
                color: textColor,
              },
            ]}
          >
            No photos
          </Text>
        </View>
      )}

      {/* ADD MORE PHOTOS */}

      {images.length < MAX_IMAGES && (
        <View style={styles.addMoreRow}>
          <TouchableOpacity
            style={[
              styles.addMoreButton,
              {
                backgroundColor: surfaceColor,
                borderColor,
              },
            ]}
            onPress={onPickImages}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Add photos"
          >
            <Ionicons name="images-outline" size={17} color={primaryColor} />

            <Text
              style={[
                styles.addMoreText,
                {
                  color: textColor,
                },
              ]}
            >
              ADD PHOTOS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.addCameraButton,
              {
                backgroundColor: accentColor,
              },
            ]}
            onPress={onTakePhoto}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Take a photo"
          >
            <Ionicons name="camera-outline" size={17} color="#FFFFFF" />

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
            color={mutedTextColor}
          />

          <Text
            style={[
              styles.swipeHintText,
              {
                color: mutedTextColor,
              },
            ]}
          >
            Swipe to view photos
          </Text>
        </View>
      )}
    </View>
  );
}

export default EditMemoryPhotos;
