import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // --------------------------------------------------
  // TICKET
  // --------------------------------------------------

  ticket: {
    width: "100%",
    minHeight: 145,

    flexDirection: "row",

    backgroundColor: "#F7B900",

    borderRadius: 4,

    overflow: "hidden",

    position: "relative",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,

    elevation: 5,
  },

  // --------------------------------------------------
  // IMAGE
  // --------------------------------------------------

  imageSection: {
    width: 125,

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

    left: 9,
    top: 9,

    width: 26,
    height: 26,

    borderRadius: 8,

    backgroundColor: "#34345C",

    alignItems: "center",
    justifyContent: "center",
  },

  // --------------------------------------------------
  // CONTENT
  // --------------------------------------------------

  ticketContent: {
    flex: 1,

    paddingHorizontal: 13,
    paddingVertical: 11,

    justifyContent: "space-between",
  },

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  header: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 5,
  },

  brandText: {
    fontSize: 7,

    fontWeight: "900",

    letterSpacing: 1.5,

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

    marginBottom: 6,
  },

  // --------------------------------------------------
  // INFO
  // --------------------------------------------------

  infoRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 5,

    marginBottom: 4,
  },

  infoText: {
    flex: 1,

    fontSize: 9,

    fontWeight: "800",

    color: "#F0442C",

    textTransform: "uppercase",
  },

  // --------------------------------------------------
  // FOOTER
  // --------------------------------------------------

  footer: {
    flexDirection: "row",

    alignItems: "flex-end",

    justifyContent: "space-between",

    marginTop: 5,

    paddingTop: 7,

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

    width: 70,

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
