import { useEffect } from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { AuthProvider } from "./src/context/AuthContext";
import { MemoryProvider } from "./src/context/MemoryContext";

import RootNavigator from "./src/navigation/RootNavigator";

import { getAppEnvironmentInfo } from "./src/services/appEnvironmentService";

function App() {
  useEffect(() => {
    const testEnvironmentInfo = async () => {
      try {
        const info = await getAppEnvironmentInfo();

        console.log("APP ENVIRONMENT INFO:");
        console.log(info);
      } catch (error) {
        console.error("Failed to get environment info:", error);
      }
    };

    testEnvironmentInfo();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <MemoryProvider>
          <BottomSheetModalProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </BottomSheetModalProvider>
        </MemoryProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

export default App;
