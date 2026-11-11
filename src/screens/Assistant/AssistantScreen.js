
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Keyboard,
  Modal,
  Platform,
  RefreshControl,
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
import { KeyboardStickyView } from "react-native-keyboard-controller";
import {
  askAssistant,
  deleteAssistantConversation,
  getAssistantConversations,
  getAssistantMessages,
  updateAssistantConversation,
} from "../../api/assistantApi";
import { useAuth } from "../../hooks/useAuth";
import { useMemory } from "../../hooks/useMemory";
import { useTheme } from "../../context/ThemeContext";
import useMementoNotifications from "../../hooks/useMementoNotifications";
import CustomAlert from "../../components/common/CustomAlert";

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

const getConversationId = (conversation) =>
  String(conversation?._id || conversation?.id || "").trim();

const getSourceMemoryId = (source) => {
  const value = source?.id || source?.memoryId || source?._id || "";
  return String(value).trim();
};

const OBJECT_ID_PATTERN = /(^|[^a-z0-9])[a-f\d]{24}(?![a-z0-9])/gi;
const UUID_PATTERN = /\b[a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12}\b/gi;

const LABELLED_ID_PATTERN =
  /\b(?:mongodb\s*)?(?:object[\s_-]*id|memory[\s_-]*id|source[\s_-]*id|record[\s_-]*id|internal[\s_-]*(?:database[\s_-]*)?id|database[\s_-]*id|id(?:entifier)?(?:[\s_-]*number)?)\s*(?:(?:is|=|:|#)\s*)?[\[({]?\s*["'`]?(?=[a-z0-9_-]*\d)[a-z0-9_-]{6,}["'`]?[)\]}]?/giu;

const sanitizeDisplayText = (value) => {
  if (typeof value !== "string") return "";

  return value
    .replace(LABELLED_ID_PATTERN, "")
    .replace(OBJECT_ID_PATTERN, "$1")
    .replace(UUID_PATTERN, "")
    .replace(/\(\s*\)|\[\s*\]|\{\s*\}/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([,.;!?])/g, "$1")
    .replace(/([([{])\s+/g, "$1")
    .replace(/\s+([)\]}])/g, "$1")
    .trim();
};

const getCitationSources = (citations) => {
  if (!Array.isArray(citations)) return [];

  return citations.map((citation) => ({
    id: getSourceMemoryId(citation),
    title: sanitizeDisplayText(citation?.title) || "Untitled memory",
    date: citation?.date || null,
    location: sanitizeDisplayText(citation?.location),
    tags: Array.isArray(citation?.tags) ? citation.tags : [],
    thumbnail: citation?.thumbnail || null,
  }));
};

const getConversationTimestamp = (conversation) => {
  const value =
    conversation?.lastMessageAt ||
    conversation?.updatedAt ||
    conversation?.createdAt;

  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
};

function AssistantScreen({ navigation }) {
  const { token } = useAuth();
  const { theme, isDark } = useTheme();
  const { getMemoryById, ensureMemoryAvailable } = useMemory();
  const { notify } = useMementoNotifications();

  const themeColors = theme?.colors || {};

  const colors = {
    background: themeColors.background || "#F1F0F6",
    surface: themeColors.surface || "#FFFFFF",
    card: themeColors.card || themeColors.surface || "#FFFFFF",
    text: themeColors.text || (isDark ? "#F7F5FC" : "#24243A"),
    secondary:
      themeColors.textSecondary ||
      themeColors.textMuted ||
      (isDark ? "#B9B5C8" : "#747386"),
    primary: themeColors.primary || "#34345C",
    accent: themeColors.accent || "#E76F51",
    border: themeColors.border || (isDark ? "#39364D" : "#E1DFE9"),
    muted: themeColors.iconMuted || "#9290A2",
  };

  const scrollRef = useRef(null);
  const requestLockRef = useRef(false);
  const creatingConversationRef = useRef(false);
  const openingConversationRef = useRef(false);
  const openingMemoryLockRef = useRef(null);
  const activeConversationRef = useRef(null);
  const lastShownNotificationRef = useRef(null);

  const [screen, setScreen] = useState("home");
  const [conversations, setConversations] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isRefreshingHistory, setIsRefreshingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [openingMemoryId, setOpeningMemoryId] = useState(null);

  const [renameVisible, setRenameVisible] = useState(false);
  const [conversationToRename, setConversationToRename] = useState(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const [conversationOptionsVisible, setConversationOptionsVisible] =
    useState(false);
  const [conversationToManage, setConversationToManage] = useState(null);

  const [deletingConversationId, setDeletingConversationId] = useState(null);

  const [pendingNotification, setPendingNotification] = useState(null);

  const [customAlert, setCustomAlert] = useState({
    visible: false,
  });

  const activeConversation = currentConversation;

  const queueNotification = useCallback((event, message) => {
    setPendingNotification({
      id: createMessageId(),
      event,
      message,
    });
  }, []);

  useEffect(() => {
    if (!pendingNotification) return;

    if (lastShownNotificationRef.current === pendingNotification.id) {
      setPendingNotification(null);
      return;
    }

    lastShownNotificationRef.current = pendingNotification.id;

    notify(pendingNotification.event, {
      message: pendingNotification.message,
    });

    setPendingNotification(null);
  }, [pendingNotification, notify]);

  const showCustomAlert = useCallback((options) => {
    setCustomAlert({
      visible: true,
      type: "info",
      icon: "information-circle-outline",
      title: "Notice",
      message: "",
      confirmText: "Okay",
      cancelText: "Cancel",
      showCancel: false,
      showClose: true,
      onConfirm: null,
      onCancel: null,
      ...options,
    });
  }, []);

  const dismissCustomAlert = useCallback(() => {
    setCustomAlert((previous) => ({
      ...previous,
      visible: false,
    }));
  }, []);

  const handleCustomAlertConfirm = () => {
    const action = customAlert.onConfirm;

    dismissCustomAlert();

    if (typeof action === "function") {
      action();
    }
  };

  const handleCustomAlertCancel = () => {
    const action = customAlert.onCancel;

    dismissCustomAlert();

    if (typeof action === "function") {
      action();
    }
  };

  const loadConversations = useCallback(
    async (refreshing = false) => {
      if (!token) {
        setConversations([]);
        setIsLoadingHistory(false);
        setIsRefreshingHistory(false);
        setHistoryError("Please sign in again to view your conversations.");
        return;
      }

      if (refreshing) {
        setIsRefreshingHistory(true);
      } else {
        setIsLoadingHistory(true);
      }

      setHistoryError("");

      try {
        const result = await getAssistantConversations(token, {
          status: "active",
          limit: 30,
        });

        const items = Array.isArray(result?.data?.conversations)
          ? result.data.conversations
          : [];

        setConversations(
          items.filter(
            (conversation) => conversation?.mode !== "incognito"
          )
        );
      } catch (error) {
        setHistoryError(
          sanitizeDisplayText(error?.message) ||
            "Unable to load your conversations. Please try again."
        );
      } finally {
        setIsLoadingHistory(false);
        setIsRefreshingHistory(false);
      }
    },
    [token]
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const finishCurrentChat = useCallback(async () => {
    Keyboard.dismiss();

    activeConversationRef.current = null;

    setCurrentConversation(null);
    setMessages([]);
    setInput("");
    setScreen("home");

    await loadConversations(true);
  }, [loadConversations]);

  const requestCloseChat = useCallback(() => {
    if (isSending || customAlert.visible) return;

    finishCurrentChat();
  }, [
    customAlert.visible,
    finishCurrentChat,
    isSending,
  ]);

  useEffect(() => {
    if (screen !== "chat") return undefined;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        requestCloseChat();
        return true;
      }
    );

    return () => subscription.remove();
  }, [requestCloseChat, screen]);

  const createNewConversation = () => {
    if (!token) {
      showCustomAlert({
        type: "warning",
        icon: "lock-closed-outline",
        title: "Sign in required",
        message: "Please sign in to use Jako AI.",
        confirmText: "Okay",
      });

      return;
    }

    if (requestLockRef.current || creatingConversationRef.current) return;

    creatingConversationRef.current = true;

    const draftConversation = {
      id: `draft-${createMessageId()}`,
      title: "New conversation",
      draft: true,
    };

    activeConversationRef.current = draftConversation;

    setCurrentConversation(draftConversation);
    setMessages([]);
    setInput("");
    setScreen("chat");

    creatingConversationRef.current = false;
  };

  const openConversation = async (conversation) => {
    const conversationId = getConversationId(conversation);

    if (
      !conversationId ||
      !token ||
      openingConversationRef.current
    ) {
      return;
    }

    openingConversationRef.current = true;
    setIsLoadingMessages(true);
    setHistoryError("");

    try {
      const result = await getAssistantMessages(token, conversationId, {
        limit: 50,
      });

      const records = Array.isArray(result?.data?.messages)
        ? result.data.messages
        : [];

      const loadedMessages = records.map((record) => ({
        id: String(record._id || record.id || createMessageId()),
        role: record.role,
        text:
          record.role === "assistant"
            ? sanitizeDisplayText(record.content)
            : record.content || "",
        sources:
          record.role === "assistant"
            ? getCitationSources(record.citations)
            : [],
        createdAt: record.createdAt,
      }));

      activeConversationRef.current = conversation;

      setCurrentConversation(conversation);
      setMessages(loadedMessages);
      setInput("");
      setScreen("chat");
    } catch (error) {
      showCustomAlert({
        type: "danger",
        icon: "alert-circle-outline",
        title: "Unable to open conversation",
        message:
          sanitizeDisplayText(error?.message) ||
          "Your conversation could not be loaded. Please try again.",
        confirmText: "Okay",
      });
    } finally {
      openingConversationRef.current = false;
      setIsLoadingMessages(false);
    }
  };

  const handleSend = async (value = input, options = {}) => {
    const question = typeof value === "string" ? value.trim() : "";
    const isRetry = options.isRetry === true;

    const conversation = activeConversationRef.current;

    const isDraftConversation =
      conversation?.draft === true;

    const conversationId = isDraftConversation
      ? ""
      : getConversationId(conversation);

    if (
      !question ||
      requestLockRef.current ||
      (!conversationId && !isDraftConversation)
    ) {
      return;
    }

    if (!token) {
      showCustomAlert({
        type: "warning",
        icon: "lock-closed-outline",
        title: "Session unavailable",
        message: "Please sign in again to continue chatting with Jako.",
        confirmText: "Okay",
      });

      return;
    }

    requestLockRef.current = true;
    setIsSending(true);

    let optimisticUserId = options.userMessageId;

    if (!isRetry) {
      Keyboard.dismiss();
      setInput("");

      optimisticUserId = createMessageId();

      setMessages((previous) => [
        ...previous,
        {
          id: optimisticUserId,
          role: "user",
          text: question,
          sources: [],
          pending: true,
        },
      ]);
    } else if (options.retryMessageId) {
      setMessages((previous) =>
        previous.filter(
          (message) => message.id !== options.retryMessageId
        )
      );
    }

    try {
      const result = await askAssistant(
        token,
        question,
        conversationId
          ? { conversationId }
          : {}
      );

      const payload = result?.data;
      const safeAnswer = sanitizeDisplayText(payload?.answer);

      if (
        !result?.success ||
        !payload?.success ||
        typeof payload.answer !== "string" ||
        !safeAnswer
      ) {
        throw new Error(
          sanitizeDisplayText(payload?.message || result?.message) ||
            "Jako could not generate a response. Please try again."
        );
      }

      const resolvedConversationId =
        getConversationId(payload?.conversation) ||
        String(payload?.conversationId || "").trim() ||
        conversationId;

      if (!resolvedConversationId) {
        throw new Error(
          "Jako responded, but the conversation could not be identified. Please refresh your chat history."
        );
      }

      const userServerMessageId =
        payload.messages?.user?.id;

      const assistantServerMessageId =
        payload.messages?.assistant?.id;

      setMessages((previous) => {
        const next = previous.map((message) =>
          message.id === optimisticUserId
            ? {
                ...message,
                id: userServerMessageId || message.id,
                pending: false,
              }
            : message
        );

        return [
          ...next,
          {
            id: assistantServerMessageId || createMessageId(),
            role: "assistant",
            text: safeAnswer,
            sources: getCitationSources(payload.sources),
            createdAt:
              payload.messages?.assistant?.createdAt ||
              new Date().toISOString(),
          },
        ];
      });

      const updatedConversation = {
        ...conversation,
        ...(payload.conversation || {}),
        _id: resolvedConversationId,
        id: resolvedConversationId,
        draft: false,
      };

      activeConversationRef.current = updatedConversation;
      setCurrentConversation(updatedConversation);

      setConversations((previous) => {
        const withoutCurrent = previous.filter(
          (item) =>
            getConversationId(item) !== resolvedConversationId
        );

        return [
          updatedConversation,
          ...withoutCurrent,
        ];
      });
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          id: createMessageId(),
          role: "assistant",
          text:
            sanitizeDisplayText(error?.message) ||
            "Something went wrong. Please try again.",
          sources: [],
          isError: true,
          retryQuestion: question,
          retryUserMessageId: optimisticUserId,
          retryable:
            typeof error?.retryable === "boolean"
              ? error.retryable
              : error?.status === 0 || error?.status >= 500,
        },
      ]);
    } finally {
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

    handleSend(message.retryQuestion, {
      isRetry: true,
      userMessageId: message.retryUserMessageId,
      retryMessageId: message.id,
    });
  };

  const openConversationOptions = (conversation) => {
    setConversationToManage(conversation);
    setConversationOptionsVisible(true);
  };

  const handleRenameSelectedConversation = () => {
    if (!conversationToManage) return;

    const title =
      sanitizeDisplayText(conversationToManage.title) ||
      "New conversation";

    setConversationToRename(conversationToManage);
    setRenameTitle(title);

    setConversationOptionsVisible(false);
    setConversationToManage(null);

    setRenameVisible(true);
  };

  const handleDeleteSelectedConversation = () => {
    if (!conversationToManage) return;

    const conversation = conversationToManage;

    setConversationOptionsVisible(false);
    setConversationToManage(null);

    confirmDeleteConversation(conversation);
  };

  const closeRenameModal = () => {
    if (isRenaming) return;

    setRenameVisible(false);
    setConversationToRename(null);
    setRenameTitle("");
  };

  const saveConversationRename = async () => {
    const conversationId = getConversationId(conversationToRename);
    const nextTitle = sanitizeDisplayText(renameTitle).trim();

    const previousTitle =
      sanitizeDisplayText(conversationToRename?.title) ||
      "New conversation";

    if (!conversationId || !nextTitle || !token || isRenaming) return;

    if (nextTitle === previousTitle) {
      closeRenameModal();
      return;
    }

    setIsRenaming(true);

    try {
      await updateAssistantConversation(token, conversationId, {
        title: nextTitle,
      });

      const updatedConversation = {
        ...conversationToRename,
        title: nextTitle,
      };

      setConversations((previous) =>
        previous.map((conversation) =>
          getConversationId(conversation) === conversationId
            ? { ...conversation, title: nextTitle }
            : conversation
        )
      );

      if (
        getConversationId(activeConversationRef.current) === conversationId
      ) {
        activeConversationRef.current = {
          ...activeConversationRef.current,
          title: nextTitle,
        };

        setCurrentConversation(updatedConversation);
      }

      setRenameVisible(false);
      setConversationToRename(null);
      setRenameTitle("");

      queueNotification(
        "conversationRenamed",
        `"${nextTitle}" has been renamed successfully.`
      );
    } catch (error) {
      showCustomAlert({
        type: "danger",
        icon: "alert-circle-outline",
        title: "Unable to rename chat",
        message:
          sanitizeDisplayText(error?.message) ||
          "The conversation name could not be updated. Please try again.",
        confirmText: "Okay",
      });
    } finally {
      setIsRenaming(false);
    }
  };

  const confirmDeleteConversation = (conversation) => {
    const conversationId = getConversationId(conversation);

    if (!conversationId) return;

    const title =
      sanitizeDisplayText(conversation?.title) || "this conversation";

    showCustomAlert({
      type: "danger",
      icon: "trash-outline",
      title: "Delete conversation?",
      message: `Are you sure you want to permanently delete "${title}"? This cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Keep chat",
      showCancel: true,
      showClose: true,
      onConfirm: () => deleteConversation(conversationId, title),
    });
  };

  const deleteConversation = async (conversationId, conversationTitle) => {
    if (!token || deletingConversationId) return;

    setDeletingConversationId(conversationId);

    try {
      await deleteAssistantConversation(token, conversationId);

      setConversations((previous) =>
        previous.filter(
          (conversation) =>
            getConversationId(conversation) !== conversationId
        )
      );

      if (
        getConversationId(activeConversationRef.current) === conversationId
      ) {
        activeConversationRef.current = null;

        setCurrentConversation(null);
        setMessages([]);
        setInput("");
        setScreen("home");
      }

      queueNotification(
        "conversationDeleted",
        `"${conversationTitle || "Your conversation"}" has been deleted successfully.`
      );
    } catch (error) {
      showCustomAlert({
        type: "danger",
        icon: "alert-circle-outline",
        title: "Unable to delete chat",
        message:
          sanitizeDisplayText(error?.message) ||
          "The conversation could not be deleted. Please try again.",
        confirmText: "Okay",
      });
    } finally {
      setDeletingConversationId(null);
    }
  };

  const handleOpenMemory = async (source) => {
    const memoryId = getSourceMemoryId(source);

    if (!memoryId) {
      showCustomAlert({
        type: "warning",
        icon: "alert-circle-outline",
        title: "Memory unavailable",
        message:
          "This memory source is unavailable. Please try another memory.",
        confirmText: "Okay",
      });

      return;
    }

    if (openingMemoryLockRef.current !== null) return;

    openingMemoryLockRef.current = memoryId;
    setOpeningMemoryId(memoryId);

    try {
      let memory = getMemoryById(memoryId);

      if (!memory) {
        if (typeof ensureMemoryAvailable !== "function") {
          throw new Error("Memory recovery is unavailable.");
        }

        const result = await ensureMemoryAvailable(memoryId);

        if (!result?.success || !result.memory) {
          const messagesByReason = {
            invalid_id: "This memory source is unavailable.",
            not_found: "This memory is no longer available in your account.",
            session_changed:
              "Your account session has changed. Please try again.",
            refresh_failed:
              "Memento could not retrieve this memory. Check your connection and try again.",
          };

          showCustomAlert({
            type: "warning",
            icon: "alert-circle-outline",
            title: "Memory unavailable",
            message:
              messagesByReason[result?.reason] ||
              "This memory source could not be opened.",
            confirmText: "Okay",
          });

          return;
        }

        memory = result.memory;
      }

      const resolvedMemoryId = String(
        memory._id || memory.id || memory.clientMemoryId || ""
      ).trim();

      if (!resolvedMemoryId) {
        throw new Error("This memory could not be opened.");
      }

      navigation.navigate("MemoryDetails", {
        memoryId: resolvedMemoryId,
      });
    } catch (error) {
      console.error(
        "[Jako AI] Source navigation failed.",
        sanitizeDisplayText(error?.message)
      );

      showCustomAlert({
        type: "danger",
        icon: "alert-circle-outline",
        title: "Unable to open memory",
        message:
          "Something went wrong while opening this memory. Please try again.",
        confirmText: "Okay",
      });
    } finally {
      openingMemoryLockRef.current = null;
      setOpeningMemoryId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return sanitizeDisplayText(String(date));
    }

    return parsed.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderSource = (source, index) => {
    const sourceId = getSourceMemoryId(source);
    const isOpening = openingMemoryId === sourceId;

    const sourceTitle =
      sanitizeDisplayText(source.title) || "Untitled memory";

    const sourceTags = Array.isArray(source.tags)
      ? source.tags
          .map((tag) => sanitizeDisplayText(String(tag)))
          .filter(Boolean)
      : [];

    return (
      <TouchableOpacity
        key={`${sourceId || "source"}-${index}`}
        style={[
          styles.sourceCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity: openingMemoryId !== null && !isOpening ? 0.55 : 1,
          },
        ]}
        onPress={() => handleOpenMemory(source)}
        disabled={openingMemoryId !== null || !sourceId}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Open memory ${sourceTitle}`}
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
              { backgroundColor: colors.background },
            ]}
          >
            <Ionicons
              name="ticket-outline"
              size={24}
              color={colors.primary}
            />
          </View>
        )}

        <View style={styles.sourceContent}>
          <Text
            style={[styles.sourceTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {sourceTitle}
          </Text>

          <Text
            style={[styles.sourceMeta, { color: colors.secondary }]}
            numberOfLines={1}
          >
            {formatDate(source.date)}
            {source.location
              ? ` · ${sanitizeDisplayText(source.location)}`
              : ""}
          </Text>

          {sourceTags.length > 0 && (
            <Text
              style={[styles.sourceTags, { color: colors.secondary }]}
              numberOfLines={1}
            >
              {sourceTags.map((tag) => `#${tag}`).join("  ")}
            </Text>
          )}
        </View>

        {isOpening ? (
          <ActivityIndicator size="small" color={colors.accent} />
        ) : (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.secondary}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderMessage = (message) => {
    const isUser = message.role === "user";

    return (
      <View
        key={message.id}
        style={[
          styles.messageRow,
          isUser ? styles.userMessageRow : styles.assistantMessageRow,
        ]}
      >
        {!isUser && (
          <View
            style={[
              styles.assistantAvatar,
              { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons name="sparkles" size={16} color="#FFFFFF" />
          </View>
        )}

        <View style={styles.messageBody}>
          <View
            style={[
              styles.messageBubble,
              {
                backgroundColor: isUser ? colors.primary : colors.card,
                borderColor: isUser ? colors.primary : colors.border,
                opacity: message.pending ? 0.7 : 1,
              },
              isUser && styles.userBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                { color: isUser ? "#FFFFFF" : colors.text },
              ]}
            >
              {isUser ? message.text : sanitizeDisplayText(message.text)}
            </Text>
          </View>

          {!isUser && message.sources?.length > 0 && (
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

          {message.isError && message.retryable && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => handleRetry(message)}
              disabled={isSending}
              activeOpacity={0.7}
            >
              <Ionicons
                name="refresh-outline"
                size={15}
                color={colors.accent}
              />
              <Text style={[styles.retryText, { color: colors.accent }]}>
                Try again
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderConversation = (conversation, index) => {
    const conversationId = getConversationId(conversation);

    const title =
      sanitizeDisplayText(conversation.title) || "New conversation";

    const isDeleting = deletingConversationId === conversationId;

    const timestamp = getConversationTimestamp(conversation);

    return (
      <View
        key={conversationId || index}
        style={[styles.historyItem, { borderBottomColor: colors.border }]}
      >
        <TouchableOpacity
          style={styles.historyOpenArea}
          onPress={() => openConversation(conversation)}
          disabled={isLoadingMessages || isDeleting}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel={`Open conversation ${title}`}
        >
          <View
            style={[
              styles.historyIcon,
              { backgroundColor: colors.primary + "14" },
            ]}
          >
            <Ionicons
              name="chatbubble-outline"
              size={19}
              color={colors.primary}
            />
          </View>

          <View style={styles.historyTextContainer}>
            <Text
              style={[styles.historyTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              {title}
            </Text>

            <Text style={[styles.historyMeta, { color: colors.secondary }]}>
              {Number(conversation.messageCount) || 0} messages
              {timestamp ? ` · ${timestamp}` : ""}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.conversationOptionsButton}
          onPress={() => openConversationOptions(conversation)}
          disabled={isDeleting || isRenaming}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Manage conversation ${title}`}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Ionicons
              name="ellipsis-vertical"
              size={19}
              color={colors.secondary}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderHome = () => (
    <ScrollView
      style={styles.homeScroll}
      contentContainerStyle={styles.homeContent}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshingHistory}
          onRefresh={() => loadConversations(true)}
          tintColor={colors.accent}
        />
      }
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.welcomeCard, { backgroundColor: colors.primary }]}>
        <View style={styles.welcomeGlow} />

        <View style={styles.welcomeIcon}>
          <Ionicons name="sparkles" size={25} color="#FFFFFF" />
        </View>

        <Text style={styles.welcomeEyebrow}>
          YOUR PERSONAL AI ASSISTANT
        </Text>

        <Text style={styles.welcomeTitle}>
          What’s on your mind?
        </Text>

        <Text style={styles.welcomeDescription}>
          Ask Jako about your saved memories or continue a previous conversation.
        </Text>

        <TouchableOpacity
          style={styles.welcomeButton}
          onPress={createNewConversation}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={20} color={colors.primary} />

          <Text style={[styles.welcomeButtonText, { color: colors.primary }]}>
            Start a new chat
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historyHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your chats
          </Text>

          <Text style={[styles.sectionSubtitle, { color: colors.secondary }]}>
            Continue where you left off
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => loadConversations(true)}
          disabled={isLoadingHistory || isRefreshingHistory}
          style={styles.refreshButton}
          accessibilityRole="button"
          accessibilityLabel="Refresh chat history"
        >
          <Ionicons
            name="refresh-outline"
            size={19}
            color={colors.secondary}
          />
        </TouchableOpacity>
      </View>

      {isLoadingHistory ? (
        <View style={styles.historyState}>
          <ActivityIndicator size="small" color={colors.accent} />

          <Text style={[styles.stateText, { color: colors.secondary }]}>
            Loading chats...
          </Text>
        </View>
      ) : historyError ? (
        <View style={styles.historyState}>
          <Ionicons
            name="cloud-offline-outline"
            size={25}
            color={colors.secondary}
          />

          <Text style={[styles.stateText, { color: colors.secondary }]}>
            {historyError}
          </Text>

          <TouchableOpacity
            style={[styles.stateButton, { borderColor: colors.border }]}
            onPress={() => loadConversations(true)}
          >
            <Text style={[styles.stateButtonText, { color: colors.text }]}>
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.historyState}>
          <View
            style={[
              styles.emptyHistoryIcon,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={25}
              color={colors.secondary}
            />
          </View>

          <Text style={[styles.emptyHistoryTitle, { color: colors.text }]}>
            No conversations yet
          </Text>

          <Text style={[styles.stateText, { color: colors.secondary }]}>
            Start a chat with Jako. Your conversations will appear here.
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.historyList,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {conversations.map(renderConversation)}
        </View>
      )}

      <View style={styles.homeFooter}>
        <Ionicons
          name="lock-closed-outline"
          size={13}
          color={colors.muted}
        />

        <Text style={[styles.homeFooterText, { color: colors.muted }]}>
          Your conversations are linked to your Memento account.
        </Text>
      </View>
    </ScrollView>
  );

  const renderChat = () => (
    <>
      <View style={[styles.chatHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.card }]}
          onPress={requestCloseChat}
          disabled={isSending}
          accessibilityRole="button"
          accessibilityLabel="Back to Jako home"
        >
          <Ionicons name="arrow-back" size={21} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.chatHeaderText}>
          <Text
            style={[styles.chatHeaderTitle, { color: colors.text }]}
            numberOfLines={1}
          >
            {sanitizeDisplayText(activeConversation?.title) || "New chat"}
          </Text>

          <View style={styles.chatHeaderSubtitleRow}>
            <View
              style={[
                styles.onlineDot,
                { backgroundColor: colors.accent },
              ]}
            />

            <Text
              style={[
                styles.chatHeaderSubtitle,
                { color: colors.secondary },
              ]}
            >
              Jako AI
            </Text>
          </View>
        </View>

        <View style={styles.headerButtonPlaceholder} />
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.chatScroll}
        contentContainerStyle={styles.chatContent}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {isLoadingMessages ? (
          <View style={styles.historyState}>
            <ActivityIndicator size="small" color={colors.accent} />

            <Text style={[styles.stateText, { color: colors.secondary }]}>
              Loading conversation...
            </Text>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.chatWelcome}>
            <View
              style={[
                styles.chatWelcomeAvatar,
                { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons name="sparkles" size={27} color="#FFFFFF" />
            </View>

            <Text style={[styles.chatWelcomeTitle, { color: colors.text }]}>
              How can I help you today?
            </Text>

            <Text
              style={[
                styles.chatWelcomeDescription,
                { color: colors.secondary },
              ]}
            >
              Ask me about your saved memories, places, dates, or favorite moments.
            </Text>

            <View style={styles.chatSuggestions}>
              {SUGGESTED_PROMPTS.map((prompt) => (
                <TouchableOpacity
                  key={prompt.label}
                  style={[
                    styles.chatSuggestion,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => handleSend(prompt.question)}
                  disabled={isSending}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={prompt.icon}
                    size={17}
                    color={colors.accent}
                  />

                  <Text
                    style={[
                      styles.chatSuggestionText,
                      { color: colors.text },
                    ]}
                  >
                    {prompt.label}
                  </Text>

                  <Ionicons
                    name="arrow-up"
                    size={16}
                    color={colors.secondary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          messages.map(renderMessage)
        )}

        {isSending && (
          <View style={styles.loadingRow}>
            <View
              style={[
                styles.assistantAvatar,
                { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
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
              <ActivityIndicator size="small" color={colors.accent} />

              <Text style={[styles.loadingText, { color: colors.secondary }]}>
                Jako is thinking...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <KeyboardStickyView
        offset={{
          closed: 0,
          opened: 0,
        }}
      >
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
              style={[styles.input, { color: colors.text }]}
              value={input}
              onChangeText={setInput}
              placeholder="Message Jako..."
              placeholderTextColor={colors.secondary}
              multiline
              maxLength={1000}
              editable={!isSending && !isLoadingMessages}
              returnKeyType="default"
              accessibilityLabel="Message Jako AI"
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: colors.accent,
                  opacity: input.trim() && !isSending ? 1 : 0.45,
                },
              ]}
              onPress={() => handleSend()}
              disabled={!input.trim() || isSending || isLoadingMessages}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Send message"
            >
              <Ionicons name="arrow-up" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.footerText, { color: colors.secondary }]}>
            Your conversation is saved to your Memento account.
          </Text>
        </View>
      </KeyboardStickyView>
    </>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <View style={styles.container}>
        {screen === "home" ? (
          <>
            <View
              style={[
                styles.homeHeader,
                { borderBottomColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.brandIcon,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons name="sparkles" size={21} color="#FFFFFF" />
              </View>

              <View style={styles.brandTextContainer}>
                <Text style={[styles.brandTitle, { color: colors.text }]}>
                  Jako AI
                </Text>

                <Text
                  style={[styles.brandSubtitle, { color: colors.secondary }]}
                >
                  Your Memento assistant
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.headerButton,
                  { backgroundColor: colors.card },
                ]}
                onPress={createNewConversation}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Start a new chat"
              >
                <Ionicons
                  name="create-outline"
                  size={21}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            {renderHome()}
          </>
        ) : (
          renderChat()
        )}
      </View>

      <Modal
        visible={conversationOptionsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setConversationOptionsVisible(false);
          setConversationToManage(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.optionsModal,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.optionsModalTitle, { color: colors.text }]}>
              Manage conversation
            </Text>

            <Text
              style={[
                styles.optionsModalDescription,
                { color: colors.secondary },
              ]}
              numberOfLines={2}
            >
              {sanitizeDisplayText(conversationToManage?.title) ||
                "New conversation"}
            </Text>

            <TouchableOpacity
              style={[
                styles.optionsAction,
                { borderColor: colors.border },
              ]}
              onPress={handleRenameSelectedConversation}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.optionsActionIcon,
                  { backgroundColor: colors.primary + "14" },
                ]}
              >
                <Ionicons
                  name="create-outline"
                  size={19}
                  color={colors.primary}
                />
              </View>

              <Text style={[styles.optionsActionText, { color: colors.text }]}>
                Rename conversation
              </Text>

              <Ionicons
                name="chevron-forward"
                size={17}
                color={colors.secondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionsAction,
                { borderColor: colors.border },
              ]}
              onPress={handleDeleteSelectedConversation}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.optionsActionIcon,
                  { backgroundColor: "#D9534F14" },
                ]}
              >
                <Ionicons
                  name="trash-outline"
                  size={19}
                  color="#D9534F"
                />
              </View>

              <Text
                style={[
                  styles.optionsActionText,
                  { color: colors.danger || "#D9534F" },
                ]}
              >
                Delete conversation
              </Text>

              <Ionicons
                name="chevron-forward"
                size={17}
                color={colors.secondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionsCloseButton,
                { backgroundColor: colors.background },
              ]}
              onPress={() => {
                setConversationOptionsVisible(false);
                setConversationToManage(null);
              }}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.optionsCloseText,
                  { color: colors.secondary },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={renameVisible}
        transparent
        animationType="fade"
        onRequestClose={closeRenameModal}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.renameModal,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.renameModalTitle, { color: colors.text }]}>
              Rename conversation
            </Text>

            <Text
              style={[
                styles.renameModalDescription,
                { color: colors.secondary },
              ]}
            >
              Choose a name that helps you find this chat later.
            </Text>

            <TextInput
              style={[
                styles.renameInput,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              value={renameTitle}
              onChangeText={setRenameTitle}
              placeholder="Conversation name"
              placeholderTextColor={colors.secondary}
              maxLength={80}
              autoFocus
              selectTextOnFocus
              editable={!isRenaming}
              returnKeyType="done"
              onSubmitEditing={saveConversationRename}
            />

            <View style={styles.renameActions}>
              <TouchableOpacity
                style={[
                  styles.renameCancelButton,
                  { borderColor: colors.border },
                ]}
                onPress={closeRenameModal}
                disabled={isRenaming}
              >
                <Text
                  style={[styles.renameCancelText, { color: colors.text }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.renameSaveButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: renameTitle.trim() && !isRenaming ? 1 : 0.5,
                  },
                ]}
                onPress={saveConversationRename}
                disabled={!renameTitle.trim() || isRenaming}
              >
                {isRenaming ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.renameSaveText}>Save name</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CustomAlert
        visible={customAlert.visible}
        type={customAlert.type}
        icon={customAlert.icon}
        title={customAlert.title}
        message={customAlert.message}
        confirmText={customAlert.confirmText}
        cancelText={customAlert.cancelText}
        showCancel={customAlert.showCancel}
        showClose={customAlert.showClose}
        onConfirm={handleCustomAlertConfirm}
        onCancel={handleCustomAlertCancel}
        onClose={dismissCustomAlert}
      />
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
  homeHeader: {
    minHeight: 72,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 11,
    marginTop: 24,
  },
  brandIcon: {
    width: 43,
    height: 43,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTextContainer: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 19,
    fontWeight: "800",
  },
  brandSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerButtonPlaceholder: {
    width: 42,
    height: 42,
  },
  homeScroll: {
    flex: 1,
  },
  homeContent: {
    paddingHorizontal: 17,
    paddingTop: 19,
    paddingBottom: 30,
  },
  welcomeCard: {
    overflow: "hidden",
    borderRadius: 25,
    padding: 21,
    minHeight: 244,
  },
  welcomeGlow: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(255,255,255,0.07)",
    right: -65,
    top: -65,
  },
  welcomeIcon: {
    width: 47,
    height: 47,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  welcomeEyebrow: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 8,
  },
  welcomeDescription: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
    maxWidth: 290,
  },
  welcomeButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    minHeight: 43,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginTop: 19,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  welcomeButtonText: {
    fontSize: 12,
    fontWeight: "800",
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 27,
    marginBottom: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  sectionSubtitle: {
    fontSize: 11,
    marginTop: 4,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  historyList: {
    borderWidth: 1,
    borderRadius: 17,
    paddingHorizontal: 12,
  },
  historyItem: {
    minHeight: 69,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 5,
    paddingVertical: 8,
  },
  historyOpenArea: {
    minHeight: 52,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  historyIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  historyTextContainer: {
    flex: 1,
    gap: 5,
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: "700",
  },
  historyMeta: {
    fontSize: 10,
  },
  conversationOptionsButton: {
    width: 38,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  historyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 31,
    paddingHorizontal: 20,
    gap: 10,
  },
  stateText: {
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
  },
  stateButton: {
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 3,
  },
  stateButtonText: {
    fontSize: 11,
    fontWeight: "700",
  },
  emptyHistoryIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  emptyHistoryTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  homeFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 22,
  },
  homeFooterText: {
    fontSize: 9,
  },
  chatHeader: {
    minHeight: 68,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 11,
    marginTop: 24,
  },
  chatHeaderText: {
    flex: 1,
  },
  chatHeaderTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  chatHeaderSubtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chatHeaderSubtitle: {
    fontSize: 10,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 22,
    flexGrow: 1,
  },
  chatWelcome: {
    alignItems: "center",
    paddingTop: 38,
    paddingBottom: 25,
  },
  chatWelcomeAvatar: {
    width: 57,
    height: 57,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
  },
  chatWelcomeTitle: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  chatWelcomeDescription: {
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    maxWidth: 290,
    marginTop: 8,
  },
  chatSuggestions: {
    width: "100%",
    gap: 8,
    marginTop: 24,
  },
  chatSuggestion: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  chatSuggestionText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 18,
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
    width: 31,
    height: 31,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  messageBody: {
    maxWidth: "88%",
    flexShrink: 1,
  },
  messageBubble: {
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  userBubble: {
    borderBottomRightRadius: 5,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
  },
  sourcesContainer: {
    marginTop: 12,
    gap: 8,
  },
  sourcesHeading: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 2,
  },
  sourceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 9,
    borderRadius: 14,
    borderWidth: 1,
    gap: 9,
  },
  sourceImage: {
    width: 54,
    height: 54,
    borderRadius: 9,
    backgroundColor: "#E4E2ED",
  },
  sourceImagePlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  sourceContent: {
    flex: 1,
    gap: 4,
  },
  sourceTitle: {
    fontSize: 12,
    fontWeight: "700",
  },
  sourceMeta: {
    fontSize: 10,
  },
  sourceTags: {
    fontSize: 9,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 18,
  },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderWidth: 1,
    borderRadius: 15,
  },
  loadingText: {
    fontSize: 11,
  },
  composerContainer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 8 : 11,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 1,
    borderRadius: 19,
    paddingLeft: 13,
    paddingRight: 7,
    paddingVertical: 7,
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 110,
    paddingTop: 9,
    paddingBottom: 7,
    fontSize: 14,
    lineHeight: 20,
  },
  sendButton: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 9,
    textAlign: "center",
    marginTop: 7,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 7,
  },
  retryText: {
    fontSize: 11,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.48)",
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
  },
  optionsModal: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 21,
    borderWidth: 1,
    padding: 20,
  },
  optionsModalTitle: {
    fontSize: 17,
    fontWeight: "800",
  },
  optionsModalDescription: {
    fontSize: 11,
    marginTop: 5,
    marginBottom: 17,
  },
  optionsAction: {
    minHeight: 55,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 11,
    marginBottom: 9,
    gap: 10,
  },
  optionsActionIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  optionsActionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
  },
  optionsCloseButton: {
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  optionsCloseText: {
    fontSize: 12,
    fontWeight: "700",
  },
  renameModal: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 21,
    borderWidth: 1,
    padding: 20,
  },
  renameModalTitle: {
    fontSize: 17,
    fontWeight: "800",
  },
  renameModalDescription: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },
  renameInput: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginTop: 18,
    fontSize: 13,
  },
  renameActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 9,
    marginTop: 17,
  },
  renameCancelButton: {
    minHeight: 41,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  renameCancelText: {
    fontSize: 11,
    fontWeight: "700",
  },
  renameSaveButton: {
    minWidth: 91,
    minHeight: 41,
    borderRadius: 12,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  renameSaveText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
});
