import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,

  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import styles from "./authStyles";
import { useAuth } from "../../hooks/useAuth";
import { useAppAlert } from "../../context/AlertContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const AnimatedView =
  Animated.createAnimatedComponent(View);

function LoginScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};
  const screenBackground = colors.background || (isDark ? "#171624" : "#F1F0F6");
  const surfaceColor = colors.surface || (isDark ? "#211F30" : "#FFFFFF");
  const textColor = colors.text || (isDark ? "#F7F5FC" : "#242424");
  const secondaryTextColor = colors.textSecondary || colors.textMuted || (isDark ? "#C4C0D0" : "#707080");
  const borderColor = colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const { login } = useAuth();
  const { showAlert } = useAppAlert();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [isLoading, setIsLoading] =
    useState(false);

  const entranceOpacity =
    useSharedValue(0);
  const entranceY =
    useSharedValue(12);
  const buttonScale =
    useSharedValue(1);

  useEffect(() => {
    entranceOpacity.value =
      withTiming(1, {
        duration: 400,
        easing: Easing.out(
          Easing.cubic,
        ),
      });

    entranceY.value =
      withTiming(0, {
        duration: 400,
        easing: Easing.out(
          Easing.cubic,
        ),
      });
  }, []);

  const contentAnimatedStyle =
    useAnimatedStyle(() => {
      return {
        opacity:
          entranceOpacity.value,
        transform: [
          {
            translateY:
              entranceY.value,
          },
        ],
      };
    });

  const buttonAnimatedStyle =
    useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale:
              buttonScale.value,
          },
        ],
      };
    });

  const handleButtonPressIn = () => {
    buttonScale.value =
      withSpring(0.97, {
        damping: 14,
        stiffness: 280,
        mass: 0.4,
      });
  };

  const handleButtonPressOut = () => {
    buttonScale.value =
      withSpring(1, {
        damping: 14,
        stiffness: 240,
        mass: 0.4,
      });
  };

  const handleLogin = async () => {
    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      showAlert({
        type: "warning",
        icon: "information-circle-outline",
        title: "Missing Information",
        message:
          "Please enter your email and password.",
        confirmText: "OK",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(
        normalizedEmail,
        password,
      );

      if (!result.success) {
        showAlert({
          type: "danger",
          icon: "close-circle-outline",
          title: "Login Failed",
          message:
            result.message ||
            "Unable to login.",
          confirmText: "OK",
        });
        return;
      }

      // Do not navigate manually.
      // AuthContext updates the authenticated user.
      // RootNavigator switches to AppNavigator automatically.
    } catch (error) {
      console.error(
        "Login screen error:",
        error,
      );

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Login Failed",
        message:
          "Something went wrong. Please try again.",
        confirmText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      bottomOffset={20}
      contentContainerStyle={[styles.scrollContainer, { backgroundColor: screenBackground }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={screenBackground} />
      <AnimatedView
        style={[
          styles.container, { backgroundColor: screenBackground }, contentAnimatedStyle,
        ]}
      >
        {/* Heading */}
        <View style={[styles.headingContainer, { backgroundColor: surfaceColor, borderColor }]}>
          <Text style={[styles.title, { color: textColor }]}>
            Welcome Back
          </Text>

          <Text style={[styles.subtitle, { color: textColor }]}>
            Your memories are waiting for you.
          </Text>
        </View>

        {/* Form */}
        <View style={[styles.formContainer, { backgroundColor: surfaceColor, borderColor }]}>
          {/* Email */}
          <View style={[styles.inputGroup, { backgroundColor: surfaceColor, borderColor }]}>
            <Text style={[styles.label, { color: secondaryTextColor }]}>
              EMAIL
            </Text>

            <View style={[styles.inputWrapper, { backgroundColor: surfaceColor, borderColor,  }]}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.textSecondary || colors.textMuted || "#707080"}
                style={[styles.inputIcon, { backgroundColor: surfaceColor, borderColor }]}
              />

              <TextInput
                style={[styles.input, { backgroundColor: colors.input || surfaceColor, borderColor, color: textColor }]}
                placeholder="your@email.com"
                placeholderTextColor={colors.textMuted || "#A39C92"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Password */}
          <View style={[styles.inputGroup, { backgroundColor: surfaceColor, borderColor }]}>
            <Text style={[styles.label, { color: secondaryTextColor }]}>
              PASSWORD
            </Text>

            <View style={[styles.inputWrapper, { backgroundColor: surfaceColor, borderColor,  }]}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.textSecondary || colors.textMuted || "#707080"}
                style={[styles.inputIcon, { backgroundColor: surfaceColor, borderColor }]}
              />

              <TextInput
                style={[styles.input, { backgroundColor: colors.input || surfaceColor, borderColor, color: textColor }]}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted || "#A39C92"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              <TouchableOpacity
                style={[styles.passwordButton, { backgroundColor: surfaceColor, borderColor,  }]}
                onPress={() =>
                  setShowPassword(
                    (prev) => !prev,
                  )
                }
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={20}
                  color={colors.textSecondary || colors.textMuted || "#707080"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotButton}
            activeOpacity={0.7}
            disabled={isLoading}
            onPress={() =>
              navigation.navigate(
                "ForgotPassword",
              )
            }
          >
            <Text style={[styles.forgotText, { color: secondaryTextColor }]}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <AnimatedView
            style={buttonAnimatedStyle}
          >
            <TouchableOpacity
              style={[
                styles.loginButton, { backgroundColor: colors.primary || "#34345C" }, isLoading && {
                  opacity: 0.7,
                },
              ]}
              onPress={handleLogin}
              onPressIn={
                handleButtonPressIn
              }
              onPressOut={
                handleButtonPressOut
              }
              activeOpacity={1}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <Text
                    style={[styles.loginButtonText, { color: colors.primaryText || "#FFFFFF" }]}
                  >
                    LOGIN
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color="#FFFFFF"
                  />
                </>
              )}
            </TouchableOpacity>
          </AnimatedView>
        </View>

        {/* Tagline */}
        <Text style={[styles.tagline, { color: secondaryTextColor }]}>
          KEEP YOUR MEMORIES CLOSE
        </Text>
      </AnimatedView>
    </KeyboardAwareScrollView>
  );
}

export default LoginScreen;
