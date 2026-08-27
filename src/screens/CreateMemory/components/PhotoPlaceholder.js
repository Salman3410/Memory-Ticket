import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../createMemoryStyles";

function PhotoPlaceholder({ pickImages, takePhoto }) {
  return (
    <View style={styles.photoPlaceholder}>
      <View style={styles.photoIcon}>
        <Ionicons name="images-outline" size={30} color="#34345C" />
      </View>

      <Text style={styles.photoTitle}>Add your photos</Text>

      <Text style={styles.photoDescription}>
        Capture this moment with up to 5 photos.
      </Text>

      <View style={styles.photoButtons}>
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={pickImages}
          activeOpacity={0.8}
        >
          <Ionicons name="images-outline" size={19} color="#34345C" />

          <Text style={styles.galleryButtonText}>ADD PHOTOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cameraButton}
          onPress={takePhoto}
          activeOpacity={0.8}
        >
          <Ionicons name="camera-outline" size={19} color="#FFFFFF" />

          <Text style={styles.cameraButtonText}>CAMERA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default PhotoPlaceholder;
