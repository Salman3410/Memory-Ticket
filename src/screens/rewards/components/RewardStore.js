import {
  useEffect,
  useRef,
} from "react";

import {
  ActivityIndicator,
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import RewardCard from "./RewardCard";
import styles from "../rewardStyles";

function RewardStore({
  rewards = [],
  coins = 0,
  loading = false,
  error = null,
  redeemLoading = false,
  redeemingRewardId = null,
  onRedeem,
  onRetry,
}) {
  const sectionOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const sectionTranslateY = useRef(
    new Animated.Value(16)
  ).current;

  const headerIconScale = useRef(
    new Animated.Value(1)
  ).current;

  const errorScale = useRef(
    new Animated.Value(1)
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(sectionOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(sectionTranslateY, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    sectionOpacity,
    sectionTranslateY,
  ]);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(headerIconScale, {
          toValue: 1.08,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(headerIconScale, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [
    loading,
    headerIconScale,
  ]);

  const hasRewards = rewards.length > 0;

  const affordableCount = rewards.filter((reward) => {
    if (!reward) {
      return false;
    }

    if (reward.owned === true) {
      return false;
    }

    if (reward.active === false) {
      return false;
    }

    return Number(reward.cost || 0) <= coins;
  }).length;

  const handleRetryPressIn = () => {
    Animated.spring(errorScale, {
      toValue: 0.98,
      friction: 7,
      tension: 140,
      useNativeDriver: true,
    }).start();
  };

  const handleRetryPressOut = () => {
    Animated.spring(errorScale, {
      toValue: 1,
      friction: 6,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.storeSection,
        {
          opacity: sectionOpacity,
          transform: [
            {
              translateY: sectionTranslateY,
            },
          ],
        },
      ]}
    >
      {/* STORE HEADER */}
      <View style={styles.sectionHeader}>
        <View style={styles.storeHeaderContent}>
          <View style={styles.storeTitleRow}>
            <Animated.View
              style={[
                styles.storeIcon,
                {
                  transform: [
                    {
                      scale: headerIconScale,
                    },
                  ],
                },
              ]}
            >
              <Ionicons
                name="bag-handle-outline"
                size={18}
                color="#34345C"
              />
            </Animated.View>

            <View>
              <Text style={styles.sectionTitle}>
                Store
              </Text>

              <Text style={styles.sectionSubtitle}>
                Spend Coins on Memento extras.
              </Text>
            </View>
          </View>

          {hasRewards ? (
            <View style={styles.rewardCountPill}>
              <Text style={styles.rewardCountText}>
                {affordableCount > 0
                  ? `${affordableCount} available`
                  : `${rewards.length} items`}
              </Text>
            </View>
          ) : null}
        </View>

        {loading ? (
          <ActivityIndicator
            size="small"
            color="#34345C"
            style={styles.storeLoader}
          />
        ) : null}
      </View>

      {/* ERROR */}
      {error ? (
        <Animated.View
          style={{
            transform: [
              {
                scale: errorScale,
              },
            ],
          }}
        >
          <TouchableOpacity
            style={[
              styles.messageCard,
              styles.storeErrorCard,
            ]}
            onPress={onRetry}
            onPressIn={handleRetryPressIn}
            onPressOut={handleRetryPressOut}
            activeOpacity={1}
          >
            <View style={styles.messageIcon}>
              <Ionicons
                name="alert-circle-outline"
                size={21}
                color="#E76F51"
              />
            </View>

            <View
              style={styles.storeMessageContent}
            >
              <Text
                style={styles.storeMessageTitle}
              >
                Couldn't load rewards
              </Text>

              <Text style={styles.messageText}>
                {error}
              </Text>

              <View style={styles.retryRow}>
                <Text style={styles.retryText}>
                  Try again
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={14}
                  color="#34345C"
                />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ) : loading && !hasRewards ? (
        /* INITIAL LOADING */
        <View style={styles.rewardGrid}>
          <RewardSkeleton />
          <RewardSkeleton delay={100} />
          <RewardSkeleton delay={180} />
          <RewardSkeleton delay={260} />
        </View>
      ) : !hasRewards ? (
        /* EMPTY */
        <View style={styles.storeEmptyCard}>
          <View style={styles.storeEmptyIcon}>
            <Ionicons
              name="gift-outline"
              size={24}
              color="#34345C"
            />
          </View>

          <Text style={styles.storeEmptyTitle}>
            Nothing here yet
          </Text>

          <Text style={styles.storeEmptyText}>
            New Memento rewards will appear here soon.
          </Text>
        </View>
      ) : (
        /* REWARD GRID */
        <View style={styles.rewardGrid}>
          {rewards.map((reward, index) => {
            const rewardId =
              reward?._id || reward?.id;

            return (
              <RewardGridItem
                key={
                  rewardId ||
                  `reward-${index}`
                }
                reward={reward}
                index={index}
                coins={coins}
                redeemLoading={redeemLoading}
                redeemingRewardId={
                  redeemingRewardId
                }
                onRedeem={onRedeem}
              />
            );
          })}
        </View>
      )}
    </Animated.View>
  );
}

function RewardGridItem({
  reward,
  index,
  coins,
  redeemLoading,
  redeemingRewardId,
  onRedeem,
}) {
  const opacity = useRef(
    new Animated.Value(0)
  ).current;

  const translateY = useRef(
    new Animated.Value(20)
  ).current;

  const scale = useRef(
    new Animated.Value(0.97)
  ).current;

  useEffect(() => {
    const delay = Math.min(index * 75, 450);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 380,
        delay,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(translateY, {
        toValue: 0,
        duration: 430,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(scale, {
        toValue: 1,
        delay,
        friction: 8,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    index,
    opacity,
    translateY,
    scale,
  ]);

  return (
    <Animated.View
      style={{
        width: "48.5%",
        opacity,
        transform: [
          {
            translateY,
          },
          {
            scale,
          },
        ],
      }}
    >
      <RewardCard
        reward={reward}
        coins={coins}
        redeemLoading={redeemLoading}
        redeemingRewardId={
          redeemingRewardId
        }
        onRedeem={onRedeem}
      />
    </Animated.View>
  );
}

function RewardSkeleton({
  delay = 0,
}) {
  const opacity = useRef(
    new Animated.Value(0.45)
  ).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 700,
          delay,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [
    delay,
    opacity,
  ]);

  return (
    <Animated.View
      style={[
        styles.rewardSkeleton,
        {
          opacity,
        },
      ]}
    >
      <View style={styles.skeletonTop}>
        <View style={styles.skeletonIcon} />

        <View style={styles.skeletonPill} />
      </View>

      <View style={styles.skeletonTitle} />

      <View style={styles.skeletonLine} />

      <View
        style={[
          styles.skeletonLine,
          styles.skeletonLineShort,
        ]}
      />

      <View style={styles.skeletonBottom}>
        <View style={styles.skeletonCost} />

        <View style={styles.skeletonButton} />
      </View>
    </Animated.View>
  );
}

export default RewardStore;
