import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 30,
  },

  // --------------------------------------------------
  // TOP BACK BUTTON
  // --------------------------------------------------

  topBackButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 34,
    paddingTop: 20,
  },

  topBackText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#242424",
    marginLeft: 7,
  },

  // --------------------------------------------------
  // BRAND
  // --------------------------------------------------

  brandContainer: {
    alignItems: "center",
    marginBottom: 48,
  },

  brandIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#34345C",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  brandText: {
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: 5,
    color: "#242424",
  },

  brandSubText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 7,
    color: "#34345C",
    marginTop: 2,
  },

  // --------------------------------------------------
  // HEADING
  // --------------------------------------------------

  headingContainer: {
    marginBottom: 34,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#242424",
    letterSpacing: -0.8,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#707080",
  },

  emailText: {
    fontWeight: "700",
    color: "#34345C",
  },

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  formContainer: {
    width: "100%",
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#242424",
    marginBottom: 8,
  },

  inputWrapper: {
    height: 56,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
  },

  inputIcon: {
    marginLeft: 16,
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#242424",
    paddingVertical: 0,
  },

  // --------------------------------------------------
  // OTP
  // --------------------------------------------------

  otpInput: {
    flex: 1,
    height: "100%",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 5,
    color: "#242424",
    paddingVertical: 0,
    textAlign: "left",
  },

  // --------------------------------------------------
  // PASSWORD VISIBILITY
  // --------------------------------------------------

  passwordButton: {
    width: 50,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  // --------------------------------------------------
  // PRIMARY BUTTON
  // --------------------------------------------------

  primaryButton: {
    height: 58,
    borderRadius: 14,
    backgroundColor: "#34345C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal:20,

    shadowColor: "#242440",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,

    elevation: 4,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
  },

  disabledButton: {
    opacity: 0.65,
  },

  // --------------------------------------------------
  // FEEDBACK
  // --------------------------------------------------

  errorText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#C94A4A",
    marginTop: -4,
    marginBottom: 18,
  },

  messageText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#4C704C",
    marginTop: -4,
    marginBottom: 18,
  },

  // --------------------------------------------------
  // PASSWORD HINT
  // --------------------------------------------------

  passwordHint: {
    fontSize: 12,
    lineHeight: 18,
    color: "#707080",
    marginTop: -4,
    marginBottom: 22,
  },

  // --------------------------------------------------
  // RESEND
  // --------------------------------------------------

  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  resendLabel: {
    fontSize: 13,
    color: "#707080",
  },

  resendText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#34345C",
    marginLeft: 5,
  },

  resendDisabled: {
    color: "#A39C92",
  },

  // --------------------------------------------------
  // BACK LINK
  // --------------------------------------------------

  backLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  backLinkText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#34345C",
    marginLeft: 5,
  },

  // --------------------------------------------------
  // SUCCESS
  // --------------------------------------------------

  successContainer: {
    alignItems: "center",
    paddingTop: 20,
  },

  successIcon: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#34345C",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  successTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#242424",
    textAlign: "center",
    marginBottom: 12,
  },

  successText: {
    fontSize: 15,
    lineHeight: 23,
    color: "#707080",
    textAlign: "center",
    marginBottom: 32,
  },

  // --------------------------------------------------
  // TAGLINE
  // --------------------------------------------------

  tagline: {
    textAlign: "center",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2.5,
    color: "#A39C92",
    marginTop: 42,
  },
});

export default styles;

