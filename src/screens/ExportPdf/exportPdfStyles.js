import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  header: {
    minHeight: 92,
    paddingTop: 48,
    paddingHorizontal: 18,
    paddingBottom: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "#F1F0F6",
  },

  headerButton: {
    width: 42,
    height: 42,

    borderRadius: 13,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#D9D8E2",

    alignItems: "center",
    justifyContent: "center",
  },

  headerCenter: {
    flex: 1,
    paddingHorizontal: 12,
  },

  eyebrow: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#707080",
  },

  headerTitle: {
    marginTop: 3,
    fontSize: 17,
    fontWeight: "900",
    color: "#242424",
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 22,
    paddingBottom: 35,
  },

  description: {
    marginTop: 4,
    marginBottom: 22,

    fontSize: 11,
    lineHeight: 17,

    color: "#707080",
  },

  sectionLabel: {
    marginBottom: 10,

    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.4,

    color: "#707080",
  },

  optionsRow: {
    flexDirection: "row",

    gap: 12,

    marginBottom: 22,
  },

  optionCard: {
    flex: 1,

    padding: 10,

    borderRadius: 18,

    backgroundColor: "#FFFFFF",

    borderWidth: 1.5,
    borderColor: "#D9D8E2",
  },

  optionCardSelected: {
    borderColor: "#34345C",
    borderWidth: 2,
  },

  previewWrapper: {
    width: "100%",
    aspectRatio: 74 / 105,

    borderRadius: 9,

    overflow: "hidden",

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#F1F0F6",

    marginBottom: 11,
  },

  previewWrapperSelected: {
    backgroundColor: "#ECEBF3",
  },

  miniPage: {
    width: "72%",
    height: "88%",

    borderRadius: 4,

    borderWidth: 1,
    borderColor: "#FFFFFF",

    overflow: "hidden",
  },

  selectedBadge: {
    position: "absolute",

    right: 7,
    top: 7,

    width: 25,
    height: 25,

    borderRadius: 13,

    backgroundColor: "#34345C",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  optionTitle: {
    fontSize: 12,
    fontWeight: "900",

    color: "#242424",
  },

  optionDescription: {
    marginTop: 4,

    fontSize: 9,
    lineHeight: 14,

    color: "#777777",
  },

  paperInfo: {
    minHeight: 52,

    paddingHorizontal: 14,

    borderRadius: 14,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#D9D8E2",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 16,
  },

  paperInfoItem: {
    flexDirection: "row",
    alignItems: "center",

    gap: 6,
  },

  paperInfoText: {
    fontSize: 9,

    fontWeight: "900",
    letterSpacing: 0.6,

    color: "#34345C",
  },

  paperInfoDivider: {
    width: 1,
    height: 20,

    backgroundColor: "#D9D8E2",
  },

  exportButton: {
    height: 54,

    borderRadius: 15,

    backgroundColor: "#34345C",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    marginTop: 4,
  },

  exportButtonDisabled: {
    opacity: 0.55,
  },

  exportButtonText: {
    fontSize: 11,

    fontWeight: "900",
    letterSpacing: 1.1,

    color: "#FFFFFF",
  },

  cancelButton: {
    height: 48,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 3,
  },

  cancelButtonText: {
    fontSize: 10,

    fontWeight: "900",
    letterSpacing: 1.2,

    color: "#707080",
  },

  footerHint: {
    marginTop: 1,

    paddingHorizontal: 12,

    fontSize: 9,
    lineHeight: 14,

    textAlign: "center",

    color: "#90909D",
  },

  notFound: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#F1F0F6",

    paddingHorizontal: 30,
  },

  notFoundTitle: {
    marginTop: 12,

    fontSize: 20,

    fontWeight: "900",

    color: "#242424",
  },

  backButtonLarge: {
    height: 48,

    marginTop: 18,

    paddingHorizontal: 22,

    borderRadius: 14,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#D9D8E2",

    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    fontSize: 10,

    fontWeight: "900",
    letterSpacing: 1.1,

    color: "#34345C",
  },
});

export default styles;
