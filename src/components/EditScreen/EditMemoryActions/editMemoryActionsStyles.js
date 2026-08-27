import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  saveButton: {
    height: 58,
    borderRadius: 15,
    backgroundColor: "#34345C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,

    shadowColor: "#34345C",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },

  saveButtonText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: "#FFFFFF",
  },

  cancelButton: {
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  cancelButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#707080",
  },

  footerText: {
    textAlign: "center",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#9A99A5",
    marginTop: 12,
  },
});

export default styles;
