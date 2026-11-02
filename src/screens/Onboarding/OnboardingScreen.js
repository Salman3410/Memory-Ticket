import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const INK = "#171517";
const CREAM = "#FFF9EC";
const NAVY = "#34345C";
const LIGHT_PURPLE = "#D5BCFF";

const slides = [
  {
    background: "#F1F0F6",
    eyebrow: "MEMORY TICKETS",
    title: "Hold on to\nwhat mattered.",
    description:
      "Save more than a photo. Keep the place, the feeling, and the little details that made it yours.",
    // illustration: require("../../../assets/memento-memory-capsule.png"),
    illustrationLabel:
      "A favorite memory ticket protected inside a keepsake capsule",
    cta: "Start remembering",
  },
  {
    background: "#D5BCFF",
    eyebrow: "YOUR STORY, IN FULL",
    title: "One life.\nEvery chapter.",
    description:
      "Bring moments together as a story you can browse by date, place, collection, or feeling.",
    // illustration: require("../../../assets/memento-story-builder.png"),
    illustrationLabel:
      "A friendly star collecting colorful Memento memory tickets",
    cta: "Keep exploring",
  },
  {
    background: "#E76F51",
    eyebrow: "MADE TO LAST",
    title: "Meet your\nmemories again.",
    description:
      "Return to old favorites, rediscover forgotten details, and keep every meaningful moment close.",
    // illustration: require("../../../assets/memento-time-archive.png"),
    illustrationLabel:
      "A smiling memory ticket returning from the Memento archive",
    cta: "Create my first memory",
  },
  {
    background: NAVY,
    eyebrow: "YOUR PRIVATE SPACE",
    title: "Your story,\nready when\nyou are.",
    description:
      "Log in to keep every memory safe, synced, and ready to continue on any device.",
    // illustration: require("../../../assets/memento-login-portal.png"),
    illustrationLabel:
      "A smiling Memento ticket entering a secure archive portal with a key",
    isAuth: true,
  },
];

function OnboardingScreen({
  onComplete,
  onGetStarted,
  onLogin,
  onSkip,
}) {
  const { height, width } = useWindowDimensions();

  const [activeIndex, setActiveIndex] = useState(0);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(22)).current;
  const illustrationScale = useRef(new Animated.Value(0.92)).current;

  const isTransitioning = useRef(false);

  const isCompact = height < 720;

  const slide = slides[activeIndex];
  const isLast = activeIndex === slides.length - 1;
  const isDarkSlide = slide.isAuth === true;

  const foregroundColor = isDarkSlide ? CREAM : INK;
  const secondaryColor = isDarkSlide ? LIGHT_PURPLE : INK;

  const illustrationSize = useMemo(
    () =>
      Math.min(
        width - 48,
        height *
          (slide.isAuth
            ? isCompact
              ? 0.24
              : 0.3
            : isCompact
              ? 0.31
              : 0.37),
        slide.isAuth ? 285 : 350
      ),
    [height, isCompact, slide.isAuth, width]
  );

  useEffect(() => {
    const entrance = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 340,
        useNativeDriver: true,
      }),

      Animated.spring(translateX, {
        toValue: 0,
        damping: 18,
        stiffness: 135,
        mass: 0.8,
        useNativeDriver: true,
      }),

      Animated.spring(illustrationScale, {
        toValue: 1,
        damping: 13,
        stiffness: 125,
        mass: 0.8,
        useNativeDriver: true,
      }),
    ]);

    entrance.start(({ finished }) => {
      if (finished) {
        isTransitioning.current = false;
      }
    });

    return () => {
      entrance.stop();
    };
  }, [
    activeIndex,
    illustrationScale,
    opacity,
    translateX,
  ]);

  const goTo = (nextIndex) => {
    if (
      nextIndex < 0 ||
      nextIndex >= slides.length ||
      nextIndex === activeIndex ||
      isTransitioning.current
    ) {
      return;
    }

    isTransitioning.current = true;

    const direction = nextIndex > activeIndex ? 1 : -1;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),

      Animated.timing(translateX, {
        toValue: direction * -20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished) {
        isTransitioning.current = false;
        return;
      }

      opacity.setValue(0);

      translateX.setValue(
        nextIndex > activeIndex ? 22 : -22
      );

      illustrationScale.setValue(0.92);

      setActiveIndex(nextIndex);
    });
  };

  const handlePrimaryPress = () => {
    if (isTransitioning.current) {
      return;
    }

    if (isLast) {
      onComplete?.();
      return;
    }

    goTo(activeIndex + 1);
  };

  const handleSkip = () => {
    if (isTransitioning.current) {
      return;
    }

    if (onSkip) {
      onSkip();
      return;
    }

    onComplete?.();
  };

  const handleLogin = () => {
    if (isTransitioning.current) {
      return;
    }

    onLogin?.();
  };

  const handleGetStarted = () => {
    if (isTransitioning.current) {
      return;
    }

    if (onGetStarted) {
      onGetStarted();
      return;
    }

    onComplete?.();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: slide.background },
      ]}
    >
      <StatusBar
        barStyle={
          isDarkSlide ? "light-content" : "dark-content"
        }
        backgroundColor={slide.background}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View
          style={[
            styles.header,
            isCompact && styles.headerCompact,
          ]}
        >
          <View style={styles.brand}>
            <View
              style={[
                styles.brandMark,
                isDarkSlide && styles.brandMarkDark,
              ]}
            >
              <MaterialCommunityIcons
                name="ticket-confirmation-outline"
                size={17}
                color={isDarkSlide ? NAVY : CREAM}
              />
            </View>

            <Text
              style={[
                styles.brandText,
                { color: foregroundColor },
              ]}
            >
              MEMENTO
            </Text>
          </View>

          <Pressable
            accessibilityLabel="Skip onboarding"
            accessibilityRole="button"
            hitSlop={12}
            onPress={handleSkip}
            style={styles.skipButton}
          >
            <Text
              style={[
                styles.skipText,
                { color: foregroundColor },
              ]}
            >
              Skip
            </Text>
          </Pressable>
        </View>

        {/* MAIN SLIDE */}
        <Animated.View
          style={[
            styles.slide,
            {
              opacity,
              transform: [{ translateX }],
            },
          ]}
        >
          {/* TEXT CONTENT */}
          <View
            style={[
              styles.copy,
              isCompact && styles.copyCompact,
            ]}
          >
            <View
              style={[
                styles.eyebrowRow,
                { backgroundColor: foregroundColor },
              ]}
            >
              <Text
                style={[
                  styles.eyebrow,
                  {
                    color: isDarkSlide ? NAVY : CREAM,
                  },
                ]}
              >
                {slide.eyebrow}
              </Text>

              <View style={styles.eyebrowArrow}>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={15}
                  color={CREAM}
                />
              </View>
            </View>

            <Text
              numberOfLines={slide.isAuth ? 3 : 2}
              style={[
                styles.title,
                { color: foregroundColor },
                isCompact && styles.titleCompact,
              ]}
            >
              {slide.title}
            </Text>

            <Text
              numberOfLines={3}
              style={[
                styles.description,
                { color: secondaryColor },
                isCompact && styles.descriptionCompact,
              ]}
            >
              {slide.description}
            </Text>
          </View>

          {/* ILLUSTRATION */}
          <View style={styles.artworkStage}>
            <Animated.View
              style={{
                transform: [{ scale: illustrationScale }],
              }}
            >
              <Image
                accessibilityLabel={slide.illustrationLabel}
                resizeMode="contain"
                source={slide.illustration}
                style={{
                  width: illustrationSize,
                  height: illustrationSize,
                }}
              />
            </Animated.View>
          </View>
        </Animated.View>

        {/* FOOTER */}
        <View
          style={[
            styles.footer,
            slide.isAuth && styles.footerAuth,
            isCompact && styles.footerCompact,
          ]}
        >
          {/* PAGINATION */}
          <View
            accessibilityLabel={`Slide ${activeIndex + 1} of ${slides.length}`}
            style={styles.pagination}
          >
            {slides.map((item, index) => (
              <Pressable
                accessibilityLabel={`Show slide ${index + 1}: ${item.eyebrow}`}
                accessibilityRole="button"
                hitSlop={8}
                key={item.eyebrow}
                onPress={() => goTo(index)}
                style={[
                  styles.dot,
                  index === activeIndex
                    ? [
                        styles.dotActive,
                        {
                          backgroundColor: foregroundColor,
                        },
                      ]
                    : [
                        styles.dotInactive,
                        {
                          backgroundColor: foregroundColor,
                        },
                      ],
                ]}
              />
            ))}
          </View>

          {/* AUTHENTICATION SLIDE */}
          {slide.isAuth ? (
            <View style={styles.authActions}>
              {/* LOGIN */}
              <Pressable
                accessibilityLabel="Login"
                accessibilityRole="button"
                onPress={handleLogin}
                style={({ pressed }) => [
                  styles.authButton,
                  styles.loginButton,
                  pressed && styles.ctaPressed,
                ]}
              >
                <Text style={styles.loginButtonText}>
                  Login
                </Text>
              </Pressable>

              {/* GET STARTED */}
              <Pressable
                accessibilityLabel="Get Started"
                accessibilityRole="button"
                onPress={handleGetStarted}
                style={({ pressed }) => [
                  styles.authButton,
                  styles.getStartedButton,
                  pressed && styles.ctaPressed,
                ]}
              >
                <Text style={styles.ctaText}>
                  Get Started
                </Text>

                <View style={styles.authButtonIcon}>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={20}
                    color={NAVY}
                  />
                </View>
              </Pressable>
            </View>
          ) : (
            /* NORMAL SLIDE CTA */
            <Pressable
              accessibilityLabel={slide.cta}
              accessibilityRole="button"
              onPress={handlePrimaryPress}
              style={({ pressed }) => [
                styles.cta,
                pressed && styles.ctaPressed,
              ]}
            >
              <Text style={styles.ctaText}>
                {slide.cta}
              </Text>

              <View style={styles.ctaIcon}>
                <MaterialCommunityIcons
                  name={isLast ? "check" : "chevron-right"}
                  size={20}
                  color={INK}
                />
              </View>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 22,
  },

  header: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerCompact: {
    height: 54,
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  brandMark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: INK,
    alignItems: "center",
    justifyContent: "center",
  },

  brandMarkDark: {
    backgroundColor: CREAM,
  },

  brandText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    letterSpacing: 1.8,
  },

  skipButton: {
    minWidth: 48,
    minHeight: 44,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  skipText: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "700",
  },

  slide: {
    flex: 1,
  },

  copy: {
    paddingTop: 18,
  },

  copyCompact: {
    paddingTop: 7,
  },

  eyebrowRow: {
    alignSelf: "flex-start",
    height: 32,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 5,
    marginBottom: 15,
  },

  eyebrow: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },

  eyebrowArrow: {
    width: 23,
    height: 23,
    borderRadius: 12,
    marginLeft: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6547",
  },

  title: {
    maxWidth: 350,
    fontSize: 43,
    lineHeight: 46,
    fontWeight: "500",
    letterSpacing: -1.6,
  },

  titleCompact: {
    fontSize: 35,
    lineHeight: 38,
    letterSpacing: -1.2,
  },

  description: {
    maxWidth: 338,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    marginTop: 14,
  },

  descriptionCompact: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 9,
  },

  artworkStage: {
    flex: 1,
    minHeight: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  footer: {
    paddingTop: 2,
    paddingBottom: 12,
  },

  footerCompact: {
    paddingBottom: 7,
  },

  footerAuth: {
    paddingBottom: 7,
  },

  pagination: {
    height: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginBottom: 9,
  },

  dot: {
    height: 5,
    borderRadius: 3,
  },

  dotActive: {
    width: 18,
  },

  dotInactive: {
    width: 5,
    opacity: 0.24,
  },

  cta: {
    width: "100%",
    height: 58,
    borderRadius: 29,
    backgroundColor: INK,
    paddingLeft: 20,
    paddingRight: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ctaPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },

  ctaText: {
    color: CREAM,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "700",
  },

  ctaIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: CREAM,
    alignItems: "center",
    justifyContent: "center",
  },

  authActions: {
    gap: 8,
  },

  authButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  loginButton: {
    backgroundColor: CREAM,
  },

  loginButtonText: {
    color: NAVY,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
  },

  getStartedButton: {
    backgroundColor: INK,
    paddingLeft: 20,
    justifyContent: "space-between",
  },

  authButtonIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: CREAM,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default OnboardingScreen;
