import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 110,
  },

  // --------------------------------
  // HEADER
  // --------------------------------

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  headerTitleContainer: {
    flex: 1,
  },

  headerEyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: "#E76F51",
    marginBottom: 3,
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#242424",
  },

  headerSpacer: {
    width: 44,
  },

  // --------------------------------
  // SECTION
  // --------------------------------

  section: {
    marginBottom: 30,
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

  stepText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#707080",
  },

  // --------------------------------
  // EMPTY PHOTO PLACEHOLDER
  // --------------------------------

  photoPlaceholder: {
    backgroundColor: "#FFFFFF",

    borderRadius: 14,

    alignItems: "center",

    paddingHorizontal: 20,
    paddingVertical: 26,
  },

  photoIcon: {
    width: 54,
    height: 54,

    borderRadius: 14,

    backgroundColor: "#F1F0F6",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 14,
  },

  photoTitle: {
    fontSize: 16,
    fontWeight: "800",

    color: "#242424",

    marginBottom: 6,
  },

  photoDescription: {
    fontSize: 12,
    lineHeight: 18,

    color: "#707080",

    textAlign: "center",

    maxWidth: 280,

    marginBottom: 20,
  },

  photoButtons: {
    flexDirection: "row",

    gap: 10,

    width: "100%",
  },

  galleryButton: {
    flex: 1,

    height: 44,

    borderRadius: 10,

    backgroundColor: "#F8F8FA",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7,
  },

  galleryButtonText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,

    color: "#34345C",
  },

  cameraButton: {
    flex: 1,

    height: 44,

    borderRadius: 10,

    backgroundColor: "#34345C",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7,
  },

  cameraButtonText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,

    color: "#FFFFFF",
  },

  // --------------------------------
  // IMAGE PREVIEW
  // --------------------------------

  imageContainer: {
    width: "100%",
    height: 260,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#D9D8E2",
  },

  imagePage: {
    width: 312,
    height: 260,
    position: "relative",
    backgroundColor: "#D9D8E2",
  },

  selectedImage: {
    width: "100%",
    height: "100%",
  },

  imageError: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  imageErrorText: {
    marginTop: 8,
    fontSize: 12,
    color: "#707080",
  },

  // --------------------------------
  // REMOVE IMAGE
  // --------------------------------

  removeImageButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(36, 36, 36, 0.75)",
    alignItems: "center",
    justifyContent: "center",
  },

  // --------------------------------
  // IMAGE NUMBER
  // --------------------------------

  imageNumber: {
    position: "absolute",
    bottom: 12,
    left: 12,
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 9,
    backgroundColor: "rgba(36, 36, 36, 0.75)",
    alignItems: "center",
    justifyContent: "center",
  },

  imageNumberText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  // --------------------------------
  // ADD MORE
  // --------------------------------

  addMoreRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  addMoreButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#34345C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  addMoreText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#34345C",
  },

  addCameraButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E76F51",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  addCameraText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#FFFFFF",
  },

  // --------------------------------
  // SWIPE
  // --------------------------------

  swipeHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginTop: 10,
  },

  swipeHintText: {
    fontSize: 10,
    color: "#707080",
  },

  swipeCountText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#707080",
    marginLeft: 4,
  },

  // --------------------------------
  // INPUTS
  // --------------------------------

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: "#242424",
    marginBottom: 8,
  },

  input: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "#F8F8FA",
    paddingHorizontal: 13,
    fontSize: 12,
    color: "#242424",
  },

  inputWithIcon: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "#F8F8FA",

    paddingHorizontal: 12,

    flexDirection: "row",
    alignItems: "center",

    gap: 9,
  },

  iconInput: {
    flex: 1,
    height: "100%",

    paddingVertical: 0,

    fontSize: 12,
    color: "#242424",
  },

  // --------------------------------
  // TAGS
  // --------------------------------

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginBottom: 10,
  },

  tagChip: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#34345C",

    borderRadius: 10,

    paddingLeft: 10,
    paddingRight: 8,
    paddingVertical: 6,

    gap: 5,
  },

  tagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  helperText: {
    marginTop: 6,

    fontSize: 10,
    color: "#9A9AA3",
  },

  // --------------------------------
  // DESCRIPTION
  // --------------------------------

  descriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  characterCount: {
    fontSize: 10,
    color: "#9A99A5",
    marginBottom: 8,
  },

  descriptionInput: {
    minHeight: 110,

    borderRadius: 10,
    backgroundColor: "#F8F8FA",

    paddingHorizontal: 13,
    paddingTop: 13,
    paddingBottom: 13,

    fontSize: 12,
    lineHeight: 19,

    color: "#242424",
    textAlignVertical: "top",
  },

  // --------------------------------
  // CREATE BUTTON
  // --------------------------------

  continueButton: {
    height: 58,
    borderRadius: 15,
    backgroundColor: "#34345C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,

    shadowColor: "#34345C",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },

  continueButtonText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#FFFFFF",
  },

  // --------------------------------
  // FOOTER
  // --------------------------------

  footerText: {
    textAlign: "center",
    fontSize: 10,
    color: "#9A99A5",
    marginTop: 16,
  },
});

export default styles;
