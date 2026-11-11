
import { apiRequest } from "./apiClient";

function createApiError(result, fallbackMessage) {
  const data = result?.data || {};

  const error = new Error(
    data.message ||
      result?.message ||
      fallbackMessage
  );

  error.status =
    result?.status ||
    data.statusCode ||
    0;

  error.code =
    data.code ||
    data.errorCode ||
    null;

  error.retryable =
    typeof data.retryable === "boolean"
      ? data.retryable
      : error.status === 0 ||
        error.status >= 500;

  error.retryAfterSeconds =
    data.retryAfterSeconds || null;

  return error;
}

function validateToken(token) {
  if (!token) {
    const error = new Error(
      "Please sign in to use Jako AI."
    );

    error.status = 401;
    error.retryable = false;

    throw error;
  }
}

function buildQuery(params = {}) {
  const entries = Object.entries(params).filter(
    ([, value]) =>
      value !== undefined &&
      value !== null &&
      value !== ""
  );

  if (!entries.length) return "";

  const query = entries
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  return `?${query}`;
}

async function assistantRequest(
  token,
  path,
  {
    method = "GET",
    body,
  } = {}
) {
  validateToken(token);

  const options = {
    method,
    token,
  };

  if (body !== undefined) {
    options.body = body;
  }

  const result = await apiRequest(path, options);

  if (!result?.success) {
    throw createApiError(
      result,
      "Unable to complete your Jako AI request."
    );
  }

  return result;
}

export async function askAssistant(
  token,
  question,
  options = {}
) {
  validateToken(token);

  if (
    typeof question !== "string" ||
    !question.trim()
  ) {
    const error = new Error("Please enter a question.");
    error.status = 400;
    error.retryable = false;
    throw error;
  }

  const conversationId =
    typeof options.conversationId === "string"
      ? options.conversationId.trim()
      : "";

  const body = {
    question: question.trim(),
  };

  if (conversationId) {
    body.conversationId = conversationId;
  }

  return assistantRequest(
    token,
    "/assistant/chat",
    {
      method: "POST",
      body,
    }
  );
}

export async function createAssistantConversation(
  token,
  options = {}
) {
  const title =
    typeof options.title === "string"
      ? options.title.trim()
      : "New conversation";

  if (title.length > 120) {
    const error = new Error(
      "Conversation title cannot exceed 120 characters."
    );

    error.status = 400;
    error.retryable = false;
    throw error;
  }

  return assistantRequest(
    token,
    "/assistant/conversations",
    {
      method: "POST",
      body: {
        title: title || "New conversation",
      },
    }
  );
}

export async function getAssistantConversations(
  token,
  options = {}
) {
  const query = buildQuery({
    status: options.status || "active",
    limit: options.limit || 20,
    before: options.before,
  });

  return assistantRequest(
    token,
    `/assistant/conversations${query}`
  );
}

export async function getAssistantConversation(
  token,
  conversationId
) {
  if (
    typeof conversationId !== "string" ||
    !conversationId.trim()
  ) {
    const error = new Error(
      "A valid conversation ID is required."
    );

    error.status = 400;
    error.retryable = false;
    throw error;
  }

  return assistantRequest(
    token,
    `/assistant/conversations/${encodeURIComponent(
      conversationId.trim()
    )}`
  );
}

export async function getAssistantMessages(
  token,
  conversationId,
  options = {}
) {
  if (
    typeof conversationId !== "string" ||
    !conversationId.trim()
  ) {
    const error = new Error(
      "A valid conversation ID is required."
    );

    error.status = 400;
    error.retryable = false;
    throw error;
  }

  const query = buildQuery({
    limit: options.limit || 50,
    beforeSequence: options.beforeSequence,
  });

  return assistantRequest(
    token,
    `/assistant/conversations/${encodeURIComponent(
      conversationId.trim()
    )}/messages${query}`
  );
}

export async function updateAssistantConversation(
  token,
  conversationId,
  updates = {}
) {
  validateToken(token);

  if (
    typeof conversationId !== "string" ||
    !conversationId.trim()
  ) {
    const error = new Error(
      "A valid conversation ID is required."
    );

    error.status = 400;
    error.retryable = false;
    throw error;
  }

  const title =
    typeof updates.title === "string"
      ? updates.title.trim()
      : "";

  if (!title) {
    const error = new Error(
      "Conversation title cannot be empty."
    );

    error.status = 400;
    error.retryable = false;
    throw error;
  }

  if (title.length > 120) {
    const error = new Error(
      "Conversation title cannot exceed 120 characters."
    );

    error.status = 400;
    error.retryable = false;
    throw error;
  }

  return assistantRequest(
    token,
    `/assistant/conversations/${encodeURIComponent(
      conversationId.trim()
    )}`,
    {
      method: "PATCH",
      body: { title },
    }
  );
}

export async function archiveAssistantConversation(
  token,
  conversationId
) {
  if (
    typeof conversationId !== "string" ||
    !conversationId.trim()
  ) {
    const error = new Error(
      "A valid conversation ID is required."
    );

    error.status = 400;
    error.retryable = false;
    throw error;
  }

  return assistantRequest(
    token,
    `/assistant/conversations/${encodeURIComponent(
      conversationId.trim()
    )}/archive`,
    {
      method: "PATCH",
    }
  );
}

export async function deleteAssistantConversation(
  token,
  conversationId
) {
  if (
    typeof conversationId !== "string" ||
    !conversationId.trim()
  ) {
    const error = new Error(
      "A valid conversation ID is required."
    );

    error.status = 400;
    error.retryable = false;
    throw error;
  }

  return assistantRequest(
    token,
    `/assistant/conversations/${encodeURIComponent(
      conversationId.trim()
    )}`,
    {
      method: "DELETE",
    }
  );
}
