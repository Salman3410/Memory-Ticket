import React, { useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { getMemoryThumbnailUrl } from "../../../utils/cloudinary";
import { styles } from "../dashboardStyles";

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function DashboardMemoryCard({ memory, onPress }) {
  const imageUri = useMemo(() => {
    const uri = memory?.images?.[0] || memory?.image || null;

    return uri ? getMemoryThumbnailUrl(uri) : null;
  }, [memory]);

  const date = formatDate(memory?.createdAt || memory?.date);

  const location = memory?.locationData?.city || memory?.location || "";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.memoryCard}
    >
      <View style={styles.memoryImageWrapper}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.memoryImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.memoryImagePlaceholder}>
            <Text style={styles.placeholderText}>M</Text>
          </View>
        )}
      </View>

      <View style={styles.memoryContent}>
        <Text numberOfLines={1} style={styles.memoryTitle}>
          {memory?.title || "Untitled memory"}
        </Text>

        {!!date && <Text style={styles.memoryDate}>{date}</Text>}

        {!!location && (
          <Text numberOfLines={1} style={styles.memoryLocation}>
            {location}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(DashboardMemoryCard);
