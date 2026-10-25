import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(12, 12, 22, 0.58)",
  },

  sheet: {
    width: "100%",
    maxHeight: "88%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: "#D9D8E2",
    overflow: "hidden",
  },

  // Header
  header: {
    minHeight: 82,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D9D8E2",
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: "#E76F51",
  },

  title: {
    marginTop: 5,
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: -0.4,
    color: "#242424",
  },

  closeButton: {
    width: 40,
    height: 40,
    marginLeft: 12,
    borderRadius: 20,
    backgroundColor: "#F1F0F6",
    borderWidth: 1,
    borderColor: "#D9D8E2",
    alignItems: "center",
    justifyContent: "center",
  },

  // Scroll content
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },

  sectionLabel: {
    marginTop: 8,
    marginBottom: 12,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#707080",
  },

  // Ticket style options
  styleGrid: {
    gap: 10,
  },

  styleCard: {
    position: "relative",
    minHeight: 88,
    padding: 11,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
    flexDirection: "row",
    alignItems: "center",
  },

  // Border color is supplied by the active theme in the component.
  styleCardActive: {
    borderWidth: 2,
  },

  stylePreview: {
    width: 56,
    height: 64,
    marginRight: 13,
    padding: 7,
    borderRadius: 7,
    overflow: "hidden",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#F1F0F6",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  classicPreview: {
    backgroundColor: "#F7B900",
    borderColor: "#E6A900",
  },

  minimalPreview: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D9D8E2",
  },

  vintagePreview: {
    backgroundColor: "#F3E7CF",
    borderColor: "#C5A978",
  },

  previewLine: {
    width: "70%",
    height: 3,
    borderRadius: 2,
    backgroundColor: "#E76F51",
  },

  previewLineMinimal: {
    backgroundColor: "#34345C",
  },

  previewBlock: {
    width: "100%",
    height: 19,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.58)",
  },

  previewBlockSmall: {
    width: "55%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(52,52,92,0.45)",
  },

  styleCardText: {
    flex: 1,
    paddingRight: 22,
  },

  styleCardTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#242424",
  },

  styleCardDescription: {
    marginTop: 5,
    fontSize: 10,
    lineHeight: 15,
    color: "#777780",
  },

  selectedBadge: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#34345C",
    alignItems: "center",
    justifyContent: "center",
  },

  // Accent color picker
  accentSectionLabel: {
    marginTop: 22,
  },

  accentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 3,
    gap: 8,
  },

  accentItem: {
    flex: 1,
    alignItems: "center",
  },

  accentCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },

  accentCircleActive: {
    borderWidth: 3,
    borderColor: "#FFFFFF",
    elevation: 3,
  },

  accentLabel: {
    marginTop: 7,
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
    color: "#5F5F69",
  },

  // Ticket content visibility
  contentSectionLabel: {
    marginTop: 24,
  },

  optionRow: {
    minHeight: 58,
    marginBottom: 9,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionTextContainer: {
    flex: 1,
    paddingRight: 12,
  },

  optionLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#242424",
  },

  optionState: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#8A8993",
  },

doneButtonContainer: {
  width: "100%",
  marginTop: 18,
  marginBottom: 4,
  alignItems: "stretch",
},

doneButton: {
  width: "100%",
},

  doneButtonDisabled: {
    opacity: 0.6,
  },

  doneButtonText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
    textAlign: "center",
    color: "#FFFFFF",
  },
});

export default styles;