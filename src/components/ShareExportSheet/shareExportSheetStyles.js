import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // ==========================================================
  // SHEET
  // ==========================================================

  sheet: {
    backgroundColor: "#132329",

    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },

  content: {
    flex: 1,

    paddingTop: 8,
    paddingHorizontal: 22,
    paddingBottom: 24,
  },

  // ==========================================================
  // HANDLE
  // ==========================================================

  handle: {
    width: 42,
    height: 4,

    borderRadius: 10,

    backgroundColor: "#65747A",
  },

  // ==========================================================
  // TITLE
  // ==========================================================

  title: {
    marginTop: 4,

    color: "#FFFFFF",

    fontSize: 13,

    fontWeight: "800",

    textAlign: "center",
  },

  // ==========================================================
  // ACTION ROW
  // ==========================================================

  optionsRow: {
    flexDirection: "row",

    alignItems: "flex-start",

    justifyContent: "center",

    marginTop: 16,

    gap: 24,
  },

  option: {
    width: 82,

    alignItems: "center",

    justifyContent: "flex-start",
  },

  // ==========================================================
  // ACTION CIRCLE
  // ==========================================================

  actionCircle: {
    width: 76,
    height: 76,

    borderRadius: 38,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#E8EEF3",
  },

  // ==========================================================
  // TEXT
  // ==========================================================

  optionText: {
    marginTop: 9,

    color: "#E8EEF3",

    fontSize: 14,

    textAlign: "center",

    fontWeight: "500",
  },
});

export default styles;
