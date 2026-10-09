import { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./collectionStatsStyles";

function CollectionStats({ memoryCount, favoriteCount, theme, isDark }) {
  const colors = theme?.colors || {};
  const surfaceColor =
    colors.surface || colors.card || (isDark ? "#232333" : "#FFFFFF");
  const textColor = colors.text || (isDark ? "#F1F0F6" : "#242424");
  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#737387");
  const primaryColor = colors.primary || "#34345C";
  const accentColor = colors.accent || "#E76F51";
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(12)).current;
  const circleOneX = useRef(new Animated.Value(0)).current;
  const circleOneY = useRef(new Animated.Value(0)).current;
  const circleTwoX = useRef(new Animated.Value(0)).current;
  const circleTwoY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const entranceAnimation = Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),

      Animated.spring(cardTranslateY, {
        toValue: 0,
        tension: 70,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    entranceAnimation.start();

    return () => {
      entranceAnimation.stop();
      cardOpacity.stopAnimation();
      cardTranslateY.stopAnimation();
    };
  }, [cardOpacity, cardTranslateY]);

  useEffect(() => {
    const circleOneAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(circleOneX, {
            toValue: 10,
            duration: 1600,
            useNativeDriver: true,
          }),
          Animated.timing(circleOneX, {
            toValue: -4,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(circleOneX, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),

        Animated.sequence([
          Animated.timing(circleOneY, {
            toValue: -6,
            duration: 1600,
            useNativeDriver: true,
          }),
          Animated.timing(circleOneY, {
            toValue: 5,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(circleOneY, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    const circleTwoAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(circleTwoX, {
            toValue: -8,
            duration: 1700,
            useNativeDriver: true,
          }),
          Animated.timing(circleTwoX, {
            toValue: 5,
            duration: 1300,
            useNativeDriver: true,
          }),
          Animated.timing(circleTwoX, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),

        Animated.sequence([
          Animated.timing(circleTwoY, {
            toValue: 6,
            duration: 1700,
            useNativeDriver: true,
          }),
          Animated.timing(circleTwoY, {
            toValue: -4,
            duration: 1300,
            useNativeDriver: true,
          }),
          Animated.timing(circleTwoY, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    circleOneAnimation.start();
    circleTwoAnimation.start();

    return () => {
      circleOneAnimation.stop();
      circleTwoAnimation.stop();
      circleOneX.stopAnimation();
      circleOneY.stopAnimation();
      circleTwoX.stopAnimation();
      circleTwoY.stopAnimation();
    };
  }, [circleOneX, circleOneY, circleTwoX, circleTwoY]);

  return (
    <Animated.View
      style={[
        styles.collectionCard,

        isDark && {
          backgroundColor: surfaceColor,
          borderColor: colors.border || "#38384C",
        },

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
      {/* COLLECTION ICON */}

      <View
        style={[
          styles.collectionIcon,
          isDark && {
            backgroundColor: primaryColor,
          },
        ]}
      >
        <Ionicons name="ticket-outline" size={25} color="#FFFFFF" />
      </View>

      {/* MEMORY COUNT */}

      <View style={styles.collectionInfo}>
        <Text
          style={[
            styles.collectionNumber,
            isDark && {
              color: textColor,
            },
          ]}
        >
          {memoryCount}
        </Text>

        <Text
          style={[
            styles.collectionLabel,
            isDark && {
              color: mutedTextColor,
            },
          ]}
        >
          MEMORY TICKETS
        </Text>
      </View>

      {/* FAVORITES */}

      <View
        style={[
          styles.favoriteStat,
          isDark && {
            backgroundColor: colors.background || "#171724",
          },
        ]}
      >
        <Ionicons name="heart" size={16} color={accentColor} />

        <Text
          style={[
            styles.favoriteStatNumber,
            isDark && {
              color: textColor,
            },
          ]}
        >
          {favoriteCount}
        </Text>
      </View>

      {/* ANIMATED DECORATIONS */}

      <View
        style={[
          styles.collectionDecor,
          isDark && {
            opacity: 0.65,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.decorCircleOne,
            isDark && {
              backgroundColor: "rgba(166, 166, 184, 0.12)",
            },
            {
              transform: [
                {
                  translateX: circleOneX,
                },
                {
                  translateY: circleOneY,
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.decorCircleTwo,
            isDark && {
              backgroundColor: "rgba(231, 111, 81, 0.12)",
            },
            {
              transform: [
                {
                  translateX: circleTwoX,
                },
                {
                  translateY: circleTwoY,
                },
              ],
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

export default CollectionStats;
