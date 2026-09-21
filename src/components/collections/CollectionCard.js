import { memo } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getMemoryThumbnailUrl } from "../../utils/cloudinary";

function CollectionCard({ collection, onPress }) {
  if (!collection) {
    return null;
  }

  const coverImage =
    collection?.coverMemoryId?.images?.[0] ||
    collection?.coverMemoryId?.image ||
    null;

  const coverImageUrl = coverImage
    ? getMemoryThumbnailUrl(coverImage)
    : null;

  const memoryCount = Number(
    collection?.memoryCount || 0,
  );

  const collectionName =
    collection?.name || "Untitled Collection";

  const description =
    collection?.description || "";

  return (
    <TouchableOpacity
      style={styles.ticket}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* COVER */}
      <View style={styles.cover}>
        {coverImageUrl ? (
          <Image
            source={{ uri: coverImageUrl }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>M</Text>
            </View>

            <Text style={styles.placeholderLabel}>
              MEMENTO
            </Text>
          </View>
        )}

        <View style={styles.coverOverlay} />

        {/* TOP */}
        <View style={styles.coverTop}>
          <Text style={styles.collectionLabel}>
            COLLECTION
          </Text>

          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {memoryCount}
            </Text>
          </View>
        </View>

        {/* BOTTOM */}
        <View style={styles.coverBottom}>
          <Text style={styles.coverHint}>
            A PLACE FOR YOUR MOMENTS
          </Text>
        </View>
      </View>

      {/* PERFORATED DIVIDER */}
      <View style={styles.divider}>
        <View style={styles.notchLeft} />

        <View style={styles.dashedLine} />

        <View style={styles.notchRight} />
      </View>

      {/* COLLECTION CONTENT */}
      <View style={styles.content}>
        <View style={styles.titleArea}>
          <Text
            style={styles.name}
            numberOfLines={2}
          >
            {collectionName}
          </Text>

          <Text style={styles.memoryText}>
            {memoryCount === 1
              ? "1 MEMORY"
              : `${memoryCount} MEMORIES`}
          </Text>
        </View>

        {description ? (
          <Text
            style={styles.description}
            numberOfLines={2}
          >
            {description}
          </Text>
        ) : null}

        {/* FOOTER */}
        <View style={styles.ticketFooter}>
          <Text style={styles.brand}>
            MEMENTO
          </Text>

          <View style={styles.barcode}>
            {[4, 2, 5, 3, 6, 2, 4, 3].map(
              (width, index) => (
                <View
                  key={index}
                  style={[
                    styles.bar,
                    { width },
                  ]}
                />
              ),
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(CollectionCard);

const styles = StyleSheet.create({
  ticket: {
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },

  cover: {
    height: 155,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#34345C",
  },

  coverImage: {
    width: "100%",
    height: "100%",
  },

  coverPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E76F51",
  },

  logoText: {
    fontSize: 21,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  placeholderLabel: {
    marginTop: 10,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.8,
    color: "#D9D8E2",
  },

  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(28, 28, 42, 0.3)",
  },

  coverTop: {
    position: "absolute",
    top: 13,
    left: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  collectionLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.6,
    color: "#FFFFFF",
  },

  countBadge: {
    minWidth: 32,
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
  },

  countBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#34345C",
  },

  coverBottom: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 13,
  },

  coverHint: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.25,
    color: "rgba(255, 255, 255, 0.82)",
  },

  divider: {
    height: 18,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  dashedLine: {
    width: "88%",
    borderTopWidth: 1,
    borderTopColor: "#CFCED8",
    borderStyle: "dashed",
  },

  notchLeft: {
    position: "absolute",
    left: -9,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#F1F0F6",
  },

  notchRight: {
    position: "absolute",
    right: -9,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#F1F0F6",
  },

  content: {
    paddingHorizontal: 14,
    paddingTop: 1,
    paddingBottom: 13,
  },

  titleArea: {
    minHeight: 58,
    justifyContent: "center",
  },

  name: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: "800",
    color: "#242424",
  },

  memoryText: {
    marginTop: 5,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.1,
    color: "#34345C",
  },

  description: {
    marginTop: 7,
    fontSize: 11,
    lineHeight: 16,
    color: "#707070",
  },

  ticketFooter: {
    marginTop: 10,
    paddingTop: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#ECEBF0",
  },

  brand: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#9A99A2",
  },

  barcode: {
    height: 19,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 2,
  },

  bar: {
    height: "100%",
    backgroundColor: "#34345C",
  },
});

