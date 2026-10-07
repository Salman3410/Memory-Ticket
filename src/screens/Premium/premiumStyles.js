import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FB",
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 42,
  },

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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: "#34345C",
  },

  headerSpacer: {
    width: 42,
  },

  hero: {
    marginTop: 20,
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
  },

  heroBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#F0F0F7",
  },

  heroBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#34345C",
  },

  heroTitle: {
    marginTop: 18,
    fontSize: 32,
    lineHeight: 35,
    fontWeight: "900",
    letterSpacing: -0.8,
    color: "#242424",
  },

  heroSubtitle: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 21,
    color: "#767680",
  },

  storageCard: {
    marginTop: 14,
    padding: 17,
    borderRadius: 20,
    backgroundColor: "#F0F0F7",
    flexDirection: "row",
    alignItems: "center",
  },

  storageIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
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
    color: "#242424",
  },

  storageSubtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: "#767680",
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.1,
    color: "#8A8993",
  },

  featureCard: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEF2",
  },

  featureRowLast: {
    borderBottomWidth: 0,
  },

  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F0F0F7",
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
    color: "#242424",
  },

  featureDescription: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
    color: "#8A8993",
  },

  planGroup: {
    gap: 10,
  },

  planCard: {
    position: "relative",
    minHeight: 88,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E7E7ED",
    flexDirection: "row",
    alignItems: "center",
  },

  planCardSelected: {
    borderColor: "#34345C",
    backgroundColor: "#F5F5FA",
  },

  planRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B8B8C2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  planRadioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#34345C",
  },

  planContent: {
    flex: 1,
  },

  planTitle: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#8A8993",
  },

  planPrice: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "900",
    color: "#242424",
  },

  planPeriod: {
    marginTop: 2,
    fontSize: 11,
    color: "#767680",
  },

  planBadge: {
    position: "absolute",
    top: 10,
    right: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#34345C",
  },

  planBadgeText: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.8,
    color: "#FFFFFF",
  },

  purchaseButton: {
    marginTop: 22,
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: "#34345C",
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
    color: "#FFFFFF",
  },

  disclaimer: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 10,
    lineHeight: 16,
    color: "#96959F",
  },

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
    backgroundColor: "#F0F0F7",
    alignItems: "center",
    justifyContent: "center",
  },

  activeTitle: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: "900",
    color: "#242424",
  },

  activeText: {
    marginTop: 9,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: "#767680",
  },

  secondaryButton: {
    marginTop: 24,
    minHeight: 50,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: "#34345C",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.9,
    color: "#FFFFFF",
  },
});

export default styles;
