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
    paddingTop: 20,
    paddingBottom: 24,
  },

  headingContainer: {
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#29293D",
    letterSpacing: -0.5,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#858494",
    maxWidth: 320,
  },

  formContainer: {
    width: "100%",
  },

  inputGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.3,
    color: "#5F5E6D",
    marginBottom: 7,
  },

  inputWrapper: {
    height: 54,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#F9F8FB",

    borderWidth: 1,
    borderColor: "#DDDCE5",

    borderRadius: 15,
  },

  inputIcon: {
    marginLeft: 16,
    marginRight: 10,
  },

  input: {
    flex: 1,

    height: "100%",

    fontSize: 15,

    color: "#29293D",

    paddingVertical: 0,
    paddingRight: 12,
  },

  passwordButton: {
    width: 48,
    height: "100%",

    alignItems: "center",
    justifyContent: "center",
  },

  forgotButton: {
    alignSelf: "flex-end",

    marginTop: -1,
    marginBottom: 16,

    paddingVertical: 2,
    paddingLeft: 8,
  },

  forgotText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#34345C",
  },

  loginButton: {
    height: 54,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#34345C",

    borderRadius: 15,

    gap: 9,
  },

  loginButtonText: {
    color: "#FFFFFF",

    fontSize: 13,
    fontWeight: "700",

    letterSpacing: 1.5,
  },

  tagline: {
    textAlign: "center",

    fontSize: 9,
    fontWeight: "700",

    letterSpacing: 2,

    color: "#A6A4AE",

    marginTop: 20,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",

    marginBottom: 18,
  },

  backText: {
    fontSize: 14,
    fontWeight: "600",

    color: "#555462",

    marginLeft: 6,
  },

  signupBrandContainer: {
    alignItems: "center",
    marginBottom: 28,
  },

  resendSection: {
    alignItems: "center",

    marginTop: 18,
  },

  resendText: {
    fontSize: 14,
    fontWeight: "600",

    color: "#34345C",
  },

  resendDisabled: {
    color: "#A2A1AA",
  },

  spamCheck: {
    marginTop: 7,

    fontSize: 12,
    lineHeight: 18,

    color: "#AAA8B2",

    textAlign: "center",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",

    marginVertical: 18,
  },

  dividerLine: {
    flex: 1,

    height: 1,

    backgroundColor: "#DDDCE5",
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

    color: "#858494",
  },

  signupLink: {
    fontSize: 14,

    fontWeight: "700",

    color: "#34345C",

    marginLeft: 5,
  },
});

export default styles;
