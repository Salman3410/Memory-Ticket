import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  searchContainer: {
    height: 48,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,

    borderRadius: 10,

    backgroundColor: "#F8F8FA",

    marginBottom: 18,

    gap: 9,
  },

  searchInput: {
    flex: 1,

    height: "100%",

    paddingVertical: 0,

    fontSize: 12,

    color: "#242424",
  },

  clearSearchButton: {
    width: 28,
    height: 28,

    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
