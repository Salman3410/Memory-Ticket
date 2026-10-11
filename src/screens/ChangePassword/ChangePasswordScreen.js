import React, { useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { useAuth } from "../../hooks/useAuth";
import { useAppAlert } from "../../context/AlertContext";
import { useTheme } from "../../context/ThemeContext";

import styles from "./changePasswordStyles";

function ChangePasswordScreen({ navigation }) {
  const { changePassword } = useAuth();
  const { showAlert } = useAppAlert();

  const { theme, isDark } = useTheme();
  const { colors } = theme;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const hasMinimumLength = newPassword.length >= 8;

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  // --------------------------------------------------
  // THEME COLORS
  // --------------------------------------------------

  const errorBackground = isDark ? "#39252B" : "#F9EEEC";

  // --------------------------------------------------
  // CHANGE PASSWORD
  // --------------------------------------------------

  const handleChangePassword = async () => {
    if (loading) {
      return;
    }

    if (!currentPassword) {
      showAlert({
        type: "warning",
        icon: "lock-closed-outline",
        title: "Current Password Required",
        message: "Please enter your current password.",
        confirmText: "OK",
      });
      return;
    }

    if (!newPassword) {
      showAlert({
        type: "warning",
        icon: "key-outline",
        title: "New Password Required",
        message: "Please enter your new password.",
        confirmText: "OK",
      });
      return;
    }

    if (!hasMinimumLength) {
      showAlert({
        type: "warning",
        icon: "alert-circle-outline",
        title: "Password Too Short",
        message: "Your new password must contain at least 8 characters.",
        confirmText: "OK",
      });
      return;
    }

    if (currentPassword === newPassword) {
      showAlert({
        type: "warning",
        icon: "shield-checkmark-outline",
        title: "Invalid Password",
        message:
          "Your new password must be different from your current password.",
        confirmText: "OK",
      });
      return;
    }

    if (!confirmPassword) {
      showAlert({
        type: "warning",
        icon: "shield-checkmark-outline",
        title: "Confirm Your Password",
        message: "Please confirm your new password.",
        confirmText: "OK",
      });
      return;
    }

    if (!passwordsMatch) {
      showAlert({
        type: "warning",
        icon: "alert-circle-outline",
        title: "Passwords Don't Match",
        message: "Your new password and confirmation password must match.",
        confirmText: "OK",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await changePassword(currentPassword, newPassword);

      if (!result.success) {
        showAlert({
          type: "danger",
          icon: "close-circle-outline",
          title: "Password Change Failed",
          message: result.message || "Unable to change your password.",
          confirmText: "OK",
        });
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      showAlert({
        type: "success",
        icon: "checkmark-circle-outline",
        title: "Password Changed",
        message:
          "Your password has been changed successfully. Please log in again.",
        confirmText: "OK",
      });
    } catch (error) {
      console.error("Change password screen error:", error);

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Something Went Wrong",
        message: "Unable to change your password. Please try again.",
        confirmText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // REUSABLE PASSWORD INPUT
  // --------------------------------------------------

  const renderPasswordInput = ({
    icon,
    value,
    onChangeText,
    placeholder,
    visible,
    toggleVisibility,
    returnKeyType = "next",
    error = false,
    onSubmitEditing,
  }) => (
    <View
      style={[
        styles.inputContainer,
        {
          backgroundColor: error ? errorBackground : colors.input,
          borderColor: error ? colors.danger : colors.border,
          borderWidth: 1,
        },
      ]}
    >
      <Ionicons name={icon} size={17} color={colors.iconMuted} />

      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
      />

      <TouchableOpacity
        onPress={toggleVisibility}
        activeOpacity={0.7}
        disabled={loading}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={visible ? "Hide password" : "Show password"}
      >
        <Ionicons
          name={visible ? "eye-off-outline" : "eye-outline"}
          size={18}
          color={colors.iconMuted}
        />
      </TouchableOpacity>
    </View>
  );

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <KeyboardAwareScrollView
        bottomOffset={30}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={21} color={colors.icon} />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={[styles.headerEyebrow, { color: colors.accent }]}>
              ACCOUNT SECURITY
            </Text>

            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Change Password
            </Text>
          </View>
        </View>

        {/* INTRO */}

        <View
          style={[
            styles.introCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
            },
          ]}
        >
          <View
            style={[
              styles.introIcon,
              {
                backgroundColor: colors.surfaceSecondary,
              },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={21}
              color={colors.icon}
            />
          </View>

          <View style={styles.introContent}>
            <Text style={[styles.introTitle, { color: colors.text }]}>
              Keep your account secure
            </Text>

            <Text style={[styles.introText, { color: colors.textSecondary }]}>
              Choose a new password that you don't use anywhere else.
            </Text>
          </View>
        </View>

        {/* CURRENT PASSWORD */}

        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          CURRENT PASSWORD
        </Text>

        {renderPasswordInput({
          icon: "lock-closed-outline",
          value: currentPassword,
          onChangeText: setCurrentPassword,
          placeholder: "Enter current password",
          visible: showCurrentPassword,
          toggleVisibility: () =>
            setShowCurrentPassword((previous) => !previous),
        })}

        {/* NEW PASSWORD */}

        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          NEW PASSWORD
        </Text>

        {renderPasswordInput({
          icon: "key-outline",
          value: newPassword,
          onChangeText: setNewPassword,
          placeholder: "Enter new password",
          visible: showNewPassword,
          toggleVisibility: () => setShowNewPassword((previous) => !previous),
        })}

        {/* PASSWORD REQUIREMENTS */}

        <View style={styles.requirements}>
          <View style={styles.requirementRow}>
            <Ionicons
              name={hasMinimumLength ? "checkmark-circle" : "ellipse-outline"}
              size={16}
              color={hasMinimumLength ? colors.accent : colors.textMuted}
            />

            <Text
              style={[
                styles.requirementText,
                {
                  color: hasMinimumLength ? colors.text : colors.textMuted,
                },
                hasMinimumLength && styles.requirementTextActive,
              ]}
            >
              At least 8 characters
            </Text>
          </View>
        </View>

        {/* CONFIRM PASSWORD */}

        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          CONFIRM NEW PASSWORD
        </Text>

        {renderPasswordInput({
          icon: "shield-checkmark-outline",
          value: confirmPassword,
          onChangeText: setConfirmPassword,
          placeholder: "Confirm new password",
          visible: showConfirmPassword,
          toggleVisibility: () =>
            setShowConfirmPassword((previous) => !previous),
          returnKeyType: "done",
          onSubmitEditing: handleChangePassword,
          error: confirmPassword.length > 0 && !passwordsMatch,
        })}

        {/* PASSWORD MATCH */}

        {confirmPassword.length > 0 && (
          <View style={styles.matchRow}>
            <Ionicons
              name={
                passwordsMatch ? "checkmark-circle" : "alert-circle-outline"
              }
              size={15}
              color={passwordsMatch ? colors.accent : colors.danger}
            />

            <Text
              style={[
                styles.matchText,
                {
                  color: passwordsMatch ? colors.accent : colors.danger,
                },
              ]}
            >
              {passwordsMatch ? "Passwords match" : "Passwords do not match"}
            </Text>
          </View>
        )}

        {/* BUTTON */}

        <TouchableOpacity
          style={[
            styles.changeButton,
            {
              backgroundColor: colors.primary,
              opacity: loading ? 0.6 : 1,
            },
          ]}
          onPress={handleChangePassword}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.primaryText} />
          ) : (
            <>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={colors.primaryText}
              />

              <Text
                style={[styles.changeButtonText, { color: colors.primaryText }]}
              >
                CHANGE PASSWORD
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* FOOTER */}

        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          MEMENTO • ACCOUNT SECURITY
        </Text>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default ChangePasswordScreen;
