import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useAuth } from "../hooks/useAuth";

import {
  getWallet,
  getRewardCatalog,
  getCoinHistory,
  redeemReward as redeemRewardApi,
  createAdSession,
} from "../api/rewardApi";

export const RewardsContext = createContext();

export function RewardsProvider({ children }) {
  const {
    token,
    user,
    loading: authLoading,
  } = useAuth();

  const [coins, setCoins] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [history, setHistory] = useState([]);

  const [walletLoading, setWalletLoading] =
    useState(false);

  const [rewardsLoading, setRewardsLoading] =
    useState(false);

  const [historyLoading, setHistoryLoading] =
    useState(false);

  const [redeemLoading, setRedeemLoading] =
    useState(false);

  const [redeemingRewardId, setRedeemingRewardId] =
    useState(null);

  const [adSessionLoading, setAdSessionLoading] =
    useState(false);

  const [walletError, setWalletError] =
    useState(null);

  const [rewardsError, setRewardsError] =
    useState(null);

  const [historyError, setHistoryError] =
    useState(null);

  // -----------------------------------------
  // RESET
  // -----------------------------------------

  const resetRewards = useCallback(() => {
    setCoins(0);
    setRewards([]);
    setHistory([]);

    setWalletError(null);
    setRewardsError(null);
    setHistoryError(null);

    setWalletLoading(false);
    setRewardsLoading(false);
    setHistoryLoading(false);

    setRedeemLoading(false);
    setRedeemingRewardId(null);

    setAdSessionLoading(false);
  }, []);

  // -----------------------------------------
  // WALLET
  // -----------------------------------------

  const refreshWallet = useCallback(
    async () => {
      if (!token) {
        setCoins(0);

        return {
          success: false,
          message:
            "No authenticated user.",
        };
      }

      setWalletLoading(true);
      setWalletError(null);

      try {
        const result = await getWallet(token);

        if (!result.success) {
          const message =
            result.message ||
            "Unable to load wallet.";

          setWalletError(message);

          return {
            success: false,
            message,
          };
        }

        const nextCoins =
          result.data?.wallet?.coins ?? 0;

        setCoins(nextCoins);

        return {
          success: true,
          coins: nextCoins,
        };
      } catch (error) {
        console.error(
          "Refresh wallet error:",
          error
        );

        setWalletError(
          "Unable to load your Coin balance."
        );

        return {
          success: false,
          message:
            "Unable to load your Coin balance.",
        };
      } finally {
        setWalletLoading(false);
      }
    },
    [token]
  );

  // -----------------------------------------
  // REWARD CATALOG
  // -----------------------------------------

  const refreshRewards = useCallback(
    async () => {
      if (!token) {
        setRewards([]);

        return {
          success: false,
          message:
            "No authenticated user.",
        };
      }

      setRewardsLoading(true);
      setRewardsError(null);

      try {
        const result =
          await getRewardCatalog(token);

        if (!result.success) {
          const message =
            result.message ||
            "Unable to load rewards.";

          setRewardsError(message);

          return {
            success: false,
            message,
          };
        }

        const rewardList =
          Array.isArray(
            result.data?.rewards
          )
            ? result.data.rewards
            : [];

        setRewards(rewardList);

        return {
          success: true,
          rewards: rewardList,
        };
      } catch (error) {
        console.error(
          "Refresh rewards error:",
          error
        );

        setRewardsError(
          "Unable to load rewards."
        );

        return {
          success: false,
          message:
            "Unable to load rewards.",
        };
      } finally {
        setRewardsLoading(false);
      }
    },
    [token]
  );

  // -----------------------------------------
  // HISTORY
  // -----------------------------------------

  const refreshHistory = useCallback(
    async (page = 1, limit = 20) => {
      if (!token) {
        setHistory([]);

        return {
          success: false,
          message:
            "No authenticated user.",
        };
      }

      setHistoryLoading(true);
      setHistoryError(null);

      try {
        const result =
          await getCoinHistory(
            token,
            page,
            limit
          );

        if (!result.success) {
          const message =
            result.message ||
            "Unable to load Coin history.";

          setHistoryError(message);

          return {
            success: false,
            message,
          };
        }

        const transactions =
          Array.isArray(
            result.data?.transactions
          )
            ? result.data.transactions
            : [];

        setHistory(transactions);

        return {
          success: true,
          transactions,
          pagination:
            result.data?.pagination ||
            null,
        };
      } catch (error) {
        console.error(
          "Refresh Coin history error:",
          error
        );

        setHistoryError(
          "Unable to load Coin history."
        );

        return {
          success: false,
          message:
            "Unable to load Coin history.",
        };
      } finally {
        setHistoryLoading(false);
      }
    },
    [token]
  );

  // -----------------------------------------
  // REDEEM REWARD
  // -----------------------------------------

  const redeemReward = useCallback(
    async (rewardId, requestId = null) => {
      if (!token) {
        return {
          success: false,
          message:
            "No authenticated user.",
        };
      }

      if (!rewardId) {
        return {
          success: false,
          message:
            "Reward ID is required.",
        };
      }

      // Prevent two simultaneous
      // redemption requests.
      if (redeemLoading) {
        return {
          success: false,
          message:
            "A redemption is already in progress.",
        };
      }

      setRedeemLoading(true);
      setRedeemingRewardId(rewardId);

      try {
        const result =
          await redeemRewardApi(
            token,
            rewardId,
            requestId
          );

        if (!result.success) {
          return {
            success: false,
            message:
              result.message ||
              "Unable to redeem reward.",

            code:
              result.data?.code ||
              null,

            owned:
              result.data?.owned ||
              false,
          };
        }

        const nextCoins =
          result.data?.wallet?.coins;

        if (
          typeof nextCoins === "number"
        ) {
          setCoins(nextCoins);
        }

        // Refresh catalog so `owned: true`
        // appears immediately.
        await refreshRewards();

        // Refresh history.
        await refreshHistory();

        return {
          success: true,

          alreadyProcessed:
            result.data
              ?.alreadyProcessed ||
            false,

          alreadyOwned:
            result.data
              ?.alreadyOwned ||
            false,

          redemption:
            result.data
              ?.redemption ||
            null,

          wallet:
            result.data?.wallet ||
            null,
        };
      } catch (error) {
        console.error(
          "Redeem reward error:",
          error
        );

        return {
          success: false,
          message:
            "Unable to redeem reward.",
        };
      } finally {
        setRedeemLoading(false);
        setRedeemingRewardId(null);
      }
    },
    [
      token,
      redeemLoading,
      refreshRewards,
      refreshHistory,
    ]
  );

  // -----------------------------------------
  // AD SESSION
  // -----------------------------------------

  const startAdSession = useCallback(
    async () => {
      if (!token) {
        return {
          success: false,
          message:
            "No authenticated user.",
        };
      }

      setAdSessionLoading(true);

      try {
        const result =
          await createAdSession(token);

        if (!result.success) {
          return {
            success: false,
            message:
              result.message ||
              "Unable to create ad session.",
          };
        }

        return {
          success: true,
          session:
            result.data?.session ||
            null,
        };
      } catch (error) {
        console.error(
          "Create ad session error:",
          error
        );

        return {
          success: false,
          message:
            "Unable to create ad session.",
        };
      } finally {
        setAdSessionLoading(false);
      }
    },
    [token]
  );

  // -----------------------------------------
  // INITIAL LOAD
  // -----------------------------------------

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!token || !user) {
      resetRewards();
      return;
    }

    refreshWallet();
    refreshRewards();
    refreshHistory();
  }, [
    token,
    user,
    authLoading,
    resetRewards,
    refreshWallet,
    refreshRewards,
    refreshHistory,
  ]);

  // -----------------------------------------
  // CONTEXT VALUE
  // -----------------------------------------

  const value = {
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

    resetRewards,
  };

  return (
    <RewardsContext.Provider value={value}>
      {children}
    </RewardsContext.Provider>
  );
}
