import { memo, useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getMemoryThumbnailUrl } from "../../utils/cloudinary";
import MementoLogo from "../common/MementoLogo";

function CollectionPreviewCard({ collection, onPress }) {
  const coverImage =
    collection?.coverMemoryId?.images?.[0] ||
    collection?.coverMemoryId?.image ||
    null;

  const coverImageUrl = useMemo(
    () => (coverImage ? getMemoryThumbnailUrl(coverImage) : null),
    [coverImage],
  );

  const memoryCount = collection?.memoryCount || 0;

  return (
    <TouchableOpacity
      style={styles.ticket}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.cover}>
        {coverImageUrl ? (
          <Image
            source={{ uri: coverImageUrl }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <MementoLogo size={42} borderRadius={21} />
          </View>
        )}

        <View style={styles.coverOverlay} />

        <Text style={styles.label}>COLLECTION</Text>
      </View>

      <View style={styles.divider}>
        <View style={styles.notchLeft} />
        <View style={styles.dashedLine} />
        <View style={styles.notchRight} />
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {collection?.name || "Untitled Collection"}
        </Text>

        <Text style={styles.count}>
          {memoryCount === 1 ? "1 MEMORY" : `${memoryCount} MEMORIES`}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.brand}>MEMENTO</Text>

          <View style={styles.barcode}>
            {[4, 2, 5, 3, 6].map((width, index) => (
              <View key={index} style={[styles.bar, { width }]} />
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(CollectionPreviewCard);

const styles = StyleSheet.create({
  ticket: {
    width: 180,
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },

  cover: {
    height: 88,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#34345C",
  },

  coverImage: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  placeholderMark: {
    fontSize: 27,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(28, 28, 42, 0.3)",
  },

  label: {
    position: "absolute",
    left: 12,
    bottom: 11,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: "#FFFFFF",
  },

  divider: {
    height: 15,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#FFFFFF",
  },

  dashedLine: {
    width: "84%",
    borderTopWidth: 1,
    borderTopColor: "#CFCED8",
    borderStyle: "dashed",
  },

  notchLeft: {
    position: "absolute",
    left: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#F1F0F6",
  },

  notchRight: {
    position: "absolute",
    right: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#F1F0F6",
  },

  content: {
    paddingHorizontal: 12,
    paddingBottom: 11,
  },

  name: {
    minHeight: 38,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
    color: "#242424",
  },

  count: {
    marginTop: 3,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#34345C",
  },

  footer: {
    marginTop: 10,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#ECEBF0",
  },

  brand: {
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1.3,
    color: "#9A99A2",
  },

  barcode: {
    height: 15,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 2,
  },

  bar: {
    height: "100%",
    backgroundColor: "#34345C",
  },
});
