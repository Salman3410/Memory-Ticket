
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { runOnJS } from "react-native-worklets";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NotificationContext = createContext(null);

const NOTIFICATION_TYPES = {
  success: {
    icon: "checkmark-circle",
    accent: "#E76F51",
  },
  error: {
    icon: "alert-circle",
    accent: "#FF8B87",
  },
  info: {
    icon: "sparkles",
    accent: "#F3B39F",
  },
  sync: {
    icon: "sync-circle",
    accent: "#83D8E6",
  },
};

export function AnimatedNotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const idRef = useRef(0);

  const showNotification = useCallback((config = {}) => {
    const title = String(config.title || "").trim();

    if (!title) {
      return null;
    }

    const type = NOTIFICATION_TYPES[config.type]
      ? config.type
      : "info";

    const preset = NOTIFICATION_TYPES[type];

    const nextNotification = {
      id: `${Date.now()}-${++idRef.current}`,
      title,
      message: String(config.message || ""),
      type,
      icon: config.icon || preset.icon,
      accent: config.accent || preset.accent,
      duration:
        config.duration === undefined
          ? 2800
          : config.duration,
      onPress:
        typeof config.onPress === "function"
          ? config.onPress
          : null,
    };

    // A new notification replaces the currently visible one.
    setNotification(nextNotification);

    return nextNotification.id;
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotification((current) => {
      if (!current) {
        return null;
      }

      // Prevent an old dismissal from clearing a newer notification.
      if (id && current.id !== id) {
        return current;
      }

      return null;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      showNotification,
      dismissNotification,
    }),
    [showNotification, dismissNotification],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      <View style={styles.provider}>
        {children}

        <AnimatedNotificationOverlay
          notification={notification}
          onDismiss={dismissNotification}
        />
      </View>
    </NotificationContext.Provider>
  );
}

export function useAnimatedNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useAnimatedNotification must be used inside AnimatedNotificationProvider."
    );
  }

  return context;
}

function AnimatedNotificationOverlay({
  notification,
  onDismiss,
}) {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const progress = useSharedValue(0);
  const closingRef = useRef(false);

  const cardWidth = Math.min(
    Math.max(screenWidth - 32, 240),
    420,
  );

  const requestDismiss = useCallback(() => {
    if (!notification || closingRef.current) {
      return;
    }

    closingRef.current = true;

    progress.value = withTiming(
      0,
      { duration: 220 },
      (finished) => {
        if (finished) {
          runOnJS(onDismiss)(notification.id);
        }
      },
    );
  }, [notification, onDismiss, progress]);

  useEffect(() => {
    if (!notification) {
      progress.value = 0;
      closingRef.current = false;
      return undefined;
    }

    closingRef.current = false;

    // Brief compact pill, followed by a spring expansion.
    progress.value = 0;

    progress.value = withSequence(
      withTiming(0.16, { duration: 90 }),
      withSpring(1, {
        damping: 18,
        stiffness: 190,
        mass: 0.85,
      }),
    );

    let timer = null;

    if (
      notification.duration !== null &&
      Number.isFinite(notification.duration) &&
      notification.duration > 0
    ) {
      timer = setTimeout(
        requestDismiss,
        notification.duration,
      );
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [
    notification?.id,
    notification?.duration,
    requestDismiss,
    progress,
  ]);

  const animatedCardStyle = useAnimatedStyle(() => {
    const value = progress.value;

    return {
      width: interpolate(
        value,
        [0, 1],
        [142, cardWidth],
        Extrapolation.CLAMP,
      ),
      height: interpolate(
        value,
        [0, 1],
        [42, 88],
        Extrapolation.CLAMP,
      ),
      opacity: interpolate(
        value,
        [0, 0.12, 1],
        [0.93, 1, 1],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            value,
            [0, 1],
            [-8, 0],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            value,
            [0, 1],
            [0.94, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const compactContentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, 0.18, 0.42, 1],
      [1, 1, 0, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const expandedContentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, 0.25, 0.65, 1],
      [0, 0, 1, 1],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [5, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const handleNotificationPress = useCallback(() => {
    if (!notification?.onPress) {
      return;
    }

    const action = notification.onPress;

    requestDismiss();
    action();
  }, [notification, requestDismiss]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-10, 10])
        .failOffsetX([-28, 28])
        .onEnd((event) => {
          if (
            event.translationY < -24 ||
            event.translationY > 34
          ) {
            runOnJS(requestDismiss)();
          }
        }),
    [requestDismiss],
  );

  if (!notification) {
    return null;
  }

  const preset =
    NOTIFICATION_TYPES[notification.type] ||
    NOTIFICATION_TYPES.info;

  const accent = notification.accent || preset.accent;
  const iconName = notification.icon || preset.icon;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.overlay,
        { paddingTop: insets.top + 8 },
      ]}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.glassCard,
            animatedCardStyle,
          ]}
        >
          {/* Native background blur */}
          <BlurView
            pointerEvents="none"
            intensity={45}
            tint="dark"
            experimentalBlurMethod={
              Platform.OS === "android"
                ? "dimezisBlurView"
                : "none"
            }
            style={StyleSheet.absoluteFillObject}
          />

          {/* Purple-tinted glass surface */}
          <View
            pointerEvents="none"
            style={styles.glassTint}
          />

          {/* Compact pill content */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.compactContent,
              compactContentStyle,
            ]}
          >
            <Ionicons
              name="sparkles"
              size={16}
              color="#F3B39F"
            />

            <Text style={styles.brandText}>
              MEMENTO
            </Text>

            <View
              style={[
                styles.statusDot,
                { backgroundColor: accent },
              ]}
            />
          </Animated.View>

          {/* Expanded glass notification */}
          <Animated.View
            style={[
              styles.expandedContent,
              expandedContentStyle,
            ]}
          >
            <Pressable
              disabled={!notification.onPress}
              onPress={handleNotificationPress}
              accessibilityRole={
                notification.onPress ? "button" : undefined
              }
              style={styles.messageBody}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor:
                      "rgba(231,111,81,0.20)",
                  },
                ]}
              >
                <Ionicons
                  name={iconName}
                  size={25}
                  color={accent}
                />
              </View>

              <View style={styles.messageColumn}>
                <Text
                  numberOfLines={1}
                  style={styles.notificationTitle}
                >
                  {notification.title}
                </Text>

                {notification.message ? (
                  <Text
                    numberOfLines={2}
                    style={styles.notificationMessage}
                  >
                    {notification.message}
                  </Text>
                ) : null}
              </View>
            </Pressable>

            <Pressable
              onPress={requestDismiss}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Dismiss notification"
              style={styles.closeButton}
            >
              <Ionicons
                name="close"
                size={17}
                color="#E8E6F3"
              />
            </Pressable>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  provider: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    zIndex: 9999,
    elevation: 20,
  },

  glassCard: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "rgba(52,52,92,0.82)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.24,
    shadowRadius: 20,
    elevation: 20,
  },

  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(38,37,67,0.48)",
  },

  compactContent: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  brandText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  expandedContent: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 11,
    paddingRight: 7,
  },

  messageBody: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  messageColumn: {
    flex: 1,
    minWidth: 0,
    paddingLeft: 10,
    paddingRight: 4,
  },

  notificationTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
  },

  notificationMessage: {
    color: "#E1DFEE",
    fontSize: 11,
    lineHeight: 14,
    marginTop: 3,
  },

  closeButton: {
    width: 27,
    height: 38,
    marginLeft: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
