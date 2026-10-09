import React from "react";

import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "../createMemoryStyles";

function PhotoPreview({
  images,
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

  const accentColor = colors.accent || "#E76F51";

  const getImageUri = (item) => {
    if (!item) {
      return null;
    }

    if (typeof item === "string") {
      return item;
    }

    if (typeof item === "object" && item.uri) {
      return item.uri;
    }

    return null;
  };

  const renderImage = ({ item, index }) => {
    const uri = getImageUri(item);

    if (!uri) {
      return (
        <View
          style={[
            styles.imagePage,
            {
              backgroundColor: surfaceColor,
            },
          ]}
        >
          <View
            style={[
              styles.imageError,
              {
                backgroundColor: surfaceColor,
                borderColor,
              },
            ]}
          >
            <Ionicons name="image-outline" size={40} color={mutedTextColor} />

            <Text
              style={[
                styles.imageErrorText,
                {
                  color: textColor,
                },
              ]}
            >
              Image unavailable
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.imagePage}>
        <Image
          source={{ uri }}
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
          onPress={() => removeImage(index)}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={20} color="#FFFFFF" />
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
        styles.imageContainer,
        {
          backgroundColor: surfaceColor,
        },
      ]}
    >
      <FlatList
        data={images}
        keyExtractor={(item, index) => {
          const uri = typeof item === "string" ? item : item?.uri || "image";

          return `${uri}-${index}`;
        }}
        renderItem={renderImage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        decelerationRate="fast"
        disableIntervalMomentum={true}
        onScroll={handleImageScroll}
        scrollEventThrottle={16}
        nestedScrollEnabled
      />
    </View>
  );
}

export default PhotoPreview;
