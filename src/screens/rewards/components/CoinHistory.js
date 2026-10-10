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
import { useTheme } from "../../../context/ThemeContext";

function HistoryRow({
  transaction,
  index,
  isLast,
}) {
  const opacity = useRef(
    new Animated.Value(0),
  ).current;

  const translateX = useRef(
    new Animated.Value(10),
  ).current;

  const iconScale = useRef(
    new Animated.Value(0.85),
  ).current;

  const amountScale = useRef(
    new Animated.Value(0.9),
  ).current;

  useEffect(() => {
    const delay = index * 70;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay,
        easing: Easing.out(
          Easing.cubic,
        ),
        useNativeDriver: true,
      }),

      Animated.spring(translateX, {
        toValue: 0,
        delay,
        damping: 16,
        stiffness: 150,
        mass: 0.7,
        useNativeDriver: true,
      }),

      Animated.spring(iconScale, {
        toValue: 1,
        delay: delay + 50,
        damping: 12,
        stiffness: 180,
        mass: 0.6,
        useNativeDriver: true,
      }),

      Animated.spring(amountScale, {
        toValue: 1,
        delay: delay + 80,
        damping: 12,
        stiffness: 170,
        mass: 0.6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    amountScale,
    iconScale,
    index,
    opacity,
    translateX,
  ]);

  const isPositive =
    transaction.amount > 0;

  const getHistoryContent = () => {
    switch (transaction.type) {
      case "AD_REWARD":
        return {
          title: "Watched an ad",
          icon: "play",
        };

      case "DAILY_BONUS":
        return {
          title: "Daily bonus",
          icon: "gift",
        };

      case "REDEMPTION":
        return {
          title: "Reward redeemed",
          icon: "gift-outline",
        };

      case "REFUND":
        return {
          title: "Reward refunded",
          icon: "return-up-back-outline",
        };

      case "ADMIN_ADJUSTMENT":
        return {
          title: "Balance adjustment",
          icon: "options-outline",
        };

      default:
        return {
          title: "Coin activity",
          icon: "swap-vertical-outline",
        };
    }
  };

  const formatDate = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const now = new Date();

    const isToday =
      date.toDateString() ===
      now.toDateString();

    if (isToday) {
      return "Today";
    }

    const yesterday = new Date();
    yesterday.setDate(
      yesterday.getDate() - 1,
    );

    if (
      date.toDateString() ===
      yesterday.toDateString()
    ) {
      return "Yesterday";
    }

    return date.toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
      },
    );
  };

  const formatAmount = (amount) => {
    return isPositive
      ? `+${amount}`
      : `${amount}`;
  };

  const content =
    getHistoryContent();

  const dateLabel = formatDate(
    transaction.createdAt,
  );

  return (
    <Animated.View
      style={[
        styles.activityAnimatedRow,
        {
          opacity,
          transform: [
            {
              translateX,
            },
          ],
        },
      ]}
    >
      <View
        style={styles.activityTimeline}
      >
        <Animated.View
          style={[
            styles.activityIcon,
            isPositive
              ? styles.activityIconPositive
              : styles.activityIconNegative,
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
            name={content.icon}
            size={15}
            color={
              isPositive
                ? "#34345C"
                : "#E76F51"
            }
          />
        </Animated.View>

        {!isLast ? (
          <View
            style={styles.activityConnector}
          />
        ) : null}
      </View>

      <View
        style={styles.activityInfo}
      >
        <Text
          style={[styles.activityTitle, { color: textColor }]}
          numberOfLines={1}
        >
          {content.title}
        </Text>

        <View
          style={styles.activityMeta}
        >
          {transaction.description ? (
            <Text
              style={[styles.activitySubtitle, { color: textColor }]}
              numberOfLines={1}
            >
              {transaction.description}
            </Text>
          ) : dateLabel ? (
            <Text
              style={[styles.activitySubtitle, { color: textColor }]}
            >
              {dateLabel}
            </Text>
          ) : null}
        </View>
      </View>

      <Animated.Text
        style={[
          styles.activityAmount,
          isPositive
            ? styles.activityPositive
            : styles.activityNegative,
          {
            transform: [
              {
                scale: amountScale,
              },
            ],
          },
        ]}
      >
        {formatAmount(
          transaction.amount,
        )}
      </Animated.Text>
    </Animated.View>
  );
}

function CoinHistory({
  history = [],
  loading = false,
  error = null,
  onRetry,
  limit = 4,
}) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};
  const screenBackground = colors.background || (isDark ? "#171624" : "#F1F0F6");
  const surfaceColor = colors.surface || (isDark ? "#211F30" : "#FFFFFF");
  const textColor = colors.text || (isDark ? "#F7F5FC" : "#242424");
  const secondaryTextColor = colors.textSecondary || colors.textMuted || (isDark ? "#C4C0D0" : "#707080");
  const borderColor = colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const recentHistory =
    Array.isArray(history)
      ? history.slice(0, limit)
      : [];

  return (
    <>
      <View
        style={styles.sectionHeader}
      >
        <View>
          <Text
            style={[styles.sectionTitle, { color: textColor }]}
          >
            Recent activity
          </Text>

          <Text
            style={[styles.sectionSubtitle, { color: textColor }]}
          >
            A look at your latest Coins.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="small"
            color={colors.primary || "#34345C"}
          />
        ) : null}
      </View>

      {error ? (
        <TouchableOpacity
          style={[styles.messageCard, { backgroundColor: surfaceColor, borderColor }]}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <View
            style={[styles.messageIcon, { backgroundColor: surfaceColor, borderColor }]}
          >
            <Ionicons
              name="refresh-outline"
              size={17}
              color={colors.accent || "#E76F51"}
            />
          </View>

          <Text
            style={[styles.messageText, { color: secondaryTextColor }]}
          >
            {error} Tap to retry.
          </Text>
        </TouchableOpacity>
      ) : recentHistory.length === 0 &&
        !loading ? (
        <View
          style={[styles.emptyActivity, { backgroundColor: surfaceColor, borderColor }]}
        >
          <View
            style={[styles.emptyActivityIcon, { backgroundColor: surfaceColor, borderColor }]}
          >
            <Ionicons
              name="time-outline"
              size={20}
              color={colors.primary || "#34345C"}
            />
          </View>

          <Text
            style={[styles.emptyActivityTitle, { color: textColor }]}
          >
            Your story starts here
          </Text>

          <Text
            style={[styles.emptyActivityText, { color: secondaryTextColor }]}
          >
            Earn or spend Coins and your
            activity will appear here.
          </Text>
        </View>
      ) : (
        <View
          style={styles.activityList}
        >
          {recentHistory.map(
            (
              transaction,
              index,
            ) => (
              <HistoryRow
                key={
                  transaction._id ||
                  transaction.referenceId ||
                  `${transaction.createdAt}-${index}`
                }
                transaction={
                  transaction
                }
                index={index}
                isLast={
                  index ===
                  recentHistory.length - 1
                }
              />
            ),
          )}
        </View>
      )}
    </>
  );
}

export default CoinHistory;
