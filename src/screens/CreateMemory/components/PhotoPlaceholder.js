import React from "react";

import { View, Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "../createMemoryStyles";

function PhotoPlaceholder({ pickImages, takePhoto, theme, isDark }) {
  const colors = theme?.colors || {};

  const textColor = colors.text || (isDark ? "#F1F0F6" : "#242424");

  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#737387");

  const backgroundColor =
    colors.surface || colors.card || (isDark ? "#232333" : "#FFFFFF");

  const borderColor = colors.border || (isDark ? "#38384C" : "#D9D8E2");

  const primaryColor = colors.primary || "#34345C";

  const accentColor = colors.accent || "#E76F51";

  return (
    <View
      style={[
        styles.photoPlaceholder,
        {
          backgroundColor,
          borderColor,
        },
      ]}
    >
      <View
        style={[
          styles.photoIcon,
          {
            backgroundColor: isDark ? "#303047" : "#F1F0F6",
          },
        ]}
      >
        <Ionicons name="images-outline" size={27} color={primaryColor} />
      </View>

      <Text
        style={[
          styles.photoTitle,
          {
            color: textColor,
          },
        ]}
      >
        Add your photos
      </Text>

      <Text
        style={[
          styles.photoDescription,
          {
            color: mutedTextColor,
          },
        ]}
      >
        Capture this moment with up to 5 photos.
      </Text>

      <View style={styles.photoButtons}>
        <TouchableOpacity
          style={[
            styles.galleryButton,
            {
              backgroundColor,
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
              styles.galleryButtonText,
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
            styles.cameraButton,
            {
              backgroundColor: accentColor,
            },
          ]}
          onPress={takePhoto}
          activeOpacity={0.8}
        >
          <Ionicons name="camera-outline" size={18} color="#FFFFFF" />

          <Text style={styles.cameraButtonText}>CAMERA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default PhotoPlaceholder;
