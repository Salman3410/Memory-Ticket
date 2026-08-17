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
    paddingTop: 55,
    paddingBottom: 30,
  },
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
  passwordButton: {
    width: 50,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 26,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#34345C",
  },
  loginButton: {
    height: 58,
    borderRadius: 14,
    backgroundColor: "#34345C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#242440",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 34,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D9D8E2",
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
    color: "#707080",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#242424",
    marginLeft: 6,
  },
  signupBrandContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "800",
    color: "#34345C",
    marginLeft: 5,
  },
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
