import { createContext, useEffect, useState } from "react";

import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";

import { getDeviceInfo } from "../utils/deviceInfo";

import {
  registerUser,
  verifySignupOtp as verifySignupOtpApi,
  resendSignupOtp as resendSignupOtpApi,
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
      await SplashScreen.hideAsync();
    }
  };

  const saveSession = async (authToken, userData) => {
    if (!authToken) {
      throw new Error("Authentication token is missing.");
    }

    await SecureStore.setItemAsync(TOKEN_KEY, authToken);
    setToken(authToken);
    setUser(userData);
  };

  const signup = async (name, email, password) => {
    try {
      const device = getDeviceInfo();

      const result = await registerUser(name, email, password, device);

      if (!result.success) {
        return {
          success: false,
          message: result.message || "Unable to start account creation.",
        };
      }

      return {
        success: true,
        message: result.data?.message || "Verification OTP sent successfully.",
      };
    } catch (error) {
      console.error("Signup error:", error);

      return {
        success: false,
        message: "Unable to start account creation.",
      };
    }
  };

  const verifySignupOtp = async (email, otp) => {
    try {
      const result = await verifySignupOtpApi(email, otp);

      if (!result.success) {
        return {
          success: false,
          message: result.message || "Invalid OTP.",
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
      console.error("Verify signup OTP error:", error);

      return {
        success: false,
        message: "Unable to verify OTP.",
      };
    }
  };

  const resendSignupOtp = async (email) => {
    try {
      const result = await resendSignupOtpApi(email);

      if (!result.success) {
        return {
          success: false,
          message: result.message || "Unable to resend OTP.",
        };
      }

      return {
        success: true,
        message: result.data?.message || "OTP resent successfully.",
      };
    } catch (error) {
      console.error("Resend signup OTP error:", error);

      return {
        success: false,
        message: "Unable to resend OTP.",
      };
    }
  };

  const login = async (email, password) => {
    try {
      const device = getDeviceInfo();

      const result = await loginUser(email, password, device);

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

  const forgotPassword = async (email) => {
    try {
      const result = await forgotPasswordApi(email);

      if (!result.success) {
        return {
          success: false,
          message:
            result.message || "Unable to process password reset request.",
        };
      }

      return {
        success: true,
        message: result.data?.message || "OTP sent successfully.",
        data: result.data,
      };
    } catch (error) {
      console.error("Forgot password error:", error);

      return {
        success: false,
        message: "Unable to process password reset request.",
      };
    }
  };

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
        message: result.data?.message || "OTP verified successfully.",
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

  const resetPassword = async (email, resetToken, newPassword) => {
    try {
      const result = await resetPasswordApi(email, resetToken, newPassword);

      if (!result.success) {
        return {
          success: false,
          message: result.message || "Unable to reset password.",
        };
      }

      return {
        success: true,
        message: result.data?.message || "Password reset successfully.",
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

  const updateProfile = async (updatedData) => {
    try {
      if (!token || !user) {
        return {
          success: false,
          message: "No authenticated user.",
        };
      }

      const result = await updateProfileApi(token, updatedData);

      if (!result.success) {
        return {
          success: false,
          message: result.message || "Unable to update profile.",
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

  const changePassword = async (currentPassword, newPassword) => {
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
          message: result.message || "Unable to change password.",
        };
      }

      await SecureStore.deleteItemAsync(TOKEN_KEY);

      setToken(null);
      setUser(null);

      return {
        success: true,
        message: result.data?.message || "Password changed successfully.",
      };
    } catch (error) {
      console.error("Change password error:", error);

      return {
        success: false,
        message: "Unable to change password.",
      };
    }
  };


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
          message: result.message || "Unable to delete account.",
        };
      }

      await SecureStore.deleteItemAsync(TOKEN_KEY);

      setToken(null);
      setUser(null);

      return {
        success: true,
        message: result.data?.message || "Account deleted successfully.",
      };
    } catch (error) {
      console.error("Delete account error:", error);

      return {
        success: false,
        message: "Unable to delete account.",
      };
    }
  };

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
        verifySignupOtp,
        resendSignupOtp,
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
