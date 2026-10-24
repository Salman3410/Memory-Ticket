import { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";

import { useTheme } from "../../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

import styles from "./forgotPasswordStyles";

import { useAuth } from "../../../hooks/useAuth";
import { useAppAlert } from "../../../context/AlertContext";
import { useMementoNotifications } from "../../../hooks/useMementoNotifications";

import TactileButton from "../../../components/common/TactileButton";

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

  const primaryColor = colors.primary || "#34345C";
  const primaryTextColor = colors.primaryText || "#FFFFFF";

  const { forgotPassword, verifyOtp, resetPassword } = useAuth();

  const { showAlert } = useAppAlert();
  const { notify, notifyError } = useMementoNotifications();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // --------------------------------------------------
  // RESEND COUNTDOWN
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
  // SEND PASSWORD RESET OTP
  // --------------------------------------------------

  const handleSendOtp = async () => {
    if (loading) {
      return;
    }

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

    try {
      const result = await forgotPassword(normalizedEmail);

      if (!result?.success) {
        notifyError(
          "Password Reset Request Failed",
          result?.message ||
            "Unable to process your password reset request. Please try again."
        );

        return;
      }

      setEmail(normalizedEmail);
      setOtp("");
      setStep("otp");
      setResendTimer(60);

      notify("passwordResetRequested");
    } catch (err) {
      console.error("Send OTP error:", err);

      notifyError(
        "Unable to Send OTP",
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // RESEND PASSWORD RESET OTP
  // --------------------------------------------------

  const handleResendOtp = async () => {
    if (resendTimer > 0 || loading) {
      return;
    }

    setLoading(true);

    try {
      const result = await forgotPassword(email.trim().toLowerCase());

      if (!result?.success) {
        notifyError(
          "Unable to Resend OTP",
          result?.message || "Unable to resend the verification code."
        );

        return;
      }

      setOtp("");
      setResendTimer(60);

      notify("passwordResetRequested", {
        title: "Reset Code Requested",
        message:
          "If an account matches this email, reset instructions will be sent.",
      });
    } catch (err) {
      console.error("Resend OTP error:", err);

      notifyError(
        "Unable to Resend OTP",
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // VERIFY OTP
  // --------------------------------------------------

  const handleVerifyOtp = async () => {
    if (loading) {
      return;
    }

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

    try {
      const result = await verifyOtp(
        email.trim().toLowerCase(),
        cleanedOtp
      );

      if (!result?.success) {
        notifyError(
          "OTP Verification Failed",
          result?.message || "Unable to verify the OTP. Please try again."
        );

        return;
      }

      const serverResetToken = result.data?.resetToken;

      if (!serverResetToken) {
        notifyError(
          "Reset Token Missing",
          "The server did not provide a password reset token. Please request a new OTP."
        );

        return;
      }

      setResetToken(serverResetToken);
      setOtp("");
      setStep("reset");
    } catch (err) {
      console.error("Verify OTP error:", err);

      notifyError(
        "OTP Verification Failed",
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // RESET PASSWORD
  // --------------------------------------------------

  const handleResetPassword = async () => {
    if (loading) {
      return;
    }

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
          setResetToken("");
          setStep("email");
        },
      });

      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(
        email.trim().toLowerCase(),
        resetToken,
        newPassword
      );

      if (!result?.success) {
        notifyError(
          "Password Reset Failed",
          result?.message || "Unable to reset your password. Please try again."
        );

        return;
      }

      setNewPassword("");
      setConfirmPassword("");
      setResetToken("");
      setOtp("");
      setStep("success");

      notify("passwordReset");
    } catch (err) {
      console.error("Reset password error:", err);

      notifyError(
        "Password Reset Failed",
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------

  const goToLogin = () => {
    navigation.navigate("AuthTabs");
  };

  // --------------------------------------------------
  // BRAND
  // --------------------------------------------------

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

  // --------------------------------------------------
  // INPUT WRAPPER
  // --------------------------------------------------

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

  // --------------------------------------------------
  // PRIMARY BUTTON
  // --------------------------------------------------

  const renderPrimaryButton = (label, iconName, onPress) => (
    <TactileButton
      label={label}
      onPress={onPress}
      icon={iconName}
      iconPosition="right"
      color={primaryColor}
      textColor={primaryTextColor}
      iconColor={primaryTextColor}
      height={48}
      borderRadius={10}
      depth={3}
      loading={loading}
      loadingText="PLEASE WAIT..."
      disabled={loading}
      style={{
        width: "100%",
        marginBottom: 0,
      }}
      contentStyle={styles.primaryButton}
      textStyle={styles.primaryButtonText}
    />
  );

  // --------------------------------------------------
  // EMAIL STEP
  // --------------------------------------------------

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

        {renderPrimaryButton(
          "SEND OTP",
          "arrow-forward",
          handleSendOtp
        )}
      </View>
    </>
  );

  // --------------------------------------------------
  // OTP STEP
  // --------------------------------------------------

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
              style={[styles.otpInput, { color: textColor }]}
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
              returnKeyType="done"
              onSubmitEditing={handleVerifyOtp}
            />
          )}
        </View>

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
              {loading
                ? "PLEASE WAIT..."
                : resendTimer > 0
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

  // --------------------------------------------------
  // PASSWORD INPUT
  // --------------------------------------------------

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
            accessibilityRole="button"
            accessibilityLabel={
              visible ? "Hide password" : "Show password"
            }
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

  // --------------------------------------------------
  // RESET PASSWORD STEP
  // --------------------------------------------------

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

        {renderPrimaryButton(
          "RESET PASSWORD",
          "checkmark-circle-outline",
          handleResetPassword
        )}
      </View>
    </>
  );

  // --------------------------------------------------
  // SUCCESS STEP
  // --------------------------------------------------

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

      <Text style={[styles.successTitle, { color: textColor }]}>
        Password Reset
      </Text>

      <Text style={[styles.successText, { color: secondaryTextColor }]}>
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

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

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
          {/* BACK TO LOGIN */}

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

          {/* BRAND */}

          {renderBrand()}

          {/* CURRENT STEP */}

          {step === "email" && renderEmailStep()}
          {step === "otp" && renderOtpStep()}
          {step === "reset" && renderResetStep()}
          {step === "success" && renderSuccessStep()}

          {/* FOOTER */}

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