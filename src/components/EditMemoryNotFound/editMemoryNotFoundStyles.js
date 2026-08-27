import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  notFoundContainer: {
    flex: 1,
    backgroundColor: "#F1F0F6",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  notFoundTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#242424",
    marginTop: 15,
    marginBottom: 18,
  },

  backButtonLarge: {
    height: 48,
    paddingHorizontal: 22,
    borderRadius: 13,
    backgroundColor: "#34345C",
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#FFFFFF",
  },
});

export default styles;
