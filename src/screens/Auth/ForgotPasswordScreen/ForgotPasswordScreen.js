
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

  const screenBackground =
    colors.background || (isDark ? "#171624" : "#F1F0F6");

  const surfaceColor =
    colors.surface || (isDark ? "#211F30" : "#FFFFFF");

  const inputBackground =
    colors.input || (isDark ? "#292638" : "#F8F8FA");

  const textColor =
    colors.text || (isDark ? "#F7F5FC" : "#242424");

  const secondaryTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#C4C0D0" : "#707080");

  const mutedColor =
    colors.textMuted || (isDark ? "#9994AB" : "#9A9AA3");

  const borderColor =
    colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const primaryColor =
    colors.primary || "#34345C";

  const primaryTextColor =
    colors.primaryText || "#FFFFFF";

  const errorColor =
    colors.error || "#D9534F";

  const successColor =
    colors.success || "#4C9B70";

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
        setError(
          result.message || "Unable to process password reset request."
        );
        return;
      }

      setEmail(normalizedEmail);
      setMessage(
        result.message ||
          "If an account exists with this email, an OTP has been sent."
      );
      setOtp("");
      setStep("otp");
      setResendTimer(60);
    } catch (err) {
      console.error("Send OTP error:", err);
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
    } catch (err) {
      console.error("Resend OTP error:", err);
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
      const result = await verifyOtp(
        email.trim().toLowerCase(),
        cleanedOtp
      );

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
    } catch (err) {
      console.error("Verify OTP error:", err);
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
        onConfirm: () => setStep("email"),
      });
      return;
    }

    setLoading(true);
    clearFeedback();

    try {
      const result = await resetPassword(
        email.trim().toLowerCase(),
        resetToken,
        newPassword
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
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigation.navigate("AuthTabs");
  };

  const renderBrand = () => (
    <View style={styles.brandContainer}>
      <View
        style={[
          styles.brandIcon,
          {
            backgroundColor: surfaceColor,
            borderColor,
            borderWidth: 1,
          },
        ]}
      >
        <Image
          source={require("../../../../assets/icon.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <Text style={[styles.brandText, { color: textColor }]}>
        MEMENTO
      </Text>
    </View>
  );

  const renderFeedback = () => (
    <>
      {!!error && (
        <Text
          accessibilityRole="alert"
          style={[
            styles.errorText,
            {
              color: errorColor,
              backgroundColor: isDark ? "#382329" : "#FFF0EF",
              borderColor: isDark ? "#633640" : "#F4D1CF",
            },
          ]}
        >
          {error}
        </Text>
      )}

      {!!message && (
        <Text
          style={[
            styles.messageText,
            {
              color: isDark ? "#A8E0BB" : "#376F49",
              backgroundColor: isDark ? "#22352C" : "#EDF8F0",
              borderColor: isDark ? "#345341" : "#CFE9D5",
            },
          ]}
        >
          {message}
        </Text>
      )}
    </>
  );

  const renderInputWrapper = (iconName, inputElement) => (
    <View
      style={[
        styles.inputWrapper,
        {
          backgroundColor: inputBackground,
          borderColor,
          borderWidth: 1,
        },
      ]}
    >
      <Ionicons name={iconName} size={17} color={mutedColor} />
      {inputElement}
    </View>
  );

  const renderPrimaryButton = (label, iconName, onPress) => (
    <TouchableOpacity
      style={[
        styles.primaryButton,
        { backgroundColor: primaryColor },
        loading && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator size="small" color={primaryTextColor} />
      ) : (
        <>
          <Text
            style={[
              styles.primaryButtonText,
              { color: primaryTextColor },
            ]}
          >
            {label}
          </Text>
          <Ionicons
            name={iconName}
            size={19}
            color={primaryTextColor}
          />
        </>
      )}
    </TouchableOpacity>
  );

  const renderEmailStep = () => (
    <>
      <View style={styles.headingContainer}>
        <Text style={[styles.title, { color: textColor }]}>
          Forgot Password?
        </Text>
        <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
          Enter your email and we'll send you a verification code.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: secondaryTextColor }]}>
            EMAIL
          </Text>

          {renderInputWrapper(
            "mail-outline",
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="your@email.com"
              placeholderTextColor={mutedColor}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              returnKeyType="send"
              onSubmitEditing={handleSendOtp}
            />
          )}
        </View>

        {renderFeedback()}

        {renderPrimaryButton("SEND OTP", "arrow-forward", handleSendOtp)}
      </View>
    </>
  );

  const renderOtpStep = () => (
    <>
      <View style={styles.headingContainer}>
        <Text style={[styles.title, { color: textColor }]}>
          Verify OTP
        </Text>

        <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
          Enter the 6-digit OTP sent to{" "}
          <Text style={[styles.emailText, { color: primaryColor }]}>
            {email}
          </Text>
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: secondaryTextColor }]}>
            OTP
          </Text>

          {renderInputWrapper(
            "key-outline",
            <TextInput
              style={[
                styles.otpInput,
                { color: textColor },
              ]}
              placeholder="Enter 6-digit OTP"
              placeholderTextColor={mutedColor}
              value={otp}
              onChangeText={(value) =>
                setOtp(value.replace(/[^0-9]/g, "").slice(0, 6))
              }
              keyboardType="number-pad"
              maxLength={6}
              editable={!loading}
              textContentType="oneTimeCode"
            />
          )}
        </View>

        {renderFeedback()}

        {renderPrimaryButton(
          "VERIFY OTP",
          "checkmark",
          handleVerifyOtp
        )}

        <View style={styles.resendSection}>
          <TouchableOpacity
            onPress={handleResendOtp}
            disabled={resendTimer > 0 || loading}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.resendText,
                {
                  color:
                    resendTimer > 0 || loading
                      ? mutedColor
                      : primaryColor,
                },
              ]}
            >
              {resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : "Resend OTP"}
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.spamCheck,
              { color: secondaryTextColor },
            ]}
          >
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
          <Ionicons
            name="arrow-back"
            size={16}
            color={primaryColor}
          />
          <Text
            style={[
              styles.backLinkText,
              { color: secondaryTextColor },
            ]}
          >
            Change email
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderPasswordField = (
    label,
    placeholder,
    value,
    onChangeText,
    visible,
    toggleVisibility
  ) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: secondaryTextColor }]}>
        {label}
      </Text>

      {renderInputWrapper(
        "lock-closed-outline",
        <>
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder={placeholder}
            placeholderTextColor={mutedColor}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={!visible}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <TouchableOpacity
            style={styles.passwordButton}
            onPress={toggleVisibility}
            disabled={loading}
            activeOpacity={0.7}
            hitSlop={6}
          >
            <Ionicons
              name={visible ? "eye-off-outline" : "eye-outline"}
              size={18}
              color={mutedColor}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const renderResetStep = () => (
    <>
      <View style={styles.headingContainer}>
        <Text style={[styles.title, { color: textColor }]}>
          New Password
        </Text>
        <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
          Create a new password for your Memento account.
        </Text>
      </View>

      <View style={styles.formContainer}>
        {renderPasswordField(
          "NEW PASSWORD",
          "Enter new password",
          newPassword,
          setNewPassword,
          showPassword,
          () => setShowPassword((prev) => !prev)
        )}

        {renderPasswordField(
          "CONFIRM PASSWORD",
          "Confirm new password",
          confirmPassword,
          setConfirmPassword,
          showConfirmPassword,
          () => setShowConfirmPassword((prev) => !prev)
        )}

        <Text
          style={[
            styles.passwordHint,
            { color: secondaryTextColor },
          ]}
        >
          Password must contain 8 or more characters.
        </Text>

        {renderFeedback()}

        {renderPrimaryButton(
          "RESET PASSWORD",
          "checkmark-circle-outline",
          handleResetPassword
        )}
      </View>
    </>
  );

  const renderSuccessStep = () => (
    <View style={styles.successContainer}>
      <View
        style={[
          styles.successIcon,
          { backgroundColor: primaryColor },
        ]}
      >
        <Ionicons
          name="checkmark"
          size={38}
          color={primaryTextColor}
        />
      </View>

      <Text
        style={[
          styles.successTitle,
          { color: textColor },
        ]}
      >
        Password Reset
      </Text>

      <Text
        style={[
          styles.successText,
          { color: secondaryTextColor },
        ]}
      >
        Your password has been changed successfully. You can now log in
        with your new password.
      </Text>

      {renderPrimaryButton(
        "GO TO LOGIN",
        "arrow-forward",
        goToLogin
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[
        styles.keyboardContainer,
        { backgroundColor: screenBackground },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={screenBackground}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { backgroundColor: screenBackground },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: screenBackground },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.topBackButton,
              {
                backgroundColor: surfaceColor,
                borderColor,
                borderWidth: 1,
              },
            ]}
            onPress={goToLogin}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={textColor}
            />
            <Text
              style={[
                styles.topBackText,
                { color: textColor },
              ]}
            >
              Back to Login
            </Text>
          </TouchableOpacity>

          {renderBrand()}

          {step === "email" && renderEmailStep()}
          {step === "otp" && renderOtpStep()}
          {step === "reset" && renderResetStep()}
          {step === "success" && renderSuccessStep()}

          <Text
            style={[
              styles.tagline,
              { color: secondaryTextColor },
            ]}
          >
            KEEP YOUR MEMORIES CLOSE
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ForgotPasswordScreen;
