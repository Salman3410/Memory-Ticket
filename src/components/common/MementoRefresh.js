import {
  Children,
  cloneElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
import { useTheme } from "../../context/ThemeContext";

const MAX_PULL = 120;
const REFRESH_THRESHOLD = 78;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getThemeColor(sources, keys, fallback) {
  for (const source of sources) {
    if (!source || typeof source !== "object") {
      continue;
    }

    for (const key of keys) {
      const value = source[key];

      if (
        typeof value === "string" &&
        value.length > 0
      ) {
        return value;
      }
    }
  }

  return fallback;
}

function MementoRefresh({
  children,
  onRefresh,
  label = "Refreshing...",
}) {
  const themeContext = useTheme() || {};
  const appTheme = themeContext.theme;
  const themeSources = [
    themeContext.colors,
    appTheme?.colors,
    appTheme,
  ];

  const isDark =
    typeof themeContext.isDark === "boolean"
      ? themeContext.isDark
      : typeof themeContext.isDarkMode === "boolean"
        ? themeContext.isDarkMode
        : themeContext.mode === "dark" ||
          appTheme === "dark" ||
          appTheme?.mode === "dark" ||
          appTheme?.isDark === true;

  const palette = {
    background: getThemeColor(
      themeSources,
      ["background", "backgroundColor", "appBackground"],
      isDark ? "#171724" : "#F1F0F6",
    ),

    surface: getThemeColor(
      themeSources,
      ["surface", "card", "cardBackground", "surfaceBackground"],
      isDark ? "#232333" : "#FFFFFF",
    ),

    primary: getThemeColor(
      themeSources,
      ["primary", "primaryColor"],
      "#34345C",
    ),

    text: getThemeColor(
      themeSources,
      ["text", "textPrimary"],
      isDark ? "#F1F0F6" : "#34345C",
    ),

    border: getThemeColor(
      themeSources,
      ["border", "borderColor", "outline"],
      isDark ? "#38384C" : "#D9D8E2",
    ),

    accent: getThemeColor(
      themeSources,
      ["accent", "accentColor", "secondary"],
      "#E76F51",
    ),

    shadow: isDark ? "#000000" : "#34345C",
  };

  const scrollOffsetRef = useRef(0);
  const refreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const pull = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  const refreshProgress = useSharedValue(0);
  const dotPulse = useSharedValue(0);
  const child = Children.only(children);
  onRefreshRef.current = onRefresh;
  const childOnScrollRef = useRef(child.props.onScroll);
  childOnScrollRef.current = child.props.onScroll;

  const handleScroll = useCallback((event) => {
    scrollOffsetRef.current =
      event.nativeEvent.contentOffset?.y || 0;

    childOnScrollRef.current?.(event);
  }, []);

  const startRefresh = useCallback(async () => {
    if (refreshingRef.current) {
      return;
    }

    refreshingRef.current = true;
    setIsRefreshing(true);

    refreshProgress.value = 1;

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

    dotPulse.value = withRepeat(
      withTiming(1, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );

    try {
      await onRefreshRef.current?.();
    } catch (error) {
      console.warn("Memento refresh failed:", error);
    } finally {
      cancelAnimation(iconRotation);
      cancelAnimation(dotPulse);

      iconRotation.value = withTiming(0, {
        duration: 220,
      });

      dotPulse.value = withTiming(0, {
        duration: 180,
      });

      refreshProgress.value = 0;

      pull.value = withSpring(0, {
        damping: 20,
        stiffness: 190,
        mass: 0.7,
      });

      setIsRefreshing(false);
      refreshingRef.current = false;
    }
  }, [
    pull,
    iconRotation,
    refreshProgress,
    dotPulse,
  ]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: (
          _,
          gestureState,
        ) => {
          if (refreshingRef.current) {
            return false;
          }

          const isAtTop =
            scrollOffsetRef.current <= 0;

          const pullingDown = gestureState.dy > 6;

          const mostlyVertical =
            Math.abs(gestureState.dy) >
            Math.abs(gestureState.dx);

          return (
            isAtTop &&
            pullingDown &&
            mostlyVertical
          );
        },

        onPanResponderMove: (_, gestureState) => {
          if (refreshingRef.current) {
            return;
          }

          pull.value = clamp(
            gestureState.dy * 0.72,
            0,
            MAX_PULL,
          );
        },

        onPanResponderRelease: (_, gestureState) => {
          if (refreshingRef.current) {
            return;
          }

          const distance = clamp(
            gestureState.dy * 0.72,
            0,
            MAX_PULL,
          );

          if (distance >= REFRESH_THRESHOLD) {
            void startRefresh();
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
    [pull, startRefresh],
  );

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: pull.value,
      },
    ],
  }));

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const pullOpacity = interpolate(
      pull.value,
      [0, 12, REFRESH_THRESHOLD],
      [0, 0.5, 1],
      "clamp",
    );

    const pullScale = interpolate(
      pull.value,
      [0, REFRESH_THRESHOLD],
      [0.72, 1],
      "clamp",
    );

    const pullTranslateY = interpolate(
      pull.value,
      [0, REFRESH_THRESHOLD],
      [-8, 2],
      "clamp",
    );

    const refreshing = refreshProgress.value > 0;

    return {
      opacity: refreshing ? 1 : pullOpacity,

      transform: [
        {
          translateY: refreshing
            ? 0
            : pullTranslateY,
        },
        {
          scale: refreshing
            ? 1
            : pullScale,
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

    const rotation =
      refreshProgress.value > 0
        ? iconRotation.value
        : pullRotation;

    return {
      transform: [
        {
          rotate: `${rotation}deg`,
        },
      ],
    };
  });

  const animatedDotStyle = useAnimatedStyle(() => ({
    opacity:
      refreshProgress.value > 0
        ? interpolate(
            dotPulse.value,
            [0, 1],
            [0.25, 0.85],
            "clamp",
          )
        : 0,

    transform: [
      {
        scale:
          refreshProgress.value > 0
            ? interpolate(
                dotPulse.value,
                [0, 1],
                [1, 1.25],
                "clamp",
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
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.background,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Animated.View
        style={[
          styles.content,
          animatedContentStyle,
        ]}
      >
        {enhancedChild}
      </Animated.View>

      <View
        pointerEvents="none"
        style={styles.indicatorContainer}
      >
        <Animated.View
          style={[
            styles.indicator,
            animatedIndicatorStyle,
          ]}
        >
          <Animated.View
            style={[
              styles.ticketIcon,
              {
                backgroundColor: palette.surface,
                borderColor: palette.border,
                shadowColor: palette.shadow,
              },
              animatedIconStyle,
            ]}
          >
            <Ionicons
              name="ticket-outline"
              size={21}
              color={palette.primary}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.coralDot,
              {
                backgroundColor: palette.accent,
              },
              animatedDotStyle,
            ]}
          />

          {isRefreshing && (
            <Text
              style={[
                styles.refreshText,
                {
                  color: palette.text,
                },
              ]}
            >
              {label}
            </Text>
          )}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderWidth: 1,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.1,
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
  },

  refreshText: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
});

export default MementoRefresh;