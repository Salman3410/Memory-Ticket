import { useEffect, useRef, useState } from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { KeyboardProvider } from "react-native-keyboard-controller";

import * as ExpoSplashScreen from "expo-splash-screen";

import { AuthProvider } from "./src/context/AuthContext";
import { MemoryProvider } from "./src/context/MemoryContext";
import { CollectionProvider } from "./src/context/CollectionContext";
import AlertProvider from "./context/AlertContext";

import { useAuth } from "./src/hooks/useAuth";

import RootNavigator from "./src/navigation/RootNavigator";
import MementoSplashScreen from "./src/components/Splash/SplashScreen";

ExpoSplashScreen.preventAutoHideAsync();

function AppContent() {
  const { loading } = useAuth();

  const [showMementoSplash, setShowMementoSplash] = useState(true);
  const nativeSplashHidden = useRef(false);

  useEffect(() => {
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

  const appReady = !loading && !showMementoSplash;

  return (
    <NavigationContainer>
      {appReady ? (
        <RootNavigator />
      ) : (
        <MementoSplashScreen onFinish={() => setShowMementoSplash(false)} />
      )}
    </NavigationContainer>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
       <AlertProvider>
        <KeyboardProvider>
          <AuthProvider>
            <MemoryProvider>
              <CollectionProvider>
                <BottomSheetModalProvider>
                  <AppContent />
                </BottomSheetModalProvider>
              </CollectionProvider>
            </MemoryProvider>
          </AuthProvider>
        </KeyboardProvider>
      </AlertProvider>
    </GestureHandlerRootView>
  );
}

export default App;
