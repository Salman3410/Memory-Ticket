import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 35,
  },

  emptyTicket: {
    width: 125,
    height: 155,
    backgroundColor: "#F1F0F6",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    overflow: "hidden",
    marginBottom: 24,
    transform: [
      {
        rotate: "-4deg",
      },
    ],
  },

  emptyTicketTop: {
    height: 78,
    backgroundColor: "#F2C14E",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTicketLine: {
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: "#C8C7D0",
  },

  emptyTicketBody: {
    padding: 15,
  },

  emptyTicketTextLine: {
    width: "80%",
    height: 7,
    borderRadius: 4,
    backgroundColor: "#D9D8E2",
    marginBottom: 9,
  },

  emptyTicketTextLineShort: {
    width: "50%",
    height: 7,
    borderRadius: 4,
    backgroundColor: "#D9D8E2",
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#242424",
    marginBottom: 8,
  },

  emptyDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: "#707080",
    textAlign: "center",
    maxWidth: 290,
    marginBottom: 22,
  },

  createButton: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 18,
    backgroundColor: "#E76F51",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#E76F51",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 4,
  },

  createButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.1,
    color: "#FFFFFF",
  },
});

export default styles;
