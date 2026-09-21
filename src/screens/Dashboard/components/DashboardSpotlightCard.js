import React, { useMemo } from "react";

import { Image, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { getMemoryDetailUrl } from "../../../utils/cloudinary";

import { styles } from "../dashboardStyles";

function formatDate(memory) {
  const value = memory?.createdAt || memory?.date;

  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function DashboardSpotlightCard({ memory, onPress }) {
  const imageUri = useMemo(() => {
    const image = memory?.images?.[0] || memory?.image || null;

    return image ? getMemoryDetailUrl(image) : null;
  }, [memory]);

  const location = memory?.locationData?.city || memory?.location || "";

  const date = formatDate(memory);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.spotlightCard}
    >
      <View style={styles.spotlightImageWrapper}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.spotlightImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.spotlightPlaceholder}>
            <Ionicons name="image-outline" size={34} color="#777681" />
          </View>
        )}

        <View style={styles.spotlightBadge}>
          <Text style={styles.spotlightBadgeText}>MEMORY SPOTLIGHT</Text>
        </View>
      </View>

      <View style={styles.spotlightContent}>
        <View style={styles.spotlightMain}>
          <Text numberOfLines={2} style={styles.spotlightTitle}>
            {memory?.title || "A moment worth remembering"}
          </Text>

          {date && <Text style={styles.spotlightDate}>{date}</Text>}

          {location && (
            <View style={styles.spotlightLocationRow}>
              <Ionicons name="location-outline" size={13} color="#34345C" />

              <Text numberOfLines={1} style={styles.spotlightLocation}>
                {location}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.spotlightArrow}>
          <Ionicons name="chevron-forward" size={18} color="#34345C" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(DashboardSpotlightCard);
