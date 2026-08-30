import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { AuthProvider } from "./src/context/AuthContext";
import { MemoryProvider } from "./src/context/MemoryContext";

import RootNavigator from "./src/navigation/RootNavigator";

function App() {
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
