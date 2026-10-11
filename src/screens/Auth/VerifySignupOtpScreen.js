import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,

  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./authStyles";
import { useAuth } from "../../hooks/useAuth";
import { useAppAlert } from "../../context/AlertContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

function VerifySignupOtpScreen({ navigation, route }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};
  const screenBackground = colors.background || (isDark ? "#171624" : "#F1F0F6");
  const surfaceColor = colors.surface || (isDark ? "#211F30" : "#FFFFFF");
  const textColor = colors.text || (isDark ? "#F7F5FC" : "#242424");
  const secondaryTextColor = colors.textSecondary || colors.textMuted || (isDark ? "#C4C0D0" : "#707080");
  const borderColor = colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const { verifySignupOtp, resendSignupOtp } = useAuth();
  const { showAlert } = useAppAlert();

  const email = route.params?.email;

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async () => {
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

      if (!result.success) {
        showAlert({
          type: "danger",
          icon: "close-circle-outline",
          title: "Verification Failed",
          message: result.message || "Unable to verify your email.",
          confirmText: "OK",
        });
        return;
      }

      navigation.popTo("AuthTabs", {
        screen: "Login",
      });
    } catch (error) {
      console.error("Signup OTP verification error:", error);

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Verification Failed",
        message: "Something went wrong. Please try again.",
        confirmText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) {
      return;
    }

    setResending(true);

    try {
      const result = await resendSignupOtp(email);

      if (!result.success) {
        showAlert({
          type: "danger",
          icon: "refresh-outline",
          title: "Unable to Resend",
          message: result.message || "Please try again.",
          confirmText: "OK",
        });
        return;
      }

      setOtp("");
      setCountdown(60);

      showAlert({
        type: "success",
        icon: "mail-outline",
        title: "OTP Sent",
        message: "A new verification code has been sent to your email.",
        confirmText: "OK",
      });
    } catch (error) {
      console.error("Resend OTP error:", error);

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Unable to Resend",
        message: "Something went wrong. Please try again.",
        confirmText: "OK",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      bottomOffset={20}
      contentContainerStyle={[styles.scrollContainer, { backgroundColor: screenBackground }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.container, { backgroundColor: screenBackground }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={screenBackground} />
        {/* Back Button */}
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: surfaceColor, borderColor,  }]}
          onPress={() => navigation.goBack()}
          disabled={isLoading || resending}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text || "#242424"} />

          <Text style={[styles.backText, { color: secondaryTextColor }]}>Back</Text>
        </TouchableOpacity>

        {/* Brand */}
        <View style={[styles.signupBrandContainer, { backgroundColor: surfaceColor, borderColor }]}>
          <View style={[styles.brandIcon, { backgroundColor: surfaceColor, borderColor }]}>
            <Image
              source={require("../../../assets/icon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Text style={[styles.brandText, { color: colors.primaryText || "#FFFFFF" }]}>MEMENTO</Text>
        </View>

        {/* Heading */}
        <View style={[styles.headingContainer, { backgroundColor: surfaceColor, borderColor }]}>
          <Text style={[styles.title, { color: textColor }]}>Verify Your Email</Text>

          <Text style={[styles.subtitle, { color: textColor }]}>
            We sent a 6-digit verification code to
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                fontWeight: "600",
                marginTop: 6,
              },
            ]}
          >
            {email}
          </Text>
        </View>

        {/* Form */}
        <View style={[styles.formContainer, { backgroundColor: surfaceColor, borderColor }]}>
          {/* OTP */}
          <View style={[styles.inputGroup, { backgroundColor: surfaceColor, borderColor }]}>
            <Text style={[styles.label, { color: secondaryTextColor }]}>VERIFICATION CODE</Text>

            <View style={[styles.inputWrapper, { backgroundColor: surfaceColor, borderColor,  }]}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={colors.textSecondary || colors.textMuted || "#707080"}
                style={[styles.inputIcon, { backgroundColor: surfaceColor, borderColor }]}
              />

              <TextInput
                style={[styles.input, { backgroundColor: colors.input || surfaceColor, borderColor, color: textColor }]}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor={colors.textMuted || "#A39C92"}
                value={otp}
                onChangeText={(text) =>
                  setOtp(text.replace(/\D/g, "").slice(0, 6))
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

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.loginButton, { backgroundColor: colors.primary || "#34345C" }, isLoading && {
                opacity: 0.7,
              },
            ]}
            onPress={handleVerify}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={[styles.loginButtonText, { color: colors.primaryText || "#FFFFFF" }]}>VERIFY EMAIL</Text>

                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Resend */}
          <View style={[styles.resendSection, { backgroundColor: surfaceColor, borderColor }]}>
            <TouchableOpacity
              onPress={handleResend}
              disabled={countdown > 0 || resending || isLoading}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.resendText,
                  (countdown > 0 || resending || isLoading) &&
                    styles.resendDisabled,
                ]}
              >
                {resending
                  ? "SENDING..."
                  : countdown > 0
                    ? `RESEND CODE IN ${countdown}s`
                    : "RESEND CODE"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.spamCheck}>
              Didn't receive the code? Check your spam folder.
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

export default VerifySignupOtpScreen;
