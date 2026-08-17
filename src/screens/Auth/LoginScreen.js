import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./authStyles";

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log("Login:", {
      email,
      password,
    });
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
                />

                <TouchableOpacity
                  style={styles.passwordButton}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
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
              onPress={() => console.log("Forgot password")}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Login */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.loginButtonText}>LOGIN</Text>

              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
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
            >
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom tagline */}
          <Text style={styles.tagline}>KEEP YOUR MEMORIES CLOSE</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
