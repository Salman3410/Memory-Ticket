import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // --------------------------------------------------
  // ROOT
  // --------------------------------------------------

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
    fontSize: 12,

    fontWeight: "700",

    color: "#242424",

    marginLeft: 7,
  },

  // --------------------------------------------------
  // BRAND
  // --------------------------------------------------

  brandContainer: {
    alignItems: "center",

    marginBottom: 44,
  },

  brandIcon: {
    width: 72,
    height: 72,

    borderRadius: 22,

    backgroundColor: "#34345C",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 14,

    overflow: "hidden",
  },

  logoImage: {
    width: 62,
    height: 62,

    resizeMode: "contain",
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
    marginBottom: 30,
  },

  title: {
    fontSize: 32,

    fontWeight: "800",

    color: "#242424",

    letterSpacing: -0.8,

    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,

    lineHeight: 21,

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
    marginBottom: 18,
  },

  label: {
    fontSize: 10,

    fontWeight: "900",

    letterSpacing: 1.4,

    color: "#242424",

    marginBottom: 8,
  },

  // --------------------------------------------------
  // STANDARD INPUT
  // --------------------------------------------------

  inputWrapper: {
    height: 48,

    paddingHorizontal: 12,

    borderRadius: 10,

    backgroundColor: "#F8F8FA",

    flexDirection: "row",

    alignItems: "center",

    gap: 9,
  },

  input: {
    flex: 1,

    height: "100%",

    paddingVertical: 0,

    fontSize: 12,

    color: "#242424",
  },

  // --------------------------------------------------
  // OTP
  // --------------------------------------------------

  otpInput: {
    flex: 1,

    height: "100%",

    paddingVertical: 0,

    fontSize: 20,

    fontWeight: "800",

    letterSpacing: 5,

    color: "#242424",

    textAlign: "left",
  },

  // --------------------------------------------------
  // PASSWORD VISIBILITY
  // --------------------------------------------------

  passwordButton: {
    width: 28,

    height: 28,

    alignItems: "center",

    justifyContent: "center",
  },

  // --------------------------------------------------
  // PRIMARY BUTTON
  // --------------------------------------------------

  primaryButton: {
    height: 48,

    borderRadius: 10,

    backgroundColor: "#34345C",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 9,

    paddingHorizontal: 18,
  },

  primaryButtonText: {
    color: "#FFFFFF",

    fontSize: 10,

    fontWeight: "900",

    letterSpacing: 1.5,
  },

  disabledButton: {
    opacity: 0.65,
  },

  // --------------------------------------------------
  // FEEDBACK
  // --------------------------------------------------

  errorText: {
    fontSize: 11,

    lineHeight: 17,

    color: "#C94A4A",

    marginTop: -2,

    marginBottom: 16,
  },

  messageText: {
    fontSize: 11,

    lineHeight: 17,

    color: "#4C704C",

    marginTop: -2,

    marginBottom: 16,
  },

  // --------------------------------------------------
  // PASSWORD HINT
  // --------------------------------------------------

  passwordHint: {
    fontSize: 10,

    lineHeight: 17,

    color: "#707080",

    marginTop: -2,

    marginBottom: 20,
  },

  // --------------------------------------------------
  // RESEND
  // --------------------------------------------------

  resendSection: {
    alignItems: "center",

    marginTop: 22,
  },

  resendContainer: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",
  },

  resendText: {
    fontSize: 12,

    fontWeight: "800",

    color: "#34345C",

    marginLeft: 5,
  },

  resendDisabled: {
    color: "#A39C92",
  },

  spamCheck: {
    marginTop: 8,

    fontSize: 10,

    lineHeight: 16,

    color: "#A39C92",

    textAlign: "center",
  },

  // --------------------------------------------------
  // BACK LINK
  // --------------------------------------------------

  backLink: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    marginTop: 22,
  },

  backLinkText: {
    fontSize: 11,

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

    borderRadius: 22,

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
    fontSize: 14,

    lineHeight: 22,

    color: "#707080",

    textAlign: "center",

    marginBottom: 30,
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

    marginTop: 40,
  },
});

export default styles;
