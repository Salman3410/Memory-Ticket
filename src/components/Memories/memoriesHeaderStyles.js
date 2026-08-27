import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  headerEyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: "#E76F51",
    marginBottom: 4,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#242424",
    letterSpacing: -0.5,
  },

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#34345C",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#34345C",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 5,
  },
});

export default styles;
