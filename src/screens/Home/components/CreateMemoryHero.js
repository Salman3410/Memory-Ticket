
import { useEffect } from "react";

import { View, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import TactileButton from "../../../components/common/TactileButton";

import styles from "../homeStyles";

const AnimatedView = Animated.createAnimatedComponent(View);

function CreateMemoryHero({ navigation }) {
  const iconFloat = useSharedValue(0);
  const iconScale = useSharedValue(1);

  const circleLargeX = useSharedValue(0);
  const circleLargeY = useSharedValue(0);

  const circleSmallX = useSharedValue(0);
  const circleSmallY = useSharedValue(0);

  useEffect(() => {
    // Floating camera icon
    iconFloat.value = withRepeat(
      withSequence(
        withTiming(-4, {
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(4, {
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      true,
    );

    // Gentle camera scale animation
    iconScale.value = withRepeat(
      withSequence(
        withTiming(1.04, {
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(1, {
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      true,
    );

    // Large decorative circle
    circleLargeX.value = withRepeat(
      withSequence(
        withTiming(8, {
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(-5, {
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      true,
    );

    circleLargeY.value = withRepeat(
      withSequence(
        withTiming(-6, {
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(5, {
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      true,
    );

    // Small decorative circle
    circleSmallX.value = withRepeat(
      withSequence(
        withTiming(-7, {
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(6, {
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      true,
    );

    circleSmallY.value = withRepeat(
      withSequence(
        withTiming(5, {
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(-5, {
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      true,
    );
  }, [
    iconFloat,
    iconScale,
    circleLargeX,
    circleLargeY,
    circleSmallX,
    circleSmallY,
  ]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: iconFloat.value },
      { scale: iconScale.value },
    ],
  }));

  const largeCircleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: circleLargeX.value },
      { translateY: circleLargeY.value },
    ],
  }));

  const smallCircleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: circleSmallX.value },
      { translateY: circleSmallY.value },
    ],
  }));

  const handlePress = () => {
    navigation.navigate("Create");
  };

  return (
    <View style={styles.heroCard}>
      <View style={styles.heroContent}>
        {/* ANIMATED CAMERA ICON */}

        <AnimatedView
          style={[
            styles.heroIcon,
            iconAnimatedStyle,
          ]}
        >
          <Ionicons
            name="camera-outline"
            size={25}
            color="#FFFFFF"
          />
        </AnimatedView>

        {/* TITLE */}

        <Text style={styles.heroTitle}>
          Capture a new memory
        </Text>

        {/* DESCRIPTION */}

        <Text style={styles.heroDescription}>
          Turn a moment from your life into a
          ticket you'll want to keep.
        </Text>

        {/* REUSABLE TACTILE BUTTON */}

        <TactileButton
          label="CREATE MEMORY"
          icon="arrow-forward"
          iconPosition="right"
          onPress={handlePress}
          color="#E76F51"
          textColor="#FFFFFF"
          iconColor="#FFFFFF"
          height={50}
          borderRadius={14}
          depth={4}
          accessibilityLabel="Create a new memory"
          style={{
            marginTop: 12,
          }}
          textStyle={styles.heroButtonText}
        />
      </View>

      {/* ANIMATED DECORATION */}

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
