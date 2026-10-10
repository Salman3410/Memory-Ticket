import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system/legacy";

import { useMemory } from "../../hooks/useMemory";
import { useAppAlert } from "../../context/AlertContext";

import styles from "./exportPdfStyles";

const A7_WIDTH_MM = 74;
const A7_HEIGHT_MM = 105;

const A7_WIDTH_PX = 210;
const A7_HEIGHT_PX = 298;

const CLASSIC_BACK_IMAGE = require("../../../assets/tickets/classic.png");

const PDF_BACK_OPTIONS = [
  {
    id: "blank",
    title: "Blank Back",
    description: "Classic Memento ticket back.",
  },
  {
    id: "standard",
    title: "Memory Archive",
    description: "Classic Memento ticket back.",
  },
];

const imageToBase64 = async (uri) => {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return `data:image/png;base64,${base64}`;
};

const getClassicBackBase64 = async () => {
  const asset = Asset.fromModule(CLASSIC_BACK_IMAGE);

  await asset.downloadAsync();

  if (!asset.localUri) {
    throw new Error("Classic ticket back image could not be loaded.");
  }

  return await imageToBase64(asset.localUri);
};

function ExportPdfScreen({ navigation, route }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};
  const screenBackground = colors.background || (isDark ? "#171624" : "#F1F0F6");
  const surfaceColor = colors.surface || (isDark ? "#211F30" : "#FFFFFF");
  const textColor = colors.text || (isDark ? "#F7F5FC" : "#242424");
  const secondaryTextColor = colors.textSecondary || colors.textMuted || (isDark ? "#C4C0D0" : "#707080");
  const borderColor = colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const { getMemoryById } = useMemory();
  const { showAlert } = useAppAlert();

  const memoryId = route?.params?.memoryId;

  const frontTicketUri = route?.params?.frontTicketUri;

  const memory = getMemoryById(memoryId);

  const [selectedBack, setSelectedBack] = useState("blank");
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const buildPdfHtml = (frontTicketImage, classicBackImage) => {
    return `
      <!DOCTYPE html>

      <html>

      <head>

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <style>

          @page {
            size:
              ${A7_WIDTH_MM}mm
              ${A7_HEIGHT_MM}mm;

            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            width:
              ${A7_WIDTH_MM}mm;

            height:
              ${A7_HEIGHT_MM}mm;

            margin: 0;
            padding: 0;
          }

          body {
            margin: 0;
            padding: 0;

            background: #FFFFFF;
          }

          .page {
            position: relative;

            width:
              ${A7_WIDTH_MM}mm;

            height:
              ${A7_HEIGHT_MM}mm;

            margin: 0;
            padding: 0;

            overflow: hidden;

            page-break-after: always;
            break-after: page;

            -webkit-print-color-adjust:
              exact;

            print-color-adjust:
              exact;
          }

          .page:last-child {
            page-break-after: auto;
            break-after: auto;
          }

          .page-image {
            display: block;

            width:
              ${A7_WIDTH_MM}mm;

            height:
              ${A7_HEIGHT_MM}mm;

            margin: 0;
            padding: 0;

            border: 0;

            object-fit: fill;

            -webkit-print-color-adjust:
              exact;

            print-color-adjust:
              exact;
          }

        </style>

      </head>

      <body>

        <!-- PAGE 1 -->
        <section class="page">

          <img
            class="page-image"
            src="${frontTicketImage}"
            alt="Memento Memory Ticket"
          />

        </section>

        <!-- PAGE 2 -->
        <section class="page">

          <img
            class="page-image"
            src="${classicBackImage}"
            alt="Memento Classic Ticket Back"
          />

        </section>

      </body>

      </html>
    `;
  };

  const handleExportPdf = async () => {
    try {
      if (generatingPdf) {
        return;
      }

      if (!memory) {
        showAlert({
          type: "danger",
          icon: "close-circle-outline",
          title: "Memory Not Found",
          message: "Unable to find this memory.",
          confirmText: "OK",
        });

        return;
      }

      if (!frontTicketUri) {
        showAlert({
          type: "danger",
          icon: "document-text-outline",
          title: "Ticket Missing",
          message:
            "The Memory Ticket could not be received from Memory Details.",
          confirmText: "OK",
        });

        return;
      }

      setGeneratingPdf(true);

      const frontTicketImage = await imageToBase64(frontTicketUri);

      const classicBackImage = await getClassicBackBase64();

      const html = buildPdfHtml(frontTicketImage, classicBackImage);

      const { uri, numberOfPages } = await Print.printToFileAsync({
        html,

        base64: false,

        width: A7_WIDTH_PX,
        height: A7_HEIGHT_PX,

        textZoom: 100,
      });

      console.log("Memento A7 PDF:", uri);
      console.log("PDF pages:", numberOfPages);
      console.log("Selected back:", selectedBack);

      const available = await Sharing.isAvailableAsync();

      if (!available) {
        showAlert({
          type: "success",
          icon: "document-text-outline",
          title: "PDF Created",
          message: "Your A7 Memory Ticket PDF was created successfully.",
          confirmText: "Done",
        });

        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Export A7 Memory Ticket",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      console.log("PDF export error:", error);

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "PDF Export Failed",
        message:
          error?.message ||
          "Something went wrong while creating your Memory Ticket PDF.",
        confirmText: "OK",
      });
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (!memory) {
    return (
      <View style={[styles.notFound, { backgroundColor: screenBackground }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={screenBackground} />
        <Ionicons name="sad-outline" size={45} color={colors.primary || "#34345C"} />

        <Text style={[styles.notFoundTitle, { color: textColor }]}>Memory not found</Text>

        <TouchableOpacity
          style={styles.backButtonLarge}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, { color: colors.primaryText || "#FFFFFF" }]}>GO BACK</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: screenBackground }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={screenBackground} />
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: surfaceColor, borderColor,  }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text || "#242424"} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.eyebrow, { color: secondaryTextColor }]}>EXPORT PDF</Text>

          <Text style={[styles.headerTitle, { color: textColor }]}>Choose your ticket back</Text>
        </View>

        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: surfaceColor, borderColor,  }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={22} color={colors.text || "#242424"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.description, { color: secondaryTextColor }]}>
          Choose the back design for your Memento ticket.
        </Text>

        {/* TICKET BACK */}

        <Text style={[styles.sectionLabel, { color: secondaryTextColor }]}>TICKET BACK</Text>

        <View style={styles.optionsRow}>
          {PDF_BACK_OPTIONS.map((option) => {
            const selected = selectedBack === option.id;

            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  selected && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedBack(option.id)}
                activeOpacity={0.88}
              >
                <View
                  style={[
                    styles.previewWrapper,
                    selected && styles.previewWrapperSelected,
                  ]}
                >

                  <Image
                    source={CLASSIC_BACK_IMAGE}
                    style={styles.miniPage}
                    resizeMode="stretch"
                  />

                  {selected && (
                    <View style={[styles.selectedBadge, { backgroundColor: surfaceColor, borderColor }]}>
                      <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                    </View>
                  )}
                </View>

                <Text style={[styles.optionTitle, { color: textColor }]}>{option.title}</Text>

                <Text style={[styles.optionDescription, { color: secondaryTextColor }]}>
                  {option.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* PAPER INFO */}

        <View style={[styles.paperInfo, { backgroundColor: surfaceColor, borderColor,  }]}>
          <View style={[styles.paperInfoItem, { backgroundColor: surfaceColor, borderColor }]}>
            <Ionicons name="document-outline" size={16} color={colors.primary || "#34345C"} />

            <Text style={[styles.paperInfoText, { color: secondaryTextColor }]}>A7</Text>
          </View>

          <View style={styles.paperInfoDivider} />

          <View style={[styles.paperInfoItem, { backgroundColor: surfaceColor, borderColor }]}>
            <Ionicons name="resize-outline" size={16} color={colors.primary || "#34345C"} />

            <Text style={[styles.paperInfoText, { color: secondaryTextColor }]}>74 × 105 mm</Text>
          </View>

          <View style={styles.paperInfoDivider} />

          <View style={[styles.paperInfoItem, { backgroundColor: surfaceColor, borderColor }]}>
            <Ionicons name="copy-outline" size={16} color={colors.primary || "#34345C"} />

            <Text style={[styles.paperInfoText, { color: secondaryTextColor }]}>2 pages</Text>
          </View>
        </View>

        {/* EXPORT */}

        <TouchableOpacity
          style={[
            styles.exportButton, { backgroundColor: colors.primary || "#34345C" }, generatingPdf && styles.exportButtonDisabled,
          ]}
          onPress={handleExportPdf}
          disabled={generatingPdf}
          activeOpacity={0.85}
        >
          {generatingPdf ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />

              <Text style={[styles.exportButtonText, { color: colors.primaryText || "#FFFFFF" }]}>CREATING PDF...</Text>
            </>
          ) : (
            <>
              <Ionicons
                name="document-text-outline"
                size={19}
                color="#FFFFFF"
              />

              <Text style={[styles.exportButtonText, { color: colors.primaryText || "#FFFFFF" }]}>EXPORT PDF</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: surfaceColor, borderColor,  }]}
          onPress={() => navigation.goBack()}
          disabled={generatingPdf}
        >
          <Text style={[styles.cancelButtonText, { color: colors.primary || "#34345C" }]}>CANCEL</Text>
        </TouchableOpacity>

        <Text style={[styles.footerHint, { color: secondaryTextColor }]}>
          Page 1 uses the exact ticket captured from Memory Details. Page 2 uses
          the classic Memento ticket back.
        </Text>
      </ScrollView>
    </View>
  );
}

export default ExportPdfScreen;
