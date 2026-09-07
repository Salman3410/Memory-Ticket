const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

async function apiRequest(
  endpoint,
  options = {},
) {
  const {
    method = "GET",
    body,
    token,
    headers = {},
  } = options;

  const isFormData =
    typeof FormData !==
      "undefined" &&
    body instanceof FormData;

  const requestHeaders = {
    ...headers,
  };

  if (!isFormData) {
    requestHeaders[
      "Content-Type"
    ] = "application/json";
  }

  if (token) {
    requestHeaders.Authorization =
      `Bearer ${token}`;
  }

  try {
    const response =
      await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
          method,
          headers: requestHeaders,

          body: isFormData
            ? body
            : body !== undefined &&
                body !== null
              ? JSON.stringify(body)
              : undefined,
        },
      );

    let data = {};

    try {
      data =
        await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      return {
        success: false,
        status: response.status,

        message:
          data.message ||
          "Something went wrong.",

        data,
      };
    }

    return {
      success: true,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error(
      "API request error:",
      error,
    );

    return {
      success: false,
      status: 0,

      message:
        "Unable to connect to the server. Please check your internet connection.",

      error,
    };
  }
}

export {
  API_BASE_URL,
  apiRequest,
};
