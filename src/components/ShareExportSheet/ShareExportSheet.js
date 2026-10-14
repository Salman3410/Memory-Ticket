import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
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
    const { theme, isDark } = useTheme();
    const colors = theme?.colors || {};
    const surfaceColor =
      colors.surface || (isDark ? "#211F30" : "#FFFFFF");
    const actionSurfaceColor =
      colors.surfaceSecondary || (isDark ? "#292740" : "#F1F0F6");
    const textColor =
      colors.text || (isDark ? "#F7F5FC" : "#242424");
    const secondaryTextColor =
      colors.textSecondary ||
      colors.textMuted ||
      (isDark ? "#C4C0D0" : "#707080");
    const borderColor =
      colors.border || (isDark ? "#39364D" : "#D9D8E2");
    const primaryColor =
      colors.primary || (isDark ? "#C8C2FF" : "#34345C");

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["30%"], []);

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

    const handleDismiss = () => {
      onClose?.();
    };

    const handleExportPDF = () => {
      if (savingImage || generatingPdf) {
        return;
      }

      bottomSheetRef.current?.dismiss();

      setTimeout(() => {
        onExportPDF?.();
      }, 250);
    };

    const handleSaveImage = () => {
      if (savingImage || generatingPdf) {
        return;
      }

      onSaveImage?.();
    };

    const handleMore = () => {
      if (savingImage || generatingPdf) {
        return;
      }

      bottomSheetRef.current?.dismiss();

      setTimeout(() => {
        onMore?.();
      }, 250);
    };

    const renderBackdrop = (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.62}
        pressBehavior="close"
      />
    );

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        name="share-export-sheet"
        snapPoints={snapPoints}
        enablePanDownToClose
        enableOverDrag={false}
        backdropComponent={renderBackdrop}
        onDismiss={handleDismiss}
        backgroundStyle={[
          styles.sheet,
          { backgroundColor: surfaceColor },
        ]}
        handleIndicatorStyle={[
          styles.handle,
          { backgroundColor: borderColor },
        ]}
      >
        <BottomSheetView
          style={[styles.content, { backgroundColor: surfaceColor }]}
        >
          <Text style={[styles.title, { color: textColor }]}>Memento</Text>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.option, { backgroundColor: surfaceColor }]}
              onPress={handleSaveImage}
              disabled={savingImage || generatingPdf}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.actionCircle,
                  { backgroundColor: actionSurfaceColor, borderColor },
                ]}
              >
                {savingImage ? (
                  <Ionicons
                    name="sync-outline"
                    size={34}
                    color={primaryColor}
                  />
                ) : (
                  <Ionicons
                    name="download-outline"
                    size={36}
                    color={primaryColor}
                  />
                )}
              </View>

              <Text style={[styles.optionText, { color: secondaryTextColor }]}>
                {savingImage ? "Saving..." : "Save image"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={handleExportPDF}
              disabled={savingImage || generatingPdf}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.actionCircle,
                  { backgroundColor: actionSurfaceColor, borderColor },
                ]}
              >
                {generatingPdf ? (
                  <Ionicons
                    name="sync-outline"
                    size={34}
                    color={primaryColor}
                  />
                ) : (
                  <Ionicons
                    name="document-text-outline"
                    size={34}
                    color={primaryColor}
                  />
                )}
              </View>

              <Text style={[styles.optionText, { color: secondaryTextColor }]}>
                {generatingPdf ? "Creating..." : "Export PDF"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={handleMore}
              disabled={savingImage || generatingPdf}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.actionCircle,
                  { backgroundColor: actionSurfaceColor, borderColor },
                ]}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={34}
                  color={primaryColor}
                />
              </View>

              <Text style={[styles.optionText, { color: secondaryTextColor }]}>
                More
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

ShareExportSheet.displayName = "ShareExportSheet";

export default ShareExportSheet;
