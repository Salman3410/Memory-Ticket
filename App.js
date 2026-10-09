import { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { KeyboardProvider } from "react-native-keyboard-controller";
import * as ExpoSplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider } from "./src/context/AuthContext";
import { MemoryProvider } from "./src/context/MemoryContext";
import { CollectionProvider } from "./src/context/CollectionContext";
import { RewardsProvider } from "./src/context/RewardsContext";
import { SubscriptionProvider } from "./src/context/SubscriptionContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import { configureNotifications } from "./src/services/notificationService";
import { useAuth } from "./src/hooks/useAuth";
import RootNavigator from "./src/navigation/RootNavigator";
import MementoSplashScreen from "./src/components/Splash/SplashScreen";
import AppLockScreen from "./src/components/AppLock/AppLockScreen";
import { getAppLockEnabled } from "./src/services/appLockService";
import AlertProvider from "./src/context/AlertContext";
import OnboardingScreen from "./src/screens/Onboarding/OnboardingScreen";

const ONBOARDING_SEEN_KEY = "memory_ticket_onboarding_seen";

ExpoSplashScreen.preventAutoHideAsync();

function AppContent() {
  const { loading } = useAuth();
  const [showMementoSplash, setShowMementoSplash] = useState(true);
  const [appLocked, setAppLocked] = useState(false);
  const [onboardingReady, setOnboardingReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const nativeSplashHidden = useRef(false);

  useEffect(() => {
    getAppLockEnabled()
      .then(setAppLocked)
      .catch(() => setAppLocked(false));

    AsyncStorage.getItem(ONBOARDING_SEEN_KEY)
      .then((value) => setHasSeenOnboarding(value === "true"))
      .catch(() => setHasSeenOnboarding(false))
      .finally(() => setOnboardingReady(true));

    configureNotifications().catch((error) => {
      console.warn("Notification setup failed:", error);
    });

    const hideNativeSplash = async () => {
      if (nativeSplashHidden.current) return;
      nativeSplashHidden.current = true;

      try {
        await ExpoSplashScreen.hideAsync();
      } catch (error) {
        console.warn("Failed to hide native splash:", error);
      }
    };

    requestAnimationFrame(hideNativeSplash);
  }, []);

  const appReady = !loading && !showMementoSplash && onboardingReady;

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, "true");
    } catch (error) {
      console.warn("Unable to persist onboarding state:", error);
    } finally {
      setHasSeenOnboarding(true);
    }
  };

  return (
    <NavigationContainer>
      {appReady ? (
        !hasSeenOnboarding ? (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        ) : appLocked ? (
          <AppLockScreen onUnlocked={() => setAppLocked(false)} />
        ) : (
          <RootNavigator />
        )
      ) : (
        <MementoSplashScreen onFinish={() => setShowMementoSplash(false)} />
      )}
    </NavigationContainer>
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
