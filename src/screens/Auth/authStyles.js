import { StyleSheet } from "react-native";

export function createAuthStyles(colors = {}, isDark = false) {
  const background =
    colors.background || (isDark ? "#171624" : "#F1F0F6");

  const surface =
    colors.surface || (isDark ? "#211F30" : "#FFFFFF");

  const inputBackground =
    colors.input || (isDark ? "#292638" : "#F8F8FA");

  const text =
    colors.text || (isDark ? "#F7F5FC" : "#242424");

  const secondary =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#C4C0D0" : "#707080");

  const muted =
    colors.textMuted || (isDark ? "#89849C" : "#9A99A5");

  const border =
    colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const primary =
    colors.primary || (isDark ? "#C8C2FF" : "#34345C");

  const primaryText =
    colors.primaryText || (isDark ? "#25223D" : "#FFFFFF");

  return StyleSheet.create({
    keyboardContainer: {
      flex: 1,
      backgroundColor: background,
    },

    scrollContainer: {
      flexGrow: 1,
      backgroundColor: background,
    },

    container: {
      flexGrow: 1,
      width: "100%",
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 32,
      backgroundColor: background,
    },

    // Back button
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 9,
      marginTop:24,
      marginBottom: 28,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: border,
      backgroundColor: surface,
    },

    backText: {
      fontSize: 13,
      fontWeight: "600",
      marginLeft: 7,
      color: secondary,
    },

    // Compact Memento branding
    signupBrandContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 32,
    },

    brandIcon: {
      width: 62,
      height: 62,
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: border,
      backgroundColor: surface,
      overflow: "hidden",
    },

    logoImage: {
      width: 62,
      height: 62,
      maxWidth: 62,
      maxHeight: 62,
      flexShrink: 0,
    },

    brandText: {
      marginLeft: 11,
      fontSize: 17,
      fontWeight: "900",
      letterSpacing: 2,
      color: text,
    },

    // Heading
    headingContainer: {
      width: "100%",
      marginBottom: 24,
    },

    title: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: "700",
      letterSpacing: -0.5,
      color: text,
      marginBottom: 8,
    },

    subtitle: {
      fontSize: 14,
      lineHeight: 21,
      color: secondary,
    },

    emailText: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: "700",
      marginTop: 5,
      color: text,
    },

    // Form card
    formContainer: {
      width: "100%",
      padding: 20,
      backgroundColor: surface,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 20,
    },

    inputGroup: {
      width: "100%",
      marginBottom: 18,
    },

    label: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 1.2,
      color: secondary,
      marginBottom: 9,
    },

    inputWrapper: {
      width: "100%",
      minHeight: 54,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 12,
      backgroundColor: inputBackground,
    },

    inputIcon: {
      width: 24,
      textAlign: "center",
      marginRight: 10,
    },

    input: {
      flex: 1,
      minWidth: 0,
      height: 52,
      paddingHorizontal: 0,
      paddingVertical: 0,
      fontSize: 15,
      color: text,
      backgroundColor: inputBackground,
    },

    otpInput: {
      flex: 1,
      height: "100%",
      paddingVertical: 0,
      fontSize: 18,
      fontWeight: "800",
      letterSpacing: 4,
      color: text,
    },

    passwordButton: {
      width: 36,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: inputBackground,
    },

    forgotButton: {
      alignSelf: "flex-end",
      marginTop: -2,
      marginBottom: 16,
      paddingVertical: 4,
      paddingLeft: 8,
    },

    forgotText: {
      fontSize: 12,
      fontWeight: "700",
      color: primary,
    },

    // Primary button
    loginButton: {
      width: "100%",
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 13,
      paddingHorizontal: 16,
      gap: 9,
      backgroundColor: primary,
    },

    loginButtonText: {
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 1.2,
      color: primaryText,
    },

    // Resend section sits outside the form card
    resendSection: {
      width: "100%",
      alignItems: "center",
      marginTop: 23,
      paddingHorizontal: 8,
    },

    resendText: {
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 0.8,
      color: primary,
      paddingVertical: 4,
    },

    resendDisabled: {
      color: muted,
    },

    spamCheck: {
      marginTop: 8,
      fontSize: 12,
      lineHeight: 18,
      color: muted,
      textAlign: "center",
    },

    tagline: {
      textAlign: "center",
      fontSize: 9,
      fontWeight: "700",
      letterSpacing: 2,
      color: muted,
      marginTop: 20,
    },

    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 18,
    },

    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: border,
    },

    dividerIcon: {
      paddingHorizontal: 14,
    },

    dividerStar: {
      fontSize: 14,
      color: "#F2C14E",
    },

    signupContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },

    signupText: {
      fontSize: 14,
      color: secondary,
    },

    signupLink: {
      fontSize: 14,
      fontWeight: "700",
      color: primary,
      marginLeft: 5,
    },
  });
}

const styles = createAuthStyles(
  {
    background: "#F1F0F6",
    surface: "#FFFFFF",
    input: "#F8F8FA",
    text: "#242424",
    textSecondary: "#707080",
    textMuted: "#9A99A5",
    border: "#D9D8E2",
    primary: "#34345C",
    primaryText: "#FFFFFF",
  },
  false,
);

export default styles;