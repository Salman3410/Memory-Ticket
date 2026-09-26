import {
  useCallback,
  useState,
} from "react";

import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CoinBalanceCard from "./components/CoinBalanceCard";
import WatchAdCard from "./components/WatchAdCard";
import DailyBonusCard from "./components/DailyBonusCard";
import RewardStore from "./components/RewardStore";
import CoinHistory from "./components/CoinHistory";

import { useRewards } from "../../hooks/useRewards";

function RewardsScreen() {
  const {
    coins,
    rewards,
    history,

    walletLoading,
    rewardsLoading,
    historyLoading,

    redeemLoading,
    redeemingRewardId,

    adSessionLoading,

    walletError,
    rewardsError,
    historyError,

    refreshWallet,
    refreshRewards,
    refreshHistory,

    redeemReward,
    startAdSession,
  } = useRewards();

  const [refreshing, setRefreshing] =
    useState(false);

  // -----------------------------------------
  // REFRESH
  // -----------------------------------------

  const onRefresh = useCallback(
    async () => {
      setRefreshing(true);

      try {
        await Promise.all([
          refreshWallet(),
          refreshRewards(),
          refreshHistory(),
        ]);
      } catch (error) {
        console.error(
          "Rewards refresh error:",
          error,
        );
      } finally {
        setRefreshing(false);
      }
    },
    [
      refreshWallet,
      refreshRewards,
      refreshHistory,
    ],
  );

  // -----------------------------------------
  // WATCH AD
  // -----------------------------------------

  const handleWatchAd =
    useCallback(async () => {
      try {
        const result =
          await startAdSession();

        if (!result?.success) {
          Alert.alert(
            "Couldn't start",
            result?.message ||
              "Please try again later.",
          );

          return;
        }

        Alert.alert(
          "Almost there",
          "The rewarded ad session is ready. AdMob will be connected next.",
        );
      } catch (error) {
        console.error(
          "Start ad session error:",
          error,
        );

        Alert.alert(
          "Couldn't start",
          error?.message ||
            "Please try again later.",
        );
      }
    }, [startAdSession]);

  // -----------------------------------------
  // REDEEM
  // -----------------------------------------

  const handleRedeem = useCallback(
    (reward) => {
      const rewardId =
        reward?._id ||
        reward?.id;

      if (!rewardId) {
        Alert.alert(
          "Unable to redeem",
          "This reward is missing its ID.",
        );

        return;
      }

      if (reward?.owned) {
        Alert.alert(
          "Already owned",
          "You already own this reward. It is yours permanently.",
        );

        return;
      }

      const cost = Math.max(
        1,
        Number(reward?.cost || 1),
      );

      if (coins < cost) {
        Alert.alert(
          "Not enough Coins",
          `You need ${
            cost - coins
          } more Coins.`,
        );

        return;
      }

      Alert.alert(
        "Redeem reward",
        `${reward?.name || "This reward"} • ${cost} Coins`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Redeem",

            onPress: async () => {
              try {
                const result =
                  await redeemReward(
                    rewardId,
                  );

                if (!result?.success) {
                  if (
                    result?.code ===
                    "REWARD_ALREADY_OWNED"
                  ) {
                    Alert.alert(
                      "Already owned",
                      "You already own this reward.",
                    );

                    await Promise.all([
                      refreshWallet(),
                      refreshRewards(),
                      refreshHistory(),
                    ]);

                    return;
                  }

                  if (
                    result?.code ===
                    "INSUFFICIENT_COINS"
                  ) {
                    Alert.alert(
                      "Not enough Coins",
                      "You don't have enough Coins for this reward.",
                    );

                    await refreshWallet();

                    return;
                  }

                  Alert.alert(
                    "Redemption failed",
                    result?.message ||
                      "Unable to redeem this reward.",
                  );

                  return;
                }

                // -----------------------------------------
                // ALREADY OWNED
                // -----------------------------------------

                if (
                  result?.alreadyOwned
                ) {
                  Alert.alert(
                    "Already owned",
                    `${reward?.name || "This reward"} is already yours permanently.`,
                  );

                  await Promise.all([
                    refreshWallet(),
                    refreshRewards(),
                    refreshHistory(),
                  ]);

                  return;
                }

                // -----------------------------------------
                // ALREADY PROCESSED
                // -----------------------------------------

                if (
                  result?.alreadyProcessed
                ) {
                  Alert.alert(
                    "Already redeemed",
                    `${reward?.name || "This reward"} is already yours permanently.`,
                  );

                  await Promise.all([
                    refreshWallet(),
                    refreshRewards(),
                    refreshHistory(),
                  ]);

                  return;
                }

                // -----------------------------------------
                // SUCCESS
                // -----------------------------------------

                Alert.alert(
                  "Reward unlocked",
                  `${reward?.name || "This reward"} is now yours forever.`,
                );

                // Pull fresh state from backend.
                await Promise.all([
                  refreshWallet(),
                  refreshRewards(),
                  refreshHistory(),
                ]);
              } catch (error) {
                console.error(
                  "Redeem reward error:",
                  error,
                );

                Alert.alert(
                  "Redemption failed",
                  error?.message ||
                    "Unable to redeem this reward.",
                );

                // Resync in case the
                // transaction succeeded
                // but the response failed.
                try {
                  await Promise.all([
                    refreshWallet(),
                    refreshRewards(),
                    refreshHistory(),
                  ]);
                } catch (
                  refreshError
                ) {
                  console.error(
                    "Reward resync error:",
                    refreshError,
                  );
                }
              }
            },
          },
        ],
      );
    },
    [
      coins,
      redeemReward,
      refreshWallet,
      refreshRewards,
      refreshHistory,
    ],
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.contentContainer
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#34345C"
          />
        }
      >
        {/* -----------------------------------------
            HEADER
        ----------------------------------------- */}

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>
              REWARDS
            </Text>

            <Text style={styles.title}>
              A little something back.
            </Text>
          </View>
        </View>

        {/* -----------------------------------------
            BALANCE
        ----------------------------------------- */}

        <CoinBalanceCard
          coins={coins}
          loading={walletLoading}
          error={walletError}
          onRetry={refreshWallet}
        />

        {/* -----------------------------------------
            EARN
        ----------------------------------------- */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Earn
            </Text>

            <Text
              style={
                styles.sectionSubtitle
              }
            >
              Turn a few seconds into Coins.
            </Text>
          </View>
        </View>

        <WatchAdCard
          rewardAmount={10}
          loading={adSessionLoading}
          onPress={handleWatchAd}
        />

        {/* -----------------------------------------
            DAILY BONUS
        ----------------------------------------- */}

        <DailyBonusCard
          rewardAmount={20}
          available={false}
          claimed={false}
        />

        {/* -----------------------------------------
            STORE
        ----------------------------------------- */}

        <RewardStore
          rewards={rewards}
          coins={coins}
          loading={rewardsLoading}
          error={rewardsError}
          redeemLoading={redeemLoading}
          redeemingRewardId={
            redeemingRewardId
          }
          onRedeem={handleRedeem}
          onRetry={refreshRewards}
        />

        {/* -----------------------------------------
            HISTORY
        ----------------------------------------- */}

        <CoinHistory
          history={history}
          loading={historyLoading}
          error={historyError}
          onRetry={refreshHistory}
          limit={4}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 55,
    paddingBottom: 36,
  },

  header: {
    marginBottom: 22,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#E76F51",
    marginBottom: 5,
  },

  title: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "800",
    color: "#34345C",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginBottom: 11,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#34345C",
  },

  sectionSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: "#8A8997",
  },
});

export default RewardsScreen;
