import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./authStyles";
import { useAuth } from "../../hooks/useAuth";

function VerifySignupOtpScreen({ navigation, route }) {
  const { verifySignupOtp, resendSignupOtp } = useAuth();

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
      Alert.alert("Invalid OTP", "Please enter the 6-digit verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifySignupOtp(email, cleanedOtp);

      if (!result.success) {
        Alert.alert("Verification Failed", result.message || "Invalid OTP.");
        return;
      }
    } catch (error) {
      console.error("Signup OTP verification error:", error);

      Alert.alert(
        "Verification Failed",
        "Something went wrong. Please try again.",
      );
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
        Alert.alert("Unable to Resend", result.message || "Please try again.");
        return;
      }

      setOtp("");
      setCountdown(60);

      Alert.alert(
        "OTP Sent",
        "A new verification code has been sent to your email.",
      );
    } catch (error) {
      console.error("Resend OTP error:", error);

      Alert.alert(
        "Unable to Resend",
        "Something went wrong. Please try again.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isLoading || resending}
        >
          <Ionicons name="arrow-back" size={22} color="#242424" />

          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.signupBrandContainer}>
          <View style={styles.brandIcon}>
            <Image
              source={require("../../../assets/icon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.brandText}>MEMENTO</Text>
        </View>

        <View style={styles.headingContainer}>
          <Text style={styles.title}>Verify Your Email</Text>

          <Text style={styles.subtitle}>
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

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>VERIFICATION CODE</Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#707080"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor="#A39C92"
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

          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && {
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
                <Text style={styles.loginButtonText}>VERIFY EMAIL</Text>

                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.resendSection}>
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
    </KeyboardAvoidingView>
  );
}

export default VerifySignupOtpScreen;
