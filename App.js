import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { KeyboardProvider } from "react-native-keyboard-controller";
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
import { configureNotifications } from "./src/services/notificationService";
import { getAppLockEnabled } from "./src/services/appLockService";
import { useAuth } from "./src/hooks/useAuth";
import { useMemory } from "./src/hooks/useMemory";
import RootNavigator from "./src/navigation/RootNavigator";
import MementoSplashScreen from "./src/components/Splash/SplashScreen";
import AppLockScreen from "./src/components/AppLock/AppLockScreen";
import OnboardingScreen from "./src/screens/Onboarding/OnboardingScreen";
import { Linking } from "react-native";

const ONBOARDING_SEEN_KEY = "memory_ticket_onboarding_seen";
const navigationRef = createNavigationContainerRef();

ExpoSplashScreen.preventAutoHideAsync();

function AppContent() {
  const { user, loading } = useAuth();
  const { loading: memoriesLoading } = useMemory();

  const [showMementoSplash, setShowMementoSplash] = useState(true);
  const [appLocked, setAppLocked] = useState(false);
  const [appLockReady, setAppLockReady] = useState(false);
  const [onboardingReady, setOnboardingReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [navigationReady, setNavigationReady] = useState(false);
  const [navigationStateVersion, setNavigationStateVersion] =
    useState(0);
  const [pendingNotification, setPendingNotification] = useState(null);
  const [pendingWidgetMemoryId, setPendingWidgetMemoryId] =
  useState(null);

  const nativeSplashHidden = useRef(false);
  const pendingNotificationKeyRef = useRef(null);

  useEffect(() => {
    getAppLockEnabled()
      .then(setAppLocked)
      .catch((error) => {
        console.warn("Unable to load App Lock state:", error);
        setAppLocked(false);
      })
      .finally(() => {
        setAppLockReady(true);
      });

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

    configureNotifications().catch((error) => {
      console.warn("Notification setup failed:", error);
    });

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

    requestAnimationFrame(hideNativeSplash);
  }, []);

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

  useEffect(() => {
    let mounted = true;

    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        queueNotificationResponse,
      );

    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (mounted && response) {
          queueNotificationResponse(response);
        }
      })
      .catch((error) => {
        console.warn(
          "Unable to read the initial notification response:",
          error,
        );
      });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [queueNotificationResponse]);

  useEffect(() => {
    if (!pendingNotification) {
      return;
    }

    if (
      loading ||
      !appLockReady ||
      !onboardingReady ||
      !showMementoSplash ||
      memoriesLoading ||
      !navigationReady ||
      !navigationRef.isReady()
    ) {
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

    if (!hasSeenOnboarding) {
      return;
    }

    if (!user) {
      clearPendingNotification();
      return;
    }

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
      navigationRef.navigate("MainTabs");
    } else {
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
  ]);

  function clearPendingNotification() {
    pendingNotificationKeyRef.current = null;
    setPendingNotification(null);

    Notifications.clearLastNotificationResponseAsync().catch(
      (error) => {
        console.warn(
          "Unable to clear the handled notification response:",
          error,
        );
      },
    );
  }

  const queueWidgetDeepLink = useCallback((url) => {
  if (typeof url !== "string") {
    return;
  }

  const match = url.match(
    /^memento:\/\/memory\/([^/?#]+)/i,
  );

  if (!match) {
    return;
  }

  try {
    const memoryId = decodeURIComponent(match[1]);

    if (memoryId) {
      setPendingWidgetMemoryId(memoryId);
    }
  } catch (error) {
    console.warn(
      "Unable to parse Memento widget link:",
      error,
    );
  }
  }, []);

  useEffect(() => {
  if (!pendingWidgetMemoryId) {
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

  // Keep the pending link until the user can access memories.
  if (!hasSeenOnboarding || !user || appLocked) {
    return;
  }

  const rootState = navigationRef.getRootState();
  const routeNames = rootState?.routeNames || [];

  if (
    !routeNames.includes("MainTabs") ||
    !routeNames.includes("MemoryDetails")
  ) {
    return;
  }

  navigationRef.navigate("MemoryDetails", {
    memoryId: pendingWidgetMemoryId,
  });

  setPendingWidgetMemoryId(null);
}, [
  pendingWidgetMemoryId,
  loading,
  user,
  appLocked,
  appLockReady,
  onboardingReady,
  hasSeenOnboarding,
  showMementoSplash,
  memoriesLoading,
  navigationReady,
  navigationStateVersion,
  ]);


useEffect(() => {
  let mounted = true;

  Linking.getInitialURL()
    .then((url) => {
      if (mounted && url) {
        queueWidgetDeepLink(url);
      }
    })
    .catch((error) => {
      console.warn(
        "Unable to read the initial widget link:",
        error,
      );
    });

  const subscription = Linking.addEventListener(
    "url",
    ({ url }) => {
      queueWidgetDeepLink(url);
    },
  );

  return () => {
    mounted = false;
    subscription.remove();
  };
}, [queueWidgetDeepLink]);


  const appReady =
    !loading &&
    !showMementoSplash &&
    onboardingReady &&
    appLockReady;

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, "true");
    } catch (error) {
      console.warn("Unable to persist onboarding state:", error);
    } finally {
      setHasSeenOnboarding(true);
    }
  };

  const handleNavigationReady = () => {
    setNavigationReady(true);
    setNavigationStateVersion((version) => version + 1);
  };

  const handleNavigationStateChange = () => {
    setNavigationStateVersion((version) => version + 1);
  };

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

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}

export default App;
