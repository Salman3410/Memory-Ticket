import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "./authStyles";

import { useAuth } from "../../hooks/useAuth";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

function SignupScreen({ navigation }) {
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Name
    if (!trimmedName) {
      Alert.alert("Name Required", "Please enter your name.");
      return;
    }

    // Email
    if (!normalizedEmail) {
      Alert.alert("Email Required", "Please enter your email address.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    // Password
    if (!password) {
      Alert.alert("Password Required", "Please create a password.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Weak Password", "Password must be at least 8 characters.");
      return;
    }

    // Confirm password
    if (!confirmPassword) {
      Alert.alert("Confirm Password", "Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Passwords Don't Match",
        "Please make sure both passwords are the same.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(trimmedName, normalizedEmail, password);

      if (!result.success) {
        Alert.alert(
          "Signup Failed",
          result.message || "Unable to start account creation.",
        );
        return;
      }

      navigation.navigate("VerifySignupOtp", {
        email: normalizedEmail,
      });
    } catch (error) {
      console.error("Signup screen error:", error);

      Alert.alert("Signup Failed", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      bottomOffset={20}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Ionicons name="arrow-back" size={22} color="#242424" />

            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          {/* Brand */}
          <View style={styles.brandContainer}>
            <View style={styles.brandIcon}>
              <Image
                source={require("../../../assets/icon.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.brandText}>MEMENTO</Text>
          </View>

          {/* Heading */}
          <View style={styles.headingContainer}>
            <Text style={styles.title}>Create Account</Text>

            <Text style={styles.subtitle}>
              Start turning your moments into memories.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NAME</Text>

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
              <Text style={styles.label}>EMAIL</Text>

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
              <Text style={styles.label}>PASSWORD</Text>

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
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  returnKeyType="next"
                />

                <TouchableOpacity
                  style={styles.passwordButton}
                  onPress={() => setShowPassword((prev) => !prev)}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#707080"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CONFIRM PASSWORD</Text>

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
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  returnKeyType="done"
                  onSubmitEditing={handleSignup}
                />

                <TouchableOpacity
                  style={styles.passwordButton}
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="#707080"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && { opacity: 0.7 }]}
              onPress={handleSignup}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>CREATE ACCOUNT</Text>

                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />

            <View style={styles.dividerIcon}>
              <Text style={styles.dividerStar}>✦</Text>
            </View>

            <View style={styles.dividerLine} />
          </View>

          {/* Login */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Already have an account?</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text style={styles.signupLink}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* Tagline */}
          <Text style={styles.tagline}>YOUR STORY STARTS HERE</Text>
        </View>
    </KeyboardAwareScrollView>
  );
}

export default SignupScreen;
