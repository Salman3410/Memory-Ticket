import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  ticket: {
    width: "100%",

    borderRadius: 4,

    overflow: "hidden",

    backgroundColor: "#F7B900",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 14,

    elevation: 7,
  },

  ticketCompact: {
    transform: [{ scale: 0.96 }],
  },

  // --------------------------------------------------
  // PERFORATION
  // --------------------------------------------------

  topPerforation: {
    height: 12,

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",

    backgroundColor: "#F7B900",
  },

  bottomPerforation: {
    height: 12,

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",

    backgroundColor: "#F7B900",
  },

  perforationDot: {
    width: 17,
    height: 17,

    borderRadius: 17 / 2,

    backgroundColor: "#F1F0F6",

    marginTop: -8,
  },

  // --------------------------------------------------
  // BODY
  // --------------------------------------------------

  ticketBody: {
    backgroundColor: "#F7B900",

    paddingHorizontal: 17,
    paddingBottom: 14,
  },

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  header: {
    height: 34,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandText: {
    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 2,

    color: "#F0442C",
  },

  // --------------------------------------------------
  // IMAGE
  // --------------------------------------------------

  ticketImage: {
    width: "100%",
    height: "100%",

    marginBottom: 14,

    backgroundColor: "#EAAE00",
  },

  imagePlaceholder: {
    width: "100%",
    height: 190,

    marginBottom: 14,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#EAAE00",
  },

  imagePlaceholderText: {
    marginTop: 7,

    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 1,

    color: "#F0442C",
  },

  // --------------------------------------------------
  // TITLE
  // --------------------------------------------------

  titleContainer: {
    marginBottom: 13,
  },

  ticketTitle: {
    fontSize: 27,
    lineHeight: 27,

    fontWeight: "900",

    textTransform: "uppercase",

    color: "#F0442C",

    letterSpacing: -0.5,
  },

  // --------------------------------------------------
  // INFO
  // --------------------------------------------------

  infoSection: {
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",

    gap: 14,
  },

  infoBlock: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 7,
    fontWeight: "900",

    letterSpacing: 1,

    color: "#F0442C",

    marginBottom: 3,
  },

  infoValue: {
    fontSize: 11,
    fontWeight: "800",

    color: "#F0442C",

    textTransform: "uppercase",
  },

  timeRow: {
    marginTop: 9,
  },

  // --------------------------------------------------
  // ADMISSION
  // --------------------------------------------------

  admissionSection: {
    flexDirection: "row",
    alignItems: "center",

    gap: 7,
  },

  admissionLabel: {
    fontSize: 8,
    fontWeight: "900",

    color: "#F0442C",

    letterSpacing: 0.8,
  },

  admissionValue: {
    fontSize: 11,
    fontWeight: "900",

    color: "#F0442C",
  },

  // --------------------------------------------------
  // DIVIDER
  // --------------------------------------------------

  divider: {
    height: 18,

    marginHorizontal: -17,

    position: "relative",

    justifyContent: "center",
  },

  dividerLine: {
    borderTopWidth: 2,

    borderStyle: "dotted",

    borderColor: "#F0442C",

    width: "100%",
  },

  dividerNotchLeft: {
    position: "absolute",

    left: -9,

    width: 18,
    height: 18,

    borderRadius: 9,

    backgroundColor: "#F1F0F6",
  },

  dividerNotchRight: {
    position: "absolute",

    right: -9,

    width: 18,
    height: 18,

    borderRadius: 9,

    backgroundColor: "#F1F0F6",
  },

  // --------------------------------------------------
  // FOOTER
  // --------------------------------------------------

  ticketFooter: {
    flexDirection: "row",
    alignItems: "flex-end",

    justifyContent: "space-between",

    minHeight: 52,
  },

  ticketNumberContainer: {
    width: 65,
  },

  ticketNumberLabel: {
    fontSize: 6,
    fontWeight: "900",

    letterSpacing: 0.8,

    color: "#F0442C",

    marginBottom: 3,
  },

  ticketNumber: {
    fontSize: 10,
    fontWeight: "900",

    color: "#F0442C",

    letterSpacing: 1,
  },

  // --------------------------------------------------
  // BARCODE
  // --------------------------------------------------

  barcode: {
    height: 43,

    flex: 1,

    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "flex-end",

    gap: 2,

    overflow: "hidden",
  },

  bar: {
    height: "100%",

    backgroundColor: "#F0442C",
  },

  barSmall: {
    width: 2,
  },

  barMedium: {
    width: 3,
  },

  barWide: {
    width: 5,
  },
  descriptionContainer: {
    marginBottom: 13,
  },

  descriptionLabel: {
    fontSize: 7,
    fontWeight: "900",

    letterSpacing: 1,

    color: "#F0442C",

    marginBottom: 4,
  },

  descriptionText: {
    fontSize: 11,
    lineHeight: 16,

    fontWeight: "600",

    color: "#F0442C",
  },
  ticketImageContainer: {
    width: "100%",
    height: 220,
    overflow: "hidden",
    position: "relative",
  },

  ticketImageSlide: {
    height: "100%",
  },

  ticketImage: {
    width: "100%",
    height: "100%",
  },

  imageCounter: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },

  imageCounterText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  imageDots: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },

  imageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
  },

  imageDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  
});

export default styles;
