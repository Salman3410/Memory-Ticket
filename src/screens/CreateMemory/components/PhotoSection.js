import React from "react";

import { View, Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import PhotoPreview from "./PhotoPreview";
import PhotoPlaceholder from "./PhotoPlaceholder";

import styles from "../createMemoryStyles";

const MAX_IMAGES = 5;

function PhotoSection({
  images,
  activeImage,
  pickImages,
  takePhoto,
  removeImage,
  handleImageScroll,
  theme,
  isDark,
}) {
  const colors = theme?.colors || {};

  const textColor = colors.text || (isDark ? "#F1F0F6" : "#242424");

  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#737387");

  const surfaceColor =
    colors.surface || colors.card || (isDark ? "#232333" : "#FFFFFF");

  const borderColor = colors.border || (isDark ? "#38384C" : "#D9D8E2");

  const primaryColor = colors.primary || "#34345C";

  const accentColor = colors.accent || "#E76F51";

  return (
    <View style={styles.section}>
      {/* SECTION HEADER */}
      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: textColor,
            },
          ]}
        >
          Photos
        </Text>

        <Text
          style={[
            styles.stepText,
            {
              color: mutedTextColor,
            },
          ]}
        >
          {images.length}/{MAX_IMAGES}
        </Text>
      </View>

      {images.length > 0 ? (
        <>
          {/* PHOTO PREVIEW */}
          <PhotoPreview
            images={images}
            removeImage={removeImage}
            handleImageScroll={handleImageScroll}
            theme={theme}
            isDark={isDark}
          />

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
                onPress={pickImages}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="images-outline"
                  size={18}
                  color={isDark ? "#B8B8D0" : primaryColor}
                />

                <Text
                  style={[
                    styles.addMoreText,
                    {
                      color: textColor,
                    },
                  ]}
                >
                  ADD MORE
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addCameraButton,
                  {
                    backgroundColor: accentColor,
                  },
                ]}
                onPress={takePhoto}
                activeOpacity={0.8}
              >
                <Ionicons name="camera-outline" size={18} color="#FFFFFF" />

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

              <Text
                style={[
                  styles.swipeCountText,
                  {
                    color: textColor,
                  },
                ]}
              >
                {activeImage + 1}/{images.length}
              </Text>
            </View>
          )}
        </>
      ) : (
        /* EMPTY PHOTO PLACEHOLDER */
        <PhotoPlaceholder
          pickImages={pickImages}
          takePhoto={takePhoto}
          theme={theme}
          isDark={isDark}
        />
      )}
    </View>
  );
}

export default PhotoSection;
