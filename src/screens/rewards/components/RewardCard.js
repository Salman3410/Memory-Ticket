import { useRef } from "react";
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

function getRewardMeta(category) {
  switch (category) {
    case "STICKER":
      return {
        icon: "color-palette-outline",
        label: "Sticker",
      };

    case "TEMPLATE":
      return {
        icon: "albums-outline",
        label: "Template",
      };

    case "EXPORT":
      return {
        icon: "download-outline",
        label: "Export",
      };

    case "THEME":
      return {
        icon: "color-wand-outline",
        label: "Theme",
      };

    case "FRAME":
      return {
        icon: "scan-outline",
        label: "Frame",
      };

    case "STAMP":
      return {
        icon: "bookmark-outline",
        label: "Stamp",
      };

    case "STORAGE":
      return {
        icon: "cloud-outline",
        label: "Storage",
      };

    case "PREMIUM":
      return {
        icon: "diamond-outline",
        label: "Premium",
      };

    default:
      return {
        icon: "gift-outline",
        label: "Reward",
      };
  }
}

function RewardCard({
  reward,
  coins = 0,
  redeemLoading = false,
  redeemingRewardId = null,
  onRedeem,
}) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};
  const screenBackground = colors.background || (isDark ? "#171624" : "#F1F0F6");
  const surfaceColor = colors.surface || (isDark ? "#211F30" : "#FFFFFF");
  const textColor = colors.text || (isDark ? "#F7F5FC" : "#242424");
  const secondaryTextColor = colors.textSecondary || colors.textMuted || (isDark ? "#C4C0D0" : "#707080");
  const borderColor = colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const buttonScale = useRef(
    new Animated.Value(1)
  ).current;

  const iconScale = useRef(
    new Animated.Value(1)
  ).current;

  const iconRotate = useRef(
    new Animated.Value(0)
  ).current;

  if (!reward) {
    return null;
  }

  const rewardId =
    reward?._id || reward?.id;

  const cost = Math.max(
    0,
    Number(reward?.cost || 1)
  );

  const owned = reward?.owned === true;

  const active =
    reward?.active !== false;

  const affordable = coins >= cost;

  // ONLY the selected reward gets the spinner.
  const isRedeeming =
    redeemLoading &&
    redeemingRewardId === rewardId;

  const anotherRewardIsRedeeming =
    redeemLoading &&
    redeemingRewardId !== null &&
    redeemingRewardId !== rewardId;

  const remainingCoins = Math.max(
    cost - coins,
    0
  );

  const meta = getRewardMeta(
    reward?.category
  );

  const handlePressIn = () => {
    if (
      owned ||
      !active ||
      !affordable ||
      redeemLoading
    ) {
      return;
    }

    Animated.parallel([
      Animated.spring(buttonScale, {
        toValue: 0.93,
        friction: 6,
        tension: 150,
        useNativeDriver: true,
      }),

      Animated.timing(iconScale, {
        toValue: 0.94,
        duration: 120,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(iconRotate, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),

      Animated.spring(iconScale, {
        toValue: 1,
        friction: 5,
        tension: 110,
        useNativeDriver: true,
      }),

      Animated.timing(iconRotate, {
        toValue: 0,
        duration: 160,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRedeem = () => {
    if (
      owned ||
      !active ||
      !affordable ||
      redeemLoading ||
      !onRedeem
    ) {
      return;
    }

    onRedeem(reward);
  };

  const rotate =
    iconRotate.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "-5deg"],
    });

  return (
    <View
      style={[
        styles.rewardCard, { backgroundColor: surfaceColor, borderColor },

        owned &&
          styles.rewardCardOwned,

        !active &&
          styles.rewardCardInactive,
      ]}
    >
      {/* -----------------------------------------
          TOP
      ----------------------------------------- */}

      <View style={styles.rewardCardTop}>
        <Animated.View
          style={[
            styles.rewardIcon,

            owned &&
              styles.rewardIconOwned,

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
              owned
                ? "checkmark"
                : meta.icon
            }
            size={20}
            color={colors.primary || "#34345C"}
          />
        </Animated.View>

        <View
          style={[
            styles.categoryPill,

            owned &&
              styles.categoryPillOwned,
          ]}
        >
          <Text
            style={[
              styles.categoryText,

              owned &&
                styles.categoryTextOwned,
            ]}
          >
            {owned
              ? "Owned"
              : meta.label}
          </Text>
        </View>
      </View>

      {/* -----------------------------------------
          CONTENT
      ----------------------------------------- */}

      <View style={[styles.rewardContent, { backgroundColor: surfaceColor, borderColor }]}>
        <Text
          style={[styles.rewardName, { color: textColor }]}
          numberOfLines={1}
        >
          {reward?.name ||
            "Memento Reward"}
        </Text>

        <Text
          style={[styles.rewardDescription, { color: secondaryTextColor }]}
          numberOfLines={2}
        >
          {reward?.description ||
            "A special Memento extra."}
        </Text>
      </View>

      {/* -----------------------------------------
          FOOTER
      ----------------------------------------- */}

      <View style={styles.rewardBottom}>
        <View style={styles.costBlock}>
          {owned ? (
            <>
              <View style={[styles.ownedRow, { backgroundColor: surfaceColor, borderColor }]}>
                <Ionicons
                  name="checkmark-circle"
                  size={15}
                  color={colors.primary || "#34345C"}
                />

                <Text
                  style={[styles.ownedText, { color: secondaryTextColor }]}
                >
                  Owned
                </Text>
              </View>

              <Text
                style={[styles.lifetimeLabel, { color: secondaryTextColor }]}
              >
                Lifetime access
              </Text>
            </>
          ) : (
            <>
              <View style={[styles.costRow, { backgroundColor: surfaceColor, borderColor }]}>
                <Ionicons
                  name="ellipse"
                  size={9}
                  color={colors.accent || "#E76F51"}
                />

                <Text
                  style={[styles.costValue, { color: textColor }]}
                >
                  {cost}
                </Text>
              </View>

              <Text
                style={[styles.costLabel, { color: secondaryTextColor }]}
              >
                Coins
              </Text>
            </>
          )}
        </View>

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
              styles.getButton,

              owned &&
                styles.getButtonOwned,

              !owned &&
                (!affordable ||
                  !active ||
                  anotherRewardIsRedeeming) &&
                styles.getButtonDisabled,

              isRedeeming &&
                styles.getButtonLoading,
            ]}
            onPress={handleRedeem}
            onPressIn={
              !owned &&
              !redeemLoading &&
              active &&
              affordable
                ? handlePressIn
                : undefined
            }
            onPressOut={
              !owned &&
              !redeemLoading &&
              active &&
              affordable
                ? handlePressOut
                : undefined
            }
            disabled={
              owned ||
              !affordable ||
              !active ||
              redeemLoading
            }
            activeOpacity={1}
          >
            {isRedeeming ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : owned ? (
              <Ionicons
                name="checkmark"
                size={17}
                color={colors.primary || "#34345C"}
              />
            ) : (
              <>
                <Text
                  style={[
                    styles.getButtonText,

                    (!affordable ||
                      !active ||
                      anotherRewardIsRedeeming) &&
                      styles.getButtonTextDisabled,
                  ]}
                >
                  {!active
                    ? "Unavailable"
                    : affordable
                      ? "Get"
                      : "Need more"}
                </Text>

                {affordable &&
                active &&
                !anotherRewardIsRedeeming ? (
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color="#FFFFFF"
                  />
                ) : null}
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* -----------------------------------------
          STATUS
      ----------------------------------------- */}

      {owned ? (
        <View
          style={[styles.rewardStatusRow, { backgroundColor: surfaceColor, borderColor }]}
        >
          <Ionicons
            name="infinite-outline"
            size={13}
            color={colors.primary || "#34345C"}
          />

          <Text
            style={[styles.rewardStatusText, { color: secondaryTextColor }]}
          >
            Yours forever
          </Text>
        </View>
      ) : active && affordable ? (
        <View
          style={[styles.rewardStatusRow, { backgroundColor: surfaceColor, borderColor }]}
        >
          <Ionicons
            name="checkmark-circle"
            size={13}
            color={colors.primary || "#34345C"}
          />

          <Text
            style={[styles.rewardStatusText, { color: secondaryTextColor }]}
          >
            Ready to redeem
          </Text>
        </View>
      ) : active ? (
        <View
          style={[styles.rewardShortageRow, { backgroundColor: surfaceColor, borderColor }]}
        >
          <Ionicons
            name="information-circle-outline"
            size={13}
            color="#8F8EA0"
          />

          <Text
            style={[styles.rewardShortageText, { color: secondaryTextColor }]}
          >
            {remainingCoins} more Coins needed
          </Text>
        </View>
      ) : (
        <View
          style={[styles.rewardShortageRow, { backgroundColor: surfaceColor, borderColor }]}
        >
          <Ionicons
            name="time-outline"
            size={13}
            color="#8F8EA0"
          />

          <Text
            style={[styles.rewardShortageText, { color: secondaryTextColor }]}
          >
            Currently unavailable
          </Text>
        </View>
      )}
    </View>
  );
}

export default RewardCard;
