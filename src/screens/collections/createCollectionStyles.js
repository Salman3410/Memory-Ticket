import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // --------------------------------
  // CONTAINER
  // --------------------------------

  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  // --------------------------------
  // HEADER
  // --------------------------------

  header: {
    height: 80,

    paddingTop: 20,
    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: "#E1E0E8",
  },

  cancelText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#34345C",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#242424",
  },

  headerSpacer: {
    width: 52,
  },

  // --------------------------------
  // CONTENT
  // --------------------------------

  content: {
    padding: 20,
    paddingBottom: 35,
  },

  // --------------------------------
  // PREVIEW
  // --------------------------------

  previewTicket: {
    overflow: "hidden",

    borderRadius: 16,

    backgroundColor: "#FFFFFF",

    marginBottom: 26,
  },

  previewTop: {
    minHeight: 120,

    padding: 17,

    flexDirection: "row",
    alignItems: "center",
  },

  previewMark: {
    width: 58,
    height: 58,

    borderRadius: 29,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#34345C",
  },

  previewMarkText: {
    fontSize: 21,
    fontWeight: "800",

    color: "#FFFFFF",
  },

  previewText: {
    flex: 1,
    marginLeft: 14,
  },

  previewLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.5,

    color: "#E76F51",
  },

  previewName: {
    marginTop: 4,

    fontSize: 18,
    lineHeight: 22,
    fontWeight: "800",

    color: "#242424",
  },

  previewCount: {
    marginTop: 4,

    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,

    color: "#34345C",
  },

  previewDivider: {
    marginHorizontal: 17,

    borderTopWidth: 1,
    borderTopColor: "#CECDD6",
    borderStyle: "dashed",
  },

  previewFooter: {
    paddingHorizontal: 17,
    paddingVertical: 11,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  previewBrand: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.4,

    color: "#9999A1",
  },

  previewBarcode: {
    height: 16,

    flexDirection: "row",

    gap: 2,
  },

  previewBar: {
    height: "100%",

    backgroundColor: "#34345C",
  },

  // --------------------------------
  // FIELDS
  // --------------------------------

  fieldContainer: {
    marginBottom: 20,
  },

  label: {
    marginBottom: 8,

    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.3,

    color: "#242424",
  },

  // --------------------------------
  // NAME INPUT
  // --------------------------------

  inputWithIcon: {
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

  // --------------------------------
  // DESCRIPTION
  // --------------------------------

  descriptionInput: {
    minHeight: 110,

    paddingHorizontal: 13,
    paddingTop: 13,
    paddingBottom: 13,

    borderRadius: 10,

    backgroundColor: "#F8F8FA",

    fontSize: 12,
    lineHeight: 19,

    color: "#242424",

    textAlignVertical: "top",
  },

  // --------------------------------
  // CHARACTER COUNT
  // --------------------------------

  characterCount: {
    marginTop: 5,

    alignSelf: "flex-end",

    fontSize: 10,

    color: "#9A9AA3",
  },

  // --------------------------------
  // HELPER
  // --------------------------------

  helper: {
    padding: 14,

    borderRadius: 10,

    backgroundColor: "#E9E8F1",
  },

  helperTitle: {
    fontSize: 8,

    fontWeight: "900",

    letterSpacing: 1.4,

    color: "#34345C",
  },

  helperText: {
    marginTop: 6,

    fontSize: 11,

    lineHeight: 18,

    color: "#666666",
  },

  // --------------------------------
  // FOOTER
  // --------------------------------

  footer: {
    paddingHorizontal: 20,
    paddingTop: 11,
    paddingBottom: 20,

    backgroundColor: "#F1F0F6",

    borderTopWidth: 1,
    borderTopColor: "#E1E0E8",
  },

  createButton: {
    height: 48,

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#34345C",
  },

  createButtonDisabled: {
    opacity: 0.45,
  },

  createButtonText: {
    fontSize: 10,

    fontWeight: "900",

    letterSpacing: 1,

    color: "#FFFFFF",
  },
});

export default styles;
