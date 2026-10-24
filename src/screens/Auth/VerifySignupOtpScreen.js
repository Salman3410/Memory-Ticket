import { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { createAuthStyles } from "./authStyles";
import { useAuth } from "../../hooks/useAuth";
import { useAppAlert } from "../../context/AlertContext";
import { useMementoNotifications } from "../../hooks/useMementoNotifications";

import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import TactileButton from "../../components/common/TactileButton";

function VerifySignupOtpScreen({ navigation, route }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};

  const screenBackground =
    colors.background || (isDark ? "#171624" : "#F1F0F6");

  const surfaceColor =
    colors.surface || (isDark ? "#211F30" : "#FFFFFF");

  const textColor =
    colors.text || (isDark ? "#F7F5FC" : "#242424");

  const secondaryTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#C4C0D0" : "#707080");

  const mutedTextColor =
    colors.textMuted || (isDark ? "#89849C" : "#9A99A5");

  const borderColor =
    colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const inputBackground =
    colors.input || (isDark ? "#292638" : "#F8F8FA");

  const primaryColor =
    colors.primary || (isDark ? "#C8C2FF" : "#34345C");

  const primaryTextColor =
    colors.primaryText || (isDark ? "#25223D" : "#FFFFFF");

  const styles = createAuthStyles(colors, isDark);

  const { verifySignupOtp, resendSignupOtp } = useAuth();
  const { showAlert } = useAppAlert();
  const { notify, notifyError } = useMementoNotifications();

  const email = route.params?.email;

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // --------------------------------------------------
  // RESEND COUNTDOWN
  // --------------------------------------------------

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // --------------------------------------------------
  // VERIFY SIGNUP OTP
  // --------------------------------------------------

  const handleVerify = async () => {
    if (isLoading || resending) {
      return;
    }

    const cleanedOtp = otp.trim();

    if (!/^\d{6}$/.test(cleanedOtp)) {
      showAlert({
        type: "warning",
        icon: "shield-checkmark-outline",
        title: "Invalid OTP",
        message: "Please enter the 6-digit verification code.",
        confirmText: "OK",
      });

      return;
    }

    setIsLoading(true);

    try {
      const result = await verifySignupOtp(email, cleanedOtp);

      if (!result?.success) {
        notifyError(
          "Verification Failed",
          result?.message || "Unable to verify your email. Please try again."
        );

        return;
      }

      notify("emailVerified");

      navigation.popTo("AuthTabs", {
        screen: "Login",
      });
    } catch (error) {
      console.error("Signup OTP verification error:", error);

      notifyError(
        "Verification Failed",
        error?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------
  // RESEND SIGNUP OTP
  // --------------------------------------------------

  const handleResend = async () => {
    if (countdown > 0 || resending || isLoading) {
      return;
    }

    setResending(true);

    try {
      const result = await resendSignupOtp(email);

      if (!result?.success) {
        notifyError(
          "Unable to Resend",
          result?.message || "Unable to send a new verification code. Please try again."
        );

        return;
      }

      setOtp("");
      setCountdown(60);

      notify("signupOtpResent");
    } catch (error) {
      console.error("Resend OTP error:", error);

      notifyError(
        "Unable to Resend",
        error?.message || "Something went wrong. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  const isResendDisabled = countdown > 0 || resending || isLoading;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <KeyboardAwareScrollView
      bottomOffset={20}
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
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={screenBackground}
        />

        {/* BACK BUTTON */}

        <TouchableOpacity
          style={[
            styles.backButton,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
          onPress={() => navigation.goBack()}
          disabled={isLoading || resending}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={textColor}
          />

          <Text
            style={[
              styles.backText,
              { color: secondaryTextColor },
            ]}
          >
            Back
          </Text>
        </TouchableOpacity>

        {/* BRAND */}

        <View style={styles.signupBrandContainer}>
          <View
            style={[
              styles.brandIcon,
              {
                backgroundColor: surfaceColor,
                borderColor,
              },
            ]}
          >
            <Image
              source={require("../../../assets/icon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Text
            style={[
              styles.brandText,
              { color: textColor },
            ]}
          >
            MEMENTO
          </Text>
        </View>

        {/* HEADING */}

        <View style={styles.headingContainer}>
          <Text
            style={[
              styles.title,
              { color: textColor },
            ]}
          >
            Verify Your Email
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: secondaryTextColor },
            ]}
          >
            We sent a 6-digit verification code to:
          </Text>

          <Text
            style={[
              styles.emailText,
              { color: textColor },
            ]}
          >
            {email}
          </Text>
        </View>

        {/* OTP FORM */}

        <View
          style={[
            styles.formContainer,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.label,
                { color: secondaryTextColor },
              ]}
            >
              VERIFICATION CODE
            </Text>

            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: inputBackground,
                  borderColor,
                },
              ]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={secondaryTextColor}
                style={styles.inputIcon}
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBackground,
                    color: textColor,
                  },
                ]}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor={mutedTextColor}
                value={otp}
                onChangeText={(value) =>
                  setOtp(value.replace(/\D/g, "").slice(0, 6))
                }
                keyboardType="number-pad"
                maxLength={6}
                editable={!isLoading && !resending}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleVerify}
              />
            </View>
          </View>

          {/* VERIFY BUTTON */}

          <TactileButton
            label="VERIFY EMAIL"
            onPress={handleVerify}
            icon="checkmark"
            iconPosition="right"
            color={primaryColor}
            textColor={primaryTextColor}
            iconColor={primaryTextColor}
            height={52}
            borderRadius={13}
            depth={3}
            loading={isLoading}
            loadingText="VERIFYING..."
            disabled={isLoading || resending}
            style={{
              width: "100%",
              marginBottom: 0,
            }}
            contentStyle={styles.loginButton}
            textStyle={styles.loginButtonText}
          />
        </View>

        {/* RESEND OTP */}

        <View style={styles.resendSection}>
          <TouchableOpacity
            onPress={handleResend}
            disabled={isResendDisabled}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.resendText,
                {
                  color: isResendDisabled
                    ? mutedTextColor
                    : primaryColor,
                },
              ]}
            >
              {resending
                ? "SENDING..."
                : countdown > 0
                  ? `RESEND CODE IN ${countdown}s`
                  : "RESEND CODE"}
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
      </View>
    </KeyboardAwareScrollView>
  );
}

export default VerifySignupOtpScreen;