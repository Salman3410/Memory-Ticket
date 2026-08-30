import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { Text, TouchableOpacity, View, Alert } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

import styles from "./shareExportSheetStyles";

const ShareExportSheet = forwardRef(
  (
    {
      onClose,

      onSaveImage,
      onExportPDF,

      onMore,

      savingImage = false,
      generatingPdf = false,
    },
    ref,
  ) => {
    const bottomSheetRef = useRef(null);

    const snapPoints = useMemo(() => ["30%"], []);

    // ========================================================
    // EXPOSE METHODS TO PARENT
    // ========================================================

    useImperativeHandle(
      ref,
      () => ({
        present: () => {
          bottomSheetRef.current?.present();
        },

        close: () => {
          bottomSheetRef.current?.dismiss();
        },
      }),
      [],
    );

    // ========================================================
    // DISMISS
    // ========================================================

    const handleDismiss = () => {
      onClose?.();
    };

    // ========================================================
    // EXPORT PDF
    // ========================================================

    const handleExportPDF = () => {
      if (savingImage || generatingPdf) {
        return;
      }

      bottomSheetRef.current?.dismiss();

      setTimeout(() => {
        onExportPDF?.();
      }, 250);
    };

    // ========================================================
    // SAVE IMAGE
    // ========================================================

    const handleSaveImage = () => {
      if (savingImage || generatingPdf) {
        return;
      }

      onSaveImage?.();
    };

    // ========================================================
    // MORE
    // ========================================================

    const handleMore = () => {
      if (savingImage || generatingPdf) {
        return;
      }

      bottomSheetRef.current?.dismiss();

      setTimeout(() => {
        onMore?.();
      }, 250);
    };

    // ========================================================
    // BACKDROP
    // ========================================================

    const renderBackdrop = (props) => {
      return (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.62}
          pressBehavior="close"
        />
      );
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        name="share-export-sheet"
        snapPoints={snapPoints}
        enablePanDownToClose
        enableOverDrag={false}
        backdropComponent={renderBackdrop}
        onDismiss={handleDismiss}
        backgroundStyle={styles.sheet}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetView style={styles.content}>
          {/* ==================================================
              TITLE
          ================================================== */}

          <Text style={styles.title}>Memory Ticket</Text>

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <View style={styles.optionsRow}>
            {/* =================================================
                SAVE IMAGE
            ================================================= */}

            <TouchableOpacity
              style={styles.option}
              onPress={handleSaveImage}
              disabled={savingImage || generatingPdf}
              activeOpacity={0.8}
            >
              <View style={styles.actionCircle}>
                {savingImage ? (
                  <Ionicons name="sync-outline" size={34} color="#26353B" />
                ) : (
                  <Ionicons name="download-outline" size={36} color="#26353B" />
                )}
              </View>

              <Text style={styles.optionText}>
                {savingImage ? "Saving..." : "Save image"}
              </Text>
            </TouchableOpacity>

            {/* =================================================
                EXPORT PDF
            ================================================= */}

            <TouchableOpacity
              style={styles.option}
              onPress={handleExportPDF}
              disabled={savingImage || generatingPdf}
              activeOpacity={0.8}
            >
              <View style={styles.actionCircle}>
                {generatingPdf ? (
                  <Ionicons name="sync-outline" size={34} color="#26353B" />
                ) : (
                  <Ionicons
                    name="document-text-outline"
                    size={34}
                    color="#26353B"
                  />
                )}
              </View>

              <Text style={styles.optionText}>
                {generatingPdf ? "Creating..." : "Export PDF"}
              </Text>
            </TouchableOpacity>

            {/* =================================================
                MORE
            ================================================= */}

            <TouchableOpacity
              style={styles.option}
              onPress={handleMore}
              disabled={savingImage || generatingPdf}
              activeOpacity={0.8}
            >
              <View style={styles.actionCircle}>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={34}
                  color="#26353B"
                />
              </View>

              <Text style={styles.optionText}>More</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

ShareExportSheet.displayName = "ShareExportSheet";

export default ShareExportSheet;
