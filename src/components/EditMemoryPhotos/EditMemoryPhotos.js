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
}) {
  const renderImage = ({ item, index }) => {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item }}
          style={styles.selectedImage}
          resizeMode="cover"
        />

        {/* REMOVE */}
        <TouchableOpacity
          style={styles.removeImageButton}
          onPress={() => onRemoveImage(index)}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        {/* NUMBER */}
        <View style={styles.imageNumber}>
          <Text style={styles.imageNumberText}>
            {index + 1}/{images.length}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.section}>
      {/* SECTION HEADER */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Your photos</Text>

          <Text style={styles.photoCountText}>
            {images.length}/{MAX_IMAGES} photos
          </Text>
        </View>

        <Text style={styles.stepText}>PHOTOS</Text>
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
        />
      ) : (
        /* EMPTY IMAGE */
        <View style={styles.emptyImageContainer}>
          <Ionicons name="images-outline" size={35} color="#34345C" />

          <Text style={styles.emptyImageText}>No photos</Text>
        </View>
      )}

      {/* ADD MORE */}
      {images.length < MAX_IMAGES && (
        <View style={styles.addMoreRow}>
          <TouchableOpacity
            style={styles.addMoreButton}
            onPress={onPickImages}
            activeOpacity={0.8}
          >
            <Ionicons name="images-outline" size={17} color="#34345C" />

            <Text style={styles.addMoreText}>ADD PHOTOS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addCameraButton}
            onPress={onTakePhoto}
            activeOpacity={0.8}
          >
            <Ionicons name="camera-outline" size={17} color="#FFFFFF" />

            <Text style={styles.addCameraText}>CAMERA</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* SWIPE HINT */}
      {images.length > 1 && (
        <View style={styles.swipeHint}>
          <Ionicons name="swap-horizontal-outline" size={15} color="#707080" />

          <Text style={styles.swipeHintText}>Swipe to view photos</Text>
        </View>
      )}
    </View>
  );
}

export default EditMemoryPhotos;
