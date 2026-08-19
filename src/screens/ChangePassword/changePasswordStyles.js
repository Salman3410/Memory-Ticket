import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 100,
  },

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  header: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 25,
  },

  backButton: {
    width: 44,
    height: 44,

    borderRadius: 14,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#D9D8E2",

    marginRight: 13,
  },

  headerText: {
    flex: 1,
  },

  headerEyebrow: {
    fontSize: 9,
    fontWeight: "900",

    letterSpacing: 1.6,

    color: "#E76F51",

    marginBottom: 3,
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: "900",

    color: "#242424",
  },

  // --------------------------------------------------
  // INTRO CARD
  // --------------------------------------------------

  introCard: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#D9D8E2",

    borderRadius: 18,

    padding: 15,

    marginBottom: 28,
  },

  introIcon: {
    width: 44,
    height: 44,

    borderRadius: 13,

    backgroundColor: "#F1F0F6",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  introContent: {
    flex: 1,
  },

  introTitle: {
    fontSize: 13,
    fontWeight: "800",

    color: "#242424",

    marginBottom: 4,
  },

  introText: {
    fontSize: 10,
    lineHeight: 15,

    color: "#9A99A5",
  },

  // --------------------------------------------------
  // SECTION
  // --------------------------------------------------

  sectionTitle: {
    fontSize: 9,
    fontWeight: "900",

    letterSpacing: 1.5,

    color: "#707080",

    marginBottom: 9,

    paddingLeft: 3,
  },

  // --------------------------------------------------
  // INPUT
  // --------------------------------------------------

  inputContainer: {
    minHeight: 54,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#D9D8E2",

    borderRadius: 14,

    paddingHorizontal: 15,

    marginBottom: 20,
  },

  input: {
    flex: 1,

    fontSize: 12,
    fontWeight: "600",

    color: "#242424",

    marginHorizontal: 11,

    paddingVertical: 0,
  },

  inputError: {
    borderColor: "#E6A29A",
  },

  // --------------------------------------------------
  // PASSWORD REQUIREMENTS
  // --------------------------------------------------

  requirements: {
    marginTop: -7,

    marginBottom: 22,

    paddingLeft: 3,
  },

  requirementRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 7,
  },

  requirementText: {
    fontSize: 10,

    color: "#AAA9B3",
  },

  requirementTextActive: {
    color: "#34345C",

    fontWeight: "700",
  },

  // --------------------------------------------------
  // PASSWORD MATCH
  // --------------------------------------------------

  matchRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 6,

    marginTop: -10,

    marginBottom: 22,

    paddingLeft: 3,
  },

  matchText: {
    fontSize: 10,
    fontWeight: "700",
  },

  matchTextSuccess: {
    color: "#E76F51",
  },

  matchTextError: {
    color: "#D9534F",
  },

  // --------------------------------------------------
  // BUTTON
  // --------------------------------------------------

  changeButton: {
    minHeight: 54,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#34345C",

    borderRadius: 14,

    marginTop: 5,

    gap: 8,
  },

  changeButtonDisabled: {
    opacity: 0.6,
  },

  changeButtonText: {
    fontSize: 10,
    fontWeight: "900",

    letterSpacing: 0.9,

    color: "#FFFFFF",
  },

  // --------------------------------------------------
  // FOOTER
  // --------------------------------------------------

  footerText: {
    textAlign: "center",

    fontSize: 8,
    fontWeight: "800",

    letterSpacing: 1,

    color: "#AAA9B3",

    marginTop: 28,
  },
});

export default styles;
