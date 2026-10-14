const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || ""
)
  .trim()
  .replace(/\/+$/, "");

async function apiRequest(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    token,
    headers = {},
  } = options;

  if (!API_BASE_URL) {
    console.error(
      "[API] EXPO_PUBLIC_API_URL is missing. Check your .env file."
    );

    return {
      success: false,
      status: 0,
      message:
        "API URL is not configured. Please check your environment variables.",
    };
  }

  const normalizedEndpoint = String(endpoint).replace(/^\/+/, "");
  const url = `${API_BASE_URL}/${normalizedEndpoint}`;

  const isFormData =
    typeof FormData !== "undefined" &&
    body instanceof FormData;

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (!isFormData) {
    const hasContentType = Object.keys(requestHeaders).some(
      (key) => key.toLowerCase() === "content-type"
    );

    if (!hasContentType) {
      requestHeaders["Content-Type"] = "application/json";
    }
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let requestBody;

  if (body !== undefined && body !== null) {
    requestBody = isFormData
      ? body
      : JSON.stringify(body);
  }

  try {
    console.log(`[API] ${method.toUpperCase()} ${url}`);

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: requestBody,
    });

    const responseText = await response.text();

    let data = {};

    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        data = {
          message: responseText,
        };
      }
    }

    if (!response.ok) {
      console.error(
        `[API] ${method.toUpperCase()} ${url} failed:`,
        response.status,
        data
      );

      return {
        success: false,
        status: response.status,
        message:
          data.message ||
          data.error ||
          `Request failed with status ${response.status}.`,
        data,
      };
    }

    return {
      success: true,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("[API] Network request failed.");
    console.error("[API] Request URL:", url);
    console.error("[API] Error:", error);

    return {
      success: false,
      status: 0,
      message:
        "Unable to connect to the server. Check your API URL, internet connection, and server status.",
      error,
    };
  }
}

export {
  API_BASE_URL,
  apiRequest,
};