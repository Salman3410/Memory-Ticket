import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as ExpoSplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthProvider } from "./src/context/AuthContext";
import { MemoryProvider } from "./src/context/MemoryContext";
import { CollectionProvider } from "./src/context/CollectionContext";
import { RewardsProvider } from "./src/context/RewardsContext";
import { SubscriptionProvider } from "./src/context/SubscriptionContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import AlertProvider from "./src/context/AlertContext";

import {
  AnimatedNotificationProvider,
} from "./src/context/AnimatedNotificationContext";

import {
  configureNotifications,
} from "./src/services/notificationService";

import {
  getAppLockEnabled,
} from "./src/services/appLockService";

import { useAuth } from "./src/hooks/useAuth";
import { useMemory } from "./src/hooks/useMemory";

import RootNavigator from "./src/navigation/RootNavigator";
import MementoSplashScreen from "./src/components/Splash/SplashScreen";
import AppLockScreen from "./src/components/AppLock/AppLockScreen";
import OnboardingScreen from "./src/screens/Onboarding/OnboardingScreen";

const ONBOARDING_SEEN_KEY = "memory_ticket_onboarding_seen";

const navigationRef = createNavigationContainerRef();

ExpoSplashScreen.preventAutoHideAsync().catch((error) => {
  console.warn(
    "Unable to prevent native splash auto-hide:",
    error
  );
});

// --------------------------------------------------
// APP CONTENT
// --------------------------------------------------

function AppContent() {
  const { user, loading } = useAuth();
  const { loading: memoriesLoading } = useMemory();

  const [showMementoSplash, setShowMementoSplash] = useState(true);

  const [appLocked, setAppLocked] = useState(false);
  const [appLockReady, setAppLockReady] = useState(false);

  const [onboardingReady, setOnboardingReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  const [navigationReady, setNavigationReady] = useState(false);
  const [navigationStateVersion, setNavigationStateVersion] = useState(0);

  const [pendingNotification, setPendingNotification] = useState(null);

  const nativeSplashHidden = useRef(false);
  const pendingNotificationKeyRef = useRef(null);

  // --------------------------------------------------
  // INITIAL APP SETUP
  // --------------------------------------------------

  useEffect(() => {
    // Load App Lock state.
    getAppLockEnabled()
      .then(setAppLocked)
      .catch((error) => {
        console.warn("Unable to load App Lock state:", error);
        setAppLocked(false);
      })
      .finally(() => {
        setAppLockReady(true);
      });

    // Load onboarding status.
    AsyncStorage.getItem(ONBOARDING_SEEN_KEY)
      .then((value) => {
        setHasSeenOnboarding(value === "true");
      })
      .catch((error) => {
        console.warn("Unable to load onboarding state:", error);
        setHasSeenOnboarding(false);
      })
      .finally(() => {
        setOnboardingReady(true);
      });

    // Keep device notifications enabled.
    configureNotifications().catch((error) => {
      console.warn("Notification setup failed:", error);
    });

    // Hide the native splash screen.
    const hideNativeSplash = async () => {
      if (nativeSplashHidden.current) {
        return;
      }

      nativeSplashHidden.current = true;

      try {
        await ExpoSplashScreen.hideAsync();
      } catch (error) {
        console.warn("Failed to hide native splash:", error);
      }
    };

    requestAnimationFrame(() => {
      hideNativeSplash();
    });
  }, []);

  // --------------------------------------------------
  // CLEAR HANDLED NOTIFICATION
  // --------------------------------------------------

  const clearPendingNotification = useCallback(() => {
    pendingNotificationKeyRef.current = null;
    setPendingNotification(null);

    Notifications.clearLastNotificationResponseAsync().catch(
      (error) => {
        console.warn(
          "Unable to clear the handled notification response:",
          error
        );
      }
    );
  }, []);

  // --------------------------------------------------
  // QUEUE NOTIFICATION RESPONSE
  // --------------------------------------------------

  const queueNotificationResponse = useCallback((response) => {
    const request = response?.notification?.request;

    if (!request) {
      return;
    }

    const data = request.content?.data || {};

    const key = [
      request.identifier,
      response.actionIdentifier || "default",
    ].join(":");

    // Prevent processing the same notification response twice.
    if (pendingNotificationKeyRef.current === key) {
      return;
    }

    pendingNotificationKeyRef.current = key;

    setPendingNotification({
      key,
      type: data.type,
      memoryId: data.memoryId
        ? String(data.memoryId)
        : null,
    });
  }, []);

  // --------------------------------------------------
  // LISTEN FOR NOTIFICATION TAPS
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        queueNotificationResponse
      );

    // Handle a notification that launched the app.
    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (mounted && response) {
          queueNotificationResponse(response);
        }
      })
      .catch((error) => {
        console.warn(
          "Unable to read the initial notification response:",
          error
        );
      });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [queueNotificationResponse]);

  // --------------------------------------------------
  // PROCESS NOTIFICATION NAVIGATION
  // --------------------------------------------------

  useEffect(() => {
    if (!pendingNotification) {
      return;
    }

    if (
      loading ||
      !appReadyCheck({
        showMementoSplash,
        appLockReady,
        onboardingReady,
        navigationReady,
        memoriesLoading,
      }) ||
      !navigationRef.isReady()
    ) {
      return;
    }

    // Keep notification navigation pending until onboarding is complete.
    if (!hasSeenOnboarding) {
      return;
    }

    // A logged-out user cannot open a private memory.
    if (!user) {
      clearPendingNotification();
      return;
    }

    // Wait until App Lock has been unlocked.
    if (appLocked) {
      return;
    }

    const rootState = navigationRef.getRootState();
    const rootRouteNames = rootState?.routeNames || [];

    const appNavigatorReady =
      rootRouteNames.includes("MainTabs") &&
      rootRouteNames.includes("MemoryDetails");

    if (!appNavigatorReady) {
      return;
    }

    // Handle On This Day and memory reminder notifications.
    if (
      pendingNotification.type === "ON_THIS_DAY" ||
      pendingNotification.type === "MEMORY_REMINDER"
    ) {
      if (!pendingNotification.memoryId) {
        clearPendingNotification();
        return;
      }

      navigationRef.navigate("MemoryDetails", {
        memoryId: pendingNotification.memoryId,
      });
    } else if (
      pendingNotification.type === "DAILY_MEMORY_REMINDER"
    ) {
      // Open the main app for daily reminders.
      navigationRef.navigate("MainTabs");
    } else {
      // Ignore unsupported notification types.
      clearPendingNotification();
      return;
    }

    clearPendingNotification();
  }, [
    pendingNotification,
    loading,
    user,
    appLockReady,
    appLocked,
    onboardingReady,
    hasSeenOnboarding,
    showMementoSplash,
    memoriesLoading,
    navigationReady,
    navigationStateVersion,
    clearPendingNotification,
  ]);

  // --------------------------------------------------
  // APP READINESS
  // --------------------------------------------------

  const appReady =
    !loading &&
    !showMementoSplash &&
    onboardingReady &&
    appLockReady;

  // --------------------------------------------------
  // ONBOARDING
  // --------------------------------------------------

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem(
        ONBOARDING_SEEN_KEY,
        "true"
      );
    } catch (error) {
      console.warn(
        "Unable to persist onboarding state:",
        error
      );
    } finally {
      setHasSeenOnboarding(true);
    }
  };

  // --------------------------------------------------
  // NAVIGATION READINESS
  // --------------------------------------------------

  const handleNavigationReady = () => {
    setNavigationReady(true);

    setNavigationStateVersion((version) => version + 1);
  };

  const handleNavigationStateChange = () => {
    setNavigationStateVersion((version) => version + 1);
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={handleNavigationReady}
      onStateChange={handleNavigationStateChange}
    >
      {appReady ? (
        !hasSeenOnboarding ? (
          <OnboardingScreen
            onComplete={handleOnboardingComplete}
          />
        ) : appLocked ? (
          <AppLockScreen
            onUnlocked={() => setAppLocked(false)}
          />
        ) : (
          <RootNavigator />
        )
      ) : (
        <MementoSplashScreen
          onFinish={() => setShowMementoSplash(false)}
        />
      )}
    </NavigationContainer>
  );
}

// --------------------------------------------------
// APP READINESS CHECK
// --------------------------------------------------

function appReadyCheck({
  showMementoSplash,
  appLockReady,
  onboardingReady,
  navigationReady,
  memoriesLoading,
}) {
  return (
    !showMementoSplash &&
    appLockReady &&
    onboardingReady &&
    navigationReady &&
    !memoriesLoading
  );
}

// --------------------------------------------------
// APP ROOT
// --------------------------------------------------

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AnimatedNotificationProvider>
          <ThemeProvider>
            <AlertProvider>
              <KeyboardProvider>
                <AuthProvider>
                  <SubscriptionProvider>
                    <RewardsProvider>
                      <MemoryProvider>
                        <CollectionProvider>
                          <BottomSheetModalProvider>
                            <AppContent />
                          </BottomSheetModalProvider>
                        </CollectionProvider>
                      </MemoryProvider>
                    </RewardsProvider>
                  </SubscriptionProvider>
                </AuthProvider>
              </KeyboardProvider>
            </AlertProvider>
          </ThemeProvider>
        </AnimatedNotificationProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;