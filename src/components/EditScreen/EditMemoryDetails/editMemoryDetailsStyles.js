import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // --------------------------------
  // SECTION
  // --------------------------------

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

    color: "#7E7E88",
  },

  // --------------------------------
  // INPUT GROUP
  // --------------------------------

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    marginBottom: 8,

    fontSize: 10,

    fontWeight: "900",

    letterSpacing: 1.4,

    color: "#242424",
  },

  // --------------------------------
  // TITLE + LOCATION
  // --------------------------------

  inputWithIcon: {
    height: 48,

    paddingHorizontal: 12,

    borderRadius: 10,

    backgroundColor: "#F8F8FA",

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
  // DESCRIPTION
  // --------------------------------

  descriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  characterCount: {
    fontSize: 10,

    color: "#9A9AA3",

    marginBottom: 8,
  },

  descriptionInput: {
    minHeight: 110,

    paddingHorizontal: 13,

    paddingTop: 13,
    paddingBottom: 13,

    borderRadius: 10,

    backgroundColor: "#F8F8FA",

    fontSize: 12,

    lineHeight: 19,

    color: "#242424",

    textAlignVertical: "top",
  },
});

export default styles;
