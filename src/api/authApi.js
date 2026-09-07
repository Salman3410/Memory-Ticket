import { apiRequest } from "./apiClient";

export async function registerUser(name, email, password, device = null) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      device,
    },
  });
}

export async function verifySignupOtp(email, otp) {
  return apiRequest("/auth/verify-signup-otp", {
    method: "POST",
    body: {
      email: email.trim().toLowerCase(),
      otp: otp.trim(),
    },
  });
}

export async function resendSignupOtp(email) {
  return apiRequest("/auth/resend-signup-otp", {
    method: "POST",
    body: {
      email: email.trim().toLowerCase(),
    },
  });
}

export async function loginUser(email, password, device = null) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: {
      email: email.trim().toLowerCase(),
      password,
      device,
    },
  });
}

export async function getCurrentUser(token) {
  return apiRequest("/auth/me", {
    method: "GET",
    token,
  });
}

export async function forgotPassword(email) {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: {
      email: email.trim().toLowerCase(),
    },
  });
}

export async function verifyOtp(email, otp) {
  return apiRequest("/auth/verify-otp", {
    method: "POST",
    body: {
      email: email.trim().toLowerCase(),
      otp: otp.trim(),
    },
  });
}

export async function resetPassword(email, resetToken, newPassword) {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: {
      email: email.trim().toLowerCase(),
      resetToken,
      newPassword,
    },
  });
}
