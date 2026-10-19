import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // CONTAINER
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  // HEADER
  header: {
    minHeight: 64,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop:20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D9D8E2",
  },

  headerAction: {
    width: 64,
    minHeight: 40,
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#34345C",
  },

  headerTitle: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    color: "#242424",
  },

  headerSpacer: {
    width: 64,
    minHeight: 40,
  },

  // SCROLL CONTENT
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
  },

  // COLLECTION TICKET PREVIEW
  previewTicket: {
    width: "100%",
    overflow: "hidden",
    marginBottom: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    backgroundColor: "#FFFFFF",
  },

  previewTop: {
    minHeight: 116,
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  logoContainer: {
    width: 54,
    height: 54,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    backgroundColor: "#F8F8FA",
  },

  previewText: {
    flex: 1,
    minWidth: 0,
    marginLeft: 13,
  },

  previewLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#707080",
  },

  previewName: {
    marginTop: 5,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
    color: "#242424",
  },

  previewCount: {
    marginTop: 5,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#707080",
  },

  previewDivider: {
    marginHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#D9D8E2",
    borderStyle: "dashed",
  },

  previewFooter: {
    minHeight: 42,
    paddingHorizontal: 16,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  previewBrand: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.3,
    color: "#898895",
  },

  previewBarcode: {
    height: 16,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 2,
  },

  previewBar: {
    height: "100%",
    backgroundColor: "#34345C",
  },

  // FORM FIELDS
  fieldContainer: {
    width: "100%",
    marginBottom: 22,
  },

  label: {
    marginBottom: 9,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#707080",
  },

  // COLLECTION NAME
  inputWithIcon: {
    minHeight: 52,
    paddingHorizontal: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    backgroundColor: "#F8F8FA",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  input: {
    flex: 1,
    minWidth: 0,
    height: 50,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 14,
    color: "#242424",
  },

  // DESCRIPTION
  descriptionInput: {
    width: "100%",
    minHeight: 112,
    paddingHorizontal: 14,
    paddingTop: 13,
    paddingBottom: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    backgroundColor: "#F8F8FA",
    fontSize: 14,
    lineHeight: 21,
    color: "#242424",
    textAlignVertical: "top",
  },

  // CHARACTER COUNTS
  characterCount: {
    marginTop: 7,
    alignSelf: "flex-end",
    fontSize: 11,
    color: "#898895",
  },

  // MEMORY INFORMATION
  infoCard: {
    width: "100%",
    marginTop: 2,
    padding: 15,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    backgroundColor: "#FFFFFF",
  },

  infoTextContainer: {
    flex: 1,
    minWidth: 0,
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#242424",
  },

  infoDescription: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 19,
    color: "#707080",
  },

  // FOOTER
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#F1F0F6",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#D9D8E2",
  },

  // SAVE BUTTON
  saveButton: {
    minHeight: 52,
    paddingHorizontal: 18,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: "#34345C",
  },

  saveButtonDisabled: {
    opacity: 0.45,
  },

  saveButtonText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: "#FFFFFF",
  },
});

export default styles;