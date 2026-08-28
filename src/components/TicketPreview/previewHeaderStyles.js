import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D9D8E2",
    marginRight: 13,
  },

  headerTextContainer: {
    flex: 1,
  },

  headerEyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.7,
    color: "#E76F51",
    marginBottom: 3,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#242424",
  },

  headerSpacer: {
    width: 44,
  },
});

export default styles;
