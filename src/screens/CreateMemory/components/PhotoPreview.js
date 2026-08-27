import React from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "../createMemoryStyles";

function PhotoPreview({ images, removeImage, handleImageScroll }) {
  // NORMALIZE IMAGE
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

  // RENDER IMAGE
  const renderImage = ({ item, index }) => {
    const uri = getImageUri(item);

    if (!uri) {
      return (
        <View style={styles.imagePage}>
          <View style={styles.imageError}>
            <Ionicons name="image-outline" size={40} color="#9A99A5" />

            <Text style={styles.imageErrorText}>Image unavailable</Text>
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

        {/* REMOVE */}
        <TouchableOpacity
          style={styles.removeImageButton}
          onPress={() => removeImage(index)}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* IMAGE NUMBER */}
        <View style={styles.imageNumber}>
          <Text style={styles.imageNumberText}>
            {index + 1}/{images.length}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.imageContainer}>
      <FlatList
        data={images}
        keyExtractor={(item, index) => `${item}-${index}`}
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
