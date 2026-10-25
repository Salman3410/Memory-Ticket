import { apiRequest } from "./apiClient";

export async function getProfile(token) {
  return apiRequest("/users/me", {
    method: "GET",
    token,
  });
}

export async function updateProfile(
  token,
  { name, profileImage } = {},
) {
  const formData = new FormData();

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return {
        success: false,
        message: "Name cannot be empty.",
      };
    }

    formData.append("name", name.trim());
  }

  if (profileImage) {
    const filename =
      profileImage.split("/").pop() || `profile-${Date.now()}.jpg`;

    const extension = filename.split(".").pop()?.toLowerCase() || "jpg";

    const mimeType =
      extension === "png" ? "image/png" : "image/jpeg";

    formData.append("profileImage", {
      uri: profileImage,
      name: filename,
      type: mimeType,
    });
  }

  return apiRequest("/users/me", {
    method: "PUT",
    token,
    body: formData,
  });
}

export async function changePassword(token, currentPassword, newPassword) {
  return apiRequest("/users/change-password", {
    method: "PUT",
    token,
    body: {
      currentPassword,
      newPassword,
    },
  });
}

export async function deleteAccount(token) {
  return apiRequest("/users/me", {
    method: "DELETE",
    token,
  });
}
