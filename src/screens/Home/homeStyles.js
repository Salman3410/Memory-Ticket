import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 110,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",

    marginBottom: 25,
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.8,

    color: "#E76F51",

    marginBottom: 5,
  },

  title: {
    fontSize: 27,
    fontWeight: "900",

    color: "#242424",
  },

  subtitle: {
    fontSize: 27,
    fontWeight: "900",

    color: "#34345C",
  },

  profileButton: {
    width: 45,
    height: 45,

    borderRadius: 14,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  /* HERO */

  heroCard: {
    minHeight: 265,

    borderRadius: 25,

    backgroundColor: "#34345C",

    padding: 24,

    overflow: "hidden",

    position: "relative",

    marginBottom: 18,
  },

  heroContent: {
    zIndex: 2,

    maxWidth: 285,
  },

  heroIcon: {
    width: 48,
    height: 48,

    borderRadius: 15,

    backgroundColor: "#E76F51",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 19,
  },

  heroTitle: {
    fontSize: 25,
    lineHeight: 30,

    fontWeight: "900",

    color: "#FFFFFF",

    marginBottom: 9,
  },

  heroDescription: {
    fontSize: 13,
    lineHeight: 20,

    color: "#D9D8E8",

    marginBottom: 20,
  },

  heroButton: {
    height: 46,

    paddingHorizontal: 15,

    alignSelf: "flex-start",

    borderRadius: 12,

    backgroundColor: "#E76F51",

    flexDirection: "row",
    alignItems: "center",

    gap: 8,
  },

  heroButtonText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.1,

    color: "#FFFFFF",
  },

  heroDecoration: {
    position: "absolute",

    right: -65,
    bottom: -75,

    width: 220,
    height: 220,
  },

  heroCircleLarge: {
    position: "absolute",

    width: 210,
    height: 210,

    borderRadius: 105,

    backgroundColor: "#45456F",

    top: 0,
    left: 0,
  },

  heroCircleSmall: {
    position: "absolute",

    width: 115,
    height: 115,

    borderRadius: 58,

    backgroundColor: "#E76F51",

    opacity: 0.25,

    top: 50,
    left: 45,
  },

  /* STATS */

  statsRow: {
    flexDirection: "row",

    gap: 12,

    marginBottom: 30,
  },

  statCard: {
    flex: 1,
    flexDirection:"row",
    justifyContent:"space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  statIcon: {
    width: 34,
    height: 34,

    borderRadius: 10,

    backgroundColor: "#F1F0F6",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 10,
  },

  favoriteStatIcon: {
    width: 34,
    height: 34,

    borderRadius: 10,

    backgroundColor: "#FFF4F1",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 10,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: "#242424",
  },

  statLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#9A99A5",
  },

  /* SECTIONS */

  section: {
    marginBottom: 28,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",

    marginBottom: 13,
  },

  sectionEyebrow: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.5,

    color: "#E76F51",

    marginBottom: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",

    color: "#242424",
  },

  viewAllText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,

    color: "#34345C",
  },

  /* LATEST */

  latestCard: {
    height: 245,

    borderRadius: 22,

    overflow: "hidden",

    backgroundColor: "#34345C",

    position: "relative",
  },

  latestImage: {
    width: "100%",
    height: "100%",
  },

  latestOverlay: {
    position: "absolute",

    left: 0,
    right: 0,
    top: 0,
    bottom: 0,

    backgroundColor: "rgba(20, 20, 40, 0.42)",
  },

  latestContent: {
    position: "absolute",

    left: 17,
    right: 17,
    bottom: 17,

    justifyContent: "space-between",

    height: 190,
  },

  latestBadge: {
    alignSelf: "flex-start",

    height: 29,

    paddingHorizontal: 10,

    borderRadius: 9,

    backgroundColor: "#34345C",

    flexDirection: "row",
    alignItems: "center",

    gap: 5,
  },

  latestBadgeText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.9,

    color: "#FFFFFF",
  },

  latestTitle: {
    fontSize: 22,
    fontWeight: "900",

    color: "#FFFFFF",

    marginBottom: 5,

    maxWidth: "85%",
  },

  latestLocation: {
    flexDirection: "row",
    alignItems: "center",

    gap: 4,
  },

  latestLocationText: {
    fontSize: 11,

    color: "#FFFFFF",

    opacity: 0.9,

    maxWidth: "80%",
  },

  latestArrow: {
    position: "absolute",

    right: 15,
    bottom: 15,

    width: 40,
    height: 40,

    borderRadius: 13,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",
  },

  /* RECENT */

  recentList: {
    gap: 10,
  },

  recentCard: {
    minHeight: 86,

    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 10,

    borderWidth: 1,
    borderColor: "#D9D8E2",

    flexDirection: "row",
    alignItems: "center",
  },

  recentImage: {
    width: 66,
    height: 66,

    borderRadius: 11,

    backgroundColor: "#D9D8E2",
  },

  recentInfo: {
    flex: 1,

    marginLeft: 12,

    minWidth: 0,
  },

  recentTitle: {
    fontSize: 14,
    fontWeight: "800",

    color: "#242424",

    marginBottom: 5,
  },

  recentLocation: {
    flexDirection: "row",
    alignItems: "center",

    gap: 3,

    marginBottom: 4,
  },

  recentLocationText: {
    flex: 1,

    fontSize: 10,

    color: "#707080",
  },

  recentDate: {
    fontSize: 9,

    color: "#9A99A5",
  },

  recentArrow: {
    width: 30,
    height: 30,

    alignItems: "center",
    justifyContent: "center",

    marginLeft: 5,
  },

  /* EMPTY */

  emptyCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 20,

    padding: 25,

    alignItems: "center",

    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  emptyIcon: {
    width: 58,
    height: 58,

    borderRadius: 18,

    backgroundColor: "#F1F0F6",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 13,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",

    color: "#242424",

    marginBottom: 5,
  },

  emptyDescription: {
    fontSize: 12,
    lineHeight: 18,

    color: "#707080",

    textAlign: "center",

    maxWidth: 270,

    marginBottom: 16,
  },

  emptyButton: {
    height: 42,

    paddingHorizontal: 17,

    borderRadius: 11,

    backgroundColor: "#34345C",

    alignItems: "center",
    justifyContent: "center",
  },

  emptyButtonText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,

    color: "#FFFFFF",
  },

  loadingCard: {
    height: 100,

    borderRadius: 18,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  loadingText: {
    fontSize: 12,
    color: "#707080",
  },

  /* FAVORITES */

  favoriteBanner: {
    backgroundColor: "#FFF7F5",

    borderRadius: 18,

    padding: 14,

    borderWidth: 1,
    borderColor: "#F3D8D1",

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 20,
  },

  favoriteBannerIcon: {
    width: 42,
    height: 42,

    borderRadius: 13,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  favoriteBannerContent: {
    flex: 1,
  },

  favoriteBannerTitle: {
    fontSize: 13,
    fontWeight: "900",

    color: "#242424",

    marginBottom: 3,
  },

  favoriteBannerDescription: {
    fontSize: 10,
    lineHeight: 15,

    color: "#707080",
  },

  /* FOOTER */

  footerText: {
    textAlign: "center",

    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,

    color: "#9A99A5",

    marginTop: 5,
  },
});

export default styles;
