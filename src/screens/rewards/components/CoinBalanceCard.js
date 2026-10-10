import {
  useEffect,
  useRef,
} from "react";
import {
  ActivityIndicator,
  Animated,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../rewardStyles";
import { useTheme } from "../../../context/ThemeContext";

function CoinBalanceCard({
  coins,
  loading,
  error,
  onRetry,
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
    new Animated.Value(12),
  ).current;

  const coinScale = useRef(
    new Animated.Value(1),
  ).current;

  const iconScale = useRef(
    new Animated.Value(1),
  ).current;

  const dividerScale = useRef(
    new Animated.Value(0),
  ).current;

  const errorOpacity = useRef(
    new Animated.Value(0),
  ).current;

  const previousCoins = useRef(coins);

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
        useNativeDriver: true,
      }),

      Animated.spring(cardTranslateY, {
        toValue: 0,
        damping: 16,
        stiffness: 130,
        mass: 0.8,
        useNativeDriver: true,
      }),

      Animated.timing(dividerScale, {
        toValue: 1,
        duration: 500,
        delay: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    cardOpacity,
    cardTranslateY,
    dividerScale,
  ]);

  /*
   * -----------------------------------------
   * COIN BALANCE CHANGE
   * -----------------------------------------
   *
   * When the balance changes, give the number
   * a very small pulse.
   */
  useEffect(() => {
    if (previousCoins.current === coins) {
      return;
    }

    previousCoins.current = coins;

    coinScale.setValue(1);

    Animated.sequence([
      Animated.spring(coinScale, {
        toValue: 1.07,
        damping: 10,
        stiffness: 220,
        mass: 0.5,
        useNativeDriver: true,
      }),

      Animated.spring(coinScale, {
        toValue: 1,
        damping: 12,
        stiffness: 180,
        mass: 0.6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [coins, coinScale]);

  /*
   * -----------------------------------------
   * ICON FLOAT
   * -----------------------------------------
   */
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 1.04,
          duration: 1200,
          useNativeDriver: true,
        }),

        Animated.timing(iconScale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [iconScale]);

  /*
   * -----------------------------------------
   * ERROR ANIMATION
   * -----------------------------------------
   */
  useEffect(() => {
    Animated.timing(errorOpacity, {
      toValue: error ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [error, errorOpacity]);

  return (
    <Animated.View
      style={[
        styles.balanceCard, { backgroundColor: surfaceColor, borderColor },
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
      <View style={[styles.balanceTopRow, { backgroundColor: surfaceColor, borderColor }]}>
        <View>
          <Text style={[styles.balanceLabel, { color: secondaryTextColor }]}>
            MEMENTO COINS
          </Text>

          {loading && coins === 0 ? (
            <ActivityIndicator
              size="small"
              color={colors.primary || "#34345C"}
              style={styles.balanceLoader}
            />
          ) : (
            <Animated.Text
              style={[
                styles.balanceValue,
                {
                  transform: [
                    {
                      scale: coinScale,
                    },
                  ],
                },
              ]}
            >
              {coins}
            </Animated.Text>
          )}
        </View>

        <Animated.View
          style={[
            styles.balanceIcon,
            {
              transform: [
                {
                  scale: iconScale,
                },
              ],
            },
          ]}
        >
          <Ionicons
            name="wallet-outline"
            size={20}
            color={colors.primary || "#34345C"}
          />
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.balanceDivider,
          {
            transform: [
              {
                scaleX: dividerScale,
              },
            ],
          },
        ]}
      />

      <View style={[styles.balanceBottomRow, { backgroundColor: surfaceColor, borderColor }]}>
        <Text style={[styles.balanceHint, { color: secondaryTextColor }]}>
          Earn Coins. Unlock little extras.
        </Text>

        <Ionicons
          name="arrow-forward"
          size={16}
          color="#8A8997"
        />
      </View>

      {error ? (
        <Animated.View
          style={{
            opacity: errorOpacity,
          }}
        >
          <TouchableOpacity
            onPress={onRetry}
            style={styles.inlineRetry}
            activeOpacity={0.8}
          >
            <Ionicons
              name="refresh-outline"
              size={15}
              color={colors.accent || "#E76F51"}
            />

            <Text
              style={[styles.inlineRetryText, { color: secondaryTextColor }]}
            >
              {error}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

export default CoinBalanceCard;
