import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
});

export default styles;
