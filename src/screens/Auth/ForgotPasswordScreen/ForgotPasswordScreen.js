import { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,

  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./forgotPasswordStyles";
import { useAuth } from "../../../hooks/useAuth";
import { useAppAlert } from "../../../context/AlertContext";

function ForgotPasswordScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};
  const screenBackground = colors.background || (isDark ? "#171624" : "#F1F0F6");
  const surfaceColor = colors.surface || (isDark ? "#211F30" : "#FFFFFF");
  const textColor = colors.text || (isDark ? "#F7F5FC" : "#242424");
  const secondaryTextColor = colors.textSecondary || colors.textMuted || (isDark ? "#C4C0D0" : "#707080");
  const borderColor = colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const { forgotPassword, verifyOtp, resetPassword } = useAuth();
  const { showAlert } = useAppAlert();

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

  const clearFeedback = () => {
    setError("");
    setMessage("");
  };

  const handleSendOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      showAlert({
        type: "warning",
        icon: "mail-outline",
        title: "Missing Email",
        message: "Please enter your email address.",
        confirmText: "OK",
      });

      return;
    }

    setLoading(true);
    clearFeedback();

    try {
      const result = await forgotPassword(normalizedEmail);

      if (!result.success) {
        setError(result.message || "Unable to process password reset request.");

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

      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || loading) {
      return;
    }

    setLoading(true);
    clearFeedback();

    try {
      const result = await forgotPassword(email.trim().toLowerCase());

      if (!result.success) {
        setError(result.message || "Unable to resend OTP.");

        return;
      }

      setOtp("");

      setMessage("A new OTP has been sent to your email.");

      setResendTimer(60);
    } catch (error) {
      console.error("Resend OTP error:", error);

      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const cleanedOtp = otp.trim();

    if (!cleanedOtp) {
      showAlert({
        type: "warning",
        icon: "key-outline",
        title: "Missing OTP",
        message: "Please enter the OTP sent to your email.",
        confirmText: "OK",
      });

      return;
    }

    if (!/^\d{6}$/.test(cleanedOtp)) {
      showAlert({
        type: "warning",
        icon: "shield-checkmark-outline",
        title: "Invalid OTP",
        message: "Please enter the 6-digit OTP.",
        confirmText: "OK",
      });

      return;
    }

    setLoading(true);
    clearFeedback();

    try {
      const result = await verifyOtp(email.trim().toLowerCase(), cleanedOtp);

      if (!result.success) {
        setError(result.message || "Unable to verify OTP.");

        return;
      }

      const serverResetToken = result.data?.resetToken;

      if (!serverResetToken) {
        setError("Reset token was not received from the server.");

        return;
      }

      setResetToken(serverResetToken);
      setOtp("");
      setStep("reset");
    } catch (error) {
      console.error("Verify OTP error:", error);

      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showAlert({
        type: "warning",
        icon: "information-circle-outline",
        title: "Missing Information",
        message: "Please enter and confirm your new password.",
        confirmText: "OK",
      });

      return;
    }

    if (newPassword.length < 8) {
      showAlert({
        type: "warning",
        icon: "lock-closed-outline",
        title: "Invalid Password",
        message: "Password must contain 8 or more characters.",
        confirmText: "OK",
      });

      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert({
        type: "warning",
        icon: "alert-circle-outline",
        title: "Passwords Do Not Match",
        message: "Please make sure both passwords are the same.",
        confirmText: "OK",
      });

      return;
    }

    if (!resetToken) {
      showAlert({
        type: "danger",
        icon: "time-outline",
        title: "Reset Session Expired",
        message: "Please request a new OTP and try again.",
        confirmText: "OK",
        onConfirm: () => {
          setStep("email");
        },
      });

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
        setError(result.message || "Unable to reset password.");

        return;
      }

      setNewPassword("");
      setConfirmPassword("");
      setResetToken("");
      setOtp("");
      setStep("success");
    } catch (error) {
      console.error("Reset password error:", error);

      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigation.navigate("AuthTabs");
  };

  const renderBrand = () => (
    <View style={[styles.brandContainer, { backgroundColor: surfaceColor, borderColor }]}>
      <View style={[styles.brandIcon, { backgroundColor: surfaceColor, borderColor }]}>
        <Image
          source={require("../../../../assets/icon.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <Text style={[styles.brandText, { color: colors.primaryText || "#FFFFFF" }]}>MEMENTO</Text>
    </View>
  );

  const renderEmailStep = () => (
    <>
      <View style={[styles.headingContainer, { backgroundColor: surfaceColor, borderColor }]}>
        <Text style={[styles.title, { color: textColor }]}>Forgot Password?</Text>

        <Text style={[styles.subtitle, { color: textColor }]}>
          Enter your email and we'll send you a verification code.
        </Text>
      </View>

      <View style={[styles.formContainer, { backgroundColor: surfaceColor, borderColor }]}>
        <View style={[styles.inputGroup, { backgroundColor: surfaceColor, borderColor }]}>
          <Text style={[styles.label, { color: secondaryTextColor }]}>EMAIL</Text>

          <View style={[styles.inputWrapper, { backgroundColor: surfaceColor, borderColor,  }]}>
            <Ionicons name="mail-outline" size={17} color="#7E7E88" />

            <TextInput
              style={[styles.input, { backgroundColor: colors.input || surfaceColor, borderColor, color: textColor }]}
              placeholder="your@email.com"
              placeholderTextColor={colors.textMuted || "#9A9AA3"}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>
        </View>

        {error ? <Text style={[styles.errorText, { color: secondaryTextColor }]}>{error}</Text> : null}

        {message ? <Text style={[styles.messageText, { color: secondaryTextColor }]}>{message}</Text> : null}

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleSendOtp}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={[styles.primaryButtonText, { color: colors.primaryText || "#FFFFFF" }]}>SEND OTP</Text>

              <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  const renderOtpStep = () => (
    <>
      <View style={[styles.headingContainer, { backgroundColor: surfaceColor, borderColor }]}>
        <Text style={[styles.title, { color: textColor }]}>Verify OTP</Text>

        <Text style={[styles.subtitle, { color: textColor }]}>
          Enter the 6-digit OTP sent to{" "}
          <Text style={[styles.emailText, { color: secondaryTextColor }]}>{email}</Text>
        </Text>
      </View>

      <View style={[styles.formContainer, { backgroundColor: surfaceColor, borderColor }]}>
        <View style={[styles.inputGroup, { backgroundColor: surfaceColor, borderColor }]}>
          <Text style={[styles.label, { color: secondaryTextColor }]}>OTP</Text>

          <View style={[styles.inputWrapper, { backgroundColor: surfaceColor, borderColor,  }]}>
            <Ionicons name="key-outline" size={17} color="#7E7E88" />

            <TextInput
              style={styles.otpInput}
              placeholder="Enter 6-digit OTP"
              placeholderTextColor={colors.textMuted || "#9A9AA3"}
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

        {error ? <Text style={[styles.errorText, { color: secondaryTextColor }]}>{error}</Text> : null}

        {message ? <Text style={[styles.messageText, { color: secondaryTextColor }]}>{message}</Text> : null}

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
              <Text style={[styles.primaryButtonText, { color: colors.primaryText || "#FFFFFF" }]}>VERIFY OTP</Text>

              <Ionicons name="checkmark" size={19} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <View style={[styles.resendSection, { backgroundColor: surfaceColor, borderColor }]}>
          <View style={[styles.resendContainer, { backgroundColor: surfaceColor, borderColor }]}>
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
          <Ionicons name="arrow-back" size={16} color={colors.primary || "#34345C"} />

          <Text style={[styles.backLinkText, { color: secondaryTextColor }]}>Change email</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderResetStep = () => (
    <>
      <View style={[styles.headingContainer, { backgroundColor: surfaceColor, borderColor }]}>
        <Text style={[styles.title, { color: textColor }]}>New Password</Text>

        <Text style={[styles.subtitle, { color: textColor }]}>
          Create a new password for your Memento account.
        </Text>
      </View>

      <View style={[styles.formContainer, { backgroundColor: surfaceColor, borderColor }]}>
        <View style={[styles.inputGroup, { backgroundColor: surfaceColor, borderColor }]}>
          <Text style={[styles.label, { color: secondaryTextColor }]}>NEW PASSWORD</Text>

          <View style={[styles.inputWrapper, { backgroundColor: surfaceColor, borderColor,  }]}>
            <Ionicons name="lock-closed-outline" size={17} color="#7E7E88" />

            <TextInput
              style={[styles.input, { backgroundColor: colors.input || surfaceColor, borderColor, color: textColor }]}
              placeholder="Enter new password"
              placeholderTextColor={colors.textMuted || "#9A9AA3"}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.passwordButton, { backgroundColor: surfaceColor, borderColor,  }]}
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
              activeOpacity={0.7}
              hitSlop={6}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#7E7E88"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.inputGroup, { backgroundColor: surfaceColor, borderColor }]}>
          <Text style={[styles.label, { color: secondaryTextColor }]}>CONFIRM PASSWORD</Text>

          <View style={[styles.inputWrapper, { backgroundColor: surfaceColor, borderColor,  }]}>
            <Ionicons name="lock-closed-outline" size={17} color="#7E7E88" />

            <TextInput
              style={[styles.input, { backgroundColor: colors.input || surfaceColor, borderColor, color: textColor }]}
              placeholder="Confirm new password"
              placeholderTextColor={colors.textMuted || "#9A9AA3"}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.passwordButton, { backgroundColor: surfaceColor, borderColor,  }]}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
              activeOpacity={0.7}
              hitSlop={6}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#7E7E88"
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.passwordHint, { color: secondaryTextColor }]}>
          Password must contain 8 or more characters.
        </Text>

        {error ? <Text style={[styles.errorText, { color: secondaryTextColor }]}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleResetPassword}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={[styles.primaryButtonText, { color: colors.primaryText || "#FFFFFF" }]}>RESET PASSWORD</Text>

              <Ionicons
                name="checkmark-circle-outline"
                size={19}
                color="#FFFFFF"
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  const renderSuccessStep = () => (
    <View style={[styles.successContainer, { backgroundColor: surfaceColor, borderColor }]}>
      <View style={[styles.successIcon, { backgroundColor: surfaceColor, borderColor }]}>
        <Ionicons name="checkmark" size={38} color="#FFFFFF" />
      </View>

      <Text style={[styles.successTitle, { color: textColor }]}>Password Reset</Text>

      <Text style={[styles.successText, { color: secondaryTextColor }]}>
        Your password has been changed successfully. You can now log in with
        your new password.
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={goToLogin}
        activeOpacity={0.85}
      >
        <Text style={[styles.primaryButtonText, { color: colors.primaryText || "#FFFFFF" }]}>GO TO LOGIN</Text>

        <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.keyboardContainer, { backgroundColor: screenBackground }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { backgroundColor: screenBackground }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, { backgroundColor: screenBackground }]}>
          <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={screenBackground} />
          <TouchableOpacity
            style={[styles.topBackButton, { backgroundColor: surfaceColor, borderColor,  }]}
            onPress={goToLogin}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text || "#242424"} />

            <Text style={[styles.topBackText, { color: secondaryTextColor }]}>Back to Login</Text>
          </TouchableOpacity>

          {renderBrand()}

          {step === "email" && renderEmailStep()}

          {step === "otp" && renderOtpStep()}

          {step === "reset" && renderResetStep()}

          {step === "success" && renderSuccessStep()}

          <Text style={[styles.tagline, { color: secondaryTextColor }]}>KEEP YOUR MEMORIES CLOSE</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ForgotPasswordScreen;
