import { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { getDeviceInfo } from "../utils/deviceInfo";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword as forgotPasswordApi,
  verifyOtp as verifyOtpApi,
  resetPassword as resetPasswordApi,
} from "../api/authApi";

import {
  updateProfile as updateProfileApi,
  changePassword as changePasswordApi,
  deleteAccount as deleteAccountApi,
} from "../api/userApi";

export const AuthContext = createContext();

const TOKEN_KEY = "memory_ticket_auth_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  /**
   * Restore authenticated session
   * when the application starts.
   */
  const restoreSession = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);

      if (!storedToken) {
        return;
      }

      const result = await getCurrentUser(storedToken);

      if (!result.success) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setToken(null);
        setUser(null);
        return;
      }

      setToken(storedToken);
      setUser(result.data.user);
    } catch (error) {
      console.error("Restore session error:", error);

      await SecureStore.deleteItemAsync(TOKEN_KEY);

      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save authenticated session.
   */
  const saveSession = async (authToken, userData) => {
    if (!authToken) {
      throw new Error("Authentication token is missing.");
    }

    await SecureStore.setItemAsync(TOKEN_KEY, authToken);

    setToken(authToken);
    setUser(userData);
  };

  /**
   * Register.
   */
  const signup = async (name, email, password) => {
    try {
      const device = getDeviceInfo();

      const result = await registerUser(
        name,
        email,
        password,
        device,
      );

      if (!result.success) {
        return {
          success: false,
          message: result.message || "Unable to create account.",
        };
      }

      const { token: authToken, user: newUser } = result.data;

      if (!authToken || !newUser) {
        return {
          success: false,
          message: "Invalid response from server.",
        };
      }

      await saveSession(authToken, newUser);

      return {
        success: true,
        user: newUser,
      };
    } catch (error) {
      console.error("Signup error:", error);

      return {
        success: false,
        message: "Unable to create account.",
      };
    }
  };

  /**
   * Login.
   */
  const login = async (email, password) => {
    try {
      const device = getDeviceInfo();

      const result = await loginUser(
        email,
        password,
        device,
      );

      if (!result.success) {
        return {
          success: false,
          message: result.message || "Unable to login.",
        };
      }

      const { token: authToken, user: loggedInUser } = result.data;

      if (!authToken || !loggedInUser) {
        return {
          success: false,
          message: "Invalid response from server.",
        };
      }

      await saveSession(authToken, loggedInUser);

      return {
        success: true,
        user: loggedInUser,
      };
    } catch (error) {
      console.error("Login error:", error);

      return {
        success: false,
        message: "Unable to login.",
      };
    }
  };

  /**
   * Forgot password.
   *
   * Sends a password-reset OTP to the user's email.
   */
  const forgotPassword = async (email) => {
    try {
      const result = await forgotPasswordApi(email);

      if (!result.success) {
        return {
          success: false,
          message:
            result.message ||
            "Unable to process password reset request.",
        };
      }

      return {
        success: true,
        message:
          result.data?.message ||
          "OTP sent successfully.",
        data: result.data,
      };
    } catch (error) {
      console.error("Forgot password error:", error);

      return {
        success: false,
        message:
          "Unable to process password reset request.",
      };
    }
  };

  /**
   * Verify password-reset OTP.
   */
  const verifyOtp = async (email, otp) => {
    try {
      const result = await verifyOtpApi(email, otp);

      if (!result.success) {
        return {
          success: false,
          message: result.message || "Invalid OTP.",
        };
      }

      return {
        success: true,
        message:
          result.data?.message ||
          "OTP verified successfully.",
        data: result.data,
      };
    } catch (error) {
      console.error("Verify OTP error:", error);

      return {
        success: false,
        message: "Unable to verify OTP.",
      };
    }
  };

  /**
   * Reset password after OTP verification.
   */
  const resetPassword = async (
    email,
    resetToken,
    newPassword,
  ) => {
    try {
      const result = await resetPasswordApi(
        email,
        resetToken,
        newPassword,
      );

      if (!result.success) {
        return {
          success: false,
          message:
            result.message ||
            "Unable to reset password.",
        };
      }

      return {
        success: true,
        message:
          result.data?.message ||
          "Password reset successfully.",
        data: result.data,
      };
    } catch (error) {
      console.error("Reset password error:", error);

      return {
        success: false,
        message: "Unable to reset password.",
      };
    }
  };

  /**
   * Update profile.
   */
  const updateProfile = async (updatedData) => {
    try {
      if (!token || !user) {
        return {
          success: false,
          message: "No authenticated user.",
        };
      }

      const result = await updateProfileApi(
        token,
        updatedData,
      );

      if (!result.success) {
        return {
          success: false,
          message:
            result.message ||
            "Unable to update profile.",
        };
      }

      const updatedUser = result.data.user;

      setUser(updatedUser);

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      console.error("Update profile error:", error);

      return {
        success: false,
        message: "Unable to update profile.",
      };
    }
  };

  /**
   * Change password.
   */
  const changePassword = async (
    currentPassword,
    newPassword,
  ) => {
    try {
      if (!token || !user) {
        return {
          success: false,
          message: "No authenticated user.",
        };
      }

      const result = await changePasswordApi(
        token,
        currentPassword,
        newPassword,
      );

      if (!result.success) {
        return {
          success: false,
          message:
            result.message ||
            "Unable to change password.",
        };
      }

      // Backend increments tokenVersion,
      // so the current JWT is no longer valid.
      await SecureStore.deleteItemAsync(TOKEN_KEY);

      setToken(null);
      setUser(null);

      return {
        success: true,
        message:
          result.data?.message ||
          "Password changed successfully.",
      };
    } catch (error) {
      console.error("Change password error:", error);

      return {
        success: false,
        message: "Unable to change password.",
      };
    }
  };

  /**
   * Delete account.
   */
  const deleteAccount = async () => {
    try {
      if (!token || !user) {
        return {
          success: false,
          message: "No authenticated user.",
        };
      }

      const result = await deleteAccountApi(token);

      if (!result.success) {
        return {
          success: false,
          message:
            result.message ||
            "Unable to delete account.",
        };
      }

      await SecureStore.deleteItemAsync(TOKEN_KEY);

      setToken(null);
      setUser(null);

      return {
        success: true,
        message:
          result.data?.message ||
          "Account deleted successfully.",
      };
    } catch (error) {
      console.error("Delete account error:", error);

      return {
        success: false,
        message: "Unable to delete account.",
      };
    }
  };

  /**
   * Logout.
   */
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);

      setToken(null);
      setUser(null);

      return {
        success: true,
      };
    } catch (error) {
      console.error("Logout error:", error);

      return {
        success: false,
        message: "Unable to logout.",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,

        signup,
        login,
        logout,

        updateProfile,
        changePassword,
        deleteAccount,

        forgotPassword,
        verifyOtp,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

