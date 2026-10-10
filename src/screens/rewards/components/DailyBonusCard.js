import {
  useEffect,
  useRef,
} from "react";

import {
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "../rewardStyles";
import { useTheme } from "../../../context/ThemeContext";

function DailyBonusCard({
  rewardAmount = 20,
  claimed = false,
  available = false,
  streak = 0,
  onPress,
}) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};
  const screenBackground = colors.background || (isDark ? "#171624" : "#F1F0F6");
  const surfaceColor = colors.surface || (isDark ? "#211F30" : "#FFFFFF");
  const textColor = colors.text || (isDark ? "#F7F5FC" : "#242424");
  const secondaryTextColor = colors.textSecondary || colors.textMuted || (isDark ? "#C4C0D0" : "#707080");
  const borderColor = colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const cardOpacity = useRef(
    new Animated.Value(0),
  ).current;

  const cardTranslateY = useRef(
    new Animated.Value(10),
  ).current;

  const iconScale = useRef(
    new Animated.Value(1),
  ).current;

  const iconRotate = useRef(
    new Animated.Value(0),
  ).current;

  const rewardScale = useRef(
    new Animated.Value(1),
  ).current;

  const arrowTranslateX = useRef(
    new Animated.Value(0),
  ).current;

  /*
   * -----------------------------------------
   * CARD ENTRANCE
   * -----------------------------------------
   */
  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(cardTranslateY, {
        toValue: 0,
        damping: 16,
        stiffness: 130,
        mass: 0.8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    cardOpacity,
    cardTranslateY,
  ]);

  /*
   * -----------------------------------------
   * GIFT ANIMATION
   * -----------------------------------------
   *
   * Only animate actively when the reward
   * can actually be claimed.
   */
  useEffect(() => {
    if (!available || claimed) {
      iconScale.setValue(1);
      iconRotate.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(900),

        Animated.parallel([
          Animated.spring(iconScale, {
            toValue: 1.08,
            damping: 8,
            stiffness: 200,
            mass: 0.5,
            useNativeDriver: true,
          }),

          Animated.timing(iconRotate, {
            toValue: 1,
            duration: 180,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),

        Animated.timing(iconRotate, {
          toValue: -1,
          duration: 180,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),

        Animated.timing(iconRotate, {
          toValue: 0,
          duration: 180,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),

        Animated.spring(iconScale, {
          toValue: 1,
          damping: 10,
          stiffness: 180,
          mass: 0.6,
          useNativeDriver: true,
        }),

        Animated.delay(2200),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [
    available,
    claimed,
    iconScale,
    iconRotate,
  ]);

  /*
   * -----------------------------------------
   * REWARD PULSE
   * -----------------------------------------
   */
  useEffect(() => {
    if (!available || claimed) {
      rewardScale.setValue(1);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(1300),

        Animated.spring(rewardScale, {
          toValue: 1.06,
          damping: 10,
          stiffness: 180,
          mass: 0.6,
          useNativeDriver: true,
        }),

        Animated.spring(rewardScale, {
          toValue: 1,
          damping: 12,
          stiffness: 160,
          mass: 0.7,
          useNativeDriver: true,
        }),

        Animated.delay(1800),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [
    available,
    claimed,
    rewardScale,
  ]);

  /*
   * -----------------------------------------
   * ARROW MOTION
   * -----------------------------------------
   */
  useEffect(() => {
    if (!available || claimed) {
      arrowTranslateX.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(1200),

        Animated.timing(arrowTranslateX, {
          toValue: 3,
          duration: 350,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),

        Animated.timing(arrowTranslateX, {
          toValue: 0,
          duration: 350,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),

        Animated.delay(1600),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [
    available,
    claimed,
    arrowTranslateX,
  ]);

  const rotate = iconRotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-6deg", "0deg", "6deg"],
  });

  const getStatus = () => {
    if (claimed) {
      return "Collected";
    }

    if (available) {
      return `+${rewardAmount}`;
    }

    return "Coming soon";
  };

  const getStatusLabel = () => {
    if (claimed) {
      return "Tomorrow";
    }

    if (available) {
      return "Claim now";
    }

    return "Daily reward";
  };

  return (
    <TouchableOpacity
      style={[
        styles.dailyCard, { backgroundColor: surfaceColor, borderColor },
        claimed && styles.dailyCardDisabled,
        !available &&
          !claimed &&
          styles.dailyCardDisabled,
      ]}
      onPress={onPress}
      disabled={!available || claimed}
      activeOpacity={0.8}
    >
      <Animated.View
        style={{
          opacity: cardOpacity,
          transform: [
            {
              translateY: cardTranslateY,
            },
          ],
        }}
      >
        <View style={styles.dailyInner}>
          {/* ICON */}

          <Animated.View
            style={[
              styles.dailyIcon,
              available &&
                !claimed &&
                styles.dailyIconActive,
              {
                transform: [
                  {
                    scale: iconScale,
                  },
                  {
                    rotate,
                  },
                ],
              },
            ]}
          >
            <Ionicons
              name={
                claimed
                  ? "checkmark"
                  : "gift"
              }
              size={18}
              color={colors.primary || "#34345C"}
            />
          </Animated.View>

          {/* CONTENT */}

          <View style={[styles.dailyContent, { backgroundColor: surfaceColor, borderColor }]}>
            <View style={[styles.dailyTitleRow, { backgroundColor: surfaceColor, borderColor }]}>
              <Text style={[styles.dailyTitle, { color: textColor }]}>
                Daily bonus
              </Text>

              {streak > 0 ? (
                <View
                  style={[styles.streakPill, { backgroundColor: surfaceColor, borderColor }]}
                >
                  <Ionicons
                    name="flame-outline"
                    size={10}
                    color={colors.accent || "#E76F51"}
                  />

                  <Text
                    style={[styles.streakText, { color: secondaryTextColor }]}
                  >
                    {streak} day
                    {streak === 1
                      ? ""
                      : "s"}
                  </Text>
                </View>
              ) : null}
            </View>

            <Text style={[styles.dailyText, { color: secondaryTextColor }]}>
              {claimed
                ? "You've collected today's bonus."
                : available
                  ? "Your daily Coins are ready."
                  : "Come back every day for extra Coins."}
            </Text>
          </View>

          {/* ACTION */}

          <View style={styles.dailyActionArea}>
            <Animated.View
              style={[
                styles.dailyReward,
                {
                  transform: [
                    {
                      scale: rewardScale,
                    },
                  ],
                },
              ]}
            >
              <Text
                style={[
                  styles.dailyAction,
                  claimed &&
                    styles.dailyActionClaimed,
                ]}
              >
                {getStatus()}
              </Text>

              <Text
                style={[styles.dailyActionLabel, { color: secondaryTextColor }]}
              >
                {getStatusLabel()}
              </Text>
            </Animated.View>

            {available && !claimed ? (
              <Animated.View
                style={{
                  transform: [
                    {
                      translateX:
                        arrowTranslateX,
                    },
                  ],
                }}
              >
                <Ionicons
                  name="arrow-forward"
                  size={15}
                  color={colors.accent || "#E76F51"}
                />
              </Animated.View>
            ) : null}
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default DailyBonusCard;
