import { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import styles from "../homeStyles";

const AnimatedView =
  Animated.createAnimatedComponent(View);

const AnimatedIonicons =
  Animated.createAnimatedComponent(Ionicons);

function CreateMemoryHero({ navigation }) {
  const iconFloat = useSharedValue(0);
  const iconScale = useSharedValue(1);

  const circleLargeX = useSharedValue(0);
  const circleLargeY = useSharedValue(0);

  const circleSmallX = useSharedValue(0);
  const circleSmallY = useSharedValue(0);

  const arrowX = useSharedValue(0);

  useEffect(() => {
    iconFloat.value = withRepeat(
      withSequence(
        withTiming(-4, {
          duration: 1400,
          easing: Easing.inOut(
            Easing.sin,
          ),
        }),
        withTiming(4, {
          duration: 1400,
          easing: Easing.inOut(
            Easing.sin,
          ),
        }),
      ),
      -1,
      true,
    );

    iconScale.value = withRepeat(
      withSequence(
        withTiming(1.04, {
          duration: 1600,
          easing: Easing.inOut(
            Easing.sin,
          ),
        }),
        withTiming(1, {
          duration: 1600,
          easing: Easing.inOut(
            Easing.sin,
          ),
        }),
      ),
      -1,
      true,
    );

    circleLargeX.value = withRepeat(
      withSequence(
        withTiming(8, {
          duration: 2800,
          easing: Easing.inOut(
            Easing.sin,
          ),
        }),
        withTiming(-5, {
          duration: 2800,
          easing: Easing.inOut(
            Easing.sin,
          ),
        }),
      ),
      -1,
      true,
    );

    circleLargeY.value = withRepeat(
      withSequence(
        withTiming(-6, {
          duration: 3200,
          easing: Easing.inOut(
            Easing.sin,
          ),
        }),
        withTiming(5, {
          duration: 3200,
          easing: Easing.inOut(
            Easing.sin,
          ),
        }),
      ),
      -1,
      true,
    );

    circleSmallX.value = withRepeat(
      withSequence(
        withTiming(-7, {
          duration: 2400,
          easing: Easing.inOut(
            Easing.sin,
          ),
        }),
        withTiming(6, {
          duration: 2400,
          easing: Easing.inOut(
            Easing.sin,
          ),
        }),
      ),
      -1,
      true,
    );

    circleSmallY.value = withRepeat(
      withSequence(
        withTiming(5, {
          duration: 2600,
          easing: Easing.inOut(
            Easing.sin,
          ),
        }),
        withTiming(-5, {
          duration: 2600,
          easing: Easing.inOut(
            Easing.sin,
          ),
        }),
      ),
      -1,
      true,
    );
  }, []);

  const iconAnimatedStyle =
    useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: iconFloat.value,
          },
          {
            scale: iconScale.value,
          },
        ],
      };
    });

  const largeCircleAnimatedStyle =
    useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX:
              circleLargeX.value,
          },
          {
            translateY:
              circleLargeY.value,
          },
        ],
      };
    });

  const smallCircleAnimatedStyle =
    useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX:
              circleSmallX.value,
          },
          {
            translateY:
              circleSmallY.value,
          },
        ],
      };
    });

  const arrowAnimatedStyle =
    useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: arrowX.value,
          },
        ],
      };
    });

  const handlePressIn = () => {
    arrowX.value = withSequence(
      withTiming(4, {
        duration: 100,
      }),
      withSpring(0, {
        damping: 12,
        stiffness: 220,
        mass: 0.4,
      }),
    );
  };

  const handlePress = () => {
    navigation.navigate("Create");
  };

  return (
    <View style={styles.heroCard}>
      <View style={styles.heroContent}>
        {/* Animated Icon */}
        <AnimatedView
          style={[
            styles.heroIcon,
            iconAnimatedStyle,
          ]}
        >
          <AnimatedIonicons
            name="camera-outline"
            size={25}
            color="#FFFFFF"
          />
        </AnimatedView>

        {/* Title */}
        <Text style={styles.heroTitle}>
          Capture a new memory
        </Text>

        {/* Description */}
        <Text style={styles.heroDescription}>
          Turn a moment from your life into a
          ticket you'll want to keep.
        </Text>

        {/* Button */}
        <TouchableOpacity
          style={styles.heroButton}
          onPress={handlePress}
          onPressIn={handlePressIn}
          activeOpacity={0.85}
        >
          <Text style={styles.heroButtonText}>
            CREATE MEMORY
          </Text>

          <AnimatedIonicons
            name="arrow-forward"
            size={18}
            color="#FFFFFF"
            style={arrowAnimatedStyle}
          />
        </TouchableOpacity>
      </View>

      {/* Animated Decoration */}
      <View
        style={styles.heroDecoration}
        pointerEvents="none"
      >
        <AnimatedView
          style={[
            styles.heroCircleLarge,
            largeCircleAnimatedStyle,
          ]}
        />

        <AnimatedView
          style={[
            styles.heroCircleSmall,
            smallCircleAnimatedStyle,
          ]}
        />
      </View>
    </View>
  );
}

export default CreateMemoryHero;
