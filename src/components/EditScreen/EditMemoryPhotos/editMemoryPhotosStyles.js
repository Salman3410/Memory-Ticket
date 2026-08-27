import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#242424",
  },

  photoCountText: {
    marginTop: 4,
    fontSize: 12,
    color: "#707080",
  },

  stepText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#707080",
  },

  imageContainer: {
    width: 300,
    height: 220,
    marginRight: 12,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#D9D8E2",
  },

  selectedImage: {
    width: "100%",
    height: "100%",
  },

  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center",
  },

  imageNumber: {
    position: "absolute",
    left: 10,
    bottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },

  imageNumberText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  addMoreRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  addMoreButton: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: "#34345C",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  addMoreText: {
    color: "#34345C",
    fontSize: 12,
    fontWeight: "700",
  },

  addCameraButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#34345C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  addCameraText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  swipeHint: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },

  swipeHintText: {
    fontSize: 11,
    color: "#707080",
  },

  emptyImageContainer: {
    height: 180,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F1F5",
  },

  emptyImageText: {
    marginTop: 8,
    fontSize: 13,
    color: "#707080",
  },
});

export default styles;
