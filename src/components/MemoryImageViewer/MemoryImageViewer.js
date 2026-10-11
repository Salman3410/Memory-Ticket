import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedImage = Animated.createAnimatedComponent(
  require("react-native").Image,
);

const clamp = (value, min, max) => {
  "worklet";

  return Math.max(min, Math.min(max, value));
};

function MemoryImageViewer({
  visible,
  images = [],
  initialIndex = 0,
  onClose,
  onIndexChange,
  onShare,
  onSave,
  sharing = false,
  saving = false,
}) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(
    Math.max(0, Math.min(initialIndex, Math.max(images.length - 1, 0))),
  );

  const [controlsVisible, setControlsVisible] = useState(true);
  const [hintVisible, setHintVisible] = useState(images.length > 1);

  const imageSizes = useRef({});
  const controlsTimer = useRef(null);
  const hintTimer = useRef(null);
  const pagerX = useSharedValue(0);
  const dismissY = useSharedValue(0);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const fitWidth = useSharedValue(width);
  const fitHeight = useSharedValue(height);

  const pinchStartScale = useSharedValue(1);
  const panStartX = useSharedValue(0);
  const panStartY = useSharedValue(0);
  const controlsOpacity = useSharedValue(1);
  const hintOpacity = useSharedValue(1);

  const clearTimers = () => {
    if (controlsTimer.current) {
      clearTimeout(controlsTimer.current);

      controlsTimer.current = null;
    }

    if (hintTimer.current) {
      clearTimeout(hintTimer.current);

      hintTimer.current = null;
    }
  };

  const updateImageFit = (imageWidth, imageHeight) => {
    if (!imageWidth || !imageHeight || !width || !height) {
      return;
    }

    const ratio = Math.min(width / imageWidth, height / imageHeight);

    fitWidth.value = imageWidth * ratio;

    fitHeight.value = imageHeight * ratio;
  };

  const handleImageLoad = (index, event) => {
    const source = event?.nativeEvent?.source;

    if (!source?.width || !source?.height) {
      return;
    }

    imageSizes.current[index] = {
      width: source.width,
      height: source.height,
    };

    if (index === currentIndex) {
      updateImageFit(source.width, source.height);
    }
  };

  const resetZoom = (animated = true) => {
    if (animated) {
      scale.value = withSpring(1, {
        damping: 20,
        stiffness: 240,
        mass: 0.8,
      });

      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 240,
        mass: 0.8,
      });

      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 240,
        mass: 0.8,
      });
    } else {
      scale.value = 1;
      translateX.value = 0;
      translateY.value = 0;
    }
  };

  const scheduleControlsHide = () => {
    if (controlsTimer.current) {
      clearTimeout(controlsTimer.current);
    }

    controlsTimer.current = setTimeout(() => {
      setControlsVisible(false);

      controlsOpacity.value = withTiming(0, {
        duration: 220,
      });
    }, 3500);
  };

  const toggleControls = () => {
    const next = !controlsVisible;

    setControlsVisible(next);

    controlsOpacity.value = withTiming(next ? 1 : 0, {
      duration: 180,
    });

    if (next) {
      scheduleControlsHide();
    } else if (controlsTimer.current) {
      clearTimeout(controlsTimer.current);

      controlsTimer.current = null;
    }
  };

  useEffect(() => {
    if (!visible) {
      clearTimers();
      return;
    }

    const safeIndex = Math.max(
      0,
      Math.min(initialIndex, Math.max(images.length - 1, 0)),
    );

    setCurrentIndex(safeIndex);

    onIndexChange?.(safeIndex);

    resetZoom(false);

    dismissY.value = 0;

    pagerX.value = -safeIndex * width;

    setControlsVisible(true);

    setHintVisible(images.length > 1);

    controlsOpacity.value = 1;

    hintOpacity.value = images.length > 1 ? 1 : 0;

    clearTimers();

    scheduleControlsHide();

    if (images.length > 1) {
      hintTimer.current = setTimeout(() => {
        setHintVisible(false);

        hintOpacity.value = withTiming(0, {
          duration: 350,
        });
      }, 2200);
    }

    const size = imageSizes.current[safeIndex];

    if (size) {
      updateImageFit(size.width, size.height);
    }

    return clearTimers;
  }, [visible, initialIndex, width, images.length]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    resetZoom();

    const size = imageSizes.current[currentIndex];

    if (size) {
      updateImageFit(size.width, size.height);
    }
  }, [currentIndex, visible]);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDistance(18)
    .onEnd((_event, success) => {
      if (!success) {
        return;
      }

      if (scale.value > 1.05) {
        scale.value = withSpring(1, {
          damping: 20,
          stiffness: 240,
        });

        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 240,
        });

        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 240,
        });

        return;
      }

      scale.value = withSpring(2.5, {
        damping: 20,
        stiffness: 240,
        mass: 0.8,
      });

      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 240,
      });

      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 240,
      });
    });

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .maxDistance(18)
    .onEnd((_event, success) => {
      if (!success) {
        return;
      }

      runOnJS(toggleControls)();
    });

  const pinch = Gesture.Pinch()
    .onStart(() => {
      pinchStartScale.value = scale.value;
    })
    .onUpdate((event) => {
      const nextScale = clamp(pinchStartScale.value * event.scale, 1, 4);

      scale.value = nextScale;
    })
    .onEnd(() => {

      if (scale.value <= 1.02) {
        scale.value = withSpring(1, {
          damping: 20,
          stiffness: 240,
        });

        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 240,
        });

        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 240,
        });

        return;
      }

      const maxX = Math.max(0, (fitWidth.value * scale.value - width) / 2);
      const maxY = Math.max(0, (fitHeight.value * scale.value - height) / 2);

      translateX.value = withSpring(clamp(translateX.value, -maxX, maxX), {
        damping: 20,
        stiffness: 240,
      });

      translateY.value = withSpring(clamp(translateY.value, -maxY, maxY), {
        damping: 20,
        stiffness: 240,
      });
    });

  const pan = Gesture.Pan()
    .minDistance(8)
    .maxPointers(2)
    .onStart(() => {
      panStartX.value = translateX.value;

      panStartY.value = translateY.value;
    })
    .onUpdate((event) => {

      if (event.numberOfPointers > 1) {
        return;
      }

      if (scale.value > 1.03) {
        const maxX = Math.max(0, (fitWidth.value * scale.value - width) / 2);

        const maxY = Math.max(0, (fitHeight.value * scale.value - height) / 2);

        translateX.value = clamp(
          panStartX.value + event.translationX,
          -maxX,
          maxX,
        );

        translateY.value = clamp(
          panStartY.value + event.translationY,
          -maxY,
          maxY,
        );

        return;
      }

      const horizontalDistance = Math.abs(event.translationX);
      const verticalDistance = Math.abs(event.translationY);

      if (verticalDistance > horizontalDistance) {
        dismissY.value = Math.max(0, event.translationY);

        pagerX.value = -currentIndex * width;

        return;
      }

      dismissY.value = 0;

      pagerX.value = -currentIndex * width + event.translationX;
    })
    .onEnd((event) => {

      if (scale.value > 1.03) {
        const maxX = Math.max(0, (fitWidth.value * scale.value - width) / 2);

        const maxY = Math.max(0, (fitHeight.value * scale.value - height) / 2);

        translateX.value = withSpring(clamp(translateX.value, -maxX, maxX));

        translateY.value = withSpring(clamp(translateY.value, -maxY, maxY));

        return;
      }

      const horizontal =
        Math.abs(event.translationX) >= Math.abs(event.translationY);

      if (!horizontal && event.translationY > 120) {
        dismissY.value = withTiming(
          height,
          {
            duration: 220,
          },
          (finished) => {
            if (finished) {
              runOnJS(onClose)();
            }
          },
        );

        return;
      }

      if (!horizontal) {
        dismissY.value = withSpring(0, {
          damping: 20,
          stiffness: 220,
        });

        return;
      }

      const distanceThreshold = width * 0.18;

      let nextIndex = currentIndex;

      const shouldGoNext =
        event.translationX < -distanceThreshold || event.velocityX < -700;

      const shouldGoPrevious =
        event.translationX > distanceThreshold || event.velocityX > 700;

      if (shouldGoNext) {
        nextIndex = Math.min(images.length - 1, currentIndex + 1);
      } else if (shouldGoPrevious) {
        nextIndex = Math.max(0, currentIndex - 1);
      }

      pagerX.value = withSpring(-nextIndex * width, {
        damping: 24,
        stiffness: 260,
        mass: 0.8,
      });

      if (nextIndex !== currentIndex) {
        runOnJS(setCurrentIndex)(nextIndex);

        if (onIndexChange) {
          runOnJS(onIndexChange)(nextIndex);
        }
      }

      dismissY.value = withSpring(0, {
        damping: 20,
        stiffness: 220,
      });
    });

  const tapGestures = Gesture.Exclusive(doubleTap, singleTap);

  const gestures = Gesture.Simultaneous(pinch, pan, tapGestures);

  const pagerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: pagerX.value,
        },
        {
          translateY: dismissY.value,
        },
      ],
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
        {
          scale: scale.value,
        },
      ],

      opacity: interpolate(
        dismissY.value,
        [0, height * 0.45],
        [1, 0.4],
        Extrapolation.CLAMP,
      ),
    };
  });

  const controlsStyle = useAnimatedStyle(() => {
    return {
      opacity: controlsOpacity.value,
    };
  });

  const hintStyle = useAnimatedStyle(() => {
    return {
      opacity: hintOpacity.value,
    };
  });

  if (!images.length) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }} unstable_forceActive>
        <View style={styles.container}>
          <StatusBar hidden />

          <GestureDetector gesture={gestures}>
            <Animated.View
              style={[
                styles.pager,
                pagerStyle,
                {
                  width: width * images.length,
                  height,
                },
              ]}
            >
              {images.map((image, index) => (
                <View
                  key={`${image}-${index}`}
                  style={[
                    styles.page,
                    {
                      width,
                      height,
                    },
                  ]}
                >
                  <AnimatedImage
                    source={{
                      uri: image,
                    }}
                    resizeMode="contain"
                    onLoad={(event) => handleImageLoad(index, event)}
                    style={[
                      styles.image,
                      {
                        width,
                        height,
                      },
                      index === currentIndex ? imageStyle : null,
                    ]}
                  />
                </View>
              ))}
            </Animated.View>
          </GestureDetector>

          <Animated.View
            style={[styles.controlsLayer, controlsStyle]}
            pointerEvents={controlsVisible ? "box-none" : "none"}
          >
            <Pressable
              style={[
                styles.closeButton,
                {
                  top: insets.top + 12,
                },
              ]}
              onPress={onClose}
            >
              <Ionicons name="close" size={25} color="#FFFFFF" />
            </Pressable>

            <View
              style={[
                styles.counter,
                {
                  top: insets.top + 18,
                },
              ]}
            >
              <Text style={styles.counterText}>
                {currentIndex + 1}
                {" / "}
                {images.length}
              </Text>
            </View>

            {(onShare || onSave) && (
              <View
                style={[
                  styles.actionBar,
                  {
                    bottom: insets.bottom + 24,
                  },
                ]}
              >
                {onShare && (
                  <Pressable
                    disabled={sharing || saving}
                    onPress={() => onShare(currentIndex)}
                    style={[
                      styles.actionButton,
                      (sharing || saving) && styles.actionButtonDisabled,
                    ]}
                  >
                    {sharing ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Ionicons
                        name="share-outline"
                        size={19}
                        color="#FFFFFF"
                      />
                    )}

                    <Text style={styles.actionText}>
                      {sharing ? "Sharing..." : "Share"}
                    </Text>
                  </Pressable>
                )}

                {onSave && (
                  <Pressable
                    disabled={sharing || saving}
                    onPress={() => onSave(currentIndex)}
                    style={[
                      styles.actionButton,
                      (sharing || saving) && styles.actionButtonDisabled,
                    ]}
                  >
                    {saving ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Ionicons
                        name="download-outline"
                        size={19}
                        color="#FFFFFF"
                      />
                    )}

                    <Text style={styles.actionText}>
                      {saving ? "Saving..." : "Save"}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </Animated.View>

          {images.length > 1 && hintVisible && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.swipeHint,
                {
                  bottom: insets.bottom + 92 + (onShare || onSave ? 72 : 0),
                },
                hintStyle,
              ]}
            >
              <Ionicons
                name="swap-horizontal-outline"
                size={16}
                color="#C9C9CE"
              />

              <Text style={styles.swipeHintText}>Swipe to view photos</Text>
            </Animated.View>
          )}
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050506",
  },

  pager: {
    flexDirection: "row",
    flex: 1,
  },

  page: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#050506",
  },

  image: {
    position: "absolute",
    left: 0,
    top: 0,
  },

  controlsLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },

  closeButton: {
    position: "absolute",
    left: 18,

    width: 44,
    height: 44,

    borderRadius: 14,

    backgroundColor: "rgba(255,255,255,0.12)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",

    alignItems: "center",
    justifyContent: "center",
  },

  counter: {
    position: "absolute",
    alignSelf: "center",

    minWidth: 64,

    paddingHorizontal: 13,
    paddingVertical: 7,

    borderRadius: 14,

    backgroundColor: "rgba(255,255,255,0.12)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",

    alignItems: "center",
    justifyContent: "center",
  },

  counterText: {
    color: "#FFFFFF",

    fontSize: 11,
    fontWeight: "900",

    letterSpacing: 1,
  },

  actionBar: {
    position: "absolute",
    alignSelf: "center",

    flexDirection: "row",
    alignItems: "center",

    gap: 8,

    padding: 6,

    borderRadius: 18,

    backgroundColor: "rgba(20,20,22,0.82)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  actionButton: {
    minWidth: 105,
    height: 44,

    paddingHorizontal: 15,

    borderRadius: 13,

    backgroundColor: "rgba(255,255,255,0.10)",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,
  },

  actionButtonDisabled: {
    opacity: 0.65,
  },

  actionText: {
    color: "#FFFFFF",

    fontSize: 10,
    fontWeight: "900",

    letterSpacing: 0.7,
  },

  swipeHint: {
    position: "absolute",
    alignSelf: "center",

    minHeight: 40,

    paddingHorizontal: 15,

    borderRadius: 20,

    backgroundColor: "rgba(255,255,255,0.10)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7,
  },

  swipeHintText: {
    color: "#C9C9CE",

    fontSize: 10,
    fontWeight: "800",

    letterSpacing: 0.8,
  },
});

export default MemoryImageViewer;
