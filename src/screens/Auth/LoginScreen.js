import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "./authStyles";

import { useAuth } from "../../hooks/useAuth";

function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter your email and password.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(normalizedEmail, password);

      if (!result.success) {
        Alert.alert("Login Failed", result.message || "Unable to login.");
        return;
      }

      // Do NOT navigate manually.
      // AuthContext updates the authenticated user.
      // RootNavigator should switch to the authenticated app automatically.
    } catch (error) {
      console.error("Login screen error:", error);

      Alert.alert("Login Failed", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Brand */}
          <View style={styles.brandContainer}>
            <View style={styles.brandIcon}>
              <Ionicons name="ticket-outline" size={28} color="#FFFFFF" />
            </View>

            <Text style={styles.brandText}>MEMORY</Text>
            <Text style={styles.brandSubText}>TICKET</Text>
          </View>

          {/* Heading */}
          <View style={styles.headingContainer}>
            <Text style={styles.title}>Welcome Back</Text>

            <Text style={styles.subtitle}>
              Your memories are waiting for you.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
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

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotButton}
              activeOpacity={0.7}
              disabled={isLoading}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Login */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && { opacity: 0.7 }]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>LOGIN</Text>

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

          {/* Signup */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Signup")}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Tagline */}
          <Text style={styles.tagline}>KEEP YOUR MEMORIES CLOSE</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
