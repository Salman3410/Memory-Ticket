import {
  Children,
  cloneElement,
  useMemo,
  useRef,
  useState,
} from "react";
import { PanResponder, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const MAX_PULL = 120;
const REFRESH_THRESHOLD = 78;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function MementoRefresh({ children, onRefresh, label = "Refreshing..." }) {
  const scrollOffsetRef = useRef(0);
  const refreshingRef = useRef(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const pull = useSharedValue(0);
  const iconRotation = useSharedValue(0);

  const child = Children.only(children);

  const handleScroll = (event) => {
    scrollOffsetRef.current = event.nativeEvent.contentOffset?.y || 0;

    if (child.props.onScroll) {
      child.props.onScroll(event);
    }
  };

  const startRefresh = async () => {
    if (refreshingRef.current) {
      return;
    }

    refreshingRef.current = true;
    setIsRefreshing(true);

    pull.value = withSpring(58, {
      damping: 18,
      stiffness: 180,
      mass: 0.8,
    });

    iconRotation.value = withRepeat(
      withTiming(360, {
        duration: 850,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    try {
      await onRefresh();
    } catch (error) {
      console.warn("Memento refresh failed:", error);
    } finally {
      cancelAnimation(iconRotation);

      iconRotation.value = withTiming(0, {
        duration: 220,
      });

      pull.value = withSpring(0, {
        damping: 20,
        stiffness: 190,
        mass: 0.7,
      });

      setIsRefreshing(false);
      refreshingRef.current = false;
    }
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_, gestureState) => {
          if (refreshingRef.current) {
            return false;
          }

          const isAtTop = scrollOffsetRef.current <= 0;

          const pullingDown = gestureState.dy > 6;

          const mostlyVertical =
            Math.abs(gestureState.dy) > Math.abs(gestureState.dx);

          return isAtTop && pullingDown && mostlyVertical;
        },

        onPanResponderMove: (_, gestureState) => {
          if (refreshingRef.current) {
            return;
          }

          const distance = clamp(gestureState.dy * 0.72, 0, MAX_PULL);

          pull.value = distance;
        },

        onPanResponderRelease: (_, gestureState) => {
          if (refreshingRef.current) {
            return;
          }

          const distance = clamp(gestureState.dy * 0.72, 0, MAX_PULL);

          if (distance >= REFRESH_THRESHOLD) {
            startRefresh();
            return;
          }

          pull.value = withSpring(0, {
            damping: 20,
            stiffness: 200,
            mass: 0.7,
          });
        },

        onPanResponderTerminate: () => {
          if (refreshingRef.current) {
            return;
          }

          pull.value = withSpring(0, {
            damping: 20,
            stiffness: 200,
            mass: 0.7,
          });
        },
      }),
    [onRefresh],
  );

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: pull.value,
      },
    ],
  }));

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      pull.value,
      [0, 12, REFRESH_THRESHOLD],
      [0, 0.5, 1],
      "clamp",
    );

    const scale = interpolate(
      pull.value,
      [0, REFRESH_THRESHOLD],
      [0.72, 1],
      "clamp",
    );

    const translateY = interpolate(
      pull.value,
      [0, REFRESH_THRESHOLD],
      [-8, 2],
      "clamp",
    );

    return {
      opacity: isRefreshing ? 1 : opacity,
      transform: [
        {
          translateY: isRefreshing ? 0 : translateY,
        },
        {
          scale: isRefreshing ? 1 : scale,
        },
      ],
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    const pullRotation = interpolate(
      pull.value,
      [0, REFRESH_THRESHOLD],
      [0, 140],
      "clamp",
    );

    return {
      transform: [
        {
          rotate: isRefreshing
            ? `${iconRotation.value}deg`
            : `${pullRotation}deg`,
        },
      ],
    };
  });

  const animatedDotStyle = useAnimatedStyle(() => ({
    opacity: isRefreshing
      ? withRepeat(
          withTiming(0.25, {
            duration: 500,
          }),
          -1,
          true,
        )
      : 0,
    transform: [
      {
        scale: isRefreshing
          ? withRepeat(
              withTiming(1.25, {
                duration: 500,
              }),
              -1,
              true,
            )
          : 1,
      },
    ],
  }));

  const enhancedChild = cloneElement(child, {
    onScroll: handleScroll,
    scrollEventThrottle: 16,
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Animated.View style={[styles.content, animatedContentStyle]}>
        {enhancedChild}
      </Animated.View>

      <View pointerEvents="none" style={styles.indicatorContainer}>
        <Animated.View style={[styles.indicator, animatedIndicatorStyle]}>
          <Animated.View style={[styles.ticketIcon, animatedIconStyle]}>
            <Ionicons name="ticket-outline" size={21} color="#34345C" />
          </Animated.View>

          <Animated.View style={[styles.coralDot, animatedDotStyle]} />

          {isRefreshing && <Text style={styles.refreshText}>{label}</Text>}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  content: {
    flex: 1,
  },

  indicatorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },

  indicator: {
    alignItems: "center",
    justifyContent: "center",
  },

  ticketIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",

    shadowColor: "#34345C",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  coralDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E76F51",
  },

  refreshText: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.4,
    color: "#34345C",
  },
});

export default MementoRefresh;
