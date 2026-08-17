import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 120,
  },

  // -------------------------
  // HEADER
  // -------------------------

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
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
  },

  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  // -------------------------
  // PROFILE CARD
  // -------------------------

  profileCard: {
    backgroundColor: "#34345C",
    borderRadius: 22,

    alignItems: "center",

    paddingTop: 25,
    paddingBottom: 24,

    overflow: "hidden",

    shadowColor: "#34345C",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.16,
    shadowRadius: 10,

    elevation: 5,
  },

  avatarContainer: {
    position: "relative",
    marginBottom: 14,
  },

  avatar: {
    width: 78,
    height: 78,
    borderRadius: 27,

    backgroundColor: "#F2C14E",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 4,
    borderColor: "#FFFFFF",
  },

  avatarText: {
    fontSize: 29,
    fontWeight: "900",
    color: "#34345C",
  },

  cameraButton: {
    position: "absolute",

    right: -3,
    bottom: -3,

    width: 28,
    height: 28,
    borderRadius: 10,

    backgroundColor: "#E76F51",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 2,
    borderColor: "#34345C",
  },

  userName: {
    fontSize: 21,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 12,
    color: "#D9D8E2",
    marginBottom: 13,
  },

  memberBadge: {
    height: 28,
    paddingHorizontal: 11,
    borderRadius: 8,

    backgroundColor: "rgba(255,255,255,0.10)",

    flexDirection: "row",
    alignItems: "center",

    gap: 5,
  },

  memberBadgeText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#FFFFFF",
  },

  // -------------------------
  // STATS
  // -------------------------

  statsContainer: {
    height: 82,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,

    marginTop: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: "#34345C",
    marginBottom: 3,
  },

  statLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.9,
    color: "#9A99A5",
  },

  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#D9D8E2",
  },

  // -------------------------
  // SECTION
  // -------------------------

  sectionTitle: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#707080",

    marginTop: 28,
    marginBottom: 10,

    paddingLeft: 3,
  },

  // -------------------------
  // MENU
  // -------------------------

  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,

    borderWidth: 1,
    borderColor: "#D9D8E2",

    overflow: "hidden",
  },

  menuItem: {
    minHeight: 70,

    paddingHorizontal: 13,

    flexDirection: "row",
    alignItems: "center",
  },

  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,

    backgroundColor: "#F1F0F6",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  menuTextContainer: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#242424",
    marginBottom: 3,
  },

  menuSubtitle: {
    fontSize: 10,
    color: "#9A99A5",
  },

  menuDivider: {
    height: 1,
    backgroundColor: "#EEEFF3",
    marginLeft: 65,
  },

  // -------------------------
  // LOGOUT
  // -------------------------

  logoutButton: {
    height: 52,

    borderRadius: 14,

    backgroundColor: "#FFF7F6",

    borderWidth: 1,
    borderColor: "#F3D3CF",

    marginTop: 24,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,
  },

  logoutText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#D9534F",
  },

  // -------------------------
  // VERSION
  // -------------------------

  versionText: {
    textAlign: "center",

    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,

    color: "#AAA9B3",

    marginTop: 18,
  },
});

export default styles;
