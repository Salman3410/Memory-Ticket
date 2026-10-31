import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import TactileButton from "../../components/common/TactileButton";

const { width } = Dimensions.get("window");

const slides = [
  {
    eyebrow: "MEMORY TICKET",
    title: "Turn moments into keepsakes.",
    description:
      "Save the feeling behind the photo, not just the photo itself.",
    icon: "ticket-confirmation-outline",
    accent: "#E76F51",
    cardLabel: "A moment worth keeping",
  },
  {
    eyebrow: "YOUR STORY, IN FULL",
    title: "Keep the story with the snapshot.",
    description:
      "Add the place, the date, and the little details that make it yours.",
    icon: "map-marker-outline",
    accent: "#FF8E72",
    cardLabel: "Paris · 12 Oct 2024",
  },
  {
    eyebrow: "MADE TO LAST",
    title: "Your memories. Your ticket.",
    description:
      "Create a beautiful archive of the moments you never want to forget.",
    icon: "heart-outline",
    accent: "#9D8CFF",
    cardLabel: "Ready for your next memory",
  },
];

function OnboardingScreen({ onComplete }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};

  const screenBackground =
    colors.background || (isDark ? "#171624" : "#F1F0F6");

  const textColor = colors.text || (isDark ? "#F7F5FC" : "#242424");

  const secondaryTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#C4C0D0" : "#707080");

  const brandColor = isDark ? "#FFFDF7" : "#34345C";

  const [activeIndex, setActiveIndex] = useState(0);

  const slide = slides[activeIndex];
  const isLast = activeIndex === slides.length - 1;

  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentX = useRef(new Animated.Value(0)).current;

  const ticketScale = useRef(new Animated.Value(0.88)).current;
  const ticketY = useRef(new Animated.Value(35)).current;
  const ticketRotation = useRef(new Animated.Value(0)).current;

  const copyOpacity = useRef(new Animated.Value(0)).current;
  const copyY = useRef(new Animated.Value(25)).current;

  const dotOneY = useRef(new Animated.Value(0)).current;
  const dotTwoY = useRef(new Animated.Value(0)).current;

  const orbScale = useRef(new Animated.Value(1)).current;
  const orbOpacity = useRef(new Animated.Value(0.12)).current;

  const isTransitioning = useRef(false);

  // Decorative background animations.
  useEffect(() => {
    const dotOneAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(dotOneY, {
          toValue: -7,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(dotOneY, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    const dotTwoAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(dotTwoY, {
          toValue: 8,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(dotTwoY, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    );

    const orbAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(orbScale, {
            toValue: 1.12,
            duration: 2400,
            useNativeDriver: true,
          }),
          Animated.timing(orbScale, {
            toValue: 1,
            duration: 2400,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(orbOpacity, {
            toValue: 0.18,
            duration: 2400,
            useNativeDriver: true,
          }),
          Animated.timing(orbOpacity, {
            toValue: 0.12,
            duration: 2400,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    dotOneAnimation.start();
    dotTwoAnimation.start();
    orbAnimation.start();

    return () => {
      dotOneAnimation.stop();
      dotTwoAnimation.stop();
      orbAnimation.stop();
    };
  }, [dotOneY, dotTwoY, orbScale, orbOpacity]);

  // Animate the ticket and copy when the active slide changes.
  useEffect(() => {
    contentOpacity.setValue(0);
    contentX.setValue(28);

    ticketScale.setValue(0.88);
    ticketY.setValue(35);
    ticketRotation.setValue(0);

    copyOpacity.setValue(0);
    copyY.setValue(25);

    const entranceAnimation = Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 420,
        delay: 30,
        useNativeDriver: true,
      }),

      Animated.spring(contentX, {
        toValue: 0,
        damping: 18,
        stiffness: 130,
        mass: 0.8,
        useNativeDriver: true,
      }),

      Animated.spring(ticketScale, {
        toValue: 1,
        damping: 11,
        stiffness: 140,
        mass: 0.7,
        useNativeDriver: true,
      }),

      Animated.spring(ticketY, {
        toValue: 0,
        damping: 13,
        stiffness: 120,
        mass: 0.8,
        useNativeDriver: true,
      }),

      Animated.spring(ticketRotation, {
        toValue: 1,
        damping: 10,
        stiffness: 120,
        mass: 0.8,
        useNativeDriver: true,
      }),

      Animated.timing(copyOpacity, {
        toValue: 1,
        duration: 420,
        delay: 150,
        useNativeDriver: true,
      }),

      Animated.spring(copyY, {
        toValue: 0,
        damping: 16,
        stiffness: 120,
        mass: 0.7,
        delay: 100,
        useNativeDriver: true,
      }),
    ]);

    entranceAnimation.start(() => {
      isTransitioning.current = false;
    });

    return () => {
      entranceAnimation.stop();
    };
  }, [
    activeIndex,
    contentOpacity,
    contentX,
    ticketScale,
    ticketY,
    ticketRotation,
    copyOpacity,
    copyY,
  ]);

  const goTo = (nextIndex) => {
    if (
      nextIndex < 0 ||
      nextIndex >= slides.length ||
      isTransitioning.current
    ) {
      return;
    }

    isTransitioning.current = true;

    const direction = nextIndex > activeIndex ? 1 : -1;

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),

      Animated.timing(contentX, {
        toValue: direction * -28,
        duration: 170,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setActiveIndex(nextIndex);
      } else {
        isTransitioning.current = false;
      }
    });
  };

  const finish = () => {
    onComplete?.();
  };

  const handleCTA = () => {
    if (isLast) {
      finish();
      return;
    }

    goTo(activeIndex + 1);
  };

  const rotateTicket = ticketRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["-1deg", "-5deg"],
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: screenBackground },
      ]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={screenBackground}
      />

      {/* TOP ORB */}
      <Animated.View
        style={[
          styles.orb,
          styles.orbTop,
          {
            backgroundColor: slide.accent,
            transform: [{ scale: orbScale }],
            opacity: orbOpacity,
          },
        ]}
      />

      {/* BOTTOM ORB */}
      <View
        style={[
          styles.orbBottom,
          {
            backgroundColor: isDark ? "#8076BA" : "#9D8CFF",
          },
        ]}
      />

      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: screenBackground },
        ]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.brandLockup}>
            <Image
              source={require("../../../assets/splashIcon.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text
              style={[
                styles.brand,
                { color: brandColor },
              ]}
            >
              MEMENTO
            </Text>
          </View>

          {!isLast && (
            <Pressable
              onPress={finish}
              hitSlop={12}
              style={styles.skipButton}
              accessibilityRole="button"
              accessibilityLabel="Skip onboarding"
            >
              <Text
                style={[
                  styles.skipText,
                  { color: secondaryTextColor },
                ]}
              >
                Close
              </Text>
            </Pressable>
          )}
        </View>

        {/* MAIN CONTENT */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentOpacity,
              transform: [{ translateX: contentX }],
            },
          ]}
        >
          {/* TICKET ILLUSTRATION */}
          <View style={styles.illustrationArea}>
            <Animated.View
              style={[
                styles.ticket,
                {
                  transform: [
                    { translateY: ticketY },
                    { scale: ticketScale },
                    { rotate: rotateTicket },
                  ],
                },
              ]}
            >
              {/* TICKET HEADER */}
              <View style={styles.ticketTopRow}>
                <View
                  style={[
                    styles.ticketIcon,
                    { backgroundColor: slide.accent },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={slide.icon}
                    size={30}
                    color="#3B3768"
                  />
                </View>

                <View style={styles.ticketMeta}>
                  <View style={styles.metaLineLong} />
                  <View style={styles.metaLineShort} />
                </View>

                <Feather
                  name="more-horizontal"
                  size={22}
                  color="#A8A4BD"
                />
              </View>

              {/* TICKET IMAGE */}
              <View style={styles.ticketImage}>
                <View style={styles.sun} />
                <View style={styles.hillBack} />
                <View style={styles.hillFront} />

                <Text style={styles.ticketSparkle}>✦</Text>
              </View>

              {/* TICKET FOOTER */}
              <View style={styles.ticketFooter}>
                <View style={styles.ticketFooterCopy}>
                  <Text style={styles.ticketLabel}>
                    MEMENTO / 001
                  </Text>

                  <Text
                    style={styles.ticketTitle}
                    numberOfLines={2}
                  >
                    {slide.cardLabel}
                  </Text>
                </View>

                <View style={styles.barcode}>
                  {[3, 1, 2, 4, 1, 2, 3, 1].map(
                    (size, index) => (
                      <View
                        key={index}
                        style={[
                          styles.bar,
                          { width: size },
                        ]}
                      />
                    )
                  )}
                </View>
              </View>
            </Animated.View>

            {/* FLOATING DOT ONE */}
            <Animated.View
              style={[
                styles.floatingDot,
                styles.dotOne,
                {
                  backgroundColor: slide.accent,
                  transform: [{ translateY: dotOneY }],
                },
              ]}
            />

            {/* FLOATING DOT TWO */}
            <Animated.View
              style={[
                styles.floatingDot,
                styles.dotTwo,
                {
                  backgroundColor: slide.accent,
                  transform: [{ translateY: dotTwoY }],
                },
              ]}
            />

            <Text
              style={[
                styles.illustrationCaption,
                { color: secondaryTextColor },
              ]}
            >
              A little more than a photo
            </Text>
          </View>

          {/* SLIDE COPY */}
          <Animated.View
            style={[
              styles.copy,
              {
                opacity: copyOpacity,
                transform: [{ translateY: copyY }],
              },
            ]}
          >
            <Text
              style={[
                styles.eyebrow,
                { color: slide.accent },
              ]}
            >
              {slide.eyebrow}
            </Text>

            <Text
              style={[
                styles.title,
                { color: textColor },
              ]}
            >
              {slide.title}
            </Text>

            <Text
              style={[
                styles.description,
                { color: secondaryTextColor },
              ]}
            >
              {slide.description}
            </Text>
          </Animated.View>
        </Animated.View>

        {/* FOOTER */}
        <View style={styles.footer}>
          {/* PAGINATION */}
          <View
            style={styles.pagination}
            accessibilityLabel={`Slide ${activeIndex + 1} of ${slides.length}`}
          >
            {slides.map((item, index) => (
              <View
                key={item.eyebrow}
                style={[
                  styles.paginationDot,
                  index === activeIndex && [
                    styles.paginationDotActive,
                    { backgroundColor: slide.accent },
                  ],
                ]}
              />
            ))}
          </View>

          {/* PRIMARY CTA */}
          <TactileButton
            label={
              isLast
                ? "Create my first memory"
                : "Continue"
            }
            onPress={handleCTA}
            icon={isLast ? "checkmark" : "arrow-forward"}
            iconPosition="right"
            color="#FFFDF7"
            textColor="#3B3768"
            iconColor="#3B3768"
            height={58}
            borderRadius={17}
            depth={3}
            style={styles.ctaWrapper}
            contentStyle={styles.cta}
            textStyle={styles.ctaText}
          />

          <Text
            style={[
              styles.footerNote,
              { color: secondaryTextColor },
            ]}
          >
            Your memories, kept with purpose.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },

  orb: {
    position: "absolute",
    borderRadius: 999,
  },

  orbTop: {
    width: 230,
    height: 230,
    top: -95,
    right: -55,
  },

  orbBottom: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 999,
    opacity: 0.16,
    bottom: -150,
    left: -130,
  },

  header: {
    height: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandLockup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  logo: {
    width: 28,
    height: 28,
  },

  brand: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2.4,
  },

  skipButton: {
    paddingVertical: 10,
    paddingLeft: 16,
  },

  skipText: {
    fontSize: 14,
    fontWeight: "600",
  },

  content: {
    flex: 1,
  },

  illustrationArea: {
    flex: 1.05,
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },

  ticket: {
    width: Math.min(width - 72, 322),
    backgroundColor: "#FFFDF7",
    borderRadius: 19,
    padding: 17,
    shadowColor: "#17152F",
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.28,
    shadowRadius: 25,
    elevation: 12,
  },

  ticketTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 15,
  },

  ticketIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  ticketMeta: {
    flex: 1,
    gap: 7,
  },

  metaLineLong: {
    height: 7,
    width: "75%",
    borderRadius: 5,
    backgroundColor: "#49456A",
  },

  metaLineShort: {
    height: 5,
    width: "45%",
    borderRadius: 5,
    backgroundColor: "#C6C2D4",
  },

  ticketImage: {
    height: 144,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#D8D5F0",
    position: "relative",
  },

  sun: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E76F51",
    top: 24,
    right: 35,
  },

  hillBack: {
    position: "absolute",
    width: 250,
    height: 130,
    borderRadius: 130,
    backgroundColor: "#9D8CFF",
    bottom: -83,
    left: -32,
    transform: [{ rotate: "-12deg" }],
  },

  hillFront: {
    position: "absolute",
    width: 280,
    height: 115,
    borderRadius: 120,
    backgroundColor: "#5A5486",
    bottom: -80,
    right: -45,
    transform: [{ rotate: "12deg" }],
  },

  ticketSparkle: {
    position: "absolute",
    color: "#FFFDF7",
    fontSize: 28,
    top: 35,
    left: 45,
  },

  ticketFooter: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 16,
    gap: 10,
  },

  ticketFooterCopy: {
    flex: 1,
  },

  ticketLabel: {
    color: "#A8A4BD",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 5,
  },

  ticketTitle: {
    color: "#3B3768",
    fontSize: 13,
    fontWeight: "800",
    maxWidth: 190,
  },

  barcode: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 25,
    gap: 2,
  },

  bar: {
    height: 23,
    backgroundColor: "#3B3768",
  },

  floatingDot: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.9,
  },

  dotOne: {
    width: 10,
    height: 10,
    top: "20%",
    left: "12%",
  },

  dotTwo: {
    width: 7,
    height: 7,
    bottom: "13%",
    right: "13%",
  },

  illustrationCaption: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginTop: 22,
  },

  copy: {
    paddingBottom: 20,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2.2,
    marginBottom: 13,
  },

  title: {
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "800",
    letterSpacing: -0.8,
    maxWidth: 360,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 15,
    maxWidth: 340,
  },

  footer: {
    paddingBottom: 14,
  },

  pagination: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 18,
  },

  paginationDot: {
    width: 7,
    height: 7,
    borderRadius: 8,
    backgroundColor: "#77719C",
  },

  paginationDotActive: {
    width: 27,
  },

  ctaWrapper: {
    width: "100%",
    marginBottom: 0,
  },

  cta: {
    minHeight: 58,
    borderRadius: 17,
    backgroundColor: "#FFFDF7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  ctaText: {
    color: "#3B3768",
    fontSize: 15,
    fontWeight: "800",
  },

  footerNote: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 13,
  },
});

export default OnboardingScreen;