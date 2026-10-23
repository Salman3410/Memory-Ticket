
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    gap: 10,
  },

  saveButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#34345C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,

    // Keep the shadow subtle so the tactile base stands out.
    shadowColor: "#34345C",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },

  saveButtonText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: "#FFFFFF",
  },

  editButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#34345C",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  editButtonText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#34345C",
  },
});

export default styles;
