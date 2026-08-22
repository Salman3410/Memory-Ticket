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

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  headerButton: {
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

  stepText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#707080",
  },

  imageContainer: {
    width: "100%",
    height: 260,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#D9D8E2",
    position: "relative",
  },

  selectedImage: {
    width: "100%",
    height: "100%",
  },

  changeImageButton: {
    position: "absolute",
    right: 12,
    bottom: 12,

    height: 40,
    paddingHorizontal: 13,

    borderRadius: 11,
    backgroundColor: "#34345C",

    flexDirection: "row",
    alignItems: "center",

    gap: 6,
  },

  changeImageText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#FFFFFF",
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: "#242424",
    marginBottom: 8,
  },

  input: {
    height: 54,
    borderRadius: 14,

    borderWidth: 1,
    borderColor: "#D9D8E2",

    backgroundColor: "#FFFFFF",

    paddingHorizontal: 16,

    fontSize: 14,
    color: "#242424",
  },

  inputWithIcon: {
    height: 54,
    borderRadius: 14,

    borderWidth: 1,
    borderColor: "#D9D8E2",

    backgroundColor: "#FFFFFF",

    paddingHorizontal: 15,

    flexDirection: "row",
    alignItems: "center",

    gap: 9,
  },

  iconInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#242424",
  },

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
    minHeight: 120,
    borderRadius: 14,

    borderWidth: 1,
    borderColor: "#D9D8E2",

    backgroundColor: "#FFFFFF",

    paddingHorizontal: 16,
    paddingVertical: 14,

    fontSize: 14,
    lineHeight: 21,
    color: "#242424",
  },

  saveButton: {
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

  saveButtonText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: "#FFFFFF",
  },

  cancelButton: {
    height: 48,
    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 10,
  },

  cancelButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#707080",
  },

  footerText: {
    textAlign: "center",

    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,

    color: "#9A99A5",

    marginTop: 12,
  },

  notFoundContainer: {
    flex: 1,

    backgroundColor: "#F1F0F6",

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 30,
  },

  notFoundTitle: {
    fontSize: 20,
    fontWeight: "900",

    color: "#242424",

    marginTop: 15,
    marginBottom: 18,
  },

  backButtonLarge: {
    height: 48,

    paddingHorizontal: 22,

    borderRadius: 13,

    backgroundColor: "#34345C",

    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,

    color: "#FFFFFF",
  },
  photoCountText: {
    marginTop: 4,
    fontSize: 12,
    color: "#707080",
  },

  imageContainer: {
    width: 300,
    height: 220,
    marginRight: 12,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
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
