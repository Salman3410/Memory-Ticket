import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  balanceCard: {
    padding: 20,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E0E8",
    marginBottom: 28,

    shadowColor: "#34345C",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },

  balanceTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  balanceLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#92919E",
  },

  balanceValue: {
    marginTop: 3,
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "800",
    letterSpacing: -1.2,
    color: "#34345C",
  },

  balanceLoader: {
    marginTop: 14,
    alignSelf: "flex-start",
  },

  balanceIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#F3F2F7",
  },

  balanceDivider: {
    height: 1,
    backgroundColor: "#ECEBF1",
    marginVertical: 16,
  },

  balanceBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  balanceHint: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "#898894",
  },

  inlineRetry: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },

  inlineRetryText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: "#E76F51",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "800",
    letterSpacing: -0.2,
    color: "#34345C",
  },

  sectionSubtitle: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
    color: "#8A8997",
  },

  earnCard: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 72,
    paddingHorizontal: 13,
    paddingVertical: 13,
    borderRadius: 20,
    backgroundColor: "#34345C",
    marginBottom: 18,

    shadowColor: "#34345C",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },

  earnIcon: {
    width: 43,
    height: 43,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#E76F51",
  },

  earnContent: {
    flex: 1,
    marginLeft: 11,
    marginRight: 8,
  },

  earnTitle: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.1,
    color: "#FFFFFF",
  },

  earnText: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 15,
    color: "#D9D8E2",
  },

  earnReward: {
    alignItems: "flex-end",
    marginRight: 10,
  },

  earnRewardText: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  earnRewardLabel: {
    marginTop: 1,
    fontSize: 9,
    fontWeight: "600",
    color: "#C9C8D4",
  },

  watchButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#E76F51",
  },

  disabledButton: {
    opacity: 0.6,
  },

  dailyCard: {
    marginBottom: 28,
    padding: 13,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E0E8",

    shadowColor: "#34345C",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.035,
    shadowRadius: 8,
    elevation: 1,
  },

  dailyCardDisabled: {
    opacity: 0.58,
  },

  dailyInner: {
    flexDirection: "row",
    alignItems: "center",
  },

  dailyIcon: {
    width: 41,
    height: 41,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#F3F2F7",
  },

  dailyIconActive: {
    backgroundColor: "#FFF1ED",
  },

  dailyContent: {
    flex: 1,
    marginLeft: 11,
    marginRight: 10,
  },

  dailyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  dailyTitle: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
    color: "#34345C",
  },

  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginLeft: 7,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "#FFF1ED",
  },

  streakText: {
    fontSize: 8,
    fontWeight: "800",
    color: "#E76F51",
  },

  dailyText: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 15,
    color: "#8A8997",
  },

  dailyActionArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  dailyReward: {
    alignItems: "flex-end",
  },

  dailyAction: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "800",
    color: "#E76F51",
  },

  dailyActionClaimed: {
    color: "#8A8997",
  },

  dailyActionLabel: {
    marginTop: 1,
    fontSize: 8,
    fontWeight: "600",
    color: "#9A98A5",
  },

  storeSection: {
    marginTop: 6,
  },

  storeHeaderContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  storeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  storeIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#E9E8F1",
    marginRight: 10,
  },

  rewardCountPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#E9E8F1",
    marginLeft: 10,
  },

  rewardCountText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#34345C",
  },

  storeLoader: {
    marginLeft: 10,
  },

  storeMessageWrapper: {
    marginTop: 8,
  },

  storeMessageContent: {
    flex: 1,
    marginLeft: 10,
  },

  storeErrorCard: {
    alignItems: "flex-start",
  },

  storeMessageTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#242424",
    marginBottom: 3,
  },

  retryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  retryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#34345C",
    marginRight: 4,
  },

  storeEmptyCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    paddingHorizontal: 24,
  },

  storeEmptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9E8F1",
    marginBottom: 12,
  },

  storeEmptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#242424",
    marginBottom: 5,
    textAlign: "center",
  },

  storeEmptyText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#777787",
    textAlign: "center",
    maxWidth: 260,
  },

  rewardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 28,
  },

  rewardCard: {
    width: "100%",
    minHeight: 196,
    padding: 15,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E4EC",

    shadowColor: "#34345C",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },

  rewardCardOwned: {
    backgroundColor: "#F8F7FB",
    borderColor: "#D8D7E2",
  },

  rewardCardInactive: {
    opacity: 0.65,
  },

  rewardCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  rewardIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#F0EFF5",
  },

  rewardIconOwned: {
    backgroundColor: "#E9E8F1",
  },

  categoryPill: {
    maxWidth: "56%",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#F5F4F8",
  },

  categoryPillOwned: {
    backgroundColor: "#E9E8F1",
  },

  categoryText: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.7,
    color: "#6F6E7E",
    textTransform: "uppercase",
  },

  categoryTextOwned: {
    color: "#34345C",
  },

  rewardContent: {
    flex: 1,
  },

  rewardName: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "800",
    letterSpacing: -0.15,
    color: "#242424",
    marginBottom: 5,
  },

  rewardDescription: {
    fontSize: 11.5,
    lineHeight: 17,
    color: "#777787",
  },

  rewardBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 15,
  },

  costBlock: {
    justifyContent: "center",
  },

  costRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  costValue: {
    marginLeft: 5,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "800",
    color: "#34345C",
  },

  costLabel: {
    marginTop: 1,
    fontSize: 10,
    fontWeight: "600",
    color: "#8F8EA0",
  },

  ownedRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  ownedText: {
    marginLeft: 5,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
    color: "#34345C",
  },

  lifetimeLabel: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: "600",
    color: "#8F8EA0",
  },

  getButton: {
    minWidth: 72,
    height: 38,
    paddingHorizontal: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 12,
    backgroundColor: "#34345C",
  },

  getButtonOwned: {
    backgroundColor: "#E9E8F1",
  },

  getButtonDisabled: {
    backgroundColor: "#EBEAF0",
  },

  getButtonLoading: {
    opacity: 0.8,
  },

  getButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  getButtonTextDisabled: {
    color: "#8F8EA0",
  },

  rewardStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0EFF4",
  },

  rewardStatusText: {
    marginLeft: 5,
    fontSize: 10,
    fontWeight: "700",
    color: "#34345C",
  },

  rewardShortageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0EFF4",
  },

  rewardShortageText: {
    marginLeft: 5,
    fontSize: 10,
    fontWeight: "600",
    color: "#8F8EA0",
  },

  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E0E8",
    marginBottom: 28,
  },

  messageIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF1ED",
  },

  messageText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: "#6F6E7F",
  },

  emptyActivity: {
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 29,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E0E8",

    shadowColor: "#34345C",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.025,
    shadowRadius: 9,
    elevation: 1,
  },

  emptyActivityIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#F3F2F7",
  },

  emptyActivityTitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
    color: "#34345C",
  },

  emptyActivityText: {
    marginTop: 4,
    maxWidth: 280,
    fontSize: 11,
    lineHeight: 16,
    color: "#8A8997",
    textAlign: "center",
  },

  activityList: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E0E8",
    overflow: "hidden",

    shadowColor: "#34345C",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.03,
    shadowRadius: 9,
    elevation: 1,
  },

  activityAnimatedRow: {
    flexDirection: "row",
    alignItems: "stretch",
    minHeight: 68,
  },

  activityTimeline: {
    width: 35,
    alignItems: "center",
  },

  activityIcon: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginTop: 11,
    zIndex: 2,
  },

  activityIconPositive: {
    backgroundColor: "#F3F2F7",
  },

  activityIconNegative: {
    backgroundColor: "#FFF1ED",
  },

  activityConnector: {
    width: 1,
    flex: 1,
    marginTop: -1,
    marginBottom: -1,
    backgroundColor: "#E8E7ED",
  },

  activityInfo: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 10,
    paddingVertical: 11,
  },

  activityTitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    color: "#242424",
  },

  activityMeta: {
    marginTop: 3,
  },

  activitySubtitle: {
    fontSize: 10,
    lineHeight: 14,
    color: "#92919E",
  },

  activityAmount: {
    alignSelf: "center",
    marginRight: 2,
    fontSize: 14,
    fontWeight: "800",
  },

  activityPositive: {
    color: "#34345C",
  },

  activityNegative: {
    color: "#E76F51",
  },

  rewardSkeleton: {
    width: "48.5%",
    minHeight: 196,
    padding: 15,
    borderRadius: 20,
    backgroundColor: "#E9E8EE",
  },

  skeletonTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  skeletonIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#DEDEE6",
  },

  skeletonPill: {
    width: 48,
    height: 18,
    borderRadius: 999,
    backgroundColor: "#DEDEE6",
  },

  skeletonTitle: {
    width: "72%",
    height: 15,
    borderRadius: 6,
    backgroundColor: "#DEDEE6",
    marginTop: 18,
  },

  skeletonLine: {
    width: "92%",
    height: 9,
    borderRadius: 5,
    backgroundColor: "#DEDEE6",
    marginTop: 10,
  },

  skeletonLineShort: {
    width: "62%",
    marginTop: 6,
  },

  skeletonBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingTop: 15,
  },

  skeletonCost: {
    width: 45,
    height: 17,
    borderRadius: 6,
    backgroundColor: "#DEDEE6",
  },

  skeletonButton: {
    width: 72,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#DEDEE6",
  },
});

export default styles;
