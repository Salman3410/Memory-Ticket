import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthTabs from "./AuthTabs";
import ForgotPasswordScreen from "../screens/Auth/ForgotPasswordScreen/ForgotPasswordScreen";
import VerifySignupOtpScreen from "../screens/Auth/VerifySignupOtpScreen";

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="AuthTabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AuthTabs" component={AuthTabs} />
      <Stack.Screen name="VerifySignupOtp" component={VerifySignupOtpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
