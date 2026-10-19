
import { useEffect, useMemo, useState } from "react";

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

import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { useAppAlert } from "../../context/AlertContext";
import { createAuthStyles } from "./authStyles";

const AnimatedView = Animated.createAnimatedComponent(View);

function LoginScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};

  const styles = useMemo(
    () => createAuthStyles(colors, isDark),
    [colors, isDark],
  );

  const screenBackground =
    colors.background || (isDark ? "#171624" : "#F1F0F6");

  const surfaceColor =
    colors.surface || (isDark ? "#211F30" : "#FFFFFF");

  const textColor =
    colors.text || (isDark ? "#F7F5FC" : "#242424");

  const secondaryTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#C4C0D0" : "#707080");

  const borderColor =
    colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const inputBackground =
    colors.input || surfaceColor;

  const primaryColor =
    colors.primary || (isDark ? "#C8C2FF" : "#34345C");

  const primaryTextColor =
    colors.primaryText || (isDark ? "#25223D" : "#FFFFFF");

  const { login } = useAuth();
  const { showAlert } = useAppAlert();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const entranceOpacity = useSharedValue(0);
  const entranceY = useSharedValue(12);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    entranceOpacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });

    entranceY.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  }, [entranceOpacity, entranceY]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: entranceOpacity.value,
    transform: [{ translateY: entranceY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleButtonPressIn = () => {
    buttonScale.value = withSpring(0.97, {
      damping: 14,
      stiffness: 280,
      mass: 0.4,
    });
  };

  const handleButtonPressOut = () => {
    buttonScale.value = withSpring(1, {
      damping: 14,
      stiffness: 240,
      mass: 0.4,
    });
  };

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      showAlert({
        type: "warning",
        icon: "information-circle-outline",
        title: "Missing Information",
        message: "Please enter your email and password.",
        confirmText: "OK",
      });

      return;
    }

    setIsLoading(true);

    try {
      const result = await login(normalizedEmail, password);

      if (!result.success) {
        showAlert({
          type: "danger",
          icon: "close-circle-outline",
          title: "Login Failed",
          message: result.message || "Unable to login.",
          confirmText: "OK",
        });

        return;
      }

      // AuthContext updates authentication state.
      // RootNavigator handles navigation automatically.
    } catch (error) {
      console.error("Login screen error:", error);

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Login Failed",
        message: "Something went wrong. Please try again.",
        confirmText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      bottomOffset={20}
      contentContainerStyle={[
        styles.scrollContainer,
        { backgroundColor: screenBackground },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={screenBackground}
      />

      <AnimatedView
        style={[
          styles.container,
          { backgroundColor: screenBackground },
          contentAnimatedStyle,
        ]}
      >
        {/* HEADING */}

        <View style={styles.headingContainer}>
          <Text style={[styles.title, { color: textColor }]}>
            Welcome Back
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: secondaryTextColor },
            ]}
          >
            Your memories are waiting for you.
          </Text>
        </View>

        {/* FORM */}

        <View style={styles.formContainer}>
          {/* EMAIL */}

          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.label,
                { color: secondaryTextColor },
              ]}
            >
              EMAIL
            </Text>

            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: inputBackground,
                  borderColor,
                },
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={secondaryTextColor}
                style={styles.inputIcon}
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBackground,
                    color: textColor,
                  },
                ]}
                placeholder="your@email.com"
                placeholderTextColor={
                  colors.textMuted || secondaryTextColor
                }
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

          {/* PASSWORD */}

          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.label,
                { color: secondaryTextColor },
              ]}
            >
              PASSWORD
            </Text>

            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: inputBackground,
                  borderColor,
                },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={secondaryTextColor}
                style={styles.inputIcon}
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBackground,
                    color: textColor,
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={
                  colors.textMuted || secondaryTextColor
                }
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
                style={[
                  styles.passwordButton,
                  { backgroundColor: inputBackground },
                ]}
                onPress={() => setShowPassword((previous) => !previous)}
                activeOpacity={0.7}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={20}
                  color={secondaryTextColor}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* FORGOT PASSWORD */}

          <TouchableOpacity
            style={styles.forgotButton}
            activeOpacity={0.7}
            disabled={isLoading}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text
              style={[
                styles.forgotText,
                { color: primaryColor },
              ]}
            >
              Forgot password?
            </Text>
          </TouchableOpacity>

          {/* LOGIN BUTTON */}

          <AnimatedView style={buttonAnimatedStyle}>
            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: primaryColor },
                isLoading && { opacity: 0.7 },
              ]}
              onPress={handleLogin}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              activeOpacity={1}
              disabled={isLoading}
              accessibilityRole="button"
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={primaryTextColor}
                />
              ) : (
                <>
                  <Text
                    style={[
                      styles.loginButtonText,
                      { color: primaryTextColor },
                    ]}
                  >
                    LOGIN
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={primaryTextColor}
                  />
                </>
              )}
            </TouchableOpacity>
          </AnimatedView>
        </View>

        {/* TAGLINE */}

        <Text
          style={[
            styles.tagline,
            { color: secondaryTextColor },
          ]}
        >
          KEEP YOUR MEMORIES CLOSE
        </Text>
      </AnimatedView>
    </KeyboardAwareScrollView>
  );
}

export default LoginScreen;
