import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 52,
    paddingBottom: 10,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  headerCenter: {
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1.3,
    color: "#34345C",
  },

  headerDate: {
    marginTop: 3,
    fontSize: 11,
    color: "#777681",
  },

  headerSpacer: {
    width: 40,
  },

  subtitleWrapper: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  subtitle: {
    fontSize: 13,
    color: "#777681",
  },

  ticketListContent: {
    alignItems: "center",
  },

  ticketPage: {
    width: require("react-native").Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },

  bottomInfo: {
    alignItems: "center",
    paddingBottom: 35,
    paddingTop: 12,
  },

  positionBadge: {
    backgroundColor: "#34345C",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 12,
  },

  positionText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  swipeHint: {
    marginTop: 8,
    fontSize: 11,
    color: "#777681",
  },

  /* EMPTY STATE */

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },

  emptyTicket: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    padding: 26,
    alignItems: "center",
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F0F6",
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "700",
    color: "#242424",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: "#777681",
    textAlign: "center",
  },

  emptyHint: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 18,
    color: "#34345C",
    textAlign: "center",
  },
});
