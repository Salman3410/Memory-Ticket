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

  if (value instanceof Date) {
    date = value;
  } else if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    const [year, month, day] = value.split("-").map(Number);

    date = new Date(year, month - 1, day, 12, 0, 0, 0);
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
    12,
    0,
    0,
    0,
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
  const colors = theme?.colors || {};

  const backgroundColor =
    colors.background ||
    (isDark ? "#171724" : "#F1F0F6");

  const surfaceColor =
    colors.card ||
    colors.surface ||
    (isDark ? "#242438" : "#FFFFFF");

  const textColor =
    colors.text ||
    (isDark ? "#F5F5FA" : "#34345C");

  const mutedColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#AAAABC" : "#737387");

  const borderColor =
    colors.border ||
    (isDark ? "#39394F" : "#D9D8E2");

  const accentColor =
    colors.accent ||
    colors.primary ||
    "#E76F51";

  const initialDate = useMemo(
    () => normalizeDate(value),
    [value],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const [visibleMonth, setVisibleMonth] = useState(() =>
    getMonthStart(initialDate),
  );

  const sheetTranslateY = useRef(
    new Animated.Value(0),
  ).current;

  const screenHeight = Dimensions.get("window").height;

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
    [screenHeight, sheetTranslateY],
  );

  useEffect(() => {
    const nextDate = normalizeDate(value);

    setSelectedDate(nextDate);

    if (!isOpen) {
      setVisibleMonth(getMonthStart(nextDate));
    }
  }, [value, isOpen]);

  const weekdays = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();

    const firstWeekday = new Date(year, month, 1).getDay();

    const numberOfDays = new Date(
      year,
      month + 1,
      0,
    ).getDate();

    return [
      ...Array(firstWeekday).fill(null),
      ...Array.from(
        { length: numberOfDays },
        (_, index) => index + 1,
      ),
    ];
  }, [visibleMonth]);

  const monthLabel = visibleMonth.toLocaleDateString(
    undefined,
    {
      month: "long",
      year: "numeric",
    },
  );

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
        1,
      ),
    );
  };

  const goToNextMonth = () => {
    setVisibleMonth((current) =>
      new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        1,
      ),
    );
  };

  const handleSelectDay = (day) => {
    if (!day) {
      return;
    }

    setSelectedDate(
      new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth(),
        day,
        12,
        0,
        0,
        0,
      ),
    );
  };

  const handleConfirmDate = () => {
    onChange?.(normalizeDate(selectedDate));
    setIsOpen(false);
  };

  const today = normalizeDate(new Date());

  return (
    <View style={styles.container}>
      {/* Compact horizontal memory-date button */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add or change memory date"
        onPress={openPicker}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: surfaceColor,
            borderColor,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.triggerIcon,
            {
              backgroundColor: isDark
                ? "#393041"
                : "#FCE9E3",
            },
          ]}
        >
          <Ionicons
            name="calendar-outline"
            size={21}
            color={accentColor}
          />
        </View>

        <View style={styles.triggerContent}>
          <Text
            style={[
              styles.triggerTitle,
              { color: textColor },
            ]}
          >
            Memory date
          </Text>

          <Text
            style={[
              styles.triggerSubtitle,
              { color: mutedColor },
            ]}
            numberOfLines={1}
          >
            {value
              ? formatDate(normalizeDate(value))
              : "Choose when it happened"}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={19}
          color={mutedColor}
        />
      </Pressable>

      {/* Calendar bottom sheet */}
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
            accessibilityLabel="Close date picker"
            onPress={closePicker}
            style={styles.backdrop}
          />

          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.sheet,
              {
                backgroundColor: surfaceColor,
                borderColor,
                transform: [
                  { translateY: sheetTranslateY },
                ],
              },
            ]}
          >
            {/* Drag handle */}
            <View style={styles.dragArea}>
              <View
                style={[
                  styles.handle,
                  { backgroundColor: borderColor },
                ]}
              />
            </View>

            {/* Sheet heading */}
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeadingText}>
                <Text
                  style={[
                    styles.sheetTitle,
                    { color: textColor },
                  ]}
                >
                  Choose memory date
                </Text>

                <Text
                  style={[
                    styles.sheetSubtitle,
                    { color: mutedColor },
                  ]}
                >
                  When did this moment happen?
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={closePicker}
                hitSlop={10}
                style={[
                  styles.closeButton,
                  { backgroundColor },
                ]}
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={textColor}
                />
              </Pressable>
            </View>

            {/* Month navigation */}
            <View style={styles.monthNavigation}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Previous month"
                onPress={goToPreviousMonth}
                hitSlop={8}
                style={[
                  styles.monthArrow,
                  { borderColor, backgroundColor },
                ]}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={textColor}
                />
              </Pressable>

              <Text
                style={[
                  styles.monthLabel,
                  { color: textColor },
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
                  { borderColor, backgroundColor },
                ]}
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={textColor}
                />
              </Pressable>
            </View>

            {/* Weekday labels */}
            <View style={styles.weekdaysRow}>
              {weekdays.map((weekday) => (
                <View
                  key={weekday}
                  style={styles.dayCell}
                >
                  <Text
                    style={[
                      styles.weekdayText,
                      { color: mutedColor },
                    ]}
                  >
                    {weekday}
                  </Text>
                </View>
              ))}
            </View>

            {/* Calendar dates */}
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
                  12,
                );

                const isSelected = isSameDay(
                  date,
                  selectedDate,
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
                            borderColor: accentColor,
                          },
                        isSelected && {
                          backgroundColor: accentColor,
                          borderColor: accentColor,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          {
                            color: isSelected
                              ? "#FFFFFF"
                              : textColor,
                          },
                          isSelected &&
                            styles.selectedDayText,
                        ]}
                      >
                        {day}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>

            {/* Selected-date preview */}
            <View
              style={[
                styles.selectedDateBox,
                { backgroundColor, borderColor },
              ]}
            >
              <Ionicons
                name="calendar"
                size={19}
                color={accentColor}
              />

              <View style={styles.selectedDateTextWrap}>
                <Text
                  style={[
                    styles.selectedDateLabel,
                    { color: mutedColor },
                  ]}
                >
                  Selected date
                </Text>

                <Text
                  style={[
                    styles.selectedDateValue,
                    { color: textColor },
                  ]}
                >
                  {formatDate(selectedDate)}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.footer}>
              <Pressable
                accessibilityRole="button"
                onPress={closePicker}
                style={[
                  styles.footerButton,
                  styles.cancelButton,
                  {
                    borderColor,
                    backgroundColor: surfaceColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cancelButtonText,
                    { color: textColor },
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
                color={accentColor}
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
    lineHeight: 16,
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 30 : 22,
  },

  dragArea: {
    height: 30,
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
    marginBottom: 22,
  },

  sheetHeadingText: {
    flex: 1,
    gap: 5,
  },

  sheetTitle: {
    fontSize: 19,
    fontWeight: "700",
  },

  sheetSubtitle: {
    fontSize: 13,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  monthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  monthArrow: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  monthLabel: {
    fontSize: 16,
    fontWeight: "700",
  },

  weekdaysRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  weekdayText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 14,
  },

  dayCell: {
    width: "14.2857%",
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },

  dayText: {
    fontSize: 14,
  },

  selectedDayText: {
    fontWeight: "700",
  },

  selectedDateBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },

  selectedDateTextWrap: {
    flex: 1,
    gap: 4,
  },

  selectedDateLabel: {
    fontSize: 11,
  },

  selectedDateValue: {
    fontSize: 14,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    gap: 12,
  },

  footerButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },

  cancelButton: {
    borderWidth: 1,
  },

  cancelButtonText: {
    fontSize: 14,
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
