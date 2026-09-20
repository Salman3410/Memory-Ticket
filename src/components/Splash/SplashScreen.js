import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import mementoLogo from "../../../assets/splash-logo.png";

const PARTICLE_COUNT = 18;

function createParticles(width, height) {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => {
    return {
      id: index,
      x: Math.random() * width,
      y: height + Math.random() * height * 0.35,
      size: Math.random() * 2.5 + 1,
      distance: Math.random() * height * 0.55 + height * 0.25,
      duration: Math.random() * 2500 + 3500,
      delay: Math.random() * 2500,
      drift: (Math.random() - 0.5) * 45,
    };
  });
}

function SplashScreen({ onFinish }) {
  const { width, height } = useWindowDimensions();

  const logoOpacity = useRef(new Animated.Value(0)).current;

  const logoTranslateY = useRef(
    new Animated.Value(Math.min(height * 0.38, 320)),
  ).current;

  const logoScale = useRef(new Animated.Value(0.92)).current;
  const particles = useRef(createParticles(width, height)).current;

  const particleAnimations = useRef(
    particles.map(() => ({
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.7),
    })),
  ).current;

  useEffect(() => {
    let mounted = true;

    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 1100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.03,
          duration: 850,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(logoScale, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const particleLoops = particleAnimations.map((animation, index) => {
      const particle = particles[index];

      const animationLoop = Animated.loop(
        Animated.sequence([
          // Delay each particle so they don't all start together
          Animated.delay(particle.delay),

          // Particle appears
          Animated.parallel([
            Animated.timing(animation.opacity, {
              toValue: 0.45,
              duration: 500,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),

            Animated.timing(animation.scale, {
              toValue: 1,
              duration: 500,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]),

          // Float upward
          Animated.parallel([
            Animated.timing(animation.translateY, {
              toValue: -particle.distance,
              duration: particle.duration,
              easing: Easing.linear,
              useNativeDriver: true,
            }),

            Animated.timing(animation.translateX, {
              toValue: particle.drift,
              duration: particle.duration,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),

          // Fade away
          Animated.parallel([
            Animated.timing(animation.opacity, {
              toValue: 0,
              duration: 700,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),

            Animated.timing(animation.scale, {
              toValue: 0.5,
              duration: 700,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]),

          // Reset
          Animated.parallel([
            Animated.timing(animation.translateY, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),

            Animated.timing(animation.translateX, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),

            Animated.timing(animation.opacity, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),

            Animated.timing(animation.scale, {
              toValue: 0.7,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ]),
      );

      animationLoop.start();

      return animationLoop;
    });

    const finishTimer = setTimeout(() => {
      if (mounted && onFinish) {
        onFinish();
      }
    }, 1300);

    return () => {
      mounted = false;

      clearTimeout(finishTimer);

      logoOpacity.stopAnimation();
      logoTranslateY.stopAnimation();
      logoScale.stopAnimation();

      particleLoops.forEach((loop) => {
        loop.stop();
      });

      particleAnimations.forEach((animation) => {
        animation.translateY.stopAnimation();
        animation.translateX.stopAnimation();
        animation.opacity.stopAnimation();
        animation.scale.stopAnimation();
      });
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.splash}>

        {particles.map((particle, index) => {
          const animation = particleAnimations[index];

          return (
            <Animated.View
              key={particle.id}
              pointerEvents="none"
              style={[
                styles.particle,
                {
                  left: particle.x,
                  top: particle.y,
                  width: particle.size,
                  height: particle.size,
                  opacity: animation.opacity,
                  transform: [
                    {
                      translateY: animation.translateY,
                    },
                    {
                      translateX: animation.translateX,
                    },
                    {
                      scale: animation.scale,
                    },
                  ],
                },
              ]}
            />
          );
        })}

        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,

              transform: [
                {
                  translateY: logoTranslateY,
                },
                {
                  scale: logoScale,
                },
              ],
            },
          ]}
        >
          <Image
            source={mementoLogo}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3B3768",
  },

  splash: {
    flex: 1,
    width: "100%",
    backgroundColor: "#3B3768",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 150,
    height: 150,
  },

  particle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
  },
});

export default SplashScreen;
