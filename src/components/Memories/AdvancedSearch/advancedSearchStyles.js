import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#F1F0F6",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  handleIndicator: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#C5C4CE",
  },

  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  scrollContainer: {
    flex: 1,
    minHeight: 0,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 16,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
    color: "#707080",
    marginBottom: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#34345C",
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E7E6ED",
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: "#707080",
    marginBottom: 10,
  },

  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  optionChip: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    backgroundColor: "#F8F7FA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  optionChipActive: {
    backgroundColor: "#34345C",
    borderColor: "#34345C",
  },

  optionChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#34345C",
  },

  optionChipTextActive: {
    color: "#FFFFFF",
  },

  optionCount: {
    fontSize: 11,
    color: "#9999A8",
  },

  optionCountActive: {
    color: "#D9D8E2",
  },

  rowOption: {
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    backgroundColor: "#F8F7FA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  rowOptionActive: {
    borderColor: "#34345C",
    backgroundColor: "#ECEBF2",
  },

  rowOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  rowOptionText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#34345C",
  },

  collectionList: {
    width: "100%",
  },

  emptyText: {
    fontSize: 13,
    color: "#9999A8",
    lineHeight: 19,
  },

  actions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#D9D8E2",
    gap: 10,
  },

  clearButton: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F7FA",
  },

  clearButtonText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#34345C",
  },

  applyButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  applyButtonText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#FFFFFF",
  },
});

export default styles;
