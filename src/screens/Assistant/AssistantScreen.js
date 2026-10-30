import { useRef, useState } from "react";
import {
  ActivityIndicator,
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

const createMessageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function AssistantScreen({ navigation }) {
  const { token } = useAuth();
  const { theme, isDark } = useTheme();

  const {
    getMemoryById,
    refreshMemories,
  } = useMemory();

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

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const requestLockRef = useRef(false);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
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

  const handleSend = async (
    value = input,
    options = {},
  ) => {
    const question =
      typeof value === "string" ? value.trim() : "";

    const isRetry = options.isRetry === true;

    if (!question || requestLockRef.current) {
      return;
    }

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

    try {
      const result = await askAssistant(token, question);

      if (!result?.success) {
        const error = new Error(
          result?.message ||
            "Unable to contact Ask Memento.",
        );

        error.status = result?.status || 0;
        error.retryable =
          error.status === 0 || error.status >= 500;

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
      console.error("[Ask Memento] Request failed:", {
        status: error?.status,
        code: error?.code,
        message: error?.message,
      });

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
      // Always release the request lock.
      requestLockRef.current = false;

      setIsSending(false);
    }
  };

  const handleRetry = (message) => {
    if (
      !message?.retryQuestion ||
      message.retryable !== true ||
      requestLockRef.current
    ) {
      return;
    }

    // Retry the original question without adding
    // another duplicate user message.
    handleSend(message.retryQuestion, {
      isRetry: true,
    });
  };

  const handleOpenMemory = async (source) => {
    if (!source?.id) {
      return;
    }

    try {
      const localMemory = getMemoryById(source.id);

      // Refresh if this memory isn't available locally.
      if (!localMemory && refreshMemories) {
        await refreshMemories();
      }

      navigation.navigate("MemoryDetails", {
        memoryId: source.id,
      });
    } catch (error) {
      console.error(
        "Unable to open assistant memory source:",
        error,
      );

      navigation.navigate("MemoryDetails", {
        memoryId: source.id,
      });
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
      return String(date);
    }

    return parsed.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderSource = (source, index) => (
    <TouchableOpacity
      key={`${source.id}-${index}`}
      style={[
        styles.sourceCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => handleOpenMemory(source)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Open memory ${
        source.title || "memory"
      }`}
    >
      {source.thumbnail ? (
        <Image
          source={{ uri: source.thumbnail }}
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

      <View style={styles.sourceContent}>
        <Text
          style={[
            styles.sourceTitle,
            { color: colors.text },
          ]}
          numberOfLines={2}
        >
          {source.title || "Untitled memory"}
        </Text>

        <Text
          style={[
            styles.sourceMeta,
            { color: colors.secondary },
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
              { color: colors.secondary },
            ]}
            numberOfLines={1}
          >
            {source.tags
              .map((tag) => `#${tag}`)
              .join("  ")}
          </Text>
        )}
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color={colors.secondary}
      />
    </TouchableOpacity>
  );

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
                    { color: colors.secondary },
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
          Platform.OS === "ios" ? "padding" : undefined
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
                { color: colors.text },
              ]}
            >
              Ask Memento
            </Text>

            <Text
              style={[
                styles.headerSubtitle,
                { color: colors.secondary },
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
                    { color: colors.secondary },
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
                  { color: colors.secondary },
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
                      { color: colors.text },
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

          <Text
            style={[
              styles.disclaimer,
              { color: colors.secondary },
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
                { color: colors.text },
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
              { color: colors.secondary },
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
