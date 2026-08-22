import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // --------------------------------------------------
  // TICKET
  // --------------------------------------------------

  ticket: {
    width: "100%",
    height: 175,

    flexDirection: "row",

    backgroundColor: "#F7B900",

    borderRadius: 5,
    overflow: "hidden",
    position: "relative",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },

  // --------------------------------------------------
  // IMAGE
  // --------------------------------------------------

  imageSection: {
    width: 125,
    height: "100%",

    position: "relative",
    overflow: "hidden",

    backgroundColor: "#EAAE00",
  },

  ticketImage: {
    width: "100%",
    height: "100%",
  },

  noImage: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#EAAE00",
  },

  imageBadge: {
    position: "absolute",

    left: 8,
    top: 8,

    width: 25,
    height: 25,

    borderRadius: 7,

    backgroundColor: "#34345C",

    alignItems: "center",
    justifyContent: "center",
  },

  photoCountBadge: {
    position: "absolute",

    right: 7,
    bottom: 7,

    height: 22,
    minWidth: 27,

    paddingHorizontal: 6,

    borderRadius: 6,

    backgroundColor: "#34345C",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 3,
  },

  photoCountText: {
    fontSize: 8,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  // --------------------------------------------------
  // CONTENT
  // --------------------------------------------------

  ticketContent: {
    flex: 1,

    height: "100%",

    paddingHorizontal: 13,
    paddingVertical: 10,

    justifyContent: "space-between",
  },

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  header: {
    height: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandText: {
    fontSize: 7,

    fontWeight: "900",

    letterSpacing: 1.4,

    color: "#F0442C",
  },

  // --------------------------------------------------
  // TITLE
  // --------------------------------------------------

  title: {
    fontSize: 17,

    lineHeight: 18,

    fontWeight: "900",

    textTransform: "uppercase",

    color: "#F0442C",

    letterSpacing: -0.3,

    marginTop: 2,
    marginBottom: 3,
  },

  // --------------------------------------------------
  // INFO
  // --------------------------------------------------

  infoRow: {
    height: 16,

    flexDirection: "row",
    alignItems: "center",

    gap: 5,

    marginBottom: 1,
  },

  infoText: {
    flex: 1,

    fontSize: 9,

    lineHeight: 11,

    fontWeight: "800",

    color: "#F0442C",

    textTransform: "uppercase",
  },

  // --------------------------------------------------
  // FOOTER
  // --------------------------------------------------

  footer: {
    minHeight: 35,

    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",

    marginTop: 4,
    paddingTop: 6,

    borderTopWidth: 1,
    borderStyle: "dotted",
    borderColor: "#F0442C",
  },

  ticketNumberLabel: {
    fontSize: 5,

    fontWeight: "900",

    letterSpacing: 0.7,

    color: "#F0442C",

    marginBottom: 2,
  },

  ticketNumber: {
    fontSize: 8,

    fontWeight: "900",

    letterSpacing: 0.8,

    color: "#F0442C",
  },

  // --------------------------------------------------
  // BARCODE
  // --------------------------------------------------

  barcode: {
    height: 24,
    width: 65,

    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "flex-end",

    gap: 1,

    overflow: "hidden",
  },

  bar: {
    height: "100%",
    backgroundColor: "#F0442C",
  },

  barSmall: {
    width: 1,
  },

  barMedium: {
    width: 2,
  },

  barWide: {
    width: 3,
  },

  // --------------------------------------------------
  // PERFORATION NOTCHES
  // --------------------------------------------------

  topNotch: {
    position: "absolute",

    left: 117,
    top: -8,

    width: 16,
    height: 16,

    borderRadius: 8,

    backgroundColor: "#F1F0F6",
  },

  bottomNotch: {
    position: "absolute",

    left: 117,
    bottom: -8,

    width: 16,
    height: 16,

    borderRadius: 8,

    backgroundColor: "#F1F0F6",
  },
});

export default styles;
