import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
import { useAppAlert } from "../../context/AlertContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const AnimatedView =
  Animated.createAnimatedComponent(View);

function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  const { showAlert } = useAppAlert();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
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
  // Signup
  // =========================
  const handleSignup = async () => {
    const trimmedName =
      name.trim();

    const normalizedEmail =
      email.trim().toLowerCase();

    // Name
    if (!trimmedName) {
      showAlert({
        type: "warning",
        icon: "person-outline",
        title: "Name Required",
        message: "Please enter your name.",
        confirmText: "OK",
      });
      return;
    }

    // Email
    if (!normalizedEmail) {
      showAlert({
        type: "warning",
        icon: "mail-outline",
        title: "Email Required",
        message: "Please enter your email address.",
        confirmText: "OK",
      });
      return;
    }

    // Basic email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      showAlert({
        type: "warning",
        icon: "mail-outline",
        title: "Invalid Email",
        message: "Please enter a valid email address.",
        confirmText: "OK",
      });
      return;
    }

    // Password
    if (!password) {
      showAlert({
        type: "warning",
        icon: "lock-closed-outline",
        title: "Password Required",
        message: "Please create a password.",
        confirmText: "OK",
      });
      return;
    }

    if (password.length < 8) {
      showAlert({
        type: "warning",
        icon: "shield-checkmark-outline",
        title: "Weak Password",
        message: "Password must be at least 8 characters.",
        confirmText: "OK",
      });
      return;
    }

    // Confirm Password
    if (!confirmPassword) {
      showAlert({
        type: "warning",
        icon: "shield-checkmark-outline",
        title: "Confirm Password",
        message: "Please confirm your password.",
        confirmText: "OK",
      });
      return;
    }

    if (password !== confirmPassword) {
      showAlert({
        type: "warning",
        icon: "alert-circle-outline",
        title: "Passwords Don't Match",
        message:
          "Please make sure both passwords are the same.",
        confirmText: "OK",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(
        trimmedName,
        normalizedEmail,
        password,
      );

      if (!result.success) {
        showAlert({
          type: "danger",
          icon: "close-circle-outline",
          title: "Signup Failed",
          message:
            result.message ||
            "Unable to start account creation.",
          confirmText: "OK",
        });
        return;
      }

      navigation.navigate(
        "VerifySignupOtp",
        {
          email: normalizedEmail,
        },
      );
    } catch (error) {
      console.error(
        "Signup screen error:",
        error,
      );

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Signup Failed",
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
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Start turning your moments into memories.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              NAME
            </Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#707080"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor="#A39C92"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isLoading}
                returnKeyType="next"
              />
            </View>
          </View>

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
                placeholder="Create a password"
                placeholderTextColor="#A39C92"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={
                  !showPassword
                }
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                returnKeyType="next"
              />

              <TouchableOpacity
                style={
                  styles.passwordButton
                }
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

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              CONFIRM PASSWORD
            </Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#707080"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#A39C92"
                value={confirmPassword}
                onChangeText={
                  setConfirmPassword
                }
                secureTextEntry={
                  !showConfirmPassword
                }
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                returnKeyType="done"
                onSubmitEditing={
                  handleSignup
                }
              />

              <TouchableOpacity
                style={
                  styles.passwordButton
                }
                onPress={() =>
                  setShowConfirmPassword(
                    (prev) => !prev,
                  )
                }
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <Ionicons
                  name={
                    showConfirmPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={20}
                  color="#707080"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Signup Button */}
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
              onPress={handleSignup}
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
                    CREATE ACCOUNT
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
          YOUR STORY STARTS HERE
        </Text>
      </AnimatedView>
    </KeyboardAwareScrollView>
  );
}

export default SignupScreen;
