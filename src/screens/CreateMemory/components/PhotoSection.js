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
}) {
  return (
    <View style={styles.section}>
      {/* SECTION HEADER */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Photos</Text>

        <Text style={styles.stepText}>
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
          />

          {/* ADD MORE */}
          {images.length < MAX_IMAGES && (
            <View style={styles.addMoreRow}>
              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={pickImages}
                activeOpacity={0.8}
              >
                <Ionicons name="images-outline" size={18} color="#34345C" />

                <Text style={styles.addMoreText}>ADD MORE</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addCameraButton}
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
                color="#707080"
              />

              <Text style={styles.swipeHintText}>Swipe to view photos</Text>

              <Text style={styles.swipeCountText}>
                {activeImage + 1}/{images.length}
              </Text>
            </View>
          )}
        </>
      ) : (
        /* EMPTY PHOTO PLACEHOLDER */
        <PhotoPlaceholder pickImages={pickImages} takePhoto={takePhoto} />
      )}
    </View>
  );
}

export default PhotoSection;
