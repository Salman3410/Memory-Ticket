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
  activateAccountMemoryNotifications,
  cancelAccountMemoryNotifications,
  cancelAllScheduledMemoryNotifications,
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

const ONBOARDING_SEEN_KEY =
  "memory_ticket_onboarding_seen";

const navigationRef =
  createNavigationContainerRef();

const getAccountId = (user) => {
  const id = user?._id ?? user?.id ?? null;

  if (
    id === null ||
    id === undefined ||
    String(id).trim() === ""
  ) {
    return null;
  }

  return String(id).trim();
};

function AppContent() {
  const {
    user,
    loading,
  } = useAuth();

  const {
    memories,
    loading: memoriesLoading,
    accountId: memoryAccountId,
  } = useMemory();

  const accountId = getAccountId(user);

  const [
    showMementoSplash,
    setShowMementoSplash,
  ] = useState(true);

  const [appLocked, setAppLocked] =
    useState(false);

  const [appLockReady, setAppLockReady] =
    useState(false);

  const [onboardingReady, setOnboardingReady] =
    useState(false);

  const [hasSeenOnboarding, setHasSeenOnboarding] =
    useState(false);

  const [navigationReady, setNavigationReady] =
    useState(false);

  const [
    navigationStateVersion,
    setNavigationStateVersion,
  ] = useState(0);

  const [
    pendingNotification,
    setPendingNotification,
  ] = useState(null);

  const pendingNotificationKeyRef =
    useRef(null);

  const notificationAccountRef =
    useRef(null);

  const notificationGenerationRef =
    useRef(0);

  const notificationWorkRef =
    useRef(Promise.resolve());

  useEffect(() => {
    getAppLockEnabled()
      .then(setAppLocked)
      .catch((error) => {
        console.warn(
          "Unable to load App Lock state:",
          error,
        );

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
        console.warn(
          "Unable to load onboarding state:",
          error,
        );

        setHasSeenOnboarding(false);
      })
      .finally(() => {
        setOnboardingReady(true);
      });

    configureNotifications().catch((error) => {
      console.warn(
        "Notification setup failed:",
        error,
      );
    });
  }, []);

  useEffect(() => {
    if (loading) {
      return undefined;
    }

    let active = true;

    const generation =
      ++notificationGenerationRef.current;

    const notificationTask =
      notificationWorkRef.current
        .catch(() => {})
        .then(async () => {
          if (
            !active ||
            generation !==
              notificationGenerationRef.current
          ) {
            return;
          }

          if (!accountId) {
            notificationAccountRef.current = null;

            await cancelAllScheduledMemoryNotifications();

            return;
          }

          if (
            memoriesLoading ||
            memoryAccountId !== accountId
          ) {
            return;
          }

          const previousAccountId =
            notificationAccountRef.current;

          if (
            previousAccountId &&
            previousAccountId !== accountId
          ) {
            await cancelAccountMemoryNotifications(
              previousAccountId,
            );
          }

          if (
            !active ||
            generation !==
              notificationGenerationRef.current
          ) {
            return;
          }

          await activateAccountMemoryNotifications(
            accountId,
            memories,
          );

          if (
            !active ||
            generation !==
              notificationGenerationRef.current
          ) {
            return;
          }

          notificationAccountRef.current =
            accountId;
        });

    notificationWorkRef.current =
      notificationTask;

    notificationTask.catch((error) => {
      console.error(
        "Account notification synchronization failed:",
        error,
      );
    });

    return () => {
      active = false;
    };
  }, [
    loading,
    accountId,
    memories,
    memoriesLoading,
    memoryAccountId,
  ]);

  const clearPendingNotification =
    useCallback(() => {
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
    }, []);

  const queueNotificationResponse =
    useCallback((response) => {
      const request =
        response?.notification?.request;

      if (!request) {
        return;
      }

      const data =
        request.content?.data || {};

      const key = [
        request.identifier,
        response.actionIdentifier || "default",
      ].join(":");

      if (
        pendingNotificationKeyRef.current === key
      ) {
        return;
      }

      pendingNotificationKeyRef.current = key;

      setPendingNotification({
        key,
        type: data.type,

        memoryId: data.memoryId
          ? String(data.memoryId)
          : null,

        ownerAccountId:
          data.ownerAccountId !== undefined &&
          data.ownerAccountId !== null
            ? String(data.ownerAccountId)
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

    if (!user || !accountId) {
      clearPendingNotification();
      return;
    }

    if (
      !pendingNotification.ownerAccountId ||
      pendingNotification.ownerAccountId !== accountId
    ) {
      clearPendingNotification();
      return;
    }

    if (appLocked) {
      return;
    }

    const rootState =
      navigationRef.getRootState();

    const rootRouteNames =
      rootState?.routeNames || [];

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
      pendingNotification.type ===
      "DAILY_MEMORY_REMINDER"
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
    accountId,
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

  const appReady =
    !loading &&
    !showMementoSplash &&
    onboardingReady &&
    appLockReady;

  const handleOnboardingComplete =
    async () => {
      try {
        await AsyncStorage.setItem(
          ONBOARDING_SEEN_KEY,
          "true",
        );
      } catch (error) {
        console.warn(
          "Unable to persist onboarding state:",
          error,
        );
      } finally {
        setHasSeenOnboarding(true);
      }
    };

  const handleNavigationReady = () => {
    setNavigationReady(true);

    setNavigationStateVersion(
      (version) => version + 1,
    );
  };

  const handleNavigationStateChange = () => {
    setNavigationStateVersion(
      (version) => version + 1,
    );
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
