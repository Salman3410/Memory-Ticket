import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(20, 20, 20, 0.45)",
  },

  sheet: {
    maxHeight: "88%",
    backgroundColor: "#F1F0F6",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: "hidden",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  eyebrow: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.6,
    color: "#707080",
  },

  title: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "900",
    color: "#242424",
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },

  sectionLabel: {
    marginTop: 8,
    marginBottom: 10,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#707080",
  },

  styleGrid: {
    gap: 9,
  },

  styleCard: {
    position: "relative",
    minHeight: 82,
    padding: 10,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
    flexDirection: "row",
    alignItems: "center",
  },

  styleCardActive: {
    borderColor: "#34345C",
    borderWidth: 2,
  },

  stylePreview: {
    width: 54,
    height: 62,
    borderRadius: 6,
    overflow: "hidden",
    padding: 6,
    justifyContent: "center",
    gap: 5,
    marginRight: 12,
  },

  classicPreview: {
    backgroundColor: "#F7B900",
  },

  minimalPreview: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  vintagePreview: {
    backgroundColor: "#F3E7CF",
    borderWidth: 1,
    borderColor: "#C5A978",
  },

  previewLine: {
    width: "70%",
    height: 3,
    backgroundColor: "#E76F51",
  },

  previewLineMinimal: {
    backgroundColor: "#34345C",
  },

  previewBlock: {
    width: "100%",
    height: 20,
    backgroundColor: "rgba(255,255,255,0.55)",
  },

  previewBlockSmall: {
    width: "55%",
    height: 4,
    backgroundColor: "rgba(52,52,92,0.45)",
  },

  styleCardText: {
    flex: 1,
    paddingRight: 20,
  },

  styleCardTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#242424",
  },

  styleCardDescription: {
    marginTop: 4,
    fontSize: 9,
    lineHeight: 14,
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

  accentSectionLabel: {
    marginTop: 20,
  },

  accentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },

  accentItem: {
    alignItems: "center",
  },

  accentCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  accentCircleActive: {
    borderWidth: 3,
    borderColor: "#FFFFFF",
    elevation: 3,
  },

  accentLabel: {
    marginTop: 6,
    fontSize: 9,
    fontWeight: "800",
    color: "#5F5F69",
  },

  contentSectionLabel: {
    marginTop: 22,
  },

  optionRow: {
    minHeight: 58,
    paddingHorizontal: 15,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionTextContainer: {
    flex: 1,
  },

  optionLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#242424",
  },

  optionState: {
    marginTop: 3,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#8A8993",
  },

  doneButton: {
    height: 50,
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: "#34345C",
    alignItems: "center",
    justifyContent: "center",
  },

  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
});

export default styles;
