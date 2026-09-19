import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  ticket: {
    minHeight: 150,
    position: "relative",
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  ticketSelected: {
    borderWidth: 2,
    borderColor: "#34345C",
  },

  ticketDisabled: {
    opacity: 0.5,
  },

  imageSection: {
    width: 118,
    margin: 8,
    position: "relative",
    overflow: "hidden",
    borderRadius: 11,
    backgroundColor: "#F1F0F6",
  },

  ticketImage: {
    width: "100%",
    height: "100%",
  },

  noImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F0F6",
  },

  imageBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 25,
    height: 25,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0442C",
  },

  photoCountBadge: {
    position: "absolute",
    right: 8,
    bottom: 8,
    minWidth: 27,
    height: 23,
    paddingHorizontal: 6,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    backgroundColor: "rgba(36, 36, 36, 0.72)",
  },

  photoCountText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  ticketContent: {
    flex: 1,
    paddingTop: 14,
    paddingRight: 42,
    paddingBottom: 11,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#34345C",
  },

  title: {
    marginTop: 8,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: "800",
    color: "#242424",
  },

  infoRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    flex: 1,
    marginLeft: 5,
    fontSize: 10,
    color: "#666666",
  },

  footer: {
    marginTop: "auto",
    paddingTop: 9,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#ECEBF0",
  },

  ticketNumberLabel: {
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#999999",
  },

  ticketNumber: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: "#34345C",
  },

  barcode: {
    height: 25,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 2,
  },

  bar: {
    width: 2,
    height: "100%",
    backgroundColor: "#34345C",
  },

  barSmall: {
    width: 2,
  },

  barMedium: {
    width: 3,
  },

  barWide: {
    width: 4,
  },

  selectionBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#D9D8E2",
  },

  selectionBadgeSelected: {
    backgroundColor: "#34345C",
    borderColor: "#34345C",
  },

  selectionBadgeDisabled: {
    backgroundColor: "#F1F0F6",
  },

  topNotch: {
    position: "absolute",
    top: -10,
    right: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F1F0F6",
  },

  bottomNotch: {
    position: "absolute",
    bottom: -10,
    right: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F1F0F6",
  },
});

export default styles;
