import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    height: 48,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 18,

    paddingHorizontal: 12,

    borderRadius: 10,

    backgroundColor: "#F8F8FA",

    gap: 9,
  },

  input: {
    flex: 1,

    height: "100%",

    paddingVertical: 0,

    fontSize: 12,

    fontWeight: "400",

    color: "#242424",
  },

  clearButton: {
    width: 28,
    height: 28,

    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
