import { apiRequest } from "./apiClient";

export async function askAssistant(token, question) {
  if (!token) {
    const error = new Error(
      "Please sign in to use Ask Memento.",
    );

    error.status = 401;
    error.retryable = false;

    throw error;
  }

  if (
    typeof question !== "string" ||
    !question.trim()
  ) {
    const error = new Error(
      "Please enter a question.",
    );

    error.status = 400;
    error.retryable = false;

    throw error;
  }

  const result = await apiRequest("/assistant/chat", {
    method: "POST",
    token,
    body: {
      question: question.trim(),
    },
  });

  if (!result.success) {
    const error = new Error(
      result.message || "Unable to contact Ask Memento.",
    );

    error.status = result.status || 0;
    error.code = result.data?.code;

    error.retryable =
      typeof result.data?.retryable === "boolean"
        ? result.data.retryable
        : error.status === 0 || error.status >= 500;

    error.retryAfterSeconds =
      result.data?.retryAfterSeconds || null;

    throw error;
  }

  return result;
}
