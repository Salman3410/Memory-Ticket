import { StyleSheet } from "react-native";

export default StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  sheetHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D9D8E2",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 21,
    fontWeight: "800",
    color: "#34345C",
  },

  closeButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#F1F0F6",
  },

  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    paddingHorizontal: 22,
  },

  yearArrow: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#F1F0F6",
  },

  yearText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#242424",
  },

  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 18,
  },

  monthButton: {
    width: "31.5%",
    minHeight: 48,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F1F0F6",
  },

  monthButtonSelected: {
    backgroundColor: "#34345C",
  },

  monthText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#34345C",
  },

  monthTextSelected: {
    color: "#FFFFFF",
  },

  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    marginTop: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  clearButtonText: {
    marginLeft: 7,
    fontSize: 14,
    fontWeight: "700",
    color: "#34345C",
  },

  actions: {
    flexDirection: "row",
    marginTop: 12,
  },

  cancelButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    borderRadius: 12,
    backgroundColor: "#F1F0F6",
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#34345C",
  },

  doneButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    borderRadius: 12,
    backgroundColor: "#34345C",
  },

  doneButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
