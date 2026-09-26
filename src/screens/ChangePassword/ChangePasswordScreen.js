import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useAuth } from "../../hooks/useAuth";
import { useAppAlert } from "../../context/AlertContext";
import styles from "./changePasswordStyles";

function ChangePasswordScreen({ navigation }) {
  const { changePassword } = useAuth();
  const { showAlert } = useAppAlert();

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
        message:
          "Your new password and confirmation password must match.",
        confirmText: "OK",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await changePassword(
        currentPassword,
        newPassword,
      );

      if (!result.success) {
        showAlert({
          type: "danger",
          icon: "close-circle-outline",
          title: "Password Change Failed",
          message:
            result.message || "Unable to change your password.",
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
        message:
          "Unable to change your password. Please try again.",
        confirmText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        bottomOffset={30}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color="#34345C"
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerEyebrow}>
              ACCOUNT SECURITY
            </Text>

            <Text style={styles.headerTitle}>
              Change Password
            </Text>
          </View>
        </View>

        {/* Intro */}
        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Ionicons
              name="lock-closed-outline"
              size={22}
              color="#34345C"
            />
          </View>

          <View style={styles.introContent}>
            <Text style={styles.introTitle}>
              Keep your account secure
            </Text>

            <Text style={styles.introText}>
              Choose a new password that you don't use anywhere else.
            </Text>
          </View>
        </View>

        {/* Current Password */}
        <Text style={styles.sectionTitle}>
          CURRENT PASSWORD
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={19}
            color="#707080"
          />

          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            placeholderTextColor="#AAA9B3"
            secureTextEntry={!showCurrentPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            returnKeyType="next"
          />

          <TouchableOpacity
            onPress={() =>
              setShowCurrentPassword(
                (previous) => !previous
              )
            }
            activeOpacity={0.7}
            disabled={loading}
          >
            <Ionicons
              name={
                showCurrentPassword
                  ? "eye-off-outline"
                  : "eye-outline"
              }
              size={20}
              color="#707080"
            />
          </TouchableOpacity>
        </View>

        {/* New Password */}
        <Text style={styles.sectionTitle}>
          NEW PASSWORD
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="key-outline"
            size={19}
            color="#707080"
          />

          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            placeholderTextColor="#AAA9B3"
            secureTextEntry={!showNewPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            returnKeyType="next"
          />

          <TouchableOpacity
            onPress={() =>
              setShowNewPassword(
                (previous) => !previous
              )
            }
            activeOpacity={0.7}
            disabled={loading}
          >
            <Ionicons
              name={
                showNewPassword
                  ? "eye-off-outline"
                  : "eye-outline"
              }
              size={20}
              color="#707080"
            />
          </TouchableOpacity>
        </View>

        {/* Requirements */}
        <View style={styles.requirements}>
          <View style={styles.requirementRow}>
            <Ionicons
              name={
                hasMinimumLength
                  ? "checkmark-circle"
                  : "ellipse-outline"
              }
              size={16}
              color={
                hasMinimumLength
                  ? "#E76F51"
                  : "#AAA9B3"
              }
            />

            <Text
              style={[
                styles.requirementText,
                hasMinimumLength &&
                  styles.requirementTextActive,
              ]}
            >
              At least 8 characters
            </Text>
          </View>
        </View>

        {/* Confirm Password */}
        <Text style={styles.sectionTitle}>
          CONFIRM NEW PASSWORD
        </Text>

        <View
          style={[
            styles.inputContainer,
            confirmPassword.length > 0 &&
              !passwordsMatch &&
              styles.inputError,
          ]}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={19}
            color="#707080"
          />

          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor="#AAA9B3"
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={handleChangePassword}
          />

          <TouchableOpacity
            onPress={() =>
              setShowConfirmPassword(
                (previous) => !previous
              )
            }
            activeOpacity={0.7}
            disabled={loading}
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

        {confirmPassword.length > 0 && (
          <View style={styles.matchRow}>
            <Ionicons
              name={
                passwordsMatch
                  ? "checkmark-circle"
                  : "alert-circle-outline"
              }
              size={15}
              color={
                passwordsMatch
                  ? "#E76F51"
                  : "#D9534F"
              }
            />

            <Text
              style={[
                styles.matchText,
                passwordsMatch
                  ? styles.matchTextSuccess
                  : styles.matchTextError,
              ]}
            >
              {passwordsMatch
                ? "Passwords match"
                : "Passwords do not match"}
            </Text>
          </View>
        )}

        {/* Button */}
        <TouchableOpacity
          style={[
            styles.changeButton,
            loading && styles.changeButtonDisabled,
          ]}
          onPress={handleChangePassword}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.changeButtonText}>
                CHANGE PASSWORD
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          MEMENTO • ACCOUNT SECURITY
        </Text>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default ChangePasswordScreen;
