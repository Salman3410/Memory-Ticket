import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  headerEyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: "#E76F51",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#242424",
    letterSpacing: -0.5,
  },
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#34345C",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#34345C",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 5,
  },
  collectionCard: {
    height: 100,
    borderRadius: 20,
    backgroundColor: "#34345C",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 25,
  },
  collectionIcon: {
    width: 56,
    height: 56,
    borderRadius: 17,
    backgroundColor: "#E76F51",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  collectionInfo: {
    zIndex: 2,
  },
  collectionNumber: {
    fontSize: 27,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 30,
  },
  collectionLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: "#D9D8E2",
    marginTop: 3,
  },
  collectionDecor: {
    position: "absolute",
    right: -15,
    top: -25,
    width: 130,
    height: 130,
  },
  decorCircleOne: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F2C14E",
    opacity: 0.12,
  },
  decorCircleTwo: {
    position: "absolute",
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: "#E76F51",
    opacity: 0.15,
    right: 5,
    bottom: 5,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 16,
  },
  filterButtonActive: {
    paddingHorizontal: 15,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#34345C",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  filterTextActive: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#FFFFFF",
  },
  filterButton: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  filterText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#707080",
  },
  sortButton: {
    marginLeft: "auto",
    height: 36,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  sortText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#707080",
  },
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
  memoriesList: {
    gap: 16,
  },

  memoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  memoryImage: {
    width: "100%",
    height: 210,
  },

  memoryInfo: {
    padding: 16,
  },

  memoryTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#242424",
    marginBottom: 7,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 7,
  },

  memoryLocation: {
    fontSize: 11,
    color: "#707080",
  },

  memoryDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: "#9A99A5",
  },
  createButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.1,
    color: "#FFFFFF",
  },
  footerText: {
    textAlign: "center",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#9A99A5",
    marginTop: 25,
  },

  favoriteStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,

    marginLeft: "auto",

    paddingHorizontal: 10,
    paddingVertical: 7,

    borderRadius: 10,

    backgroundColor: "#FFF7F6",
  },

  favoriteStatNumber: {
    fontSize: 12,
    fontWeight: "900",
    color: "#E76F51",
  },

  filterButton: {
    height: 38,

    paddingHorizontal: 11,

    borderRadius: 11,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#D9D8E2",

    flexDirection: "row",
    alignItems: "center",

    justifyContent: "center",

    gap: 5,
  },

  filterButtonActive: {
    height: 38,

    paddingHorizontal: 11,

    borderRadius: 11,

    backgroundColor: "#34345C",

    flexDirection: "row",
    alignItems: "center",

    justifyContent: "center",

    gap: 5,
  },

  filterText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
    color: "#707080",
  },

  filterTextActive: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
    color: "#FFFFFF",
  },

  sortButton: {
    height: 38,

    paddingHorizontal: 10,

    borderRadius: 11,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#D9D8E2",

    flexDirection: "row",
    alignItems: "center",

    gap: 4,
  },

  sortText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
    color: "#707080",
  },

  sortMenu: {
    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    borderWidth: 1,
    borderColor: "#D9D8E2",

    padding: 8,

    marginTop: -5,
    marginBottom: 16,
  },

  sortMenuTitle: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,

    color: "#9A99A5",

    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 5,
  },

  sortOption: {
    minHeight: 45,

    paddingHorizontal: 10,

    borderRadius: 10,

    flexDirection: "row",
    alignItems: "center",

    gap: 9,
  },

  sortOptionText: {
    flex: 1,

    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,

    color: "#242424",
  },

  viewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 13,
  },

  viewTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#242424",
  },

  viewCount: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,

    color: "#9A99A5",
  },

  memoriesList: {
    gap: 16,
  },

  memoryCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 21,

    overflow: "hidden",

    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  memoryImage: {
    width: "100%",
    height: 215,
  },

  favoriteButton: {
    position: "absolute",

    top: 12,
    right: 12,

    width: 40,
    height: 40,

    borderRadius: 13,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    elevation: 3,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  ticketBadge: {
    position: "absolute",

    left: 12,
    top: 12,

    height: 30,

    paddingHorizontal: 10,

    borderRadius: 9,

    backgroundColor: "#34345C",

    flexDirection: "row",
    alignItems: "center",

    gap: 5,
  },

  ticketBadgeText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,

    color: "#FFFFFF",
  },

  memoryInfo: {
    padding: 16,
  },

  memoryTitle: {
    fontSize: 19,
    fontWeight: "900",

    color: "#242424",

    marginBottom: 7,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 4,

    marginBottom: 7,
  },

  memoryLocation: {
    flex: 1,

    fontSize: 11,
    fontWeight: "600",

    color: "#707080",
  },

  memoryDescription: {
    fontSize: 12,
    lineHeight: 18,

    color: "#707080",

    marginBottom: 12,
  },

  cardFooter: {
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D9D8E2",

    paddingTop: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  memoryDate: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,

    color: "#9A99A5",
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
