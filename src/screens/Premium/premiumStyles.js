import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // --------------------------------------------------
  // CONTAINER
  // --------------------------------------------------

  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 40,
    paddingBottom: 42,
  },

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  header: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  headerTitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
  },

  headerSpacer: {
    width: 42,
  },

  // --------------------------------------------------
  // HERO
  // --------------------------------------------------

  hero: {
    marginTop: 20,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
  },

  heroBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },

  heroBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },

  heroTitle: {
    marginTop: 18,
    fontSize: 32,
    lineHeight: 35,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  heroSubtitle: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 21,
  },

  // --------------------------------------------------
  // STORAGE
  // --------------------------------------------------

  storageCard: {
    marginTop: 14,
    padding: 17,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  storageIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  storageContent: {
    flex: 1,
  },

  storageTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  storageSubtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
  },

  // --------------------------------------------------
  // SECTION TITLES
  // --------------------------------------------------

  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  // --------------------------------------------------
  // PREMIUM FEATURES
  // --------------------------------------------------

  featureCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  featureRowLast: {
    borderBottomWidth: 0,
  },

  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  featureContent: {
    flex: 1,
    marginRight: 10,
  },

  featureTitle: {
    fontSize: 13,
    fontWeight: "900",
  },

  featureDescription: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
  },

  // --------------------------------------------------
  // PLANS
  // --------------------------------------------------

  planGroup: {
    gap: 10,
  },

  planCard: {
    position: "relative",
    minHeight: 88,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
  },

  // Selected colors are controlled by PremiumScreen
  // using colors.accent and colors.surfaceSecondary.
  planCardSelected: {},

  planRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  planRadioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  planContent: {
    flex: 1,
  },

  planTitle: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },

  planPrice: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "900",
  },

  planPeriod: {
    marginTop: 2,
    fontSize: 11,
  },

  planBadge: {
    position: "absolute",
    top: 10,
    right: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },

  planBadgeText: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  // --------------------------------------------------
  // PURCHASE BUTTON
  // --------------------------------------------------

  purchaseButton: {
    marginTop: 22,
    minHeight: 54,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    gap: 10,
  },

  purchaseButtonDisabled: {
    opacity: 0.7,
  },

  purchaseButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  disclaimer: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 10,
    lineHeight: 16,
  },

  // --------------------------------------------------
  // ACTIVE PREMIUM
  // --------------------------------------------------

  activeContainer: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  activeIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  activeTitle: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: "900",
  },

  activeText: {
    marginTop: 9,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
  },

  secondaryButton: {
    marginTop: 24,
    minHeight: 50,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.9,
  },
});

export default styles;
