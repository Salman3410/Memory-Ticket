import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  memoriesList: {
    gap: 16,
  },

  memoryTicketWrapper: {
    width: "100%",
    marginBottom: 22,
    position: "relative",
  },

  ticketFavoriteButton: {
    position: "absolute",
    top: 18,
    right: 18,
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F1F0F6",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});

export default styles;
