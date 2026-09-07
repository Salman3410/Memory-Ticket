import { useEffect, useState } from "react";

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

import styles from "./forgotPasswordStyles";

import { useAuth } from "../../../hooks/useAuth";

function ForgotPasswordScreen({ navigation }) {
  const {
    forgotPassword,
    verifyOtp,
    resetPassword,
  } = useAuth();

  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetToken, setResetToken] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [resendTimer, setResendTimer] = useState(0);

  // --------------------------------------------------
  // OTP RESEND COUNTDOWN
  // --------------------------------------------------

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // --------------------------------------------------
  // CLEAR FEEDBACK
  // --------------------------------------------------

  const clearFeedback = () => {
    setError("");
    setMessage("");
  };

  // --------------------------------------------------
  // SEND OTP
  // --------------------------------------------------

  const handleSendOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      Alert.alert(
        "Missing Email",
        "Please enter your email address.",
      );
      return;
    }

    setLoading(true);
    clearFeedback();

    try {
      const result = await forgotPassword(normalizedEmail);

      if (!result.success) {
        setError(
          result.message ||
            "Unable to process password reset request.",
        );
        return;
      }

      setEmail(normalizedEmail);

      setMessage(
        result.message ||
          "If an account exists with this email, an OTP has been sent.",
      );

      setOtp("");
      setStep("otp");

      // Backend cooldown = 60 seconds.
      setResendTimer(60);
    } catch (error) {
      console.error("Send OTP error:", error);

      setError(
        "Unable to connect to the server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // RESEND OTP
  // --------------------------------------------------

  const handleResendOtp = async () => {
    if (resendTimer > 0 || loading) {
      return;
    }

    setLoading(true);
    clearFeedback();

    try {
      const result = await forgotPassword(
        email.trim().toLowerCase(),
      );

      if (!result.success) {
        setError(
          result.message ||
            "Unable to resend OTP.",
        );
        return;
      }

      setOtp("");

      setMessage(
        "A new OTP has been sent to your email.",
      );

      setResendTimer(60);
    } catch (error) {
      console.error("Resend OTP error:", error);

      setError(
        "Unable to connect to the server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // VERIFY OTP
  // --------------------------------------------------

  const handleVerifyOtp = async () => {
    const cleanedOtp = otp.trim();

    if (!cleanedOtp) {
      Alert.alert(
        "Missing OTP",
        "Please enter the OTP sent to your email.",
      );
      return;
    }

    if (!/^\d{6}$/.test(cleanedOtp)) {
      Alert.alert(
        "Invalid OTP",
        "Please enter the 6-digit OTP.",
      );
      return;
    }

    setLoading(true);
    clearFeedback();

    try {
      const result = await verifyOtp(
        email.trim().toLowerCase(),
        cleanedOtp,
      );

      if (!result.success) {
        setError(
          result.message || "Unable to verify OTP.",
        );
        return;
      }

      const serverResetToken =
        result.data?.resetToken;

      if (!serverResetToken) {
        setError(
          "Reset token was not received from the server.",
        );
        return;
      }

      setResetToken(serverResetToken);

      setOtp("");
      setStep("reset");
    } catch (error) {
      console.error("Verify OTP error:", error);

      setError(
        "Unable to connect to the server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // RESET PASSWORD
  // --------------------------------------------------

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert(
        "Missing Information",
        "Please enter and confirm your new password.",
      );
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Invalid Password",
        "Password must contain 6 or more characters.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Passwords Do Not Match",
        "Please make sure both passwords are the same.",
      );
      return;
    }

    if (!resetToken) {
      Alert.alert(
        "Reset Session Expired",
        "Please request a new OTP and try again.",
      );

      setStep("email");
      return;
    }

    setLoading(true);
    clearFeedback();

    try {
      const result = await resetPassword(
        email.trim().toLowerCase(),
        resetToken,
        newPassword,
      );

      if (!result.success) {
        setError(
          result.message ||
            "Unable to reset password.",
        );
        return;
      }

      setNewPassword("");
      setConfirmPassword("");
      setResetToken("");
      setOtp("");

      setStep("success");
    } catch (error) {
      console.error("Reset password error:", error);

      setError(
        "Unable to connect to the server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // BACK TO LOGIN
  // --------------------------------------------------

  const goToLogin = () => {
    navigation.navigate("Login");
  };

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  const renderBrand = () => (
    <View style={styles.brandContainer}>
      <View style={styles.brandIcon}>
        <Ionicons
          name="ticket-outline"
          size={28}
          color="#FFFFFF"
        />
      </View>

      <Text style={styles.brandText}>
        MEMENTO
      </Text>

      {/* <Text style={styles.brandSubText}>
        TICKET
      </Text> */}
    </View>
  );

  // --------------------------------------------------
  // EMAIL STEP
  // --------------------------------------------------

  const renderEmailStep = () => (
    <>
      <View style={styles.headingContainer}>
        <Text style={styles.title}>
          Forgot Password?
        </Text>

        <Text style={styles.subtitle}>
          Enter your email and we'll send you a
          verification code.
        </Text>
      </View>

      <View style={styles.formContainer}>
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
              editable={!loading}
            />
          </View>
        </View>

        {error ? (
          <Text style={styles.errorText}>
            {error}
          </Text>
        ) : null}

        {message ? (
          <Text style={styles.messageText}>
            {message}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.primaryButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleSendOtp}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>
                SEND OTP
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="#FFFFFF"
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  // --------------------------------------------------
  // OTP STEP
  // --------------------------------------------------

  const renderOtpStep = () => (
    <>
      <View style={styles.headingContainer}>
        <Text style={styles.title}>Verify OTP</Text>

        <Text style={styles.subtitle}>
          Enter the 6-digit OTP sent to{" "}
          <Text style={styles.emailText}>{email}</Text>
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>OTP</Text>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="key-outline"
              size={20}
              color="#707080"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.otpInput}
              placeholder="Enter 6-digit OTP"
              placeholderTextColor="#A39C92"
              value={otp}
              onChangeText={(value) =>
                setOtp(value.replace(/[^0-9]/g, "").slice(0, 6))
              }
              keyboardType="number-pad"
              maxLength={6}
              editable={!loading}
            />
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {message ? <Text style={styles.messageText}>{message}</Text> : null}

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleVerifyOtp}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>VERIFY OTP</Text>

              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.resendSection}>
          <View style={styles.resendContainer}>

            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={resendTimer > 0 || loading}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.resendText,
                  (resendTimer > 0 || loading) && styles.resendDisabled,
                ]}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.spamCheck}>
            Didn't receive the code? Check your spam folder.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => {
            clearFeedback();
            setOtp("");
            setStep("email");
          }}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={16} color="#34345C" />

          <Text style={styles.backLinkText}>Change email</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // --------------------------------------------------
  // RESET PASSWORD STEP
  // --------------------------------------------------

  const renderResetStep = () => (
    <>
      <View style={styles.headingContainer}>
        <Text style={styles.title}>
          New Password
        </Text>

        <Text style={styles.subtitle}>
          Create a new password for your
          Memento account.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            NEW PASSWORD
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
              placeholder="Enter new password"
              placeholderTextColor="#A39C92"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <TouchableOpacity
              style={styles.passwordButton}
              onPress={() =>
                setShowPassword(
                  !showPassword,
                )
              }
              disabled={loading}
              activeOpacity={0.7}
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            CONFIRM PASSWORD
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
              placeholder="Confirm new password"
              placeholderTextColor="#A39C92"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={
                !showConfirmPassword
              }
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <TouchableOpacity
              style={styles.passwordButton}
              onPress={() =>
                setShowConfirmPassword(
                  !showConfirmPassword,
                )
              }
              disabled={loading}
              activeOpacity={0.7}
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

        <Text style={styles.passwordHint}>
          Password must contain 6 or more
          characters.
        </Text>

        {error ? (
          <Text style={styles.errorText}>
            {error}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.primaryButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleResetPassword}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>
                RESET PASSWORD
              </Text>

              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#FFFFFF"
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  // --------------------------------------------------
  // SUCCESS STEP
  // --------------------------------------------------

  const renderSuccessStep = () => (
    <View style={styles.successContainer}>
      <View style={styles.successIcon}>
        <Ionicons
          name="checkmark"
          size={38}
          color="#FFFFFF"
        />
      </View>

      <Text style={styles.successTitle}>
        Password Reset
      </Text>

      <Text style={styles.successText}>
        Your password has been changed
        successfully. You can now log in
        with your new password.
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={goToLogin}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryButtonText}>
          GO TO LOGIN
        </Text>

        <Ionicons
          name="arrow-forward"
          size={20}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </View>
  );

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.scrollContainer
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.topBackButton}
            onPress={goToLogin}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color="#242424"
            />

            <Text style={styles.topBackText}>
              Back to Login
            </Text>
          </TouchableOpacity>

          {renderBrand()}

          {step === "email" &&
            renderEmailStep()}

          {step === "otp" &&
            renderOtpStep()}

          {step === "reset" &&
            renderResetStep()}

          {step === "success" &&
            renderSuccessStep()}

          <Text style={styles.tagline}>
            KEEP YOUR MEMORIES CLOSE
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ForgotPasswordScreen;

