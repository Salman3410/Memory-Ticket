import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 16,
  },

  filterButton: {
    height: 38,
    paddingHorizontal: 11,
    borderRadius: 10,
    backgroundColor: "#F8F8FA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  filterButtonActive: {
    height: 38,
    paddingHorizontal: 11,
    borderRadius: 10,
    backgroundColor: "#34345C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  filterText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
    color: "#7E7E88",
  },

  filterTextActive: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
    color: "#FFFFFF",
  },

  sortButton: {
    height: 38,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#F8F8FA",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  sortText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
    color: "#7E7E88",
  },

  sortMenu: {
    backgroundColor: "#F8F8FA",
    borderRadius: 10,
    padding: 7,
    marginTop: -5,
    marginBottom: 16,
  },

  sortMenuTitle: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#9A9AA3",
    paddingHorizontal: 9,
    paddingTop: 6,
    paddingBottom: 5,
  },

  sortOption: {
    minHeight: 43,
    paddingHorizontal: 9,
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  sortOptionText: {
    flex: 1,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: "#242424",
  },
});

export default styles;
