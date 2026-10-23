
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  // Used by TactileButton's label.
  saveButtonText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: "#FFFFFF",
  },

 cancelButton: {
  height: 48,
  borderRadius: 14,
  borderWidth: 1,
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
