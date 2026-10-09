import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import styles from "./timelineBottomSheetStyles";

const MIN_YEAR = 2020;

const getCurrentYear = () => new Date().getFullYear();

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TimelineBottomSheet = forwardRef(function TimelineBottomSheet(
  { selectedMonth, onApply, onClear, onClose, theme, isDark },
  ref,
) {
  const sheetRef = useRef(null);

  const [displayYear, setDisplayYear] = useState(getCurrentYear());

  const [draftMonth, setDraftMonth] = useState(null);

  // --------------------------------------------------
  // THEME COLORS
  // --------------------------------------------------

  const colors = useMemo(() => {
    const themeColors = theme?.colors || {};

    return {
      background: themeColors.background || (isDark ? "#171724" : "#F1F0F6"),

      surface:
        themeColors.surface ||
        themeColors.card ||
        (isDark ? "#232333" : "#FFFFFF"),

      text: themeColors.text || (isDark ? "#F1F0F6" : "#242424"),

      textSecondary:
        themeColors.textSecondary ||
        themeColors.textMuted ||
        (isDark ? "#A6A6B8" : "#737387"),

      border: themeColors.border || (isDark ? "#38384C" : "#D9D8E2"),

      primary: themeColors.primary || "#34345C",

      accent: themeColors.accent || "#E76F51",
    };
  }, [theme, isDark]);

  // --------------------------------------------------
  // IMPERATIVE HANDLE
  // --------------------------------------------------

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        const currentDate = selectedMonth || new Date();

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        setDisplayYear(year);
        setDraftMonth(new Date(year, month, 1));

        requestAnimationFrame(() => {
          sheetRef.current?.present();
        });
      },

      close: () => {
        sheetRef.current?.dismiss();
      },
    }),
    [selectedMonth],
  );

  // --------------------------------------------------
  // BACKDROP
  // --------------------------------------------------

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.35}
        pressBehavior="close"
      />
    ),
    [],
  );

  // --------------------------------------------------
  // CHANGE YEAR
  // --------------------------------------------------

  const handleChangeYear = useCallback((direction) => {
    setDisplayYear((currentYear) => {
      const maxYear = getCurrentYear();
      const nextYear = currentYear + direction;

      if (nextYear < MIN_YEAR || nextYear > maxYear) {
        return currentYear;
      }

      setDraftMonth((currentDraft) => {
        const month = currentDraft?.getMonth() ?? new Date().getMonth();

        return new Date(nextYear, month, 1);
      });

      return nextYear;
    });
  }, []);

  // --------------------------------------------------
  // SELECT MONTH
  // --------------------------------------------------

  const handleSelectMonth = useCallback(
    (monthIndex) => {
      setDraftMonth(new Date(displayYear, monthIndex, 1));
    },
    [displayYear],
  );

  // --------------------------------------------------
  // CANCEL
  // --------------------------------------------------

  const handleCancel = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  // --------------------------------------------------
  // APPLY
  // --------------------------------------------------

  const handleDone = useCallback(() => {
    if (!draftMonth) {
      return;
    }

    const monthToApply = new Date(
      draftMonth.getFullYear(),
      draftMonth.getMonth(),
      1,
    );

    onApply?.(monthToApply);
    sheetRef.current?.dismiss();
  }, [draftMonth, onApply]);

  // --------------------------------------------------
  // CLEAR
  // --------------------------------------------------

  const handleClear = useCallback(() => {
    onClear?.();
    sheetRef.current?.dismiss();
  }, [onClear]);

  // --------------------------------------------------
  // DISMISS
  // --------------------------------------------------

  const handleDismiss = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const currentYear = getCurrentYear();

  const isMinYear = displayYear <= MIN_YEAR;
  const isMaxYear = displayYear >= currentYear;

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={["58%"]}
      enablePanDownToClose
      onDismiss={handleDismiss}
      backgroundStyle={[
        styles.sheetBackground,
        {
          backgroundColor: colors.surface,
        },
      ]}
      handleIndicatorStyle={[
        styles.sheetHandle,
        {
          backgroundColor: colors.border,
        },
      ]}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
          },
        ]}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Select Month
          </Text>

          <TouchableOpacity
            style={[
              styles.closeButton,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={handleCancel}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Close timeline"
          >
            <Ionicons name="close" size={21} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* YEAR SELECTOR */}

        <View style={styles.yearRow}>
          <TouchableOpacity
            style={[
              styles.yearArrow,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                opacity: isMinYear ? 0.45 : 1,
              },
            ]}
            onPress={() => handleChangeYear(-1)}
            disabled={isMinYear}
            activeOpacity={0.8}
            accessibilityLabel="Previous year"
          >
            <Ionicons name="chevron-back" size={20} color={colors.primary} />
          </TouchableOpacity>

          <Text
            style={[
              styles.yearText,
              {
                color: colors.text,
              },
            ]}
          >
            {displayYear}
          </Text>

          <TouchableOpacity
            style={[
              styles.yearArrow,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                opacity: isMaxYear ? 0.45 : 1,
              },
            ]}
            onPress={() => handleChangeYear(1)}
            disabled={isMaxYear}
            activeOpacity={0.8}
            accessibilityLabel="Next year"
          >
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* MONTH GRID */}

        <View style={styles.monthGrid}>
          {MONTHS.map((month, index) => {
            const isSelected =
              draftMonth?.getFullYear() === displayYear &&
              draftMonth?.getMonth() === index;

            return (
              <TouchableOpacity
                key={month}
                style={[
                  styles.monthButton,
                  isSelected && styles.monthButtonSelected,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.background,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => handleSelectMonth(index)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{
                  selected: isSelected,
                }}
              >
                <Text
                  style={[
                    styles.monthText,
                    isSelected && styles.monthTextSelected,
                    {
                      color: isSelected ? "#FFFFFF" : colors.text,
                    },
                  ]}
                >
                  {month.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CLEAR TIMELINE FILTER */}

        {selectedMonth ? (
          <TouchableOpacity
            style={[
              styles.clearButton,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={handleClear}
            activeOpacity={0.8}
          >
            <Ionicons
              name="close-circle-outline"
              size={18}
              color={colors.primary}
            />

            <Text
              style={[
                styles.clearButtonText,
                {
                  color: colors.primary,
                },
              ]}
            >
              Show all memories
            </Text>
          </TouchableOpacity>
        ) : null}

        {/* ACTIONS */}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.cancelButton,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={handleCancel}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.cancelButtonText,
                {
                  color: colors.text,
                },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.doneButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={handleDone}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.doneButtonText,
                {
                  color: "#FFFFFF",
                },
              ]}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

TimelineBottomSheet.displayName = "TimelineBottomSheet";

export default React.memo(TimelineBottomSheet);
