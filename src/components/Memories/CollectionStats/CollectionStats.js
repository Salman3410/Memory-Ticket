import { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./collectionStatsStyles";

function CollectionStats({ memoryCount, favoriteCount }) {
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(12)).current;

  const circleOneX = useRef(new Animated.Value(0)).current;
  const circleOneY = useRef(new Animated.Value(0)).current;
  const circleTwoX = useRef(new Animated.Value(0)).current;
  const circleTwoY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
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
    ]).start();
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
      <View style={styles.collectionIcon}>
        <Ionicons name="ticket-outline" size={25} color="#FFFFFF" />
      </View>

      <View style={styles.collectionInfo}>
        <Text style={styles.collectionNumber}>{memoryCount}</Text>

        <Text style={styles.collectionLabel}>MEMORY TICKETS</Text>
      </View>

      <View style={styles.favoriteStat}>
        <Ionicons name="heart" size={16} color="#E76F51" />

        <Text style={styles.favoriteStatNumber}>{favoriteCount}</Text>
      </View>

      <View style={styles.collectionDecor}>
        <Animated.View
          style={[
            styles.decorCircleOne,
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
