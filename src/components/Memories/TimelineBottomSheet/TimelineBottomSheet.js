import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
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
  { selectedMonth, onApply, onClear, onClose },
  ref,
) {
  const sheetRef = useRef(null);

  const [displayYear, setDisplayYear] = useState(getCurrentYear());
  const [draftMonth, setDraftMonth] = useState(null);

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

  // ------------------------------------------
  // BACKDROP
  // ------------------------------------------

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

  // ------------------------------------------
  // YEAR
  // ------------------------------------------

  const handleChangeYear = useCallback((direction) => {
    setDisplayYear((currentYear) => {
      const maxYear = getCurrentYear();
      const nextYear = currentYear + direction;

      // Prevent going below 2000
      if (nextYear < MIN_YEAR) {
        return currentYear;
      }

      // Prevent going above current year
      if (nextYear > maxYear) {
        return currentYear;
      }

      setDraftMonth((currentDraft) => {
        const month = currentDraft?.getMonth() ?? new Date().getMonth();

        return new Date(nextYear, month, 1);
      });

      return nextYear;
    });
  }, []);

  // ------------------------------------------
  // MONTH
  // ------------------------------------------

  const handleSelectMonth = useCallback(
    (monthIndex) => {
      setDraftMonth(new Date(displayYear, monthIndex, 1));
    },
    [displayYear],
  );

  // ------------------------------------------
  // CANCEL
  // ------------------------------------------

  const handleCancel = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  // ------------------------------------------
  // DONE
  // ------------------------------------------

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

  // ------------------------------------------
  // CLEAR
  // ------------------------------------------

  const handleClear = useCallback(() => {
    onClear?.();
    sheetRef.current?.dismiss();
  }, [onClear]);

  // ------------------------------------------
  // DISMISS
  // ------------------------------------------

  const handleDismiss = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const currentYear = getCurrentYear();

  const isMinYear = displayYear <= MIN_YEAR;
  const isMaxYear = displayYear >= currentYear;

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={["58%"]}
      enablePanDownToClose
      onDismiss={handleDismiss}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.sheetHandle}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.35}
          pressBehavior="close"
        />
      )}
    >
      <BottomSheetView style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.title}>Select Month</Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCancel}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={21} color="#34345C" />
          </TouchableOpacity>
        </View>

        {/* YEAR */}

        <View style={styles.yearRow}>
          <TouchableOpacity
            style={[styles.yearArrow, isMinYear && styles.yearArrowDisabled]}
            onPress={() => handleChangeYear(-1)}
            disabled={isMinYear}
            activeOpacity={0.8}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={isMinYear ? "#B8B7C0" : "#34345C"}
            />
          </TouchableOpacity>

          <Text style={styles.yearText}>{displayYear}</Text>

          <TouchableOpacity
            style={[styles.yearArrow, isMaxYear && styles.yearArrowDisabled]}
            onPress={() => handleChangeYear(1)}
            disabled={isMaxYear}
            activeOpacity={0.8}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isMaxYear ? "#B8B7C0" : "#34345C"}
            />
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
                ]}
                onPress={() => handleSelectMonth(index)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.monthText,
                    isSelected && styles.monthTextSelected,
                  ]}
                >
                  {month.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CLEAR */}

        {selectedMonth ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle-outline" size={18} color="#34345C" />

            <Text style={styles.clearButtonText}>Show all memories</Text>
          </TouchableOpacity>
        ) : null}

        {/* ACTIONS */}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleDone}
            activeOpacity={0.85}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

TimelineBottomSheet.displayName = "TimelineBottomSheet";

export default React.memo(TimelineBottomSheet);
