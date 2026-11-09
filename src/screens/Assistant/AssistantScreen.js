
import { useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { askAssistant } from "../../api/assistantApi";
import { useAuth } from "../../hooks/useAuth";
import { useMemory } from "../../hooks/useMemory";
import { useTheme } from "../../context/ThemeContext";

// --------------------------------------------------
// SUGGESTED PROMPTS
// --------------------------------------------------

const SUGGESTED_PROMPTS = [
  {
    label: "Latest memory",
    question: "Show my latest saved memory",
    icon: "time-outline",
  },
  {
    label: "Favorite memories",
    question: "Find my favorite memories",
    icon: "heart-outline",
  },
  {
    label: "Travel memories",
    question: "Find my travel memories",
    icon: "airplane-outline",
  },
];

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const createMessageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getSourceMemoryId = (source) => {
  const id =
    source?.id ||
    source?.memoryId ||
    source?._id ||
    "";

  return String(id).trim();
};

// --------------------------------------------------
// ASSISTANT SCREEN
// --------------------------------------------------

function AssistantScreen({ navigation }) {
  const { token } = useAuth();

  const { theme, isDark } = useTheme();

  const {
    getMemoryById,
    ensureMemoryAvailable,
  } = useMemory();

  // --------------------------------------------------
  // THEME COLORS
  // --------------------------------------------------

  const themeColors = theme?.colors || {};

  const colors = {
    background:
      themeColors.background || "#F1F0F6",

    surface:
      themeColors.surface || "#FFFFFF",

    card:
      themeColors.card ||
      themeColors.surface ||
      "#FFFFFF",

    text:
      themeColors.text ||
      (isDark ? "#F7F5FC" : "#24243A"),

    secondary:
      themeColors.textSecondary ||
      themeColors.textMuted ||
      (isDark ? "#B9B5C8" : "#747386"),

    primary:
      themeColors.primary || "#34345C",

    accent:
      themeColors.accent || "#E76F51",

    border:
      themeColors.border ||
      (isDark ? "#39364D" : "#E1DFE9"),

    muted:
      themeColors.iconMuted || "#9290A2",
  };

  // --------------------------------------------------
  // REFS
  // --------------------------------------------------

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const requestLockRef = useRef(false);

  // Prevent multiple memory source navigation requests.
  const openingMemoryLockRef = useRef(null);

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [input, setInput] = useState("");

  const [isSending, setIsSending] = useState(false);

  const [openingMemoryId, setOpeningMemoryId] =
    useState(null);

  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",

      text:
        "Hello! I'm Ask Memento. ✨\n\n" +
        "I can help you explore the memories you've saved. " +
        "Ask me about a date, place, favorite moment, or your latest memories.",

      sources: [],
    },
  ]);

  // --------------------------------------------------
  // SEND MESSAGE
  // --------------------------------------------------

  const handleSend = async (
    value = input,
    options = {},
  ) => {
    const question =
      typeof value === "string"
        ? value.trim()
        : "";

    const isRetry = options.isRetry === true;

    if (
      !question ||
      requestLockRef.current
    ) {
      return;
    }

    // --------------------------------------------------
    // AUTHENTICATION CHECK
    // --------------------------------------------------

    if (!token) {
      setMessages((previous) => [
        ...previous,
        {
          id: createMessageId(),

          role: "assistant",

          text:
            "Your session is unavailable. Please sign in again.",

          sources: [],

          isError: true,
          retryable: false,
        },
      ]);

      return;
    }

    requestLockRef.current = true;

    setIsSending(true);

    // --------------------------------------------------
    // ADD USER MESSAGE
    // --------------------------------------------------

    if (!isRetry) {
      Keyboard.dismiss();

      setInput("");

      const userMessage = {
        id: createMessageId(),

        role: "user",

        text: question,

        sources: [],
      };

      setMessages((previous) => [
        ...previous,
        userMessage,
      ]);
    }

    // --------------------------------------------------
    // API REQUEST
    // --------------------------------------------------

    try {
      const result = await askAssistant(
        token,
        question,
      );

      if (!result?.success) {
        const error = new Error(
          result?.message ||
            "Unable to contact Ask Memento.",
        );

        error.status = result?.status || 0;

        error.retryable =
          error.status === 0 ||
          error.status >= 500;

        throw error;
      }

      const payload = result.data;

      if (
        !payload?.success ||
        typeof payload.answer !== "string" ||
        !payload.answer.trim()
      ) {
        const error = new Error(
          payload?.message ||
            "The assistant returned an invalid response.",
        );

        error.retryable = false;

        throw error;
      }

      // --------------------------------------------------
      // ADD ASSISTANT RESPONSE
      // --------------------------------------------------

      setMessages((previous) => [
        ...previous,
        {
          id: createMessageId(),

          role: "assistant",

          text: payload.answer,

          sources: Array.isArray(payload.sources)
            ? payload.sources
            : [],

          usedMemoryCount:
            payload.usedMemoryCount || 0,
        },
      ]);
    } catch (error) {
      console.error(
        "[Ask Memento] Request failed:",
        {
          status: error?.status,
          code: error?.code,
          message: error?.message,
        },
      );

      const retryable =
        typeof error?.retryable === "boolean"
          ? error.retryable
          : error?.status === 0 ||
            error?.status >= 500;

      setMessages((previous) => [
        ...previous,
        {
          id: createMessageId(),

          role: "assistant",

          text:
            error?.message ||
            "Something went wrong. Please try again.",

          sources: [],

          isError: true,

          retryQuestion: question,

          retryable,

          errorCode: error?.code || null,

          status: error?.status || null,
        },
      ]);
    } finally {
      requestLockRef.current = false;

      setIsSending(false);
    }
  };

  // --------------------------------------------------
  // RETRY MESSAGE
  // --------------------------------------------------

  const handleRetry = (message) => {
    if (
      !message?.retryQuestion ||
      message.retryable !== true ||
      requestLockRef.current
    ) {
      return;
    }

    handleSend(message.retryQuestion, {
      isRetry: true,
    });
  };

  // --------------------------------------------------
  // OPEN MEMORY SOURCE
  // --------------------------------------------------

  const handleOpenMemory = async (source) => {
    const memoryId = getSourceMemoryId(source);

    // --------------------------------------------------
    // INVALID SOURCE
    // --------------------------------------------------

    if (!memoryId) {
      Alert.alert(
        "Memory Unavailable",

        "This memory source does not contain a valid memory ID.",
      );

      return;
    }

    // --------------------------------------------------
    // PREVENT DUPLICATE NAVIGATION
    // --------------------------------------------------

    if (openingMemoryLockRef.current !== null) {
      return;
    }

    openingMemoryLockRef.current = memoryId;

    setOpeningMemoryId(memoryId);

    try {
      // --------------------------------------------------
      // 1. CHECK CURRENT MEMORY COLLECTION
      // --------------------------------------------------

      let memory = getMemoryById(memoryId);

      // --------------------------------------------------
      // 2. RECOVER IF MISSING LOCALLY
      // --------------------------------------------------

      if (!memory) {
        if (
          typeof ensureMemoryAvailable !== "function"
        ) {
          throw new Error(
            "Memory recovery is not available. Please update MemoryContext.",
          );
        }

        const result =
          await ensureMemoryAvailable(memoryId);

        if (
          !result?.success ||
          !result.memory
        ) {
          if (result?.reason === "invalid_id") {
            Alert.alert(
              "Invalid Memory",

              "This source contains an invalid memory identifier.",
            );
          } else if (
            result?.reason === "not_found"
          ) {
            Alert.alert(
              "Memory Not Found",

              "This memory is no longer available in your account. It may have been deleted.",
            );
          } else if (
            result?.reason === "session_changed"
          ) {
            Alert.alert(
              "Session Changed",

              "Your account session has changed. Please try again.",
            );
          } else if (
            result?.reason === "refresh_failed"
          ) {
            Alert.alert(
              "Unable to Load Memory",

              "Memento could not retrieve this memory. Check your internet connection and try again.",
            );
          } else {
            Alert.alert(
              "Memory Unavailable",

              "This memory source could not be opened.",
            );
          }

          return;
        }

        memory = result.memory;
      }

      // --------------------------------------------------
      // 3. RESOLVE CANONICAL MEMORY ID
      // --------------------------------------------------

      const resolvedMemoryId = String(
        memory._id ||
          memory.id ||
          memory.clientMemoryId ||
          "",
      ).trim();

      if (!resolvedMemoryId) {
        Alert.alert(
          "Memory Unavailable",

          "The memory was found, but its identifier is missing.",
        );

        return;
      }

      // --------------------------------------------------
      // 4. NAVIGATE TO MEMORY DETAILS
      // --------------------------------------------------

      navigation.navigate("MemoryDetails", {
        memoryId: resolvedMemoryId,
      });
    } catch (error) {
      console.error(
        "[Ask Memento] Source navigation failed:",
        {
          memoryId,
          message: error?.message,
          error,
        },
      );

      Alert.alert(
        "Unable to Open Memory",

        error?.message ||
          "Something went wrong while opening this memory. Please try again.",
      );
    } finally {
      openingMemoryLockRef.current = null;

      setOpeningMemoryId(null);
    }
  };

  // --------------------------------------------------
  // FORMAT SOURCE DATE
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    // Backend can return either an ISO timestamp
    // or an ordinary date string.
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return String(date);
    }

    return parsed.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // RENDER MEMORY SOURCE CARD
  // --------------------------------------------------

  const renderSource = (source, index) => {
    const sourceId = getSourceMemoryId(source);

    const isOpening =
      openingMemoryId !== null &&
      openingMemoryId === sourceId;

    const hasValidId = Boolean(sourceId);

    return (
      <TouchableOpacity
        key={`${sourceId || "source"}-${index}`}
        style={[
          styles.sourceCard,
          {
            backgroundColor: colors.card,

            borderColor: colors.border,

            opacity:
              openingMemoryId !== null
                ? isOpening
                  ? 0.75
                  : 0.55
                : 1,
          },
        ]}
        onPress={() => handleOpenMemory(source)}
        disabled={openingMemoryId !== null}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Open memory ${
          source.title || "memory"
        }`}
        accessibilityState={{
          disabled:
            openingMemoryId !== null ||
            !hasValidId,

          busy: isOpening,
        }}
      >
        {/* SOURCE IMAGE */}

        {source.thumbnail ? (
          <Image
            source={{
              uri: source.thumbnail,
            }}
            style={styles.sourceImage}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.sourceImagePlaceholder,
              {
                backgroundColor: colors.background,
              },
            ]}
          >
            <Ionicons
              name="ticket-outline"
              size={25}
              color={colors.primary}
            />
          </View>
        )}

        {/* SOURCE INFORMATION */}

        <View style={styles.sourceContent}>
          <Text
            style={[
              styles.sourceTitle,
              {
                color: colors.text,
              },
            ]}
            numberOfLines={2}
          >
            {source.title || "Untitled memory"}
          </Text>

          <Text
            style={[
              styles.sourceMeta,
              {
                color: colors.secondary,
              },
            ]}
            numberOfLines={1}
          >
            {formatDate(source.date)}

            {source.location
              ? ` · ${source.location}`
              : ""}
          </Text>

          {!!source.tags?.length && (
            <Text
              style={[
                styles.sourceTags,
                {
                  color: colors.secondary,
                },
              ]}
              numberOfLines={1}
            >
              {source.tags
                .map((tag) => `#${tag}`)
                .join("  ")}
            </Text>
          )}
        </View>

        {/* OPENING INDICATOR */}

        {isOpening ? (
          <ActivityIndicator
            size="small"
            color={colors.accent}
          />
        ) : (
          <Ionicons
            name="chevron-forward"
            size={19}
            color={colors.secondary}
          />
        )}
      </TouchableOpacity>
    );
  };

  // --------------------------------------------------
  // RENDER CHAT MESSAGE
  // --------------------------------------------------

  const renderMessage = (message) => {
    const isUser = message.role === "user";

    return (
      <View
        key={message.id}
        style={[
          styles.messageRow,

          isUser
            ? styles.userMessageRow
            : styles.assistantMessageRow,
        ]}
      >
        {/* ASSISTANT AVATAR */}

        {!isUser && (
          <View
            style={[
              styles.assistantAvatar,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Ionicons
              name="sparkles"
              size={17}
              color="#FFFFFF"
            />
          </View>
        )}

        <View style={styles.messageBody}>
          {/* MESSAGE BUBBLE */}

          <View
            style={[
              styles.messageBubble,
              {
                backgroundColor: isUser
                  ? colors.primary
                  : colors.card,

                borderColor: isUser
                  ? colors.primary
                  : colors.border,
              },

              isUser && styles.userBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                {
                  color: isUser
                    ? "#FFFFFF"
                    : colors.text,
                },
              ]}
            >
              {message.text}
            </Text>
          </View>

          {/* MEMORY SOURCES */}

          {!isUser &&
            message.sources?.length > 0 && (
              <View style={styles.sourcesContainer}>
                <Text
                  style={[
                    styles.sourcesHeading,
                    {
                      color: colors.secondary,
                    },
                  ]}
                >
                  MEMORIES FOUND · {message.sources.length}
                </Text>

                {message.sources.map(renderSource)}
              </View>
            )}

          {/* RETRY ACTION */}

          {message.isError &&
            message.retryable === true && (
              <TouchableOpacity
                style={[
                  styles.retryButton,
                  {
                    opacity: isSending ? 0.45 : 1,
                  },
                ]}
                onPress={() => handleRetry(message)}
                disabled={isSending}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Retry failed question"
              >
                <Ionicons
                  name="refresh-outline"
                  size={15}
                  color={colors.accent}
                />

                <Text
                  style={{
                    color: colors.accent,
                    fontSize: 12,
                    fontWeight: "700",
                  }}
                >
                  Try again
                </Text>
              </TouchableOpacity>
            )}
        </View>
      </View>
    );
  };

  // --------------------------------------------------
  // SCREEN
  // --------------------------------------------------

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <StatusBar
        barStyle={
          isDark ? "light-content" : "dark-content"
        }
        backgroundColor={colors.background}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        {/* HEADER */}

        <View
          style={[
            styles.header,
            {
              borderBottomColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.headerButton,
              {
                backgroundColor: colors.card,
              },
            ]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={colors.text}
            />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text
              style={[
                styles.headerTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Ask Memento
            </Text>

            <Text
              style={[
                styles.headerSubtitle,
                {
                  color: colors.secondary,
                },
              ]}
            >
              Explore your memories
            </Text>
          </View>

          <View
            style={[
              styles.headerAvatar,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Ionicons
              name="sparkles"
              size={21}
              color="#FFFFFF"
            />
          </View>
        </View>

        {/* CHAT */}

        <ScrollView
          ref={scrollRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({
              animated: true,
            })
          }
        >
          {messages.map(renderMessage)}

          {/* LOADING */}

          {isSending && (
            <View style={styles.loadingRow}>
              <View
                style={[
                  styles.assistantAvatar,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                <Ionicons
                  name="sparkles"
                  size={17}
                  color="#FFFFFF"
                />
              </View>

              <View
                style={[
                  styles.loadingBubble,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <ActivityIndicator
                  size="small"
                  color={colors.accent}
                />

                <Text
                  style={[
                    styles.loadingText,
                    {
                      color: colors.secondary,
                    },
                  ]}
                >
                  Looking through your memories...
                </Text>
              </View>
            </View>
          )}

          {/* SUGGESTED PROMPTS */}

          {messages.length === 1 && !isSending && (
            <View style={styles.suggestionsContainer}>
              <Text
                style={[
                  styles.suggestionsTitle,
                  {
                    color: colors.secondary,
                  },
                ]}
              >
                TRY ASKING
              </Text>

              {SUGGESTED_PROMPTS.map((prompt) => (
                <TouchableOpacity
                  key={prompt.label}
                  style={[
                    styles.suggestionButton,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() =>
                    handleSend(prompt.question)
                  }
                  activeOpacity={0.8}
                  disabled={isSending}
                >
                  <Ionicons
                    name={prompt.icon}
                    size={19}
                    color={colors.accent}
                  />

                  <Text
                    style={[
                      styles.suggestionText,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {prompt.label}
                  </Text>

                  <Ionicons
                    name="arrow-up-circle-outline"
                    size={20}
                    color={colors.secondary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* DISCLAIMER */}

          <Text
            style={[
              styles.disclaimer,
              {
                color: colors.secondary,
              },
            ]}
          >
            Answers are generated from retrieved saved memories.
            Check the linked tickets for the original details.
          </Text>
        </ScrollView>

        {/* MESSAGE COMPOSER */}

        <View
          style={[
            styles.composerContainer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.composer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                {
                  color: colors.text,
                },
              ]}
              value={input}
              onChangeText={setInput}
              placeholder="Ask about your memories..."
              placeholderTextColor={colors.secondary}
              multiline
              maxLength={1000}
              editable={!isSending}
              returnKeyType="default"
              accessibilityLabel="Ask Memento a question"
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: colors.accent,

                  opacity:
                    input.trim() && !isSending
                      ? 1
                      : 0.45,
                },
              ]}
              onPress={() => handleSend()}
              disabled={
                !input.trim() ||
                isSending
              }
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Send question"
            >
              <Ionicons
                name="arrow-up"
                size={22}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.footerText,
              {
                color: colors.secondary,
              },
            ]}
          >
            Your memories stay in your Memento account.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default AssistantScreen;

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  header: {
    minHeight: 72,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
    marginTop: 22,
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitleContainer: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
  },

  headerSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  chatScroll: {
    flex: 1,
  },

  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 22,
  },

  messageRow: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 9,
    alignItems: "flex-start",
  },

  assistantMessageRow: {
    justifyContent: "flex-start",
  },

  userMessageRow: {
    justifyContent: "flex-end",
  },

  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  messageBody: {
    maxWidth: "88%",
    flexShrink: 1,
  },

  messageBubble: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  userBubble: {
    borderBottomRightRadius: 5,
  },

  messageText: {
    fontSize: 14,
    lineHeight: 21,
  },

  sourcesContainer: {
    marginTop: 13,
    gap: 9,
  },

  sourcesHeading: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 2,
  },

  sourceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 9,
    borderRadius: 15,
    borderWidth: 1,
    gap: 10,
  },

  sourceImage: {
    width: 58,
    height: 58,
    borderRadius: 10,
    backgroundColor: "#E4E2ED",
  },

  sourceImagePlaceholder: {
    width: 58,
    height: 58,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  sourceContent: {
    flex: 1,
    gap: 4,
  },

  sourceTitle: {
    fontSize: 13,
    fontWeight: "700",
  },

  sourceMeta: {
    fontSize: 11,
  },

  sourceTags: {
    fontSize: 10,
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 20,
  },

  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 16,
  },

  loadingText: {
    fontSize: 12,
  },

  suggestionsContainer: {
    marginTop: 8,
    marginLeft: 41,
    gap: 9,
  },

  suggestionsTitle: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 2,
  },

  suggestionButton: {
    minHeight: 49,
    paddingHorizontal: 13,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  suggestionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
  },

  disclaimer: {
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 25,
    marginBottom: 4,
    paddingHorizontal: 15,
  },

  composerContainer: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 8 : 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 14,
    paddingRight: 7,
    paddingVertical: 7,
    gap: 8,
  },

  input: {
    flex: 1,
    minHeight: 41,
    maxHeight: 110,
    paddingTop: 10,
    paddingBottom: 8,
    fontSize: 14,
    lineHeight: 20,
  },

  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  footerText: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 7,
  },

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 7,
  },
});
