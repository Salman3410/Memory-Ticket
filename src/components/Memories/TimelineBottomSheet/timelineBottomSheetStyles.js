import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // --------------------------------
  // SHEET
  // --------------------------------

  sheetBackground: {
    backgroundColor: "#F1F0F6",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#C5C4CE",
  },

  container: {
    flex: 1,

    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 16,
  },

  // --------------------------------
  // HEADER
  // --------------------------------

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 21,
    fontWeight: "800",
    color: "#242424",
  },

  closeButton: {
    width: 38,
    height: 38,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 10,

    backgroundColor: "#E7E6ED",
  },

  // --------------------------------
  // YEAR
  // --------------------------------

  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 18,

    paddingHorizontal: 12,
  },

  yearArrow: {
    width: 40,
    height: 40,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 10,

    backgroundColor: "#F8F8FA",
  },

  yearText: {
    fontSize: 20,
    fontWeight: "800",

    color: "#242424",
  },

  // --------------------------------
  // MONTH GRID
  // --------------------------------

  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",

    marginTop: 18,
  },

  monthButton: {
    width: "31.5%",
    minHeight: 44,

    marginBottom: 8,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 10,

    backgroundColor: "#F8F8FA",
  },

  monthButtonSelected: {
    backgroundColor: "#34345C",
  },

  monthText: {
    fontSize: 11,
    fontWeight: "700",

    color: "#34345C",
  },

  monthTextSelected: {
    color: "#FFFFFF",
  },

  // --------------------------------
  // CLEAR
  // --------------------------------

  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    minHeight: 44,

    marginTop: 2,

    borderRadius: 10,

    backgroundColor: "#F8F8FA",
  },

  clearButtonText: {
    marginLeft: 7,

    fontSize: 11,
    fontWeight: "800",

    color: "#34345C",
  },

  // --------------------------------
  // ACTIONS
  // --------------------------------

  actions: {
    flexDirection: "row",

    marginTop: 12,

    gap: 8,
  },

  cancelButton: {
    flex: 1,

    minHeight: 48,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 10,

    backgroundColor: "#F8F8FA",
  },

  cancelButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,

    color: "#34345C",
  },

  doneButton: {
    flex: 1,

    minHeight: 48,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 10,

    backgroundColor: "#34345C",
  },

  doneButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,

    color: "#FFFFFF",
  },
  yearArrowDisabled: {
    backgroundColor: "#EEEEF2",
  },
});
