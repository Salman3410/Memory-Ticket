import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 30,
  },

  topBackButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 34,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop:20
  },

  topBackText: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 7,
  },

  brandContainer: {
    alignItems: "center",
    marginBottom: 44,
  },

  brandIcon: {
    width: 62,
    height: 62,
    borderRadius: 14,
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
  },

  headingContainer: {
    marginBottom: 30,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
  },

  emailText: {
    fontWeight: "700",
  },

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
    marginBottom: 8,
  },

  inputWrapper: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  input: {
    flex: 1,
    minHeight: 46,
    paddingVertical: 0,
    fontSize: 12,
  },

  otpInput: {
    flex: 1,
    minHeight: 46,
    paddingVertical: 0,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 5,
    textAlign: "left",
  },

  passwordButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButton: {
    minHeight: 48,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingHorizontal: 18,
  },

  primaryButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  disabledButton: {
    opacity: 0.65,
  },

  errorText: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: -2,
    marginBottom: 16,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },

  messageText: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: -2,
    marginBottom: 16,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },

  passwordHint: {
    fontSize: 10,
    lineHeight: 17,
    marginTop: -2,
    marginBottom: 20,
  },

  resendSection: {
    alignItems: "center",
    marginTop: 22,
  },

  resendText: {
    fontSize: 12,
    fontWeight: "800",
  },

  spamCheck: {
    marginTop: 8,
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
  },

  backLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  backLinkText: {
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 5,
  },

  successContainer: {
    alignItems: "center",
    paddingTop: 20,
  },

  successIcon: {
    width: 78,
    height: 78,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  successTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },

  successText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 30,
  },

  tagline: {
    textAlign: "center",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2.5,
    marginTop: 40,
  },
});

export default styles;
