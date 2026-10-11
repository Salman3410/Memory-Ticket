import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // --------------------------------
  // CONTAINER
  // --------------------------------

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

    borderRadius: 10,

    backgroundColor: "#F8F8FA",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 14,
  },

  headerTextContainer: {
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
  // PHOTO
  // --------------------------------

  photoSection: {
    alignItems: "center",

    marginBottom: 32,
  },

  avatarContainer: {
    position: "relative",

    marginBottom: 14,
  },

  avatar: {
    width: 105,
    height: 105,

    borderRadius: 28,

    backgroundColor: "#F2C14E",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 4,
    borderColor: "#FFFFFF",
  },

  avatarImage: {
    width: 105,
    height: 105,

    borderRadius: 28,

    borderWidth: 4,
    borderColor: "#FFFFFF",
  },

  avatarText: {
    fontSize: 38,

    fontWeight: "900",

    color: "#34345C",
  },

  cameraButton: {
    position: "absolute",

    right: -4,
    bottom: -4,

    width: 36,
    height: 36,

    borderRadius: 10,

    backgroundColor: "#E76F51",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 3,
    borderColor: "#F1F0F6",
  },

  photoTitle: {
    fontSize: 15,

    fontWeight: "800",

    color: "#242424",

    marginBottom: 5,
  },

  changePhotoText: {
    fontSize: 9,

    fontWeight: "900",

    letterSpacing: 1.2,

    color: "#34345C",
  },

  // --------------------------------
  // FORM
  // --------------------------------

  formContainer: {
    marginBottom: 24,
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

  // --------------------------------
  // INPUT
  // --------------------------------

  inputWrapper: {
    height: 48,

    borderRadius: 10,

    backgroundColor: "#F8F8FA",

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 12,

    gap: 9,
  },

  input: {
    flex: 1,

    height: "100%",

    paddingVertical: 0,

    fontSize: 12,

    color: "#242424",
  },

  // --------------------------------
  // DISABLED EMAIL
  // --------------------------------

  disabledInput: {
    backgroundColor: "#E9E8EE",
  },

  disabledText: {
    color: "#8E8D97",
  },

  helperText: {
    fontSize: 10,

    color: "#9A9AA3",

    marginTop: 7,

    marginLeft: 3,
  },

  // --------------------------------
  // SAVE
  // --------------------------------

  saveButton: {
    height: 48,

    borderRadius: 10,

    backgroundColor: "#34345C",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 9,
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    fontSize: 10,

    fontWeight: "900",

    letterSpacing: 1.2,

    color: "#FFFFFF",
  },

  // --------------------------------
  // FOOTER
  // --------------------------------

  footerText: {
    textAlign: "center",

    fontSize: 10,

    color: "#9A9AA3",

    marginTop: 16,
  },
});

export default styles;
