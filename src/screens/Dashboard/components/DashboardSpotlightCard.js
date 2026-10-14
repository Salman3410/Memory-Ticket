import React, { useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";
import { getMemoryDetailUrl } from "../../../utils/cloudinary";
import { createDashboardStyles } from "../dashboardStyles";

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
  const { theme, isDark } = useTheme();

  const styles = useMemo(
    () => createDashboardStyles(theme, isDark),
    [theme, isDark]
  );

  const imageUri = useMemo(() => {
    const image = memory?.images?.[0] || memory?.image || null;

    return image ? getMemoryDetailUrl(image) : null;
  }, [memory]);

  const location = memory?.locationData?.city || memory?.location || "";
  const date = formatDate(memory);

  const primaryColor = theme.colors.primary;
  const placeholderColor =
    theme.colors.textSecondary || (isDark ? "#B7B6C8" : "#777681");

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
            <Ionicons
              name="image-outline"
              size={34}
              color={placeholderColor}
            />
          </View>
        )}

        <View style={styles.spotlightBadge}>
          <Text style={styles.spotlightBadgeText}>
            MEMORY SPOTLIGHT
          </Text>
        </View>
      </View>

      <View style={styles.spotlightContent}>
        <View style={styles.spotlightMain}>
          <Text numberOfLines={2} style={styles.spotlightTitle}>
            {memory?.title || "A moment worth remembering"}
          </Text>

          {date && (
            <Text style={styles.spotlightDate}>
              {date}
            </Text>
          )}

          {location && (
            <View style={styles.spotlightLocationRow}>
              <Ionicons
                name="location-outline"
                size={13}
                color={primaryColor}
              />

              <Text
                numberOfLines={1}
                style={styles.spotlightLocation}
              >
                {location}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.spotlightArrow}>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={primaryColor}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(DashboardSpotlightCard);