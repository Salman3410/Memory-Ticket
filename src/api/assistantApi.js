
import { apiRequest } from "./apiClient";

export async function askAssistant(token, question) {
  if (!token) {
    return {
      success: false,
      status: 401,
      message: "Please sign in to use Ask Memento.",
    };
  }

  if (typeof question !== "string" || !question.trim()) {
    return {
      success: false,
      status: 400,
      message: "Please enter a question.",
    };
  }

  return apiRequest("/assistant/chat", {
    method: "POST",
    token,
    body: {
      question: question.trim(),
    },
  });
}
