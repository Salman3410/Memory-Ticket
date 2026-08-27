import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  headerTitleContainer: {
    flex: 1,
  },

  headerEyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: "#E76F51",
    marginBottom: 3,
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#242424",
  },

  headerSpacer: {
    width: 44,
  },
});

export default styles;
