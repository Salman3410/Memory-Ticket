import { useEffect } from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { KeyboardProvider } from "react-native-keyboard-controller";

import * as SplashScreen from "expo-splash-screen";

import { AuthProvider } from "./src/context/AuthContext";
import { MemoryProvider } from "./src/context/MemoryContext";

import RootNavigator from "./src/navigation/RootNavigator";

import { getAppEnvironmentInfo } from "./src/services/appEnvironmentService";

SplashScreen.preventAutoHideAsync();

function App() {
  useEffect(() => {
    const prepareApp = async () => {
      try {
        const info = await getAppEnvironmentInfo();

        console.log("APP ENVIRONMENT INFO:");
        console.log(info);
      } catch (error) {
        console.error("Failed to get environment info:", error);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <AuthProvider>
          <MemoryProvider>
            <BottomSheetModalProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </BottomSheetModalProvider>
          </MemoryProvider>
        </AuthProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export default App;
