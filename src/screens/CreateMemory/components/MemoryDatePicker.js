import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TactileButton from "../../../components/common/TactileButton";

function normalizeDate(value) {
  let date;
  let dateOnly = false;

  if (value instanceof Date) {
    date = new Date(value.getTime());
  } else if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    const [year, month, day] = value.split("-").map(Number);

    // Date-only values use noon to preserve existing behavior.
    date = new Date(year, month - 1, day, 12, 0, 0, 0);
    dateOnly = true;
  } else {
    date = value ? new Date(value) : new Date();
  }

  if (Number.isNaN(date.getTime())) {
    date = new Date();
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    dateOnly ? 12 : date.getHours(),
    dateOnly ? 0 : date.getMinutes(),
    0,
    0
  );
}

function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatDate(date) {
  if (
    !(date instanceof Date) ||
    Number.isNaN(date.getTime())
  ) {
    return "Choose a date";
  }

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isSameDay(first, second) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function MemoryDatePicker({
  value,
  onChange,
  theme,
  isDark = false,
}) {
  const colors = useMemo(() => {
    const themeColors = theme?.colors || {};

    return {
      background:
        themeColors.background ||
        (isDark ? "#171724" : "#F1F0F6"),

      surface:
        themeColors.card ||
        themeColors.surface ||
        (isDark ? "#242438" : "#FFFFFF"),

      text:
        themeColors.text ||
        (isDark ? "#F5F5FA" : "#34345C"),

      muted:
        themeColors.textSecondary ||
        themeColors.textMuted ||
        (isDark ? "#AAAABC" : "#737387"),

      border:
        themeColors.border ||
        (isDark ? "#39394F" : "#D9D8E2"),

      accent:
        themeColors.accent ||
        themeColors.primary ||
        "#E76F51",
    };
  }, [theme, isDark]);

  const initialDate = useMemo(
    () => normalizeDate(value),
    [value]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const [visibleMonth, setVisibleMonth] = useState(() =>
    getMonthStart(initialDate)
  );

  const sheetTranslateY = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get("window").height;

  const weekdays = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,

        onMoveShouldSetPanResponderCapture: (_, gesture) =>
          gesture.dy > 8 &&
          gesture.dy > Math.abs(gesture.dx),

        onPanResponderMove: (_, gesture) => {
          if (gesture.dy > 0) {
            sheetTranslateY.setValue(gesture.dy);
          }
        },

        onPanResponderRelease: (_, gesture) => {
          const shouldClose =
            gesture.dy > 110 ||
            (gesture.dy > 35 && gesture.vy > 0.85);

          if (shouldClose) {
            Animated.timing(sheetTranslateY, {
              toValue: screenHeight,
              duration: 220,
              useNativeDriver: true,
            }).start(({ finished }) => {
              if (finished) {
                setIsOpen(false);
              }
            });
          } else {
            Animated.spring(sheetTranslateY, {
              toValue: 0,
              useNativeDriver: true,
              speed: 20,
              bounciness: 4,
            }).start();
          }
        },

        onPanResponderTerminate: () => {
          Animated.spring(sheetTranslateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },

        onPanResponderTerminationRequest: () => false,
      }),
    [screenHeight, sheetTranslateY]
  );

  useEffect(() => {
    const nextDate = normalizeDate(value);

    setSelectedDate(nextDate);

    if (!isOpen) {
      setVisibleMonth(getMonthStart(nextDate));
    }
  }, [value, isOpen]);

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();

    const firstWeekday = new Date(year, month, 1).getDay();

    const numberOfDays = new Date(
      year,
      month + 1,
      0
    ).getDate();

    return [
      ...Array(firstWeekday).fill(null),
      ...Array.from(
        { length: numberOfDays },
        (_, index) => index + 1
      ),
    ];
  }, [visibleMonth]);

  const monthLabel = visibleMonth.toLocaleDateString(
    undefined,
    {
      month: "long",
      year: "numeric",
    }
  );

  const today = normalizeDate(new Date());

  const openPicker = () => {
    const currentDate = normalizeDate(value);

    sheetTranslateY.setValue(0);

    setSelectedDate(currentDate);
    setVisibleMonth(getMonthStart(currentDate));
    setIsOpen(true);
  };

  const closePicker = () => {
    setIsOpen(false);
  };

  const goToPreviousMonth = () => {
    setVisibleMonth((current) =>
      new Date(
        current.getFullYear(),
        current.getMonth() - 1,
        1
      )
    );
  };

  const goToNextMonth = () => {
    setVisibleMonth((current) =>
      new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        1
      )
    );
  };

  const handleSelectDay = (day) => {
    if (!day) {
      return;
    }

    setSelectedDate((current) =>
      new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth(),
        day,
        current.getHours(),
        current.getMinutes(),
        0,
        0
      )
    );
  };

  const handleConfirmDate = () => {
    onChange?.(normalizeDate(selectedDate));
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* DATE AND TIME TRIGGER */}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add or change memory date and time"
        onPress={openPicker}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.triggerIcon,
            {
              backgroundColor: isDark ? "#393041" : "#FCE9E3",
            },
          ]}
        >
          <Ionicons
            name="calendar-outline"
            size={21}
            color={colors.accent}
          />
        </View>

        <View style={styles.triggerContent}>
          <Text
            style={[
              styles.triggerTitle,
              { color: colors.text },
            ]}
          >
            Memory date
          </Text>

          <Text
            style={[
              styles.triggerSubtitle,
              { color: colors.muted },
            ]}
            numberOfLines={2}
          >
            {value
              ? `${formatDate(normalizeDate(value))}`
              : "Choose when it happened"}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={19}
          color={colors.muted}
        />
      </Pressable>

      {/* DATE & TIME BOTTOM SHEET */}

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={closePicker}
      >
        <View style={styles.modalRoot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close date and time picker"
            onPress={closePicker}
            style={styles.backdrop}
          />

          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.sheet,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                transform: [
                  { translateY: sheetTranslateY },
                ],
              },
            ]}
          >
            {/* DRAG HANDLE */}

            <View style={styles.dragArea}>
              <View
                style={[
                  styles.handle,
                  { backgroundColor: colors.border },
                ]}
              />
            </View>

            {/* HEADER */}

            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeadingText}>
                <Text
                  style={[
                    styles.sheetTitle,
                    { color: colors.text },
                  ]}
                >
                  Choose date
                </Text>

                <Text
                  style={[
                    styles.sheetSubtitle,
                    { color: colors.muted },
                  ]}
                >
                  When did this memory happen?
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close picker"
                onPress={closePicker}
                hitSlop={10}
                style={[
                  styles.closeButton,
                  { backgroundColor: colors.background },
                ]}
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={colors.text}
                />
              </Pressable>
            </View>

            {/* MONTH NAVIGATION */}

            <View style={styles.monthNavigation}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Previous month"
                onPress={goToPreviousMonth}
                hitSlop={8}
                style={[
                  styles.monthArrow,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={colors.text}
                />
              </Pressable>

              <Text
                style={[
                  styles.monthLabel,
                  { color: colors.text },
                ]}
              >
                {monthLabel}
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Next month"
                onPress={goToNextMonth}
                hitSlop={8}
                style={[
                  styles.monthArrow,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.text}
                />
              </Pressable>
            </View>

            {/* WEEKDAYS */}

            <View style={styles.weekdaysRow}>
              {weekdays.map((weekday) => (
                <View
                  key={weekday}
                  style={styles.dayCell}
                >
                  <Text
                    style={[
                      styles.weekdayText,
                      { color: colors.muted },
                    ]}
                  >
                    {weekday}
                  </Text>
                </View>
              ))}
            </View>

            {/* CALENDAR */}

            <View style={styles.calendarGrid}>
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return (
                    <View
                      key={`empty-${index}`}
                      style={styles.dayCell}
                    />
                  );
                }

                const date = new Date(
                  visibleMonth.getFullYear(),
                  visibleMonth.getMonth(),
                  day,
                  12
                );

                const isSelected = isSameDay(
                  date,
                  selectedDate
                );

                const isToday = isSameDay(date, today);

                return (
                  <View
                    key={`${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}-${day}`}
                    style={styles.dayCell}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={date.toDateString()}
                      accessibilityState={{
                        selected: isSelected,
                      }}
                      onPress={() => handleSelectDay(day)}
                      style={[
                        styles.dayButton,
                        isToday &&
                          !isSelected && {
                            borderWidth: 1,
                            borderColor: colors.accent,
                          },
                        isSelected && {
                          backgroundColor: colors.accent,
                          borderColor: colors.accent,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          {
                            color: isSelected
                              ? "#FFFFFF"
                              : colors.text,
                          },
                          isSelected && styles.selectedDayText,
                        ]}
                      >
                        {day}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>

            {/* SELECTED DATE AND TIME */}

            <View
              style={[
                styles.selectedDateBox,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="calendar"
                size={19}
                color={colors.accent}
              />

              <View style={styles.selectedDateTextWrap}>
                <Text
                  style={[
                    styles.selectedDateLabel,
                    { color: colors.muted },
                  ]}
                >
                  Selected date
                </Text>

                <Text
                  style={[
                    styles.selectedDateValue,
                    { color: colors.text },
                  ]}
                >
                  {formatDate(selectedDate)}
                </Text>
              </View>
            </View>

            {/* ACTIONS */}

            <View style={styles.footer}>
              <Pressable
                accessibilityRole="button"
                onPress={closePicker}
                style={[
                  styles.footerButton,
                  styles.cancelButton,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cancelButtonText,
                    { color: colors.text },
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>

              <TactileButton
                label="Done"
                onPress={handleConfirmDate}
                icon="checkmark"
                iconPosition="left"
                color={colors.accent}
                textColor="#FFFFFF"
                iconColor="#FFFFFF"
                height={48}
                borderRadius={14}
                depth={2}
                style={{
                  flex: 1,
                  width: "auto",
                  marginBottom: 0,
                }}
                contentStyle={[
                  styles.footerButton,
                  styles.doneButton,
                ]}
                textStyle={styles.doneButtonText}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 14,
  },

  trigger: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 66,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },

  triggerIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  triggerContent: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },

  triggerTitle: {
    fontSize: 14,
    fontWeight: "700",
  },

  triggerSubtitle: {
    fontSize: 12,
    lineHeight: 17,
  },

  // Bottom sheet

  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.48)",
  },

  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 26 : 16,
  },

  dragArea: {
    height: 25,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  handle: {
    width: 42,
    height: 5,
    borderRadius: 5,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sheetHeadingText: {
    flex: 1,
    gap: 4,
  },

  sheetTitle: {
    fontSize: 19,
    fontWeight: "700",
  },

  sheetSubtitle: {
    fontSize: 12,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  monthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  monthArrow: {
    width: 34,
    height: 34,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  monthLabel: {
    fontSize: 15,
    fontWeight: "700",
  },

  weekdaysRow: {
    flexDirection: "row",
    marginBottom: 4,
  },

  weekdayText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  dayCell: {
    width: "14.2857%",
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  dayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },

  dayText: {
    fontSize: 13,
  },

  selectedDayText: {
    fontWeight: "700",
  },

  // Time picker

  timeSection: {
    paddingHorizontal: 11,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 10,
  },

  timeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 9,
  },

  timeHeadingText: {
    flex: 1,
    gap: 2,
  },

  timeTitle: {
    fontSize: 12,
    fontWeight: "700",
  },

  timeSubtitle: {
    fontSize: 10,
  },

  timeControls: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 7,
  },

  timeUnit: {
    flex: 1,
    minWidth: 0,
  },

  timeUnitLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
    marginBottom: 5,
    textAlign: "center",
  },

  timeStepper: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
  },

  timeArrow: {
    width: 27,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  timeValue: {
    fontSize: 14,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },

  timeColon: {
    fontSize: 18,
    fontWeight: "700",
    paddingBottom: 7,
  },

  periodButton: {
    minWidth: 48,
    height: 36,
    marginBottom: 0,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  periodButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  // Selected value

  selectedDateBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginBottom: 12,
  },

  selectedDateTextWrap: {
    flex: 1,
    gap: 3,
  },

  selectedDateLabel: {
    fontSize: 10,
  },

  selectedDateValue: {
    fontSize: 12,
    fontWeight: "600",
  },

  selectedTimeValue: {
    fontSize: 12,
    fontWeight: "800",
  },

  // Footer

  footer: {
    flexDirection: "row",
    gap: 10,
  },

  footerButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },

  cancelButton: {
    borderWidth: 1,
  },

  cancelButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },

  doneButton: {
    borderWidth: 1,
    borderColor: "transparent",
  },

  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default MemoryDatePicker;