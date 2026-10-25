import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    minHeight: 92,
    paddingTop: 48,
    paddingHorizontal: 18,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
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
  },

  headerTitle: {
    marginTop: 3,
    fontSize: 17,
    fontWeight: "900",
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
  },

  sectionLabel: {
    marginBottom: 10,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.4,
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
    borderWidth: 1.5,
  },

  optionCardSelected: {
    borderWidth: 2,
  },

  previewWrapper: {
    width: "100%",
    aspectRatio: 74 / 105,
    borderRadius: 9,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
    borderWidth: 1,
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
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },

  optionTitle: {
    fontSize: 12,
    fontWeight: "900",
  },

  optionDescription: {
    marginTop: 4,
    fontSize: 9,
    lineHeight: 14,
  },

  paperInfo: {
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
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
  },

  paperInfoDivider: {
    width: 1,
    height: 20,
  },

  exportButtonText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  cancelButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 7,
    borderRadius: 12,
    borderWidth: 1,
  },

  cancelButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  footerHint: {
    marginTop: 12,
    paddingHorizontal: 12,
    fontSize: 9,
    lineHeight: 14,
    textAlign: "center",
  },

  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  notFoundTitle: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "900",
  },

  backButtonLarge: {
    minHeight: 48,
    marginTop: 18,
    paddingHorizontal: 22,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.1,
  },
});

export default styles;