import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "./changePasswordStyles";

function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // PASSWORD VALIDATION
  // --------------------------------------------------

  const hasMinimumLength = newPassword.length >= 8;

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  // --------------------------------------------------
  // CHANGE PASSWORD
  // --------------------------------------------------

  const handleChangePassword = async () => {
    if (loading) {
      return;
    }

    // Current password
    if (!currentPassword) {
      Alert.alert(
        "Current Password Required",
        "Please enter your current password.",
      );
      return;
    }

    // New password
    if (!newPassword) {
      Alert.alert("New Password Required", "Please enter your new password.");
      return;
    }

    // Minimum length
    if (!hasMinimumLength) {
      Alert.alert(
        "Password Too Short",
        "Your new password must contain at least 8 characters.",
      );
      return;
    }

    // Same password
    if (currentPassword === newPassword) {
      Alert.alert(
        "Invalid Password",
        "Your new password must be different from your current password.",
      );
      return;
    }

    // Confirmation
    if (!confirmPassword) {
      Alert.alert("Confirm Your Password", "Please confirm your new password.");
      return;
    }

    if (!passwordsMatch) {
      Alert.alert(
        "Passwords Don't Match",
        "Your new password and confirmation password must match.",
      );
      return;
    }

    try {
      setLoading(true);

      // ----------------------------------------------
      // GET CURRENT USER
      // ----------------------------------------------

      const storedUser = await AsyncStorage.getItem("user");

      if (!storedUser) {
        Alert.alert(
          "Account Error",
          "We couldn't find your account information.",
        );
        return;
      }

      const user = JSON.parse(storedUser);

      // ----------------------------------------------
      // VERIFY CURRENT PASSWORD
      // ----------------------------------------------

      if (user.password !== currentPassword) {
        Alert.alert(
          "Incorrect Password",
          "The current password you entered is incorrect.",
        );
        return;
      }

      // ----------------------------------------------
      // UPDATE PASSWORD
      // ----------------------------------------------

      const updatedUser = {
        ...user,
        password: newPassword,
      };

      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      // ----------------------------------------------
      // SUCCESS
      // ----------------------------------------------

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      Alert.alert(
        "Password Changed",
        "Your password has been changed successfully.",
        [
          {
            text: "Done",
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.log("Change password error:", error);

      Alert.alert(
        "Something Went Wrong",
        "Unable to change your password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* --------------------------------------------------
            HEADER
        -------------------------------------------------- */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={21} color="#34345C" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerEyebrow}>ACCOUNT SECURITY</Text>

            <Text style={styles.headerTitle}>Change Password</Text>
          </View>
        </View>

        {/* --------------------------------------------------
            INTRO
        -------------------------------------------------- */}

        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Ionicons name="lock-closed-outline" size={22} color="#34345C" />
          </View>

          <View style={styles.introContent}>
            <Text style={styles.introTitle}>Keep your account secure</Text>

            <Text style={styles.introText}>
              Choose a new password that you don't use anywhere else.
            </Text>
          </View>
        </View>

        {/* --------------------------------------------------
            CURRENT PASSWORD
        -------------------------------------------------- */}

        <Text style={styles.sectionTitle}>CURRENT PASSWORD</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={19} color="#707080" />

          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            placeholderTextColor="#AAA9B3"
            secureTextEntry={!showCurrentPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            onPress={() => setShowCurrentPassword((previous) => !previous)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#707080"
            />
          </TouchableOpacity>
        </View>

        {/* --------------------------------------------------
            NEW PASSWORD
        -------------------------------------------------- */}

        <Text style={styles.sectionTitle}>NEW PASSWORD</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="key-outline" size={19} color="#707080" />

          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            placeholderTextColor="#AAA9B3"
            secureTextEntry={!showNewPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            onPress={() => setShowNewPassword((previous) => !previous)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showNewPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#707080"
            />
          </TouchableOpacity>
        </View>

        {/* --------------------------------------------------
            PASSWORD REQUIREMENTS
        -------------------------------------------------- */}

        <View style={styles.requirements}>
          <View style={styles.requirementRow}>
            <Ionicons
              name={hasMinimumLength ? "checkmark-circle" : "ellipse-outline"}
              size={16}
              color={hasMinimumLength ? "#E76F51" : "#AAA9B3"}
            />

            <Text
              style={[
                styles.requirementText,
                hasMinimumLength && styles.requirementTextActive,
              ]}
            >
              At least 8 characters
            </Text>
          </View>
        </View>

        {/* --------------------------------------------------
            CONFIRM PASSWORD
        -------------------------------------------------- */}

        <Text style={styles.sectionTitle}>CONFIRM NEW PASSWORD</Text>

        <View
          style={[
            styles.inputContainer,
            confirmPassword.length > 0 && !passwordsMatch && styles.inputError,
          ]}
        >
          <Ionicons name="shield-checkmark-outline" size={19} color="#707080" />

          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor="#AAA9B3"
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            onPress={() => setShowConfirmPassword((previous) => !previous)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#707080"
            />
          </TouchableOpacity>
        </View>

        {confirmPassword.length > 0 && (
          <View style={styles.matchRow}>
            <Ionicons
              name={
                passwordsMatch ? "checkmark-circle" : "alert-circle-outline"
              }
              size={15}
              color={passwordsMatch ? "#E76F51" : "#D9534F"}
            />

            <Text
              style={[
                styles.matchText,
                passwordsMatch
                  ? styles.matchTextSuccess
                  : styles.matchTextError,
              ]}
            >
              {passwordsMatch ? "Passwords match" : "Passwords do not match"}
            </Text>
          </View>
        )}

        {/* --------------------------------------------------
            CHANGE PASSWORD BUTTON
        -------------------------------------------------- */}

        <TouchableOpacity
          style={[styles.changeButton, loading && styles.changeButtonDisabled]}
          onPress={handleChangePassword}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Ionicons name="lock-closed-outline" size={18} color="#FFFFFF" />

          <Text style={styles.changeButtonText}>
            {loading ? "CHANGING PASSWORD..." : "CHANGE PASSWORD"}
          </Text>
        </TouchableOpacity>

        {/* --------------------------------------------------
            FOOTER
        -------------------------------------------------- */}

        <Text style={styles.footerText}>MEMORY TICKET • ACCOUNT SECURITY</Text>
      </ScrollView>
    </View>
  );
}

export default ChangePasswordScreen;
