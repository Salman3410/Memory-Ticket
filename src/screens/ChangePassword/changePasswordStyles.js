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

  header: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 25,
  },

  backButton: {
    width: 44,
    height: 44,

    borderRadius: 10,

    backgroundColor: "#F8F8FA",

    alignItems: "center",
    justifyContent: "center",

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
    fontSize: 23,

    fontWeight: "800",

    color: "#242424",
  },

  introCard: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderRadius: 14,

    padding: 14,

    marginBottom: 26,
  },

  introIcon: {
    width: 44,
    height: 44,

    borderRadius: 12,

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

    color: "#9A9AA3",
  },

  sectionTitle: {
    fontSize: 9,

    fontWeight: "900",

    letterSpacing: 1.5,

    color: "#242424",

    marginBottom: 8,

    paddingLeft: 2,
  },

  inputContainer: {
    height: 48,

    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#F8F8FA",

    borderRadius: 10,

    paddingHorizontal: 12,

    marginBottom: 18,

    gap: 9,
  },

  input: {
    flex: 1,

    height: "100%",

    paddingVertical: 0,

    fontSize: 12,

    color: "#242424",
  },

  inputError: {
    backgroundColor: "#F9EEEC",
  },

  requirements: {
    marginTop: -5,

    marginBottom: 20,

    paddingLeft: 2,
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

  matchRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 6,

    marginTop: -7,

    marginBottom: 20,

    paddingLeft: 2,
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

  changeButton: {
    height: 48,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#34345C",

    borderRadius: 10,

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
