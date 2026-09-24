import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
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
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const AnimatedView =
  Animated.createAnimatedComponent(View);

function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  // =========================
  // Entrance Animation
  // =========================

  const entranceOpacity =
    useSharedValue(0);

  const entranceY =
    useSharedValue(12);

  // =========================
  // Button Animation
  // =========================

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

  // =========================
  // Login
  // =========================

  const handleLogin = async () => {
    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter your email and password.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(
        normalizedEmail,
        password,
      );

      if (!result.success) {
        Alert.alert(
          "Login Failed",
          result.message ||
            "Unable to login.",
        );
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

      Alert.alert(
        "Login Failed",
        "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      bottomOffset={20}
      contentContainerStyle={
        styles.scrollContainer
      }
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <AnimatedView
        style={[
          styles.container,
          contentAnimatedStyle,
        ]}
      >
        {/* Heading */}
        <View style={styles.headingContainer}>
          <Text style={styles.title}>
            Welcome Back
          </Text>

          <Text style={styles.subtitle}>
            Your memories are waiting for you.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              EMAIL
            </Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#707080"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#A39C92"
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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              PASSWORD
            </Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#707080"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#A39C92"
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
                style={styles.passwordButton}
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
                  color="#707080"
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
            <Text style={styles.forgotText}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <AnimatedView
            style={buttonAnimatedStyle}
          >
            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && {
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
                    style={
                      styles.loginButtonText
                    }
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
        <Text style={styles.tagline}>
          KEEP YOUR MEMORIES CLOSE
        </Text>
      </AnimatedView>
    </KeyboardAwareScrollView>
  );
}

export default LoginScreen;
