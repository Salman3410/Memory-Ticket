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

import styles from "../rewardStyles";

function WatchAdCard({
  rewardAmount = 10,
  loading = false,
  onPress,
}) {
  const cardOpacity = useRef(
    new Animated.Value(0),
  ).current;

  const cardTranslateY = useRef(
    new Animated.Value(12),
  ).current;

  const iconScale = useRef(
    new Animated.Value(1),
  ).current;

  const iconTranslateY = useRef(
    new Animated.Value(0),
  ).current;

  const rewardScale = useRef(
    new Animated.Value(1),
  ).current;

  const arrowTranslateX = useRef(
    new Animated.Value(0),
  ).current;

  const buttonScale = useRef(
    new Animated.Value(1),
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
        duration: 450,
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
   * PLAY ICON FLOAT + PULSE
   * -----------------------------------------
   */
  useEffect(() => {
    const animation =
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(iconTranslateY, {
              toValue: -2,
              duration: 1200,
              easing: Easing.inOut(
                Easing.sin,
              ),
              useNativeDriver: true,
            }),

            Animated.timing(iconTranslateY, {
              toValue: 0,
              duration: 1200,
              easing: Easing.inOut(
                Easing.sin,
              ),
              useNativeDriver: true,
            }),
          ]),

          Animated.sequence([
            Animated.timing(iconScale, {
              toValue: 1.06,
              duration: 1200,
              easing: Easing.inOut(
                Easing.sin,
              ),
              useNativeDriver: true,
            }),

            Animated.timing(iconScale, {
              toValue: 1,
              duration: 1200,
              easing: Easing.inOut(
                Easing.sin,
              ),
              useNativeDriver: true,
            }),
          ]),
        ]),
      );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [
    iconScale,
    iconTranslateY,
  ]);

  /*
   * -----------------------------------------
   * REWARD PULSE
   * -----------------------------------------
   */
  useEffect(() => {
    const animation =
      Animated.loop(
        Animated.sequence([
          Animated.delay(900),

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
  }, [rewardScale]);

  /*
   * -----------------------------------------
   * ARROW MOTION
   * -----------------------------------------
   */
  useEffect(() => {
    const animation =
      Animated.loop(
        Animated.sequence([
          Animated.delay(700),

          Animated.timing(arrowTranslateX, {
            toValue: 3,
            duration: 450,
            easing: Easing.out(
              Easing.quad,
            ),
            useNativeDriver: true,
          }),

          Animated.timing(arrowTranslateX, {
            toValue: 0,
            duration: 450,
            easing: Easing.inOut(
              Easing.quad,
            ),
            useNativeDriver: true,
          }),

          Animated.delay(1400),
        ]),
      );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [arrowTranslateX]);

  /*
   * -----------------------------------------
   * BUTTON PRESS
   * -----------------------------------------
   */
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.94,
      damping: 12,
      stiffness: 250,
      mass: 0.5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      damping: 10,
      stiffness: 220,
      mass: 0.5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.earnCard,
        {
          opacity: cardOpacity,
          transform: [
            {
              translateY: cardTranslateY,
            },
          ],
        },
      ]}
    >
      {/* PLAY ICON */}

      <Animated.View
        style={[
          styles.earnIcon,
          {
            transform: [
              {
                scale: iconScale,
              },
              {
                translateY:
                  iconTranslateY,
              },
            ],
          },
        ]}
      >
        <Ionicons
          name="play"
          size={17}
          color="#FFFFFF"
        />
      </Animated.View>

      {/* TEXT */}

      <View style={styles.earnContent}>
        <Text style={styles.earnTitle}>
          Watch & earn
        </Text>

        <Text style={styles.earnText}>
          Watch a rewarded ad
        </Text>
      </View>

      {/* REWARD */}

      <Animated.View
        style={[
          styles.earnReward,
          {
            transform: [
              {
                scale: rewardScale,
              },
            ],
          },
        ]}
      >
        <Text style={styles.earnRewardText}>
          +{rewardAmount}
        </Text>

        <Text style={styles.earnRewardLabel}>
          Coins
        </Text>
      </Animated.View>

      {/* BUTTON */}

      <Animated.View
        style={{
          transform: [
            {
              scale: buttonScale,
            },
          ],
        }}
      >
        <TouchableOpacity
          style={[
            styles.watchButton,
            loading &&
              styles.disabledButton,
          ]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={loading}
          activeOpacity={1}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
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
                size={17}
                color="#FFFFFF"
              />
            </Animated.View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

export default WatchAdCard;
