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

  // HEADER

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

    borderWidth: 1,
    borderColor: "#D9D8E2",
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
    fontSize: 24,
    fontWeight: "900",
    color: "#242424",
  },

  headerSpacer: {
    width: 44,
  },

  // PHOTO

  photoSection: {
    alignItems: "center",
    marginBottom: 34,
  },

  avatarContainer: {
    position: "relative",
    marginBottom: 14,
  },

  avatar: {
    width: 105,
    height: 105,
    borderRadius: 34,

    backgroundColor: "#F2C14E",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 4,
    borderColor: "#FFFFFF",
  },

  avatarImage: {
    width: 105,
    height: 105,
    borderRadius: 34,

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
    borderRadius: 12,

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

  // FORM

  formContainer: {
    marginBottom: 26,
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: "#242424",
    marginBottom: 8,
  },

  inputWrapper: {
    height: 54,
    borderRadius: 14,

    borderWidth: 1,
    borderColor: "#D9D8E2",

    backgroundColor: "#FFFFFF",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 15,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: "100%",

    fontSize: 14,
    color: "#242424",
  },

  disabledInput: {
    backgroundColor: "#E8E7ED",
    borderColor: "#D9D8E2",
  },

  disabledText: {
    color: "#8E8D97",
  },

  helperText: {
    fontSize: 10,
    color: "#9A99A5",
    marginTop: 7,
    marginLeft: 3,
  },

  // SAVE

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

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: "#FFFFFF",
  },

  footerText: {
    textAlign: "center",
    fontSize: 10,
    color: "#9A99A5",
    marginTop: 16,
  },
});

export default styles;
