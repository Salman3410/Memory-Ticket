import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // --------------------------------
  // BOTTOM SHEET
  // --------------------------------

  background: {
    backgroundColor: "#F1F0F6",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  handleIndicator: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#C5C4CE",
  },

  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  // --------------------------------
  // HEADER
  // --------------------------------

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 16,
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#7E7E88",

    marginBottom: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#242424",
  },

  closeButton: {
    width: 38,
    height: 38,

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#E7E6ED",
  },

  // --------------------------------
  // SCROLL
  // --------------------------------

  scrollContainer: {
    flex: 1,
    minHeight: 0,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  // --------------------------------
  // SECTION
  // --------------------------------

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.3,
    color: "#242424",

    marginBottom: 9,
  },

  // --------------------------------
  // CHIPS
  // --------------------------------

  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },

  optionChip: {
    minHeight: 40,

    paddingHorizontal: 13,

    borderRadius: 10,

    backgroundColor: "#F8F8FA",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 5,
  },

  optionChipActive: {
    backgroundColor: "#34345C",
  },

  optionChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#34345C",
  },

  optionChipTextActive: {
    color: "#FFFFFF",
  },

  optionCount: {
    fontSize: 10,
    color: "#9A9AA3",
  },

  optionCountActive: {
    color: "#D9D8E2",
  },

  // --------------------------------
  // ROW OPTIONS
  // --------------------------------

  rowOption: {
    minHeight: 48,

    paddingHorizontal: 12,

    borderRadius: 10,

    backgroundColor: "#F8F8FA",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 7,
  },

  rowOptionActive: {
    backgroundColor: "#ECEBF2",
  },

  rowOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  rowOptionText: {
    marginLeft: 9,

    fontSize: 12,
    fontWeight: "700",

    color: "#34345C",
  },

  // --------------------------------
  // COLLECTION
  // --------------------------------

  collectionList: {
    width: "100%",
  },

  emptyText: {
    fontSize: 12,
    color: "#9A9AA3",
    lineHeight: 18,
  },

  // --------------------------------
  // ACTIONS
  // --------------------------------

  actions: {
    flexDirection: "row",

    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,

    borderTopWidth: 1,
    borderTopColor: "#E1E0E8",

    gap: 10,
  },

  clearButton: {
    height: 48,

    paddingHorizontal: 18,

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#F8F8FA",
  },

  clearButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,

    color: "#34345C",
  },

  applyButton: {
    flex: 1,

    height: 48,

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#34345C",
  },

  applyButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,

    color: "#FFFFFF",
  },
});

export default styles;
