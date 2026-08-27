import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#242424",
  },

  stepText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#707080",
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: "#242424",
    marginBottom: 8,
  },

  input: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#242424",
  },

  inputWithIcon: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  iconInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#242424",
  },

  descriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  characterCount: {
    fontSize: 10,
    color: "#9A99A5",
    marginBottom: 8,
  },

  descriptionInput: {
    minHeight: 120,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    lineHeight: 21,
    color: "#242424",
  },
});

export default styles;
