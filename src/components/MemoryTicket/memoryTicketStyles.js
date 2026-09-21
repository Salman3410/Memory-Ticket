import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  ticket: {
    width: "100%",
    borderRadius: 4,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 7,
  },

  ticketMinimal: {
    borderWidth: 1,
    borderRadius: 14,

    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  ticketVintage: {
    borderWidth: 1,
    borderRadius: 6,

    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },

  ticketCompact: {
    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  // --------------------------------------------------
  // EDGES
  // --------------------------------------------------

  topPerforation: {
    height: 12,

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },

  bottomPerforation: {
    height: 12,

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },

  perforationDot: {
    width: 17,
    height: 17,
    borderRadius: 8.5,

    marginTop: -8,
  },

  minimalRule: {
    width: "100%",
    height: 2,
  },

  // --------------------------------------------------
  // BODY
  // --------------------------------------------------

  ticketBody: {
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
  },

  // --------------------------------------------------
  // IMAGE
  // --------------------------------------------------

  ticketImageContainer: {
    width: "100%",
    height: 220,

    overflow: "hidden",

    position: "relative",
  },

  imageTouchable: {
    flex: 1,
  },

  ticketImageSlide: {
    height: "100%",
  },

  ticketImage: {
    width: "100%",
    height: "100%",
  },

  noImage: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  imagePlaceholderText: {
    marginTop: 7,

    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
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

    letterSpacing: -0.5,
  },

  minimalTitle: {
    fontSize: 24,
    lineHeight: 27,

    letterSpacing: 0,
  },

  vintageTitle: {
    fontSize: 25,
    lineHeight: 28,

    letterSpacing: -0.2,
  },

  // --------------------------------------------------
  // TAGS
  // --------------------------------------------------

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 7,

    marginBottom: 13,
  },

  tagChip: {
    paddingHorizontal: 0,
    paddingVertical: 2,

    borderBottomWidth: 1,
  },

  tagText: {
    fontSize: 8,
    lineHeight: 11,

    fontWeight: "800",

    letterSpacing: 0.2,
  },

  // --------------------------------------------------
  // DESCRIPTION
  // --------------------------------------------------

  descriptionContainer: {
    marginBottom: 13,
  },

  descriptionLabel: {
    fontSize: 7,
    fontWeight: "900",

    letterSpacing: 1,

    marginBottom: 4,
  },

  descriptionText: {
    fontSize: 11,
    lineHeight: 16,

    fontWeight: "600",
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

    marginBottom: 3,
  },

  infoValue: {
    fontSize: 11,

    fontWeight: "800",

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

    letterSpacing: 0.8,
  },

  admissionValue: {
    fontSize: 11,

    fontWeight: "900",
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

    width: "100%",
  },

  dividerNotchLeft: {
    position: "absolute",

    left: -9,

    width: 18,
    height: 18,

    borderRadius: 9,
  },

  dividerNotchRight: {
    position: "absolute",

    right: -9,

    width: 18,
    height: 18,

    borderRadius: 9,
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

    marginBottom: 3,
  },

  ticketNumber: {
    fontSize: 10,

    fontWeight: "900",

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

  barcodeFull: {
    marginLeft: 0,
  },

  bar: {
    height: "100%",
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
});

export default styles;
